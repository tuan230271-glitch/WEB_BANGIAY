import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Flame,
  ArrowRight,
  LogOut,
  Package,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Info
} from 'lucide-react';
import { Product, CartItem, BrandName, CategoryName, SystemSettings, BrandItem, CategoryItem, GenderType } from '../types';
import { PRODUCTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from '../data';
import BrandLogo from './BrandLogo';
import { splitCategories, GENDER_OPTIONS } from '../utils/categoryHelpers';
import LanguageSwitcher, { Language } from './LanguageSwitcher';

export const HEADER_TRANSLATIONS = {
  vi: {
    home: 'Trang chủ',
    products: 'Sản phẩm',
    brands: 'Thương hiệu',
    promotions: 'Khuyến mãi',
    blog: 'Tin tức',
    contact: 'Liên hệ',
    searchPlaceholder: 'Tìm giày...',
    searchSuggestions: 'Gợi ý sản phẩm',
    viewAllResults: 'Xem tất cả kết quả',
    favorites: 'Sản phẩm yêu thích',
    viewAllFavorites: 'XEM TẤT CẢ TRANG YÊU THÍCH',
    noFavorites: 'Chưa có sản phẩm yêu thích nào.',
    cart: 'Giỏ hàng',
    login: 'Đăng nhập',
    loginRegister: 'Đăng nhập / Đăng ký',
    adminDashboard: 'Trang quản trị (/admin)',
    adminLogout: 'Đăng xuất Admin',
    profile: 'Hồ sơ cá nhân',
    myOrders: 'Đơn hàng của tôi',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    logoutSuccess: 'Đã đăng xuất thành công',
    aboutContact: 'Về chúng tôi & Liên hệ',
  },
  en: {
    home: 'Home',
    products: 'Products',
    brands: 'Brands',
    promotions: 'Promotions',
    blog: 'News',
    contact: 'Contact',
    searchPlaceholder: 'Search shoes...',
    searchSuggestions: 'Suggested products',
    viewAllResults: 'View all results',
    favorites: 'Favorites',
    viewAllFavorites: 'VIEW ALL FAVORITES',
    noFavorites: 'No favorite products yet.',
    cart: 'Cart',
    login: 'Login',
    loginRegister: 'Login / Register',
    adminDashboard: 'Admin Dashboard (/admin)',
    adminLogout: 'Admin Logout',
    profile: 'My Profile',
    myOrders: 'My Orders',
    changePassword: 'Change Password',
    logout: 'Logout',
    logoutSuccess: 'Logged out successfully',
    aboutContact: 'About Us & Contact',
  },
};

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrand: 'All' | BrandName;
  setSelectedBrand: (brand: 'All' | BrandName) => void;
  selectedCategory: 'All' | CategoryName;
  setSelectedCategory: (category: 'All' | CategoryName) => void;
  selectedGender?: 'All' | GenderType;
  setSelectedGender?: (gender: 'All' | GenderType) => void;
  favorites: Product[];
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  user: { name: string; email: string; role?: string } | null;
  setUser: (user: any) => void;
  setIsAuthOpen: (open: boolean) => void;
  onQuickViewProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  showPromoBannerAlert: boolean;
  setShowPromoBannerAlert: (show: boolean) => void;
  isScrolled: boolean;
  onOpenProfileTab?: (tab: 'profile' | 'addresses' | 'orders' | 'wishlist' | 'password') => void;
  settings?: SystemSettings;
  brands?: BrandItem[];
  categories?: CategoryItem[];
  onNavigateBrand?: (brand: BrandItem) => void;
  onNavigateBrandsPage?: () => void;
  onNavigatePromotions?: () => void;
  onNavigateBlog?: () => void;
  onNavigateAboutContact?: () => void;
  onNavigateContact?: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const PRODUCT_MENU_COLUMNS = [
  {
    title: 'GIÀY NAM',
    targetGender: 'Nam' as GenderType,
    targetCategory: 'All' as CategoryName,
    items: [
      { label: 'Giày thể thao', category: 'Giày thể thao', gender: 'Nam' as GenderType },
      { label: 'Giày bóng đá', category: 'Giày bóng đá', gender: 'Nam' as GenderType },
      { label: 'Sneaker', category: 'Sneaker', gender: 'Nam' as GenderType },
      { label: 'Giày lifestyle', category: 'Giày lifestyle', gender: 'Nam' as GenderType },
    ]
  },
  {
    title: 'GIÀY NỮ',
    targetGender: 'Nữ' as GenderType,
    targetCategory: 'All' as CategoryName,
    items: [
      { label: 'Giày thể thao', category: 'Giày thể thao', gender: 'Nữ' as GenderType },
      { label: 'Sneaker', category: 'Sneaker', gender: 'Nữ' as GenderType },
      { label: 'Giày chạy bộ', category: 'Giày chạy bộ', gender: 'Nữ' as GenderType },
      { label: 'Giày lifestyle', category: 'Giày lifestyle', gender: 'Nữ' as GenderType },
    ]
  },
  {
    title: 'THỂ THAO & CHẠY BỘ',
    targetGender: 'All' as GenderType,
    targetCategory: 'Giày chạy bộ' as CategoryName,
    items: [
      { label: 'Giày chạy bộ', category: 'Giày chạy bộ', gender: 'All' as GenderType },
      { label: 'Giày bóng đá', category: 'Giày bóng đá', gender: 'All' as GenderType },
      { label: 'Training / Gym', category: 'Training', gender: 'All' as GenderType },
      { label: 'Sneaker thể thao', category: 'Sneaker', gender: 'All' as GenderType },
    ]
  },
  {
    title: 'PHỤ KIỆN THỂ THAO',
    targetGender: 'All' as GenderType,
    targetCategory: 'Dây giày' as CategoryName,
    items: [
      { label: 'Dây giày Sneaker', category: 'Dây giày', gender: 'All' as GenderType },
      { label: 'Tất / Vớ thể thao', category: 'Tất / Vớ', gender: 'All' as GenderType },
      { label: 'Lót giày OrthoLite', category: 'Lót giày', gender: 'All' as GenderType },
      { label: 'Dụng cụ vệ sinh giày', category: 'Dụng cụ vệ sinh giày', gender: 'All' as GenderType },
    ]
  }
];

export default function Header({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedGender = 'All',
  setSelectedGender,
  favorites,
  isFavoritesOpen,
  setIsFavoritesOpen,
  cartItems,
  setIsCartOpen,
  user,
  setUser,
  setIsAuthOpen,
  onQuickViewProduct,
  onToggleFavorite,
  showPromoBannerAlert,
  setShowPromoBannerAlert,
  isScrolled,
  onOpenProfileTab,
  settings,
  brands = INITIAL_BRANDS,
  categories = INITIAL_CATEGORIES,
  onNavigateBrand,
  onNavigateBrandsPage,
  onNavigatePromotions,
  onNavigateBlog,
  onNavigateAboutContact,
  onNavigateContact,
  language: languageProp,
  onLanguageChange
}: HeaderProps) {
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'products' | 'brands' | null>(null);

  // Language state (VIE / ENG)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (languageProp) return languageProp;
    try {
      const saved = localStorage.getItem('solestyle_language');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {}
    return 'vi';
  });

  useEffect(() => {
    if (languageProp && languageProp !== currentLang) {
      setCurrentLang(languageProp);
    }
  }, [languageProp]);

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem('solestyle_language', newLang);
    } catch (e) {}
    if (onLanguageChange) onLanguageChange(newLang);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }));
    showNotification(newLang === 'vi' ? 'Đã chuyển sang Tiếng Việt (VIE)' : 'Switched to English (ENG)');
  };

  const t = HEADER_TRANSLATIONS[currentLang];

  // Active non-deleted brands and categories
  // Active non-deleted brands and categories
  const activeBrands = useMemo(() => {
    return (brands || []).filter((b) => b.status === 'Đang hoạt động' && !b.isDeleted);
  }, [brands]);

  // Curated 4 brands in the requested layout (2 columns x 2 rows):
  // Row 1: Adidas, Converse
  // Row 2: Nike, Puma
  const headerBrands = useMemo(() => {
    const desiredOrder = ['adidas', 'converse', 'nike', 'puma'];
    const brandSource = (activeBrands && activeBrands.length > 0) ? activeBrands : INITIAL_BRANDS;
    return desiredOrder
      .map((slug) => {
        return brandSource.find((b) => (b.slug || '').toLowerCase() === slug || (b.name || '').toLowerCase() === slug)
          || INITIAL_BRANDS.find((b) => (b.slug || '').toLowerCase() === slug || (b.name || '').toLowerCase() === slug);
      })
      .filter(Boolean) as BrandItem[];
  }, [activeBrands]);

  const { activeCategories, shoeCategories, accessoryCategories } = useMemo(() => {
    splitCategories(categories || []);
    return splitCategories(categories || []);
  }, [categories]);

  // Desktop dropdown states
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // User feedback modal or notification state
  const [userNotification, setUserNotification] = useState<string | null>(null);

  // Refs for closing dropdowns on click outside
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const productsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brandsMenuRef = useRef<HTMLDivElement>(null);
  const brandsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleProductsMouseEnter = () => {
    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
      productsTimeoutRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
    }
    productsTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 120);
  };

  const handleBrandsMouseEnter = () => {
    if (brandsTimeoutRef.current) {
      clearTimeout(brandsTimeoutRef.current);
      brandsTimeoutRef.current = null;
    }
    setIsBrandsDropdownOpen(true);
  };

  const handleBrandsMouseLeave = () => {
    if (brandsTimeoutRef.current) {
      clearTimeout(brandsTimeoutRef.current);
    }
    brandsTimeoutRef.current = setTimeout(() => {
      setIsBrandsDropdownOpen(false);
    }, 120);
  };

  // Real-time search suggestion items
  const searchSuggestions = searchQuery.trim() !== ''
    ? PRODUCTS.filter((p) => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
        setIsProductsDropdownOpen(false);
      }
      if (brandsMenuRef.current && !brandsMenuRef.current.contains(event.target as Node)) {
        if (brandsTimeoutRef.current) clearTimeout(brandsTimeoutRef.current);
        setIsBrandsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
      if (brandsTimeoutRef.current) clearTimeout(brandsTimeoutRef.current);
    };
  }, []);

  const handleNavigate = (
    view: 'home' | 'products' | 'promotions' | 'contact' | 'brands' | 'blog' | 'about-contact',
    brand?: 'All' | BrandName,
    category?: 'All' | CategoryName,
    gender?: 'All' | GenderType,
    scrollToId?: string
  ) => {
    if (brand !== undefined) setSelectedBrand(brand);
    if (category !== undefined) setSelectedCategory(category);
    if (gender !== undefined && setSelectedGender) setSelectedGender(gender);
    setCurrentView(view);
    setIsProductsDropdownOpen(false);
    setIsBrandsDropdownOpen(false);
    setMobileMenuOpen(false);

    if (view === 'blog') {
      window.history.pushState({}, '', '/blog');
    } else if (view === 'about-contact') {
      window.history.pushState({}, '', '/about-contact');
    } else if (view === 'contact') {
      window.history.pushState({}, '', '/about-contact');
    } else if (view === 'promotions') {
      window.history.pushState({}, '', '/promotions');
    } else if (view === 'brands') {
      window.history.pushState({}, '', '/brands');
    } else if (view === 'home' && !scrollToId) {
      window.history.pushState({}, '', '/');
    }

    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const showNotification = (msg: string) => {
    setUserNotification(msg);
    setTimeout(() => setUserNotification(null), 3000);
  };

  return (
    <>
      {/* User Toast Notification */}
      <AnimatePresence>
        {userNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-black text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-800"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span>{userNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>


      {/* STICKY MAIN HEADER */}
      <header
        className={`sticky top-0 z-40 w-full relative transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-2.5 border-b border-neutral-200/80'
            : 'bg-white backdrop-blur-sm py-3 border-b border-neutral-200/60'
        }`}
        id="app-header"
      >
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-4 xl:px-6">
          <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 min-h-[44px]">
            
            {/* 1. BRAND LOGO */}
            <div
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
              id="logo-box"
            >
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.storeName || 'K-NICKS'}
                  className="h-9 max-w-[130px] object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-black text-white font-black text-base sm:text-lg shadow-sm transition-transform group-hover:scale-105">
                    {settings?.storeName ? settings.storeName.charAt(0).toUpperCase() : 'K'}
                  </div>
                  <span className="text-base sm:text-lg font-black tracking-tight text-black uppercase">
                    {settings?.storeName || 'K-NICKS'}
                  </span>
                </>
              )}
            </div>

            {/* 2. DESKTOP NAVIGATION MENU (CENTRAL) */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3.5 2xl:gap-5 shrink-0">
              
              {/* Trang chủ */}
              <button
                onClick={() => handleNavigate('home')}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap ${
                  currentView === 'home' && selectedBrand === 'All' && selectedCategory === 'All'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <span>{t.home}</span>
                {currentView === 'home' && selectedBrand === 'All' && selectedCategory === 'All' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

              {/* Sản phẩm Mega Menu Dropdown */}
              <div
                className="static"
                ref={productsMenuRef}
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
              >
                <button
                  onClick={() => handleNavigate('products', 'All', 'All', 'All')}
                  className={`relative flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                    currentView === 'products' && selectedBrand === 'All'
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                  id="nav-menu-products-btn"
                >
                  <span>{t.products}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isProductsDropdownOpen ? 'rotate-180 text-black' : 'text-neutral-400'
                    }`}
                  />
                  {currentView === 'products' && selectedBrand === 'All' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>

                {/* Desktop Mega Menu */}
                <AnimatePresence>
                  {isProductsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[84vw] max-w-[1040px] pt-1 z-50 pointer-events-auto before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                      id="products-mega-menu"
                    >
                      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_10px_28px_-6px_rgba(0,0,0,0.07)] py-7 px-8 lg:px-10">
                        <div className="grid grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
                          {PRODUCT_MENU_COLUMNS.map((col, idx) => (
                            <div key={idx} className="flex flex-col">
                              {/* Tiêu đề từng cột: IN HOA, font-bold (700), màu #111111, size 15-16px */}
                              <button
                                type="button"
                                onClick={() => handleNavigate('products', 'All', col.targetCategory, col.targetGender)}
                                className="text-left text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-4 hover:text-[#F59E0B] transition-colors duration-150 cursor-pointer select-none"
                              >
                                {col.title}
                              </button>

                              {/* Các danh mục bên dưới: size 14-15px, font-normal (400), màu #333333, khoảng cách 12-16px, không bullet, không icon, hover cam #F59E0B */}
                              <div className="flex flex-col space-y-3.5">
                                {col.items.map((item, itemIdx) => (
                                  <button
                                    key={itemIdx}
                                    type="button"
                                    onClick={() => handleNavigate('products', 'All', item.category, item.gender)}
                                    className="text-left text-[14px] font-normal text-[#333333] hover:text-[#F59E0B] transition-colors duration-150 cursor-pointer select-none"
                                  >
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Thương hiệu Dropdown */}
              <div
                className="relative"
                ref={brandsMenuRef}
                onMouseEnter={handleBrandsMouseEnter}
                onMouseLeave={handleBrandsMouseLeave}
              >
                <button
                  onClick={() => {
                    if (onNavigateBrandsPage) {
                      onNavigateBrandsPage();
                    } else {
                      handleNavigate('brands' as any);
                    }
                  }}
                  className={`relative flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap cursor-pointer ${
                    currentView === 'brands' || currentView === 'brand-detail' || (selectedBrand !== 'All' && currentView === 'products')
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>{t.brands}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isBrandsDropdownOpen ? 'rotate-180 text-black' : 'text-neutral-400'
                    }`}
                  />
                  {(currentView === 'brands' || currentView === 'brand-detail' || (selectedBrand !== 'All' && currentView === 'products')) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>

                {/* Compact 2x2 Dropdown Menu */}
                <AnimatePresence>
                  {isBrandsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-[330px] rounded-xl bg-white p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)] border border-[#E5E7EB] z-50 mt-1 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                    >
                      <div className="grid grid-cols-2 gap-2.5">
                        {headerBrands.map((b) => (
                          <button
                            key={b.id || b.slug}
                            onClick={() => {
                              if (brandsTimeoutRef.current) clearTimeout(brandsTimeoutRef.current);
                              setIsBrandsDropdownOpen(false);
                              if (onNavigateBrand) {
                                onNavigateBrand(b);
                              } else {
                                handleNavigate('products', b.name, 'All');
                              }
                            }}
                            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                          >
                            <div className="h-5 w-6 shrink-0 flex items-center justify-center">
                              <BrandLogo logo={b.logo} brandName={b.name} className="h-4 w-auto object-contain transition-transform group-hover:scale-105" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#222] group-hover:text-[#F59E0B] transition-colors">
                              {b.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Khuyến mãi */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigatePromotions) {
                    onNavigatePromotions();
                  } else {
                    handleNavigate('promotions');
                  }
                }}
                className={`relative flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                  currentView === 'promotions'
                    ? 'text-rose-600 font-extrabold'
                    : 'text-rose-600 hover:text-rose-700'
                }`}
                id="nav-promotions-btn"
              >
                <Flame size={13} className="text-rose-600 animate-pulse" />
                <span>{t.promotions}</span>
                {currentView === 'promotions' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-rose-600 rounded-full"
                  />
                )}
              </button>

              {/* Tin tức */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateBlog) {
                    onNavigateBlog();
                  } else {
                    handleNavigate('blog');
                  }
                }}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                  currentView === 'blog'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="nav-blog-btn"
              >
                <span>{t.blog}</span>
                {currentView === 'blog' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

              {/* Liên hệ */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateAboutContact) {
                    onNavigateAboutContact();
                  } else if (onNavigateContact) {
                    onNavigateContact();
                  } else {
                    handleNavigate('about-contact');
                  }
                }}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                  currentView === 'about-contact' || currentView === 'contact'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="nav-about-contact-btn"
              >
                <span>{t.contact}</span>
                {(currentView === 'about-contact' || currentView === 'contact') && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

            </nav>

            {/* 3. RIGHT CONTROLS (SEARCH, FAVORITES, CART, ACCOUNT) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Compact Search Bar */}
              <div className="relative hidden md:block" ref={searchRef}>
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-2.5 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim() !== '') {
                        setCurrentView('products');
                      }
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="h-9 w-24 sm:w-28 md:w-32 lg:w-32 xl:w-44 2xl:w-52 focus:w-44 xl:focus:w-56 rounded-full border border-neutral-200 bg-neutral-50/80 pl-8 pr-7 text-xs font-medium outline-none transition-all duration-300 focus:border-black focus:bg-white focus:shadow-xs"
                    id="header-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-neutral-400 hover:text-black transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Real-time Search Suggestions Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white p-3 shadow-2xl border border-neutral-100 z-50"
                      id="search-suggestions-dropdown"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-2 px-1">
                        <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Gợi ý sản phẩm ({searchSuggestions.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {searchSuggestions.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              onQuickViewProduct(prod);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-neutral-50 cursor-pointer transition-colors group"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-10 w-10 object-contain bg-white border border-neutral-100 rounded-lg p-0.5 group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 text-left overflow-hidden">
                              <h5 className="text-xs font-bold text-neutral-900 truncate">{prod.name}</h5>
                              <span className="text-[10px] font-bold text-neutral-400 uppercase">{prod.brand}</span>
                            </div>
                            <span className="text-xs font-black text-neutral-900 shrink-0">{formatPrice(prod.price)}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('products');
                          setIsSearchFocused(false);
                        }}
                        className="w-full mt-2.5 py-2 rounded-xl bg-neutral-900 text-white text-[11px] font-bold hover:bg-black transition-colors"
                      >
                        Xem tất cả kết quả
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Favorites Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCurrentView('wishlist');
                    setIsFavoritesOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors relative cursor-pointer border border-neutral-200/70 shrink-0"
                  id="favorites-icon"
                  title="Trang Yêu Thích"
                >
                  <Heart size={16} className={favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                      {favorites.length}
                    </span>
                  )}
                </button>

                {/* Favorites Popover */}
                <AnimatePresence>
                  {isFavoritesOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsFavoritesOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-neutral-100 z-50"
                        id="favorites-popup"
                      >
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-3">
                          <span className="text-xs font-black uppercase text-neutral-800 flex items-center gap-1.5">
                            <Heart size={14} className="fill-rose-500 text-rose-500" />
                            <span>Sản phẩm yêu thích ({favorites.length})</span>
                          </span>
                          <button onClick={() => setIsFavoritesOpen(false)} className="text-neutral-400 hover:text-black">
                            <X size={14} />
                          </button>
                        </div>

                        {favorites.length === 0 ? (
                          <div className="text-center py-6 text-xs text-neutral-400 font-medium">
                            Chưa có sản phẩm yêu thích nào.
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                              {favorites.map((fav) => (
                                <div key={fav.id} className="flex items-center justify-between gap-3 p-1.5 hover:bg-neutral-50 rounded-xl transition-colors">
                                  <div
                                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                                    onClick={() => {
                                      onQuickViewProduct(fav);
                                      setIsFavoritesOpen(false);
                                    }}
                                  >
                                    <img src={fav.image} alt={fav.name} className="h-10 w-10 object-contain bg-white border border-neutral-100 rounded-lg p-0.5" referrerPolicy="no-referrer" />
                                    <div className="text-left">
                                      <h5 className="text-xs font-bold text-neutral-900 line-clamp-1">{fav.name}</h5>
                                      <span className="text-[10px] text-neutral-400 font-bold uppercase">{fav.brand} • {formatPrice(fav.price)}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => onToggleFavorite(fav)}
                                    className="text-neutral-300 hover:text-rose-500 p-1"
                                    title="Xóa khỏi yêu thích"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setCurrentView('wishlist');
                                setIsFavoritesOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full mt-3 py-2 rounded-xl bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              XEM TẤT CẢ TRANG YÊU THÍCH
                            </button>
                          </>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => {
                  setCurrentView('cart');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors relative cursor-pointer border border-neutral-200/70 shrink-0"
                id="cart-icon"
                title={t.cart}
              >
                <ShoppingCart size={16} />
                {totalCartQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5400] text-[9px] font-bold text-white shadow-xs">
                    {totalCartQuantity}
                  </span>
                )}
              </button>

              {/* Language Switcher (VIE | ENG) */}
              <LanguageSwitcher
                currentLang={currentLang}
                onLanguageChange={handleLanguageChange}
              />

              {/* User Account / Login Button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex h-9 items-center gap-2 border border-neutral-200/80 rounded-full pl-1.5 pr-3 bg-white hover:border-black transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                    id="user-menu-button"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-black text-white uppercase shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-neutral-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={12} className={`text-neutral-400 transition-transform shrink-0 ${isUserDropdownOpen ? 'rotate-180 text-black' : ''}`} />
                  </button>

                  {/* User Account Dropdown */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-[12px] bg-white p-2 shadow-xl border border-neutral-200/80 z-50"
                        id="user-account-dropdown"
                      >
                        <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-neutral-900 truncate">{user.name}</p>
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                        </div>

                        {user.role === 'admin' ? (
                          <>
                            <button
                              onClick={() => {
                                setCurrentView('admin');
                                setIsUserDropdownOpen(false);
                                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <ShieldCheck size={14} className="text-amber-600" />
                              <span>Trang quản trị (/admin)</span>
                            </button>

                            <div className="border-t border-neutral-100 my-1" />

                            <button
                              onClick={() => {
                                setUser(null);
                                setIsUserDropdownOpen(false);
                                setCurrentView('login');
                                if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <LogOut size={14} className="text-rose-600" />
                              <span>Đăng xuất Admin</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* 1. Hồ sơ cá nhân */}
                            <button
                              onClick={() => {
                                if (onOpenProfileTab) onOpenProfileTab('profile');
                                setCurrentView('profile');
                                setIsUserDropdownOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                                currentView === 'profile' ? 'bg-neutral-100 text-black font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              <UserCheck size={14} className="text-neutral-500" />
                              <span>Hồ sơ cá nhân</span>
                            </button>

                            {/* 2. Đơn hàng của tôi */}
                            <button
                              onClick={() => {
                                setCurrentView('my-orders');
                                setIsUserDropdownOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                                currentView === 'my-orders' ? 'bg-neutral-100 font-bold text-black' : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              <Package size={14} className="text-neutral-500" />
                              <span>Đơn hàng của tôi</span>
                            </button>

                            {/* 3. Yêu thích */}
                            <button
                              onClick={() => {
                                if (onOpenProfileTab) onOpenProfileTab('wishlist');
                                setCurrentView('profile');
                                setIsUserDropdownOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <Heart size={14} className="text-neutral-500" />
                              <span>Sản phẩm yêu thích ({favorites.length})</span>
                            </button>

                            {/* 4. Đổi mật khẩu */}
                            <button
                              onClick={() => {
                                if (onOpenProfileTab) onOpenProfileTab('password');
                                setCurrentView('profile');
                                setIsUserDropdownOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <UserCheck size={14} className="text-neutral-500" />
                              <span>Đổi mật khẩu</span>
                            </button>

                            <div className="border-t border-neutral-100 my-1" />

                            {/* 5. Đăng xuất */}
                            <button
                              onClick={() => {
                                setUser(null);
                                setIsUserDropdownOpen(false);
                                setCurrentView('home');
                                showNotification('Đã đăng xuất thành công');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <LogOut size={14} className="text-rose-600" />
                              <span>Đăng xuất</span>
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setCurrentView('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-neutral-200/80 px-3.5 hover:border-black hover:bg-neutral-50 transition-colors cursor-pointer bg-white shadow-2xs whitespace-nowrap shrink-0"
                  id="auth-trigger-btn"
                >
                  <User size={14} className="text-neutral-700 shrink-0" />
                  <span className="text-xs font-bold text-neutral-800">{t.login}</span>
                </button>
              )}

              {/* Mobile Menu Trigger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 text-neutral-700 lg:hidden"
                id="mobile-menu-btn"
                title="Mở menu"
              >
                <Menu size={18} />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SIDE DRAWER (80% SCREEN WIDTH WITH SLIDE ANIMATION) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[82%] max-w-sm bg-white z-50 lg:hidden flex flex-col shadow-2xl overflow-y-auto"
              id="mobile-nav-panel"
            >
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                <div
                  onClick={() => {
                    handleNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {settings?.logo ? (
                    <img
                      src={settings.logo}
                      alt={settings.storeName || 'K-NICKS'}
                      className="h-7 max-w-[120px] object-contain"
                    />
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-black text-sm">
                        {settings?.storeName ? settings.storeName.charAt(0).toUpperCase() : 'K'}
                      </div>
                      <span className="text-base font-black tracking-tight text-black uppercase">
                        {settings?.storeName || 'K-NICKS'}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="px-5 py-2.5 bg-neutral-50/90 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {currentLang === 'vi' ? 'Ngôn ngữ' : 'Language'}
                </span>
                <LanguageSwitcher currentLang={currentLang} onLanguageChange={handleLanguageChange} />
              </div>

              {/* Search Bar in Mobile Drawer */}
              <div className="p-5 border-b border-neutral-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentView('products');
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-xs font-medium outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Navigation Submenu List */}
              <div className="p-5 space-y-1 flex-1">
                
                {/* Trang chủ */}
                <button
                  onClick={() => handleNavigate('home')}
                  className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-50 flex items-center justify-between"
                >
                  <span>Trang chủ</span>
                  <ChevronRight size={16} className="text-neutral-300" />
                </button>

                {/* Sản phẩm Accordion */}
                <div>
                  <button
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'products' ? null : 'products')}
                    className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-50 flex items-center justify-between"
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown size={16} className={`text-neutral-400 transition-transform ${mobileSubmenu === 'products' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {mobileSubmenu === 'products' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-3 pr-2 py-3 space-y-4 overflow-hidden bg-neutral-50/80 rounded-2xl my-1 border border-neutral-100"
                      >
                        {PRODUCT_MENU_COLUMNS.map((col, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                handleNavigate('products', 'All', col.targetCategory, col.targetGender);
                                setMobileMenuOpen(false);
                              }}
                              className="w-full text-left text-xs font-bold text-[#111111] uppercase tracking-wide px-2 block hover:text-[#F59E0B] transition-colors"
                            >
                              {col.title}
                            </button>
                            <div className="space-y-0.5 pl-2">
                              {col.items.map((item, itemIdx) => (
                                <button
                                  key={itemIdx}
                                  type="button"
                                  onClick={() => {
                                    handleNavigate('products', 'All', item.category, item.gender);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="w-full text-left py-1.5 px-2 text-[13px] font-normal text-[#333333] hover:text-[#F59E0B] rounded-lg transition-colors cursor-pointer"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Thương hiệu Accordion */}
                <div>
                  <button
                    onClick={() => setMobileSubmenu(mobileSubmenu === 'brands' ? null : 'brands')}
                    className="w-full text-left py-3 px-3 rounded-xl text-sm font-bold text-neutral-800 hover:bg-neutral-50 flex items-center justify-between"
                  >
                    <span>Thương hiệu</span>
                    <ChevronDown size={16} className={`text-neutral-400 transition-transform ${mobileSubmenu === 'brands' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {mobileSubmenu === 'brands' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-3 pr-2 py-2 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {headerBrands.map((b) => (
                            <button
                              key={b.id || b.slug}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                if (onNavigateBrand) {
                                  onNavigateBrand(b);
                                } else {
                                  handleNavigate('products', b.name, 'All');
                                }
                              }}
                              className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-amber-50/60 transition-colors text-left"
                            >
                              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                                <BrandLogo logo={b.logo} brandName={b.name} className="h-3.5 w-auto object-contain" />
                              </div>
                              <span className="text-[13px] font-semibold text-[#222] group-hover:text-[#F59E0B] transition-colors">
                                {b.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Khuyến mãi */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigatePromotions) {
                      onNavigatePromotions();
                    } else {
                      handleNavigate('promotions');
                    }
                  }}
                  className={`w-full text-left py-3 px-3 rounded-xl text-sm font-black flex items-center justify-between cursor-pointer transition-colors ${
                    currentView === 'promotions'
                      ? 'bg-rose-50 text-rose-700'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                  id="mobile-nav-promotions-btn"
                >
                  <span className="flex items-center gap-2">
                    <Flame size={16} className="text-rose-600 animate-pulse" />
                    <span>Khuyến mãi</span>
                  </span>
                  <ChevronRight size={16} className="text-rose-400" />
                </button>

                {/* 5. TIN TỨC / BLOG */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateBlog) {
                      onNavigateBlog();
                    } else {
                      handleNavigate('blog');
                    }
                  }}
                  className={`w-full text-left py-3 px-3 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    currentView === 'blog'
                      ? 'bg-neutral-100 text-black font-black'
                      : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                  id="mobile-nav-blog-btn"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className={currentView === 'blog' ? 'text-amber-500' : 'text-neutral-500'} />
                    <span>Tin tức / Blog</span>
                  </span>
                  <ChevronRight size={16} className="text-neutral-300" />
                </button>

                {/* 6. VỀ CHÚNG TÔI & LIÊN HỆ */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateAboutContact) {
                      onNavigateAboutContact();
                    } else if (onNavigateContact) {
                      onNavigateContact();
                    } else {
                      handleNavigate('about-contact');
                    }
                  }}
                  className={`w-full text-left py-3 px-3 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    currentView === 'about-contact' || currentView === 'contact'
                      ? 'bg-neutral-100 text-black font-black'
                      : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                  id="mobile-nav-about-contact-btn"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={16} className={currentView === 'about-contact' || currentView === 'contact' ? 'text-amber-500' : 'text-neutral-500'} />
                    <span>Về chúng tôi & Liên hệ</span>
                  </span>
                  <ChevronRight size={16} className="text-neutral-300" />
                </button>

              </div>

              {/* Drawer User Account Footer */}
              <div className="p-5 border-t border-neutral-100 bg-neutral-50">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-2 border-b border-neutral-200/60">
                      <div className="h-9 w-9 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                          {user.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {user.role === 'admin' ? (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setMobileMenuOpen(false);
                            if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200 flex items-center gap-2.5 transition-colors"
                        >
                          <ShieldCheck size={14} className="text-amber-600" />
                          <span>Trang quản trị (/admin)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUser(null);
                            setMobileMenuOpen(false);
                            setCurrentView('login');
                            if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
                          }}
                          className="w-full py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut size={13} />
                          <span>Đăng xuất Admin</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            if (onOpenProfileTab) onOpenProfileTab('profile');
                            setCurrentView('profile');
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left py-2 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg flex items-center gap-2"
                        >
                          <UserCheck size={14} className="text-neutral-500" />
                          <span>Hồ sơ cá nhân</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('my-orders');
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left py-2 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg flex items-center gap-2"
                        >
                          <Package size={14} className="text-neutral-500" />
                          <span>Đơn hàng của tôi</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('wishlist');
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left py-2 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg flex items-center gap-2"
                        >
                          <Heart size={14} className="text-neutral-500" />
                          <span>Sản phẩm yêu thích ({favorites.length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setUser(null);
                            setMobileMenuOpen(false);
                            setCurrentView('home');
                            showNotification('Đã đăng xuất thành công');
                          }}
                          className="w-full mt-2 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut size={13} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl shadow-md hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <User size={14} />
                    <span>Đăng nhập / Đăng ký</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
