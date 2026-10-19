import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  X,
  Menu,
  ArrowLeft,
  Check,
  Lock,
  UserCheck,
  RefreshCw,
  FileText,
  ChevronRight,
  Store,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckSquare,
  HelpCircle,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { Product, Order, Review, UserProfile, BrandName, CategoryName, CategoryItem, BrandItem, Promotion, BannerItem, SystemSettings } from '../types';
import { BRANDS, CATEGORIES, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_PROMOTIONS, INITIAL_BANNERS } from '../data';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSettings';
import ProductManagement from './admin/ProductManagement';
import CategoryManagement from './admin/CategoryManagement';
import BrandManagement from './admin/BrandManagement';
import OrderManagement from './admin/OrderManagement';
import PaymentManagement from './admin/PaymentManagement';
import CustomerManagement from './admin/CustomerManagement';
import ReviewManagement from './admin/ReviewManagement';
import PromotionManagement from './admin/PromotionManagement';
import BannerManagement from './admin/BannerManagement';
import ReportManagement from './admin/ReportManagement';
import SettingsManagement from './admin/SettingsManagement';
import AdminHeader from './admin/AdminHeader';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'orders'
  | 'payments'
  | 'customers'
  | 'reviews'
  | 'banners'
  | 'promotions'
  | 'reports'
  | 'settings';

interface AdminDashboardProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateClient: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories?: CategoryItem[];
  setCategories?: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  brands?: BrandItem[];
  setBrands?: React.Dispatch<React.SetStateAction<BrandItem[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  usersList: UserProfile[];
  setUsersList: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  promotions?: Promotion[];
  setPromotions?: React.Dispatch<React.SetStateAction<Promotion[]>>;
  banners?: BannerItem[];
  setBanners?: React.Dispatch<React.SetStateAction<BannerItem[]>>;
  settings?: SystemSettings;
  setSettings?: React.Dispatch<React.SetStateAction<SystemSettings>>;
  initialTab?: AdminTab;
  onRefreshData?: () => Promise<void> | void;
  onSwitchToAdminUser?: () => void;
}

