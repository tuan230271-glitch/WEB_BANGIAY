import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Users,
  Star,
  Image as ImageIcon,
  Percent,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  X,
  Menu,
  Lock,
  UserCheck,
  CreditCard,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AdminTab } from '../AdminDashboard';
import { UserProfile, SystemSettings, Product, Order } from '../../types';
import LanguageSwitcher from '../LanguageSwitcher';

interface AdminHeaderProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateClient: () => void;
  settingsState: SystemSettings;
  onRefreshData?: () => Promise<void> | void;
  productsCount: number;
  pendingOrdersCount: number;
  pendingPaymentsCount: number;
  customersCount: number;
  pendingReviewsCount: number;
  activeBannersCount: number;
  activePromotionsCount: number;
  notificationsList: {
    id: string;
    type: string;
    title: string;
    desc: string;
    tab: AdminTab;
    statusFilter?: string;
    time: string;
    unread: boolean;
  }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  globalSearchResults: {
    products: Product[];
    orders: Order[];
    customers: UserProfile[];
    total: number;
  };
  setOrderStatusFilter?: (status: string) => void;
}

export default function AdminHeader({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onNavigateClient,
  settingsState,
  productsCount,
  pendingOrdersCount,
  pendingPaymentsCount,
  customersCount,
  pendingReviewsCount,
  activeBannersCount,
  activePromotionsCount,
  notificationsList,
  searchQuery,
  setSearchQuery,
  globalSearchResults,
  setOrderStatusFilter,
  onRefreshData
}: AdminHeaderProps) {
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<'products' | 'sales' | 'marketing' | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for click outside
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const salesMenuRef = useRef<HTMLDivElement>(null);
  const marketingMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(e.target as Node)) {
        if (openDropdown === 'products') setOpenDropdown(null);
      }
      if (salesMenuRef.current && !salesMenuRef.current.contains(e.target as Node)) {
        if (openDropdown === 'sales') setOpenDropdown(null);
      }
      if (marketingMenuRef.current && !marketingMenuRef.current.contains(e.target as Node)) {
        if (openDropdown === 'marketing') setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Shortcut Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: AdminTab, orderStatus?: string) => {
    setActiveTab(tab);
    if (orderStatus && setOrderStatusFilter) {
      setOrderStatusFilter(orderStatus);
    }
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
      window.history.pushState({}, '', targetPath);
    }
    setOpenDropdown(null);
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsSearchFocused(false);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active status helpers
  const isProductsActive = ['products', 'categories', 'brands'].includes(activeTab);
  const isSalesActive = ['orders', 'payments'].includes(activeTab);
  const isMarketingActive = ['reviews', 'banners', 'promotions'].includes(activeTab);

  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* STICKY MAIN HORIZONTAL HEADER (SYNCED WITH CUSTOMER) */}
      {/* ---------------------------------------------------- */}
      <header
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 shadow-xs admin-header print:hidden transition-all duration-300"
        id="admin-horizontal-header"
      >
        <div className="mx-auto max-w-[1800px] px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 min-h-[44px]">

            {/* 1. BRAND LOGO K-NICKS ADMIN */}
            <div
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
              id="admin-logo-box"
              title="Về Dashboard Quản Trị"
            >
              {settingsState?.logo ? (
                <img
                  src={settingsState.logo}
                  alt={settingsState.storeName || 'K-NICKS'}
                  className="h-9 max-w-[130px] object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white font-black text-lg shadow-sm transition-transform group-hover:scale-105">
                    {settingsState?.storeName ? settingsState.storeName.charAt(0).toUpperCase() : 'K'}
                  </div>
                  <span className="text-lg font-black tracking-tight text-black uppercase">
                    {settingsState?.storeName || 'K-NICKS'}
                  </span>
                </>
              )}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase text-black bg-[#F59E0B] select-none leading-none shadow-2xs">
                ADMIN
              </span>
            </div>

            {/* 2. CENTRAL HORIZONTAL NAVIGATION (DESKTOP) */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-4 shrink-0">
              
              {/* --- DASHBOARD --- */}
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="admin-nav-dashboard"
              >
                <span>Dashboard</span>
                {activeTab === 'dashboard' && (
                  <motion.div
                    layoutId="adminNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

              {/* --- SẢN PHẨM ▾ (DROPDOWN) --- */}
              <div
                className="relative"
                ref={productsMenuRef}
                onMouseEnter={() => setOpenDropdown('products')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'products' ? null : 'products')}
                  className={`relative flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                    isProductsActive
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                  id="admin-nav-products"
                >
                  <span>Sản phẩm</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      openDropdown === 'products' ? 'rotate-180 text-black' : 'text-neutral-400'
                    }`}
                  />
                  {isProductsActive && (
                    <motion.div
                      layoutId="adminNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {openDropdown === 'products' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-56 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200/80 z-50 mt-1"
                    >
                      <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                          Quản lý sản phẩm & kho
                        </span>
                      </div>

                      {/* Quản lý sản phẩm */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('products')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'products'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Package size={14} className={activeTab === 'products' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý sản phẩm</span>
                        </div>
                        {productsCount > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                            {productsCount}
                          </span>
                        )}
                      </button>

                      {/* Quản lý danh mục */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('categories')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'categories'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderTree size={14} className={activeTab === 'categories' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý danh mục</span>
                        </div>
                      </button>

                      {/* Quản lý thương hiệu */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('brands')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'brands'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Tag size={14} className={activeTab === 'brands' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý thương hiệu</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- BÁN HÀNG ▾ (DROPDOWN) --- */}
              <div
                className="relative"
                ref={salesMenuRef}
                onMouseEnter={() => setOpenDropdown('sales')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'sales' ? null : 'sales')}
                  className={`relative flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                    isSalesActive
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                  id="admin-nav-sales"
                >
                  <span>Bán hàng</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      openDropdown === 'sales' ? 'rotate-180 text-black' : 'text-neutral-400'
                    }`}
                  />
                  {pendingOrdersCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ml-0.5" />
                  )}
                  {isSalesActive && (
                    <motion.div
                      layoutId="adminNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {openDropdown === 'sales' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-56 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200/80 z-50 mt-1"
                    >
                      <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                          Quản lý đơn & giao dịch
                        </span>
                      </div>

                      {/* Quản lý đơn hàng */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('orders')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'orders'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ShoppingBag size={14} className={activeTab === 'orders' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý đơn hàng</span>
                        </div>
                        {pendingOrdersCount > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                            {pendingOrdersCount}
                          </span>
                        )}
                      </button>

                      {/* Quản lý thanh toán */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('payments')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'payments'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard size={14} className={activeTab === 'payments' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý thanh toán</span>
                        </div>
                        {pendingPaymentsCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                            {pendingPaymentsCount}
                          </span>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- KHÁCH HÀNG --- */}
              <button
                type="button"
                onClick={() => handleNavigate('customers')}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'customers'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="admin-nav-customers"
              >
                <span>Khách hàng</span>
                {activeTab === 'customers' && (
                  <motion.div
                    layoutId="adminNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

              {/* --- MARKETING ▾ (DROPDOWN) --- */}
              <div
                className="relative"
                ref={marketingMenuRef}
                onMouseEnter={() => setOpenDropdown('marketing')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'marketing' ? null : 'marketing')}
                  className={`relative flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 cursor-pointer whitespace-nowrap ${
                    isMarketingActive
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                  id="admin-nav-marketing"
                >
                  <span>Marketing</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      openDropdown === 'marketing' ? 'rotate-180 text-black' : 'text-neutral-400'
                    }`}
                  />
                  {pendingReviewsCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ml-0.5" />
                  )}
                  {isMarketingActive && (
                    <motion.div
                      layoutId="adminNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {openDropdown === 'marketing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-56 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200/80 z-50 mt-1"
                    >
                      <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                          Đánh giá & Chiến dịch
                        </span>
                      </div>

                      {/* Quản lý đánh giá */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('reviews')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'reviews'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Star size={14} className={activeTab === 'reviews' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý đánh giá</span>
                        </div>
                        {pendingReviewsCount > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                            {pendingReviewsCount}
                          </span>
                        )}
                      </button>

                      {/* Quản lý Banner */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('banners')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'banners'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ImageIcon size={14} className={activeTab === 'banners' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý Banner</span>
                        </div>
                        {activeBannersCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                            {activeBannersCount}
                          </span>
                        )}
                      </button>

                      {/* Quản lý khuyến mãi */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('promotions')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activeTab === 'promotions'
                            ? 'bg-neutral-100 text-black font-extrabold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Percent size={14} className={activeTab === 'promotions' ? 'text-black' : 'text-neutral-500'} />
                          <span>Quản lý khuyến mãi</span>
                        </div>
                        {activePromotionsCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                            {activePromotionsCount}
                          </span>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- BÁO CÁO --- */}
              <button
                type="button"
                onClick={() => handleNavigate('reports')}
                className={`relative text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'reports'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="admin-nav-reports"
              >
                <span>Báo cáo</span>
                {activeTab === 'reports' && (
                  <motion.div
                    layoutId="adminNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

              {/* --- CÀI ĐẶT --- */}
              <button
                type="button"
                onClick={() => handleNavigate('settings')}
                className={`relative flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide transition-colors py-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-black font-extrabold'
                    : 'text-neutral-600 hover:text-black'
                }`}
                id="admin-nav-settings"
              >
                <Settings size={13} className={activeTab === 'settings' ? 'text-black' : 'text-neutral-500'} />
                <span>Cài đặt</span>
                {activeTab === 'settings' && (
                  <motion.div
                    layoutId="adminNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-black rounded-full"
                  />
                )}
              </button>

            </nav>

            {/* 3. RIGHT CONTROLS: SEARCH, NOTIFICATIONS, ADMIN ACCOUNT */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* --- COMPACT GLOBAL SEARCH INPUT (Ctrl + K) --- */}
              <div className="relative hidden md:block" ref={searchContainerRef}>
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-2.5 text-neutral-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm nhanh... (Ctrl K)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsSearchFocused(false);
                        searchInputRef.current?.blur();
                      } else if (e.key === 'Enter' && searchQuery.trim()) {
                        if (globalSearchResults.products.length > 0) {
                          handleNavigate('products');
                        } else if (globalSearchResults.orders.length > 0) {
                          handleNavigate('orders');
                        } else if (globalSearchResults.customers.length > 0) {
                          handleNavigate('customers');
                        }
                      }
                    }}
                    className="h-9 w-28 sm:w-32 lg:w-36 xl:w-52 focus:w-52 xl:focus:w-64 rounded-full border border-neutral-200 bg-neutral-50/90 pl-8 pr-7 text-xs font-medium outline-none transition-all duration-300 focus:border-black focus:bg-white focus:shadow-xs placeholder:text-neutral-400"
                    id="admin-header-search-input"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-2.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  ) : null}
                </div>

                {/* SEARCH RESULTS POPUP */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-2xl border border-neutral-200 z-50 divide-y divide-neutral-100"
                    >
                      {globalSearchResults.total === 0 ? (
                        <div className="p-4 text-center text-neutral-400">
                          <Search size={24} className="mx-auto mb-1.5 opacity-30 text-neutral-500" />
                          <p className="text-xs font-bold text-neutral-700">Không tìm thấy "{searchQuery}"</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Thử tìm tên giày, mã đơn hoặc khách hàng</p>
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto p-1 space-y-2.5">
                          {/* Products */}
                          {globalSearchResults.products.length > 0 && (
                            <div>
                              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                                <span>Sản phẩm ({globalSearchResults.products.length})</span>
                                <button
                                  type="button"
                                  onClick={() => handleNavigate('products')}
                                  className="text-amber-600 hover:underline cursor-pointer"
                                >
                                  Xem tất cả
                                </button>
                              </div>
                              <div className="mt-1 space-y-1">
                                {globalSearchResults.products.map((p) => (
                                  <div
                                    key={p.id}
                                    onClick={() => handleNavigate('products')}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
                                  >
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="h-8 w-8 rounded-lg object-contain bg-white p-0.5 border border-neutral-200 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-neutral-900 truncate group-hover:text-amber-600">
                                        {p.name}
                                      </p>
                                      <p className="text-[10px] text-neutral-500">
                                        {(p.price || 0).toLocaleString('vi-VN')}đ • {p.brand}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Orders */}
                          {globalSearchResults.orders.length > 0 && (
                            <div className="pt-2">
                              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                                <span>Đơn hàng ({globalSearchResults.orders.length})</span>
                                <button
                                  type="button"
                                  onClick={() => handleNavigate('orders')}
                                  className="text-amber-600 hover:underline cursor-pointer"
                                >
                                  Xem tất cả
                                </button>
                              </div>
                              <div className="mt-1 space-y-1">
                                {globalSearchResults.orders.map((o) => (
                                  <div
                                    key={o.id}
                                    onClick={() => handleNavigate('orders')}
                                    className="flex items-center justify-between p-1.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
                                  >
                                    <div>
                                      <p className="font-mono text-xs font-black text-neutral-900 group-hover:text-amber-600">
                                        {o.orderCode}
                                      </p>
                                      <p className="text-[10px] text-neutral-500">
                                        {o.recipientName} • {(o.grandTotal || 0).toLocaleString('vi-VN')}đ
                                      </p>
                                    </div>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                                      {o.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- DATABASE SYNC BUTTON 🔄 --- */}
              {onRefreshData && (
                <button
                  type="button"
                  onClick={async () => {
                    if (isRefreshing) return;
                    setIsRefreshing(true);
                    try {
                      await onRefreshData();
                    } finally {
                      setTimeout(() => setIsRefreshing(false), 500);
                    }
                  }}
                  disabled={isRefreshing}
                  className="flex h-9 items-center gap-1.5 px-3 rounded-full bg-neutral-50 hover:bg-neutral-100 hover:border-black text-neutral-700 hover:text-black transition-all cursor-pointer border border-neutral-200/70 text-xs font-bold shrink-0 shadow-2xs"
                  id="admin-sync-db-btn"
                  title="Đồng bộ toàn bộ dữ liệu mới nhất từ Database Supabase"
                >
                  <RefreshCw
                    size={13}
                    className={`transition-colors ${
                      isRefreshing ? 'animate-spin text-amber-500' : 'text-neutral-500'
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isRefreshing ? 'Đang đồng bộ...' : 'Đồng bộ DB'}
                  </span>
                </button>
              )}

              {/* --- SYSTEM NOTIFICATIONS 🔔 --- */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors relative cursor-pointer border border-neutral-200/70 shrink-0"
                  id="admin-notifications-btn"
                  title="Thông báo hệ thống"
                >
                  <Bell size={16} />
                  {notificationsList.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs animate-pulse">
                      {notificationsList.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 z-50"
                      id="admin-notifications-dropdown"
                    >
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-100">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-neutral-900">
                          <Bell size={14} className="text-amber-500" />
                          <span>Thông báo Admin ({notificationsList.length})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notificationsList.length === 0 ? (
                          <div className="py-6 text-center text-xs text-neutral-400 font-medium">
                            Không có thông báo mới nào cần xử lý.
                          </div>
                        ) : (
                          notificationsList.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                handleNavigate(n.tab, n.statusFilter);
                              }}
                              className="p-2.5 rounded-xl bg-neutral-50 hover:bg-amber-50/70 border border-neutral-100 hover:border-amber-200 transition-colors cursor-pointer text-left"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-neutral-900">{n.title}</span>
                                <span className="text-[10px] font-bold text-neutral-400">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-neutral-600 line-clamp-2">{n.desc}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- LANGUAGE SWITCHER (VIE | ENG) 🇻🇳 🇬🇧 --- */}
              <LanguageSwitcher className="hidden sm:flex" />

              {/* --- ADMIN ACCOUNT DROPDOWN [Avatar] Admin ▾ --- */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex h-9 items-center gap-2 border border-neutral-200/80 rounded-full pl-1.5 pr-2.5 sm:pr-3 bg-white hover:border-black transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                  id="admin-user-menu-btn"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-black text-white uppercase shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user?.name || 'Admin'} className="h-full w-full object-cover" />
                    ) : (
                      user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-800 max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline-block">
                    {user?.name || 'Admin'}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-neutral-400 transition-transform shrink-0 ${
                      isUserDropdownOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-neutral-200 z-50"
                      id="admin-account-dropdown"
                    >
                      {/* User Info Header */}
                      <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-neutral-900 truncate">{user?.name || 'Admin'}</p>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                            Admin System
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">{user?.email || 'admin@solestyle.com'}</p>
                      </div>

                      {/* View Client Website */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          if (onNavigateClient) {
                            onNavigateClient();
                          } else if (typeof window !== 'undefined') {
                            window.history.pushState({}, '', '/');
                            window.location.reload();
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-between transition-colors cursor-pointer mb-1"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink size={13} className="text-amber-600" />
                          <span>Xem trang khách hàng</span>
                        </div>
                        <span className="text-[10px] text-amber-500">↗</span>
                      </button>

                      {/* Admin Profile */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('settings')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <UserCheck size={14} className="text-neutral-500" />
                        <span>Thông tin tài khoản</span>
                      </button>

                      {/* Change Password */}
                      <button
                        type="button"
                        onClick={() => handleNavigate('settings')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Lock size={14} className="text-neutral-500" />
                        <span>Đổi mật khẩu</span>
                      </button>

                      <div className="border-t border-neutral-100 my-1" />

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        id="admin-logout-btn"
                      >
                        <LogOut size={14} className="text-rose-600" />
                        <span>Đăng xuất Admin</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- MOBILE HAMBURGER BUTTON (VISIBLE < lg) --- */}
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 lg:hidden border border-neutral-200/70 shrink-0 cursor-pointer"
                id="admin-mobile-menu-btn"
                title="Mở menu quản trị"
              >
                <Menu size={18} />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MOBILE DRAWER (SLIDE FROM LEFT)                      */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 lg:hidden flex flex-col shadow-2xl overflow-y-auto"
              id="admin-mobile-drawer"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
                <div
                  onClick={() => {
                    handleNavigate('dashboard');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
                >
                  {settingsState?.logo ? (
                    <img
                      src={settingsState.logo}
                      alt={settingsState.storeName || 'K-NICKS'}
                      className="h-7 max-w-[120px] object-contain"
                    />
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-black text-sm">
                        {settingsState?.storeName ? settingsState.storeName.charAt(0).toUpperCase() : 'K'}
                      </div>
                      <span className="text-lg font-black tracking-tight text-black uppercase">
                        {settingsState?.storeName || 'K-NICKS'}
                      </span>
                    </>
                  )}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase text-black bg-[#F59E0B] select-none leading-none">
                    ADMIN
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Bar in Mobile Drawer */}
              <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm, đơn hàng, khách..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-xs font-medium outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Navigation Items in Drawer */}
              <div className="p-4 space-y-4 flex-1">
                
                {/* 1. TỔNG QUAN */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Tổng quan
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-black text-white font-black shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <LayoutDashboard size={16} className={activeTab === 'dashboard' ? 'text-white' : 'text-neutral-500'} />
                    <span>Dashboard Hệ thống</span>
                  </button>
                </div>

                {/* 2. SẢN PHẨM & KHO */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Sản phẩm & Kho
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('products')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'products'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} className={activeTab === 'products' ? 'text-white' : 'text-neutral-500'} />
                        <span>Quản lý sản phẩm</span>
                      </div>
                      {productsCount > 0 && (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          activeTab === 'products' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
                        }`}>
                          {productsCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('categories')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'categories'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <FolderTree size={16} className={activeTab === 'categories' ? 'text-white' : 'text-neutral-500'} />
                      <span>Quản lý danh mục</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('brands')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'brands'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Tag size={16} className={activeTab === 'brands' ? 'text-white' : 'text-neutral-500'} />
                      <span>Quản lý thương hiệu</span>
                    </button>
                  </div>
                </div>

                {/* 3. BÁN HÀNG & THANH TOÁN */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Bán hàng & Thanh toán
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('orders')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'orders'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={16} className={activeTab === 'orders' ? 'text-white' : 'text-neutral-500'} />
                        <span>Quản lý đơn hàng</span>
                      </div>
                      {pendingOrdersCount > 0 && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                          {pendingOrdersCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('payments')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'payments'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className={activeTab === 'payments' ? 'text-white' : 'text-neutral-500'} />
                        <span>Quản lý thanh toán</span>
                      </div>
                      {pendingPaymentsCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                          {pendingPaymentsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. KHÁCH HÀNG */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Khách hàng
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNavigate('customers')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      activeTab === 'customers'
                        ? 'bg-black text-white font-black shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} className={activeTab === 'customers' ? 'text-white' : 'text-neutral-500'} />
                      <span>Quản lý khách hàng</span>
                    </div>
                    {customersCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                        {customersCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* 5. MARKETING */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Marketing & Truyền thông
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('reviews')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'reviews'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Star size={16} className={activeTab === 'reviews' ? 'text-white' : 'text-neutral-500'} />
                        <span>Quản lý đánh giá</span>
                      </div>
                      {pendingReviewsCount > 0 && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                          {pendingReviewsCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('banners')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'banners'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <ImageIcon size={16} className={activeTab === 'banners' ? 'text-white' : 'text-neutral-500'} />
                      <span>Quản lý Banner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('promotions')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'promotions'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Percent size={16} className={activeTab === 'promotions' ? 'text-white' : 'text-neutral-500'} />
                      <span>Quản lý khuyến mãi</span>
                    </button>
                  </div>
                </div>

                {/* 6. BÁO CÁO & CÀI ĐẶT */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 block mb-1.5">
                    Hệ thống
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('reports')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'reports'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <BarChart3 size={16} className={activeTab === 'reports' ? 'text-white' : 'text-neutral-500'} />
                      <span>Báo cáo & Thống kê</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('settings')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                        activeTab === 'settings'
                          ? 'bg-black text-white font-black shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Settings size={16} className={activeTab === 'settings' ? 'text-white' : 'text-neutral-500'} />
                      <span>Cài đặt hệ thống</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    if (onNavigateClient) {
                      onNavigateClient();
                    } else if (typeof window !== 'undefined') {
                      window.history.pushState({}, '', '/');
                      window.location.reload();
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink size={14} className="text-amber-600" />
                  <span>Xem trang khách hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất Admin</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
