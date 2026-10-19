import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  Star,
  Quote,
  MapPin,
  Mail,
  Zap,
  Info,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Truck,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

import { PRODUCTS, BRANDS, CATEGORIES, REVIEWS, HERO_SLIDES, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_PROMOTIONS, INITIAL_BANNERS } from './data';
import { Product, CartItem, BrandName, CategoryName, Order, OrderItem, Review, UserProfile, CategoryItem, BrandItem, Promotion, AppliedPromoInfo, BannerItem, SystemSettings, GenderType } from './types';
import { DEFAULT_SYSTEM_SETTINGS, mergeSystemSettings } from './data/defaultSettings';
import { getBannerEffectiveStatus } from './utils/bannerUtils';
import ProductCard from './components/ProductCard';
import ProductListingPage from './components/ProductListingPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import Header from './components/Header';
import MyOrdersPage from './components/MyOrdersPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import UserProfilePage from './components/UserProfilePage';
import WishlistPage from './components/WishlistPage';
import ProductReviewModal from './components/ProductReviewModal';
import AdminDashboard from './components/AdminDashboard';
import BrandLogo from './components/BrandLogo';
import BrandsPage from './components/BrandsPage';
import BrandDetailPage from './components/BrandDetailPage';
import PromotionsPage from './components/PromotionsPage';
import ContactPage from './components/ContactPage';
import AboutContactPage from './components/AboutContactPage';
import BlogPage from './components/BlogPage';
import HomepageView from './components/HomepageView';
import AiStylistWidget from './components/AiStylistWidget';
import ErrorBoundary from './components/ErrorBoundary';
import {
  productsApi,
  categoriesApi,
  brandsApi,
  ordersApi,
  mapOrderFromBackend,
  promotionsApi,
  bannersApi,
  reviewsApi,
  usersApi,
  settingsApi,
} from './services/api';


const DEFAULT_SEED_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    name: 'Quản trị viên (Admin)',
    email: 'admin@knicks.vn',
    phone: '0901234567',
    role: 'admin',
    status: 'Đang hoạt động',
    createdAt: '01/01/2026',
    birthday: '1990-01-01',
    gender: 'nam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'usr-default',
    name: 'Nguyễn Văn A',
    email: 'example@gmail.com',
    phone: '0987654321',
    role: 'user',
    status: 'Đang hoạt động',
    createdAt: '15/01/2026',
    address: '123 Nguyễn Trãi, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    birthday: '1995-05-15',
    gender: 'nam',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'usr-002',
    name: 'Trần Thị Minh',
    email: 'minhtran@gmail.com',
    phone: '0912345678',
    role: 'user',
    status: 'Đang hoạt động',
    createdAt: '02/02/2026',
    address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    birthday: '1998-08-20',
    gender: 'nu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'usr-003',
    name: 'Lê Hoàng Long',
    email: 'hoanglong.le@gmail.com',
    phone: '0933445566',
    role: 'user',
    status: 'Đang hoạt động',
    createdAt: '18/03/2026',
    address: '12 Ngô Quyền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    birthday: '1993-11-04',
    gender: 'nam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'usr-004',
    name: 'Phạm Phương Thảo',
    email: 'phuongthao.pham@gmail.com',
    phone: '0977889900',
    role: 'user',
    status: 'Bị khóa',
    createdAt: '05/04/2026',
    address: '45 Trần Phú, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    birthday: '2000-03-12',
    gender: 'nu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80'
  },
  {
    id: 'usr-005',
    name: 'Đặng Tuấn Anh',
    email: 'tuananh.dang@gmail.com',
    phone: '0909112233',
    role: 'user',
    status: 'Đang hoạt động',
    createdAt: '22/05/2026',
    address: '88 Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng',
    birthday: '1996-09-28',
    gender: 'nam',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
  }
];

const DEFAULT_SEED_ORDERS: Order[] = [
  {
    id: 'ord-ss20260001',
    orderCode: '#SS20260001',
    recipientName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'example@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Lộc Thọ',
    addressDetail: '123 Nguyễn Trãi',
    fullAddress: '123 Nguyễn Trãi, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'prod-1',
        productName: 'Nike Air Jordan 1 Low',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        brand: 'Nike',
        size: 42,
        colorName: 'Đỏ/Trắng',
        colorHex: '#DC2626',
        quantity: 1,
        unitPrice: 2490000,
        totalPrice: 2490000
      },
      {
        productId: 'prod-2',
        productName: 'Adidas Yeezy Boost 350',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
        brand: 'Adidas',
        size: 42,
        colorName: 'Đen xám',
        colorHex: '#18181B',
        quantity: 1,
        unitPrice: 2190000,
        totalPrice: 2190000
      }
    ],
    subtotal: 4680000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    paymentStatus: 'Chưa thanh toán',
    grandTotal: 4680000,
    note: 'Giao hàng giờ hành chính.',
    orderDate: '22/07/2026 - 20:30',
    status: 'Chờ xử lý'
  },
  {
    id: 'ord-ss20260002',
    orderCode: '#SS20260002',
    recipientName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'example@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Phương Sài',
    addressDetail: '45 Yersin',
    fullAddress: '45 Yersin, Phường Phương Sài, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'prod-3',
        productName: 'Puma Velocity Nitro 2',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
        brand: 'Puma',
        size: 41,
        colorName: 'Xanh dạ quang',
        colorHex: '#84CC16',
        quantity: 1,
        unitPrice: 1890000,
        totalPrice: 1890000
      }
    ],
    subtotal: 1890000,
    discount: 189000,
    discountCode: 'KNICKS',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'FT20260722001',
    grandTotal: 1701000,
    orderDate: '21/07/2026 - 14:15',
    status: 'Đang giao'
  },
  {
    id: 'ord-ss20260003',
    orderCode: '#SS20260003',
    recipientName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'example@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Vĩnh Hải',
    addressDetail: '88 2 Tháng 4',
    fullAddress: '88 2 Tháng 4, Phường Vĩnh Hải, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'prod-4',
        productName: 'Converse Chuck Taylor 70s',
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
        brand: 'Converse',
        size: 40,
        colorName: 'Đen truyền thống',
        colorHex: '#000000',
        quantity: 1,
        unitPrice: 1650000,
        totalPrice: 1650000
      }
    ],
    subtotal: 1650000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'momo',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'MM20260718009',
    grandTotal: 1650000,
    orderDate: '18/07/2026 - 09:10',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss20260004',
    orderCode: '#SS20260004',
    recipientName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'example@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Phước Tiến',
    addressDetail: '12 Quang Trung',
    fullAddress: '12 Quang Trung, Phường Phước Tiến, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'prod-1',
        productName: 'Nike Air Jordan 1 Low',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        brand: 'Nike',
        size: 43,
        colorName: 'Đỏ/Trắng',
        colorHex: '#DC2626',
        quantity: 1,
        unitPrice: 2490000,
        totalPrice: 2490000
      }
    ],
    subtotal: 2490000,
    discount: 0,
    shippingFee: 30000,
    shippingMethod: 'express',
    paymentMethod: 'cod',
    paymentStatus: 'Chưa thanh toán',
    grandTotal: 2520000,
    orderDate: '15/07/2026 - 11:45',
    status: 'Đã hủy',
    cancelReason: 'Tôi muốn thay đổi sản phẩm.',
    cancelDate: '15/07/2026 - 12:00'
  }
];

