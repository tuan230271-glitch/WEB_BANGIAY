import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  Filter,
  ArrowRight,
  X,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Share2,
  Ruler,
  Clock,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react';
import { Product, ProductColor, Review, Order, UserProfile, BrandName, CategoryName } from '../types';
import { PRODUCTS } from '../data';
import ProductCard from './ProductCard';
import ProductImageGallery from './ProductImageGallery';

interface ProductDetailPageProps {
  product: Product | null;
  onAddToCart: (product: Product, size: number, color: ProductColor, qty: number) => void;
  onBuyNow: (product: Product, size: number, color: ProductColor, qty: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  reviews: Review[];
  user: UserProfile | null;
  orders: Order[];
  onOpenReviewModal: (existingReview?: Review | null) => void;
  onDeleteReview: (reviewId: string) => void;
  onToggleHelpful: (reviewId: string) => void;
  onToggleHideReview?: (reviewId: string) => void;
  onNavigate: (view: any, orderId?: string | null) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  onOpenAuthModal: () => void;
}

// Helper to determine if a product is in stock
const isProductInStock = (product: Product | null): boolean => {
  if (!product) return false;
  if (product.id === 'nike-phantom-gx' || product.id === 'puma-velocity-nitro') {
    return false;
  }
  if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
    return false;
  }
  return true;
};

