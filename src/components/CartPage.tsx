import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Heart,
  Plus,
  Minus,
  Tag,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { CartItem, Product, Promotion, AppliedPromoInfo, UserProfile, Order, SystemSettings } from '../types';
import { PRODUCTS, INITIAL_PROMOTIONS } from '../data';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSettings';
import { validateAndCalculatePromotion, formatPromotionValue } from '../utils/promotionUtils';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onChangeItemSize: (id: string, newSize: number) => void;
  onClearCart: () => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout') => void;
  onQuickViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, qty?: number) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  promotions?: Promotion[];
  user?: UserProfile | null;
  orders?: Order[];
  appliedPromo?: AppliedPromoInfo | null;
  onApplyPromo?: (promo: AppliedPromoInfo | null) => void;
  settings?: SystemSettings;
}

export default function CartPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onChangeItemSize,
  onClearCart,
  onNavigate,
  onQuickViewProduct,
  onAddToCart,
  onToggleFavorite,
  favorites,
  promotions: promotionsProp,
  user = null,
  orders = [],
  appliedPromo: externalAppliedPromo = null,
  onApplyPromo: externalOnApplyPromo,
  settings: settingsProp
}: CartPageProps) {
  const settings = settingsProp || DEFAULT_SYSTEM_SETTINGS;
  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold ?? 3000000;
  const defaultShippingFee = settings?.shipping?.defaultFee ?? 35000;

  // Promotions State Fallback
  const [internalPromotions] = useState<Promotion[]>(() => {
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
  const promotions = promotionsProp || internalPromotions;

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete modal confirmation states
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Change size modal state
  const [sizeModalItem, setSizeModalItem] = useState<CartItem | null>(null);
  const [selectedNewSize, setSelectedNewSize] = useState<number | null>(null);

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [localAppliedPromo, setLocalAppliedPromo] = useState<AppliedPromoInfo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const appliedPromo = externalAppliedPromo !== undefined && externalAppliedPromo !== null ? externalAppliedPromo : localAppliedPromo;

  const setAppliedPromo = (promo: AppliedPromoInfo | null) => {
    setLocalAppliedPromo(promo);
    if (externalOnApplyPromo) {
      externalOnApplyPromo(promo);
    }
  };

  // Stock notice for max quantity limit (10 items per product model)
  const MAX_STOCK_PER_ITEM = 10;
  const [stockNoticeItemId, setStockNoticeItemId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Price calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping threshold
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : defaultShippingFee;

  // Dynamic discount calculation if applied promo exists
  const discountAmount = useMemo(() => {
    if (!appliedPromo || cartItems.length === 0) return 0;
    const result = validateAndCalculatePromotion({
      code: appliedPromo.code,
      cartItems,
      promotions,
      user,
      orders
    });
    return result.isValid ? result.discountAmount : 0;
  }, [appliedPromo, cartItems, promotions, user, orders]);

  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Promo Code handling with centralized validation engine
  const handleApplyPromo = (codeOverride?: string) => {
    const targetCode = (codeOverride || promoInput).trim();
    if (!targetCode) return;

    if (cartItems.length === 0) {
      setPromoError('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi áp dụng mã.');
      return;
    }

    const result = validateAndCalculatePromotion({
      code: targetCode,
      cartItems,
      promotions,
      user,
      orders
    });

    if (result.isValid && result.appliedPromo) {
      setAppliedPromo(result.appliedPromo);
      setPromoError(null);
      showToast(`Áp dụng mã ${result.appliedPromo.code} thành công! Giảm ${formatPrice(result.discountAmount)}.`);
    } else {
      setPromoError(result.errorMessage || 'Mã giảm giá không hợp lệ hoặc không đủ điều kiện áp dụng.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
    showToast('Đã hủy mã giảm giá');
  };

  // Quantity increase check
  const handleIncreaseQty = (item: CartItem) => {
    if (item.quantity >= MAX_STOCK_PER_ITEM) {
      setStockNoticeItemId(item.id);
      setTimeout(() => setStockNoticeItemId(null), 3500);
    } else {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  // Quantity decrease
  const handleDecreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      setItemToDelete(item);
    }
  };

  // Confirm delete item
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete.id);
      setItemToDelete(null);
      showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    }
  };

  // Confirm clear all cart
  const confirmClearAll = () => {
    onClearCart();
    setShowClearAllModal(false);
    showToast('Đã xóa tất cả sản phẩm khỏi giỏ hàng.');
  };

  // Confirm change size
  const confirmChangeSize = () => {
    if (sizeModalItem && selectedNewSize) {
      onChangeItemSize(sizeModalItem.id, selectedNewSize);
      showToast(`Đã thay đổi size thành ${selectedNewSize}.`);
      setSizeModalItem(null);
      setSelectedNewSize(null);
    }
  };

  // Recommended Products (4 items)
  const cartProductIds = cartItems.map((i) => i.product.id);
  const recommendedProducts = PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 border border-neutral-800"
          >
            <Sparkles size={16} className="text-yellow-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-black transition-colors"
          >
            Trang chủ
          </button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">Giỏ hàng</span>
        </nav>

        {/* PAGE TITLE & SUBTITLE */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 uppercase">
              Giỏ hàng của bạn
            </h1>
            <p className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
              {cartItems.length > 0 ? (
                <>Bạn đang có <span className="font-bold text-black">{totalQuantity}</span> sản phẩm trong giỏ hàng</>
              ) : (
                'Giỏ hàng của bạn đang trống'
              )}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Trash2 size={14} />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        {cartItems.length === 0 ? (
          
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-neutral-200/80 shadow-xs max-w-2xl mx-auto my-8"
          >
            <div className="h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
              Hãy khám phá những đôi giày phù hợp với phong cách của bạn từ Nike, Adidas, Puma và Converse.
            </p>

            <button
              onClick={() => onNavigate('products')}
              className="mt-8 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Khám phá sản phẩm</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

        ) : (

          /* CART HAS ITEMS: 2 COLUMN DESKTOP LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PRODUCT LIST (~68% width -> col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              
              {cartItems.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                const isNoticeShowing = stockNoticeItemId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs hover:border-neutral-300 transition-all duration-200 relative"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                      
                      {/* Product Thumbnail (120x120px) */}
                      <div
                        onClick={() => onQuickViewProduct(item.product)}
                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl bg-white border border-neutral-100 p-2 shrink-0 flex items-center justify-center cursor-pointer group relative overflow-hidden"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        
                        <div>
                          {/* Brand & Name */}
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] font-black tracking-wider uppercase text-neutral-400">
                                {item.product.brand}
                              </span>
                              <h3
                                onClick={() => onQuickViewProduct(item.product)}
                                className="text-sm sm:text-base font-bold text-neutral-900 cursor-pointer hover:underline line-clamp-1"
                              >
                                {item.product.name}
                              </h3>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg hover:bg-neutral-50 transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Selected Size & Color info */}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                            
                            {/* Size badge + Change size button */}
                            <div className="flex items-center gap-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-lg">
                              <span className="font-bold text-neutral-800">Size: {item.selectedSize}</span>
                              <button
                                onClick={() => {
                                  setSizeModalItem(item);
                                  setSelectedNewSize(item.selectedSize);
                                }}
                                className="text-[11px] font-bold text-rose-600 hover:underline ml-1 cursor-pointer"
                              >
                                Thay đổi
                              </button>
                            </div>

                            {/* Color */}
                            {item.selectedColor && (
                              <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                                <span
                                  className="h-3 w-3 rounded-full border border-neutral-300"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span>{item.selectedColor.name}</span>
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Stock Notice Banner */}
                        {isNoticeShowing && (
                          <div className="bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200">
                            <AlertCircle size={13} className="shrink-0" />
                            <span>Chỉ còn {MAX_STOCK_PER_ITEM} sản phẩm trong kho.</span>
                          </div>
                        )}

                        {/* Price, Quantity, Line Total Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                          
                          {/* Unit price */}
                          <div className="text-xs text-neutral-500">
                            Đơn giá: <span className="font-bold text-neutral-800">{formatPrice(item.product.price)}</span>
                          </div>

                          {/* Quantity Selector [-] 1 [+] */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">Số lượng:</span>
                            <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-0.5">
                              <button
                                onClick={() => handleDecreaseQty(item)}
                                className="h-7 w-7 rounded-lg hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center transition-colors text-xs cursor-pointer"
                                title="Giảm số lượng"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-neutral-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncreaseQty(item)}
                                className="h-7 w-7 rounded-lg hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center transition-colors text-xs cursor-pointer"
                                title="Tăng số lượng"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block sm:hidden">Thành tiền:</span>
                            <span className="text-sm sm:text-base font-black text-neutral-900">
                              {formatPrice(lineTotal)}
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })}

              {/* Continue Shopping Link */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => onNavigate('products')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-black py-2"
                >
                  <ArrowLeft size={15} />
                  <span>← Tiếp tục mua sắm</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY CARD (~32% width -> col-span-4) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-6">
                
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
                  Tóm tắt đơn hàng
                </h2>

                {/* PROMO CODE SECTION */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Tag size={13} className="text-neutral-500" />
                    <span>Mã giảm giá</span>
                  </label>

                  {appliedPromo ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-black text-emerald-950 flex items-center gap-1.5">
                            <span>{appliedPromo.code}</span>
                            {appliedPromo.name && (
                              <span className="text-[10px] text-emerald-700 font-medium">({appliedPromo.name})</span>
                            )}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-bold">
                            {appliedPromo.discountType === 'percent'
                              ? `Giảm ${appliedPromo.discountValue}% (-${formatPrice(discountAmount)})`
                              : `Giảm ${formatPrice(appliedPromo.discountValue)}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-xs font-bold text-emerald-800 hover:text-rose-600 underline cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nhập mã giảm giá..."
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black focus:bg-white transition-all"
                        />
                        <button
                          onClick={() => handleApplyPromo()}
                          className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Áp dụng
                        </button>
                      </div>

                      {promoError && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{promoError}</span>
                        </p>
                      )}

                      {/* Dynamic promotion quick chips */}
                      <div className="pt-1">
                        <span className="text-[10px] text-neutral-400 font-medium block mb-1">Mã khả dụng:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {promotions
                            .filter(p => !p.isDeleted && p.status === 'Đang hoạt động')
                            .slice(0, 3)
                            .map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setPromoInput(p.code);
                                  handleApplyPromo(p.code);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold border border-neutral-200 transition-colors cursor-pointer"
                              >
                                <Tag size={9} className="text-neutral-500" />
                                <span>{p.code}</span>
                                <span className="text-neutral-400 font-normal">
                                  ({p.discountType === 'percent' ? `-${p.discountValue}%` : `-${formatPrice(p.discountValue)}`})
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PRICE BREAKDOWN */}
                <div className="space-y-3 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                  
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-bold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Giảm giá mã quà tặng</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển</span>
                    {shippingFee === 0 ? (
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">Miễn phí</span>
                    ) : (
                      <span className="font-bold text-neutral-900">{formatPrice(shippingFee)}</span>
                    )}
                  </div>

                  {subtotal < freeShippingThreshold && (
                    <p className="text-[10px] text-neutral-400 italic">
                      Mua thêm {formatPrice(freeShippingThreshold - subtotal)} để được miễn phí vận chuyển.
                    </p>
                  )}

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-black text-neutral-900 uppercase">Tổng cộng</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-neutral-900 block">
                        {formatPrice(grandTotal)}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">(Đã bao gồm VAT)</span>
                    </div>
                  </div>

                </div>

                {/* CHECKOUT PRIMARY BUTTON */}
                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full h-13 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>THANH TOÁN NGAY</span>
                  <ArrowRight size={16} />
                </button>

                {/* TRUST BADGES */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 font-medium text-center">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-50">
                    <Truck size={15} className="text-black" />
                    <span>Giao hàng nhanh</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-50">
                    <RotateCcw size={15} className="text-black" />
                    <span>Đổi trả 30 ngày</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-50">
                    <ShieldCheck size={15} className="text-black" />
                    <span>100% Chính hãng</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 15. RECOMMENDED PRODUCTS SECTION: "CÓ THỂ BẠN CŨNG THÍCH" */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Gợi ý dành riêng cho bạn</span>
                <h2 className="text-lg sm:text-xl font-black text-neutral-900 uppercase">Có thể bạn cũng thích</h2>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((prod) => {
                const isFav = favorites.some((f) => f.id === prod.id);

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="relative">
                      {/* Favorite button */}
                      <button
                        onClick={() => onToggleFavorite(prod)}
                        className="absolute top-1 right-1 z-10 h-7 w-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-rose-500 shadow-xs transition-colors"
                      >
                        <Heart size={13} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
                      </button>

                      {/* Image */}
                      <div
                        onClick={() => onQuickViewProduct(prod)}
                        className="h-36 sm:h-44 w-full rounded-xl bg-neutral-50 p-2 flex items-center justify-center cursor-pointer overflow-hidden mb-3"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Brand & Name */}
                      <span className="text-[9px] font-black tracking-wider uppercase text-neutral-400">
                        {prod.brand}
                      </span>
                      <h4
                        onClick={() => onQuickViewProduct(prod)}
                        className="text-xs font-bold text-neutral-900 line-clamp-1 cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h4>
                      <p className="text-xs font-black text-neutral-900 mt-1">
                        {formatPrice(prod.price)}
                      </p>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => {
                        const defaultSize = prod.sizes[0] || 40;
                        const defaultColor = prod.colors[0] || { name: 'Standard', hex: '#000000' };
                        onAddToCart(prod, defaultSize, defaultColor, 1);
                        showToast(`Đã thêm ${prod.name} vào giỏ hàng`);
                      }}
                      className="mt-3 w-full py-2 bg-neutral-100 hover:bg-black hover:text-white text-neutral-900 text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Thêm giỏ hàng</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 p-3 lg:hidden shadow-2xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Tổng thanh toán:</span>
            <span className="text-base font-black text-neutral-900">{formatPrice(grandTotal)}</span>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="flex-1 bg-black text-white h-11 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
          >
            <span>THANH TOÁN NGAY</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* SINGLE ITEM DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full z-10 text-center space-y-4 border border-neutral-100"
            >
              <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>

              <div>
                <h3 className="text-base font-black text-neutral-900 uppercase">Xác nhận xóa sản phẩm</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Bạn có chắc muốn xóa <span className="font-bold text-neutral-800">"{itemToDelete.product.name}"</span> (Size {itemToDelete.selectedSize}) khỏi giỏ hàng?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteItem}
                  className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLEAR ALL CART CONFIRMATION MODAL */}
      <AnimatePresence>
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearAllModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full z-10 text-center space-y-4 border border-neutral-100"
            >
              <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>

              <div>
                <h3 className="text-base font-black text-neutral-900 uppercase">Xóa toàn bộ giỏ hàng</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng không?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowClearAllModal(false)}
                  className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmClearAll}
                  className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Xóa tất cả
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE SIZE MODAL */}
      <AnimatePresence>
        {sizeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeModalItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full z-10 space-y-4 border border-neutral-100"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm font-black text-neutral-900 uppercase">Chọn Size Giày Mới</h3>
                <button
                  onClick={() => setSizeModalItem(null)}
                  className="text-neutral-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={sizeModalItem.product.image}
                  alt={sizeModalItem.product.name}
                  className="h-12 w-12 object-contain bg-white border border-neutral-100 rounded-xl p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{sizeModalItem.product.name}</h4>
                  <span className="text-[10px] text-neutral-400 font-semibold">Size hiện tại: {sizeModalItem.selectedSize}</span>
                </div>
              </div>

              {/* Sizes Selection Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Kích cỡ còn hàng:</span>
                <div className="grid grid-cols-4 gap-2">
                  {sizeModalItem.product.sizes.map((sz) => {
                    const isSelected = selectedNewSize === sz;

                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedNewSize(sz)}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white shadow-md'
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-800 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSizeModalItem(null)}
                  className="py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmChangeSize}
                  disabled={!selectedNewSize || selectedNewSize === sizeModalItem.selectedSize}
                  className="py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
