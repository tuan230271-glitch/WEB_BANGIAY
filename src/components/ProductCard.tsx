import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { PRODUCTS } from '../data';
import { useLanguage } from '../utils/translations';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

// Helper to pick clean product image without ad banners
const getCleanProductImage = (product: Product): string => {
  if (!product.images || product.images.length <= 1) {
    return product.image;
  }

  const isAdTextImg = (url: string): boolean => {
    const lower = url.toLowerCase();
    return (
      lower.includes('new-arrival') ||
      lower.includes('new_arrival') ||
      lower.includes('badge') ||
      lower.includes('promo') ||
      lower.includes('banner') ||
      lower.includes('moi_') ||
      lower.includes('-moi-') ||
      lower.includes('text_')
    );
  };

  if (isAdTextImg(product.image)) {
    const cleanImg = product.images.find(img => !isAdTextImg(img));
    if (cleanImg) return cleanImg;
  }

  return product.image;
};

// Helper to determine if a product is in stock
const isProductInStock = (product: Product): boolean => {
  if (product.id === 'nike-phantom-gx' || product.id === 'puma-velocity-nitro') {
    return false;
  }
  if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
    return false;
  }
  return true;
};

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState<ProductColor | null>(null);

  // Master catalog product lookup
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

  // Combine product.colors with master catalog colors so color.image / color.images are always guaranteed
  // ONLY for shoes; accessories have no color options
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

  const isStock = isProductInStock(product);
  const cleanImage = getCleanProductImage(product);
  const cardImage = activeColor?.image || cleanImage;

  // Format currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const hasDiscount = !!product.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Dynamic brand colors for highlight/border effects
  const getBrandBadgeClass = () => {
    switch (product.brand) {
      case 'Nike':
        return 'bg-[#FF5400] text-white';
      case 'Adidas':
        return 'bg-[#007BC4] text-white';
      case 'Puma':
        return 'bg-[#BA0C2F] text-white';
      case 'Converse':
        return 'bg-black text-white';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-neutral-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-card-${product.id}`}
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-4 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%] pointer-events-none">
          {!isStock && (
            <span className="rounded-full bg-neutral-950 text-white px-2 py-0.5 text-[10px] font-black tracking-wider uppercase shadow-xs whitespace-nowrap">
              {t.soldOut}
            </span>
          )}
          {product.isHot && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black tracking-wider text-black uppercase shadow-xs whitespace-nowrap">
              HOT
            </span>
          )}
          {product.isPromotion && (
            <span className="rounded-full bg-[#BA0C2F] px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs whitespace-nowrap">
              {hasDiscount && discountPercentage > 0
                ? (language === 'en' ? `${discountPercentage}% OFF` : `GIẢM ${discountPercentage}%`)
                : (language === 'en' ? 'PROMO' : 'KM')}
            </span>
          )}
          {!product.isPromotion && hasDiscount && discountPercentage > 0 && (
            <span className="rounded-full bg-[#BA0C2F] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase whitespace-nowrap">
              {language === 'en' ? `${discountPercentage}% OFF` : `GIẢM ${discountPercentage}%`}
            </span>
          )}
          {product.isNew && !product.isHot && !product.isPromotion && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase whitespace-nowrap">
              NEW
            </span>
          )}
        </div>

        {/* Favorite & QuickView Buttons (Floating overlays) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => onToggleFavorite(product)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-100 shadow-sm transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-100 scale-110'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-black'
            }`}
            id={`fav-btn-${product.id}`}
            title={t.addToWishlist}
          >
            <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
          </button>

          <button
            onClick={() => onQuickView(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-600 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:text-black opacity-0 group-hover:opacity-100 focus:opacity-100 max-md:opacity-100"
            id={`quick-view-btn-${product.id}`}
            title={t.quickView}
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Shoe Image */}
        <div 
          onClick={() => onQuickView(product)}
          className={`cursor-pointer h-full w-full flex items-center justify-center ${!isStock ? 'opacity-75' : ''}`}
        >
          <img
            src={cardImage}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col flex-grow">
        {/* Brand and category */}
        <div className="flex items-center justify-between min-h-[20px]">
          {product.brand && product.brand.trim() !== '' ? (
            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBrandBadgeClass()}`}>
              {product.brand}
            </span>
          ) : (
            <span />
          )}
          {/* Rating */}
          <div className="flex items-center gap-1 ml-auto">
            <Star className="fill-amber-400 text-amber-400" size={13} />
            <span className="text-xs font-semibold text-neutral-700">{product.rating}</span>
            <span className="text-[10px] text-neutral-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onQuickView(product)}
          className="mt-2 text-[15px] font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[40px] cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Available Colors bar - only shown for products with colors (shoes) */}
        {effectiveColors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {effectiveColors.map((c, idx) => {
              const isSelected = (activeColor?.name || effectiveColors[0]?.name) === c.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(c);
                  }}
                  onMouseEnter={() => {
                    if (c.image) setActiveColor(c);
                  }}
                  className={`h-3 w-3 rounded-full border shadow-xs transition-all cursor-pointer ${
                    isSelected ? 'scale-125 ring-2 ring-black ring-offset-1 z-10' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Chọn màu ${c.name}`}
                />
              );
            })}
          </div>
        )}

        {/* Price & Action Button Row */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 gap-1.5">
          <div className="flex flex-col min-w-0 pr-1">
            {hasDiscount && (
              <span className="text-[11px] text-neutral-400 line-through whitespace-nowrap truncate">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 whitespace-nowrap truncate">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => {
              if (!isStock) return;
              onAddToCart(product, product.sizes?.[0] || 0, activeColor || effectiveColors[0] || { name: 'Mặc định', hex: '#111111' });
            }}
            disabled={!isStock}
            className={`flex h-9 sm:h-10 items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-bold transition-all duration-300 focus:outline-none shrink-0 whitespace-nowrap select-none ${
              isStock
                ? 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg cursor-pointer'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
            id={`add-cart-btn-${product.id}`}
            title={isStock ? (language === 'en' ? 'Add to Cart' : 'Thêm vào giỏ') : t.soldOut}
          >
            <ShoppingBag size={13} className="shrink-0" />
            <span className="whitespace-nowrap">{isStock ? t.add : t.soldOut}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