export default function App() {
  // Navigation & Scroll states
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminViewingWebsite, setIsAdminViewingWebsite] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'order-success' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist' | 'admin' | 'brands' | 'brand-detail' | 'promotions' | 'contact' | 'blog' | 'about-contact'>(() => {
    if (typeof window !== 'undefined') {
      // Always reset active session on refresh/start so that the site permanently lands on the Login interface
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (path === '/register') return 'register';
      if (path === '/forgot-password') return 'forgot-password';
      if (path === '/reset-password') return 'reset-password';
      if (path !== '/login') {
        window.history.replaceState({}, '', '/login');
      }
    }
    return 'login';
  });
  const [selectedBrandDetail, setSelectedBrandDetail] = useState<BrandItem | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | undefined>(undefined);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'addresses' | 'orders' | 'wishlist' | 'password'>('profile');
  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('solestyle_language');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {}
    return 'vi';
  });

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path === '/blog' || path.startsWith('/blog/')) setCurrentView('blog');
        else if (path === '/about-contact' || path === '/about' || path === '/contact') setCurrentView('about-contact');
        else if (path === '/admin' || path.startsWith('/admin/')) setCurrentView('admin');
        else if (path === '/checkout') setCurrentView('checkout');
        else if (path === '/order-success') setCurrentView('order-success');
        else if (path === '/cart') setCurrentView('cart');
        else if (path === '/promotions') setCurrentView('promotions');
        else if (path === '/brands') setCurrentView('brands');
        else if (path === '/brand-detail' || path.startsWith('/brands/')) setCurrentView('brand-detail');
        else if (path === '/products') setCurrentView('products');
        else if (path === '/product-detail' || path.startsWith('/product/')) setCurrentView('product-detail');
        else if (path === '/my-orders') setCurrentView('my-orders');
        else if (path === '/profile') setCurrentView('profile');
        else if (path === '/wishlist') setCurrentView('wishlist');
        else if (path === '/login') setCurrentView('login');
        else if (path === '/register') setCurrentView('register');
        else if (path === '/forgot-password') setCurrentView('forgot-password');
        else if (path === '/reset-password') setCurrentView('reset-password');
        else setCurrentView('login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle F5 key press & browser refresh to automatically route to Login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || e.keyCode === 116 || ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))) {
        e.preventDefault();
        setUser(null);
        localStorage.removeItem('user');
        setIsAdminViewingWebsite(false);
        setCurrentView('login');
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/login');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Users List State
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SEED_USERS;
  });

  useEffect(() => {
    localStorage.setItem('solestyle_users', JSON.stringify(usersList));
  }, [usersList]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(mapOrderFromBackend);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SEED_ORDERS.map(mapOrderFromBackend);
  });

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem('solestyle_orders', JSON.stringify(orders));
  }, [orders]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: Review) => ({
            ...r,
            status: r.status === 'Chờ duyệt' ? 'Đã hiển thị' : (r.status || 'Đã hiển thị'),
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('solestyle_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Products State (dynamically synced with reviews rating & count, auto-updated with matching images and colors)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear legacy storage keys with older image mappings
      ['solestyle_products', 'solestyle_products_v2', 'solestyle_products_v3', 'solestyle_products_v4', 'solestyle_products_v5', 'solestyle_products_v6', 'solestyle_products_v7', 'solestyle_products_v8', 'solestyle_products_v9', 'solestyle_products_v10', 'solestyle_products_v11', 'solestyle_products_v12'].forEach((k) => {
        try { localStorage.removeItem(k); } catch (e) {}
      });
      const saved = localStorage.getItem('solestyle_products_v13');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep all valid products, preserving newly created ones and customizations
          return parsed.filter((item: Product) => item && item.id && item.name);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS;
  });

  // Sync products average rating and review counts whenever reviews change
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const prodRevs = reviews.filter((r) => (r.productId === prod.id || r.productName === prod.name) && !r.isHidden);
        if (prodRevs.length === 0) return prod;
        const sum = prodRevs.reduce((acc, r) => acc + r.rating, 0);
        const avg = Number((sum / prodRevs.length).toFixed(1));
        return {
          ...prod,
          rating: avg,
          reviewsCount: prodRevs.length,
        };
      })
    );
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('solestyle_products_v13', JSON.stringify(products));
  }, [products]);

  // Categories State (persistent in localStorage)
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      try { localStorage.removeItem('solestyle_categories_v1'); } catch (e) {}
      const saved = localStorage.getItem('solestyle_categories_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: CategoryItem) => c.slug !== 'dress-shoes' && c.id !== 'cat-giay-tay');
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('solestyle_categories_v2', JSON.stringify(categories));
  }, [categories]);

  // Brands State (persistent in localStorage, synchronized with Admin Brand Management)
  const [brands, setBrands] = useState<BrandItem[]>(() => {
    try {
      const saved = localStorage.getItem('solestyle_brands_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Heal old wiki URLs if present
          return parsed.map((item: BrandItem) => {
            const defaultMatch = INITIAL_BRANDS.find(
              (ib) => ib.id === item.id || ib.name.toLowerCase() === item.name.toLowerCase()
            );
            if (defaultMatch && (!item.logo || item.logo.includes('wikimedia.org') || item.logo.length < 5)) {
              return { ...item, logo: defaultMatch.logo };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BRANDS;
  });

  useEffect(() => {
    localStorage.setItem('solestyle_brands_v1', JSON.stringify(brands));
  }, [brands]);

  // Promotions State (persistent in localStorage)
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
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

  useEffect(() => {
    localStorage.setItem('solestyle_promotions_v1', JSON.stringify(promotions));
  }, [promotions]);

  // Banners State (persistent in localStorage)
  const [banners, setBanners] = useState<BannerItem[]>(() => {
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

  useEffect(() => {
    localStorage.setItem('solestyle_banners_v1', JSON.stringify(banners));
  }, [banners]);

  // System Settings State (Persistent across full app)
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('solestyle_system_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Rebranding migration: replace legacy default names with K-NICKS
          if (parsed.storeName === 'SOLESTYLE' || !parsed.storeName) {
            parsed.storeName = 'K-NICKS';
          }
          if (parsed.adminName === 'SOLESTYLE') {
            parsed.adminName = 'K-NICKS';
          }
          return mergeSystemSettings(DEFAULT_SYSTEM_SETTINGS, parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('solestyle_system_settings_v1', JSON.stringify(settings));
  }, [settings]);

  // Load and refresh latest data from Supabase PostgreSQL via Backend API
  const refreshAllData = useCallback(async () => {
    try {
      const [
        prodsRes,
        catsRes,
        brandsRes,
        ordersRes,
        promosRes,
        bannersRes,
        reviewsRes,
        usersRes,
        settingsRes,
      ] = await Promise.allSettled([
        productsApi.getAll(),
        categoriesApi.getAll(),
        brandsApi.getAll(),
        ordersApi.getAll(),
        promotionsApi.getAll(),
        bannersApi.getAll(),
        reviewsApi.getAll(),
        usersApi.getAll(),
        settingsApi.get(),
      ]);

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value) && prodsRes.value.length > 0) {
        const apiProducts = prodsRes.value.map((p) => {
          const defaultMatch = PRODUCTS.find(
            (dp) => dp.id === p.id || dp.name.trim().toLowerCase() === p.name.trim().toLowerCase()
          );
          if (defaultMatch) {
            const isAccessory = p.id.startsWith('acc-') || (defaultMatch.category && defaultMatch.category.toLowerCase().includes('phụ kiện'));
            const isPlaceholderImg = !p.image || p.image.trim() === '' || p.image.includes('unsplash');
            const finalImage = isPlaceholderImg ? defaultMatch.image : p.image;
            const finalImages = (p.images && p.images.length > 1 && !p.images[0].includes('unsplash'))
              ? p.images
              : (defaultMatch.images || [defaultMatch.image]);

            // Accessories strictly have NO colors
            const enrichedColors = isAccessory
              ? []
              : (p.colors && p.colors.length > 0)
                ? p.colors.map((c) => {
                    if (c.image && c.images && c.images.length > 0) return c;
                    const matchC = defaultMatch.colors?.find(
                      (mc) => mc.name.trim().toLowerCase() === c.name.trim().toLowerCase()
                    );
                    if (matchC) {
                      return {
                        ...c,
                        image: c.image || matchC.image,
                        images: (c.images && c.images.length > 0) ? c.images : matchC.images
                      };
                    }
                    return c;
                  })
                : (defaultMatch.colors || []);

            // Protect against 0 price or corrupted names
            const finalPrice = (p.price && p.price > 0) ? p.price : defaultMatch.price;
            const finalName = defaultMatch.name || p.name;
            const finalCategory = defaultMatch.category || p.category;

            return {
              ...p,
              name: finalName,
              category: finalCategory,
              price: finalPrice,
              image: finalImage,
              images: finalImages,
              colors: enrichedColors
            };
          }
          return p;
        });
        setProducts(apiProducts);
      }
      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        setCategories(catsRes.value);
      }
      if (brandsRes.status === 'fulfilled' && Array.isArray(brandsRes.value) && brandsRes.value.length > 0) {
        setBrands(brandsRes.value);
      }
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value) && ordersRes.value.length > 0) {
        setOrders(ordersRes.value);
      }
      if (promosRes.status === 'fulfilled' && Array.isArray(promosRes.value) && promosRes.value.length > 0) {
        setPromotions(promosRes.value);
      }
      if (bannersRes.status === 'fulfilled' && Array.isArray(bannersRes.value) && bannersRes.value.length > 0) {
        setBanners(bannersRes.value);
      }
      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value) && reviewsRes.value.length > 0) {
        const apiReviews = reviewsRes.value.map((r: Review) => ({
          ...r,
          status: r.status === 'Chờ duyệt' ? 'Đã hiển thị' : (r.status || 'Đã hiển thị'),
        }));
        setReviews(apiReviews);
      }
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value) && usersRes.value.length > 0) {
        setUsersList(usersRes.value);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        setSettings((prev) => mergeSystemSettings(prev, settingsRes.value));
      }
    } catch (e) {
      console.warn('Failed to load initial data from API:', e);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);


  // Sync document title and favicon
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (settings.seo?.metaTitle) {
        document.title = settings.seo.metaTitle;
      } else if (settings.storeName) {
        document.title = `${settings.storeName} - Giày Thể Thao Sneaker Chính Hãng`;
      }
      if (settings.favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.favicon;
      }
    }
  }, [settings]);

  // Product Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | { id: string; name: string; image: string; brand: string } | null>(null);
  const [reviewModalOrderItem, setReviewModalOrderItem] = useState<OrderItem | null>(null);
  const [reviewModalOrderId, setReviewModalOrderId] = useState<string | undefined>(undefined);
  const [reviewModalExistingReview, setReviewModalExistingReview] = useState<Review | null>(null);

  const handleOpenReviewModal = (
    product: Product | { id: string; name: string; image: string; brand: string },
    item?: OrderItem | null,
    orderId?: string,
    existingRev?: Review | null
  ) => {
    const existing = existingRev || reviews.find(
      (r) =>
        (r.productId === product.id || r.productName === product.name) &&
        (r.userId === user?.id || (user?.email && r.name === user?.name))
    );

    setReviewModalProduct(product);
    setReviewModalOrderItem(item || null);
    setReviewModalOrderId(orderId);
    setReviewModalExistingReview(existing || null);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (data: {
    productId: string;
    productName: string;
    orderId?: string;
    rating: number;
    comment: string;
    images: string[];
    video?: string;
    purchasedSize?: number;
    purchasedColor?: string;
    reviewId?: string;
  }) => {
    const todayStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (data.reviewId) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === data.reviewId
            ? {
                ...r,
                rating: data.rating,
                comment: data.comment,
                images: data.images,
                video: data.video,
                date: todayStr,
              }
            : r
        )
      );
      showNotification('✓ Đã cập nhật đánh giá sản phẩm thành công!');
    } else {
      const newRev: Review = {
        id: 'rev-' + Date.now(),
        productId: data.productId,
        productName: data.productName,
        email: user?.email || '',
        orderId: data.orderId,
        userId: user?.id,
        name: user?.name || 'Khách hàng',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        rating: data.rating,
        comment: data.comment,
        images: data.images,
        video: data.video,
        date: todayStr,
        status: 'Đã hiển thị',
        isVerifiedBuyer: true,
        purchasedSize: data.purchasedSize,
        purchasedColor: data.purchasedColor,
        helpfulCount: 0,
        helpfulUserIds: [],
      };

      setReviews((prev) => [newRev, ...prev]);
      reviewsApi.create(newRev).catch((err) => console.warn('Sync review to API failed:', err));
      showNotification('✓ Đánh giá của bạn đã được đăng thành công!');
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    reviewsApi.delete(reviewId).catch((err) => console.warn('Delete review from API failed:', err));
    showNotification('Đã xóa đánh giá sản phẩm.');
  };

  const handleToggleHelpful = (reviewId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const currentUserId = user.id || user.email;

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const helpfulUserIds = r.helpfulUserIds || [];
        const exists = helpfulUserIds.includes(currentUserId);
        const updatedUserIds = exists
          ? helpfulUserIds.filter((id) => id !== currentUserId)
          : [...helpfulUserIds, currentUserId];

        return {
          ...r,
          helpfulUserIds: updatedUserIds,
          helpfulCount: updatedUserIds.length,
        };
      })
    );
  };

  const handleToggleHideReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r))
    );
  };
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromoInfo | null>(null);

  // Favorites state (User Scoped)
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      const key = u ? `solestyle_favorites_${u.id || u.email}` : 'solestyle_favorites_guest';
      const saved = localStorage.getItem(key) || localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Global Toast Notification state
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    message: string;
    action?: { label: string; onClick: () => void };
  } | null>(null);

  const showNotification = (message: string, action?: { label: string; onClick: () => void }) => {
    const id = Date.now().toString();
    setToastNotification({ id, message, action });
  };

  // Auth / User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    return null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filtering / Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<'All' | BrandName>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CategoryName>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | GenderType>('All');

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  // Mega dropdown tracking
  const [activeBrandDropdown, setActiveBrandDropdown] = useState<BrandName | null>(null);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Scroll notification banner
  const [showPromoBannerAlert, setShowPromoBannerAlert] = useState(true);

  // Dynamic Active Banners Filtered for Display
  const activeHeroBanners = useMemo(() => {
    const list = banners.filter(
      (b) => !b.isDeleted && b.position === 'home_hero' && getBannerEffectiveStatus(b) === 'Đang hoạt động'
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    if (list.length > 0) return list;
    return INITIAL_BANNERS.filter((b) => b.position === 'home_hero');
  }, [banners]);

  const activePromoBanner = useMemo(() => {
    const list = banners.filter(
      (b) => !b.isDeleted && b.position === 'promo' && getBannerEffectiveStatus(b) === 'Đang hoạt động'
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    if (list.length > 0) return list[0];
    return INITIAL_BANNERS.find((b) => b.position === 'promo') || null;
  }, [banners]);

  // Auto scroll slider timer
  useEffect(() => {
    if (activeHeroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % activeHeroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeHeroBanners.length]);

  // Safe hero index check if banners count changes
  useEffect(() => {
    if (heroIndex >= activeHeroBanners.length) {
      setHeroIndex(0);
    }
  }, [activeHeroBanners.length, heroIndex]);

  // Sticky header collapse check
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save state helpers
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const key = user ? `solestyle_favorites_${user.id || user.email}` : 'solestyle_favorites_guest';
    localStorage.setItem(key, JSON.stringify(favorites));
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites, user]);

  useEffect(() => {
    const key = user ? `solestyle_favorites_${user.id || user.email}` : 'solestyle_favorites_guest';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Cart operations
  const handleAddToCart = (product: Product, size: number, color: { name: string; hex: string }, qty: number = 1) => {
    const cartItemId = `${product.id}-${size}-${color.name}`;
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { id: cartItemId, product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  };

  const handleUpdateQuantity = (id: string, q: number) => {
    if (q <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: q } : item)));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeItemSize = (id: string, newSize: number) => {
    setCartItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      
      const newId = `${target.product.id}-${newSize}-${target.selectedColor.name}`;
      const existing = prev.find((item) => item.id === newId && item.id !== id);
      if (existing) {
        return prev
          .filter((item) => item.id !== id)
          .map((item) => (item.id === newId ? { ...item, quantity: item.quantity + target.quantity } : item));
      } else {
        return prev.map((item) => (item.id === id ? { ...item, id: newId, selectedSize: newSize } : item));
      }
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Favorites operations
  const handleToggleFavorite = (product: Product) => {
    const isFav = favorites.some((item) => item.id === product.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((item) => item.id !== product.id));
      showNotification(`Đã xóa "${product.name}" khỏi danh sách yêu thích.`, {
        label: 'HOÀN TÁC',
        onClick: () => {
          setFavorites((prev) => {
            if (!prev.some((p) => p.id === product.id)) {
              return [...prev, product];
            }
            return prev;
          });
        }
      });
    } else {
      setFavorites((prev) => [...prev, product]);
      showNotification(`Đã thêm "${product.name}" vào danh sách yêu thích.`);
    }
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  // Auth Operations
  const handleLoginSuccess = (name: string, email: string, role?: 'user' | 'admin', phone?: string) => {
    const userRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name,
      email: email,
      phone: phone || '0987654321',
      role: userRole,
      birthday: '1995-05-15',
      gender: 'nam',
      avatar: userRole === 'admin' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' : undefined
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAdminViewingWebsite(false);

    if (newUser.role === 'admin') {
      setCurrentView('admin');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsAdminViewingWebsite(false);
    setCurrentView('login');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Operations
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], reason?: string) => {
    const formattedCancelDate = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Sync order status to Supabase PostgreSQL
    ordersApi.updateStatus(orderId, newStatus).catch((err) => {
      console.warn('API update order status failed:', err);
    });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderCode === orderId) {
          return {
            ...ord,
            status: newStatus,
            cancelReason: reason || ord.cancelReason,
            cancelDate: newStatus === 'Đã hủy' ? formattedCancelDate : ord.cancelDate
          };
        }
        return ord;
      })
    );
  };

  const handleNavigateBrand = (brand: BrandItem) => {
    setSelectedBrandDetail(brand);
    setSelectedBrand(brand.name as any);
    setSelectedCategory('All');
    setCurrentView('brand-detail');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/brands/${brand.slug || brand.name.toLowerCase()}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBrandsPage = () => {
    setCurrentView('brands');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/brands');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePromotions = () => {
    setCurrentView('promotions');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/promotions');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBlog = (slug?: string) => {
    setSelectedBlogSlug(slug);
    setCurrentView('blog');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', slug ? `/blog/${slug}` : '/blog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAboutContact = () => {
    setCurrentView('about-contact');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/about-contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateContact = () => {
    handleNavigateAboutContact();
  };

  const handleNavigateView = (
    view: 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'order-success' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist' | 'admin' | 'brands' | 'brand-detail' | 'promotions' | 'contact' | 'blog' | 'about-contact',
    orderId?: string | null,
    productOrId?: Product | string | null
  ) => {
    setCurrentView(view);
    if (orderId !== undefined) {
      setSelectedOrderId(orderId);
    }
    if (productOrId) {
      if (typeof productOrId === 'string') {
        const found = products.find((p) => p.id === productOrId);
        if (found) setSelectedProduct(found);
      } else {
        setSelectedProduct(productOrId);
      }
    }
    if (typeof window !== 'undefined') {
      const path = view === 'home' ? '/' : `/${view}`;
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Currency utility
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Search filter core logic
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Hot Search suggestion items (real-time filtering under search input)
  const searchSuggestions = searchQuery.trim() !== '' 
    ? products.filter((p) => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Filter products specifically for different shelf types
  const featuredProducts = products.filter((p) => p.isBestSeller || p.rating >= 4.8);
  const latestProducts = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.isBestSeller);

  // Main menu navigation links helper
  const navigateToSection = (id: string, filterType?: 'brand' | 'category', value?: any) => {
    if (filterType === 'brand') {
      setSelectedBrand(value);
      setSelectedCategory('All');
      setCurrentView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    } else if (filterType === 'category') {
      setSelectedCategory(value);
      setSelectedBrand('All');
      setCurrentView('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }

    if (id === 'hero-section' || id === 'app-root') {
      setCurrentView('home');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'featured-products') {
      setCurrentView('products');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Newsletter action
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      setNewsletterFeedback({
        type: 'error',
        message: 'Vui lòng nhập địa chỉ email hợp lệ.'
      });
      showNotification('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    try {
      const savedSubs = localStorage.getItem('knicks_newsletter_subscribers');
      const subscribers: string[] = savedSubs ? JSON.parse(savedSubs) : [];
      if (subscribers.includes(email.toLowerCase())) {
        setNewsletterFeedback({
          type: 'warning',
          message: 'Email này đã được đăng ký nhận bản tin trước đó.'
        });
        showNotification('Email này đã được đăng ký nhận bản tin trước đó.');
        return;
      }

      subscribers.push(email.toLowerCase());
      localStorage.setItem('knicks_newsletter_subscribers', JSON.stringify(subscribers));
      setNewsletterSubscribed(true);
      setNewsletterFeedback({
        type: 'success',
        message: 'Đăng ký nhận thông tin thành công. Chúng tôi đã gửi mã giảm giá KNICKS10 tới email của bạn!'
      });
      setNewsletterEmail('');
      showNotification('Đăng ký nhận ưu đãi thành công! Mã giảm giá: KNICKS10');
      
      setTimeout(() => {
        setNewsletterFeedback(null);
        setNewsletterSubscribed(false);
      }, 6000);
    } catch (err) {
      console.error(err);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const handleSwitchToAdminUser = () => {
    const adminUser = usersList.find((u) => u.role === 'admin') || DEFAULT_SEED_USERS[0];
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    setIsAdminViewingWebsite(false);
    setCurrentView('admin');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
    showNotification('Đã đăng nhập với tài khoản Quản trị viên (Admin)!');
  };

  if (currentView === 'admin') {
    // 8. Nếu User thường hoặc chưa đăng nhập cố truy cập /admin -> trả về 403
    if (!user || user.role !== 'admin') {
      return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/30 shadow-lg">
              <ShieldAlert size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-white">403 - Bạn không có quyền truy cập</h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
              Trang quản trị chỉ dành cho tài khoản Quản trị viên (Admin). Vui lòng đăng nhập bằng tài khoản có quyền Admin để tiếp tục.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('login');
                  if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
              >
                Đăng nhập Admin
              </button>
              <button
                onClick={() => {
                  setCurrentView('home');
                  if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
                }}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold text-xs hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Về trang chủ
              </button>
            </div>
          </div>
      );
    }

    return (
      <ErrorBoundary
        fallbackTitle="Không thể tải Trang Quản Trị"
        fallbackDescription="Đã có sự cố hiển thị trong giao diện Quản trị viên. Bạn có thể bấm Tải lại trang hoặc quay lại Trang chủ."
      >
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onNavigateClient={() => {}}
          orders={orders}
          setOrders={setOrders}
          products={products}
          setProducts={setProducts}
          categories={categories}
          setCategories={setCategories}
          brands={brands}
          setBrands={setBrands}
          reviews={reviews}
          setReviews={setReviews}
          usersList={usersList}
          setUsersList={setUsersList}
          promotions={promotions}
          setPromotions={setPromotions}
          banners={banners}
          setBanners={setBanners}
          settings={settings}
          setSettings={setSettings}
          onRefreshData={refreshAllData}
          onSwitchToAdminUser={handleSwitchToAdminUser}
        />
      </ErrorBoundary>
    );
  }

  const isAuthView = currentView === 'login' || currentView === 'register' || currentView === 'forgot-password' || currentView === 'reset-password';

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden">
      {/* HEADER COMPONENT */}
      {!isAuthView && (
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          brands={brands}
          categories={categories}
          onNavigateBrand={handleNavigateBrand}
          onNavigateBrandsPage={handleNavigateBrandsPage}
          onNavigatePromotions={handleNavigatePromotions}
          onNavigateBlog={handleNavigateBlog}
          onNavigateAboutContact={handleNavigateAboutContact}
          onNavigateContact={handleNavigateAboutContact}
          favorites={favorites}
          isFavoritesOpen={isFavoritesOpen}
          setIsFavoritesOpen={setIsFavoritesOpen}
          cartItems={cartItems}
          setIsCartOpen={setIsCartOpen}
          user={user}
          setUser={setUser}
          setIsAuthOpen={setIsAuthOpen}
          onQuickViewProduct={(prod) => {
            setSelectedProduct(prod);
            handleNavigateView('product-detail', undefined, prod);
          }}
          onToggleFavorite={handleToggleFavorite}
          showPromoBannerAlert={showPromoBannerAlert}
          setShowPromoBannerAlert={setShowPromoBannerAlert}
          isScrolled={isScrolled}
          onOpenProfileTab={(tab) => setProfileInitialTab(tab)}
          settings={settings}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {currentView === 'home' && (
        <HomepageView
          products={products}
          brands={brands}
          banners={banners}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onQuickViewProduct={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl, qty) => {
            handleAddToCart(p, sz, cl, qty || 1);
            setIsCartOpen(true);
          }}
          onNavigateBrand={handleNavigateBrand}
          onNavigateBrandsPage={handleNavigateBrandsPage}
          onNavigatePromotions={handleNavigatePromotions}
          onNavigateProducts={(filter) => {
            if (filter?.brand) setSelectedBrand(filter.brand as BrandName);
            else setSelectedBrand('All');
            if (filter?.category) setSelectedCategory(filter.category as CategoryName);
            else setSelectedCategory('All');
            if (filter?.gender) setSelectedGender(filter.gender as GenderType);
            else setSelectedGender('All');
            setCurrentView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateBlog={handleNavigateBlog}
          newsletterEmail={newsletterEmail}
          setNewsletterEmail={setNewsletterEmail}
          newsletterSubscribed={newsletterSubscribed}
          handleNewsletterSubmit={handleNewsletterSubmit}
          newsletterFeedback={newsletterFeedback}
        />
      )}

      {currentView === 'brands' && (
        <BrandsPage
          brands={brands}
          products={products}
          onSelectBrand={handleNavigateBrand}
          onBackToHome={() => handleNavigateView('home')}
        />
      )}

      {currentView === 'blog' && (
        <BlogPage
          initialPostSlug={selectedBlogSlug}
          onNavigateHome={() => handleNavigateView('home')}
          onNavigateProducts={(cat, brand) => {
            if (brand) setSelectedBrand(brand as BrandName);
            else setSelectedBrand('All');
            if (cat) setSelectedCategory(cat as CategoryName);
            else setSelectedCategory('All');
            setCurrentView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateProductDetail={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          products={products}
          categories={categories}
          brands={brands}
        />
      )}

      {(currentView === 'about-contact' || currentView === 'contact') && (
        <AboutContactPage
          settings={settings}
          user={user}
          onBackToHome={() => handleNavigateView('home')}
          onNavigateProducts={() => handleNavigateView('products')}
          onNavigateBlog={handleNavigateBlog}
          showNotification={showNotification}
        />
      )}

      {currentView === 'promotions' && (
        <PromotionsPage
          products={products}
          brands={brands}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onQuickView={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl) => {
            handleAddToCart(p, sz, cl, 1);
            setIsCartOpen(true);
          }}
          onNavigateHome={() => handleNavigateView('home')}
          onBackToHome={() => handleNavigateView('home')}
          onNavigateProducts={() => handleNavigateView('products')}
          onNavigateBrand={handleNavigateBrand}
          onNavigateProductDetail={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
        />
      )}

      {currentView === 'brand-detail' && (
        <BrandDetailPage
          brand={
            selectedBrandDetail ||
            brands.find(
              (b) =>
                b.name.toLowerCase() === selectedBrand.toLowerCase() ||
                b.slug === selectedBrand.toLowerCase()
            ) ||
            brands[0]
          }
          products={products}
          categories={categories}
          onQuickView={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl) => {
            handleAddToCart(p, sz, cl, 1);
            setIsCartOpen(true);
          }}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onBackToBrands={handleNavigateBrandsPage}
          onBackToHome={() => handleNavigateView('home')}
        />
      )}

      {currentView === 'products' && (
        <ProductListingPage
          products={products}
          categories={categories}
          brands={brands}
          initialBrand={selectedBrand}
          initialCategory={selectedCategory}
          initialGender={selectedGender}
          initialSearchQuery={searchQuery}
          onQuickView={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl) => {
            handleAddToCart(p, sz, cl, 1);
            setIsCartOpen(true);
          }}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onBackToHome={() => {
            handleNavigateView('home');
          }}
        />
      )}

      {currentView === 'product-detail' && (() => {
        const activeDetailProduct = (selectedProduct && products.some((p) => p.id === selectedProduct.id))
          ? selectedProduct
          : products[0];

        return (
          <ProductDetailPage
            product={activeDetailProduct}
            onAddToCart={(p, sz, cl, qty) => {
              handleAddToCart(p, sz, cl, qty);
              setIsCartOpen(true);
            }}
            onBuyNow={(p, sz, cl, qty) => {
              handleAddToCart(p, sz, cl, qty);
              handleNavigateView('checkout');
            }}
            isFavorite={activeDetailProduct ? favorites.some((item) => item.id === activeDetailProduct.id) : false}
            onToggleFavorite={handleToggleFavorite}
            reviews={reviews}
            user={user}
            orders={orders}
            onOpenReviewModal={(existingRev) => {
              handleOpenReviewModal(activeDetailProduct, null, undefined, existingRev);
            }}
          onDeleteReview={handleDeleteReview}
          onToggleHelpful={handleToggleHelpful}
          onToggleHideReview={handleToggleHideReview}
          onNavigate={(view, orderId) => handleNavigateView(view, orderId)}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
            allProducts={products}
            onOpenAuthModal={() => setIsAuthOpen(true)}
          />
        );
      })()}

      {currentView === 'cart' && (
        <CartPage
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onChangeItemSize={handleChangeItemSize}
          onClearCart={handleClearCart}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onQuickViewProduct={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl, qty) => {
            handleAddToCart(p, sz, cl, qty);
          }}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          appliedPromo={appliedPromo}
          onApplyPromo={setAppliedPromo}
          promotions={promotions}
          user={user}
          orders={orders}
          settings={settings}
        />
      )}

      {(currentView === 'checkout' || currentView === 'order-success') && (
        <CheckoutPage
          cartItems={cartItems}
          products={products}
          setProducts={setProducts}
          onClearCart={() => {
            handleClearCart();
            setAppliedPromo(null);
          }}
          onNavigate={(view) => {
            handleNavigateView(view);
          }}
          appliedPromoFromCart={appliedPromo}
          promotions={promotions}
          user={user}
          orders={orders}
          settings={settings}
          onCompleteOrderSuccess={(newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
            // Sync order directly to Supabase PostgreSQL
            ordersApi.create(newOrder).catch((err) => {
              console.warn('API create order failed:', err);
            });
            if (newOrder.discountCode || newOrder.promotionId) {
              setPromotions((prevPromos) =>
                prevPromos.map((p) => {
                  if (
                    (newOrder.promotionId && p.id === newOrder.promotionId) ||
                    (newOrder.discountCode && p.code.toUpperCase() === newOrder.discountCode.toUpperCase())
                  ) {
                    return {
                      ...p,
                      usedCount: (p.usedCount || 0) + 1,
                      updatedAt: new Date().toISOString()
                    };
                  }
                  return p;
                })
              );
            }
            handleClearCart();
            setAppliedPromo(null);
            handleNavigateView('order-success');
          }}
          isOrderSuccessView={currentView === 'order-success'}
        />
      )}

      {currentView === 'my-orders' && (
        <MyOrdersPage
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddToCart={(p, sz, cl, qty) => {
            handleAddToCart(p, sz, cl, qty);
            setIsCartOpen(true);
          }}
          onNavigate={(view, orderId) => {
            handleNavigateView(view, orderId);
          }}
          selectedOrderId={selectedOrderId}
          user={user}
          onOpenAuthModal={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          products={products}
          reviews={reviews}
          onOpenReviewModal={handleOpenReviewModal}
          favoritesCount={favorites.length}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onNavigate={handleNavigateView}
          onLoginSuccess={handleLoginSuccess}
          settings={settings}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onNavigate={handleNavigateView}
          onRegisterSuccess={handleLoginSuccess}
          settings={settings}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordPage
          onNavigate={handleNavigateView}
        />
      )}

      {currentView === 'reset-password' && (
        <ResetPasswordPage
          onNavigate={handleNavigateView}
        />
      )}

      {currentView === 'wishlist' && (
        <WishlistPage
          favorites={favorites}
          onRemoveFavorite={handleToggleFavorite}
          onClearAllFavorites={handleClearAllFavorites}
          onQuickViewProduct={(p) => {
            setSelectedProduct(p);
            handleNavigateView('product-detail', undefined, p);
          }}
          onAddToCart={(p, sz, cl, qty) => {
            handleAddToCart(p, sz, cl, qty);
          }}
          onNavigate={(view) => {
            handleNavigateView(view);
          }}
          showNotification={showNotification}
        />
      )}

      {currentView === 'profile' && (
        <UserProfilePage
          user={user}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onNavigate={handleNavigateView}
          orders={orders}
          favorites={favorites}
          onRemoveFavorite={handleToggleFavorite}
          onAddToCart={(p, sz, cl, qty) => {
            handleAddToCart(p, sz, cl, qty);
            setIsCartOpen(true);
          }}
          initialTab={profileInitialTab}
        />
      )}

      {/* CORE FOOTER COMPONENT - Rendered for all customer pages */}
      {!['admin', 'checkout', 'login', 'register', 'forgot-password', 'reset-password'].includes(currentView) && (
        <Footer
          settings={settings}
          brands={brands}
          onNavigateBrand={handleNavigateBrand}
          onNavigateBrandsPage={handleNavigateBrandsPage}
          onNavigatePromotions={handleNavigatePromotions}
          onNavigateBlog={handleNavigateBlog}
          onNavigateAboutContact={handleNavigateAboutContact}
          onNavigateContact={handleNavigateAboutContact}
          onNavigate={(view, targetId) => {
            if (view === 'blog') {
              handleNavigateBlog();
            } else if (view === 'about-contact' || view === 'contact') {
              handleNavigateAboutContact();
            } else if (view === 'promotions') {
              handleNavigatePromotions();
            } else if (view === 'brands') {
              handleNavigateBrandsPage();
            } else if (view === 'home' && !targetId) {
              setCurrentView('home');
              setSelectedBrand('All');
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (targetId) {
              if (currentView !== 'home') {
                setCurrentView('home');
                setTimeout(() => {
                  const el = document.getElementById(targetId);
                  if (el) {
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }, 120);
              } else {
                const el = document.getElementById(targetId);
                if (el) {
                  const headerOffset = 80;
                  const elementPosition = el.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }
            } else {
              setCurrentView(view as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      )}

      {/* CORE DIALOG / MODAL / DRAWER PORTALS */}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={(p, sz, cl, qty) => {
          handleAddToCart(p, sz, cl, qty);
          setIsCartOpen(true);
        }}
        isFavorite={selectedProduct ? favorites.some((item) => item.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onViewFullDetail={(p) => {
          setIsQuickViewOpen(false);
          setSelectedProduct(p);
          handleNavigateView('product-detail', undefined, p);
        }}
        reviews={reviews}
        user={user}
        orders={orders}
        onOpenReviewModal={(existing) => {
          if (selectedProduct) {
            handleOpenReviewModal(selectedProduct, null, undefined, existing);
          }
        }}
        onDeleteReview={handleDeleteReview}
        onToggleHelpful={handleToggleHelpful}
        onToggleHideReview={handleToggleHideReview}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onNavigate={(view) => handleNavigateView(view)}
        promotions={promotions}
        user={user}
        orders={orders}
        appliedPromo={appliedPromo}
        onApplyPromo={setAppliedPromo}
        settings={settings}
      />

      {/* Authenticate Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Product Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewModalProduct(null);
          setReviewModalOrderItem(null);
          setReviewModalExistingReview(null);
        }}
        product={reviewModalProduct}
        orderItem={reviewModalOrderItem}
        orderId={reviewModalOrderId}
        existingReview={reviewModalExistingReview}
        onSubmitReview={handleSaveReview}
      />

      {/* N-KICKS AI Stylist Floating Assistant (Chỉ hiển thị ở trang mua sắm khách hàng, không hiện ở trang admin và giao diện đăng nhập/xác thực) */}
      {(currentView as string) !== 'admin' && !isAuthView && !isAuthOpen && (
        <AiStylistWidget
          products={products}
          onQuickView={(p) => {
            setSelectedProduct(p);
            setIsQuickViewOpen(true);
          }}
          onNavigate={handleNavigateView}
        />
      )}

    </div>
  );
}
