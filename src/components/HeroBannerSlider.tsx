import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlideItem {
  id: string;
  name: string;
  image: string;
  tagline?: string;
  badge?: string;
  brand?: string;
  category?: string;
}

export interface HeroBannerSliderProps {
  slides?: HeroSlideItem[];
  onNavigateProducts?: (filter?: { brand?: string; category?: string }) => void;
  onSlideClick?: (slide: HeroSlideItem, index: number) => void;
}

// 7 curated authentic high-definition sneaker slides for K-NICKS
export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-nike-pulse',
    name: 'Nike Air Max Pulse Noir',
    image: '/src/assets/images/hero_banner_background_1784366559173.jpg',
    badge: 'NEW ARRIVAL',
    brand: 'Nike',
    category: 'Sneaker',
    tagline: 'Đỉnh cao đệm khí 270 độ cho từng sải bước vượt trội.'
  },
  {
    id: 'slide-nike-hero',
    name: 'Nike Air Zoom Alphafly Carbon',
    image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    badge: 'CARBON RACER',
    brand: 'Nike',
    category: 'Giày chạy bộ',
    tagline: 'Phá vỡ mọi kỷ lục tốc độ cùng sợi carbon thế hệ mới.'
  },
  {
    id: 'slide-adidas-ultraboost',
    name: 'Adidas Ultraboost Light Stealth',
    image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    badge: 'BEST SELLER',
    brand: 'Adidas',
    category: 'Giày thể thao',
    tagline: 'Hạt Boost siêu nhẹ hoàn trả năng lượng tối đa.'
  },
  {
    id: 'slide-puma-rsx',
    name: 'Puma RS-X Cyber Drift',
    image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
    badge: 'RETRO CHUNKY',
    brand: 'Puma',
    category: 'Sneaker',
    tagline: 'Thiết kế hầm hố phá cách của tương lai thể thao.'
  },
  {
    id: 'slide-converse-chuck70',
    name: 'Converse Chuck 70 Heritage',
    image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
    badge: 'TIMELESS CLASSIC',
    brand: 'Converse',
    category: 'Sneaker',
    tagline: 'Biểu tượng phong cách đường phố không bao giờ lỗi mốt.'
  },
  {
    id: 'slide-jordan-shadow',
    name: 'Air Jordan 1 High OG Dark Shadow',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2000&q=85',
    badge: 'ICONIC HERITAGE',
    brand: 'Nike',
    category: 'Sneaker',
    tagline: 'Tuyên ngôn phong cách bóng rổ huyền thoại đường phố.'
  },
  {
    id: 'slide-retro-runner',
    name: 'New Balance 9060 Triple Carbon',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=2000&q=85',
    badge: 'FUTURISTIC RUNNER',
    brand: 'New Balance',
    category: 'Giày chạy bộ',
    tagline: 'Sự trỗi dậy của phong cách Y2K Runner đỉnh cao 2026.'
  }
];

export default function HeroBannerSlider({
  slides = DEFAULT_HERO_SLIDES,
  onNavigateProducts,
  onSlideClick
}: HeroBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const activeSlides = slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Auto-play interval (5.5 seconds) with pause on hover
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, activeSlides.length, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Main banner click
  const handleBannerClick = () => {
    if (onSlideClick) {
      onSlideClick(currentSlide, currentIndex);
    } else if (onNavigateProducts) {
      onNavigateProducts({
        brand: currentSlide.brand,
        category: currentSlide.category
      });
    }
  };

  return (
    <div
      role="region"
      aria-label="Hero Banner Slider - MOVE YOUR WAY"
      tabIndex={0}
      onClick={handleBannerClick}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative w-full min-h-[500px] sm:h-[540px] md:h-[580px] lg:h-[620px] bg-neutral-950 border-b border-[#262626] overflow-hidden select-none cursor-pointer focus:outline-none"
    >
      {/* ===================================================================== */}
      {/* 1. SLIDES BACKGROUND & KEN BURNS EFFECT                               */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.name || 'K-NICKS Sneaker'}
                className={`h-full w-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* 2. DUAL DARK OVERLAYS                                                 */}
      {/* ===================================================================== */}
      {/* Layer A: Uniform semi-transparent black overlay */}
      <div className="absolute inset-0 bg-black/35 z-10 pointer-events-none" />

      {/* Layer B: Vertical gradient from dark bottom via transparent to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />

      {/* Optional ambient amber glow accent in background */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#F59E0B]/15 blur-[120px] rounded-full pointer-events-none z-10" />

      {/* ===================================================================== */}
      {/* 3. CENTERED TYPOGRAPHY & CALL-TO-ACTION                               */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Main Title: MOVE YOUR WAY */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 10px 40px rgba(0,0,0,0.6)' }}
          >
            MOVE YOUR WAY
          </h1>

          {/* Subtitle: Find your style. Own your move. */}
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-[22px] font-medium text-[#E5E7EB] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tracking-wide">
            Find your style. Own your move.
          </p>

          {/* CTA Button: MUA NGAY → */}
          <div className="mt-6 sm:mt-8 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateProducts) {
                  onNavigateProducts({
                    brand: currentSlide.brand,
                    category: currentSlide.category
                  });
                }
              }}
              className="group/btn inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-black px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.55)] hover:scale-105 active:scale-95 cursor-pointer"
              id="hero-buy-now-cta"
            >
              <span>MUA NGAY</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. NAVIGATION CONTROLS (PREV / NEXT BUTTONS)                          */}
      {/* ===================================================================== */}
      {/* Previous Button */}
      <button
        type="button"
        aria-label="Slide trước đó"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 hover:border-white/40 shadow-lg transition-all duration-300 cursor-pointer active:scale-95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        aria-label="Slide tiếp theo"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 hover:border-white/40 shadow-lg transition-all duration-300 cursor-pointer active:scale-95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <ChevronRight size={22} />
      </button>

      {/* ===================================================================== */}
      {/* 5. DOT INDICATORS BAR                                                 */}
      {/* ===================================================================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 shadow-2xl">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Chuyển đến slide ${idx + 1}: ${slide.name}`}
                aria-current={isActive ? 'true' : 'false'}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-8 bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
