import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  X,
  Star,
  RefreshCw,
  User,
  ShieldCheck,
  Heart,
  KeyRound,
  LogOut,
  MapPin,
  CreditCard,
  FileText,
  Sparkles,
  Check,
  HelpCircle,
  MessageSquare,
  Building2,
  Calendar
} from 'lucide-react';
import { Order, Product, OrderItem, Review, UserProfile } from '../types';

interface MyOrdersPageProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], reason?: string) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, qty?: number) => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'profile' | 'wishlist', orderId?: string | null) => void;
  selectedOrderId?: string | null;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  products: Product[];
  reviews?: Review[];
  onOpenReviewModal?: (product: Product | { id: string; name: string; image: string; brand: string }, item?: OrderItem, orderId?: string) => void;
  onAddReview?: (productId: string, rating: number, comment: string) => void;
  favoritesCount?: number;
}

export default function MyOrdersPage({
  orders,
  onUpdateOrderStatus,
  onAddToCart,
  onNavigate,
  selectedOrderId = null,
  user,
  onOpenAuthModal,
  onLogout,
  products,
  reviews = [],
  onOpenReviewModal,
  onAddReview,
  favoritesCount = 0
}: MyOrdersPageProps) {
  // Active Status Filter Tab: 'all' | 'Chờ xử lý' | 'Đã xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy'
  const [activeTab, setActiveTab] = useState<string>('all');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Cancel Modal state
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [cancelReasonOption, setCancelReasonOption] = useState<string>('Tôi muốn thay đổi sản phẩm.');
  const [customReason, setCustomReason] = useState<string>('');

  // Review Modal state
  const [reviewingItem, setReviewingItem] = useState<{ item: OrderItem; orderId: string } | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Status Normalize Helper
  const normalizeStatus = (status: Order['status']): 'Chờ xử lý' | 'Đã xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy' => {
    if (status === 'Chờ xác nhận') return 'Chờ xử lý';
    if (status === 'Đã giao hàng') return 'Đã giao';
    return status as 'Chờ xử lý' | 'Đã xác nhận' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
  };

  // Status Badge UI helper
  const renderStatusBadge = (status: Order['status']) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case 'Chờ xử lý':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Clock size={13} className="text-amber-600 shrink-0" />
            <span>Chờ xử lý</span>
          </span>
        );
      case 'Đã xác nhận':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
            <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
            <span>Đã xác nhận</span>
          </span>
        );
      case 'Đang giao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/80">
            <Truck size={13} className="text-indigo-600 shrink-0 animate-pulse" />
            <span>Đang giao</span>
          </span>
        );
      case 'Đã giao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <Check size={13} className="text-emerald-600 shrink-0 stroke-[3]" />
            <span>Đã giao</span>
          </span>
        );
      case 'Đã hủy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/80">
            <XCircle size={13} className="text-rose-600 shrink-0" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  // If user is not logged in, show access prompt or require auth
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50/50 pt-12 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-lg text-center space-y-5">
          <div className="h-20 w-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <User size={38} />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
              YÊU CẦU ĐĂNG NHẬP
            </h2>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Bạn cần đăng nhập tài khoản K-NICKS để xem và quản lý danh sách đơn hàng cá nhân của mình.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={onOpenAuthModal}
              className="w-full py-3.5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3 bg-neutral-100 text-neutral-700 rounded-2xl text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Quay về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find currently selected order for detail view
  const currentOrderDetail = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId || o.orderCode.replace('#', '') === selectedOrderId.replace('#', ''))
    : null;

  // Filter orders by tab and search code
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const norm = normalizeStatus(order.status);
      
      // Tab filter
      if (activeTab !== 'all') {
        if (norm !== activeTab) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const codeMatch = order.orderCode.toLowerCase().includes(q);
        const itemMatch = order.items.some((it) => it.productName.toLowerCase().includes(q));
        if (!codeMatch && !itemMatch) return false;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Counts for summary metrics cards
  const metrics = useMemo(() => {
    let pending = 0;
    let shipping = 0;
    let completed = 0;

    orders.forEach((o) => {
      const norm = normalizeStatus(o.status);
      if (norm === 'Chờ xử lý') pending++;
      if (norm === 'Đang giao') shipping++;
      if (norm === 'Đã giao') completed++;
    });

    return {
      total: orders.length,
      pending,
      shipping,
      completed
    };
  }, [orders]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Handle Cancel Order submission
  const handleConfirmCancelOrder = () => {
    if (!cancelingOrder) return;
    const finalReason = cancelReasonOption === 'Lý do khác' ? customReason.trim() || 'Lý do khác' : cancelReasonOption;

    onUpdateOrderStatus(cancelingOrder.id, 'Đã hủy', finalReason);
    showToast(`Đã hủy đơn hàng ${cancelingOrder.orderCode} thành công.`);
    setCancelingOrder(null);
    setCustomReason('');
  };

  // Handle Reorder / Buy Again
  const handleReorder = (order: Order) => {
    let readdedCount = 0;
    let unavailableCount = 0;

    order.items.forEach((item) => {
      const matchingProduct = products.find((p) => p.id === item.productId || p.name === item.productName);
      if (matchingProduct) {
        const matchedColor = matchingProduct.colors.find((c) => c.name === item.colorName) || matchingProduct.colors[0] || { name: 'Standard', hex: '#000000' };
        onAddToCart(matchingProduct, item.size, matchedColor, item.quantity);
        readdedCount += item.quantity;
      } else {
        unavailableCount++;
      }
    });

    if (unavailableCount > 0) {
      showToast(`Đã thêm các sản phẩm còn hàng vào giỏ (${unavailableCount} sản phẩm đã hết hàng).`);
    } else {
      showToast(`Đã thêm ${readdedCount} sản phẩm từ đơn ${order.orderCode} vào giỏ hàng!`);
    }
  };

  // Handle Submit Product Review
  const handleSubmitReview = () => {
    if (!reviewingItem) return;
    if (onAddReview) {
      onAddReview(reviewingItem.item.productId, reviewRating, reviewComment);
    }
    showToast(`Cảm ơn bạn đã đánh giá sản phẩm ${reviewingItem.item.productName}!`);
    setReviewingItem(null);
    setReviewComment('');
    setReviewRating(5);
  };

  // =========================================================================
  // ORDER DETAIL VIEW (If selectedOrderId is present)
  // =========================================================================
  if (selectedOrderId) {
    if (!currentOrderDetail) {
      return (
        <div className="min-h-screen bg-neutral-50/50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-4">
            <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-neutral-900 uppercase">
              403 - KHÔNG THỂ TRUY CẬP ĐƠN HÀNG
            </h2>
            <p className="text-xs text-neutral-500">
              Đơn hàng không tồn tại hoặc bạn không có quyền xem thông tin đơn hàng này.
            </p>
            <button
              onClick={() => onNavigate('my-orders', null)}
              className="mt-4 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              ← Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      );
    }

    const normStatus = normalizeStatus(currentOrderDetail.status);
    const isCanceled = normStatus === 'Đã hủy';

    return (
      <div className="min-h-screen bg-neutral-50/50 pt-6 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-800"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <button onClick={() => onNavigate('home')} className="hover:text-black">Trang chủ</button>
            <ChevronRight size={12} className="text-neutral-400" />
            <button onClick={() => onNavigate('my-orders', null)} className="hover:text-black">Đơn hàng của tôi</button>
            <ChevronRight size={12} className="text-neutral-400" />
            <span className="font-bold text-black">{currentOrderDetail.orderCode}</span>
          </nav>

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs">
            <div>
              <button
                onClick={() => onNavigate('my-orders', null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Quay lại đơn hàng của tôi</span>
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">
                  CHI TIẾT ĐƠN HÀNG {currentOrderDetail.orderCode}
                </h1>
                {renderStatusBadge(currentOrderDetail.status)}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Ngày đặt: <span className="font-semibold text-neutral-800">{currentOrderDetail.orderDate}</span>
              </p>
            </div>

            {/* Top Action Buttons (Cancel / Buy Again) */}
            <div className="flex items-center gap-2">
              {(normStatus === 'Chờ xử lý') && (
                <button
                  onClick={() => setCancelingOrder(currentOrderDetail)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                >
                  Hủy đơn hàng
                </button>
              )}

              {(normStatus === 'Đã giao' || isCanceled) && (
                <button
                  onClick={() => handleReorder(currentOrderDetail)}
                  className="px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw size={14} />
                  <span>Mua lại đơn này</span>
                </button>
              )}
            </div>
          </div>

          {/* TIMELINE SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-neutral-700" />
              <span>TRẠNG THÁI TIẾN TRÌNH GIAO HÀNG</span>
            </h2>

            {isCanceled ? (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                  <XCircle size={18} />
                  <span>✕ Đơn hàng đã hủy</span>
                </div>
                {currentOrderDetail.cancelReason && (
                  <p className="text-xs text-rose-700 font-medium pl-6">
                    <span className="font-bold">Lý do hủy:</span> {currentOrderDetail.cancelReason}
                  </p>
                )}
                {currentOrderDetail.cancelDate && (
                  <p className="text-[10px] text-rose-500 pl-6">
                    Thời gian cập nhật: {currentOrderDetail.cancelDate}
                  </p>
                )}
              </div>
            ) : (
              /* Normal Timeline Horizontal / Vertical Steps */
              <div className="pt-2 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                  
                  {/* Step 1: Place Order */}
                  <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center relative z-10">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Đặt hàng thành công</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{currentOrderDetail.orderDate}</p>
                    </div>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      normStatus === 'Đã xác nhận' || normStatus === 'Đang giao' || normStatus === 'Đã giao'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}>
                      {normStatus === 'Đã xác nhận' || normStatus === 'Đang giao' || normStatus === 'Đã giao' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${
                        normStatus === 'Đã xác nhận' || normStatus === 'Đang giao' || normStatus === 'Đã giao'
                          ? 'text-neutral-900'
                          : 'text-neutral-400'
                      }`}>Đã xác nhận</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Xác nhận kho hàng</p>
                    </div>
                  </div>

                  {/* Step 3: Shipping */}
                  <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      normStatus === 'Đang giao' || normStatus === 'Đã giao'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}>
                      {normStatus === 'Đang giao' || normStatus === 'Đã giao' ? '✓' : '3'}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${
                        normStatus === 'Đang giao' || normStatus === 'Đã giao'
                          ? 'text-neutral-900'
                          : 'text-neutral-400'
                      }`}>Đang giao hàng</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Bàn giao shipper</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      normStatus === 'Đã giao'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}>
                      {normStatus === 'Đã giao' ? '✓' : '4'}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${
                        normStatus === 'Đã giao' ? 'text-neutral-900' : 'text-neutral-400'
                      }`}>Giao hàng thành công</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Đã nhận hàng</p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* MAIN TWO-COLUMN GRID: PRODUCTS (LEFT 7) + INFO (RIGHT 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* PRODUCTS LIST SECTION (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
                <span>DANH SÁCH SẢN PHẨM ({(currentOrderDetail.items || []).length})</span>
                <span className="text-[11px] text-neutral-400 font-bold">Giá lúc đặt mua</span>
              </h2>

              <div className="divide-y divide-neutral-100">
                {(currentOrderDetail.items || []).map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-16 w-16 object-contain rounded-2xl bg-white p-1.5 border border-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">{item.brand}</span>
                        <h4 className="text-xs font-extrabold text-neutral-900 truncate">{item.productName}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                          <span>Size: <strong className="text-black">{item.size}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            Mầu: 
                            <span className="h-2.5 w-2.5 rounded-full border border-neutral-300 inline-block" style={{ backgroundColor: item.colorHex }} />
                            <strong className="text-black">{item.colorName}</strong>
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Đơn giá: {formatPrice(item.unitPrice)} x <strong className="text-black">{item.quantity}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-0 border-neutral-100 pt-2 sm:pt-0">
                      <span className="text-sm font-black text-neutral-900">{formatPrice(item.totalPrice)}</span>
                      
                      {/* Review Button if order is delivered */}
                      {normStatus === 'Đã giao' && (() => {
                        const existingRev = reviews.find(
                          (r) =>
                            (r.productId === item.productId || r.productName === item.productName) &&
                            (r.userId === user?.id || (user?.email && r.name === user?.name))
                        );

                        const matchingProd = products.find(
                          (p) => p.id === item.productId || p.name === item.productName
                        ) || {
                          id: item.productId,
                          name: item.productName,
                          image: item.image,
                          brand: item.brand,
                        };

                        return (
                          <button
                            onClick={() => {
                              if (onOpenReviewModal) {
                                onOpenReviewModal(matchingProd, item, currentOrderDetail.id);
                              } else {
                                setReviewingItem({ item, orderId: currentOrderDetail.id });
                              }
                            }}
                            className={`mt-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              existingRev
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-400 hover:bg-amber-500 text-neutral-950 border-amber-400 shadow-xs'
                            }`}
                          >
                            <Star size={12} className={existingRev ? 'fill-emerald-600 text-emerald-700' : 'fill-black text-black'} />
                            <span>{existingRev ? '⭐ ĐÃ ĐÁNH GIÁ (Sửa)' : '⭐ ĐÁNH GIÁ'}</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Subtotal Box */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-xs space-y-2 mt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Tạm tính sản phẩm:</span>
                  <span className="font-bold text-neutral-900">{formatPrice(currentOrderDetail.subtotal)}</span>
                </div>

                {currentOrderDetail.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Mã giảm giá ({currentOrderDetail.discountCode || 'Khuyến mãi'}):</span>
                    <span>-{formatPrice(currentOrderDetail.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Phí vận chuyển ({currentOrderDetail.shippingMethod === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn'}):</span>
                  <span className="font-bold text-neutral-900">
                    {currentOrderDetail.shippingFee === 0 ? 'Miễn phí' : formatPrice(currentOrderDetail.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-black border-t border-neutral-200 pt-2">
                  <span>TỔNG CỘNG THANH TOÁN:</span>
                  <span className="text-base text-black">{formatPrice(currentOrderDetail.grandTotal)}</span>
                </div>
              </div>

            </div>

            {/* RECIPIENT & PAYMENT INFO SECTION (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Shipping Address Box */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5 flex items-center gap-1.5">
                  <MapPin size={15} className="text-neutral-700" />
                  <span>THÔNG TIN NHẬN HÀNG</span>
                </h3>

                <div className="text-xs space-y-2 text-neutral-700">
                  <p><span className="text-neutral-400 font-medium">Người nhận:</span> <strong className="text-neutral-900">{currentOrderDetail.recipientName}</strong></p>
                  <p><span className="text-neutral-400 font-medium">Số điện thoại:</span> <strong className="text-neutral-900">{currentOrderDetail.phone}</strong></p>
                  {currentOrderDetail.email && (
                    <p><span className="text-neutral-400 font-medium">Email:</span> <span className="text-neutral-800">{currentOrderDetail.email}</span></p>
                  )}
                  <p><span className="text-neutral-400 font-medium">Địa chỉ giao:</span> <span className="text-neutral-900 font-bold block mt-0.5">{currentOrderDetail.fullAddress}</span></p>
                  {currentOrderDetail.note && (
                    <p className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80 text-[11px] text-amber-900 mt-2">
                      <span className="font-bold">Ghi chú:</span> "{currentOrderDetail.note}"
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Info Box */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5 flex items-center gap-1.5">
                  <CreditCard size={15} className="text-neutral-700" />
                  <span>THANH TOÁN</span>
                </h3>

                <div className="text-xs space-y-2 text-neutral-700">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-medium">Phương thức:</span>
                    <strong className="text-neutral-900 uppercase">
                      {currentOrderDetail.paymentMethod === 'cod'
                        ? 'Thanh toán COD (Tiền mặt)'
                        : currentOrderDetail.paymentMethod === 'banking'
                        ? 'Chuyển khoản VietQR'
                        : currentOrderDetail.paymentMethod.toUpperCase()}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-medium">Trạng thái thanh toán:</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                      currentOrderDetail.paymentStatus === 'Đã thanh toán'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {currentOrderDetail.paymentStatus || (currentOrderDetail.paymentMethod === 'cod' ? 'Chưa thanh toán (Thanh toán khi nhận hàng)' : 'Đã xác nhận thanh toán')}
                    </span>
                  </div>

                  {currentOrderDetail.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-medium">Mã giao dịch:</span>
                      <span className="font-mono text-neutral-900 font-bold">{currentOrderDetail.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* CANCEL CONFIRMATION MODAL */}
        <AnimatePresence>
          {cancelingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCancelingOrder(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full z-10 space-y-4 border border-neutral-200 shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-rose-600 uppercase flex items-center gap-1.5">
                    <AlertCircle size={18} />
                    <span>HỦY ĐƠN HÀNG</span>
                  </h3>
                  <button onClick={() => setCancelingOrder(null)} className="text-neutral-400 hover:text-black">
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Bạn có chắc chắn muốn hủy đơn hàng <strong className="text-black">{cancelingOrder.orderCode}</strong>? Sau khi hủy, đơn hàng không thể khôi phục.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 block">Chọn lý do hủy đơn <span className="text-rose-500">*</span></label>
                  <select
                    value={cancelReasonOption}
                    onChange={(e) => setCancelReasonOption(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50"
                  >
                    <option value="Tôi muốn thay đổi sản phẩm.">Tôi muốn thay đổi sản phẩm.</option>
                    <option value="Tôi muốn thay đổi địa chỉ.">Tôi muốn thay đổi địa chỉ.</option>
                    <option value="Đặt nhầm sản phẩm.">Đặt nhầm sản phẩm.</option>
                    <option value="Tìm được sản phẩm khác phù hợp hơn.">Tìm được sản phẩm khác phù hợp hơn.</option>
                    <option value="Thời gian giao hàng quá lâu.">Thời gian giao hàng quá lâu.</option>
                    <option value="Lý do khác">Lý do khác</option>
                  </select>

                  {cancelReasonOption === 'Lý do khác' && (
                    <textarea
                      placeholder="Nhập lý do cụ thể..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-black bg-neutral-50 mt-2"
                    />
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelingOrder(null)}
                    className="flex-1 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancelOrder}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-md"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* REVIEW MODAL */}
        <AnimatePresence>
          {reviewingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReviewingItem(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-6 max-w-md w-full z-10 space-y-4 border border-neutral-200 shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900 uppercase flex items-center gap-1.5">
                    <Star size={18} className="fill-amber-400 text-amber-500" />
                    <span>ĐÁNH GIÁ SẢN PHẨM</span>
                  </h3>
                  <button onClick={() => setReviewingItem(null)} className="text-neutral-400 hover:text-black">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                  <img src={reviewingItem.item.image} alt={reviewingItem.item.productName} className="h-12 w-12 object-contain rounded-xl bg-white p-1 shrink-0" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 line-clamp-1">{reviewingItem.item.productName}</h5>
                    <p className="text-[10px] text-neutral-400">Size {reviewingItem.item.size} • Mầu: {reviewingItem.item.colorName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold text-neutral-700 block">Đánh giá sao của bạn</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          size={28}
                          className={star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Nhận xét chi tiết</label>
                  <textarea
                    placeholder="Hãy chia sẻ cảm nhận về chất lượng giày, độ êm ái, vừa vặn..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-black bg-neutral-50"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewingItem(null)}
                    className="flex-1 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    className="flex-1 py-3 rounded-2xl bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-md"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // =========================================================================
  // MAIN ACCOUNT & ORDERS LIST VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-800"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => onNavigate('home')} className="hover:text-black">Trang chủ</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-400">Tài khoản</span>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">Đơn hàng của tôi</span>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
            ĐƠN HÀNG CỦA TÔI
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Theo dõi và quản lý các đơn hàng của bạn.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT: SIDEBAR (3 COLS) + MAIN CONTENT (9 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: MY ACCOUNT MENU */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
            
            {/* User Avatar & Name Brief */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="h-10 w-10 rounded-full bg-black text-white font-black flex items-center justify-center text-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-neutral-900 truncate">{user.name}</h4>
                <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block px-2">
              TÀI KHOẢN CỦA TÔI
            </span>

            {/* Account Navigation Links */}
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <User size={15} className="text-neutral-400" />
                <span>Tổng quan</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <ShieldCheck size={15} className="text-neutral-400" />
                <span>Hồ sơ cá nhân</span>
              </button>

              {/* ACTIVE ITEM */}
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-black text-white flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
                title="Đang xem Đơn hàng của tôi - bấm để xem tất cả đơn"
              >
                <div className="flex items-center gap-2.5">
                  <Package size={15} className="text-white" />
                  <span>Đơn hàng của tôi</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={15} className="text-neutral-400" />
                  <span>Yêu thích</span>
                </div>
                {favoritesCount > 0 && (
                  <span className="text-[10px] text-neutral-500 font-bold">{favoritesCount}</span>
                )}
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <KeyRound size={15} className="text-neutral-400" />
                <span>Đổi mật khẩu</span>
              </button>

              <div className="border-t border-neutral-100 my-1.5" />

              <button
                onClick={onLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut size={15} className="text-rose-500" />
                <span>Đăng xuất</span>
              </button>
            </div>

          </div>

          {/* RIGHT MAIN AREA: METRICS CARDS + FILTER TABS + SEARCH + ORDER CARDS */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 4 SUMMARY METRICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Tất cả đơn</span>
                  <span className="text-lg font-black text-neutral-900">{metrics.total}</span>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Chờ xử lý</span>
                  <span className="text-lg font-black text-amber-800">{metrics.pending}</span>
                </div>
              </div>

              {/* Shipping Orders */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Đang giao</span>
                  <span className="text-lg font-black text-indigo-800">{metrics.shipping}</span>
                </div>
              </div>

              {/* Completed Orders */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Đã hoàn thành</span>
                  <span className="text-lg font-black text-emerald-800">{metrics.completed}</span>
                </div>
              </div>

            </div>

            {/* FILTER TABS & SEARCH BAR HEADER */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="🔍 Tìm theo mã đơn hàng (#SS2026...) hoặc tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-9 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter Tabs Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'Chờ xử lý', label: 'Chờ xử lý' },
                  { id: 'Đã xác nhận', label: 'Đã xác nhận' },
                  { id: 'Đang giao', label: 'Đang giao' },
                  { id: 'Đã giao', label: 'Đã giao' },
                  { id: 'Đã hủy', label: 'Đã hủy' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

            </div>

            {/* ORDER LIST CARDS */}
            {paginatedOrders.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 shadow-xs text-center space-y-4">
                <div className="h-20 w-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <Package size={40} />
                </div>
                <h3 className="text-lg font-black text-neutral-900 uppercase">
                  {searchQuery ? 'Không tìm thấy đơn hàng phù hợp.' : 'Bạn chưa có đơn hàng nào'}
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ danh sách.'
                    : 'Khám phá những đôi giày mới và bắt đầu đơn hàng đầu tiên của bạn.'}
                </p>
                <button
                  onClick={() => onNavigate('products')}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>MUA SẮM NGAY</span>
                </button>
              </div>
            ) : (
              /* ORDER CARDS LIST */
              <div className="space-y-4">
                {paginatedOrders.map((order) => {
                  const norm = normalizeStatus(order.status);
                  const orderItems = order.items || [];
                  const firstItem = orderItems[0];
                  const extraItemsCount = Math.max(0, orderItems.length - 1);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all space-y-4"
                    >
                      {/* Card Header: Code, Date & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-black tracking-wider text-sm">{order.orderCode}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-500 font-medium flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{order.orderDate}</span>
                          </span>
                        </div>
                        <div>{renderStatusBadge(order.status)}</div>
                      </div>

                      {/* Card Body: Items preview */}
                      <div
                        onClick={() => onNavigate('my-orders', order.id)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {firstItem && (
                            <img
                              src={firstItem.image}
                              alt={firstItem.productName}
                              className="h-16 w-16 object-contain rounded-2xl bg-white p-1 border border-neutral-100 shrink-0 group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="min-w-0">
                            {firstItem && (
                              <>
                                <h4 className="text-xs font-bold text-neutral-900 group-hover:text-black line-clamp-1">
                                  {firstItem.productName}
                                </h4>
                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                  Size: <strong className="text-black">{firstItem.size}</strong> • Slg: <strong className="text-black">x{firstItem.quantity}</strong>
                                </p>
                              </>
                            )}
                            {extraItemsCount > 0 && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                                + {extraItemsCount} sản phẩm khác
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Total & Payment method */}
                        <div className="text-left sm:text-right shrink-0 border-t sm:border-0 border-neutral-100 pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <div>
                            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Tổng tiền</span>
                            <span className="text-sm font-black text-neutral-900">{formatPrice(order.grandTotal)}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
                            {order.paymentMethod === 'cod' ? 'Thanh toán COD' : order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Action Buttons */}
                      <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-neutral-500 font-medium">
                          Giao tới: <strong className="text-neutral-800">{order.recipientName}</strong> ({order.province})
                        </div>

                        <div className="flex items-center gap-2">
                          {(norm === 'Chờ xử lý') && (
                            <button
                              onClick={() => setCancelingOrder(order)}
                              className="px-3 py-1.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Hủy đơn
                            </button>
                          )}

                          {(norm === 'Đã giao' || norm === 'Đã hủy') && (
                            <button
                              onClick={() => handleReorder(order)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw size={12} />
                              <span>Mua lại</span>
                            </button>
                          )}

                          {norm === 'Đã giao' && (
                            <button
                              onClick={() => {
                                const firstItem = (order.items || [])[0];
                                if (firstItem) {
                                  const matchingProd = products.find(
                                    (p) => p.id === firstItem.productId || p.name === firstItem.productName
                                  ) || {
                                    id: firstItem.productId,
                                    name: firstItem.productName,
                                    image: firstItem.image,
                                    brand: firstItem.brand,
                                  };
                                  if (onOpenReviewModal) {
                                    onOpenReviewModal(matchingProd, firstItem, order.id);
                                  } else {
                                    onNavigate('my-orders', order.id);
                                  }
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Star size={12} className="fill-black text-black" />
                              <span>Đánh giá</span>
                            </button>
                          )}

                          <button
                            onClick={() => onNavigate('my-orders', order.id)}
                            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>Xem chi tiết</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-9 w-9 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* CANCEL CONFIRMATION MODAL */}
      <AnimatePresence>
        {cancelingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelingOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full z-10 space-y-4 border border-neutral-200 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <h3 className="text-base font-black text-rose-600 uppercase flex items-center gap-1.5">
                  <AlertCircle size={18} />
                  <span>HỦY ĐƠN HÀNG</span>
                </h3>
                <button onClick={() => setCancelingOrder(null)} className="text-neutral-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Bạn có chắc chắn muốn hủy đơn hàng <strong className="text-black">{cancelingOrder.orderCode}</strong>?
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">Lý do hủy đơn <span className="text-rose-500">*</span></label>
                <select
                  value={cancelReasonOption}
                  onChange={(e) => setCancelReasonOption(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50"
                >
                  <option value="Tôi muốn thay đổi sản phẩm.">Tôi muốn thay đổi sản phẩm.</option>
                  <option value="Tôi muốn thay đổi địa chỉ.">Tôi muốn thay đổi địa chỉ.</option>
                  <option value="Đặt nhầm sản phẩm.">Đặt nhầm sản phẩm.</option>
                  <option value="Tìm được sản phẩm khác phù hợp hơn.">Tìm được sản phẩm khác phù hợp hơn.</option>
                  <option value="Thời gian giao hàng quá lâu.">Thời gian giao hàng quá lâu.</option>
                  <option value="Lý do khác">Lý do khác</option>
                </select>

                {cancelReasonOption === 'Lý do khác' && (
                  <textarea
                    placeholder="Nhập lý do cụ thể..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 p-2.5 text-xs outline-none focus:border-black bg-neutral-50 mt-2"
                  />
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelingOrder(null)}
                  className="flex-1 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelOrder}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-md"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