export default function ProductDetailPage({
  product,
  onAddToCart,
  onBuyNow,
  isFavorite,
  onToggleFavorite,
  reviews = [],
  user = null,
  orders = [],
  onOpenReviewModal,
  onDeleteReview,
  onToggleHelpful,
  onToggleHideReview,
  onNavigate,
  onSelectProduct,
  allProducts = [],
  onOpenAuthModal,
}: ProductDetailPageProps) {
  // Size & Color & Quantity State
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [isCopiedShare, setIsCopiedShare] = useState<boolean>(false);

  const isStock = isProductInStock(product);

  // Review Filters & Sorting
  const [starFilter, setStarFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [reviewPage, setReviewPage] = useState<number>(1);
  const reviewsPerPage = 10;

  // Modals inside reviews: Lightbox & Delete confirmation
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Ref to review section for smooth scrolling
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  // Initialize product options on load
  const hasSizes = !!(product?.sizes && product.sizes.length > 0);

  // Master catalog product lookup (ensures up-to-date color images even if product in state was restored from old localStorage)
  const masterProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === product?.id || p.name === product?.name);
  }, [product]);

  const normalizeColorKey = (name: string) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Combine product.colors with master catalog colors so color.image / color.images are always guaranteed
  const isAccessory = useMemo(() => {
    return (
      product?.id?.startsWith('acc-') ||
      (product?.category && (
        product.category.toLowerCase().includes('phụ kiện') ||
        product.category.toLowerCase().includes('accessory')
      ))
    );
  }, [product]);

  // Combine product.colors with master catalog colors
  // For accessories: strictly NO colors
  const effectiveColors: ProductColor[] = useMemo(() => {
    if (isAccessory) return [];

    // If master product has rich color variants with images, prioritize masterProduct.colors
    if (masterProduct?.colors && masterProduct.colors.length > 0 && masterProduct.colors.some(c => c.image || (c.images && c.images.length > 0))) {
      return masterProduct.colors;
    }

    const rawColors = (product?.colors && product.colors.length > 0)
      ? product.colors
      : (masterProduct?.colors || []);

    return rawColors.map((c) => {
      if (c.image || (c.images && c.images.length > 0)) {
        return c;
      }
      const cKey = normalizeColorKey(c.name);
      const matchInMaster = masterProduct?.colors?.find(
        (mc) => normalizeColorKey(mc.name) === cKey
      );
      if (matchInMaster && (matchInMaster.image || matchInMaster.images)) {
        return {
          ...c,
          image: matchInMaster.image,
          images: matchInMaster.images,
        };
      }
      return c;
    });
  }, [product, masterProduct, isAccessory]);

  useEffect(() => {
    if (product) {
      const prodHasSizes = !!(product.sizes && product.sizes.length > 0);
      setSelectedSize(prodHasSizes ? product.sizes[0] : 0);
      const defaultColor = !isAccessory ? (effectiveColors[0] || product.colors?.[0] || null) : null;
      setSelectedColor(defaultColor);
      setQuantity(1);
      setStarFilter('all');
      setReviewPage(1);
      setAddedNotification(null);
    }
  }, [product, effectiveColors, isAccessory]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F8F8F8]">
        <AlertCircle size={48} className="text-neutral-400 mb-4" />
        <h2 className="text-2xl font-black text-neutral-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-neutral-500 max-w-md mb-6">
          Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc tạm thời ngừng kinh doanh.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  // Active selected color with full image metadata
  const activeColor = useMemo(() => {
    if (!selectedColor) return effectiveColors[0] || null;
    const sKey = normalizeColorKey(selectedColor.name);
    const match = effectiveColors.find(
      (c) => normalizeColorKey(c.name) === sKey
    );
    return match || selectedColor;
  }, [selectedColor, effectiveColors]);

  // Currency Formatter
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Product Image List: strictly 4 matching thumbnails for all products (shoes & accessories)
  const productImages = useMemo(() => {
    // 1. If active color has a dedicated set of images
    if (activeColor?.images && Array.isArray(activeColor.images) && activeColor.images.length > 0) {
      const colorImages = activeColor.images.filter((img) => img && typeof img === 'string' && img.trim() && !img.includes('unsplash'));
      if (colorImages.length > 0) return colorImages.slice(0, 4);
    }

    // 2. If masterProduct has curated images
    if (masterProduct?.images && Array.isArray(masterProduct.images) && masterProduct.images.length > 0) {
      const masterImgs = masterProduct.images.filter((img) => img && typeof img === 'string' && img.trim() && !img.includes('unsplash'));
      if (masterImgs.length > 0) {
        if (activeColor?.image && !masterImgs.includes(activeColor.image.trim()) && !activeColor.image.includes('unsplash')) {
          return [activeColor.image.trim(), ...masterImgs].slice(0, 4);
        }
        return masterImgs.slice(0, 4);
      }
    }

    // 3. Fallback for custom products not in master catalog
    const list: string[] = [];
    if (activeColor?.image && !activeColor.image.includes('unsplash')) {
      list.push(activeColor.image.trim());
    } else if (product.image && !product.image.includes('unsplash')) {
      list.push(product.image.trim());
    }

    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && typeof img === 'string' && !img.includes('unsplash') && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }

    const finalList = list.length > 0 ? list : ['/src/assets/images/shoes/nike-air-max-pulse.jpg'];
    return finalList.slice(0, 4);
  }, [product, activeColor, masterProduct]);

  const currentMainImage = activeColor?.image || productImages[0] || masterProduct?.image || product.image;

  // Scroll to Review section
  const scrollToReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // -------------------------------------------------------------
  // REVIEWS LOGIC & REAL-TIME STATS CALCULATION
  // -------------------------------------------------------------

  // Filter approved/displayed reviews for this product
  const displayedReviews = useMemo(() => {
    return reviews.filter((r) => {
      const isProductMatch = r.productId === product.id || r.productName === product.name;
      const isAuthor = Boolean(user && (r.userId === user.id || (user.email && (r.email === user.email || r.name === user.name))));
      const isApproved = !r.isDeleted && !r.isHidden && (
        r.status === 'Đã hiển thị' ||
        r.status === 'Chờ duyệt' ||
        !r.status ||
        isAuthor
      );
      return isProductMatch && isApproved;
    });
  }, [reviews, product, user]);

  // Calculate dynamic rating stats
  const ratingStats = useMemo(() => {
    const total = displayedReviews.length;
    if (total === 0) {
      return {
        avgRating: product.rating || 5.0,
        totalCount: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        withImagesCount: 0,
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let withImagesCount = 0;

    displayedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star as 1 | 2 | 3 | 4 | 5] = (counts[star as 1 | 2 | 3 | 4 | 5] || 0) + 1;
      sum += r.rating;
      if (r.images && r.images.length > 0) withImagesCount++;
    });

    const avg = Number((sum / total).toFixed(1));

    return {
      avgRating: avg,
      totalCount: total,
      counts,
      percentages: {
        5: Math.round((counts[5] / total) * 100),
        4: Math.round((counts[4] / total) * 100),
        3: Math.round((counts[3] / total) * 100),
        2: Math.round((counts[2] / total) * 100),
        1: Math.round((counts[1] / total) * 100),
      },
      withImagesCount,
    };
  }, [displayedReviews, product]);

  // Eligibility check for writing/editing review
  const { isEligible, existingUserReview, eligibilityReason } = useMemo(() => {
    if (!user) {
      return {
        isEligible: false,
        existingUserReview: null,
        eligibilityReason: 'Chưa đăng nhập',
      };
    }

    // Check if user has an order with status "Đã giao" / "Đã giao hàng" containing this product
    const hasDeliveredOrder = orders.some((order) => {
      const isDelivered = order.status === 'Đã giao' || order.status === 'Đã giao hàng';
      if (!isDelivered) return false;
      return order.items.some(
        (item) => item.productId === product.id || item.productName === product.name
      );
    });

    // Check if user already submitted a review
    const existing = reviews.find(
      (r) =>
        (r.productId === product.id || r.productName === product.name) &&
        (r.userId === user.id || (user.email && r.name === user.name)) &&
        !r.isDeleted
    );

    if (existing) {
      return {
        isEligible: true,
        existingUserReview: existing,
        eligibilityReason: null,
      };
    }

    if (!hasDeliveredOrder) {
      return {
        isEligible: false,
        existingUserReview: null,
        eligibilityReason: 'Cần mua & nhận sản phẩm',
      };
    }

    return {
      isEligible: true,
      existingUserReview: null,
      eligibilityReason: null,
    };
  }, [user, orders, product, reviews]);

  // Filter & Sort reviews
  const processedReviews = useMemo(() => {
    let list = displayedReviews.filter((r) => {
      if (starFilter === 'all') return true;
      if (starFilter === 'with-images') return r.images && r.images.length > 0;
      return Math.round(r.rating) === parseInt(starFilter, 10);
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
      if (sortBy === 'oldest') return (a.id > b.id ? 1 : -1);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

    return list;
  }, [displayedReviews, starFilter, sortBy]);

  // Paginated reviews
  const totalReviewPages = Math.ceil(processedReviews.length / reviewsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (reviewPage - 1) * reviewsPerPage;
    return processedReviews.slice(start, start + reviewsPerPage);
  }, [processedReviews, reviewPage]);

  // Add to cart handler
  const handleAddToCartClick = () => {
    if (!isStock) return;
    const sizeToUse = hasSizes ? selectedSize : 0;
    if (hasSizes && !selectedSize) return;
    const colorToUse = selectedColor || product.colors?.[0] || { name: 'Mặc định', hex: '#111111' };
    onAddToCart(product, sizeToUse || 0, colorToUse, quantity);
    const itemUnit = hasSizes ? 'đôi' : 'sản phẩm';
    setAddedNotification(`Đã thêm ${quantity} ${itemUnit} ${product.name} vào giỏ hàng!`);
    setTimeout(() => setAddedNotification(null), 3500);
  };

  // Buy now handler
  const handleBuyNowClick = () => {
    if (!isStock) return;
    const sizeToUse = hasSizes ? selectedSize : 0;
    if (hasSizes && !selectedSize) return;
    const colorToUse = selectedColor || product.colors?.[0] || { name: 'Mặc định', hex: '#111111' };
    onBuyNow(product, sizeToUse || 0, colorToUse, quantity);
  };

  // Share link copy
  const handleShareClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  // Related products
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
      .slice(0, 4);
  }, [allProducts, product]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-neutral-900 pb-20">
      
      {/* 1. BREADCRUMBS NAVIGATION */}
      <div className="bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <ChevronRight size={13} className="text-neutral-400 shrink-0" />
            <button
              onClick={() => onNavigate('products')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Sản phẩm
            </button>
            {product.brand && product.brand.trim() !== '' && (
              <>
                <ChevronRight size={13} className="text-neutral-400 shrink-0" />
                <span className="text-neutral-500">{product.brand}</span>
              </>
            )}
            <ChevronRight size={13} className="text-neutral-400 shrink-0" />
            <span className="font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Quay lại cửa hàng</span>
          </button>
        </div>
      </div>

      {/* 2. PRODUCT HERO SECTION (2 COLUMNS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: IMAGE GALLERY (6 COLUMNS ON DESKTOP) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Reusable Product Image Gallery Component */}
            <ProductImageGallery
              images={productImages}
              mainImage={currentMainImage}
              selectedColor={activeColor}
              productName={product.name}
              badges={
                <>
                  {!isStock && (
                    <span className="rounded-full bg-neutral-950 text-white px-3.5 py-1 text-xs font-black tracking-wider uppercase shadow-xs">
                      HẾT HÀNG
                    </span>
                  )}
                  {product.isHot && (
                    <span className="rounded-full bg-amber-400 px-3.5 py-1 text-xs font-black tracking-wider text-black uppercase shadow-xs">
                      HOT
                    </span>
                  )}
                  {product.isPromotion && (
                    <span className="rounded-full bg-[#BA0C2F] px-3.5 py-1 text-xs font-black tracking-wider text-white uppercase shadow-xs">
                      KM
                    </span>
                  )}
                  {!product.isPromotion && hasDiscount && (
                    <span className="rounded-full bg-[#BA0C2F] px-3.5 py-1 text-xs font-black tracking-wider text-white uppercase shadow-xs">
                      GIẢM {discountPercentage}%
                    </span>
                  )}
                  {product.isNew && !product.isHot && !product.isPromotion && (
                    <span className="rounded-full bg-black px-3.5 py-1 text-xs font-black tracking-wider text-white uppercase shadow-xs">
                      MỚI RA MẮT
                    </span>
                  )}
                </>
              }
              floatingActions={
                <>
                  <button
                    onClick={() => onToggleFavorite(product)}
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center border shadow-xs transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                        : 'bg-white/90 backdrop-blur-xs border-neutral-200 text-neutral-600 hover:text-black hover:bg-white'
                    }`}
                    title="Yêu thích"
                  >
                    <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="h-11 w-11 rounded-2xl flex items-center justify-center border border-neutral-200 bg-white/90 backdrop-blur-xs text-neutral-600 hover:text-black hover:bg-white shadow-xs transition-all cursor-pointer"
                    title="Chia sẻ sản phẩm"
                  >
                    {isCopiedShare ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
                  </button>
                </>
              }
              notification={
                <AnimatePresence>
                  {addedNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute bottom-5 inset-x-5 z-20 p-3 bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-2xl"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                        <span>{addedNotification}</span>
                      </div>
                      <button
                        onClick={() => onNavigate('cart')}
                        className="text-amber-400 hover:underline text-[11px] uppercase tracking-wider shrink-0 cursor-pointer"
                      >
                        Xem giỏ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              }
            />

            {/* Guarantees Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 text-center flex flex-col items-center">
                <ShieldCheck size={20} className="text-emerald-600 mb-1" />
                <span className="text-[11px] font-black text-neutral-900 uppercase">100% CHÍNH HÃNG</span>
                <span className="text-[10px] text-neutral-400">Cam kết chuẩn Auth</span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 text-center flex flex-col items-center">
                <RotateCcw size={20} className="text-blue-600 mb-1" />
                <span className="text-[11px] font-black text-neutral-900 uppercase">ĐỔI TRẢ 30 NGÀY</span>
                <span className="text-[10px] text-neutral-400">Đổi size miễn phí</span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 text-center flex flex-col items-center">
                <Truck size={20} className="text-amber-600 mb-1" />
                <span className="text-[11px] font-black text-neutral-900 uppercase">HỎA TỐC 2H</span>
                <span className="text-[10px] text-neutral-400">Nội thành hỏa tốc</span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 text-center flex flex-col items-center">
                <CreditCard size={20} className="text-purple-600 mb-1" />
                <span className="text-[11px] font-black text-neutral-900 uppercase">KIỂM TRA HÀNG</span>
                <span className="text-[10px] text-neutral-400">Thanh toán khi nhận</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS & PURCHASE CONTROLS (7 COLUMNS ON DESKTOP) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Brand & Category */}
            <div>
              <div className="flex items-center gap-2">
                {product.brand && product.brand.trim() !== '' && (
                  <span className="px-3 py-1 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 uppercase tracking-tight mt-3">
                {product.name}
              </h1>

              {/* RATING BADGE & REVIEW LINK (Click scrolls down to review section) */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="flex items-center gap-1.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={
                          s <= Math.round(ratingStats.avgRating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-neutral-200 fill-neutral-200'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black text-neutral-900">{ratingStats.avgRating}</span>
                  <span className="text-xs font-semibold text-neutral-500 group-hover:text-black group-hover:underline">
                    ({ratingStats.totalCount} đánh giá)
                  </span>
                </button>

                <div className="h-3.5 w-px bg-neutral-300" />

                {isStock ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check size={14} className="stroke-[3]" /> Còn hàng trong kho
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle size={14} /> Sản phẩm tạm thời hết hàng
                  </span>
                )}
              </div>
            </div>

            {/* Price Container */}
            <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 flex items-baseline gap-4 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-neutral-900">
                {formatPrice(product.price)}
              </div>
              {hasDiscount && (
                <>
                  <div className="text-sm sm:text-base font-semibold text-neutral-400 line-through">
                    {formatPrice(product.originalPrice!)}
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase">
                    Tiết kiệm {formatPrice(product.originalPrice! - product.price)}
                  </div>
                </>
              )}
            </div>

            {/* Short Highlight / Sneak Peek */}
            {product.description && (
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {product.shortDescription || product.description}
              </p>
            )}

            {/* SIZE SELECTION - Only shown if product has sizes */}
            {hasSizes && (
              <div className="space-y-2.5 pt-2 border-t border-neutral-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                    CHỌN KÍCH CỠ (SIZE EU): <span className="text-neutral-500 font-bold">{selectedSize || 'Chưa chọn'}</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs font-bold text-neutral-600 hover:text-black underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Bảng quy đổi size</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 rounded-2xl border text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-black bg-black text-white shadow-md scale-105'
                          : 'border-neutral-200 bg-white text-neutral-800 hover:border-black hover:bg-neutral-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLOR SELECTION - ONLY FOR SHOES */}
            {effectiveColors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block">
                  CHỌN MÀU SẮC: <span className="text-neutral-500 font-bold">{activeColor?.name || 'Mặc định'}</span>
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {effectiveColors.map((color) => {
                    const isSelected = activeColor?.name.trim().toLowerCase() === color.name.trim().toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTION */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block">
                SỐ LƯỢNG:
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-200 bg-white rounded-2xl p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 text-neutral-700 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <span className="text-xs font-medium text-neutral-500">
                  Tổng tiền: <strong className="text-neutral-900 font-black">{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>
            </div>

            {/* Out of stock notice */}
            {!isStock && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold shadow-xs">
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
                <span>Sản phẩm tạm thời hết hàng. Quý khách vui lòng chọn sản phẩm khác hoặc quay lại sau!</span>
              </div>
            )}

            {/* PURCHASE BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {/* Add To Cart */}
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={!isStock}
                className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                  isStock
                    ? 'bg-white border-2 border-black text-black hover:bg-neutral-50 cursor-pointer active:scale-98'
                    : 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
                id="product-detail-add-cart-btn"
              >
                <ShoppingCart size={18} />
                <span>{isStock ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}</span>
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNowClick}
                disabled={!isStock}
                className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isStock
                    ? 'bg-black hover:bg-neutral-800 text-white cursor-pointer active:scale-98'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
                id="product-detail-buy-now-btn"
              >
                <Zap size={18} className={isStock ? 'fill-amber-400 text-amber-400' : 'text-neutral-400'} />
                <span>{isStock ? 'MUA NGAY' : 'TẠM HẾT HÀNG'}</span>
              </button>
            </div>

            {/* Additional info badges */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 text-xs text-neutral-600 space-y-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-neutral-400" />
                <span>Thời gian giao hàng dự kiến: <strong>1 - 3 ngày làm việc</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Bảo hành chính hãng <strong>6 tháng</strong> đối với lỗi nhà sản xuất</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PRODUCT DESCRIPTION & SPECIFICATIONS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-neutral-200/80 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">
              MÔ TẢ SẢN PHẨM & THÔNG TIN CHI TIẾT
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              Tìm hiểu cấu trúc công nghệ, chất liệu và phong cách thiết kế của {product.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
              <p>{product.description}</p>
              
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-black text-neutral-900 uppercase">Đặc điểm nổi bật:</h3>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li>Thân giày làm từ chất liệu cao cấp thoáng khí, hỗ trợ ôm khít và bảo vệ bàn chân tối đa.</li>
                  <li>Bộ đệm êm ái đàn hồi vượt trội, phân tán đều áp lực cho từng bước sải chân.</li>
                  <li>Đế ngoài cao su chống trượt bền bỉ với rãnh bám thông minh, thích hợp cho nhiều địa hình.</li>
                  <li>Phối màu trẻ trung, hiện đại, dễ dàng phối hợp cùng nhiều outfit thời trang streetwear hay thể thao.</li>
                </ul>
              </div>
            </div>

            {/* Spec Table */}
            <div className="lg:col-span-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-3">
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                THÔNG SỐ KỸ THUẬT
              </h3>

              <div className="space-y-2 text-xs divide-y divide-neutral-200/60">
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 font-semibold">Thương hiệu</span>
                  <span className="font-bold text-neutral-900">{product.brand || 'Phụ kiện chính hãng'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 font-semibold">Dòng sản phẩm</span>
                  <span className="font-bold text-neutral-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 font-semibold">Mã SKU</span>
                  <span className="font-bold text-neutral-900">{product.sku || `SLS-${(product.brand || product.category || 'SP').substring(0,2).toUpperCase()}-${product.id.substring(0,4).toUpperCase()}`}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 font-semibold">Chất liệu</span>
                  <span className="font-bold text-neutral-900">Vải dệt cao cấp / Da tổng hợp</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500 font-semibold">Bảo hành</span>
                  <span className="font-bold text-neutral-900">6 tháng keo chỉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN CUSTOMER REVIEWS SECTION (EMBEDDED DIRECTLY ON PAGE, NO MODAL CONTAINER) */}
      <section
        ref={reviewsSectionRef}
        id="product-reviews-section"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Section Header & Write Review Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2.5">
                <Star size={24} className="fill-amber-400 text-amber-500" />
                <span>ĐÁNH GIÁ KHÁCH HÀNG</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                Tất cả nhận xét chân thực từ người mua hàng thực tế tại K-NICKS.
              </p>
            </div>

            {/* Write Review Button / Status */}
            <div>
              {!user ? (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Đăng nhập để đánh giá
                </button>
              ) : isEligible ? (
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(existingUserReview)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-neutral-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  id="write-review-btn"
                >
                  <Star size={15} className="fill-black text-black" />
                  <span>{existingUserReview ? 'SỬA ĐÁNH GIÁ CỦA BẠN' : '★ VIẾT ĐÁNH GIÁ'}</span>
                </button>
              ) : (
                <div className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-neutral-200">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Mua & nhận hàng để mở quyền đánh giá</span>
                </div>
              )}
            </div>
          </div>

          {/* RATING SUMMARY & 5-STAR DISTRIBUTION CARD */}
          <div className="bg-neutral-50/80 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left 4 Cols: Big Score & Stars */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-200/80 space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-neutral-900 tracking-tight">
                {ratingStats.avgRating.toFixed(1)}
              </span>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    className={
                      s <= Math.round(ratingStats.avgRating)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-neutral-300 fill-neutral-200'
                    }
                  />
                ))}
              </div>

              <p className="text-xs font-bold text-neutral-600">
                {ratingStats.totalCount > 0 ? `Dựa trên ${ratingStats.totalCount} đánh giá` : 'Chưa có đánh giá nào'}
              </p>
            </div>

            {/* Right 8 Cols: Star Distribution Progress Bars */}
            <div className="md:col-span-8 space-y-2.5 flex flex-col justify-center max-w-xl">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.counts[star as 1 | 2 | 3 | 4 | 5];
                const pct = ratingStats.percentages[star as 1 | 2 | 3 | 4 | 5];

                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-14 text-neutral-800 font-bold shrink-0">
                      <span>{star}</span>
                      <Star size={13} className="fill-amber-400 text-amber-500" />
                    </div>

                    <div className="flex-1 h-3 bg-neutral-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="w-20 text-right font-bold text-neutral-600 shrink-0 text-[11px]">
                      {pct}% <span className="text-neutral-400 font-normal">({count})</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* FILTER & SORT CONTROLS BAR (DESKTOP: SINGLE ROW WITHOUT HORIZONTAL SCROLLBAR) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
              <span className="text-neutral-400 uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter size={12} /> Lọc:
              </span>

              {[
                { id: 'all', label: `Tất cả (${ratingStats.totalCount})` },
                { id: '5', label: `5 Sao (${ratingStats.counts[5]})` },
                { id: '4', label: `4 Sao (${ratingStats.counts[4]})` },
                { id: '3', label: `3 Sao (${ratingStats.counts[3]})` },
                { id: '2', label: `2 Sao (${ratingStats.counts[2]})` },
                { id: '1', label: `1 Sao (${ratingStats.counts[1]})` },
                { id: 'with-images', label: `Có ảnh (${ratingStats.withImagesCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStarFilter(tab.id);
                    setReviewPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    starFilter === tab.id
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0 self-end md:self-auto">
              <span className="text-neutral-400 text-[11px]">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setReviewPage(1);
                }}
                className="bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 outline-none cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="highest">Đánh giá cao nhất</option>
                <option value="lowest">Đánh giá thấp nhất</option>
              </select>
            </div>

          </div>

          {/* REVIEWS LIST OR EMPTY STATE */}
          {displayedReviews.length === 0 ? (
            /* EMPTY REVIEWS STATE */
            <div className="py-14 px-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Star size={28} />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-900 uppercase">CHƯA CÓ ĐÁNH GIÁ</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Đây là sản phẩm mới. Hãy là người đầu tiên trải nghiệm và chia sẻ đánh giá về sản phẩm này!
                </p>
              </div>
              {isEligible && (
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(existingUserReview)}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {existingUserReview ? 'Sửa đánh giá của bạn' : 'Viết đánh giá ngay'}
                </button>
              )}
            </div>
          ) : paginatedReviews.length === 0 ? (
            /* EMPTY FILTER RESULT */
            <div className="py-10 px-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 text-center space-y-2">
              <p className="text-xs font-bold text-neutral-600">
                Không tìm thấy đánh giá nào với bộ lọc đã chọn.
              </p>
              <button
                onClick={() => setStarFilter('all')}
                className="text-xs text-black font-black underline cursor-pointer"
              >
                Xem tất cả đánh giá
              </button>
            </div>
          ) : (
            /* REVIEW CARDS LIST */
            <div className="space-y-4">
              {paginatedReviews.map((rev) => {
                const isOwner = user && (rev.userId === user.id || rev.name === user.name);
                const isAdmin = user?.role === 'admin';
                const isHelpfulByUser = user && rev.helpfulUserIds?.includes(user.id || user.email);

                return (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-sm transition-all space-y-3.5"
                    id={`review-card-${rev.id}`}
                  >
                    {/* Header: User Info + Stars */}
                    <div className="flex items-start justify-between gap-3">
                      
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {rev.avatar ? (
                          <img
                            src={rev.avatar}
                            alt={rev.name}
                            className="h-10 w-10 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-neutral-900 text-white font-black flex items-center justify-center text-xs shrink-0 uppercase">
                            {rev.name ? rev.name.charAt(0) : 'K'}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-black text-neutral-900">
                              {rev.name}
                            </h4>

                            {/* Verified Buyer Badge (Green) */}
                            {rev.isVerifiedBuyer && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check size={11} className="stroke-[3]" />
                                <span>✓ Đã mua hàng</span>
                              </span>
                            )}
                          </div>

                          {/* Date & Purchased options */}
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400 font-medium flex-wrap">
                            <span>{(() => {
                              if (!rev.date) return '';
                              if (rev.date.includes('T') || rev.date.includes('-')) {
                                const d = new Date(rev.date);
                                if (!isNaN(d.getTime())) {
                                  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                }
                              }
                              return rev.date;
                            })()}</span>
                            {rev.status === 'Chờ duyệt' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Đang chờ duyệt
                              </span>
                            )}
                            {(rev.purchasedSize || rev.purchasedColor) && (
                              <>
                                <span>•</span>
                                <span className="text-neutral-600 font-semibold">
                                  {rev.purchasedSize && `Size: ${rev.purchasedSize}`}
                                  {rev.purchasedSize && rev.purchasedColor && ' | '}
                                  {rev.purchasedColor && `Màu: ${rev.purchasedColor}`}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={
                              s <= Math.round(rev.rating)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-neutral-200 fill-neutral-100'
                            }
                          />
                        ))}
                      </div>

                    </div>

                    {/* Review Comment Text */}
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 whitespace-pre-line font-normal">
                      {rev.comment}
                    </p>

                    {/* Customer Photos Gallery (thumbnails) */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {rev.images.map((imgUrl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setLightboxImage(imgUrl)}
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 hover:opacity-90 transition-opacity cursor-pointer group shadow-xs"
                          >
                            <img
                              src={imgUrl}
                              alt={`Ảnh đánh giá của ${rev.name} ${i + 1}`}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Footer: Helpful button & Edit/Delete controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                      
                      {/* Compact Helpful button */}
                      <button
                        type="button"
                        onClick={() => onToggleHelpful(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer text-[11px] font-bold ${
                          isHelpfulByUser
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <ThumbsUp size={12} className={isHelpfulByUser ? 'fill-emerald-600 text-emerald-700' : ''} />
                        <span>Hữu ích ({rev.helpfulCount || 0})</span>
                      </button>

                      {/* Author / Admin Actions */}
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenReviewModal(rev)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingReviewId(rev.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Xóa</span>
                            </button>
                          </>
                        )}

                        {isAdmin && !isOwner && (
                          <>
                            {onToggleHideReview && (
                              <button
                                type="button"
                                onClick={() => onToggleHideReview(rev.id)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-1 cursor-pointer"
                              >
                                {rev.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                                <span>{rev.isHidden ? 'Hiện' : 'Ẩn'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeletingReviewId(rev.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Xóa [Admin]</span>
                            </button>
                          </>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS (If more than 1 page) */}
          {totalReviewPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-neutral-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                disabled={reviewPage === 1}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Trước</span>
              </button>

              {[...Array(totalReviewPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setReviewPage(pageNum)}
                    className={`h-9 w-9 rounded-xl transition-all cursor-pointer ${
                      reviewPage === pageNum
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
                disabled={reviewPage === totalReviewPages}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>Sau</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Gợi ý cho bạn</span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight mt-0.5">
                SẢN PHẨM TƯƠNG TỰ
              </h2>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <div
                key={relProd.id}
                onClick={() => {
                  onSelectProduct(relProd);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer"
              >
                <ProductCard
                  product={relProd}
                  onQuickView={() => {
                    onSelectProduct(relProd);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={(p, sz, cl) => onAddToCart(p, sz, cl, 1)}
                  isFavorite={false}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX POPUP FOR CUSTOMER REVIEW PHOTOS */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 h-10 w-10 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center cursor-pointer z-10 transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
              <img
                src={lightboxImage}
                alt="Review photo full"
                className="max-h-[85vh] max-w-full object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingReviewId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center gap-2 text-rose-600 font-black text-base uppercase">
                <AlertCircle size={20} />
                <span>XÁC NHẬN XÓA ĐÁNH GIÁ</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingReviewId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    onDeleteReview(deletingReviewId);
                    setDeletingReviewId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-md"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ruler size={20} className="text-neutral-900" />
                  <h3 className="text-base font-black text-neutral-900 uppercase">BẢNG QUY ĐỔI KÍCH CỠ GIÀY</h3>
                </div>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-neutral-400 hover:text-black p-1 rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 font-black text-neutral-900 uppercase">
                    <tr>
                      <th className="py-2 px-3 rounded-l-lg">EU</th>
                      <th className="py-2 px-3">US (Nam)</th>
                      <th className="py-2 px-3">UK</th>
                      <th className="py-2 px-3 rounded-r-lg">CM (Chiều dài bàn chân)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">38</td><td className="py-2 px-3">5.5</td><td className="py-2 px-3">5.0</td><td className="py-2 px-3">24.0 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">39</td><td className="py-2 px-3">6.5</td><td className="py-2 px-3">6.0</td><td className="py-2 px-3">24.5 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">40</td><td className="py-2 px-3">7.0</td><td className="py-2 px-3">6.0</td><td className="py-2 px-3">25.0 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">41</td><td className="py-2 px-3">8.0</td><td className="py-2 px-3">7.0</td><td className="py-2 px-3">26.0 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">42</td><td className="py-2 px-3">8.5</td><td className="py-2 px-3">7.5</td><td className="py-2 px-3">26.5 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">43</td><td className="py-2 px-3">9.5</td><td className="py-2 px-3">8.5</td><td className="py-2 px-3">27.5 cm</td></tr>
                    <tr><td className="py-2 px-3 font-bold text-neutral-900">44</td><td className="py-2 px-3">10.0</td><td className="py-2 px-3">9.0</td><td className="py-2 px-3">28.0 cm</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                💡 <strong>Mẹo chọn size:</strong> Nếu bạn có bàn chân bè hoặc muốn đi kèm tất thể thao dày, hãy cân nhắc chọn tăng 0.5 - 1 size so với bảng chuẩn.
              </div>

              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Đã hiểu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
