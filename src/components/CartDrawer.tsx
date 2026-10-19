import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, CreditCard, Tag } from 'lucide-react';
import { CartItem, Promotion, AppliedPromoInfo, UserProfile, Order, SystemSettings } from '../types';
import { INITIAL_PROMOTIONS } from '../data';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSettings';
import { validateAndCalculatePromotion } from '../utils/promotionUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate?: (view: 'home' | 'products' | 'cart' | 'checkout') => void;
  promotions?: Promotion[];
  user?: UserProfile | null;
  orders?: Order[];
  appliedPromo?: AppliedPromoInfo | null;
  onApplyPromo?: (promo: AppliedPromoInfo | null) => void;
  settings?: SystemSettings;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  promotions: promotionsProp,
  user = null,
  orders = [],
  appliedPromo: externalAppliedPromo = null,
  onApplyPromo: externalOnApplyPromo,
  settings: settingsProp
}: CartDrawerProps) {
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

  const [promoCode, setPromoCode] = useState('');
  const [localAppliedPromo, setLocalAppliedPromo] = useState<AppliedPromoInfo | null>(null);
  const [promoError, setPromoError] = useState('');

  const appliedPromo = externalAppliedPromo !== undefined && externalAppliedPromo !== null ? externalAppliedPromo : localAppliedPromo;

  const setAppliedPromo = (promo: AppliedPromoInfo | null) => {
    setLocalAppliedPromo(promo);
    if (externalOnApplyPromo) {
      externalOnApplyPromo(promo);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : defaultShippingFee;

  // Calculate discount using promotion engine
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

  const applyPromo = (codeOverride?: string) => {
    const targetCode = (codeOverride || promoCode).trim();
    if (!targetCode) return;

    if (cartItems.length === 0) {
      setPromoError('Giỏ hàng trống!');
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
      setPromoError('');
    } else {
      setPromoError(result.errorMessage || 'Mã không hợp lệ!');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleCheckout = () => {
    onClose();
    if (onNavigate) {
      onNavigate('checkout');
    }
  };

  const resetAll = () => {
    onClearCart();
    setPromoCode('');
    setAppliedPromo(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="flex w-screen max-w-md flex-col bg-white shadow-2xl"
              id="cart-drawer-panel"
            >
              {/* Header */}
                  <div className="flex items-center justify-between border-b border-neutral-100 p-6">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={20} className="text-black" />
                      <h2 className="text-lg font-black text-neutral-900 uppercase">Giỏ hàng của bạn</h2>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-800">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                      </span>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Body / Item List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {cartItems.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-neutral-50 p-6 text-neutral-300">
                          <ShoppingBag size={48} />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-neutral-800">Giỏ hàng trống</h3>
                        <p className="mt-2 text-sm text-neutral-400 max-w-xs">
                          Chưa có sản phẩm nào trong giỏ hàng. Hãy lướt xem các bộ sưu tập cao cấp của chúng tôi để chọn đôi giày ưng ý nhé!
                        </p>
                        <button
                          onClick={onClose}
                          className="mt-6 rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
                        >
                          Tiếp tục mua sắm
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-3 hover:border-neutral-200 transition-all duration-200"
                        >
                          {/* Image */}
                          <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-white border border-neutral-100 p-1 flex items-center justify-center">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 pr-1">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-neutral-400 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              <span className="text-[11px] font-semibold text-neutral-400 uppercase">
                                {item.product.brand} • Size {item.selectedSize}
                              </span>

                              {/* Color specs */}
                              <div className="mt-1 flex items-center gap-1.5">
                                <span
                                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span className="text-[10px] text-neutral-500 font-medium">
                                  {item.selectedColor.name}
                                </span>
                              </div>
                            </div>

                            {/* Qty and price */}
                            <div className="flex items-center justify-between mt-2">
                              {/* Qty Selector */}
                              <div className="flex items-center gap-2 border border-neutral-200 rounded-lg bg-neutral-50 p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="h-5 w-5 rounded-md hover:bg-neutral-200 text-neutral-600 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold text-neutral-900">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="h-5 w-5 rounded-md hover:bg-neutral-200 text-neutral-600 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-xs font-extrabold text-neutral-900">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer checkout details */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-neutral-100 bg-neutral-50/50 p-6 space-y-4">
                      {/* Promo Code Input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <label className="font-bold text-neutral-700">Mã Khuyến Mãi</label>
                          <span className="text-neutral-400 font-semibold text-[10px]">Nhập mã ưu đãi</span>
                        </div>
                        {appliedPromo ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Check size={14} className="text-emerald-600 shrink-0" />
                              <div>
                                <p className="font-black text-emerald-950 text-[11px] leading-tight">
                                  {appliedPromo.code} {appliedPromo.name && `(${appliedPromo.name})`}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-bold">
                                  Giảm {formatPrice(discountAmount)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={removePromo}
                              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Ví dụ: SOLE10"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                                className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black"
                              />
                              <button
                                onClick={() => applyPromo()}
                                disabled={!promoCode.trim()}
                                className="rounded-xl px-4 text-xs font-bold text-white transition-colors bg-black hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                              >
                                Áp dụng
                              </button>
                            </div>
                            {promoError && (
                              <p className="text-[10px] font-semibold text-rose-500">{promoError}</p>
                            )}
                          </>
                        )}
                      </div>

                      {/* Cost Summary */}
                      <div className="space-y-2 border-t border-dashed border-neutral-200 pt-3 text-xs text-neutral-600">
                        <div className="flex justify-between">
                          <span>Tạm tính</span>
                          <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí vận chuyển</span>
                          <span>
                            {shippingFee === 0 ? (
                              <span className="font-bold text-emerald-600 uppercase text-[10px]">Miễn phí</span>
                            ) : (
                              formatPrice(shippingFee)
                            )}
                          </span>
                        </div>
                        {appliedPromo && discountAmount > 0 && (
                          <div className="flex justify-between text-rose-600">
                            <span>Giảm giá ({appliedPromo.code})</span>
                            <span>-{formatPrice(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm font-black text-neutral-950">
                          <span>Tổng cộng</span>
                          <span className="text-base font-extrabold">{formatPrice(total)}</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleCheckout}
                        className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-black font-black text-xs text-white uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer active:scale-95"
                      >
                        <CreditCard size={15} />
                        <span>THANH TOÁN NGAY ({formatPrice(total)})</span>
                        <ArrowRight size={14} />
                      </button>

                      {/* View full cart page button */}
                      <button
                        onClick={() => {
                          onClose();
                          if (onNavigate) onNavigate('cart');
                        }}
                        className="w-full text-center text-xs font-bold text-neutral-500 hover:text-black cursor-pointer pt-1"
                      >
                        Xem chi tiết giỏ hàng →
                      </button>
                    </div>
                  )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
