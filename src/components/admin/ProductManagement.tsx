import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Filter,
  RotateCcw,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Check,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tag,
  FolderTree,
  Package,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Star,
  Flame,
  Users,
  RotateCw,
} from 'lucide-react';
import { Product, BrandName, CategoryName, CategoryItem, BrandItem, GenderType } from '../../types';
import { BRANDS, CATEGORIES } from '../../data';
import { productsApi } from '../../services/api';


interface ProductManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories?: CategoryItem[];
  brands?: BrandItem[];
  showToast: (msg: string) => void;
  onRefreshProducts?: () => Promise<void> | void;
}

const ALL_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44];
const GENDER_OPTIONS: GenderType[] = ['Nam', 'Nữ', 'Trẻ em', 'Unisex'];

export default function ProductManagement({
  products,
  setProducts,
  categories,
  brands,
  showToast,
  onRefreshProducts,
}: ProductManagementProps) {
  // Helper: check if a category is an Accessory
  const isAccessoryCategory = (categoryName: string): boolean => {
    if (categories && categories.length > 0) {
      const match = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
      if (match?.group === 'accessories') return true;
      if (match?.group === 'shoes') return false;
    }
    const lower = categoryName.toLowerCase();
    return (
      lower.includes('dây') ||
      lower.includes('tất') ||
      lower.includes('lót') ||
      lower.includes('túi') ||
      lower.includes('vệ sinh') ||
      lower.includes('phụ kiện')
    );
  };

  // Helper: Get gender badge styling
  const getGenderBadge = (gender?: GenderType) => {
    const g = gender || 'Unisex';
    switch (g) {
      case 'Nam':
        return {
          label: 'Nam',
          className: 'bg-sky-50 text-sky-700 border-sky-200',
          dotClass: 'bg-sky-500',
        };
      case 'Nữ':
        return {
          label: 'Nữ',
          className: 'bg-rose-50 text-rose-700 border-rose-200',
          dotClass: 'bg-rose-500',
        };
      case 'Trẻ em':
        return {
          label: 'Trẻ em',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      case 'Unisex':
      default:
        return {
          label: 'Unisex',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
    }
  };

  // Helper: Get product stock unit (đôi for shoes, sp for accessories)
  const getProductUnit = (product: Product): string => {
    return isAccessoryCategory(product.category) ? 'sp' : 'đôi';
  };

  // Dynamic Category options list from Category Management
  const categoryOptions = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.filter((c) => !c.isDeleted && c.status === 'Đang hoạt động').map((c) => c.name);
    }
    return CATEGORIES.map((c) => c.name);
  }, [categories]);

  // Dynamic Brand options list from Brand Management
  const brandOptions = useMemo(() => {
    if (brands && brands.length > 0) {
      return brands.filter((b) => !b.isDeleted && b.status === 'Đang hoạt động').map((b) => b.name);
    }
    return BRANDS.map((b) => b.name);
  }, [brands]);

  // ----------------------------------------------------
  // 1. TOOLBAR & FILTER STATES
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('All');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<'All' | 'KM' | 'HOT' | 'KM_HOT'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Modals and Drawers
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    sku: string;
    name: string;
    gender: GenderType;
    brand?: BrandName;
    category: CategoryName;
    price: number;
    originalPrice: number | undefined;
    isPromotion: boolean;
    isHot: boolean;
    images: string[];
    selectedMainImageIndex: number;
    sizes: number[];
    sizeStock: Record<number, number>;
    generalStock: number;
    shortDescription: string;
    description: string;
    status: 'Đang bán' | 'Ẩn' | 'Ngừng kinh doanh';
  }>({
    sku: '',
    name: '',
    gender: 'Nam',
    brand: 'Nike',
    category: 'Sneaker',
    price: 2500000,
    originalPrice: 3000000,
    isPromotion: false,
    isHot: false,
    images: [],
    selectedMainImageIndex: 0,
    sizes: [38, 39, 40, 41, 42, 43],
    sizeStock: { 38: 5, 39: 10, 40: 12, 41: 8, 42: 6, 43: 4 },
    generalStock: 50,
    shortDescription: '',
    description: '',
    status: 'Đang bán',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showZeroStockConfirm, setShowZeroStockConfirm] = useState(false);

  // File Upload Explorer & Image Preview States
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string>('');
  const [previewEnlargeImage, setPreviewEnlargeImage] = useState<{ url: string; title?: string; size?: string } | null>(null);
  const [imageMetaMap, setImageMetaMap] = useState<Record<string, { name: string; size: string }>>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploadError('');
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
    const maxImages = 10;

    const currentCount = formData.images.length;
    if (currentCount >= maxImages) {
      const msg = `Sản phẩm đã có đủ ${maxImages} hình ảnh. Vui lòng xóa bớt ảnh trước khi tải thêm.`;
      setImageUploadError(msg);
      showToast(msg);
      if (e.target) e.target.value = '';
      return;
    }

    const selectedFiles = Array.from(files) as File[];
    if (currentCount + selectedFiles.length > maxImages) {
      const msg = `Tối đa ${maxImages} ảnh mỗi sản phẩm! Bạn chỉ có thể chọn thêm ${maxImages - currentCount} ảnh nữa.`;
      setImageUploadError(msg);
      showToast(msg);
      if (e.target) e.target.value = '';
      return;
    }

    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      const isMimeValid = allowedMimeTypes.includes(file.type.toLowerCase());
      const isExtValid = allowedExtensions.test(file.name);

      if (!isMimeValid && !isExtValid) {
        const msg = `Định dạng ảnh không được hỗ trợ. Chỉ hỗ trợ định dạng JPG, JPEG, PNG, WEBP.`;
        setImageUploadError(msg);
        showToast(msg);
        if (e.target) e.target.value = '';
        return;
      }

      if (file.size > maxSizeBytes) {
        const msg = `Ảnh "${file.name}" vượt quá dung lượng tối đa 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn ảnh nhỏ hơn 5MB.`;
        setImageUploadError(msg);
        showToast(msg);
        if (e.target) e.target.value = '';
        return;
      }

      validFiles.push(file);
    }

    let loadedCount = 0;
    const newImageUrls: string[] = [];
    const newMetaMap = { ...imageMetaMap };

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          newImageUrls.push(dataUrl);
          const formattedSize =
            file.size < 1024 * 1024
              ? `${Math.round(file.size / 1024)} KB`
              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          newMetaMap[dataUrl] = {
            name: file.name,
            size: formattedSize,
          };
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setImageMetaMap(newMetaMap);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImageUrls],
            selectedMainImageIndex: prev.images.length === 0 ? 0 : prev.selectedMainImageIndex,
          }));
          setFormErrors((prev) => {
            const copy = { ...prev };
            delete copy.images;
            return copy;
          });
          showToast(`Đã tải lên thành công ${newImageUrls.length} ảnh từ máy tính.`);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // ----------------------------------------------------
  // HELPER CALCULATIONS FOR PRODUCTS
  // ----------------------------------------------------
  const getProductTotalStock = (product: Product): number => {
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      return Object.values(product.sizeStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    // Fallback if sizeStock isn't present
    return (product.sizes?.length || 0) * 8;
  };

  const getProductSku = (product: Product): string => {
    if (product.sku) return product.sku;
    // Auto-generate display SKU if missing
    const prefix = (product.brand ? product.brand.substring(0, 2) : (product.category ? product.category.substring(0, 2) : 'SP')).toUpperCase();
    const hash = Math.abs((product.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 900 + 100);
    return `${prefix}${hash}`;
  };

  const getProductCreatedAt = (product: Product): string => {
    if (product.createdAt) return product.createdAt;
    return '15/07/2026';
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // ----------------------------------------------------
  // FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const sku = getProductSku(p).toLowerCase();
      const name = (p.name || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      // Search match
      const matchesSearch =
        !query ||
        name.includes(query) ||
        sku.includes(query) ||
        brand.includes(query) ||
        (p.gender && p.gender.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query));

      // Gender match
      const matchesGender =
        selectedGenderFilter === 'All' ||
        p.gender === selectedGenderFilter ||
        (!p.gender && selectedGenderFilter === 'Unisex');

      // Group match (shoes vs accessories)
      let matchesGroup = true;
      if (selectedGroupFilter === 'shoes') {
        matchesGroup = !isAccessoryCategory(p.category);
      } else if (selectedGroupFilter === 'accessories') {
        matchesGroup = isAccessoryCategory(p.category);
      }

      // Category match
      const matchesCategory =
        selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;

      // Brand match
      const matchesBrand = selectedBrandFilter === 'All' || p.brand === selectedBrandFilter;

      // Status match
      let matchesStatus = true;
      if (selectedStatusFilter === 'All') {
        // Show non-deleted products by default when "All" is selected
        matchesStatus = !p.isDeleted;
      } else if (selectedStatusFilter === 'Đã xóa') {
        matchesStatus = p.isDeleted === true;
      } else {
        matchesStatus = !p.isDeleted && (p.status || 'Đang bán') === selectedStatusFilter;
      }

      // Stock match
      const totalStock = getProductTotalStock(p);
      let matchesStock = true;
      if (selectedStockFilter === 'in_stock') {
        matchesStock = totalStock > 10;
      } else if (selectedStockFilter === 'low_stock') {
        matchesStock = totalStock > 0 && totalStock <= 10;
      } else if (selectedStockFilter === 'out_of_stock') {
        matchesStock = totalStock === 0;
      }

      // Tag match (KM, HOT)
      let matchesTag = true;
      if (selectedTagFilter === 'KM') {
        matchesTag = p.isPromotion === true;
      } else if (selectedTagFilter === 'HOT') {
        matchesTag = p.isHot === true;
      } else if (selectedTagFilter === 'KM_HOT') {
        matchesTag = p.isPromotion === true && p.isHot === true;
      }

      return (
        matchesSearch &&
        matchesGender &&
        matchesGroup &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus &&
        matchesStock &&
        matchesTag
      );
    });
  }, [
    products,
    searchQuery,
    selectedGenderFilter,
    selectedGroupFilter,
    selectedCategoryFilter,
    selectedBrandFilter,
    selectedStatusFilter,
    selectedStockFilter,
    categories,
  ]);

  // Quick Stats
  const productStats = useMemo(() => {
    let total = 0;
    let active = 0;
    let outOfStock = 0;
    let deleted = 0;

    products.forEach((p) => {
      if (p.isDeleted) {
        deleted++;
      } else {
        total++;
        if ((p.status || 'Đang bán') === 'Đang bán') active++;
        if (getProductTotalStock(p) === 0 || (p.status as any) === 'Hết hàng') outOfStock++;
      }
    });

    return { total, active, outOfStock, deleted };
  }, [products]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'oldest') {
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'stock-asc') {
        return getProductTotalStock(a) - getProductTotalStock(b);
      }
      if (sortBy === 'stock-desc') {
        return getProductTotalStock(b) - getProductTotalStock(a);
      }
      return 0;
    });
    return list;
  }, [filteredProducts, sortBy]);

  // Paginated products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenderFilter('All');
    setSelectedGroupFilter('All');
    setSelectedCategoryFilter('All');
    setSelectedBrandFilter('All');
    setSelectedStatusFilter('All');
    setSelectedStockFilter('All');
    setSelectedTagFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Đã đặt lại toàn bộ bộ lọc!');
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
  // OPEN ADD / EDIT FORM
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowZeroStockConfirm(false);
    const generatedSku = `SS${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultStock: Record<number, number> = {
      36: 5,
      37: 8,
      38: 10,
      39: 15,
      40: 12,
      41: 8,
      42: 5,
      43: 2,
      44: 0,
    };
    setFormData({
      sku: generatedSku,
      name: '',
      gender: 'Nam',
      brand: 'Nike',
      category: 'Sneaker',
      price: 2490000,
      originalPrice: 2890000,
      isPromotion: false,
      isHot: false,
      images: [],
      selectedMainImageIndex: 0,
      sizes: [36, 37, 38, 39, 40, 41, 42, 43],
      sizeStock: defaultStock,
      generalStock: 50,
      shortDescription: 'Mẫu giày thể thao phong cách streetwear đẳng cấp, chuẩn auth 100%.',
      description:
        'Thiết kế ấn tượng kết hợp bộ đệm êm ái tối đa. Phù hợp cho cả hoạt động thể thao lẫn phối đồ thời trang hàng ngày. Thân giày ôm chân, thoáng khí vượt trội.',
      status: 'Đang bán',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowZeroStockConfirm(false);
    const existingSku = getProductSku(product);
    const existingImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const isAccessory = isAccessoryCategory(product.category);

    // Construct sizeStock map if absent
    let sizeStockMap: Record<number, number> = {};
    if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
      sizeStockMap = { ...product.sizeStock };
    } else {
      ALL_SIZES.forEach((sz) => {
        if (product.sizes?.includes(sz)) {
          sizeStockMap[sz] = 8;
        } else {
          sizeStockMap[sz] = 0;
        }
      });
    }

    const activeSizes = ALL_SIZES.filter((sz) => (sizeStockMap[sz] ?? 0) > 0 || product.sizes?.includes(sz));
    const totalExistingStock = getProductTotalStock(product);

    setFormData({
      id: product.id,
      sku: existingSku,
      name: product.name,
      gender: product.gender || 'Unisex',
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      isPromotion: !isAccessory && (product.isPromotion ?? (product.originalPrice ? product.originalPrice > product.price : false)),
      isHot: !isAccessory && (product.isHot ?? (product.isBestSeller ?? false)),
      images: existingImages,
      selectedMainImageIndex: 0,
      sizes: !isAccessory && activeSizes.length > 0 ? activeSizes : [39, 40, 41, 42],
      sizeStock: sizeStockMap,
      generalStock: totalExistingStock || 50,
      shortDescription: product.shortDescription || 'Mẫu sản phẩm thời trang chính hãng cao cấp.',
      description: product.description || '',
      status: (product.status === 'Đã xóa' ? 'Đang bán' : product.status) || 'Đang bán',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // ----------------------------------------------------
  // FORM VALIDATION & SUBMIT
  // ----------------------------------------------------
  const handleSaveProduct = async () => {
    const errors: Record<string, string> = {};
    const isAccessory = isAccessoryCategory(formData.category);

    // 1. Tên không trống
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm!';
    }

    // 2. SKU không được trùng với sản phẩm khác
    const cleanSku = formData.sku.trim().toUpperCase();
    if (!cleanSku) {
      errors.sku = 'Vui lòng nhập mã SKU!';
    } else {
      const duplicate = products.find(
        (p) => getProductSku(p).toUpperCase() === cleanSku && p.id !== formData.id
      );
      if (duplicate) {
        errors.sku = `Mã SKU "${cleanSku}" đã tồn tại trên hệ thống (Sản phẩm: ${duplicate.name})!`;
      }
    }

    // 3. Đối tượng (bắt buộc với giày dép, không bắt buộc với phụ kiện)
    if (!isAccessory) {
      if (!formData.gender) {
        errors.gender = 'Vui lòng chọn đối tượng sử dụng!';
      }
    }

    // 3.1 Thương hiệu (bắt buộc đối với giày dép, không bắt buộc đối với phụ kiện)
    if (!isAccessory) {
      if (!formData.brand || formData.brand.trim() === '') {
        errors.brand = 'Vui lòng chọn thương hiệu cho sản phẩm giày!';
      }
    }

    // 4. Giá gốc phải > 0
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Giá gốc phải lớn hơn 0 VNĐ!';
    }

    // 5. Giá khuyến mãi (nếu có) phải <= Giá gốc
    if (formData.originalPrice !== undefined && formData.originalPrice > 0) {
      if (formData.price > formData.originalPrice) {
        errors.price = 'Giá bán sau giảm (Giá KM) không được lớn hơn giá gốc!';
      }
    }

    // 6. Bắt buộc có ít nhất 1 ảnh
    if (!formData.images || formData.images.length === 0) {
      errors.images = 'Sản phẩm phải có ít nhất 1 hình ảnh!';
    }

    // 7. Bắt buộc chọn ít nhất 1 size (nếu là giày dép) hoặc nhập tồn kho (nếu là phụ kiện)
    if (!isAccessory) {
      if (!formData.sizes || formData.sizes.length === 0) {
        errors.sizes = 'Sản phẩm giày phải có ít nhất 1 size được kích hoạt!';
      }
    } else {
      if (formData.generalStock === undefined || formData.generalStock < 0 || isNaN(formData.generalStock)) {
        errors.generalStock = 'Vui lòng nhập số lượng tồn kho hợp lệ (>= 0)!';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    let cleanSizeStock: Record<number, number> = {};
    let cleanSizes: number[] = [];
    let totalCalculatedStock = 0;

    if (isAccessory) {
      cleanSizes = [];
      totalCalculatedStock = Math.max(0, Number(formData.generalStock) || 0);
      cleanSizeStock = { 0: totalCalculatedStock };
    } else {
      formData.sizes.forEach((sz) => {
        cleanSizeStock[sz] = Number(formData.sizeStock[sz]) || 0;
      });
      cleanSizes = formData.sizes;
      totalCalculatedStock = Object.values(cleanSizeStock).reduce((sum, v) => sum + v, 0);
    }

    const mainImage = formData.images[formData.selectedMainImageIndex] || formData.images[0];
    const todayStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const finalBrand = isAccessory
      ? (formData.brand && formData.brand.trim() !== '' ? (formData.brand as BrandName) : undefined)
      : (formData.brand as BrandName);
    const hasSizes = !isAccessory;
    const finalGender = isAccessory ? 'Unisex' : formData.gender;
    const finalIsPromotion = isAccessory ? false : formData.isPromotion;
    const finalIsHot = isAccessory ? false : formData.isHot;

    try {
      if (editingProduct) {
        // UPDATE EXISTING PRODUCT
        const updatePayload: Partial<Product> = {
          sku: cleanSku,
          name: formData.name.trim(),
          gender: finalGender,
          brand: finalBrand,
          hasSizes,
          category: formData.category,
          price: formData.price,
          originalPrice: formData.originalPrice,
          isPromotion: finalIsPromotion,
          isHot: finalIsHot,
          isBestSeller: finalIsHot,
          image: mainImage,
          images: formData.images,
          sizes: cleanSizes,
          sizeStock: cleanSizeStock,
          stockQuantity: totalCalculatedStock,
          shortDescription: formData.shortDescription,
          description: formData.description,
          status: totalCalculatedStock === 0 ? 'Ẩn' : formData.status,
          isDeleted: false,
        };

        let updatedFromApi: Product | null = null;
        try {
          updatedFromApi = await productsApi.update(editingProduct.id, updatePayload);
        } catch (apiErr) {
          console.warn('API update failed, updating local state:', apiErr);
        }

        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === editingProduct.id) {
              return updatedFromApi || {
                ...p,
                ...updatePayload,
                updatedAt: todayStr,
              };
            }
            return p;
          })
        );
        showToast(`Cập nhật sản phẩm "${formData.name.trim()}" thành công.`);
        if (onRefreshProducts) {
          onRefreshProducts();
        }
      } else {
        // CREATE NEW PRODUCT
        const newProd: Product = {
          id: `prod-${Date.now()}`,
          sku: cleanSku,
          name: formData.name.trim(),
          gender: finalGender,
          brand: finalBrand,
          hasSizes,
          category: formData.category,
          price: formData.price,
          originalPrice: formData.originalPrice,
          isPromotion: finalIsPromotion,
          isHot: finalIsHot,
          isBestSeller: finalIsHot,
          image: mainImage,
          images: formData.images,
          rating: 5.0,
          reviewsCount: 0,
          isNew: true,
          sizes: cleanSizes,
          sizeStock: cleanSizeStock,
          stockQuantity: totalCalculatedStock,
          colors: [
            { name: 'Phối màu chuẩn', hex: '#000000' },
            { name: 'Trắng/Đen', hex: '#FFFFFF' },
          ],
          shortDescription: formData.shortDescription,
          description: formData.description,
          status: totalCalculatedStock === 0 ? 'Ẩn' : formData.status,
          isDeleted: false,
          createdAt: todayStr,
          updatedAt: todayStr,
        };

        let createdFromApi: Product = newProd;
        try {
          const apiRes = await productsApi.create(newProd);
          if (apiRes && apiRes.id) {
            createdFromApi = apiRes;
          }
        } catch (apiErr) {
          console.warn('API create failed, adding locally:', apiErr);
        }

        setProducts((prev) => [createdFromApi, ...prev]);
        showToast('Thêm sản phẩm thành công.');
        if (onRefreshProducts) {
          onRefreshProducts();
        }
      }

      setIsFormModalOpen(false);
    } catch (err: any) {
      showToast('Có lỗi xảy ra: ' + (err?.message || 'Vui lòng thử lại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // SOFT DELETE & RESTORE HANDLERS
  // ----------------------------------------------------
  const handleConfirmSoftDelete = async () => {
    if (!deletingProduct) return;

    try {
      await productsApi.update(deletingProduct.id, {
        ...deletingProduct,
        isDeleted: true,
        status: 'Đã xóa',
      });
    } catch (apiErr) {
      console.warn('API soft delete failed:', apiErr);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === deletingProduct.id) {
          return {
            ...p,
            isDeleted: true,
            status: 'Đã xóa',
          };
        }
        return p;
      })
    );

    showToast(`Đã chuyển sản phẩm "${deletingProduct.name}" vào danh sách đã xóa.`);
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
    if (onRefreshProducts) {
      onRefreshProducts();
    }
  };

  const handleRestoreProduct = async (product: Product) => {
    try {
      await productsApi.update(product.id, {
        ...product,
        isDeleted: false,
        status: 'Đang bán',
      });
    } catch (apiErr) {
      console.warn('API restore failed:', apiErr);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return {
            ...p,
            isDeleted: false,
            status: 'Đang bán',
          };
        }
        return p;
      })
    );
    showToast(`Đã khôi phục sản phẩm "${product.name}" thành công.`);
    if (onRefreshProducts) {
      onRefreshProducts();
    }
  };

  // ----------------------------------------------------
  // EXPORT & IMPORT EXCEL / CSV
  // ----------------------------------------------------
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'SKU',
      'Tên sản phẩm',
      'Thương hiệu',
      'Danh mục',
      'Giá bán (VND)',
      'Giá gốc (VND)',
      'Tổng tồn kho',
      'Trạng thái',
      'Ngày tạo',
    ];

    const rows = filteredProducts.map((p) => [
      p.id,
      getProductSku(p),
      `"${p.name.replace(/"/g, '""')}"`,
      p.brand,
      p.category,
      p.price,
      p.originalPrice || p.price,
      getProductTotalStock(p),
      p.isDeleted ? 'Đã xóa' : p.status || 'Đang bán',
      getProductCreatedAt(p),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `knicks_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Đã xuất ${filteredProducts.length} sản phẩm ra file CSV thành công!`);
  };

  const handleProcessImportCsv = () => {
    if (!importCsvText.trim()) {
      alert('Vui lòng nhập nội dung CSV hoặc chọn file mẫu!');
      return;
    }

    try {
      const lines = importCsvText.trim().split('\n');
      if (lines.length < 2) {
        alert('Dữ liệu CSV cần có hàng tiêu đề và ít nhất 1 hàng sản phẩm!');
        return;
      }

      const newProds: Product[] = [];
      const todayStr = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        if (row.length >= 4) {
          const sku = row[0] || `IMP${Math.floor(1000 + Math.random() * 9000)}`;
          const name = row[1] || 'Sản phẩm Import';
          const brand = (row[2] as BrandName) || 'Nike';
          const category = (row[3] as CategoryName) || 'Sneaker';
          const price = Number(row[4]) || 2200000;

          newProds.push({
            id: `prod-imp-${Date.now()}-${i}`,
            sku: sku,
            name: name,
            brand: brandOptions.includes(brand) ? brand : (brandOptions[0] || 'Nike'),
            category: CATEGORIES.some((c) => c.name === category) ? category : 'Sneaker',
            price: price,
            originalPrice: price * 1.15,
            image:
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            images: [
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            ],
            rating: 5.0,
            reviewsCount: 0,
            isNew: true,
            sizes: [38, 39, 40, 41, 42],
            sizeStock: { 38: 5, 39: 10, 40: 12, 41: 8, 42: 6 },
            colors: [{ name: 'Đen', hex: '#000000' }],
            description: 'Sản phẩm được nhập tự động từ file CSV/Excel.',
            status: 'Đang bán',
            isDeleted: false,
            createdAt: todayStr,
            updatedAt: todayStr,
          });
        }
      }

      if (newProds.length > 0) {
        setProducts((prev) => [...newProds, ...prev]);
        showToast(`Đã import thành công ${newProds.length} sản phẩm mới!`);
        setIsImportModalOpen(false);
        setImportCsvText('');
      } else {
        alert('Không tìm thấy dữ liệu hợp lệ trong file!');
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi đọc định dạng CSV. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans" id="admin-products-module">
      {/* ---------------------------------------------------- */}
      {/* 2. HEADER AREA                                       */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <Package size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Sản Phẩm
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {productStats.total} sản phẩm
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Quản lý toàn bộ thông tin, bảng size, tồn kho và đồng bộ trực tiếp với website bán hàng
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {/* Refresh Data */}
          {onRefreshProducts && (
            <button
              onClick={async () => {
                showToast('Đang làm mới dữ liệu từ Database...');
                await onRefreshProducts();
                showToast('Đã cập nhật danh sách sản phẩm mới nhất!');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Tải lại danh sách sản phẩm mới nhất từ Database Supabase"
            >
              <RotateCw size={14} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}

          {/* Export Excel */}
          <button
            onClick={handleExportCsv}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Xuất file danh sách sản phẩm ra Excel/CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Nhập sản phẩm từ CSV"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* NÚT THÊM SẢN PHẨM */}
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            id="add-product-btn"
          >
            <Plus size={15} className="text-amber-400" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* STATS 4 CARDS - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div
          onClick={() => { setSelectedStatusFilter('All'); setSelectedStockFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'All' && selectedStockFilter === 'All'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả sản phẩm :</span>
          <span className="text-xs font-black text-neutral-900">
            {productStats.total} <span className="font-semibold text-neutral-500">sản phẩm</span>
          </span>
        </div>

        <div
          onClick={() => { setSelectedStatusFilter('Đang bán'); setSelectedStockFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đang bán'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đang mở bán :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {productStats.active} <span className="font-semibold text-emerald-700">sản phẩm</span>
          </span>
        </div>

        <div
          onClick={() => { setSelectedStockFilter('out_of_stock'); setSelectedStatusFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStockFilter === 'out_of_stock'
              ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>⚠️</span>
            <span>Hết hàng :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {productStats.outOfStock} <span className="font-semibold text-rose-700">sản phẩm</span>
          </span>
        </div>

        <div
          onClick={() => { setSelectedStatusFilter('Đã xóa'); setSelectedStockFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đã xóa'
              ? 'border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
            <span>🗑️</span>
            <span>Thùng rác :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {productStats.deleted} <span className="font-semibold text-neutral-500">đã xóa</span>
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. THANH CÔNG CỤ (TÌM KIẾM & SẮP XẾP)                */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Ô TÌM KIẾM */}
          <div className="w-full flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm kiếm theo tên sản phẩm, mã SKU, thương hiệu, danh mục..."
              className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-black pl-10 pr-9 py-2.5 rounded-2xl text-xs font-semibold border border-neutral-200 outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* SẮP XẾP */}
          <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-neutral-500 whitespace-nowrap flex items-center gap-1.5 pl-1">
              <ArrowUpDown size={14} className="text-neutral-400" /> Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-48 bg-neutral-50 border border-neutral-200 text-xs font-bold px-3 py-2.5 rounded-2xl outline-hidden cursor-pointer hover:bg-neutral-100 transition-colors"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="stock-asc">Tồn kho tăng dần</option>
              <option value="stock-desc">Tồn kho giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results summary info bar */}
      <div className="flex items-center justify-between text-xs font-bold text-neutral-600 px-1">
        <span>
          Tìm thấy <span className="text-black font-extrabold">{sortedProducts.length}</span> sản phẩm phù hợp
        </span>
        {selectedStatusFilter === 'Đã xóa' && (
          <span className="text-rose-600 font-extrabold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-[11px]">
            ⚠️ Đang xem danh sách sản phẩm ĐÃ XÓA MỀM
          </span>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 6 & 7. DANH SÁCH SẢN PHẨM (TABLE & MOBILE CARDS)      */}
      {/* ---------------------------------------------------- */}

      {/* DESKTOP / TABLET TABLE VIEW */}
      <div className="hidden sm:block bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1100px]">
            <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 font-black uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-28 text-center">Ảnh</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4 min-w-[220px]">Tên sản phẩm</th>
                <th className="py-3.5 px-4 text-center">Đối tượng</th>
                <th className="py-3.5 px-4">Danh mục / Loại</th>
                <th className="py-3.5 px-4">Thương hiệu</th>
                <th className="py-3.5 px-4">Giá bán / KM</th>
                <th className="py-3.5 px-4 text-center">Tồn kho</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4">Ngày tạo</th>
                <th className="py-3.5 px-5 text-right pr-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-neutral-400 font-bold">
                    <Package size={40} className="mx-auto mb-2 opacity-30 text-neutral-500" />
                    <p className="text-sm text-neutral-600">Không tìm thấy sản phẩm nào phù hợp bộ lọc!</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 text-xs text-amber-600 font-bold underline cursor-pointer"
                    >
                      Bấm vào đây để xóa bộ lọc
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const sku = getProductSku(product);
                  const totalStock = getProductTotalStock(product);
                  const isDeleted = product.isDeleted;
                  const status = product.status || 'Đang bán';
                  const createdAt = getProductCreatedAt(product);
                  const isAccessory = isAccessoryCategory(product.category);
                  const unit = getProductUnit(product);
                  const genderBadge = getGenderBadge(product.gender);

                  // Stock level status badge
                  let stockBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  let stockText = `${totalStock} ${unit}`;
                  if (totalStock === 0) {
                    stockBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                    stockText = 'HẾT HÀNG';
                  } else if (totalStock <= 10) {
                    stockBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    stockText = `${totalStock} ${unit} (Sắp hết)`;
                  }

                  // Product status badge
                  let statusBadgeClass = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
                  let statusLabel = 'Đang bán';

                  if (isDeleted) {
                    statusBadgeClass = 'bg-rose-500/10 text-rose-700 border-rose-300';
                    statusLabel = 'Đã xóa';
                  } else if (totalStock === 0) {
                    statusBadgeClass = 'bg-rose-500/10 text-rose-700 border-rose-300';
                    statusLabel = 'HẾT HÀNG';
                  } else if (status === 'Ẩn') {
                    statusBadgeClass = 'bg-neutral-200 text-neutral-700 border-neutral-300';
                    statusLabel = 'Ẩn';
                  } else if (status === 'Ngừng kinh doanh') {
                    statusBadgeClass = 'bg-orange-500/10 text-orange-700 border-orange-300';
                    statusLabel = 'Ngừng kinh doanh';
                  }

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        isDeleted ? 'opacity-60 bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Ảnh */}
                      <td className="py-3 px-3 text-center">
                        <div
                          onClick={() => setPreviewEnlargeImage({ url: product.image, title: product.name })}
                          className="relative group cursor-pointer inline-block"
                          title="Bấm để xem ảnh phóng to"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-20 w-20 rounded-xl object-contain bg-white p-1.5 border border-neutral-200 mx-auto shadow-xs group-hover:scale-105 group-hover:border-neutral-400 group-hover:shadow-md transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity duration-200">
                            <Eye size={18} className="text-white drop-shadow-md" />
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-[11px] bg-neutral-100 px-2 py-1 rounded-md text-neutral-800 border border-neutral-200">
                          {sku}
                        </span>
                      </td>

                      {/* Tên */}
                      <td className="py-3 px-4 min-w-[220px] max-w-md">
                        <span className="font-bold text-neutral-900 block" title={product.name}>
                          {product.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {product.isPromotion && (
                            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                              KM
                            </span>
                          )}
                          {product.isHot && (
                            <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                              <Flame size={9} className="fill-black" /> HOT
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                              MỚI
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Đối tượng */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${genderBadge.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${genderBadge.dotClass}`} />
                          <span>{genderBadge.label}</span>
                        </span>
                      </td>

                      {/* Danh mục / Loại */}
                      <td className="py-3 px-4">
                        <span className="text-neutral-900 font-bold block">{product.category}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {isAccessory ? '🎒 Phụ kiện' : '👟 Giày dép'}
                        </span>
                      </td>

                      {/* Thương hiệu */}
                      <td className="py-3 px-4 font-black uppercase text-neutral-900">
                        {product.brand && product.brand.trim() !== '' ? (
                          product.brand
                        ) : (
                          <span className="text-neutral-400 font-normal italic text-xs">-</span>
                        )}
                      </td>

                      {/* Giá */}
                      <td className="py-3 px-4">
                        <div className="font-black text-neutral-900 text-xs">
                          {formatVND(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            {formatVND(product.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Tồn kho */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border ${stockBadgeClass}`}
                        >
                          {stockText}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBadgeClass}`}
                        >
                          {statusLabel}
                        </span>
                      </td>

                      {/* Ngày tạo */}
                      <td className="py-3 px-4 text-neutral-500 text-[11px] font-medium">{createdAt}</td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* [Xem] */}
                          <button
                            onClick={() => {
                              setViewingProduct(product);
                              setIsDetailDrawerOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                            title="Xem chi tiết sản phẩm"
                          >
                            <Eye size={15} />
                          </button>

                          {/* [Sửa] */}
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit size={15} />
                          </button>

                          {/* [Xóa] hoặc [Khôi phục] */}
                          {isDeleted ? (
                            <button
                              onClick={() => handleRestoreProduct(product)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                              title="Khôi phục sản phẩm"
                            >
                              <RotateCcw size={13} />
                              <span>Khôi phục</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setDeletingProduct(product);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                              title="Xóa mềm sản phẩm"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden space-y-3">
        {paginatedProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border text-center text-neutral-400">
            <Package size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs font-bold text-neutral-600">Không tìm thấy sản phẩm phù hợp!</p>
          </div>
        ) : (
          paginatedProducts.map((product) => {
            const sku = getProductSku(product);
            const totalStock = getProductTotalStock(product);
            const isDeleted = product.isDeleted;
            const status = product.status || 'Đang bán';
            const unit = getProductUnit(product);
            const genderBadge = getGenderBadge(product.gender);

            return (
              <div
                key={product.id}
                className={`bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs space-y-3 ${
                  isDeleted ? 'bg-rose-50/20' : ''
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 rounded-2xl object-contain bg-white p-1.5 border border-neutral-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setPreviewEnlargeImage({ url: product.image, title: product.name })}
                    title="Bấm để xem ảnh phóng to"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-black bg-neutral-100 px-2 py-0.5 rounded text-neutral-800">
                        {sku}
                      </span>
                      {product.brand && product.brand.trim() !== '' ? (
                        <span className="text-[10px] font-black uppercase text-amber-600">{product.brand}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-400">Phụ kiện</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900 truncate">{product.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[9px] font-black border ${genderBadge.className}`}
                      >
                        {genderBadge.label}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">{product.category}</span>
                      {product.isPromotion && (
                        <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          KM
                        </span>
                      )}
                      {product.isHot && (
                        <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                          <Flame size={9} className="fill-black" /> HOT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-sm text-neutral-900">{formatVND(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatVND(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold block">Tồn kho</span>
                    <span className="font-black text-neutral-800">{totalStock} {unit}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold block">Trạng thái</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isDeleted
                          ? 'bg-rose-100 text-rose-700'
                          : status === 'Ẩn'
                          ? 'bg-neutral-200 text-neutral-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isDeleted ? 'Đã xóa' : status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setViewingProduct(product);
                        setIsDetailDrawerOpen(true);
                      }}
                      className="p-2 rounded-xl bg-neutral-100 text-neutral-700"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-2 rounded-xl bg-amber-100 text-amber-800"
                    >
                      <Edit size={16} />
                    </button>

                    {isDeleted ? (
                      <button
                        onClick={() => handleRestoreProduct(product)}
                        className="px-2 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                      >
                        Khôi phục
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setDeletingProduct(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-rose-100 text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 26. PHÂN TRANG (PAGINATION CONTROLS)                */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items per page selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
          <span>Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-neutral-100 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-black outline-hidden cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>sản phẩm / trang</span>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-neutral-100 disabled:opacity-40 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`h-8 w-8 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                currentPage === pg
                  ? 'bg-black text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-neutral-100 disabled:opacity-40 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 8. DRAWER / MODAL XEM CHI TIẾT SẢN PHẨM               */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDetailDrawerOpen && viewingProduct && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                        CHI TIẾT SẢN PHẨM
                      </span>
                      {viewingProduct.isPromotion && (
                        <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          KM
                        </span>
                      )}
                      {viewingProduct.isHot && (
                        <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                          <Flame size={10} className="fill-black" /> HOT
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-neutral-900">{viewingProduct.name}</h2>
                  </div>
                  <button
                    onClick={() => setIsDetailDrawerOpen(false)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Main Image Gallery Preview */}
                <div className="space-y-3 mb-6">
                  <div className="aspect-square w-full rounded-3xl bg-white p-6 border border-neutral-200 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={viewingProduct.image}
                      alt={viewingProduct.name}
                      className="max-h-full object-contain drop-shadow-md"
                    />
                    <span className="absolute top-4 left-4 font-mono text-xs font-black bg-black text-white px-2.5 py-1 rounded-lg">
                      SKU: {getProductSku(viewingProduct)}
                    </span>
                  </div>

                  {viewingProduct.images && viewingProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {viewingProduct.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Thumbnail"
                          className="h-16 w-16 rounded-xl object-contain bg-white border p-1 border-neutral-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 mb-6 text-xs font-bold">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Đối tượng</span>
                    <span className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-black border bg-white border-neutral-200 text-neutral-800">
                      {viewingProduct.gender || 'Chưa phân loại'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Thương hiệu</span>
                    <span className="text-neutral-900 font-black text-sm">
                      {viewingProduct.brand && viewingProduct.brand.trim() !== ''
                        ? viewingProduct.brand
                        : 'Không áp dụng (Phụ kiện)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Danh mục / Loại</span>
                    <span className="text-neutral-900 font-black text-sm">{viewingProduct.category}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Giá bán hiện tại</span>
                    <span className="text-emerald-600 font-black text-base">{formatVND(viewingProduct.price)}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Giá gốc ban đầu</span>
                    <span className="text-neutral-500 font-extrabold line-through text-sm">
                      {viewingProduct.originalPrice ? formatVND(viewingProduct.originalPrice) : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Nhóm sản phẩm</span>
                    <span className="text-neutral-900 font-black text-sm">
                      {isAccessoryCategory(viewingProduct.category) ? '🎒 Phụ kiện' : '👟 Giày dép'}
                    </span>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">Mô tả ngắn</h4>
                    <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                      {viewingProduct.shortDescription || 'Mẫu sản phẩm thời trang chính hãng cao cấp.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase text-neutral-400 mb-1">Mô tả chi tiết</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 whitespace-pre-line">
                      {viewingProduct.description}
                    </p>
                  </div>
                </div>

                {/* Size & Stock Breakdown Matrix OR Accessory Stock */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black uppercase text-neutral-900">
                      {isAccessoryCategory(viewingProduct.category)
                        ? 'Chi tiết Tồn Kho Phụ Kiện'
                        : 'Chi tiết Tồn Kho Theo Size'}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-600">
                      Tổng: {getProductTotalStock(viewingProduct)} {getProductUnit(viewingProduct)}
                    </span>
                  </div>

                  {isAccessoryCategory(viewingProduct.category) ? (
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-neutral-900">Tồn kho phụ kiện sẵn có</span>
                        <p className="text-[11px] text-neutral-500">Sản phẩm phụ kiện không áp dụng size giày dép.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-amber-600">
                          {getProductTotalStock(viewingProduct)} cái / sản phẩm
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {ALL_SIZES.map((sz) => {
                        const qty = viewingProduct.sizeStock
                          ? viewingProduct.sizeStock[sz] ?? 0
                          : viewingProduct.sizes?.includes(sz)
                          ? 8
                          : 0;
                        return (
                          <div
                            key={sz}
                            className={`p-2.5 rounded-xl border text-center ${
                              qty > 0
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                : 'bg-neutral-100/60 border-neutral-200 text-neutral-400'
                            }`}
                          >
                            <span className="block text-[10px] font-black uppercase text-neutral-400">
                              Size {sz}
                            </span>
                            <span className="text-xs font-black">{qty} đôi</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-[11px] text-neutral-400 space-y-1 font-medium pt-4 border-t border-neutral-200">
                  <p>Ngày tạo: {getProductCreatedAt(viewingProduct)}</p>
                  <p>Cập nhật gần nhất: {viewingProduct.updatedAt || getProductCreatedAt(viewingProduct)}</p>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-neutral-200 flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsDetailDrawerOpen(false);
                    handleOpenEditModal(viewingProduct);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  <span>Chỉnh sửa sản phẩm</span>
                </button>

                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 9 - 23. MODAL THÊM / CHỈNH SỬA SẢN PHẨM (FORM)        */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Form Title Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-black text-neutral-900 uppercase">
                    {editingProduct ? 'CHỈNH SỬA SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Nhập thông tin sản phẩm chi tiết, quản lý hình ảnh và cài đặt số lượng tồn kho.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 text-xs font-bold">
                {/* Row 1: Tên & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-neutral-800 mb-1">
                      Tên sản phẩm <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Nike Air Jordan 1 Low Golf"
                      className={`w-full bg-neutral-50 p-3 rounded-2xl border ${
                        formErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
                      } outline-hidden text-xs font-bold`}
                    />
                    {formErrors.name && (
                      <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-neutral-800 mb-1">
                      Mã SKU <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="VD: NK001, SB001"
                      className={`w-full bg-neutral-50 p-3 rounded-2xl border ${
                        formErrors.sku ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
                      } outline-hidden font-mono uppercase text-xs font-bold`}
                    />
                    {formErrors.sku && (
                      <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.sku}</p>
                    )}
                  </div>
                </div>

                {/* Row 2 & 3: Phụ kiện (Tinh gọn) vs Giày dép (Đầy đủ) */}
                {isAccessoryCategory(formData.category) ? (
                  <>
                    {/* Row 2: Danh mục & Trạng thái kinh doanh */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Danh mục */}
                      <div>
                        <label className="block text-neutral-800 mb-1 flex items-center justify-between">
                          <span>
                            Danh mục sản phẩm <span className="text-rose-500">*</span>
                          </span>
                          <span className="text-[10px] text-amber-600 font-bold">
                            🎒 Nhóm Phụ kiện
                          </span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            const newCategory = e.target.value as CategoryName;
                            const isAcc = isAccessoryCategory(newCategory);
                            setFormData((prev) => ({
                              ...prev,
                              category: newCategory,
                              gender: isAcc ? 'Unisex' : (prev.gender || 'Nam'),
                              brand: isAcc ? undefined : (prev.brand || 'Nike'),
                              isPromotion: isAcc ? false : prev.isPromotion,
                              isHot: isAcc ? false : prev.isHot,
                            }));
                            setShowZeroStockConfirm(false);
                            if (formErrors.category) {
                              setFormErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.category;
                                return copy;
                              });
                            }
                            if (isAcc && formErrors.brand) {
                              setFormErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.brand;
                                return copy;
                              });
                            }
                          }}
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold cursor-pointer"
                        >
                          {categoryOptions.map((catName) => (
                            <option key={catName} value={catName}>
                              {catName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Trạng thái kinh doanh */}
                      <div>
                        <label className="block text-neutral-800 mb-1">
                          Trạng thái kinh doanh
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as 'Đang bán' | 'Ẩn' | 'Ngừng kinh doanh',
                            })
                          }
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold cursor-pointer"
                        >
                          <option value="Đang bán">Đang bán</option>
                          <option value="Ẩn">Ẩn (Tạm ngưng hiển thị)</option>
                          <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Giá bán & Giá gốc niêm yết */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-800 mb-1">
                          Giá bán (VND) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          placeholder="VD: 50000"
                          className={`w-full bg-neutral-50 p-3 rounded-2xl border ${
                            formErrors.price ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
                          } outline-hidden text-xs font-bold`}
                        />
                        {formErrors.price && (
                          <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-neutral-800 mb-1">Giá niêm yết (Giá gốc) (VND)</label>
                        <input
                          type="number"
                          value={formData.originalPrice || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          placeholder="VD: 80000"
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Row 2: Đối tượng & Danh mục / Loại sản phẩm & Thương hiệu */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Đối tượng */}
                      <div>
                        <label className="block text-neutral-800 mb-1 flex items-center justify-between">
                          <span>
                            Đối tượng <span className="text-rose-500">*</span>
                          </span>
                          <span className="text-[10px] text-neutral-400 font-normal">Nam / Nữ / Trẻ em / Unisex</span>
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value as GenderType })
                          }
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold cursor-pointer"
                        >
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Danh mục / Loại sản phẩm */}
                      <div>
                        <label className="block text-neutral-800 mb-1 flex items-center justify-between">
                          <span>
                            Loại sản phẩm (Danh mục) <span className="text-rose-500">*</span>
                          </span>
                          <span className="text-[10px] text-neutral-500 font-bold">
                            👟 Giày dép
                          </span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            const newCategory = e.target.value as CategoryName;
                            const isAcc = isAccessoryCategory(newCategory);
                            setFormData((prev) => ({
                              ...prev,
                              category: newCategory,
                              gender: isAcc ? 'Unisex' : (prev.gender || 'Nam'),
                              brand: isAcc ? undefined : (prev.brand || 'Nike'),
                              isPromotion: isAcc ? false : prev.isPromotion,
                              isHot: isAcc ? false : prev.isHot,
                            }));
                            setShowZeroStockConfirm(false);
                            if (formErrors.category) {
                              setFormErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.category;
                                return copy;
                              });
                            }
                          }}
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold cursor-pointer"
                        >
                          {categoryOptions.map((catName) => (
                            <option key={catName} value={catName}>
                              {catName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Thương hiệu (Bắt buộc khi là sản phẩm Giày dép) */}
                      <div>
                        <label className="block text-neutral-800 mb-1">
                          Thương hiệu <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.brand || 'Nike'}
                          onChange={(e) => {
                            setFormData({ ...formData, brand: e.target.value as BrandName });
                            if (formErrors.brand) {
                              setFormErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.brand;
                                return copy;
                              });
                            }
                          }}
                          className={`w-full bg-neutral-50 p-3 rounded-2xl border ${
                            formErrors.brand ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
                          } outline-hidden text-xs font-bold cursor-pointer`}
                        >
                          {brandOptions.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        {formErrors.brand && (
                          <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.brand}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Trạng thái kinh doanh & Giá bán & Giá gốc */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-neutral-800 mb-1">
                          Trạng thái kinh doanh
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as 'Đang bán' | 'Ẩn' | 'Ngừng kinh doanh',
                            })
                          }
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold cursor-pointer"
                        >
                          <option value="Đang bán">Đang bán</option>
                          <option value="Ẩn">Ẩn (Tạm ngưng hiển thị)</option>
                          <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-800 mb-1">
                          Giá bán sau giảm (VND) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          placeholder="2490000"
                          className={`w-full bg-neutral-50 p-3 rounded-2xl border ${
                            formErrors.price ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
                          } outline-hidden text-xs font-bold`}
                        />
                        {formErrors.price && (
                          <p className="text-rose-500 text-[11px] font-bold mt-1">{formErrors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-neutral-800 mb-1">Giá gốc niêm yết (VND)</label>
                        <input
                          type="number"
                          value={formData.originalPrice || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          placeholder="2890000"
                          className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-bold"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 1. THÊM CHECKBOX KM VÀ HOT (NHÃN SẢN PHẨM) - CHỈ HIỂN THỊ VỚI GIÀY */}
                {!isAccessoryCategory(formData.category) && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Tag size={15} className="text-amber-500" />
                        <span>NHÃN SẢN PHẨM</span>
                      </label>
                      <span className="text-[11px] text-neutral-400 font-medium">Tùy chọn hiển thị badge nổi bật</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Checkbox KM (Khuyến mãi) */}
                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          formData.isPromotion
                            ? 'bg-rose-50/80 border-rose-400 text-rose-900 ring-1 ring-rose-300 shadow-2xs'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.isPromotion}
                            onChange={(e) => setFormData({ ...formData, isPromotion: e.target.checked })}
                            className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-black text-xs text-neutral-900">
                              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase">
                                KM
                              </span>
                              <span>Khuyến mãi</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                              Hiển thị nhãn KM & bộ lọc Khuyến mãi
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            formData.isPromotion
                              ? 'bg-rose-600 text-white'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {formData.isPromotion ? 'Đang bật' : 'Tắt'}
                        </span>
                      </label>

                      {/* Checkbox HOT (Nổi bật / Bán chạy) */}
                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          formData.isHot
                            ? 'bg-amber-50/80 border-amber-400 text-amber-950 ring-1 ring-amber-300 shadow-2xs'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.isHot}
                            onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                            className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-black text-xs text-neutral-900">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase flex items-center gap-0.5">
                                <Flame size={11} className="fill-black" /> HOT
                              </span>
                              <span>Sản phẩm HOT</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                              Hiển thị nhãn HOT & ưu tiên đề xuất
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            formData.isHot
                              ? 'bg-amber-500 text-black font-black'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {formData.isHot ? 'Đang bật' : 'Tắt'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Mô tả ngắn & chi tiết */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-neutral-800 mb-1">Mô tả ngắn sản phẩm</label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Tóm tắt đặc điểm nổi bật của mẫu sản phẩm trong 1 câu..."
                      className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 mb-1">Mô tả chi tiết sản phẩm</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Thông tin chất liệu, công nghệ, hướng dẫn bảo quản..."
                      className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 outline-hidden text-xs font-medium leading-relaxed"
                    />
                  </div>
                </div>

                {/* ==================================================== */}
                {/* PRODUCT MEDIA + INVENTORY GRID (2 CỘT SONG SONG)     */}
                {/* ==================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* CỘT TRÁI (45% ~ 5/12): QUẢN LÝ HÌNH ẢNH SẢN PHẨM */}
                  <div className="lg:col-span-5 p-5 bg-neutral-50 rounded-3xl border border-neutral-200/90 flex flex-col justify-between space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                        <div>
                          <h4 className="text-xs font-black uppercase text-neutral-900 flex items-center gap-1.5">
                            <ImageIcon size={16} className="text-amber-500" />
                            <span>QUẢN LÝ HÌNH ẢNH SẢN PHẨM</span>
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                            Danh sách ảnh đã chọn ({formData.images.length}/10)
                          </p>
                        </div>

                        {/* Hidden input type="file" for OS File Explorer */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          multiple
                          className="hidden"
                        />

                        {/* NÚT CHỌN ẢNH DUY NHẤT */}
                        <button
                          type="button"
                          onClick={() => {
                            setImageUploadError('');
                            fileInputRef.current?.click();
                          }}
                          disabled={formData.images.length >= 10}
                          className="px-3 py-2 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs active:scale-95"
                        >
                          <Upload size={14} />
                          <span>Thêm ảnh từ máy tính</span>
                        </button>
                      </div>

                      {/* Lỗi Upload / Form Errors */}
                      {imageUploadError && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                          <AlertTriangle size={15} className="shrink-0 text-rose-500" />
                          <span>{imageUploadError}</span>
                        </div>
                      )}

                      {formErrors.images && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                          <AlertTriangle size={15} className="shrink-0 text-rose-500" />
                          <span>{formErrors.images}</span>
                        </div>
                      )}

                      {/* Empty state when no images selected yet */}
                      {formData.images.length === 0 && (
                        <div className="my-3 py-12 text-center text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-300 flex flex-col items-center justify-center">
                          <ImageIcon size={36} className="mx-auto mb-2 opacity-40 text-neutral-400" />
                          <p className="text-xs font-bold text-neutral-700">Chưa có hình ảnh nào được chọn</p>
                          <p className="text-[11px] text-neutral-400 font-medium mt-1">
                            Bấm <strong>"Thêm ảnh từ máy tính"</strong> để tải ảnh (tối đa 10 ảnh).
                          </p>
                        </div>
                      )}

                      {/* Images Gallery Grid - 2 Cột Trên Desktop, Cuộn Tự Nhiên Khi Nhiều Ảnh */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2.5 pt-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                          {formData.images.map((imgUrl, index) => {
                            const isMain = index === formData.selectedMainImageIndex;
                            const meta = imageMetaMap[imgUrl];
                            const fileName = meta?.name || `Ảnh ${index + 1}`;

                            return (
                              <div
                                key={index}
                                className={`relative group rounded-2xl bg-white p-2 border transition-all flex flex-col justify-between ${
                                  isMain
                                    ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-2xs'
                                }`}
                              >
                                {/* Image Thumbnail Box */}
                                <div className="relative aspect-square w-full rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden">
                                  {/* Badge Ảnh đại diện */}
                                  {isMain && (
                                    <span className="absolute top-1.5 left-1.5 z-10 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                                      <Star size={9} className="fill-black" />
                                      <span>ẢNH ĐẠI DIỆN</span>
                                    </span>
                                  )}

                                  {/* Nút Xóa ảnh nhỏ gọn */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const filtered = formData.images.filter((_, idx) => idx !== index);
                                      let nextMainIndex = formData.selectedMainImageIndex;
                                      if (index === formData.selectedMainImageIndex) {
                                        nextMainIndex = 0;
                                      } else if (index < formData.selectedMainImageIndex) {
                                        nextMainIndex = Math.max(0, formData.selectedMainImageIndex - 1);
                                      }
                                      setFormData({
                                        ...formData,
                                        images: filtered,
                                        selectedMainImageIndex:
                                          filtered.length === 0
                                            ? 0
                                            : Math.min(nextMainIndex, filtered.length - 1),
                                      });
                                    }}
                                    className="absolute top-1.5 right-1.5 z-10 h-6 w-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                                    title="Xóa ảnh"
                                  >
                                    <Trash2 size={11} />
                                  </button>

                                  {/* Product Image */}
                                  <img
                                    src={imgUrl}
                                    alt={fileName}
                                    className="max-h-full max-w-full object-contain cursor-pointer transition-transform hover:scale-105"
                                    onClick={() =>
                                      setPreviewEnlargeImage({
                                        url: imgUrl,
                                        title: fileName,
                                        size: meta?.size || '',
                                      })
                                    }
                                  />
                                </div>

                                {/* Card Footer: Label & Đổi ảnh đại diện */}
                                <div className="mt-2 pt-1 border-t border-neutral-100 flex items-center justify-between gap-1 text-[10px]">
                                  <span
                                    className="font-bold text-neutral-600 truncate max-w-[65px]"
                                    title={fileName}
                                  >
                                    {fileName}
                                  </span>

                                  {/* Thao tác đổi ảnh đại diện */}
                                  {!isMain ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFormData({ ...formData, selectedMainImageIndex: index })
                                      }
                                      className="text-neutral-500 hover:text-amber-600 font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                                      title="Đặt làm ảnh đại diện"
                                    >
                                      <Star size={10} className="text-amber-500" />
                                      <span>Đặt đại diện</span>
                                    </button>
                                  ) : (
                                    <span className="text-amber-600 font-black text-[10px]">Mặc định</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỘT PHẢI (55% ~ 7/12): QUẢN LÝ BẢNG SIZE VÀ TỒN KHO HOẶC TỒN KHO PHỤ KIỆN */}
                  <div className="lg:col-span-7 p-5 bg-neutral-50 rounded-3xl border border-neutral-200/90 flex flex-col justify-between space-y-3.5">
                    {isAccessoryCategory(formData.category) ? (
                      /* ACCESSORY GENERAL INVENTORY UI */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                          <div>
                            <h4 className="text-xs font-black uppercase text-neutral-900 flex items-center gap-1.5">
                              <Package size={16} className="text-amber-500" />
                              <span>QUẢN LÝ TỒN KHO</span>
                            </h4>
                            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                              Sản phẩm phụ kiện quản lý theo tổng số lượng tồn kho trong kho.
                            </p>
                          </div>

                          <div className="text-right bg-white px-3.5 py-1.5 rounded-xl border border-neutral-200 shrink-0 shadow-2xs">
                            <span className="text-[9px] uppercase font-black text-neutral-400 block">
                              TỔNG TỒN KHO
                            </span>
                            <span className="text-sm font-black text-amber-600">
                              {formData.generalStock} cái
                            </span>
                          </div>
                        </div>

                        {formErrors.generalStock && (
                          <p className="text-rose-500 text-[11px] font-bold mt-2">{formErrors.generalStock}</p>
                        )}

                        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2">
                          <label className="block text-neutral-800 text-xs font-bold">
                            Số lượng tồn kho trong kho <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={formData.generalStock}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  generalStock: Math.max(0, parseInt(e.target.value || '0', 10) || 0),
                                })
                              }
                              placeholder="Nhập số lượng tồn kho..."
                              className="w-full bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-sm font-black outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                              cái / bộ
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SHOES SIZE MATRIX UI */
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                          <div>
                            <h4 className="text-xs font-black uppercase text-neutral-900 flex items-center gap-1.5">
                              <Layers size={16} className="text-amber-500" />
                              <span>QUẢN LÝ BẢNG SIZE VÀ TỒN KHO</span>
                            </h4>
                            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                              Chọn size và nhập tồn kho cho từng size
                            </p>
                          </div>

                          <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shrink-0">
                            <span className="text-[9px] uppercase font-black text-neutral-400 block">
                              TỔNG TỒN KHO
                            </span>
                            <span className="text-sm font-black text-amber-600">
                              {formData.sizes.reduce(
                                (sum: number, sz: number) => sum + (Number(formData.sizeStock[sz]) || 0),
                                0
                              )}{' '}
                              đôi
                            </span>
                          </div>
                        </div>

                        {formErrors.sizes && (
                          <p className="text-rose-500 text-[11px] font-bold mt-2">{formErrors.sizes}</p>
                        )}

                        {/* Size Cards Grid - Ma trận 3x3 cân đối cho 9 size 36 -> 44 */}
                        <div className="grid grid-cols-3 gap-2.5 pt-3">
                          {ALL_SIZES.map((sz) => {
                            const isSelected = formData.sizes.includes(sz);
                            const currentStock = isSelected ? (formData.sizeStock[sz] ?? 0) : 0;

                            return (
                              <div
                                key={sz}
                                onClick={() => {
                                  if (!isSelected) {
                                    // Kích hoạt size
                                    const prevVal = formData.sizeStock[sz];
                                    const initVal = prevVal && prevVal > 0 ? prevVal : 5;
                                    setFormData({
                                      ...formData,
                                      sizes: [...formData.sizes, sz].sort((a, b) => a - b),
                                      sizeStock: { ...formData.sizeStock, [sz]: initVal },
                                    });
                                  }
                                }}
                                className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col justify-between gap-2 ${
                                  isSelected
                                    ? 'bg-amber-50/40 border-amber-500 ring-1 ring-amber-400/30 shadow-2xs cursor-default'
                                    : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300 cursor-pointer'
                                }`}
                              >
                                {/* Checkbox Header */}
                                <label
                                  className="flex items-center justify-center gap-1.5 cursor-pointer select-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      if (checked) {
                                        const prevVal = formData.sizeStock[sz];
                                        const initVal = prevVal && prevVal > 0 ? prevVal : 5;
                                        setFormData({
                                          ...formData,
                                          sizes: [...formData.sizes, sz].sort((a, b) => a - b),
                                          sizeStock: { ...formData.sizeStock, [sz]: initVal },
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          sizes: formData.sizes.filter((s) => s !== sz),
                                          sizeStock: { ...formData.sizeStock, [sz]: 0 },
                                        });
                                      }
                                    }}
                                    className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                                  />
                                  <span
                                    className={`text-xs font-black ${
                                      isSelected ? 'text-neutral-900' : 'text-neutral-500'
                                    }`}
                                  >
                                    Size {sz}
                                  </span>
                                </label>

                                {/* Ô nhập tồn kho */}
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  disabled={!isSelected}
                                  value={isSelected ? currentStock : 0}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const rawVal = e.target.value;
                                    if (rawVal === '') {
                                      setFormData({
                                        ...formData,
                                        sizeStock: { ...formData.sizeStock, [sz]: 0 },
                                      });
                                      return;
                                    }
                                    const cleanNum = parseInt(rawVal.replace(/[^0-9]/g, ''), 10);
                                    const val = isNaN(cleanNum) ? 0 : Math.max(0, cleanNum);
                                    setFormData({
                                      ...formData,
                                      sizeStock: { ...formData.sizeStock, [sz]: val },
                                    });
                                  }}
                                  className={`w-full text-center py-1.5 rounded-xl text-xs font-black outline-hidden transition-all ${
                                    isSelected
                                      ? 'bg-white border border-neutral-300 text-neutral-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                                      : 'bg-neutral-100/70 border border-neutral-200 text-neutral-300 cursor-not-allowed'
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Submit Button */}
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-2xl bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    {isSubmitting ? (
                      <span>Đang lưu...</span>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>LƯU SẢN PHẨM</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 24. MODAL XÁC NHẬN XÓA MỀM (SOFT DELETE MODAL)        */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-lg font-black text-neutral-900 mb-2">
                Bạn có chắc muốn xóa sản phẩm này?
              </h3>

              <p className="text-xs text-neutral-500 font-medium mb-6 leading-relaxed">
                Sản phẩm <span className="font-bold text-neutral-900">"{deletingProduct.name}"</span> sẽ được chuyển sang trạng thái <span className="text-rose-600 font-bold">Xóa mềm</span> và bị ẩn khỏi website khách hàng. Bạn có thể khôi phục bất kỳ lúc nào trong Quản trị Admin.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  onClick={handleConfirmSoftDelete}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Đồng ý Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 27. MODAL IMPORT EXCEL / CSV                         */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-emerald-600" />
                  <span>IMPORT DỮ LIỆU SẢN PHẨM</span>
                </h3>
                <button onClick={() => setIsImportModalOpen(false)} className="text-neutral-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <p className="text-neutral-600 font-medium leading-relaxed">
                  Dán nội dung CSV theo định dạng: <code className="bg-neutral-100 px-1 py-0.5 rounded text-black font-mono">SKU, Tên sản phẩm, Thương hiệu, Danh mục, Giá bán</code>
                </p>

                <textarea
                  rows={6}
                  value={importCsvText}
                  onChange={(e) => setImportCsvText(e.target.value)}
                  placeholder={`SKU, Tên sản phẩm, Thương hiệu, Danh mục, Giá bán\nNK009, Nike Air Force 1 '07, Nike, Sneaker, 2800000\nAD008, Adidas Forum Low, Adidas, Lifestyle, 2400000`}
                  className="w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 font-mono text-xs outline-hidden leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImportCsvText(
                        `SKU, Tên sản phẩm, Thương hiệu, Danh mục, Giá bán\nNK101, Nike Pegasus 40 Running, Nike, Running, 3400000\nAD102, Adidas NMD R1 V3, Adidas, Lifestyle, 3100000\nPM103, Puma Slipstream Leather, Puma, Sneaker, 2600000`
                      );
                    }}
                    className="text-amber-600 hover:underline text-xs font-bold cursor-pointer"
                  >
                    + Nạp dữ liệu mẫu
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleProcessImportCsv}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase shadow-md cursor-pointer"
                    >
                      Xác nhận Import
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL XEM ẢNH LỚN (ENLARGE IMAGE LIGHTBOX)           */}
      {/* ==================================================== */}
      <AnimatePresence>
        {previewEnlargeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewEnlargeImage(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 bg-white rounded-3xl p-5 max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <div>
                  <h4 className="text-sm font-black text-neutral-900 truncate max-w-md">
                    {previewEnlargeImage.title || 'Xem phóng to hình ảnh'}
                  </h4>
                  {previewEnlargeImage.size && (
                    <p className="text-xs text-neutral-500 font-mono">Dung lượng: {previewEnlargeImage.size}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewEnlargeImage(null)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[65vh] flex items-center justify-center bg-neutral-900 rounded-2xl p-4 overflow-hidden">
                <img
                  src={previewEnlargeImage.url}
                  alt="Enlarged preview"
                  className="max-h-[55vh] max-w-full object-contain rounded-xl drop-shadow-lg"
                />
              </div>

              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={() => setPreviewEnlargeImage(null)}
                  className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
