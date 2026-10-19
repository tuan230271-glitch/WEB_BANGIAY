import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Eye,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Home,
  Check,
  X,
  Star,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';

interface WishlistPageProps {
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onClearAllFavorites: () => void;
  onQuickViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, quantity: number) => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist') => void;
  showNotification: (message: string, action?: { label: string; onClick: () => void }) => void;
}

export default function WishlistPage({
  favorites,
  onRemoveFavorite,
  onClearAllFavorites,
  onQuickViewProduct,
  onAddToCart,
  onNavigate,
  showNotification
}: WishlistPageProps) {
  // Modal for Clear All Confirmation
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Quick Size Selection Modal for "THÊM VÀO GIỎ"
  const [sizeSelectProduct, setSizeSelectProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleOpenSizeSelect = (product: Product) => {
    setSizeSelectProduct(product);
    setSelectedSize(product.sizes[0] || 40);
    setSelectedColor(product.colors[0] || { name: 'Đen', hex: '#000000' });
  };

  const handleConfirmAddToCart = () => {
    if (!sizeSelectProduct || !selectedSize || !selectedColor) return;

    onAddToCart(sizeSelectProduct, selectedSize, selectedColor, 1);
    showNotification(`Đã thêm "${sizeSelectProduct.name}" (Size ${selectedSize}) vào giỏ hàng!`);
    setSizeSelectProduct(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer"
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </button>
          <ChevronRight size={12} className="text-neutral-400" />
          <button
            onClick={() => onNavigate('profile')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Tài khoản
          </button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-neutral-900">Yêu thích</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Heart size={16} className="fill-rose-500" />
              </span>
              <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                DANH SÁCH LƯU
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-neutral-900 uppercase tracking-tight">
              SẢN PHẨM YÊU THÍCH
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-1 font-light">
              Những sản phẩm bạn đã lưu để xem lại sau.
            </p>
          </div>

          {/* Action Bar / Stats */}
          {favorites.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-neutral-100 border border-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-800">
                Bạn có <span className="text-rose-600 font-extrabold">{favorites.length}</span> sản phẩm yêu thích
              </span>

              <button
                onClick={() => setShowClearConfirmModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-bold text-neutral-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shadow-xs"
                id="clear-all-wishlist-btn"
              >
                <Trash2 size={13} />
                <span>XÓA TẤT CẢ</span>
              </button>
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        {favorites.length === 0 ? (
          /* Empty Wishlist State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-12 rounded-[32px] border border-neutral-200/80 bg-white p-10 md:p-16 text-center shadow-xs max-w-2xl mx-auto"
            id="empty-wishlist-container"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50 text-neutral-300 border border-neutral-100 mb-6">
              <Heart size={40} className="text-neutral-300" />
            </div>

            <h2 className="text-xl md:text-2xl font-black text-neutral-900 uppercase tracking-tight">
              Danh sách yêu thích đang trống
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 mt-2 font-light max-w-md mx-auto leading-relaxed">
              Hãy lưu những đôi giày bạn yêu thích để dễ dàng tìm lại và sở hữu sau nhé!
            </p>

            <button
              onClick={() => onNavigate('products')}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-black px-8 py-4 text-xs font-black text-white uppercase tracking-wider hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              id="explore-products-empty-btn"
            >
              <ShoppingBag size={16} />
              <span>KHÁM PHÁ SẢN PHẨM</span>
            </button>
          </motion.div>
        ) : (
          /* Product Grid: 4 cols desktop, 2-3 tablet, 2 mobile */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {favorites.map((product) => {
                const hasDiscount = !!product.originalPrice;
                const isOutOfStock = !product.sizes || product.sizes.length === 0;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col justify-between rounded-[24px] border border-neutral-200/80 bg-white p-3.5 md:p-4 shadow-xs hover:border-neutral-300 hover:shadow-xl transition-all duration-300"
                    id={`wishlist-card-${product.id}`}
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white p-3 flex items-center justify-center">
                      
                      {/* Out of stock badge */}
                      {isOutOfStock ? (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                            HẾT HÀNG
                          </span>
                        </div>
                      ) : (
                        hasDiscount && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                              GIẢM {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                            </span>
                          </div>
                        )
                      )}

                      {/* Remove Favorite Button (Heart filled) */}
                      <button
                        onClick={() => {
                          onRemoveFavorite(product);
                          showNotification(`Đã xóa "${product.name}" khỏi danh sách yêu thích.`, {
                            label: 'Hoàn tác',
                            onClick: () => {
                              // Undo action handled by App
                            }
                          });
                        }}
                        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm border border-neutral-100 hover:bg-rose-50 hover:scale-110 transition-all cursor-pointer"
                        title="Xóa khỏi danh sách yêu thích"
                        id={`remove-fav-${product.id}`}
                      >
                        <Heart size={18} className="fill-rose-500 text-rose-500" />
                      </button>

                      {/* Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 ${
                          isOutOfStock ? 'opacity-50 grayscale' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />

                      {/* Brand Label */}
                      <span className="absolute bottom-2 left-3 text-[10px] font-bold text-neutral-400 uppercase">
                        {product.brand}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="mt-3.5 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-bold text-neutral-700">{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="mt-1 text-xs md:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-black">
                        {product.name}
                      </h3>

                      {/* Price & Stock status */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-neutral-900">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatPrice(product.originalPrice!)}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span className={`text-[10px] font-bold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                        </span>
                      </div>

                      {/* Actions Row */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
                        {/* 1. XEM CHI TIẾT */}
                        <button
                          onClick={() => onQuickViewProduct(product)}
                          className="flex h-10 items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white text-[11px] font-bold text-neutral-800 hover:border-black hover:bg-neutral-50 transition-all cursor-pointer"
                          id={`wishlist-view-detail-${product.id}`}
                        >
                          <Eye size={13} />
                          <span className="truncate">CHI TIẾT</span>
                        </button>

                        {/* 2. THÊM VÀO GIỎ */}
                        <button
                          onClick={() => handleOpenSizeSelect(product)}
                          disabled={isOutOfStock}
                          className={`flex h-10 items-center justify-center gap-1 rounded-xl text-[11px] font-bold transition-all ${
                            isOutOfStock
                              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                              : 'bg-black text-white hover:bg-neutral-800 shadow-sm hover:shadow-md cursor-pointer'
                          }`}
                          id={`wishlist-add-cart-${product.id}`}
                        >
                          <ShoppingBag size={13} />
                          <span className="truncate">THÊM GIỎ</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* ================= MODAL: QUICK SIZE SELECTION ================= */}
      <AnimatePresence>
        {sizeSelectProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeSelectProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl space-y-5"
              id="size-select-modal"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase">
                      CHỌN SIZE GIÀY
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      {sizeSelectProduct.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSizeSelectProduct(null)}
                  className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <img
                  src={sizeSelectProduct.image}
                  alt={sizeSelectProduct.name}
                  className="h-14 w-14 object-contain rounded-xl bg-white p-1"
                />
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{sizeSelectProduct.brand}</span>
                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{sizeSelectProduct.name}</h4>
                  <p className="text-xs font-black text-neutral-900 mt-0.5">{formatPrice(sizeSelectProduct.price)}</p>
                </div>
              </div>

              {/* Size grid selection (36 37 38 39 40 41 42 43 44) */}
              <div>
                <label className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider block mb-2">
                  Kích cỡ có sẵn (EU)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44].map((size) => {
                    const isAvailable = sizeSelectProduct.sizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-11 items-center justify-center rounded-xl text-xs font-black transition-all ${
                          !isAvailable
                            ? 'bg-neutral-100 text-neutral-300 border border-neutral-100 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-black text-white border-2 border-black shadow-md scale-105 cursor-pointer'
                            : 'bg-white text-neutral-800 border border-neutral-200 hover:border-black cursor-pointer'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color selection if available */}
              {sizeSelectProduct.colors.length > 0 && (
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider block mb-2">
                    Màu sắc
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizeSelectProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          selectedColor?.name === color.name
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={handleConfirmAddToCart}
                  disabled={!selectedSize}
                  className="w-full py-4 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  id="confirm-size-add-cart-btn"
                >
                  <ShoppingBag size={16} />
                  <span>XÁC NHẬN THÊM VÀO GIỎ</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: CLEAR ALL CONFIRMATION ================= */}
      <AnimatePresence>
        {showClearConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm rounded-[28px] bg-white p-6 text-center space-y-4 shadow-2xl"
              id="clear-all-confirm-modal"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-neutral-900 uppercase">
                  XÁC NHẬN XÓA TẤT CẢ
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                  Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowClearConfirmModal(false)}
                  className="py-3.5 rounded-2xl bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  HỦY
                </button>

                <button
                  onClick={() => {
                    onClearAllFavorites();
                    setShowClearConfirmModal(false);
                    showNotification('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích.');
                  }}
                  className="py-3.5 rounded-2xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-all cursor-pointer shadow-md"
                  id="confirm-clear-all-btn"
                >
                  XÓA TẤT CẢ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
