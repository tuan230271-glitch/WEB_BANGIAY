import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Mail,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { Product, BrandItem, BannerItem } from '../types';
import { BLOG_POSTS } from '../data/blogData';
import { getBannerEffectiveStatus } from '../utils/bannerUtils';
import BrandLogo from './BrandLogo';
import ProductCard from './ProductCard';
import { useLanguage } from '../utils/translations';

interface HomepageViewProps {
  products: Product[];
  brands: BrandItem[];
  banners: BannerItem[];
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
  onQuickViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, qty?: number) => void;
  onNavigateBrand: (brand: BrandItem) => void;
  onNavigateBrandsPage: () => void;
  onNavigatePromotions: () => void;
  onNavigateProducts: (filter?: { brand?: string; category?: string; gender?: string }) => void;
  onNavigateBlog?: (slug?: string) => void;
  newsletterEmail: string;
  setNewsletterEmail: (email: string) => void;
  newsletterSubscribed: boolean;
  handleNewsletterSubmit: (e: React.FormEvent) => void;
  newsletterFeedback: { type: 'success' | 'warning' | 'error'; message: string } | null;
}

// Helper to filter out accessories from shoes
function isShoeProduct(p: Product): boolean {
  if (p.id?.startsWith('acc-')) return false;

  const cat = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();

  if (
    cat.includes('phụ kiện') ||
    cat.includes('phu kien') ||
    cat.includes('dây giày') ||
    cat.includes('tất') ||
    cat.includes('lót giày') ||
    cat.includes('vệ sinh') ||
    cat.includes('túi đựng') ||
    cat.includes('shoelace') ||
    cat.includes('sock') ||
    cat.includes('insole') ||
    cat.includes('care') ||
    cat.includes('accessory')
  ) {
    return false;
  }

  if (
    name.startsWith('dây giày') ||
    name.startsWith('tất ') ||
    name.startsWith('vớ ') ||
    name.startsWith('lót giày') ||
    name.startsWith('bộ vệ sinh') ||
    name.startsWith('chai xịt') ||
    name.startsWith('bình xịt') ||
    name.startsWith('gôm tẩy') ||
    name.startsWith('cây giữ form') ||
    name.startsWith('bàn chải') ||
    name.startsWith('túi đựng giày') ||
    name.includes('cleaner') ||
    name.includes('spray') ||
    name.includes('eraser')
  ) {
    return false;
  }

  return true;
}