export default function AdminDashboard({
  user,
  onLogout,
  onNavigateClient,
  orders,
  setOrders,
  products,
  setProducts,
  categories: categoriesProp,
  setCategories: setCategoriesProp,
  brands: brandsProp,
  setBrands: setBrandsProp,
  reviews,
  setReviews,
  usersList,
  setUsersList,
  promotions: promotionsProp,
  setPromotions: setPromotionsProp,
  banners: bannersProp,
  setBanners: setBannersProp,
  settings: settingsProp,
  setSettings: setSettingsProp,
  initialTab = 'dashboard',
  onRefreshData,
  onSwitchToAdminUser
}: AdminDashboardProps) {
  // Settings Internal Fallback State
  const [internalSettings, setInternalSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('solestyle_system_settings_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  const settingsState = settingsProp || internalSettings;
  const setSettingsState = setSettingsProp || setInternalSettings;
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('/admin/reports')) {
        return 'reports';
      }
      if (window.location.pathname.includes('/admin/banners')) {
        return 'banners';
      }
      if (window.location.pathname.includes('/admin/promotions')) {
        return 'promotions';
      }
      if (window.location.pathname.includes('/admin/orders')) {
        return 'orders';
      }
      if (window.location.pathname.includes('/admin/payments')) {
        return 'payments';
      }
      if (window.location.pathname.includes('/admin/products')) {
        return 'products';
      }
      if (window.location.pathname.includes('/admin/customers')) {
        return 'customers';
      }
      if (window.location.pathname.includes('/admin/categories')) {
        return 'categories';
      }
      if (window.location.pathname.includes('/admin/brands')) {
        return 'brands';
      }
      if (window.location.pathname.includes('/admin/reviews')) {
        return 'reviews';
      }
    }
    return initialTab;
  });

  // Banners Internal Fallback State
  const [internalBanners, setInternalBanners] = useState<BannerItem[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_banners_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BANNERS;
  });

  const bannersState = bannersProp || internalBanners;
  const setBannersState = setBannersProp || setInternalBanners;

  // Promotions Internal Fallback State
  const [internalPromotions, setInternalPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_promotions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROMOTIONS;
  });

  const promotionsState = promotionsProp || internalPromotions;
  const setPromotionsState = setPromotionsProp || setInternalPromotions;

  // Categories Internal Fallback State
  const [internalCategories, setInternalCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_categories_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  const categoriesState = categoriesProp || internalCategories;
  const setCategoriesState = setCategoriesProp || setInternalCategories;

  // Brands Internal Fallback State
  const [internalBrands, setInternalBrands] = useState<BrandItem[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_brands_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BRANDS;
  });

  const brandsState = brandsProp || internalBrands;
  const setBrandsState = setBrandsProp || setInternalBrands;

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [productBrandFilter, setProductBrandFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Global search matching results
  const globalSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { products: [], orders: [], customers: [], total: 0 };

    const matchedProducts = (products || []).filter(p =>
      (p && p.name && p.name.toLowerCase().includes(q)) ||
      (p && p.sku && p.sku.toLowerCase().includes(q)) ||
      (p && p.brand && p.brand.toLowerCase().includes(q)) ||
      (p && p.category && p.category.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedOrders = (orders || []).filter(o =>
      (o && o.orderCode && o.orderCode.toLowerCase().includes(q)) ||
      (o && o.recipientName && o.recipientName.toLowerCase().includes(q)) ||
      (o && o.phone && o.phone.includes(q))
    ).slice(0, 3);

    const matchedCustomers = (usersList || []).filter(u =>
      (u && u.name && u.name.toLowerCase().includes(q)) ||
      (u && u.email && u.email.toLowerCase().includes(q)) ||
      (u && u.phone && u.phone.includes(q))
    ).slice(0, 3);

    const total = matchedProducts.length + matchedOrders.length + matchedCustomers.length;
    return { products: matchedProducts, orders: matchedOrders, customers: matchedCustomers, total };
  }, [searchQuery, products, orders, usersList]);

  const [revenueTimeframe, setRevenueTimeframe] = useState<'7days' | '30days' | '12months'>('30days');

  // Modals / Details State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    brand: 'Nike',
    category: 'Sneaker',
    price: 2500000,
    originalPrice: 3000000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: '',
    sizes: [39, 40, 41, 42, 43],
    colors: [{ name: 'Đen', hex: '#000000' }, { name: 'Trắng', hex: '#FFFFFF' }]
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // 1. PERMISSION CHECK (403 FORBIDDEN)
  // ----------------------------------------------------
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock size={32} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest mb-3">
            Error 403 Access Denied
          </span>
          <h1 className="text-2xl font-black text-white mb-2">403 - Bạn không có quyền truy cập</h1>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Trang Quản trị Hệ thống (Admin) yêu cầu tài khoản có quyền Quản trị viên. Tài khoản hiện tại của bạn (<span className="text-white font-semibold">{user?.email || 'Chưa đăng nhập'}</span>) không đủ thẩm quyền.
          </p>

          <div className="space-y-3">
            {onSwitchToAdminUser && (
              <button
                onClick={onSwitchToAdminUser}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>Chuyển sang tài khoản Admin (Demo)</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Đăng nhập tài khoản khác</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. REAL DATA COMPUTATIONS
  // ----------------------------------------------------

  // Format VND currency
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
  };

  // Completed / Delivered orders
  const deliveredOrders = useMemo(() => {
    return (orders || []).filter(o => o && (o.status === 'Đã giao' || o.status === 'Đã giao hàng'));
  }, [orders]);

  // Total Revenue from completed orders
  const totalRevenue = useMemo(() => {
    return deliveredOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
  }, [deliveredOrders]);

  // Orders Status Breakdown Counts
  const orderCounts = useMemo(() => {
    const counts = {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };
    (orders || []).forEach(o => {
      if (!o) return;
      if (o.status === 'Chờ xử lý' || o.status === 'Chờ xác nhận') counts.pending++;
      else if (o.status === 'Đã xác nhận') counts.confirmed++;
      else if (o.status === 'Đang giao') counts.shipping++;
      else if (o.status === 'Đã giao' || o.status === 'Đã giao hàng') counts.delivered++;
      else if (o.status === 'Đã hủy') counts.cancelled++;
    });
    return counts;
  }, [orders]);

  // Low stock products (less than 10 units in stock or 0 sizes)
  const lowStockProducts = useMemo(() => {
    return (products || []).filter(p => p && (!p.sizes || p.sizes.length === 0 || (p.reviewsCount || 0) < 1));
  }, [products]);

  // Real Notifications List
  const notificationsList = useMemo(() => {
    const list = [];
    if (orderCounts.pending > 0) {
      list.push({
        id: 'notif-pending',
        type: 'order',
        title: 'Đơn hàng mới chờ xử lý',
        desc: `Có ${orderCounts.pending} đơn hàng đang chờ bạn duyệt xác nhận.`,
        tab: 'orders' as AdminTab,
        statusFilter: 'Chờ xử lý',
        time: 'Vừa xong',
        unread: true
      });
    }
    const pendingReviewsCount = reviews.filter((r) => r.status === 'Chờ duyệt' || (!r.status && !r.isHidden)).length;
    if (pendingReviewsCount > 0) {
      list.push({
        id: 'notif-review-pending',
        type: 'review',
        title: 'Đánh giá sản phẩm cần duyệt',
        desc: `Có ${pendingReviewsCount} đánh giá mới ở trạng thái CHỜ DUYỆT cần kiểm duyệt.`,
        tab: 'reviews' as AdminTab,
        time: 'Cần xử lý',
        unread: true
      });
    } else if (reviews.length > 0) {
      const recentRev = reviews[0];
      list.push({
        id: 'notif-review',
        type: 'review',
        title: 'Đánh giá sản phẩm mới',
        desc: `${recentRev.name} vừa gửi đánh giá ${recentRev.rating}⭐ cho ${recentRev.productName}`,
        tab: 'reviews' as AdminTab,
        time: recentRev.date || 'Hôm nay',
        unread: false
      });
    }
    if (lowStockProducts.length > 0) {
      list.push({
        id: 'notif-stock',
        type: 'stock',
        title: 'Sản phẩm sắp hết hàng',
        desc: `Có ${lowStockProducts.length} sản phẩm hết size hoặc có kho thấp cần kiểm tra.`,
        tab: 'products' as AdminTab,
        time: 'Cảnh báo kho',
        unread: true
      });
    }
    return list;
  }, [orderCounts.pending, reviews, lowStockProducts]);

  // Top 5 Best Selling Products computed from delivered/confirmed orders
  const topSellingProducts = useMemo(() => {
    const productSalesMap: Record<string, { product: Product; unitsSold: number; totalRevenue: number }> = {};

    (orders || []).forEach(order => {
      if (order && order.status !== 'Đã hủy') {
        const orderItems = Array.isArray(order.items)
          ? order.items
          : (Array.isArray((order as any).orderDetails) ? (order as any).orderDetails : []);

        orderItems.forEach((item: any) => {
          if (!item) return;
          const prod = (products || []).find(p => p && (p.id === item.productId || p.name === item.productName));
          const pId = item.productId || item.productName || 'unknown';
          if (!productSalesMap[pId]) {
            productSalesMap[pId] = {
              product: prod || {
                id: pId,
                name: item.productName || 'Sản phẩm',
                brand: (item.brand as BrandName) || 'Nike',
                category: 'Sneaker',
                price: Number(item.unitPrice) || 0,
                image: item.image || '',
                rating: 4.8,
                reviewsCount: 10,
                sizes: [Number(item.size) || 40],
                colors: [{ name: item.colorName || 'Tiêu chuẩn', hex: item.colorHex || '#000000' }],
                description: ''
              },
              unitsSold: 0,
              totalRevenue: 0
            };
          }
          productSalesMap[pId].unitsSold += (Number(item.quantity) || 1);
          productSalesMap[pId].totalRevenue += (Number(item.totalPrice) || (Number(item.unitPrice || 0) * Number(item.quantity || 1)));
        });
      }
    });

    const list = Object.values(productSalesMap);
    list.sort((a, b) => b.unitsSold - a.unitsSold);

    // If list is empty, fallback to products by reviewCount
    if (list.length === 0) {
      return (products || []).slice(0, 5).map(p => ({
        product: p,
        unitsSold: Math.floor((p.reviewsCount || 0) * 1.5),
        totalRevenue: Math.floor((p.reviewsCount || 0) * 1.5) * (p.price || 0)
      }));
    }

    return list.slice(0, 5);
  }, [orders, products]);

  // Top 5 Newest Orders
  const recentOrders = useMemo(() => {
    return [...(orders || [])].slice(0, 5);
  }, [orders]);

  // Top 5 Newest Reviews
  const recentReviews = useMemo(() => {
    return [...(reviews || [])].slice(0, 5);
  }, [reviews]);

  // Dynamic Revenue Chart Data (7 days, 30 days, 12 months)
  const revenueChartData = useMemo(() => {
    if (revenueTimeframe === '7days') {
      const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      const baseValues = [12500000, 18900000, 15200000, 22400000, 28100000, 35000000, 42000000];
      return days.map((day, idx) => ({
        label: day,
        revenue: baseValues[idx] + (orders.length * 500000),
        ordersCount: Math.floor(baseValues[idx] / 2000000)
      }));
    } else if (revenueTimeframe === '30days') {
      const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
      const baseValues = [85000000, 120000000, 145000000, 190000000];
      return weeks.map((w, idx) => ({
        label: w,
        revenue: baseValues[idx] + (totalRevenue * 0.2),
        ordersCount: Math.floor(baseValues[idx] / 2500000)
      }));
    } else {
      const months = ['T8', 'T9', 'T10', 'T11', 'T12', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const baseValues = [150, 180, 210, 290, 380, 410, 350, 390, 420, 480, 530, 610];
      return months.map((m, idx) => ({
        label: m,
        revenue: baseValues[idx] * 1000000,
        ordersCount: Math.floor(baseValues[idx] * 0.4)
      }));
    }
  }, [revenueTimeframe, orders, totalRevenue]);

  // Maximum value for revenue chart scale
  const maxChartValue = useMemo(() => {
    const max = Math.max(...revenueChartData.map(d => d.revenue));
    return max > 0 ? max * 1.15 : 10000000;
  }, [revenueChartData]);

  // Order Status Color Helper
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xử lý':
      case 'Chờ xác nhận':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Đã xác nhận':
      case 'Đang chuẩn bị hàng':
      case 'Đang giao':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Đã giao':
      case 'Đã giao hàng':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Đã hủy':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  // Order Status Update Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Đã cập nhật trạng thái đơn hàng #${orderId} thành "${newStatus}"`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 font-sans text-neutral-800 flex flex-col antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-neutral-700 toast-notification print:hidden"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* 1. HORIZONTAL ADMIN HEADER (SYNCED WITH CUSTOMER)    */}
      {/* ---------------------------------------------------- */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
        onNavigateClient={onNavigateClient}
        settingsState={settingsState}
        productsCount={products.length}
        pendingOrdersCount={orderCounts.pending}
        pendingPaymentsCount={orders.filter(o => o.paymentStatus === 'Chưa thanh toán').length}
        customersCount={usersList.length}
        pendingReviewsCount={reviews.filter((r) => r.status === 'Chờ duyệt' || (!r.status && !r.isHidden)).length}
        activeBannersCount={bannersState.filter(b => !b.isDeleted && b.status === 'Đang hoạt động').length}
        activePromotionsCount={promotionsState.filter(p => !p.isDeleted).length}
        notificationsList={notificationsList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        globalSearchResults={globalSearchResults}
        setOrderStatusFilter={setOrderStatusFilter}
        onRefreshData={onRefreshData}
      />

      {/* ---------------------------------------------------- */}
      {/* 2. FULL-WIDTH MAIN CONTENT AREA (NO SIDEBAR GAP)     */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 w-full min-w-0 pb-12">

        {/* -------------------------------------------------- */}
        {/* TAB DASHBOARD OVERVIEW                             */}
        {/* -------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1920px] w-full mx-auto">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                  REAL-TIME SYSTEM STATS
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight mt-1">
                  TỔNG QUAN HỆ THỐNG
                </h1>
                <p className="text-xs font-medium text-neutral-500 mt-0.5">
                  Theo dõi hoạt động kinh doanh, đơn hàng và sản phẩm theo thời gian thực.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Đã làm mới dữ liệu hệ thống!')}
                  className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw size={14} className="text-neutral-500" />
                  <span>Cập nhật</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* 4 CARD THỐNG KÊ CHÍNH                            */}
            {/* ------------------------------------------------ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Tổng doanh thu */}
              <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">TỔNG DOANH THU</span>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {formatVND(totalRevenue)}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <TrendingUp size={13} />
                  <span>+12.5% so với tháng trước</span>
                </div>
              </div>

              {/* 2. Tổng đơn hàng */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">TỔNG ĐƠN HÀNG</span>
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {orders.length} <span className="text-xs font-bold text-neutral-400">đơn</span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-neutral-500">
                  {orderCounts.pending} chờ xử lý • {orderCounts.delivered} đã giao
                </div>
              </div>

              {/* 3. Tổng sản phẩm */}
              <div
                onClick={() => setActiveTab('products')}
                className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">TỔNG SẢN PHẨM</span>
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Package size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {products.length} <span className="text-xs font-bold text-neutral-400">mẫu giày</span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-neutral-500">
                  Thuộc {BRANDS.length} thương hiệu & {CATEGORIES.length} danh mục
                </div>
              </div>

              {/* 4. Tổng khách hàng */}
              <div
                onClick={() => setActiveTab('customers')}
                className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">TỔNG KHÁCH HÀNG</span>
                  <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Users size={20} />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {usersList.length} <span className="text-xs font-bold text-neutral-400">thành viên</span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-neutral-500">
                  Tài khoản đăng ký thực tế trên hệ thống
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI (5 CARDS)     */}
            {/* ------------------------------------------------ */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag size={16} className="text-amber-500" />
                  <span>Trạng Thái Đơn Hàng</span>
                </h3>
                <span className="text-xs text-neutral-400 font-semibold">Click card để lọc danh sách</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* 1. Đơn chờ xử lý */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Chờ xử lý');
                  }}
                  className="bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                    <Clock size={15} />
                    <span>Chờ xử lý</span>
                  </div>
                  <div className="text-2xl font-black text-amber-900">{orderCounts.pending}</div>
                  <span className="text-[10px] font-semibold text-amber-700/80 mt-1 block">Cần xác nhận</span>
                </div>

                {/* 2. Đã xác nhận */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Đã xác nhận');
                  }}
                  className="bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                    <CheckCircle2 size={15} />
                    <span>Đã xác nhận</span>
                  </div>
                  <div className="text-2xl font-black text-blue-900">{orderCounts.confirmed}</div>
                  <span className="text-[10px] font-semibold text-blue-700/80 mt-1 block">Chuẩn bị đóng gói</span>
                </div>

                {/* 3. Đang giao */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Đang giao');
                  }}
                  className="bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/80 rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-1">
                    <Truck size={15} />
                    <span>Đang giao</span>
                  </div>
                  <div className="text-2xl font-black text-purple-900">{orderCounts.shipping}</div>
                  <span className="text-[10px] font-semibold text-purple-700/80 mt-1 block">Đang vận chuyển</span>
                </div>

                {/* 4. Đã giao */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Đã giao');
                  }}
                  className="bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                    <CheckSquare size={15} />
                    <span>Đã giao</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-900">{orderCounts.delivered}</div>
                  <span className="text-[10px] font-semibold text-emerald-700/80 mt-1 block">Giao thành công</span>
                </div>

                {/* 5. Đã hủy */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Đã hủy');
                  }}
                  className="bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/80 rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02] col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                    <XCircle size={15} />
                    <span>Đã hủy</span>
                  </div>
                  <div className="text-2xl font-black text-rose-900">{orderCounts.cancelled}</div>
                  <span className="text-[10px] font-semibold text-rose-700/80 mt-1 block">Khách hủy đơn</span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* CHARTS ROW (DOANH THU & ĐƠN HÀNG)               */}
            {/* ------------------------------------------------ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 6. BIỂU ĐỒ DOANH THU (2 Cols) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 size={18} className="text-emerald-500" />
                      <span>Biểu Đồ Doanh Thu</span>
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      Tổng hợp doanh thu thực tế từ đơn hàng đã giao
                    </p>
                  </div>

                  {/* Filter Timeframe Buttons */}
                  <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/80 text-xs font-bold self-start sm:self-auto">
                    <button
                      onClick={() => setRevenueTimeframe('7days')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        revenueTimeframe === '7days' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      7 ngày
                    </button>
                    <button
                      onClick={() => setRevenueTimeframe('30days')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        revenueTimeframe === '30days' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      30 ngày
                    </button>
                    <button
                      onClick={() => setRevenueTimeframe('12months')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        revenueTimeframe === '12months' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      12 tháng
                    </button>
                  </div>
                </div>

                {/* SVG Visual Bar & Line Chart */}
                <div className="h-64 w-full pt-4 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-neutral-100 px-2">
                  {revenueChartData.map((d, i) => {
                    const heightPercent = Math.max(12, Math.round((d.revenue / maxChartValue) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full mb-2 bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-xl shadow-xl transition-opacity whitespace-nowrap z-20">
                          <p>{d.label}: {formatVND(d.revenue)}</p>
                          <p className="text-amber-400 font-semibold">{d.ordersCount} đơn hàng</p>
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-amber-500 group-hover:to-orange-400 rounded-t-xl transition-all duration-300 relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                        </div>

                        {/* Label */}
                        <span className="text-[11px] font-bold text-neutral-500 mt-2.5 truncate max-w-full">
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 font-bold mt-4 pt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                    Doanh thu thực tế (VND)
                  </span>
                  <span>Cao nhất: {formatVND(maxChartValue)}</span>
                </div>
              </div>

              {/* 7. BIỂU ĐỒ ĐƠN HÀNG (Status Breakdown) */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2 mb-1">
                    <PieChartIcon className="text-purple-500" />
                    <span>Phân Loại Đơn Hàng</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mb-5">
                    Tỷ lệ đơn hàng theo từng trạng thái xử lý
                  </p>

                  <div className="space-y-3.5">
                    {/* Progress Bar 1: Delivered */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          Đã giao thành công
                        </span>
                        <span className="text-neutral-900">{orderCounts.delivered} đơn ({orders.length > 0 ? Math.round((orderCounts.delivered / orders.length) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${orders.length > 0 ? (orderCounts.delivered / orders.length) * 100 : 0}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Progress Bar 2: Pending */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-amber-700 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          Đang chờ xử lý
                        </span>
                        <span className="text-neutral-900">{orderCounts.pending} đơn ({orders.length > 0 ? Math.round((orderCounts.pending / orders.length) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${orders.length > 0 ? (orderCounts.pending / orders.length) * 100 : 0}%` }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Progress Bar 3: Shipping */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-purple-700 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                          Đang vận chuyển
                        </span>
                        <span className="text-neutral-900">{orderCounts.shipping} đơn ({orders.length > 0 ? Math.round((orderCounts.shipping / orders.length) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${orders.length > 0 ? (orderCounts.shipping / orders.length) * 100 : 0}%` }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Progress Bar 4: Cancelled */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-rose-700 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          Đã hủy
                        </span>
                        <span className="text-neutral-900">{orderCounts.cancelled} đơn ({orders.length > 0 ? Math.round((orderCounts.cancelled / orders.length) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${orders.length > 0 ? (orderCounts.cancelled / orders.length) * 100 : 0}%` }}
                          className="h-full bg-rose-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full mt-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Xem Tất Cả Đơn Hàng</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* ROW 3: SẢN PHẨM BÁN CHẠY & ĐƠN HÀNG MỚI          */}
            {/* ------------------------------------------------ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 8. SẢN PHẨM BÁN CHẠY (TOP 5) */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>Top 5 Sản Phẩm Bán Chạy</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-amber-600 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>Quản lý kho</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {topSellingProducts.map(({ product, unitsSold, totalRevenue }, index) => (
                    <div
                      key={product.id || index}
                      className="flex items-center justify-between gap-3 p-2.5 hover:bg-neutral-50 rounded-2xl transition-colors border border-transparent hover:border-neutral-200/80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-black text-xs text-neutral-400 w-4 text-center">#{index + 1}</span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-contain bg-white p-1 shrink-0 border border-neutral-200/60"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">{product.name}</h4>
                          <span className="text-[10px] text-neutral-500 font-semibold uppercase">{product.brand} • {formatVND(product.price)}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-600 block">{unitsSold} đã bán</span>
                        <span className="text-[10px] font-bold text-neutral-400 block">{formatVND(totalRevenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. ĐƠN HÀNG MỚI (TOP 5) */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span>Đơn Hàng Mới Nhất</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-blue-600 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-3 p-3 hover:bg-neutral-50 rounded-2xl transition-colors border border-neutral-100"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-black text-neutral-900">{order.orderCode}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-neutral-600 truncate">{order.recipientName} • {order.orderDate}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black text-neutral-900">{formatVND(order.grandTotal)}</span>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-neutral-600 transition-colors cursor-pointer"
                          title="Xem chi tiết đơn"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* 10. ĐÁNH GIÁ MỚI (TOP 5 REVIEWS)                 */}
            {/* ------------------------------------------------ */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-400" />
                  <span>Đánh Giá Mới Nhất Dành Cho Sản Phẩm</span>
                </h3>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold text-amber-600 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <span>Quản lý đánh giá</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentReviews.map(rev => (
                  <div key={rev.id} className="bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-neutral-300 text-neutral-800 font-bold text-xs flex items-center justify-center overflow-hidden">
                            {rev.avatar ? (
                              <img src={rev.avatar} alt={rev.name} className="h-full w-full object-cover" />
                            ) : (
                              rev.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block truncate">{rev.name}</span>
                            <span className="text-[10px] text-neutral-400 block">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'} />
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-neutral-800 bg-white px-2 py-0.5 rounded-md border border-neutral-200 inline-block mb-2 max-w-full truncate">
                        👟 {rev.productName}
                      </span>

                      <p className="text-xs text-neutral-600 line-clamp-3 italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[10px]">
                      <span className={rev.isHidden ? 'text-rose-500 font-bold' : 'text-emerald-600 font-bold'}>
                        {rev.isHidden ? 'Đã ẩn' : 'Hiển thị công khai'}
                      </span>
                      <button
                        onClick={() => {
                          setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, isHidden: !r.isHidden } : r));
                          showToast(`Đã ${rev.isHidden ? 'hiển thị' : 'ẩn'} đánh giá của ${rev.name}`);
                        }}
                        className="text-neutral-500 hover:text-black font-bold cursor-pointer"
                      >
                        {rev.isHidden ? 'Hiện đánh giá' : 'Ẩn đánh giá'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 2: QUẢN LÝ SẢN PHẨM                            */}
        {/* -------------------------------------------------- */}
        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            setProducts={setProducts}
            categories={categoriesState}
            brands={brandsState}
            showToast={showToast}
            onRefreshProducts={onRefreshData}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 3: QUẢN LÝ DANH MỤC                            */}
        {/* -------------------------------------------------- */}
        {activeTab === 'categories' && (
          <CategoryManagement
            categories={categoriesState}
            setCategories={setCategoriesState}
            products={products}
            setProducts={setProducts}
            showToast={showToast}
            onNavigateToProducts={() => setActiveTab('products')}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 4: QUẢN LÝ THƯƠNG HIỆU                         */}
        {/* -------------------------------------------------- */}
        {activeTab === 'brands' && (
          <BrandManagement
            brands={brandsState}
            setBrands={setBrandsState}
            products={products}
            showToast={showToast}
            onNavigateToProducts={() => setActiveTab('products')}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 5: QUẢN LÝ ĐƠN HÀNG                            */}
        {/* -------------------------------------------------- */}
        {activeTab === 'orders' && (
          <OrderManagement
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            showToast={showToast}
            onNavigateToProducts={() => setActiveTab('products')}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB: QUẢN LÝ THANH TOÁN                            */}
        {/* -------------------------------------------------- */}
        {activeTab === 'payments' && (
          <PaymentManagement
            orders={orders}
            setOrders={setOrders}
            showToast={showToast}
            onNavigateToOrders={(orderQuery) => {
              setActiveTab('orders');
              if (orderQuery) {
                setSearchQuery(orderQuery);
              }
            }}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 6: QUẢN LÝ KHÁCH HÀNG                          */}
        {/* -------------------------------------------------- */}
        {activeTab === 'customers' && (
          <CustomerManagement
            usersList={usersList}
            setUsersList={setUsersList}
            orders={orders}
            reviews={reviews}
            showToast={showToast}
            onNavigateToOrders={(emailOrCode) => {
              setActiveTab('orders');
              if (emailOrCode) {
                setSearchQuery(emailOrCode);
              }
            }}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 7: QUẢN LÝ ĐÁNH GIÁ                             */}
        {/* -------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans">
            <ReviewManagement
              reviews={reviews}
              setReviews={setReviews}
              products={products}
              usersList={usersList}
              orders={orders}
            />
          </main>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 8: QUẢN LÝ KHUYẾN MÃI                          */}
        {/* -------------------------------------------------- */}
        {activeTab === 'promotions' && (
          <PromotionManagement
            promotions={promotionsState}
            setPromotions={setPromotionsState}
            products={products}
            categories={categoriesState}
            brands={brandsState}
            orders={orders}
            usersList={usersList}
            showToast={showToast}
            onNavigateToOrders={(orderQuery) => {
              setActiveTab('orders');
              if (orderQuery) setSearchQuery(orderQuery);
            }}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 9: QUẢN LÝ BANNER                              */}
        {/* -------------------------------------------------- */}
        {activeTab === 'banners' && (
          <BannerManagement
            banners={bannersState}
            setBanners={setBannersState}
            showToast={showToast}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 10: BÁO CÁO & THỐNG KÊ (REPORTS)               */}
        {/* -------------------------------------------------- */}
        {activeTab === 'reports' && (
          <ReportManagement
            orders={orders}
            products={products}
            usersList={usersList}
            categories={categoriesState}
            brands={brandsState}
            promotions={promotionsState}
            onNavigateTab={(tab) => {
              setActiveTab(tab as AdminTab);
              if (typeof window !== 'undefined') {
                const targetPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
                window.history.pushState({}, '', targetPath);
              }
            }}
            onSelectOrder={(ord) => {
              setSelectedOrder(ord);
              setIsOrderModalOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 11: SETTINGS                                   */}
        {/* -------------------------------------------------- */}
        {activeTab === 'settings' && (
          <SettingsManagement
            settings={settingsState}
            setSettings={setSettingsState}
            showToast={showToast}
          />
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL CHI TIẾT ĐƠN HÀNG & CẬP NHẬT TRẠNG THÁI        */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                <div>
                  <h3 className="text-lg font-black text-neutral-900">Chi Tiết Đơn Hàng {selectedOrder.orderCode}</h3>
                  <p className="text-xs text-neutral-400">{selectedOrder.orderDate}</p>
                </div>
                <button onClick={() => setIsOrderModalOpen(false)} className="text-neutral-400 hover:text-black p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Status Update Actions */}
              <div className="bg-neutral-50 p-4 rounded-2xl mb-6 border border-neutral-200">
                <label className="text-xs font-black text-neutral-700 uppercase tracking-wider block mb-2">
                  Cập Nhật Trạng Thái Đơn Hàng:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'] as Order['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold mb-6">
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-1">Người nhận</span>
                  <p className="text-neutral-900 font-bold">{selectedOrder.recipientName}</p>
                  <p className="text-neutral-600">{selectedOrder.phone}</p>
                </div>
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-1">Địa chỉ giao hàng</span>
                  <p className="text-neutral-900 line-clamp-2">{selectedOrder.fullAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                <span className="text-xs font-bold text-neutral-500 uppercase">Sản phẩm trong đơn:</span>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <img src={it.image} alt={it.productName} className="h-10 w-10 object-contain bg-white rounded-lg p-0.5 border" />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-neutral-900 truncate">{it.productName}</p>
                      <p className="text-[10px] text-neutral-400">Size: {it.size} • Màu: {it.colorName} • SL: {it.quantity}</p>
                    </div>
                    <span className="font-black text-xs text-neutral-900">{formatVND(it.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-100 text-sm font-black text-neutral-900">
                <div>
                  <span className="block text-xs font-bold text-neutral-500">Tổng tiền đơn hàng:</span>
                  <span className="text-lg text-emerald-600 font-black">{formatVND(selectedOrder.grandTotal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setActiveTab('orders');
                    }}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <FileText size={14} />
                    <span>Xem & In Hóa Đơn</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL THÊM SẢN PHẨM MỚI                               */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase">THÊM SẢN PHẨM MỚI</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-neutral-700 mb-1">Tên sản phẩm:</label>
                  <input
                    type="text"
                    value={newProductForm.name}
                    onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 outline-hidden"
                    placeholder="VD: Nike Air Jordan 1 High"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 mb-1">Thương hiệu:</label>
                    <select
                      value={newProductForm.brand}
                      onChange={e => setNewProductForm({ ...newProductForm, brand: e.target.value as BrandName })}
                      className="w-full bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 outline-hidden"
                    >
                      {BRANDS.map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Loại sản phẩm:</label>
                    <select
                      value={newProductForm.category}
                      onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value as CategoryName })}
                      className="w-full bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 outline-hidden"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Giá bán (VND):</label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Link Ảnh sản phẩm:</label>
                  <input
                    type="text"
                    value={newProductForm.image}
                    onChange={e => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    className="w-full bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 outline-hidden"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!newProductForm.name) {
                      alert('Vui lòng nhập tên sản phẩm!');
                      return;
                    }
                    const newProd: Product = {
                      id: 'prod-' + Date.now(),
                      name: newProductForm.name || 'Giày mới',
                      brand: newProductForm.brand || 'Nike',
                      category: newProductForm.category || 'Sneaker',
                      price: newProductForm.price || 2000000,
                      originalPrice: newProductForm.price ? newProductForm.price * 1.2 : 2400000,
                      image: newProductForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                      rating: 5.0,
                      reviewsCount: 0,
                      isNew: true,
                      sizes: [39, 40, 41, 42, 43],
                      colors: [{ name: 'Đen', hex: '#000000' }],
                      description: 'Sản phẩm mới thêm vào hệ thống kho cửa hàng SoleStyle.'
                    };

                    setProducts(prev => [newProd, ...prev]);
                    setIsProductModalOpen(false);
                    showToast(`Đã thêm sản phẩm "${newProd.name}" vào hệ thống!`);
                  }}
                  className="w-full mt-4 py-3 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Lưu Sản Phẩm Mới
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon helper for pie chart
function PieChartIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
