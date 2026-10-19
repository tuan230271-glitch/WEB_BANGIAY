import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Tag, 
  ArrowRight, 
  Percent, 
  Search, 
  ChevronRight, 
  Sparkles, 
  SlidersHorizontal,
  PackageX,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product, BrandItem } from '../types';
import ProductCard from './ProductCard';

interface PromotionsPageProps {
  products: Product[];
  brands?: BrandItem[];
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }) => void;
  onNavigateHome?: () => void;
  onBackToHome?: () => void;
  onNavigateProducts?: () => void;
  onNavigateBrand?: (brand: BrandItem) => void;
  onNavigateProductDetail?: (product: Product) => void;
}

export default function PromotionsPage({
  products,
  brands = [],
  favorites,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
  onNavigateHome,
  onBackToHome,
  onNavigateProducts,
  onNavigateBrand,
  onNavigateProductDetail
}: PromotionsPageProps) {
  const handleHome = onNavigateHome || onBackToHome || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  const handleProducts = onNavigateProducts || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  const handleProductClick = onNavigateProductDetail || onQuickView;

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'discount-desc' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('discount-desc');

  // 1. BASE PROMOTION PRODUCTS: Only active, non-deleted items with isPromotion === true
  const promotionProducts = useMemo(() => {
    return products.filter(
      (p) => !p.isDeleted && p.status !== 'Ẩn' && p.status !== 'Ngừng kinh doanh' && p.isPromotion === true
    );
  }, [products]);

  // Unique Brands & Categories among real promo items
  const promoBrands = useMemo(() => {
    const brandSet = new Set<string>();
    promotionProducts.forEach((p) => {
      if (p.brand) brandSet.add(p.brand);
    });
    return Array.from(brandSet);
  }, [promotionProducts]);

  const promoCategories = useMemo(() => {
    const catSet = new Set<string>();
    promotionProducts.forEach((p) => {
      if (p.category) catSet.add(p.category);
    });
    return Array.from(catSet);
  }, [promotionProducts]);

  // Max discount calculation across real promotion products
  const maxDiscount = useMemo(() => {
    if (promotionProducts.length === 0) return 0;
    const discounts = promotionProducts.map((p) => {
      if (p.originalPrice && p.originalPrice > p.price) {
        return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      }
      return 0;
    });
    return Math.max(0, ...discounts);
  }, [promotionProducts]);

  // Filtered and Sorted Promo Products
  const filteredProducts = useMemo(() => {
    let result = [...promotionProducts];

    // Filter by Brand
    if (selectedBrand !== 'All') {
      result = result.filter(
        (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const discountA = a.originalPrice && a.originalPrice > a.price 
        ? Math.round(((a.originalPrice - a.price) / a.originalPrice) * 100) 
        : 0;
      const discountB = b.originalPrice && b.originalPrice > b.price 
        ? Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100) 
        : 0;

      switch (sortBy) {
        case 'discount-desc':
          return discountB - discountA;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
      }
    });

    return result;
  }, [promotionProducts, selectedBrand, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 pt-6" id="promotions-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-6" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={handleHome}
            className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
          >
            Trang chủ
          </button>
          <ChevronRight size={14} className="text-neutral-400" />
          <span className="text-neutral-900 font-bold">Khuyến mãi</span>
        </nav>

        {/* 2. HEADER TRANG */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-black uppercase tracking-wider">
              <Flame size={14} className="animate-pulse" />
              Ưu đãi độc quyền
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Cập nhật trực tiếp từ K-NICKS Store
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 uppercase tracking-tight mt-2">
            KHUYẾN MÃI
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl">
            Khám phá những ưu đãi hấp dẫn dành cho bạn tại K-NICKS.
          </p>
        </div>

        {/* 3. HERO KHUYẾN MÃI */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-10 mb-10 shadow-xl border border-neutral-800">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-neutral-800/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              {/* Badge: [ ƯU ĐÃI ĐANG DIỄN RA ] */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-amber-400 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>[ ƯU ĐÃI ĐANG DIỄN RA ]</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white mb-2">
                KHUYẾN MÃI ĐẶC BIỆT
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                Săn deal giày chính hãng với mức giá ưu đãi. Toàn bộ sản phẩm được kiểm định chất lượng 100% nguyên hộp kèm bảo hành chính hãng từ K-NICKS.
              </p>

              {/* Highlight Perks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-neutral-800/60 rounded-xl p-3 border border-neutral-700/50">
                  <Percent size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {maxDiscount > 0 ? `Giảm tới ${maxDiscount}%` : 'Giá cực tốt'}
                    </div>
                    <div className="text-[10px] text-neutral-400">Deal hot có hạn</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-neutral-800/60 rounded-xl p-3 border border-neutral-700/50">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">100% Chính Hãng</div>
                    <div className="text-[10px] text-neutral-400">Cam kết chất lượng</div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 bg-neutral-800/60 rounded-xl p-3 border border-neutral-700/50">
                  <RotateCcw size={18} className="text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Đổi Trả 30 Ngày</div>
                    <div className="text-[10px] text-neutral-400">Hỗ trợ nhanh chóng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Promo Stat Box */}
            <div className="shrink-0 lg:w-72 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-center items-center text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mb-1">
                {promotionProducts.length}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Sản phẩm đang khuyến mãi
              </div>
              <div className="mt-3 text-[11px] text-neutral-400">
                Đồng bộ tự động theo thời gian thực từ hệ thống K-NICKS
              </div>
            </div>
          </div>
        </div>

        {/* 4. CONTENT AREA: EMPTY STATE OR FILTERED PRODUCTS */}
        {promotionProducts.length === 0 ? (
          /* 6. KHÔNG CÓ SẢN PHẨM */
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-sm max-w-2xl mx-auto my-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 mb-6">
              <PackageX size={40} className="stroke-[1.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">
              CHƯA CÓ KHUYẾN MÃI
            </h3>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
              Hiện tại chưa có sản phẩm đang được khuyến mãi. Hãy quay lại sau!
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={handleProducts}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-black transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer"
              >
                <span>XEM TẤT CẢ SẢN PHẨM</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* 7. LỌC VÀ TÌM KIẾM */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 mb-8 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Brand filter tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
                  <span className="text-xs font-bold text-neutral-400 uppercase mr-1 shrink-0">
                    Thương hiệu:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('All')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedBrand === 'All'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Tất cả ({promotionProducts.length})
                  </button>
                  {promoBrands.map((brandName) => {
                    const count = promotionProducts.filter(
                      (p) => p.brand && p.brand.toLowerCase() === brandName.toLowerCase()
                    ).length;
                    return (
                      <button
                        key={brandName}
                        type="button"
                        onClick={() => setSelectedBrand(brandName)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          selectedBrand.toLowerCase() === brandName.toLowerCase()
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {brandName} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Search in promotions */}
                <div className="relative w-full lg:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm trong khuyến mãi..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 pl-9 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-colors"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Secondary filter & sorting bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                {/* Category filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  <span className="font-semibold text-neutral-400">Danh mục:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      selectedCategory === 'All'
                        ? 'bg-neutral-200 text-neutral-900 font-bold'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Tất cả
                  </button>
                  {promoCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? 'bg-neutral-200 text-neutral-900 font-bold'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-400 shrink-0">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-800 focus:border-neutral-900 focus:outline-none cursor-pointer"
                  >
                    <option value="discount-desc">% Giảm nhiều nhất</option>
                    <option value="price-asc">Giá thấp → cao</option>
                    <option value="price-desc">Giá cao → thấp</option>
                    <option value="newest">Mới nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="featured">Nổi bật</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Results Status */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center my-6">
                <p className="text-sm font-bold text-neutral-700">
                  Không tìm thấy sản phẩm khuyến mãi phù hợp với bộ lọc hiện tại.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              /* 4 & 8. PRODUCT GRID (Desktop: 4 cols, Tablet: 2-3 cols, Mobile: 2 cols) */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Hiển thị <span className="text-neutral-900 font-extrabold">{filteredProducts.length}</span> sản phẩm khuyến mãi
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.some((f) => f.id === product.id)}
                      onToggleFavorite={onToggleFavorite}
                      onQuickView={handleProductClick}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
