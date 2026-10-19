import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, Heart, Shield, Check, Minus, Plus } from 'lucide-react';
import { Product, ProductColor, Review, Order, UserProfile } from '../types';
import { PRODUCTS } from '../data';
import ProductReviewsSection from './ProductReviewsSection';
import ProductImageGallery from './ProductImageGallery';
import { useLanguage } from '../utils/translations';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: number, color: ProductColor, qty: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onViewFullDetail?: (product: Product) => void;
  reviews?: Review[];
  user?: UserProfile | null;
  orders?: Order[];
  onOpenReviewModal?: (existingReview?: Review | null) => void;
  onDeleteReview?: (reviewId: string) => void;
  onToggleHelpful?: (reviewId: string) => void;
  onToggleHideReview?: (reviewId: string) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onViewFullDetail,
  reviews = [],
  user = null,
  orders = [],
  onOpenReviewModal,
  onDeleteReview,
  onToggleHelpful,
  onToggleHideReview,
}: QuickViewModalProps) {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const hasSizes = !!(product?.sizes && product.sizes.length > 0);

  // Master catalog product lookup (ensures up-to-date color images even if product in state was restored from old localStorage)
  const masterProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === product?.id || p.name === product?.name);
  }, [product]);

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

    const rawColors = (product?.colors && product.colors.length > 0)
      ? product.colors
      : (masterProduct?.colors || []);

    return rawColors.map((c) => {
      if (c.image || (c.images && c.images.length > 0)) {
        return c;
      }
      const matchInMaster = masterProduct?.colors?.find(
        (mc) => mc.name.trim().toLowerCase() === c.name.trim().toLowerCase()
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
      setSelectedSize(prodHasSizes ? (product.sizes[1] || product.sizes[0]) : null);
      const defaultColor = !isAccessory ? (effectiveColors[0] || product.colors?.[0] || null) : null;
      setSelectedColor(defaultColor);
      setQuantity(1);
      setSuccessMsg(null);
    }
  }, [product, effectiveColors, isAccessory]);

  // Active selected color with full image metadata
  const activeColor = useMemo(() => {
    if (!selectedColor) return effectiveColors[0] || null;
    const match = effectiveColors.find(
      (c) => c.name.trim().toLowerCase() === selectedColor.name.trim().toLowerCase()
    );
    return match || selectedColor;
  }, [selectedColor, effectiveColors]);

  if (!product) return null;

  const currentMainImage = activeColor?.image || product.image;
  const currentImages = (activeColor?.images && activeColor.images.length > 0)
    ? activeColor.images
    : (masterProduct?.images || product.images || [product.image]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const hasDiscount = !!product.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) return;
    const colorToUse = selectedColor || product.colors?.[0] || { name: 'Mặc định', hex: '#111111' };
    const sizeToUse = hasSizes ? (selectedSize || 0) : 0;
    onAddToCart(product, sizeToUse, colorToUse, quantity);
    
    const unitStr = hasSizes ? (language === 'en' ? 'pair(s)' : 'đôi') : (language === 'en' ? 'item(s)' : 'sản phẩm');
    setSuccessMsg(language === 'en' ? `Added ${quantity} ${unitStr} to cart successfully!` : `Đã thêm ${quantity} ${unitStr} vào giỏ hàng thành công!`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const getBrandLogo = (brand: string) => {
    switch (brand) {
      case 'Nike': return '⚡';
      case 'Adidas': return '⚚';
      case 'Puma': return '🐾';
      case 'Converse': return '★';
      default: return '👟';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            id="modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl md:h-auto md:flex-row"
            id="quickview-modal-container"
          >
            {/* Left side: Premium Image Gallery */}
            <div className="relative flex flex-1 flex-col items-center justify-center bg-white border-b md:border-b-0 md:border-r border-neutral-100 p-4 sm:p-6 md:p-8 overflow-y-auto">
              {/* Brand Watermark Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <span className="text-[180px] font-extrabold">{product.brand || product.category}</span>
              </div>

              {/* Close Button Mobile */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm md:hidden"
              >
                <X size={20} />
              </button>

              <ProductImageGallery
                images={currentImages}
                mainImage={currentMainImage}
                selectedColor={activeColor}
                productName={product.name}
                badges={
                  <>
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
                      <span className="rounded-full bg-[#BA0C2F] px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-xs">
                        GIẢM {discountPercentage}%
                      </span>
                    )}
                    {product.isNew && !product.isHot && !product.isPromotion && (
                      <span className="rounded-full bg-black px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-xs">
                        MỚI RA MẮT
                      </span>
                    )}
                  </>
                }
                className="w-full"
              />
            </div>

            {/* Right side: Product Options & Actions */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
              {/* Close Button Desktop */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-black md:flex"
                id="close-modal-desktop"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div>
                <div className="flex items-center gap-2">
                  {product.brand && product.brand.trim() !== '' ? (
                    <>
                      <span className="text-xl">{getBrandLogo(product.brand)}</span>
                      <span className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
                        {product.brand} • {product.category}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
                      {product.category}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
                  {product.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-200'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-neutral-700">{product.rating}</span>
                  <span className="text-xs text-neutral-400">({product.reviewsCount} {t.reviewsFromUsers})</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="mt-5 flex items-baseline gap-3 rounded-2xl bg-neutral-50 p-4">
                <span className="text-2xl font-black text-neutral-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-5 text-sm leading-relaxed text-neutral-600">
                {product.description}
              </p>

              {/* Options selection */}
              <div className="mt-6 space-y-5">
                {/* Size Choice - Only shown if product has sizes */}
                {hasSizes && (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">{t.selectSize}</span>
                      <span className="text-xs text-neutral-500 underline cursor-pointer hover:text-black">{t.sizeGuide}</span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-6 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-black bg-black text-white scale-105'
                              : 'border-neutral-200 bg-white text-neutral-800 hover:border-black hover:bg-neutral-50'
                          }`}
                          id={`size-${size}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Choice - only shown for products with colors (shoes) */}
                {effectiveColors.length > 0 && (
                  <div>
                    <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">{t.selectColor}</span>
                    <div className="mt-2.5 flex flex-wrap gap-3">
                      {effectiveColors.map((color) => {
                        const isSelected = activeColor?.name.trim().toLowerCase() === color.name.trim().toLowerCase();
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-black bg-black text-white'
                                : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                            }`}
                            id={`color-${color.name}`}
                          >
                            <span
                              className="h-3 w-3 rounded-full border border-black/10"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            {isSelected && <Check size={12} className="ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Block */}
                <div>
                  <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">{t.quantity}</span>
                  <div className="mt-2 flex h-11 w-32 items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-200 text-neutral-700"
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-extrabold text-neutral-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-200 text-neutral-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Buy actions */}
              <div className="mt-8 flex gap-3 pb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!!successMsg}
                  className={`flex flex-1 h-13 items-center justify-center gap-2 rounded-2xl bg-black font-bold text-white shadow-lg transition-all duration-300 hover:bg-neutral-800 ${
                    successMsg ? 'bg-emerald-600 hover:bg-emerald-600 scale-[0.98]' : ''
                  }`}
                  id="add-to-cart-confirm"
                >
                  <ShoppingCart size={18} />
                  <span>{successMsg || t.addToCartModal}</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`flex h-13 w-13 items-center justify-center rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 border-rose-100 scale-105'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-black hover:border-black'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-4 flex items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-200 p-3 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <Shield size={14} className="text-emerald-600" />
                  <span>{t.authenticGuarantee}</span>
                </div>
                <div className="h-4 w-px bg-neutral-200" />
                <span>{t.returnGuarantee}</span>
              </div>

              {/* View Full Product Detail Page Button */}
              {onViewFullDetail && (
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewFullDetail(product);
                    }}
                    className="w-full py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{t.viewProductDetail}</span>
                    <Star size={14} className="fill-amber-400 text-amber-500" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
