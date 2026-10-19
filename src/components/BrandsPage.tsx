import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, ArrowRight, Package, Globe, Tag, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { BrandItem, Product } from '../types';
import BrandLogo from './BrandLogo';

interface BrandsPageProps {
  brands: BrandItem[];
  products: Product[];
  onSelectBrand: (brand: BrandItem) => void;
  onNavigateHome?: () => void;
  onBackToHome?: () => void;
}

export default function BrandsPage({
  brands,
  products,
  onSelectBrand,
  onNavigateHome,
  onBackToHome
}: BrandsPageProps) {
  const handleHome = onNavigateHome || onBackToHome || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Filter only active, non-deleted brands
  const activeBrands = useMemo(() => {
    return brands.filter((b) => b.status === 'Đang hoạt động' && !b.isDeleted);
  }, [brands]);

  // Compute live product counts for each brand
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (!p.isDeleted && p.status !== 'Ẩn' && p.status !== 'Ngừng kinh doanh' && p.status !== 'Đã xóa') {
        const brandKey = (p.brand || '').toLowerCase().trim();
        map[brandKey] = (map[brandKey] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set<string>();
    activeBrands.forEach((b) => {
      if (b.country) set.add(b.country);
    });
    return Array.from(set);
  }, [activeBrands]);

  // Filtered brands based on search & country
  const filteredBrands = useMemo(() => {
    return activeBrands.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchName = b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q) || (b.tagline && b.tagline.toLowerCase().includes(q));
      const matchCountry = selectedCountry === 'All' || b.country === selectedCountry;
      return matchName && matchCountry;
    });
  }, [activeBrands, searchQuery, selectedCountry]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12" id="brands-page-root">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-6" aria-label="Breadcrumb">
          <button
            onClick={handleHome}
            className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
          >
            Trang chủ
          </button>
          <ChevronRight size={14} className="text-neutral-400" />
          <span className="text-neutral-900 font-bold">Thương hiệu</span>
        </nav>

        {/* 2. HEADER BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-10 mb-10 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-amber-400/30">
              <Sparkles size={13} className="text-amber-400" />
              <span>Đối tác chính hãng 100%</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-3">
              THƯƠNG HIỆU
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
              Khám phá các thương hiệu giày nổi bật tại <strong className="text-amber-400 font-bold">K-NICKS</strong>. 
              Cam kết 100% hàng chính hãng, bảo hành trọn vẹn, cập nhật những bộ sưu tập mới nhất.
            </p>
          </div>

          {/* Decorative geometric blur circles */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-32 -mb-10 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        </div>

        {/* 3. FILTER & SEARCH CONTROLS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thương hiệu theo tên, quốc gia..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Country filter chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="text-[11px] font-bold uppercase text-neutral-400 flex items-center gap-1 mr-1">
              <Globe size={13} />
              <span>Quốc gia:</span>
            </div>
            <button
              onClick={() => setSelectedCountry('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === 'All'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Tất cả ({activeBrands.length})
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCountry === c
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. BRANDS GRID */}
        {filteredBrands.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E7EB] shadow-xs my-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-4">
              <Tag size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Không tìm thấy thương hiệu phù hợp</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
              Không có thương hiệu nào khớp với từ khóa "{searchQuery}". Bạn có thể thử tìm kiếm từ khóa khác hoặc đặt lại bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
            >
              <RotateCcw size={14} />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredBrands.map((brand) => {
              const productCount = productCountMap[brand.name.toLowerCase().trim()] || 0;
              return (
                <motion.div
                  key={brand.id || brand.slug}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelectBrand(brand)}
                  className="group relative cursor-pointer rounded-2xl bg-white p-5 sm:p-6 border border-[#E5E7EB] hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden"
                  id={`brand-card-${brand.slug}`}
                >
                  {/* Subtle top accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-amber-400 transition-colors" />

                  {/* Top badges (Country & Product Count) */}
                  <div className="w-full flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-4">
                    {brand.country ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                        <Globe size={10} />
                        <span>{brand.country}</span>
                      </span>
                    ) : <span />}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold border border-amber-100">
                      <Package size={10} />
                      <span>{productCount} sản phẩm</span>
                    </span>
                  </div>

                  {/* Logo Center Container */}
                  <div className="h-20 w-full flex items-center justify-center my-2 transition-transform duration-300 group-hover:scale-105">
                    <BrandLogo
                      logo={brand.logo}
                      brandName={brand.name}
                      className="h-14 max-h-16 w-full max-w-[160px]"
                    />
                  </div>

                  {/* Brand Information */}
                  <div className="w-full mt-3">
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-neutral-900 group-hover:text-black transition-colors">
                      {brand.name}
                    </h2>
                    {brand.tagline && (
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-tight mt-0.5 line-clamp-1 group-hover:text-neutral-600">
                        {brand.tagline}
                      </p>
                    )}
                    {brand.description && (
                      <p className="text-[11px] text-neutral-500 font-light mt-2 line-clamp-2 leading-relaxed text-left sm:text-center">
                        {brand.description}
                      </p>
                    )}
                  </div>

                  {/* View Products CTA Button */}
                  <div className="w-full mt-5 pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>XEM SẢN PHẨM</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
