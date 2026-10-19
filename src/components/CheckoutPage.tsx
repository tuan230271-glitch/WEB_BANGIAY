import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Wallet,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  AlertCircle,
  Clock,
  MapPin,
  Tag,
  QrCode,
  FileText,
  Printer,
  X,
  ExternalLink
} from 'lucide-react';
import { CartItem, Order, OrderItem, Product, Promotion, AppliedPromoInfo, UserProfile, SystemSettings } from '../types';
import { ADMINISTRATIVE_PROVINCES } from '../data/locations';
import { INITIAL_PROMOTIONS } from '../data';
import { DEFAULT_SYSTEM_SETTINGS, mergeSystemSettings } from '../data/defaultSettings';
import { validateAndCalculatePromotion } from '../utils/promotionUtils';

// Reusable Searchable Dropdown for 34 Provinces and Wards/Communes
interface SearchableSelectProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: { id: string; name: string; type?: string }[];
  placeholder: string;
  disabled?: boolean;
  disabledMessage?: string;
  error?: string;
  refInput?: React.RefObject<HTMLButtonElement | null>;
}

function SearchableSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  disabledMessage,
  error,
  refInput
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.name.toLowerCase().includes(query));
  }, [options, searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-bold text-neutral-700 block mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <button
        ref={refInput}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all flex items-center justify-between text-left cursor-pointer ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-200 text-neutral-400'
            : error
            ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-600'
            : isOpen
            ? 'border-black bg-white ring-2 ring-black/5'
            : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/60 text-neutral-900'
        }`}
      >
        <span className={value ? 'font-bold text-neutral-900' : 'text-neutral-400 font-normal'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`} />
      </button>

      {disabled && disabledMessage && (
        <p className="text-[11px] font-medium text-neutral-400 mt-1">{disabledMessage}</p>
      )}

      {error && !disabled && (
        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden p-2 space-y-1"
          >
            {/* Search filter input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Gõ để tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="max-h-56 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-0.5">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = value === opt.name;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChange(opt.name);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white font-bold'
                          : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <span className="truncate">{opt.name}</span>
                      {isSelected && <Check size={14} className="text-white shrink-0 ml-2" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-neutral-400">
                  Không tìm thấy kết quả phù hợp
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  products?: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  onClearCart: () => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'order-success') => void;
  appliedPromoFromCart?: AppliedPromoInfo | null;
  onCompleteOrderSuccess?: (order: Order) => void;
  isOrderSuccessView?: boolean;
  promotions?: Promotion[];
  user?: UserProfile | null;
  orders?: Order[];
  settings?: SystemSettings;
}

export default function CheckoutPage({
  cartItems,
  products = [],
  setProducts,
  onClearCart,
  onNavigate,
  appliedPromoFromCart = null,
  onCompleteOrderSuccess,
  isOrderSuccessView = false,
  promotions: promotionsProp,
  user = null,
  orders = [],
  settings: settingsProp,
}: CheckoutPageProps) {
  // Settings State Fallback with deep merge to guarantee nested bankInfo and shipping config
  const settings = useMemo(() => mergeSystemSettings(DEFAULT_SYSTEM_SETTINGS, settingsProp), [settingsProp]);
  const shippingConfig = settings.shipping;
  const paymentConfig = settings.payment;
  const storeName = settings.storeName || 'K-NICKS';

  // Promotions State Fallback
  const [internalPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('knicks_promotions_v1');
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

  // Form Input States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  
  // Location States
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Shipping & Payment Method States
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking' | 'momo' | 'vnpay' | 'zalopay'>(() => {
    if (paymentConfig?.enableCod) return 'cod';
    if (paymentConfig?.enableBanking) return 'banking';
    if (paymentConfig?.enableMomo) return 'momo';
    if (paymentConfig?.enableVnpay) return 'vnpay';
    if (paymentConfig?.enableZalopay) return 'zalopay';
    return 'cod';
  });
  const [note, setNote] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState(appliedPromoFromCart?.code || '');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromoInfo | null>(appliedPromoFromCart);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Form Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission, Stock & Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  useEffect(() => {
    if (isOrderSuccessView && !createdOrder) {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('knicks_orders') || '[]');
        if (savedOrders.length > 0) {
          setCreatedOrder(savedOrders[0]);
        }
      } catch (e) {
        console.error('Failed to load created order from storage', e);
      }
    }
  }, [isOrderSuccessView, createdOrder]);

  // Input Field Refs for smooth scrolling on validation error
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const provinceSelectRef = useRef<HTMLButtonElement>(null);
  const wardSelectRef = useRef<HTMLButtonElement>(null);
  const addressDetailInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Province change -> Reset ward & errors
  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    setSelectedWard('');
    setErrors((prev) => ({ ...prev, province: '', ward: '', addressGeneral: '' }));
  };

  // Ward change -> Reset ward error
  const handleWardChange = (wardName: string) => {
    setSelectedWard(wardName);
    setErrors((prev) => ({ ...prev, ward: '', addressGeneral: '' }));
  };

  // Quick preset sample address filler
  const handleUsePresetAddress = (preset: 'hcm' | 'hanoi' | 'khanhhoa') => {
    if (preset === 'hcm') {
      setSelectedProvince('Thành phố Hồ Chí Minh');
      setSelectedDistrict('');
      setSelectedWard('Phường Bến Nghé');
      setAddressDetail('72 Lê Thánh Tôn');
    } else if (preset === 'hanoi') {
      setSelectedProvince('Hà Nội');
      setSelectedDistrict('');
      setSelectedWard('Phường Tràng Tiền');
      setAddressDetail('12 Ngô Quyền');
    } else if (preset === 'khanhhoa') {
      setSelectedProvince('Khánh Hòa');
      setSelectedDistrict('');
      setSelectedWard('Phường Nha Trang');
      setAddressDetail('123 đường Trần Phú');
    }
    setErrors({});
  };

  // Find Province Object from 34 Administrative Dataset
  const currentProvinceObj = ADMINISTRATIVE_PROVINCES.find((p) => p.name === selectedProvince);
  const availableWards = currentProvinceObj ? currentProvinceObj.wards : [];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Dynamic Discount Calculation
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

  // Shipping Fee Calculation
  const shippingFee = shippingMethod === 'express'
    ? shippingConfig.expressFee
    : (subtotal >= shippingConfig.freeShippingThreshold || subtotal === 0 ? 0 : shippingConfig.defaultFee);

  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Handle applying promo code in Checkout
  const handleApplyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;

    if (cartItems.length === 0) {
      setPromoError('Giỏ hàng trống!');
      return;
    }

    const result = validateAndCalculatePromotion({
      code,
      cartItems,
      promotions,
      user,
      orders
    });

    if (result.isValid && result.appliedPromo) {
      setAppliedPromo(result.appliedPromo);
      setPromoError(null);
    } else {
      setPromoError(result.errorMessage || 'Mã giảm giá không hợp lệ hoặc không đủ điều kiện áp dụng.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên người nhận.';
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912345678).';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email không đúng định dạng.';
      }
    }

    if (!selectedProvince) {
      newErrors.province = 'Vui lòng chọn Tỉnh / Thành phố.';
    }

    if (!selectedWard) {
      newErrors.ward = 'Vui lòng chọn Xã / Phường / Đặc khu.';
    }

    if (!addressDetail.trim()) {
      newErrors.addressDetail = 'Vui lòng nhập địa chỉ chi tiết (Số nhà, tên đường...).';
    }

    if (!selectedProvince || !selectedWard || !addressDetail.trim()) {
      newErrors.addressGeneral = 'Vui lòng chọn đầy đủ địa chỉ giao hàng.';
    }

    setErrors(newErrors);

    // Scroll to first field with error
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.fullName && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.phone && phoneInputRef.current) {
        phoneInputRef.current.focus();
        phoneInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.email && emailInputRef.current) {
        emailInputRef.current.focus();
        emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.province && provinceSelectRef.current) {
        provinceSelectRef.current.focus();
        provinceSelectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.ward && wardSelectRef.current) {
        wardSelectRef.current.focus();
        wardSelectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.addressDetail && addressDetailInputRef.current) {
        addressDetailInputRef.current.focus();
        addressDetailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  // Submit Order Process
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStockError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // REAL-TIME STOCK CHECK FOR PRODUCT + SIZE
    for (const item of cartItems) {
      const prodInCatalog = products.find((p) => p.id === item.product.id) || item.product;
      const availableStock = prodInCatalog.sizeStock?.[item.selectedSize] ?? 10;

      if (item.quantity > availableStock) {
        setIsSubmitting(false);
        if (availableStock === 0) {
          setStockError(`Sản phẩm "${item.product.name}" (Size ${item.selectedSize}) hiện tại đã HẾT HÀNG.`);
        } else {
          setStockError(`Sản phẩm "${item.product.name}" (Size ${item.selectedSize}) chỉ còn ${availableStock} sản phẩm trong kho, không đủ ${item.quantity} sản phẩm trong giỏ hàng.`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `#SS2026${randomNum}`;

    const selectedProvinceObj = ADMINISTRATIVE_PROVINCES.find((p) => p.name === selectedProvince);
    const selectedWardObj = currentProvinceObj?.wards.find((w) => w.name === selectedWard);

    const provName = selectedProvinceObj?.name || selectedProvince;
    const wName = selectedWardObj?.name || selectedWard;
    const fullAddr = `${addressDetail.trim()}, ${wName}, ${provName}`;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      image: item.product.image,
      brand: item.product.brand,
      size: item.selectedSize,
      colorName: item.selectedColor?.name || 'Standard',
      colorHex: item.selectedColor?.hex || '#000000',
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      recipientName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      provinceId: selectedProvinceObj?.id,
      provinceName: provName,
      wardId: selectedWardObj?.id,
      wardName: wName,
      province: provName,
      district: '',
      ward: wName,
      addressDetail: addressDetail.trim(),
      fullAddress: fullAddr,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      discountCode: appliedPromo?.code,
      promotionId: appliedPromo?.id,
      shippingFee,
      shippingMethod,
      paymentMethod,
      grandTotal,
      note: note.trim() || undefined,
      orderDate: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Chờ xác nhận'
    };

    // Deduct stock in catalog if setProducts is available
    if (setProducts) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const matchedItems = cartItems.filter((ci) => ci.product.id === p.id);
          if (matchedItems.length === 0) return p;

          const updatedStockMap = { ...p.sizeStock };
          p.sizes.forEach((sz) => {
            if (updatedStockMap[sz] === undefined) {
              updatedStockMap[sz] = 10;
            }
          });

          matchedItems.forEach((ci) => {
            const currentSzStock = updatedStockMap[ci.selectedSize] ?? 10;
            updatedStockMap[ci.selectedSize] = Math.max(0, currentSzStock - ci.quantity);
          });

          return {
            ...p,
            sizeStock: updatedStockMap
          };
        })
      );
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedOrder(newOrder);
      
      // Save order into localStorage history
      try {
        const savedOrders = JSON.parse(localStorage.getItem('knicks_orders') || '[]');
        localStorage.setItem('knicks_orders', JSON.stringify([newOrder, ...savedOrders]));
      } catch (err) {
        console.error('Failed to save order history', err);
      }

      // Notify parent & Clear Cart
      if (onCompleteOrderSuccess) {
        onCompleteOrderSuccess(newOrder);
      } else {
        onClearCart();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  // If cart is empty and order is not created yet
  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="min-h-screen bg-neutral-50/50 pt-12 pb-20 px-4 text-center flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs">
          <div className="h-20 w-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            Bạn chưa có sản phẩm nào trong giỏ hàng để tiến hành thanh toán. Vui lòng chọn sản phẩm trước.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="mt-6 w-full py-3.5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  // ORDER SUCCESS VIEW
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-neutral-50/50 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
              <span>Giỏ hàng</span>
            </div>
            <ChevronRight size={14} className="text-neutral-300" />
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
              <span>Thanh toán</span>
            </div>
            <ChevronRight size={14} className="text-neutral-300" />
            <div className="flex items-center gap-1.5 text-black font-black">
              <span className="h-5 w-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">●</span>
              <span>Hoàn tất</span>
            </div>
          </div>

          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-neutral-200/80 text-center space-y-6"
          >
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check size={44} className="stroke-[3]" />
            </div>

            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
                Đã ghi nhận đơn hàng
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                ĐẶT HÀNG THÀNH CÔNG!
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Cảm ơn bạn đã mua sắm tại <span className="font-bold text-black">K-NICKS</span>. Đơn hàng của bạn sẽ sớm được nhân viên liên hệ xác nhận.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 text-left text-xs space-y-3">
              
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                <span className="text-neutral-500 font-medium">Mã đơn hàng:</span>
                <span className="font-black text-black uppercase tracking-wider text-sm">{createdOrder.orderCode}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Thời gian đặt:</span>
                <span className="font-bold text-neutral-800">{createdOrder.orderDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Người nhận:</span>
                <span className="font-bold text-neutral-900">{createdOrder.recipientName} ({createdOrder.phone})</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium shrink-0">Địa chỉ giao:</span>
                <span className="font-bold text-neutral-900 text-right max-w-[280px]">{createdOrder.fullAddress}</span>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-200 pt-2.5">
                <span className="text-neutral-500 font-medium">Phương thức thanh toán:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {createdOrder?.paymentMethod === 'cod'
                    ? 'Thanh toán COD'
                    : createdOrder?.paymentMethod === 'banking'
                    ? 'Chuyển khoản VietQR'
                    : createdOrder?.paymentMethod?.toUpperCase?.() || 'COD'}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-200 pt-2.5">
                <span className="text-sm font-black text-neutral-900 uppercase">Tổng thanh toán:</span>
                <span className="text-lg font-black text-neutral-900">{formatPrice(createdOrder.grandTotal)}</span>
              </div>

            </div>

            {/* Items Purchased List */}
            <div className="text-left bg-white rounded-2xl border border-neutral-200/80 p-4 space-y-2">
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-3">Sản phẩm đã đặt ({createdOrder.items.length})</h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {createdOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs border-b border-neutral-100 last:border-0 pb-2 last:pb-0">
                    <img src={item.image} alt={item.productName} className="h-10 w-10 object-contain rounded-lg bg-white border border-neutral-100 p-1 shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 line-clamp-1">{item.productName}</p>
                      <p className="text-[10px] text-neutral-400">Size {item.size} • Mầu: {item.colorName} • x{item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-neutral-900">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-3.5 rounded-2xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                <span>Xem hóa đơn</span>
              </button>

              <button
                onClick={() => onNavigate('my-orders')}
                className="w-full py-3.5 rounded-2xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Đơn hàng của tôi</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tiếp tục mua sắm</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </motion.div>

        </div>

        {/* PRINTABLE INVOICE MODAL */}
        <AnimatePresence>
          {showInvoiceModal && createdOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInvoiceModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 space-y-5 border border-neutral-200 shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                  <div>
                    <h2 className="text-base font-black text-black tracking-tight flex items-center gap-1.5">
                      <span className="h-6 w-6 rounded-md bg-black text-white flex items-center justify-center text-xs font-black">
                        {storeName.charAt(0)}
                      </span>
                      <span>{storeName} - HÓA ĐƠN</span>
                    </h2>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">Mã đơn: {createdOrder.orderCode}</span>
                  </div>
                  <button onClick={() => setShowInvoiceModal(false)} className="text-neutral-400 hover:text-black">
                    <X size={20} />
                  </button>
                </div>

                <div className="text-xs space-y-3">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <p className="font-bold text-neutral-900 mb-1">Thông tin giao hàng</p>
                    <p className="text-neutral-600"><span className="font-medium">Người nhận:</span> {createdOrder.recipientName} - {createdOrder.phone}</p>
                    {createdOrder.email && <p className="text-neutral-600"><span className="font-medium">Email:</span> {createdOrder.email}</p>}
                    <p className="text-neutral-600"><span className="font-medium">Địa chỉ:</span> {createdOrder.fullAddress}</p>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <div className="bg-neutral-100 px-3 py-2 font-bold text-[11px] text-neutral-700 flex justify-between">
                      <span>Sản phẩm</span>
                      <span>Thành tiền</span>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {createdOrder.items.map((item, i) => (
                        <div key={i} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-neutral-900">{item.productName}</p>
                            <p className="text-[10px] text-neutral-400">Size {item.size} • Slg: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-neutral-900">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-600 pt-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(createdOrder.subtotal)}</span>
                    </div>
                    {createdOrder.discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Giảm giá ({createdOrder.discountCode}):</span>
                        <span>-{formatPrice(createdOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{createdOrder.shippingFee === 0 ? 'Miễn phí' : formatPrice(createdOrder.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-black text-black text-sm border-t border-neutral-200 pt-2">
                      <span>TỔNG CỘNG:</span>
                      <span>{formatPrice(createdOrder.grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800 hover:bg-neutral-50 flex items-center justify-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>In hóa đơn</span>
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // REGULAR CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">Trang chủ</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <button onClick={() => onNavigate('cart')} className="hover:text-black transition-colors">Giỏ hàng</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">Thanh toán</span>
        </nav>

        {/* Header & Trust Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              THANH TOÁN
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 self-start sm:self-auto">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>🔒 Thanh toán an toàn 256-bit SSL</span>
          </div>
        </div>

        {/* Stock Error Alert Banner */}
        {stockError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle size={20} className="text-rose-600 shrink-0" />
              <span className="leading-relaxed">{stockError}</span>
            </div>
            <button
              type="button"
              onClick={() => setStockError(null)}
              className="text-rose-500 hover:text-rose-800 p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}

        {/* CHECKOUT PROGRESS STEPS */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1.5 text-emerald-600 hover:underline cursor-pointer"
          >
            <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
            <span>Giỏ hàng</span>
          </button>
          <ChevronRight size={14} className="text-neutral-300" />
          <div className="flex items-center gap-1.5 text-black font-black">
            <span className="h-5 w-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">●</span>
            <span>Thanh toán</span>
          </div>
          <ChevronRight size={14} className="text-neutral-300" />
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="h-5 w-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-[10px]">○</span>
            <span>Hoàn tất</span>
          </div>
        </div>

        {/* FORM MAIN GRID */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: RECIPIENT, ADDRESS, SHIPPING, PAYMENT (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. RECIPIENT INFORMATION */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-black text-white flex items-center justify-center text-xs">1</span>
                  <span>THÔNG TIN NHẬN HÀNG</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                        : 'border-neutral-200 bg-neutral-50/50 focus:border-black focus:bg-white'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    placeholder="0901234567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                      errors.phone
                        ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                        : 'border-neutral-200 bg-neutral-50/50 focus:border-black focus:bg-white'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Email nhận thông báo đơn hàng <span className="text-neutral-400 font-normal">(Không bắt buộc)</span>
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                    errors.email
                      ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-neutral-200 bg-neutral-50/50 focus:border-black focus:bg-white'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. SHIPPING ADDRESS SECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-black text-white flex items-center justify-center text-xs">2</span>
                  <span>ĐỊA CHỈ GIAO HÀNG</span>
                </h2>

                {/* Quick preset chips */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-neutral-400 font-medium hidden sm:inline">Mẫu địa chỉ:</span>
                  <button
                    type="button"
                    onClick={() => handleUsePresetAddress('hcm')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    TP.HCM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUsePresetAddress('hanoi')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    Hà Nội
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUsePresetAddress('khanhhoa')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-800 transition-colors cursor-pointer"
                  >
                    Khánh Hòa
                  </button>
                </div>
              </div>

              {/* General address validation error message */}
              {errors.addressGeneral && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{errors.addressGeneral}</span>
                </div>
              )}

              {/* Cascading Searchable Dropdowns: Province -> Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Province (34 administrative units) */}
                <SearchableSelect
                  refInput={provinceSelectRef}
                  label="Tỉnh / Thành phố"
                  required
                  value={selectedProvince}
                  placeholder="-- Chọn Tỉnh / Thành phố --"
                  options={ADMINISTRATIVE_PROVINCES}
                  onChange={handleProvinceChange}
                  error={errors.province}
                />

                {/* 2. Ward / Commune / Special Zone */}
                <SearchableSelect
                  refInput={wardSelectRef}
                  label="Xã / Phường / Đặc khu"
                  required
                  value={selectedWard}
                  placeholder={selectedProvince ? "-- Chọn Xã / Phường / Đặc khu --" : "Vui lòng chọn Tỉnh/Thành phố trước"}
                  options={availableWards}
                  onChange={handleWardChange}
                  disabled={!selectedProvince}
                  disabledMessage="Vui lòng chọn Tỉnh / Thành phố trước"
                  error={errors.ward}
                />

              </div>

              {/* Detailed Street / House Address */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Địa chỉ chi tiết <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={addressDetailInputRef}
                  type="text"
                  placeholder="Số nhà, tên đường, tòa nhà, ngõ/ngách..."
                  value={addressDetail}
                  onChange={(e) => {
                    setAddressDetail(e.target.value);
                    if (errors.addressDetail) setErrors((prev) => ({ ...prev, addressDetail: '', addressGeneral: '' }));
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                    errors.addressDetail
                      ? 'border-rose-500 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-neutral-200 bg-neutral-50/50 focus:border-black focus:bg-white'
                  }`}
                />
                {errors.addressDetail && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.addressDetail}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. SHIPPING METHOD SECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
                <span className="h-6 w-6 rounded-lg bg-black text-white flex items-center justify-center text-xs">3</span>
                <span>PHƯƠNG THỨC GIAO HÀNG</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Standard Shipping */}
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    shippingMethod === 'standard'
                      ? 'border-black bg-neutral-50 ring-2 ring-black/5'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-black mt-1"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">Giao hàng tiêu chuẩn</span>
                      <span className="font-extrabold text-emerald-600 uppercase text-[10px]">
                        {subtotal >= shippingConfig.freeShippingThreshold ? 'Miễn phí' : `${shippingConfig.defaultFee.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-[11px] mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      <span>Thời gian nhận: {shippingConfig.estimatedDaysStandard}</span>
                    </p>
                  </div>
                </label>

                {/* Express Shipping (Only if enabled) */}
                {shippingConfig.enableExpress && (
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      shippingMethod === 'express'
                        ? 'border-black bg-neutral-50 ring-2 ring-black/5'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-black mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">Giao hàng hỏa tốc 🚀</span>
                        <span className="font-extrabold text-neutral-900 text-[11px]">{shippingConfig.expressFee.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <p className="text-neutral-500 text-[11px] mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        <span>Thời gian nhận: {shippingConfig.estimatedDaysExpress}</span>
                      </p>
                    </div>
                  </label>
                )}

              </div>
            </div>

            {/* 4. PAYMENT METHOD SECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
                <span className="h-6 w-6 rounded-lg bg-black text-white flex items-center justify-center text-xs">4</span>
                <span>PHƯƠNG THỨC THANH TOÁN</span>
              </h2>

              <div className="space-y-3">
                
                {/* COD Option */}
                {paymentConfig.enableCod && (
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-black bg-neutral-50 ring-2 ring-black/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-black"
                      />
                      <Truck size={20} className="text-neutral-800 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-neutral-900 block">Thanh toán khi nhận hàng (COD)</span>
                        <span className="text-neutral-500 text-[11px]">Thanh toán bằng tiền mặt khi giao hàng và được kiểm tra sản phẩm.</span>
                      </div>
                    </label>
                  </div>
                )}

                {/* Bank Transfer Option */}
                {paymentConfig.enableBanking && (
                  <div
                    onClick={() => setPaymentMethod('banking')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'banking' ? 'border-black bg-neutral-50 ring-2 ring-black/5' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'banking'}
                        onChange={() => setPaymentMethod('banking')}
                        className="accent-black mt-1"
                      />
                      <Building2 size={20} className="text-neutral-800 shrink-0 mt-0.5" />
                      <div className="text-xs flex-1">
                        <span className="font-bold text-neutral-900 block">Chuyển khoản Ngân hàng (VietQR)</span>
                        <span className="text-neutral-500 text-[11px]">Quét mã QR tự động xác nhận chuyển khoản tức thì.</span>

                        {/* Bank Details Banner if selected */}
                        {paymentMethod === 'banking' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3.5 bg-white rounded-xl border border-neutral-200 text-xs space-y-2"
                          >
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                              <QrCode size={16} />
                              <span>Thông tin tài khoản VietQR {storeName}</span>
                            </div>
                            <div className="space-y-1 text-neutral-700 text-[11px] font-medium bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                              <p><span className="text-neutral-400">Ngân hàng:</span> <strong className="text-neutral-900">{paymentConfig?.bankInfo?.bankName || 'Vietcombank (VCB)'}</strong></p>
                              <p><span className="text-neutral-400">Số tài khoản:</span> <strong className="text-neutral-900 font-mono text-xs">{paymentConfig?.bankInfo?.accountNumber || '998822334455'}</strong></p>
                              <p><span className="text-neutral-400">Chủ tài khoản:</span> <strong className="text-neutral-900">{paymentConfig?.bankInfo?.accountName || 'CONG TY TNHH K-NICKS VIET NAM'}</strong></p>
                              <p><span className="text-neutral-400">Cú pháp chuyển khoản:</span> <strong className="text-rose-600 font-mono">{paymentConfig?.bankInfo?.transferSyntax || 'KN [Mã Đơn Hàng] [Số Điện Thoại]'}</strong></p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </label>
                  </div>
                )}

                {/* E-Wallets Option */}
                {(paymentConfig.enableMomo || paymentConfig.enableVnpay || paymentConfig.enableZalopay) && (
                  <div
                    onClick={() => {
                      if (paymentConfig.enableMomo) setPaymentMethod('momo');
                      else if (paymentConfig.enableVnpay) setPaymentMethod('vnpay');
                      else if (paymentConfig.enableZalopay) setPaymentMethod('zalopay');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'momo' || paymentMethod === 'vnpay' || paymentMethod === 'zalopay'
                        ? 'border-black bg-neutral-50 ring-2 ring-black/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'momo' || paymentMethod === 'vnpay' || paymentMethod === 'zalopay'}
                        onChange={() => {
                          if (paymentConfig.enableMomo) setPaymentMethod('momo');
                          else if (paymentConfig.enableVnpay) setPaymentMethod('vnpay');
                          else if (paymentConfig.enableZalopay) setPaymentMethod('zalopay');
                        }}
                        className="accent-black mt-1"
                      />
                      <Wallet size={20} className="text-pink-600 shrink-0 mt-0.5" />
                      <div className="text-xs flex-1">
                        <span className="font-bold text-neutral-900 block">Ví điện tử (MoMo / VNPay / ZaloPay)</span>
                        <span className="text-neutral-500 text-[11px]">Thanh toán tức thì qua ví điện tử tiện lợi.</span>

                        {/* E-wallet choice pills if selected */}
                        {(paymentMethod === 'momo' || paymentMethod === 'vnpay' || paymentMethod === 'zalopay') && (
                          <div className="mt-3 flex gap-2">
                            {paymentConfig.enableMomo && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPaymentMethod('momo'); }}
                                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                  paymentMethod === 'momo' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-neutral-200 bg-white text-neutral-600'
                                }`}
                              >
                                Ví MoMo
                              </button>
                            )}
                            {paymentConfig.enableVnpay && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPaymentMethod('vnpay'); }}
                                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                  paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-neutral-200 bg-white text-neutral-600'
                                }`}
                              >
                                VNPay QR
                              </button>
                            )}
                            {paymentConfig.enableZalopay && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPaymentMethod('zalopay'); }}
                                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                                  paymentMethod === 'zalopay' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-white text-neutral-600'
                                }`}
                              >
                                ZaloPay
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                )}

              </div>
            </div>

            {/* 5. ORDER NOTE SECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-3">
              <h2 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} />
                <span>GHI CHÚ ĐƠN HÀNG (TÙY CHỌN)</span>
              </h2>
              <textarea
                rows={2}
                placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao 15 phút..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 p-3.5 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY CARD (col-span-5) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-5">
              
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                  ĐƠN HÀNG CỦA BẠN ({cartItems.length})
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Chỉnh sửa giỏ hàng
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-neutral-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 object-contain bg-white rounded-xl p-1 shrink-0 border border-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-900 line-clamp-1">{item.product.name}</h4>
                      <div className="text-[10px] text-neutral-500 font-semibold mt-0.5 space-x-2">
                        <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                        {item.selectedColor && <span>Màu: <strong className="text-black">{item.selectedColor.name}</strong></span>}
                        <span>Số lượng: <strong className="text-black">x{item.quantity}</strong></span>
                      </div>
                    </div>
                    <span className="font-black text-neutral-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* PROMO CODE BOX */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <label className="text-xs font-bold text-neutral-700 block">Mã ưu đãi / Giảm giá</label>
                {appliedPromo ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600" />
                      <span className="font-bold text-emerald-900">{appliedPromo.code}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">(-{formatPrice(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-bold text-emerald-800 hover:text-rose-600 underline cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mã giảm giá..."
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[11px] font-semibold text-rose-500 mt-1">{promoError}</p>}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-bold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Mã giảm giá ({appliedPromo.code})</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển ({shippingMethod === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn'})</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600 uppercase text-[10px]">Miễn phí</strong>
                    ) : (
                      <strong className="text-neutral-900">{formatPrice(shippingFee)}</strong>
                    )}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3.5 flex justify-between items-baseline">
                  <span className="text-sm font-black text-neutral-900 uppercase">TỔNG THANH TOÁN</span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-neutral-900 block">
                      {formatPrice(grandTotal)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">(Đã bao gồm VAT)</span>
                  </div>
                </div>
              </div>

              {/* SUBMIT ORDER BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-black text-white font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>Đang xử lý đơn hàng...</span>
                  </div>
                ) : (
                  <>
                    <Check size={18} />
                    <span>ĐẶT HÀNG • {formatPrice(grandTotal)}</span>
                  </>
                )}
              </button>

              {/* Back to Cart link */}
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="w-full py-2 text-center text-xs font-bold text-neutral-500 hover:text-black flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quay lại giỏ hàng</span>
              </button>

            </div>

          </div>

        </form>

      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE CHECKOUT */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 p-3 lg:hidden shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Tổng cộng:</span>
          <span className="text-base font-black text-neutral-900">{formatPrice(grandTotal)}</span>
        </div>

        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="flex-1 bg-black text-white h-11 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Xử lý...</span>
          ) : (
            <>
              <span>XÁC NHẬN ĐẶT HÀNG</span>
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
