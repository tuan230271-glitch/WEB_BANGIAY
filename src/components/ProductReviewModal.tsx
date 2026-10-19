import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Upload, Trash2, Check, Video, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Product, OrderItem, Review } from '../types';

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | { id: string; name: string; image: string; brand: string } | null;
  orderItem?: OrderItem | null;
  orderId?: string;
  existingReview?: Review | null;
  onSubmitReview: (reviewData: {
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
  }) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: '⭐ Rất tệ',
  2: '⭐⭐ Tệ',
  3: '⭐⭐⭐ Bình thường',
  4: '⭐⭐⭐⭐ Tốt',
  5: '⭐⭐⭐⭐⭐ Tuyệt vời',
};

export default function ProductReviewModal({
  isOpen,
  onClose,
  product,
  orderItem,
  orderId,
  existingReview,
  onSubmitReview,
}: ProductReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setComment(existingReview.comment || '');
      setImages(existingReview.images || []);
      setVideo(existingReview.video);
    } else {
      setRating(5);
      setComment('');
      setImages([]);
      setVideo(undefined);
    }
    setErrorMsg(null);
    setSuccessSubmitted(false);
    setIsSubmitting(false);
  }, [existingReview, isOpen]);

  if (!isOpen || !product) return null;

  const itemSize = orderItem?.size || existingReview?.purchasedSize;
  const itemColor = orderItem?.colorName || existingReview?.purchasedColor;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      setErrorMsg('Bạn chỉ được đính kèm tối đa 5 hình ảnh.');
      return;
    }

    const availableSlots = 5 - images.length;
    const selectedFiles = (Array.from(files) as File[]).slice(0, availableSlots);

    selectedFiles.forEach((file: File) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMsg('Chỉ chấp nhận định dạng ảnh JPG, PNG, WEBP.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Dung lượng mỗi hình ảnh không quá 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
          setErrorMsg(null);
        }
      };
      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('Vui lòng chọn tệp video hợp lệ (MP4, WEBM).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Dung lượng video tối đa là 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideo(event.target.result as string);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);

    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (rating < 1) {
      setErrorMsg('Vui lòng chọn số sao đánh giá (1-5 sao).');
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMsg('Nội dung đánh giá phải có tối thiểu 10 ký tự.');
      return;
    }

    if (comment.trim().length > 1000) {
      setErrorMsg('Nội dung đánh giá không vượt quá 1000 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      onSubmitReview({
        productId: product.id,
        productName: product.name,
        orderId: orderId || orderItem?.productId,
        rating,
        comment: comment.trim(),
        images,
        video,
        purchasedSize: itemSize,
        purchasedColor: itemColor,
        reviewId: existingReview?.id,
      });

      setSuccessSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[28px] max-w-lg w-full z-10 overflow-hidden shadow-2xl border border-neutral-200/80 max-h-[90vh] flex flex-col"
          id="product-review-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Star size={18} className="fill-amber-500" />
              </div>
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                {existingReview ? 'SỬA ĐÁNH GIÁ SẢN PHẨM' : 'ĐÁNH GIÁ SẢN PHẨM'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Success state prompt */}
            {successSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check size={32} className="stroke-[3]" />
                </div>
                <h4 className="text-lg font-black text-neutral-900">
                  Cảm ơn bạn đã đánh giá sản phẩm!
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Đánh giá của bạn đã được cập nhật thành công và giúp cộng đồng mua sắm đưa ra lựa chọn chính xác hơn.
                </p>
              </div>
            ) : (
              <>
                {/* Product Summary Card */}
                <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-contain bg-white rounded-xl p-1.5 border border-neutral-200/60 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                      {product.name}
                    </h4>
                    {(itemSize || itemColor) && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {itemSize && <span>Size đã mua: <strong className="text-neutral-900">{itemSize}</strong></span>}
                        {itemSize && itemColor && <span className="mx-1">•</span>}
                        {itemColor && <span>Màu: <strong className="text-neutral-900">{itemColor}</strong></span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating Stars Interactive Picker */}
                <div className="space-y-2 text-center bg-neutral-50/70 p-4 rounded-2xl border border-neutral-100">
                  <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">
                    Chấm điểm chất lượng sản phẩm <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            size={32}
                            className={`transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                                : 'text-neutral-300 fill-neutral-100'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-5">
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 inline-block">
                      {RATING_LABELS[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-neutral-800">
                      Nội dung đánh giá <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[11px] font-semibold ${comment.length < 10 ? 'text-amber-600' : 'text-neutral-400'}`}>
                      {comment.length} / 1000 ký tự (Tối thiểu 10)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm... (Ví dụ: Giày mang rất êm, form chuẩn đẹp, giao hàng nhanh chóng, bao bì đóng gói cẩn thận.)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    className="w-full rounded-2xl border border-neutral-200 p-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black focus:bg-white bg-neutral-50/50 transition-all leading-relaxed"
                  />
                </div>

                {/* Photos Upload Section (1-5 photos) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-neutral-600" />
                      <span>Hình ảnh thực tế ({images.length}/5)</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">Chấp nhận JPG, PNG, WEBP</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 items-center">
                    {/* Preview Images */}
                    {images.map((img, idx) => (
                      <div key={idx} className="relative h-18 w-18 rounded-2xl overflow-hidden border border-neutral-200 group bg-neutral-50 shrink-0">
                        <img src={img} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}

                    {/* Add Image Button */}
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="h-18 w-18 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-black bg-neutral-50 hover:bg-neutral-100 flex flex-col items-center justify-center gap-1 text-neutral-500 transition-all cursor-pointer shrink-0"
                      >
                        <Upload size={18} />
                        <span className="text-[9px] font-bold uppercase">Thêm ảnh</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Optional Video Upload Section */}
                <div className="space-y-2 pt-1 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Video size={15} className="text-neutral-600" />
                      <span>Video trải nghiệm (Tùy chọn)</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">Tối đa 15MB</span>
                  </div>

                  {video ? (
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-black/90 p-1 flex items-center justify-between">
                      <video src={video} controls className="max-h-32 w-full rounded-xl" />
                      <button
                        type="button"
                        onClick={() => setVideo(undefined)}
                        className="absolute top-2 right-2 h-6 w-6 bg-rose-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full py-2.5 rounded-2xl border border-dashed border-neutral-300 hover:border-black bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Video size={15} />
                      <span>Tải lên 1 Video ngắn</span>
                    </button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer Controls */}
          {!successSubmitted && (
            <div className="p-4 px-6 border-t border-neutral-100 bg-neutral-50/80 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang gửi đánh giá...</span>
                ) : (
                  <span>{existingReview ? 'CẬP NHẬT ĐÁNH GIÁ' : 'GỬI ĐÁNH GIÁ'}</span>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
