import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  ArrowRight, 
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  RotateCcw,
  Sparkles,
  Eye,
  Info,
  Tag,
  Flame,
  Zap
} from 'lucide-react';
import { Product, BrandName, CategoryName, CategoryItem, BrandItem, GenderType } from '../types';
import { PRODUCTS } from '../data';
import { isProductForGender, isAccessoryCategory, GENDER_OPTIONS } from '../utils/categoryHelpers';
import { useLanguage } from '../utils/translations';

interface ProductListingPageProps {
  products?: Product[];
  categories?: CategoryItem[];
  brands?: BrandItem[];
  initialBrand: 'All' | BrandName;
  initialCategory: 'All' | CategoryName;
  initialGender?: 'All' | GenderType;
  initialSearchQuery: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onBackToHome: () => void;
}

// Define the static filter lists
const BRANDS_LIST: BrandName[] = ['Nike', 'Adidas', 'Puma', 'Converse'];
const CATEGORIES_LIST: CategoryName[] = ['Sneaker', 'Running', 'Football', 'Lifestyle', 'Training'];
const PRICE_RANGES = [
  { id: 'under_1m', label: 'Dưới 1.000.000 VNĐ', min: 0, max: 1000000 },
  { id: '1m_2m', label: '1.000.000 - 2.000.000 VNĐ', min: 1000000, max: 2000000 },
  { id: '2m_3m', label: '2.000.000 - 3.000.000 VNĐ', min: 2000000, max: 3000000 },
  { id: 'above_3m', label: 'Trên 3.000.000 VNĐ', min: 3000000, max: 999000000 },
];

/**
 * Priority rank for sorting products:
 * SHOES (< 100):
 *   1. Sneaker
 *   2. Running / Giày chạy bộ
 *   3. Football / Giày bóng đá
 *   4. Lifestyle / Giày lifestyle
 *   5. Training / Giày tập luyện
 *   6. Giày thể thao (khác)
 *   7. Các loại giày khác
 * ACCESSORIES (>= 100):
 *   101. Dây giày
 *   102. Tất / Vớ
 *   103. Lót giày
 *   104. Túi đựng giày
 *   105. Dụng cụ vệ sinh giày
 *   106. Phụ kiện khác
 */
const getProductCategoryRank = (product: Product): number => {
  const cat = (product.category || '').toLowerCase().trim();
  const name = (product.name || '').toLowerCase().trim();
  const desc = (product.description || '').toLowerCase();
  const combined = `${cat} ${name} ${desc}`;

  const isAcc = isAccessoryCategory(product.category) || 
    combined.includes('phụ kiện') || 
    combined.includes('dây giày') || 
    combined.includes('tất') || 
    combined.includes('vớ') || 
    combined.includes('lót giày') || 
    combined.includes('túi đựng giày') || 
    combined.includes('vệ sinh giày') || 
    combined.includes('dung dịch vệ sinh');

  if (!isAcc) {
    // 1. Sneaker
    if (cat === 'sneaker' || cat.includes('sneaker') || name.includes('sneaker')) return 1;
    // 2. Running / Giày chạy bộ
    if (cat === 'running' || cat.includes('running') || cat.includes('chạy bộ') || cat.includes('chay bo') || name.includes('running') || name.includes('chạy bộ')) return 2;
    // 3. Football / Giày bóng đá
    if (cat === 'football' || cat.includes('football') || cat.includes('bóng đá') || cat.includes('bong da') || cat.includes('đá bóng') || name.includes('football') || name.includes('bóng đá') || name.includes('vapor') || name.includes('predator') || name.includes('future')) return 3;
    // 4. Lifestyle / Giày lifestyle
    if (cat === 'lifestyle' || cat.includes('lifestyle') || name.includes('lifestyle')) return 4;
    // 5. Training / Giày tập luyện
    if (cat === 'training' || cat.includes('training') || cat.includes('gym') || cat.includes('tập luyện') || name.includes('training')) return 5;
    // 6. Giày thể thao (khác)
    if (cat.includes('thể thao') || cat.includes('the thao') || name.includes('thể thao')) return 6;
    // 7. Các loại giày khác
    return 7;
  } else {
    // Phụ kiện:
    // 101. Dây giày
    if (cat.includes('dây') || cat.includes('day') || cat.includes('lace') || name.includes('dây giày') || name.includes('dây')) return 101;
    // 102. Tất / Vớ
    if (cat.includes('tất') || cat.includes('vớ') || cat.includes('tat') || cat.includes('vo') || cat.includes('sock') || name.includes('tất') || name.includes('vớ')) return 102;
    // 103. Lót giày
    if (cat.includes('lót') || cat.includes('lot') || cat.includes('insole') || name.includes('lót giày') || name.includes('lót')) return 103;
    // 104. Túi đựng giày
    if (cat.includes('túi') || cat.includes('tui') || cat.includes('bag') || name.includes('túi')) return 104;
    // 105. Dụng cụ vệ sinh giày
    if (cat.includes('vệ sinh') || cat.includes('ve sinh') || cat.includes('cleaner') || cat.includes('xi') || cat.includes('crep') || cat.includes('xịt') || cat.includes('bọt') || name.includes('vệ sinh') || name.includes('lau giày') || name.includes('bọt làm sạch')) return 105;
    // 106. Phụ kiện khác
    return 106;
  }
};