export default function HomepageView({
  products,
  brands,
  banners,
  favorites,
  onToggleFavorite,
  onQuickViewProduct,
  onAddToCart,
  onNavigateBrand,
  onNavigateBrandsPage,
  onNavigatePromotions,
  onNavigateProducts,
  onNavigateBlog,
  newsletterEmail,
  setNewsletterEmail,
  newsletterSubscribed,
  handleNewsletterSubmit,
  newsletterFeedback
}: HomepageViewProps) {
  const { t, language } = useLanguage();

  // State for Section 4 (TOP DANH MỤC NỔI BẬT)
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'sneaker' | 'the-thao' | 'chay-bo' | 'lifestyle'>('all');

  // Filter active shoes (non-deleted, available)
  const activeProducts = useMemo(() => {
    return products.filter((p) => !p.isDeleted && p.status !== 'Ẩn' && p.status !== 'Ngừng kinh doanh');
  }, [products]);

  const activeShoes = useMemo(() => {
    return activeProducts.filter(isShoeProduct);
  }, [activeProducts]);

  // Hero Slider State (Chuyển đổi liên tục)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // 1. MULTIPLE HERO SLIDES (GIỮ NGUYÊN ĐÚNG 7 HÌNH ẢNH HIỆN CÓ, ĐÚNG THỨ TỰ)
  const heroSlides = useMemo(() => {
    // Find Jordan shoe image or fallback to the Bred Toe (Slide 1)
    const jordanCandidate = activeShoes.find((p) => (p.name || '').toLowerCase().includes('jordan'));
    const jordanImg =
      jordanCandidate?.image ||
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1600&q=80';

    return [
      {
        id: 'slide-jordan-1',
        image: jordanImg
      },
      {
        id: 'slide-nike-pulse',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg'
      },
      {
        id: 'slide-adidas-ultra',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg'
      },
      {
        id: 'slide-puma-rsx',
        image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg'
      },
      {
        id: 'slide-samba-classic',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=80'
      },
      {
        id: 'slide-converse-70',
        image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg'
      },
      {
        id: 'slide-store-nyc',
        image: '/src/assets/images/hero_banner_background_1784366559173.jpg'
      }
    ];
  }, [activeShoes]);

  // Continuous Auto-rotation Timer (Chuyển đổi liên tục mỗi 4.5 giây)
  useEffect(() => {
    if (heroSlides.length <= 1 || isHeroHovered) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length, isHeroHovered]);

  const currentHero = heroSlides[currentHeroIndex] || heroSlides[0];

  const handlePrevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  // 2. 4 SMALL CARDS DEFINITION
  const smallCategoryCards = useMemo(() => {
    const sneakerImg =
      activeShoes.find((p) => (p.category || '').toLowerCase().includes('sneaker'))?.image ||
      '/src/assets/images/nike_hero_shoe_1784366503176.jpg';

    const sportImg =
      activeShoes.find((p) => (p.category || '').toLowerCase().includes('thể thao'))?.image ||
      '/src/assets/images/adidas_black_shoe_1784366517769.jpg';

    const runningImg =
      activeShoes.find(
        (p) =>
          (p.category || '').toLowerCase().includes('chạy bộ') ||
          (p.name || '').toLowerCase().includes('running') ||
          (p.name || '').toLowerCase().includes('nitro')
      )?.image || '/src/assets/images/nike_vaporfly_running.jpg';

    const promoImg =
      activeShoes.find(
        (p) =>
          (p.isPromotion || (p.originalPrice && p.originalPrice > p.price)) &&
          p.image !== currentHero.image
      )?.image || '/src/assets/images/puma_rsx_shoe_1784366528717.jpg';

    return [
      {
        id: 'card-sneaker',
        title: t.sneaker,
        image: sneakerImg,
        onClick: () => onNavigateProducts({ category: 'Sneaker' })
      },
      {
        id: 'card-sport',
        title: t.sportShoes,
        image: sportImg,
        onClick: () => onNavigateProducts({ category: 'Giày thể thao' })
      },
      {
        id: 'card-running',
        title: t.runningShoes,
        image: runningImg,
        onClick: () => onNavigateProducts({ category: 'Giày chạy bộ' })
      },
      {
        id: 'card-promo',
        title: t.promoTitle,
        image: promoImg,
        onClick: onNavigatePromotions
      }
    ];
  }, [activeShoes, currentHero.image, onNavigateProducts, onNavigatePromotions, t]);

  // 3. FEATURED BRANDS (Active brands from API/state, max 4)
  const featuredBrands = useMemo(() => {
    const activeBrands = brands.filter((b) => b.status === 'Đang hoạt động' && !b.isDeleted);
    // Prioritize Nike, Adidas, Puma, Converse
    const preferredOrder = ['nike', 'adidas', 'puma', 'converse'];
    const sorted = [...activeBrands].sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.name.toLowerCase());
      const idxB = preferredOrder.indexOf(b.name.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
    return sorted.slice(0, 4);
  }, [brands]);

  // 4. TOP DANH MỤC NỔI BẬT: Tabs definition & client-side filtered products
  const categoryTabs = useMemo(() => [
    { id: 'all' as const, label: t.catAll },
    { id: 'sneaker' as const, label: t.catSneaker },
    { id: 'the-thao' as const, label: t.catSport },
    { id: 'chay-bo' as const, label: t.catRunning },
    { id: 'lifestyle' as const, label: t.catLifestyle }
  ], [t]);

  const categoryTabProducts = useMemo(() => {
    if (activeCategoryTab === 'all') {
      return activeShoes.slice(0, 4);
    }
    if (activeCategoryTab === 'sneaker') {
      const list = activeShoes.filter(
        (p) =>
          (p.category || '').toLowerCase().includes('sneaker') ||
          (p.name || '').toLowerCase().includes('jordan') ||
          (p.name || '').toLowerCase().includes('air max') ||
          (p.name || '').toLowerCase().includes('dunk')
      );
      return (list.length >= 2 ? list : activeShoes).slice(0, 4);
    }
    if (activeCategoryTab === 'the-thao') {
      const list = activeShoes.filter(
        (p) =>
          (p.category || '').toLowerCase().includes('thể thao') ||
          (p.category || '').toLowerCase().includes('bóng rổ') ||
          (p.name || '').toLowerCase().includes('nitro') ||
          (p.name || '').toLowerCase().includes('cleats')
      );
      return (list.length >= 2 ? list : activeShoes).slice(0, 4);
    }
    if (activeCategoryTab === 'chay-bo') {
      const list = activeShoes.filter(
        (p) =>
          (p.category || '').toLowerCase().includes('chạy bộ') ||
          (p.name || '').toLowerCase().includes('running') ||
          (p.name || '').toLowerCase().includes('boost') ||
          (p.name || '').toLowerCase().includes('vaporfly')
      );
      return (list.length >= 2 ? list : activeShoes).slice(0, 4);
    }
    if (activeCategoryTab === 'lifestyle') {
      const list = activeShoes.filter(
        (p) =>
          (p.category || '').toLowerCase().includes('lifestyle') ||
          (p.name || '').toLowerCase().includes('chuck') ||
          (p.name || '').toLowerCase().includes('samba') ||
          (p.name || '').toLowerCase().includes('star') ||
          (p.name || '').toLowerCase().includes('classic')
      );
      return (list.length >= 2 ? list : activeShoes).slice(0, 4);
    }
    return activeShoes.slice(0, 4);
  }, [activeShoes, activeCategoryTab]);

  // 5. SẢN PHẨM NỔI BẬT: ĐÚNG 4 SẢN PHẨM TRÊN TRANG CHỦ
  const homepageFeaturedProducts = useMemo(() => {
    // Select 4 top shoes (hot, best-sellers, high rating)
    const hotList = activeShoes.filter((p) => p.isHot || p.isBestSeller || p.rating >= 4.8);
    const result: Product[] = [];
    const idSet = new Set<string>();

    for (const p of hotList) {
      if (result.length >= 4) break;
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        result.push(p);
      }
    }

    // Fallback fill to 4
    for (const p of activeShoes) {
      if (result.length >= 4) break;
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        result.push(p);
      }
    }

    return result.slice(0, 4);
  }, [activeShoes]);

  // 6. TIN TỨC CHÍNH: 4 BÀI VIẾT NỔI BẬT CHO TRANG CHỦ
  const homepageNews = useMemo(() => {
    return BLOG_POSTS.slice(0, 4);
  }, []);

  return (
    <div className="w-full space-y-0" id="homepage-content">
      {/* ==================================================== */}
      {/* ==================================================== */}
      {/* ==================================================== */}
      {/* 1. HERO BANNER FULL-WIDTH SLIDER: MOVE YOUR WAY      */}
      {/* ==================================================== */}
      <section
        className="group relative w-full overflow-hidden bg-neutral-950 border-b border-neutral-800 cursor-pointer min-h-[500px] md:h-[540px] lg:h-[580px] flex items-center justify-center select-none"
        id="hero-section"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        onClick={() => onNavigateProducts()}
      >
        {/* Layered Crossfade Images (Chuyển đổi hình ảnh mượt mà, giữ nguyên 7 hình ảnh) */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentHeroIndex ? 'opacity-100 z-1 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt="K-NICKS - MOVE YOUR WAY"
              className={`w-full h-full object-cover object-[75%_center] sm:object-[65%_center] md:object-center select-none transition-transform duration-7000 ease-out ${
                idx === currentHeroIndex ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Subtle Dark Overlay for Text Contrast (vừa đủ, không che mất sản phẩm) */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none z-2" />

        {/* UNIFIED CENTERED TEXT: MOVE YOUR WAY / Find your style. Own your move. / MUA NGAY → */}
        <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="w-full flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-5">
            {/* 1. Main Title: MOVE YOUR WAY */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] max-w-4xl mx-auto">
              {t.heroTitle}
            </h1>

            {/* 2. Subtitle: Find your style. Own your move. */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-200 font-medium tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* 3. CTA Button: MUA NGAY → */}
            <div className="pt-3 sm:pt-5 flex justify-center pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateProducts();
                }}
                className="inline-flex items-center gap-2.5 h-12 sm:h-14 px-8 sm:px-10 rounded-xl bg-[#F59E0B] text-black font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-amber-400 active:scale-95 transition-all shadow-xl hover:shadow-[#F59E0B]/35 cursor-pointer"
              >
                <span>{t.shopNow}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Previous Slide Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevHero();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 opacity-0 group-hover:opacity-100 transition-all active:scale-90 cursor-pointer shadow-lg"
          aria-label={language === 'en' ? 'Previous slide' : 'Slide trước'}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Slide Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNextHero();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 opacity-0 group-hover:opacity-100 transition-all active:scale-90 cursor-pointer shadow-lg"
          aria-label={language === 'en' ? 'Next slide' : 'Slide kế tiếp'}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentHeroIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentHeroIndex
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-[#F59E0B]'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={language === 'en' ? `Go to slide ${idx + 1}` : `Chuyển tới slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. 4 KHỐI HÌNH ẢNH NHỎ NẰM NGANG                      */}
      {/* ==================================================== */}
      <section className="pt-6 sm:pt-8 pb-4 sm:pb-6" id="small-banners-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {smallCategoryCards.map((card) => (
              <div
                key={card.id}
                onClick={card.onClick}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 flex flex-col justify-between h-40 sm:h-44 md:h-48 cursor-pointer shadow-2xs hover:shadow-lg hover:border-black transition-all duration-300"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-black text-neutral-900 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 mt-0.5 group-hover:text-black transition-colors">
                    <span>{t.explore}</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="relative w-full h-20 sm:h-24 md:h-28 flex items-center justify-end overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="max-h-full max-w-[85%] object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. THƯƠNG HIỆU NỔI BẬT (NIKE, ADIDAS, PUMA, CONVERSE)  */}
      {/* ==================================================== */}
      <section className="py-8 sm:py-10 bg-white border-t border-neutral-100" id="brands-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">{t.officialPartners}</span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight mt-0.5">
                {t.featuredBrands}
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateBrandsPage}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {featuredBrands.map((brand) => (
              <div
                key={brand.id || brand.name}
                onClick={() => onNavigateBrand(brand)}
                className="group cursor-pointer rounded-2xl p-4 sm:p-5 text-center border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[140px]"
              >
                <div className="h-10 w-24 flex items-center justify-center mb-2">
                  <BrandLogo logo={brand.logo} brandName={brand.name} className="h-full w-full object-contain" />
                </div>
                <span className="text-sm font-black tracking-wider uppercase text-neutral-900 group-hover:text-amber-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-semibold uppercase mt-0.5">
                  {t.authentic100}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. TOP DANH MỤC NỔI BẬT (MENU TRÁI + SẢN PHẨM PHẢI)    */}
      {/* ==================================================== */}
      <section className="py-10 sm:py-12 bg-neutral-50 border-t border-neutral-100" id="top-categories-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">{t.exploreByCategory}</span>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight mt-0.5">
              {t.topCategories}
            </h2>
          </div>

          {/* 2-Part Layout: Left Menu + Right Products Grid */}
          <div className="flex flex-col md:flex-row gap-5 lg:gap-8 items-start">
            
            {/* Left Category Menu */}
            <div className="w-full md:w-56 lg:w-64 shrink-0 bg-white p-2.5 sm:p-3 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
              {categoryTabs.map((tab) => {
                const isActive = activeCategoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategoryTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <ChevronRight size={14} className={isActive ? 'text-amber-400' : 'text-neutral-400'} />
                  </button>
                );
              })}
            </div>

            {/* Right Products Grid */}
            <div className="flex-1 w-full min-w-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 xl:gap-4">
                {categoryTabProducts.map((product) => (
                  <ProductCard
                    key={`cattab-${product.id}`}
                    product={product}
                    onQuickView={onQuickViewProduct}
                    onAddToCart={(p, sz, cl) => onAddToCart(p, sz, cl, 1)}
                    isFavorite={favorites.some((item) => item.id === product.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. SẢN PHẨM NỔI BẬT (ĐÚNG 4 SẢN PHẨM TRÊN TRANG CHỦ)  */}
      {/* ==================================================== */}
      <section className="py-10 sm:py-14 bg-white border-t border-neutral-100" id="featured-products-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">{t.topPicks}</span>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight mt-0.5">
              {t.featuredProducts}
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              {t.featuredProductsSub}
            </p>
          </div>

          {/* Grid 4 columns on desktop, 2 on mobile - EXACTLY 4 PRODUCTS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {homepageFeaturedProducts.map((product) => (
              <ProductCard
                key={`feat4-${product.id}`}
                product={product}
                onQuickView={onQuickViewProduct}
                onAddToCart={(p, sz, cl) => onAddToCart(p, sz, cl, 1)}
                isFavorite={favorites.some((item) => item.id === product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {/* CTA: Xem tất cả sản phẩm */}
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigateProducts()}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-black text-white font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>{t.viewAllProducts}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. TIN TỨC CHÍNH (BẢN TIN SNEAKER & XU HƯỚNG MỚI NHẤT) */}
      {/* ==================================================== */}
      <section className="py-12 sm:py-16 bg-neutral-50/80 border-t border-neutral-100" id="homepage-news-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider mb-2.5">
                <Newspaper size={12} className="text-amber-400" />
                <span>{t.newsBadge}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                {t.newsTitle}
              </h2>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                {t.newsSubtitle}
              </p>
            </div>

            {onNavigateBlog && (
              <button
                type="button"
                onClick={() => onNavigateBlog()}
                className="inline-flex items-center gap-2 text-xs font-black text-neutral-900 hover:text-amber-600 transition-colors cursor-pointer uppercase tracking-wider self-start md:self-auto group"
              >
                <span>{t.viewAllArticles}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* News Grid (4 cards on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {homepageNews.map((post) => (
              <article
                key={post.id}
                onClick={() => onNavigateBlog ? onNavigateBlog(post.slug) : undefined}
                className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-2xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer"
              >
                {/* Top: Cover Image with Zoom Effect */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-full bg-black/85 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                        {post.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Meta Info: Date & Reading Time */}
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-neutral-400" />
                        <span>{post.publishedAt}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-neutral-400" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-black text-neutral-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer: Author & Read CTA */}
                <div className="p-4 sm:p-5 pt-0 border-t border-neutral-100/80 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-6 w-6 rounded-full object-cover border border-neutral-200"
                    />
                    <span className="text-[11px] font-bold text-neutral-700 truncate max-w-[100px]">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-neutral-900 group-hover:text-amber-600 transition-colors uppercase tracking-wider shrink-0">
                    <span>{t.readMore}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. CAM KẾT DỊCH VỤ K-NICKS                           */}
      {/* ==================================================== */}
      <section className="py-10 bg-neutral-50 border-t border-neutral-100" id="benefits-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">{t.benefit1Title}</h4>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5 leading-relaxed">
                  {t.benefit1Desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                <RotateCcw size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">{t.benefit2Title}</h4>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5 leading-relaxed">
                  {t.benefit2Desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">{t.benefit3Title}</h4>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5 leading-relaxed">
                  {t.benefit3Desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-xs">
                <CreditCard size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">{t.benefit4Title}</h4>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5 leading-relaxed">
                  {t.benefit4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. NEWSLETTER SECTION                                */}
      {/* ==================================================== */}
      <section className="py-12 bg-neutral-950 text-white relative overflow-hidden" id="newsletter-section">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-neutral-800/20 blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white mb-1">
            <Mail size={18} />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            {t.newsletterTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-light leading-relaxed">
            {t.newsletterSub}
          </p>

          <AnimatePresence mode="wait">
            {!newsletterSubscribed ? (
              <div className="space-y-3 max-w-md mx-auto">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="mt-4 flex flex-col sm:flex-row items-center gap-2.5"
                >
                  <input
                    type="email"
                    placeholder={t.newsletterPlaceholder}
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                    }}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs outline-none focus:border-amber-400 focus:bg-white/10 text-white placeholder:text-neutral-500"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-xl bg-amber-400 px-6 py-3 text-xs font-black text-black hover:bg-amber-300 transition-colors uppercase tracking-wider flex-shrink-0 cursor-pointer shadow-md"
                  >
                    {t.newsletterBtn}
                  </button>
                </form>
                {newsletterFeedback && (
                  <p className={`text-xs font-medium ${newsletterFeedback.type === 'error' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {newsletterFeedback.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-white/10 border border-amber-400/30 max-w-md mx-auto text-xs text-amber-300 font-bold flex items-center justify-center gap-2 shadow-lg">
                <Check size={16} className="text-amber-400" />
                <span>{language === 'en' ? 'Thank you! Successfully subscribed - 10% coupon code "KNICKS10" is active.' : 'Cảm ơn bạn! Đăng ký thành công - Mã giảm giá 10% "KNICKS10" đã được kích hoạt.'}</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
