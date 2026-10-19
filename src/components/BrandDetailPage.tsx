import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  Package,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Search,
  ArrowUpDown,
  X
} from 'lucide-react';
import { BrandItem, Product, CategoryItem } from '../types';
import BrandLogo from './BrandLogo';
import ProductCard from './ProductCard';

interface BrandDetailPageProps {
  brand: BrandItem;
  products: Product[];
  categories?: CategoryItem[];
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }) => void;
  onNavigateHome?: () => void;
  onBackToHome?: () => void;
  onNavigateBrands?: () => void;
  onBackToBrands?: () => void;
  onNavigateProductDetail?: (product: Product) => void;
  onViewAllProducts?: () => void;
}

export default function BrandDetailPage({
  brand,
  products,
  categories,
  favorites,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
  onNavigateHome,
  onBackToHome,
  onNavigateBrands,
  onBackToBrands,
  onNavigateProductDetail,
  onViewAllProducts
}: BrandDetailPageProps) {
  const handleHome = onNavigateHome || onBackToHome || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  const handleBrands = onNavigateBrands || onBackToBrands || handleHome;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products strictly belonging to this brand
  const brandProducts = useMemo(() => {
    const brandNameClean = (brand.name || '').toLowerCase().trim();
    return products.filter((p) => {
      if (p.isDeleted || p.status === 'Ẩn' || p.status === 'Ngừng kinh doanh' || p.status === 'Đã xóa') {
        return false;
      }
      const productBrandClean = (p.brand || '').toLowerCase().trim();
      return productBrandClean === brandNameClean;
    });
  }, [brand, products]);

  // Extract unique categories available in this brand from actual products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [brandProducts]);

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let result = brandProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q));
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured
    });

    return result;
  }, [brandProducts, searchQuery, selectedCategory, sortBy]);

  // Paginated products
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedProducts, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-6 sm:py-10" id="brand-detail-root">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-5" aria-label="Breadcrumb">
          <button
            onClick={handleHome}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Trang chủ
          </button>
          <ChevronRight size={13} className="text-neutral-400" />
          <button
            onClick={handleBrands}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Thương hiệu
          </button>
          <ChevronRight size={13} className="text-neutral-400" />
          <span className="text-neutral-900 font-bold">{brand.name}</span>
        </nav>

        {/* 2. BRAND HERO HEADER CARD (Balanced horizontal layout ~180–220px) */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 mb-6 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-7 relative z-10">
            
            {/* BÊN TRÁI: Logo thương hiệu */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 p-3.5 flex items-center justify-center shrink-0 shadow-2xs">
              <BrandLogo
                logo={brand.logo}
                brandName={brand.name}
                className="h-full w-full max-h-20 max-w-20"
                imageClassName="h-full w-full object-contain"
              />
            </div>

            {/* BÊN PHẢI / Ở GIỮA: Thông tin thương hiệu */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={11} className="text-amber-400 shrink-0" />
                  <span>Chính hãng</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider border border-amber-200/80">
                  <Package size={11} className="text-amber-600 shrink-0" />
                  <span>{brandProducts.length} sản phẩm</span>
                </span>
              </div>

              {/* Tên thương hiệu & Phân loại */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
                  {brand.name}
                </h1>
                <span className="text-xs font-semibold text-neutral-500">
                  Thương hiệu thể thao{brand.tagline ? ` • "${brand.tagline}"` : ''}
                </span>
              </div>

              {/* Mô tả ngắn */}
              <p className="text-xs text-neutral-600 font-normal mt-1.5 leading-relaxed max-w-3xl">
                {brand.description || `Khám phá các sản phẩm ${brand.name} dành cho thể thao, luyện tập và phong cách hàng ngày tại K-NICKS.`}
              </p>

              {/* DÒNG THÔNG TIN THƯƠNG HIỆU */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-7 pt-3 mt-3 border-t border-neutral-100 text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sản phẩm</span>
                  <span className="text-sm sm:text-base font-black text-neutral-900">{brandProducts.length}</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Danh mục</span>
                  <span className="text-sm sm:text-base font-black text-neutral-900">{availableCategories.length}</span>
                </div>
                <div className="h-6 w-px bg-neutral-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Thương hiệu</span>
                  <span className="text-sm sm:text-base font-black text-neutral-900">{brand.name}</span>
                </div>
                {brand.country && (
                  <>
                    <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                    <div className="flex flex-col hidden sm:flex">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Xuất xứ</span>
                      <span className="text-sm sm:text-base font-black text-neutral-900">{brand.country}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Subtle decorative background blur */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 3. DÒNG SẢN PHẨM (Brand Categories) */}
        {availableCategories.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 mb-6 shadow-2xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900">
                  Dòng sản phẩm
                </h2>
                <span className="text-[11px] font-bold text-neutral-400">
                  • {availableCategories.length} danh mục của {brand.name}
                </span>
              </div>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={11} />
                  <span>Xem tất cả ({brandProducts.length})</span>
                </button>
              )}
            </div>

            {/* Category Pills (Clickable, Resets currentPage to 1) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-black border border-neutral-200/80'
                }`}
              >
                Tất cả ({brandProducts.length})
              </button>
              {availableCategories.map((cat) => {
                const count = brandProducts.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'All' : cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-black border border-neutral-200/80'
                    }`}
                  >
                    {cat} <span className={`ml-1 text-[10px] ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. PRODUCTS SECTION */}
        <div id="brand-products-section" className="scroll-mt-24">
          
          {/* Section Header & Search/Sort controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBrands}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-black transition-colors md:hidden"
                >
                  <ArrowLeft size={14} />
                  <span>Tất cả thương hiệu</span>
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1">
                SẢN PHẨM {brand.name}
                {selectedCategory !== 'All' && (
                  <span className="text-amber-600 font-bold ml-2 text-base sm:text-lg">
                    • {selectedCategory}
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-500 font-normal mt-0.5">
                {displayedProducts.length === 0 ? (
                  <span>Không có sản phẩm nào phù hợp</span>
                ) : (
                  <span>
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, displayedProducts.length)} trong tổng số {displayedProducts.length} sản phẩm {selectedCategory !== 'All' ? `thuộc dòng ${selectedCategory}` : ''} của {brand.name}
                  </span>
                )}
              </p>
            </div>

            {/* Search & Sort inside brand */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search within brand */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={`Tìm trong ${brand.name}...`}
                  className="w-44 sm:w-56 pl-8 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sorter select */}
              <div className="relative flex items-center bg-white border border-neutral-200 rounded-xl px-3 py-2 shadow-2xs">
                <ArrowUpDown size={13} className="text-neutral-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs font-bold text-neutral-800 outline-none cursor-pointer pr-2"
                >
                  <option value="featured">Nổi bật nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Category Filter Tag if active */}
          {selectedCategory !== 'All' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Đang lọc dòng:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold shadow-2xs">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                  className="text-white/70 hover:text-white cursor-pointer ml-0.5"
                  title="Xóa lọc dòng"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {/* 5. PRODUCTS GRID */}
          {displayedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#E5E7EB] shadow-2xs my-4">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
                <Package size={24} />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                {brandProducts.length === 0
                  ? `Chưa có sản phẩm nào thuộc thương hiệu ${brand.name}`
                  : `Không tìm thấy sản phẩm phù hợp`}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-5">
                {brandProducts.length === 0
                  ? `Các sản phẩm mới của ${brand.name} đang được cập nhật vào kho hàng K-NICKS. Vui lòng quay lại sau!`
                  : `Không có sản phẩm nào thuộc ${brand.name} khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.`}
              </p>
              {brandProducts.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSortBy('featured');
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedProducts.map((prod) => (
                  <ProductCard
                    key={`brand-prod-${prod.id}`}
                    product={prod}
                    onQuickView={(p) => onQuickView(p)}
                    onAddToCart={(p, sz, cl) => onAddToCart(p, sz, cl)}
                    isFavorite={favorites.some((item) => item.id === prod.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8 pt-5 border-t border-neutral-200/60">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      const el = document.getElementById('brand-products-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className={`h-9 px-3 rounded-xl text-xs font-bold transition-all ${
                      currentPage === 1
                        ? 'text-neutral-300 bg-neutral-100 cursor-not-allowed'
                        : 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 cursor-pointer shadow-2xs'
                    }`}
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        const el = document.getElementById('brand-products-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`h-9 w-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      const el = document.getElementById('brand-products-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className={`h-9 px-3 rounded-xl text-xs font-bold transition-all ${
                      currentPage === totalPages
                        ? 'text-neutral-300 bg-neutral-100 cursor-not-allowed'
                        : 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 cursor-pointer shadow-2xs'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