/**
 * Helper to select the cleanest product image:
 * If an image file has promotional text ("MỚI", "NEW", "NEW ARRIVAL") embedded,
 * and the product has an alternative cleaner image in `images`, prefer the clean image.
 * If only 1 image exists, keep the original image (no fake images, no cropping/CSS hacks).
 */
const getCleanProductImage = (product: Product): string => {
  if (!product.images || product.images.length <= 1) {
    return product.image;
  }

  const isAdTextImg = (url: string): boolean => {
    const lower = url.toLowerCase();
    return (
      lower.includes('new-arrival') ||
      lower.includes('new_arrival') ||
      lower.includes('badge') ||
      lower.includes('promo') ||
      lower.includes('banner') ||
      lower.includes('moi_') ||
      lower.includes('-moi-') ||
      lower.includes('text_')
    );
  };

  if (isAdTextImg(product.image)) {
    const cleanImg = product.images.find(img => !isAdTextImg(img));
    if (cleanImg) return cleanImg;
  }

  return product.image;
};

// Helper to determine if a product is in stock
const isProductInStock = (product: Product): boolean => {
  if (product.id === 'nike-phantom-gx' || product.id === 'puma-velocity-nitro') {
    return false;
  }
  return true;
};

export default function ProductListingPage({
  products = PRODUCTS,
  categories,
  brands,
  initialBrand,
  initialCategory,
  initialGender = 'All',
  initialSearchQuery,
  onQuickView,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onBackToHome
}: ProductListingPageProps) {
  const { t, language } = useLanguage();

  // --- 5 Core Filter states ---
  // 1. Danh mục
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => 
    initialCategory !== 'All' ? [initialCategory] : []
  );
  // 2. Thương hiệu
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => 
    initialBrand !== 'All' ? [initialBrand] : []
  );
  // 3. Đối tượng (Nam / Nữ / Trẻ em)
  const [selectedGenders, setSelectedGenders] = useState<GenderType[]>(() =>
    initialGender !== 'All' ? [initialGender] : []
  );
  // 4. Khoảng giá
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  // 5. Trạng thái (Mới / Khuyến mãi / HOT)
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [onlyPromotions, setOnlyPromotions] = useState<boolean>(false);
  const [onlyHot, setOnlyHot] = useState<boolean>(false);
  
  const [searchVal, setSearchVal] = useState(initialSearchQuery);
  const [sortOption, setSortOption] = useState<'newest' | 'bestseller' | 'price_asc' | 'price_desc' | 'name_az'>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Responsive sidebar toggles
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dynamic available categories from Admin props
  const activeCategoriesList = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.filter((c) => c.status === 'Đang hoạt động' && !c.isDeleted);
    }
    return CATEGORIES_LIST.map((name) => ({
      id: name,
      name,
      slug: name.toLowerCase(),
      group: isAccessoryCategory(name) ? ('accessories' as const) : ('shoes' as const),
      status: 'Đang hoạt động' as const
    }));
  }, [categories]);

  // Dynamic available brands from Admin props
  const activeBrandsList = useMemo(() => {
    if (brands && brands.length > 0) {
      return brands.filter((b) => b.status === 'Đang hoạt động' && !b.isDeleted).map((b) => b.name);
    }
    return BRANDS_LIST;
  }, [brands]);

  // Sync state if initial props change
  useEffect(() => {
    setSelectedBrands(initialBrand !== 'All' ? [initialBrand] : []);
    setCurrentPage(1);
  }, [initialBrand]);

  useEffect(() => {
    setSelectedCategories(initialCategory !== 'All' ? [initialCategory] : []);
    setCurrentPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedGenders(initialGender !== 'All' ? [initialGender] : []);
    setCurrentPage(1);
  }, [initialGender]);

  useEffect(() => {
    setSearchVal(initialSearchQuery);
    setCurrentPage(1);
  }, [initialSearchQuery]);

  // Format price utility
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Toggle helpers
  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleToggleGender = (gender: GenderType) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
    setCurrentPage(1);
  };

  const handleTogglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId) ? prev.filter(r => r !== rangeId) : [...prev, rangeId]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedPriceRanges([]);
    setOnlyNew(false);
    setOnlyPromotions(false);
    setOnlyHot(false);
    setSearchVal('');
    setCurrentPage(1);
  };

  // Total active filter count
  const activeFiltersCount = (
    selectedCategories.length +
    selectedBrands.length +
    selectedGenders.length +
    selectedPriceRanges.length +
    (onlyNew ? 1 : 0) +
    (onlyPromotions ? 1 : 0) +
    (onlyHot ? 1 : 0)
  );

  // --- Filtering & Sorting Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 0. Bỏ qua sản phẩm đã xóa hoặc bị ẩn / ngừng kinh doanh
      if (product.isDeleted || product.status === 'Đã xóa' || product.status === 'Ẩn' || product.status === 'Ngừng kinh doanh') {
        return false;
      }

      // 1. Search Query
      if (searchVal.trim() !== '') {
        const query = searchVal.toLowerCase();
        const matchesName = (product.name || '').toLowerCase().includes(query);
        const matchesBrand = (product.brand || '').toLowerCase().includes(query);
        const matchesCategory = (product.category || '').toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Danh mục Filter
      if (selectedCategories.length > 0) {
        const productCategoryNormalized = (product.category || '').trim().toLowerCase();
        const matches = selectedCategories.some((sc) => {
          const scNorm = sc.trim().toLowerCase();
          if (scNorm === productCategoryNormalized) return true;

          // Flexible matching for 'Giày thể thao' (Sports / Running / Football / Training)
          if (scNorm.includes('thể thao') || scNorm === 'sports-shoes' || scNorm === 'sport') {
            if (
              productCategoryNormalized.includes('thể thao') ||
              productCategoryNormalized.includes('chạy') ||
              productCategoryNormalized === 'running' ||
              productCategoryNormalized.includes('bóng đá') ||
              productCategoryNormalized === 'football' ||
              productCategoryNormalized === 'training' ||
              productCategoryNormalized.includes('tập luyện') ||
              product.name.toLowerCase().includes('nitro') ||
              product.name.toLowerCase().includes('running') ||
              product.name.toLowerCase().includes('metcon') ||
              product.name.toLowerCase().includes('dropset')
            ) {
              return true;
            }
          }

          // Flexible matching for 'Training' vs 'Tập luyện' vs 'Gym'
          if (scNorm === 'training' || scNorm.includes('training') || scNorm.includes('tập luyện') || scNorm.includes('gym')) {
            if (
              productCategoryNormalized.includes('training') || 
              productCategoryNormalized.includes('tập luyện') || 
              product.name.toLowerCase().includes('metcon') || 
              product.name.toLowerCase().includes('dropset')
            ) {
              return true;
            }
          }

          // Flexible matching for 'Tất' vs 'Tất / Vớ' vs 'Vớ'
          if ((scNorm.includes('tất') || scNorm.includes('vớ')) && 
              (productCategoryNormalized.includes('tất') || productCategoryNormalized.includes('vớ'))) {
            return true;
          }
          // Flexible matching for 'Giày chạy bộ' vs 'Running'
          if ((scNorm.includes('chạy') || scNorm === 'running') && 
              (productCategoryNormalized.includes('chạy') || productCategoryNormalized === 'running')) {
            return true;
          }
          // Flexible matching for 'Giày bóng đá' vs 'Football'
          if ((scNorm.includes('bóng đá') || scNorm === 'football') && 
              (productCategoryNormalized.includes('bóng đá') || productCategoryNormalized === 'football')) {
            return true;
          }
          // Flexible matching for 'Giày lifestyle' vs 'Lifestyle'
          if (scNorm.includes('lifestyle') && productCategoryNormalized.includes('lifestyle')) {
            return true;
          }
          // Flexible matching for 'Dây giày'
          if ((scNorm.includes('dây') || scNorm === 'shoelaces') && (productCategoryNormalized.includes('dây') || productCategoryNormalized === 'shoelaces')) {
            return true;
          }
          // Flexible matching for 'Lót giày'
          if ((scNorm.includes('lót') || scNorm === 'insoles') && (productCategoryNormalized.includes('lót') || productCategoryNormalized === 'insoles')) {
            return true;
          }
          // Flexible matching for 'Túi đựng giày'
          if ((scNorm.includes('túi') || scNorm === 'shoe-bags') && (productCategoryNormalized.includes('túi') || productCategoryNormalized === 'shoe-bags')) {
            return true;
          }
          // Flexible matching for 'Vệ sinh'
          if (scNorm.includes('vệ sinh') && productCategoryNormalized.includes('vệ sinh')) {
            return true;
          }
          // Flexible matching for 'Phụ kiện khác'
          if ((scNorm.includes('khác') || scNorm === 'other-accessories') && (productCategoryNormalized.includes('khác') || productCategoryNormalized === 'other-accessories')) {
            return true;
          }
          // Flexible matching for 'Phụ kiện'
          if ((scNorm === 'phụ kiện' || scNorm === 'phu kien' || scNorm.includes('phụ kiện')) && isAccessoryCategory(product.category)) {
            return true;
          }
          return false;
        });
        if (!matches) return false;
      }

      // 3. Thương hiệu Filter
      if (selectedBrands.length > 0) {
        if (!product.brand || !selectedBrands.includes(product.brand)) {
          return false;
        }
      }

      // 4. Đối tượng (Gender) Filter
      if (selectedGenders.length > 0) {
        const matchGender = selectedGenders.some((g) => isProductForGender(product, g));
        if (!matchGender) return false;
      }

      // 5. Khoảng giá Filter
      if (selectedPriceRanges.length > 0) {
        const matchPrice = selectedPriceRanges.some(rangeId => {
          const range = PRICE_RANGES.find(r => r.id === rangeId);
          if (!range) return false;
          return product.price >= range.min && product.price <= range.max;
        });
        if (!matchPrice) return false;
      }

      // 6. Trạng thái Filter (Mới / Khuyến mãi / HOT)
      if (onlyNew && !product.isNew) return false;
      if (onlyPromotions && !product.isPromotion) return false;
      if (onlyHot && !product.isHot) return false;

      return true;
    }).sort((a, b) => {
      const rankA = getProductCategoryRank(a);
      const rankB = getProductCategoryRank(b);

      const isShoeA = rankA < 100;
      const isShoeB = rankB < 100;

      // 1. RULE TỐI THƯỢNG: Luôn ưu tiên toàn bộ sản phẩm GIÀY trước, PHỤ KIỆN sau
      if (isShoeA && !isShoeB) return -1;
      if (!isShoeA && isShoeB) return 1;

      // 2. Khi ở chế độ mặc định (Mới nhất / newest):
      // Ưu tiên theo phân cấp danh mục Giày: Sneaker -> Running -> Football -> Training -> Lifestyle -> Khác
      // Sau đó đến Phụ kiện: Dây giày -> Tất/Vớ -> Lót giày -> Túi đựng -> Vệ sinh -> Khác
      if (sortOption === 'newest') {
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }

      // 3. Khi người dùng chọn tiêu chí sắp xếp cụ thể (Bán chạy, Giá tăng/giảm, Tên A-Z):
      // Vẫn giữ nguyên phân tách Giày trước - Phụ kiện sau, và áp dụng tiêu chí sắp xếp trong từng nhóm
      switch (sortOption) {
        case 'bestseller':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_az':
          return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
        default:
          return 0;
      }
    });
  }, [
    products,
    searchVal,
    selectedCategories,
    selectedBrands,
    selectedGenders,
    selectedPriceRanges,
    onlyNew,
    onlyPromotions,
    onlyHot,
    sortOption
  ]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Smart pagination range with ellipsis for clean UI
  const paginationRange = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  // Dynamic breadcrumbs based on active selection
  const breadcrumbText = useMemo(() => {
    const parts = [
      { label: 'Trang chủ', action: onBackToHome },
      { label: 'Sản phẩm', action: handleClearFilters }
    ];
    if (selectedGenders.length === 1) {
      parts.push({ label: `Giày ${selectedGenders[0]}`, action: () => {} });
    }
    if (selectedBrands.length === 1) {
      parts.push({ label: selectedBrands[0], action: () => {} });
    }
    if (selectedCategories.length === 1) {
      parts.push({ label: selectedCategories[0], action: () => {} });
    }
    return parts;
  }, [selectedGenders, selectedBrands, selectedCategories, onBackToHome]);

  // Dynamic Title Header
  const dynamicHeaderTitle = useMemo(() => {
    if (selectedGenders.length === 1 && selectedCategories.length === 0) {
      return `GIÀY ${selectedGenders[0].toUpperCase()}`;
    }
    if (selectedCategories.length === 1) {
      return `${selectedCategories[0].toUpperCase()}`;
    }
    if (selectedBrands.length === 1) {
      return `THƯƠNG HIỆU ${selectedBrands[0].toUpperCase()}`;
    }
    if (onlyPromotions) {
      return 'SẢN PHẨM KHUYẾN MÃI';
    }
    return 'THẾ GIỚI GIÀY CHÍNH HÃNG';
  }, [selectedGenders, selectedCategories, selectedBrands, onlyPromotions]);

  const dynamicHeaderSubtitle = useMemo(() => {
    if (selectedGenders.length === 1) {
      return `Bộ sưu tập giày thể thao và lifestyle dành riêng cho ${selectedGenders[0].toLowerCase()} tại K-NICKS.`;
    }
    if (selectedCategories.length === 1) {
      return `Khám phá các sản phẩm ${selectedCategories[0].toLowerCase()} chất lượng cao, bền bỉ và chuẩn phong cách.`;
    }
    return 'Trải nghiệm bộ sưu tập giày thể thao và phụ kiện cao cấp chính hãng từ Nike, Adidas, Puma và Converse. Công nghệ tối ưu, thiết kế đỉnh cao.';
  }, [selectedGenders, selectedCategories]);

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner header */}
        <div className="relative mb-8 rounded-[32px] overflow-hidden bg-black text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-950/85 to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />
          
          <div className="relative z-10 text-left space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-400">
              <Sparkles size={10} className="animate-spin" />
              <span>Premium Sneakers & Accessories</span>
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              {dynamicHeaderTitle}
            </h1>
            <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
              {dynamicHeaderSubtitle}
            </p>
          </div>
          
          <div className="relative z-10 hidden md:block">
            <div className="relative h-24 w-40 flex items-center justify-center opacity-85">
              <span className="text-[120px] font-black tracking-tighter text-white/5 select-none absolute -top-14 left-0">SHOES</span>
              <span className="text-2xl font-black tracking-widest uppercase border-y-2 border-white/20 py-2">K-NICKS</span>
            </div>
          </div>
        </div>

        {/* 1. Thanh điều hướng (Breadcrumb) */}
        <nav className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6 select-none bg-white py-3.5 px-6 rounded-2xl border border-neutral-100 shadow-xs overflow-x-auto no-scrollbar">
          {breadcrumbText.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={10} className="text-neutral-300 shrink-0" />}
              <button 
                onClick={item.action} 
                className={`hover:text-black transition-colors shrink-0 ${idx === breadcrumbText.length - 1 ? 'text-black font-extrabold' : 'cursor-pointer'}`}
                disabled={idx === breadcrumbText.length - 1}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* 2. Thanh tìm kiếm */}
        <div className="mb-8 bg-white p-4 rounded-3xl border border-neutral-100 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, thương hiệu, danh mục..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/70 py-3 pl-11 pr-10 text-xs font-semibold outline-none transition-all focus:border-black focus:bg-white"
            />
            {searchVal && (
              <button 
                onClick={() => {
                  setSearchVal('');
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Tablet/Mobile filter toggle trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-black text-neutral-900 hover:border-black cursor-pointer shadow-xs transition-all"
            >
              <SlidersHorizontal size={14} className="text-amber-500" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* Reset Filters button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 rounded-2xl bg-neutral-100/80 border border-neutral-200 px-3.5 py-2.5 text-xs font-black text-neutral-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Xóa bộ lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Outer Shell Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* =========================================================
              3. Bộ lọc sản phẩm (Sidebar Filter) - Desktop Sidebar
             ========================================================= */}
          <aside className="hidden md:block md:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs sticky top-28 space-y-5 max-h-[84vh] overflow-y-auto scrollbar-thin">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-amber-500" />
                  <span>BỘ LỌC SẢN PHẨM</span>
                </span>
                {activeFiltersCount > 0 && (
                  <span className="text-[10px] font-black bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full">
                    {activeFiltersCount} đang chọn
                  </span>
                )}
              </div>

              {/* 1. DANH MỤC */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  1. Danh mục
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {activeCategoriesList.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.name);
                    return (
                      <label 
                        key={cat.id || cat.name} 
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none group ${
                          isChecked ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            onClick={() => handleToggleCategory(cat.name)}
                            className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                              isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-300 bg-white group-hover:border-neutral-500'
                            }`}
                          >
                            {isChecked && <Check size={11} className="stroke-[3]" />}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. THƯƠNG HIỆU */}
              <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  2. Thương hiệu
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {activeBrandsList.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleToggleBrand(brand)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isChecked 
                            ? 'bg-black text-white shadow-xs' 
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-100'
                        }`}
                      >
                        <span>{brand}</span>
                        {isChecked && <Check size={11} className="text-amber-400 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. ĐỐI TƯỢNG (Nam / Nữ / Trẻ em) */}
              <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  3. Đối tượng
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {GENDER_OPTIONS.map((g) => {
                    const isChecked = selectedGenders.includes(g.name as GenderType);
                    return (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => handleToggleGender(g.name as GenderType)}
                        className={`py-2 px-1 rounded-xl text-xs font-black text-center transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-black text-white shadow-xs' 
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-100'
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. KHOẢNG GIÁ */}
              <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  4. Khoảng giá
                </h4>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => {
                    const isChecked = selectedPriceRanges.includes(range.id);
                    return (
                      <label 
                        key={range.id} 
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none group ${
                          isChecked ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div 
                          onClick={() => handleTogglePriceRange(range.id)}
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-300 bg-white group-hover:border-neutral-500'
                          }`}
                        >
                          {isChecked && <Check size={11} className="stroke-[3]" />}
                        </div>
                        <span className="text-[11px]">{range.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. TRẠNG THÁI (Mới / Khuyến mãi / HOT) */}
              <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                  5. Trạng thái
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* MỚI */}
                  <button
                    type="button"
                    onClick={() => {
                      setOnlyNew(prev => !prev);
                      setCurrentPage(1);
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      onlyNew 
                        ? 'bg-black text-white ring-2 ring-neutral-900' 
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-100'
                    }`}
                  >
                    <Zap size={13} className={onlyNew ? 'text-amber-400' : 'text-blue-500'} />
                    <span>Mới</span>
                  </button>

                  {/* KHUYẾN MÃI */}
                  <button
                    type="button"
                    onClick={() => {
                      setOnlyPromotions(prev => !prev);
                      setCurrentPage(1);
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      onlyPromotions 
                        ? 'bg-black text-white ring-2 ring-neutral-900' 
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-100'
                    }`}
                  >
                    <Tag size={13} className={onlyPromotions ? 'text-amber-400' : 'text-[#BA0C2F]'} />
                    <span>Giảm giá</span>
                  </button>

                  {/* HOT */}
                  <button
                    type="button"
                    onClick={() => {
                      setOnlyHot(prev => !prev);
                      setCurrentPage(1);
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      onlyHot 
                        ? 'bg-black text-white ring-2 ring-neutral-900' 
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-100'
                    }`}
                  >
                    <Flame size={13} className={onlyHot ? 'text-amber-400' : 'text-amber-500'} />
                    <span>HOT</span>
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS: [ Xóa bộ lọc ] [ Áp dụng ] */}
              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase transition-all cursor-pointer ${
                    activeFiltersCount > 0
                      ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                  }`}
                >
                  Xóa bộ lọc
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="flex-1 rounded-xl bg-black text-white py-2.5 text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Áp dụng</span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDEBAR: Products Shelf */}
          <main className="md:col-span-3 space-y-6">
            
            {/* =========================================================
                4. Thanh sắp xếp & Stats
               ========================================================= */}
            <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-100 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-xs font-bold text-neutral-500">
                {filteredProducts.length === 0 ? (
                  <span>Không tìm thấy sản phẩm phù hợp</span>
                ) : filteredProducts.length <= itemsPerPage ? (
                  <span>
                    Hiển thị <span className="font-extrabold text-black">{filteredProducts.length}</span> trong tổng số{' '}
                    <span className="font-extrabold text-black">{filteredProducts.length}</span> sản phẩm
                  </span>
                ) : (
                  <span>
                    Hiển thị{' '}
                    <span className="font-extrabold text-black">
                      {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span>{' '}
                    trong tổng số <span className="font-extrabold text-black">{filteredProducts.length}</span> sản phẩm
                  </span>
                )}
              </span>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">Sắp xếp:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-neutral-50 border border-neutral-200/70 text-xs font-extrabold text-neutral-800 py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="bestseller">Bán chạy nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="name_az">Tên A-Z</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filters summary list */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">Đang lọc:</span>
                {selectedCategories.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-black text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>Loại: {c}</span>
                    <button onClick={() => handleToggleCategory(c)} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                  </span>
                ))}
                {selectedBrands.map(b => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-black text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>Hãng: {b}</span>
                    <button onClick={() => handleToggleBrand(b)} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                  </span>
                ))}
                {selectedGenders.map(g => (
                  <span key={g} className="inline-flex items-center gap-1 rounded-full bg-black text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>{g}</span>
                    <button onClick={() => handleToggleGender(g)} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                  </span>
                ))}
                {selectedPriceRanges.map(r => {
                  const range = PRICE_RANGES.find(item => item.id === r);
                  return (
                    <span key={r} className="inline-flex items-center gap-1 rounded-full bg-black text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                      <span>{range?.label}</span>
                      <button onClick={() => handleTogglePriceRange(r)} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                    </span>
                  );
                })}
                {onlyNew && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>Mới</span>
                    <button onClick={() => { setOnlyNew(false); setCurrentPage(1); }} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                  </span>
                )}
                {onlyPromotions && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#BA0C2F] text-white text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>Khuyến mãi</span>
                    <button onClick={() => { setOnlyPromotions(false); setCurrentPage(1); }} className="text-white/60 hover:text-white cursor-pointer"><X size={10} /></button>
                  </span>
                )}
                {onlyHot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 text-black text-[9px] font-extrabold px-3 py-1 uppercase">
                    <span>HOT</span>
                    <button onClick={() => { setOnlyHot(false); setCurrentPage(1); }} className="text-black/60 hover:text-black cursor-pointer"><X size={10} /></button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-black uppercase text-rose-500 hover:underline cursor-pointer ml-1"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* =========================================================
                5. Danh sách sản phẩm (Grid)
               ========================================================= */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const hasDiscount = !!product.originalPrice;
                  const discountPercentage = hasDiscount
                    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                    : 0;
                  const isFav = favorites.some(f => f.id === product.id);
                  const isStock = isProductInStock(product);
                  const prodHasSizes = !!(product.sizes && product.sizes.length > 0);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-[24px] border border-neutral-100 p-4 shadow-xs hover:shadow-xl hover:border-neutral-200 transition-all flex flex-col justify-between"
                      id={`product-card-${product.id}`}
                    >
                      <div>
                        {/* Image Showcase */}
                        <div className="relative aspect-square w-full rounded-2xl bg-white p-4 flex items-center justify-center overflow-hidden">
                          {/* Badges */}
                          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
                            {product.isHot && (
                              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-black uppercase shadow-xs">
                                HOT
                              </span>
                            )}
                            {product.isPromotion && (
                              <span className="rounded-full bg-[#BA0C2F] px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs">
                                KM
                              </span>
                            )}
                            {!product.isPromotion && hasDiscount && (
                              <span className="rounded-full bg-[#BA0C2F] px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs">
                                -{discountPercentage}%
                              </span>
                            )}
                          </div>

                          {/* Quick Actions overlay */}
                          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                            <button
                              onClick={() => onToggleFavorite(product)}
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                isFav ? 'bg-rose-50 text-rose-500 shadow-xs' : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-black shadow-xs'
                              }`}
                              title={isFav ? 'Bỏ thích' : 'Yêu thích'}
                            >
                              <Heart size={14} className={isFav ? 'fill-rose-500' : ''} />
                            </button>
                            <button
                              onClick={() => onQuickView(product)}
                              className="h-8 w-8 rounded-full bg-white/80 text-neutral-600 hover:bg-white hover:text-black flex items-center justify-center shadow-xs transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Xem nhanh"
                            >
                              <Eye size={14} />
                            </button>
                          </div>

                          {/* Main Image */}
                          <img
                            src={getCleanProductImage(product)}
                            alt={product.name}
                            className="h-full w-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Out of stock overlay */}
                          {!isStock && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-15">
                              <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                {t.soldOut}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info details */}
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center justify-between min-h-[18px]">
                            {product.brand ? (
                              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                                {product.brand}
                              </span>
                            ) : (
                              <span />
                            )}
                            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 ml-auto">
                              <Star size={11} className="fill-amber-400 text-amber-500" />
                              <span>{product.rating}</span>
                              <span className="text-[10px] text-neutral-400">({product.reviewsCount})</span>
                            </div>
                          </div>

                          <h3 
                            onClick={() => onQuickView(product)}
                            className="text-sm font-extrabold text-neutral-900 line-clamp-2 min-h-[40px] group-hover:text-amber-600 transition-colors cursor-pointer"
                            title={product.name}
                          >
                            {product.name}
                          </h3>

                          {/* Color dots */}
                          <div className="flex gap-1 pt-0.5">
                            {product.colors.map((c, i) => (
                              <span
                                key={i}
                                className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-xs"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Add to cart */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-1.5">
                        <div className="min-w-0 pr-1">
                          {hasDiscount && (
                            <span className="text-[11px] text-neutral-400 line-through block whitespace-nowrap truncate">
                              {formatPrice(product.originalPrice!)}
                            </span>
                          )}
                          <span className="text-sm font-black text-neutral-900 whitespace-nowrap truncate block">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(product, prodHasSizes ? (product.sizes[0] || 40) : 0, product.colors[0])}
                          disabled={!isStock}
                          className={`h-9 px-3 sm:px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap select-none transition-all cursor-pointer ${
                            isStock
                              ? 'bg-black text-white hover:bg-neutral-800 shadow-xs'
                              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag size={13} className="shrink-0" />
                          <span>{isStock ? t.add : t.soldOut}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* =========================================================
                  6. Trạng thái trống (Empty State)
                 ========================================================= */
              <div className="bg-white rounded-[32px] border border-neutral-100 p-12 text-center space-y-4 shadow-xs">
                <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-black uppercase text-neutral-900">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Hãy thử thay đổi bộ lọc hoặc xóa bớt tiêu chí tìm kiếm để tìm được nhiều sản phẩm hơn.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* =========================================================
                7. Phân trang (Pagination)
               ========================================================= */}
            {totalPages > 1 && (
              <nav aria-label="Phân trang sản phẩm" className="pt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {/* Nút Trước */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className={`h-9 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                    currentPage === 1 
                      ? 'text-neutral-300 border border-neutral-100 bg-white/50 cursor-not-allowed' 
                      : 'text-neutral-700 border border-neutral-200 bg-white hover:border-black hover:bg-neutral-50 cursor-pointer'
                  }`}
                >
                  <span className="font-bold">←</span>
                  <span>Trước</span>
                </button>
                
                {/* Các nút trang */}
                {paginationRange.map((pItem, idx) => {
                  if (pItem === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="h-9 w-6 sm:w-8 flex items-center justify-center text-xs font-black text-neutral-400 select-none"
                      >
                        ...
                      </span>
                    );
                  }

                  const pNum = Number(pItem);
                  const isCurrent = currentPage === pNum;

                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-9 min-w-[36px] px-2.5 rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-black text-white shadow-xs scale-105' 
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black hover:bg-neutral-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {/* Nút Sau */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className={`h-9 px-3 sm:px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                    currentPage === totalPages 
                      ? 'text-neutral-300 border border-neutral-100 bg-white/50 cursor-not-allowed' 
                      : 'text-neutral-700 border border-neutral-200 bg-white hover:border-black hover:bg-neutral-50 cursor-pointer'
                  }`}
                >
                  <span>Sau</span>
                  <span className="font-bold">→</span>
                </button>
              </nav>
            )}

          </main>
        </div>
      </div>

      {/* =========================================================
          8. Mobile Filter Slide Drawer / Panel
         ========================================================= */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-5/6 max-w-sm bg-white z-55 md:hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-amber-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-neutral-900">
                    BỘ LỌC SẢN PHẨM
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
                {/* 1. DANH MỤC */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    1. Danh mục
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeCategoriesList.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.name);
                      return (
                        <label 
                          key={cat.id || cat.name} 
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                            isChecked ? 'bg-black text-white' : 'text-neutral-700 bg-neutral-50'
                          }`}
                        >
                          <div 
                            onClick={() => handleToggleCategory(cat.name)}
                            className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check size={11} className="stroke-[3]" />}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. THƯƠNG HIỆU */}
                <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    2. Thương hiệu
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeBrandsList.map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleToggleBrand(brand)}
                          className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                            isChecked 
                              ? 'bg-black text-white shadow-xs' 
                              : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                          }`}
                        >
                          <span>{brand}</span>
                          {isChecked && <Check size={11} className="text-amber-400 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. ĐỐI TƯỢNG */}
                <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    3. Đối tượng
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDER_OPTIONS.map((g) => {
                      const isChecked = selectedGenders.includes(g.name as GenderType);
                      return (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => handleToggleGender(g.name as GenderType)}
                          className={`py-2 px-1 rounded-xl text-xs font-black text-center transition-all ${
                            isChecked 
                              ? 'bg-black text-white shadow-xs' 
                              : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. KHOẢNG GIÁ */}
                <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    4. Khoảng giá
                  </h4>
                  <div className="space-y-1.5">
                    {PRICE_RANGES.map((range) => {
                      const isChecked = selectedPriceRanges.includes(range.id);
                      return (
                        <label 
                          key={range.id} 
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                            isChecked ? 'bg-black text-white' : 'text-neutral-700 bg-neutral-50'
                          }`}
                        >
                          <div 
                            onClick={() => handleTogglePriceRange(range.id)}
                            className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check size={11} className="stroke-[3]" />}
                          </div>
                          <span className="text-[11px]">{range.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. TRẠNG THÁI */}
                <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    5. Trạng thái
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOnlyNew(prev => !prev);
                        setCurrentPage(1);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        onlyNew 
                          ? 'bg-black text-white' 
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <Zap size={13} className={onlyNew ? 'text-amber-400' : 'text-blue-500'} />
                      <span>Mới</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOnlyPromotions(prev => !prev);
                        setCurrentPage(1);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        onlyPromotions 
                          ? 'bg-black text-white' 
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <Tag size={13} className={onlyPromotions ? 'text-amber-400' : 'text-[#BA0C2F]'} />
                      <span>Giảm giá</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOnlyHot(prev => !prev);
                        setCurrentPage(1);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        onlyHot 
                          ? 'bg-black text-white' 
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <Flame size={13} className={onlyHot ? 'text-amber-400' : 'text-amber-500'} />
                      <span>HOT</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Buttons: [ Xóa bộ lọc ] [ Áp dụng ] */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0}
                  className={`flex-1 rounded-xl py-3 text-xs font-black uppercase transition-all ${
                    activeFiltersCount > 0
                      ? 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      : 'bg-neutral-100 text-neutral-300 border border-transparent cursor-not-allowed'
                  }`}
                >
                  Xóa bộ lọc
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileFilterOpen(false);
                    setCurrentPage(1);
                  }}
                  className="flex-1 rounded-xl bg-black py-3 text-xs font-black uppercase text-white shadow-md hover:bg-neutral-800 transition-colors"
                >
                  Áp dụng ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
