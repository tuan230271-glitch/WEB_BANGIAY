import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, Check, Image as ImageIcon, Video, Filter, Trash2, Edit3, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { Product, Review, Order, UserProfile } from '../types';

interface ProductReviewsSectionProps {
  product: Product;
  reviews: Review[];
  user: UserProfile | null;
  orders: Order[];
  onOpenReviewModal: (existingReview?: Review | null) => void;
  onDeleteReview: (reviewId: string) => void;
  onToggleHelpful: (reviewId: string) => void;
  onToggleHideReview?: (reviewId: string) => void;
}

export default function ProductReviewsSection({
  product,
  reviews,
  user,
  orders,
  onOpenReviewModal,
  onDeleteReview,
  onToggleHelpful,
  onToggleHideReview,
}: ProductReviewsSectionProps) {
  // Filter state: 'all' | '5' | '4' | '3' | '2' | '1' | 'with-images'
  const [starFilter, setStarFilter] = useState<string>('all');
  
  // Image preview modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Delete confirm state
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Filter product specific reviews (only show published/approved reviews)
  const productReviews = useMemo(() => {
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

  // Calculate Rating Statistics
  const stats = useMemo(() => {
    const total = productReviews.length;
    if (total === 0) {
      return {
        avgRating: product.rating || 5,
        totalReviews: product.reviewsCount || 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        withImagesCount: 0,
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let withImagesCount = 0;

    productReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star as 1 | 2 | 3 | 4 | 5] = (counts[star as 1 | 2 | 3 | 4 | 5] || 0) + 1;
      sum += r.rating;
      if (r.images && r.images.length > 0) withImagesCount++;
    });

    const avg = Number((sum / total).toFixed(1));

    return {
      avgRating: avg,
      totalReviews: total,
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
  }, [productReviews, product]);

  // Check if current logged-in user is eligible to review
  const { isEligible, existingUserReview, eligibilityReason } = useMemo(() => {
    if (!user) {
      return {
        isEligible: false,
        existingUserReview: null,
        eligibilityReason: 'Bạn cần đăng nhập và có đơn hàng đã giao để đánh giá sản phẩm.',
      };
    }

    // Check if user has an order with status "Đã giao" or "Đã giao hàng" containing this product
    const hasDeliveredOrder = orders.some((order) => {
      const isDelivered = order.status === 'Đã giao' || order.status === 'Đã giao hàng';
      if (!isDelivered) return false;

      return order.items.some(
        (item) => item.productId === product.id || item.productName === product.name
      );
    });

    const existing = productReviews.find(
      (r) => r.userId === user.id || (user.email && r.name === user.name)
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
        eligibilityReason: 'Bạn cần mua và nhận sản phẩm để có thể đánh giá.',
      };
    }

    return {
      isEligible: true,
      existingUserReview: null,
      eligibilityReason: null,
    };
  }, [user, orders, product, productReviews]);

  // Filtered Review List for display
  const filteredReviews = useMemo(() => {
    return productReviews.filter((r) => {
      // Hide hidden reviews for standard users
      if (r.isHidden && user?.role !== 'admin') return false;

      if (starFilter === 'all') return true;
      if (starFilter === 'with-images') return r.images && r.images.length > 0;
      return Math.round(r.rating) === parseInt(starFilter, 10);
    });
  }, [productReviews, starFilter, user]);

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200/80 space-y-6" id="product-reviews-section">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Star size={22} className="fill-amber-400 text-amber-500" />
            <span>ĐÁNH GIÁ KHÁCH HÀNG</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Tất cả đánh giá đều từ khách hàng đã thực sự mua và trải nghiệm sản phẩm.
          </p>
        </div>

        {/* Action Button / Notice */}
        <div>
          {isEligible ? (
            <button
              onClick={() => onOpenReviewModal(existingUserReview)}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider hover:bg-amber-500 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Star size={15} className="fill-black" />
              <span>{existingUserReview ? 'SỬA ĐÁNH GIÁ CỦA BẠN' : 'VIẾT ĐÁNH GIÁ'}</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-neutral-200/80">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>{eligibilityReason}</span>
            </div>
          )}
        </div>
      </div>

      {/* RATING SUMMARY & STAR BREAKDOWN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-neutral-50/80 rounded-3xl p-6 border border-neutral-200/80">
        
        {/* Left Col (4/12): Average Score Card */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-200/80 space-y-2">
          <span className="text-5xl font-black text-neutral-900">{stats.avgRating}</span>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                className={s <= Math.round(stats.avgRating) ? 'fill-amber-400 text-amber-500' : 'text-neutral-300 fill-neutral-200'}
              />
            ))}
          </div>

          <p className="text-xs font-bold text-neutral-600">
            Dựa trên {stats.totalReviews} đánh giá
          </p>
        </div>

        {/* Right Col (8/12): Progress Bars for 5->1 stars */}
        <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star as 1 | 2 | 3 | 4 | 5];
            const pct = stats.percentages[star as 1 | 2 | 3 | 4 | 5];

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 text-neutral-700 font-bold shrink-0">
                  <span>{star}</span>
                  <Star size={12} className="fill-amber-400 text-amber-500" />
                </div>

                <div className="flex-1 h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-right font-semibold text-neutral-500 shrink-0">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <span className="text-neutral-400 uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter size={12} /> Lọc:
        </span>

        {[
          { id: 'all', label: `Tất cả (${stats.totalReviews})` },
          { id: '5', label: `5 Sao (${stats.counts[5]})` },
          { id: '4', label: `4 Sao (${stats.counts[4]})` },
          { id: '3', label: `3 Sao (${stats.counts[3]})` },
          { id: '2', label: `2 Sao (${stats.counts[2]})` },
          { id: '1', label: `1 Sao (${stats.counts[1]})` },
          { id: 'with-images', label: `Có hình ảnh (${stats.withImagesCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStarFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer ${
              starFilter === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REVIEWS LIST CARDS */}
      {filteredReviews.length === 0 ? (
        <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200/80 text-center space-y-2">
          <p className="text-xs font-bold text-neutral-600">
            Không tìm thấy đánh giá nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const isOwner = user && (rev.userId === user.id || rev.name === user.name);
            const isAdmin = user?.role === 'admin';
            const isHelpfulByUser = user && rev.helpfulUserIds?.includes(user.id || user.email);

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-3xl bg-white border transition-all space-y-3 ${
                  rev.isHidden
                    ? 'border-dashed border-rose-300 opacity-60 bg-rose-50/20'
                    : 'border-neutral-200/80 shadow-xs hover:border-neutral-300'
                }`}
              >
                {/* Review Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="h-10 w-10 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-neutral-900 text-white font-black flex items-center justify-center text-xs shrink-0 uppercase">
                        {rev.name ? rev.name.charAt(0) : 'U'}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-xs font-black text-neutral-900">{rev.name}</h5>
                        
                        {rev.isVerifiedBuyer && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check size={11} className="stroke-[3]" />
                            <span>Đã mua hàng</span>
                          </span>
                        )}

                        {rev.isHidden && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                            [Đã ẩn bởi Admin]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400 font-medium">
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
                            <span>
                              {rev.purchasedSize && `Size: ${rev.purchasedSize}`}
                              {rev.purchasedSize && rev.purchasedColor && ' | '}
                              {rev.purchasedColor && `Màu: ${rev.purchasedColor}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars Display */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(rev.rating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-neutral-200 fill-neutral-100'
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text Content */}
                <p className="text-xs leading-relaxed text-neutral-800 whitespace-pre-line font-normal">
                  {rev.comment}
                </p>

                {/* Attached Images */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rev.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewImage(imgUrl)}
                        className="h-16 w-16 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 hover:opacity-90 transition-opacity cursor-pointer group"
                      >
                        <img src={imgUrl} alt={`Review photo ${i + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Attached Video */}
                {rev.video && (
                  <div className="pt-1 max-w-xs">
                    <video src={rev.video} controls className="rounded-2xl border border-neutral-200 max-h-48 w-full" />
                  </div>
                )}

                {/* Card Footer: Helpful Button & Owner/Admin Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                  {/* Helpful Button */}
                  <button
                    onClick={() => onToggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer text-xs font-bold ${
                      isHelpfulByUser
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <ThumbsUp size={13} className={isHelpfulByUser ? 'fill-emerald-600 text-emerald-700' : ''} />
                    <span>Hữu ích ({rev.helpfulCount || 0})</span>
                  </button>

                  {/* Actions (Edit / Delete / Admin Hide) */}
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <>
                        <button
                          onClick={() => onOpenReviewModal(rev)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => setDeletingReviewId(rev.id)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
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
                            onClick={() => onToggleHideReview(rev.id)}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-1 cursor-pointer"
                          >
                            {rev.isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{rev.isHidden ? 'Hiện' : 'Ẩn'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingReviewId(rev.id)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
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

      {/* FULL-SCREEN IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl"
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 h-9 w-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center cursor-pointer z-10"
              >
                <X size={18} />
              </button>
              <img src={previewImage} alt="Full Review Photo" className="max-h-[85vh] max-w-full object-contain rounded-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingReviewId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
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

    </div>
  );
}
