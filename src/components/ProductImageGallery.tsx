import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductColor } from '../types';

export interface ProductImageGalleryProps {
  /** Array of image URLs for the product */
  images?: string[];
  /** Primary fallback image */
  mainImage?: string;
  /** Currently selected color variant */
  selectedColor?: ProductColor | { name: string; hex: string; image?: string; images?: string[] } | null;
  /** Product name for alt text & accessibility */
  productName: string;
  /** Optional badges element to overlay in top-left */
  badges?: React.ReactNode;
  /** Optional action buttons (wishlist, share) in top-right */
  floatingActions?: React.ReactNode;
  /** Optional notification toast inside the image frame */
  notification?: React.ReactNode;
  /** Optional additional CSS classes for outer container */
  className?: string;
  /** Optional callback when active image changes */
  onImageChange?: (index: number, url: string) => void;
}

export default function ProductImageGallery({
  images = [],
  mainImage,
  selectedColor,
  productName,
  badges,
  floatingActions,
  notification,
  className = '',
  onImageChange,
}: ProductImageGalleryProps) {
  // Normalize gallery images: prioritize selectedColor images/image, then mainImage and images (strictly max 4 thumbnails)
  const galleryImages = useMemo(() => {
    // 1. If selected color has a dedicated set of images
    if (selectedColor?.images && Array.isArray(selectedColor.images) && selectedColor.images.length > 0) {
      const list: string[] = [];
      selectedColor.images.forEach((img) => {
        if (img && typeof img === 'string') {
          const trimmed = img.trim();
          if (trimmed && !trimmed.includes('unsplash') && !list.includes(trimmed)) {
            list.push(trimmed);
          }
        }
      });
      if (list.length > 0) return list.slice(0, 4);
    }

    const list: string[] = [];

    // 2. If selected color has a primary image, prioritize it first!
    if (selectedColor?.image && typeof selectedColor.image === 'string' && selectedColor.image.trim() && !selectedColor.image.includes('unsplash')) {
      list.push(selectedColor.image.trim());
    } else if (mainImage && typeof mainImage === 'string' && mainImage.trim() && !mainImage.includes('unsplash')) {
      list.push(mainImage.trim());
    }

    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && typeof img === 'string' && !img.includes('unsplash')) {
          const trimmed = img.trim();
          if (trimmed && !list.includes(trimmed)) {
            list.push(trimmed);
          }
        }
      });
    }

    const finalList = list.length > 0 ? list : ['/src/assets/images/shoes/nike-air-max-pulse.jpg'];
    return finalList.slice(0, 4);
  }, [images, mainImage, selectedColor]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset active index and errors when gallery images or selectedColor change
  useEffect(() => {
    setActiveIndex(0);
    setFailedImages({});
  }, [galleryImages, selectedColor?.name, selectedColor?.image]);

  // Notify parent on change if callback provided
  useEffect(() => {
    if (onImageChange && galleryImages[activeIndex]) {
      onImageChange(activeIndex, galleryImages[activeIndex]);
    }
  }, [activeIndex, galleryImages, onImageChange]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current[activeIndex]) {
      thumbnailRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (galleryImages.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (galleryImages.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveIndex(index);
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const currentImgUrl = failedImages[activeIndex]
    ? (mainImage || galleryImages[0])
    : galleryImages[activeIndex];

  const totalImages = galleryImages.length;
  const hasMultipleImages = totalImages > 1;
  const hasThumbnails = totalImages >= 1;

  return (
    <div className={`space-y-4 ${className}`} id="product-image-gallery">
      {/* 1. MAIN LARGE IMAGE SHOWCASE */}
      <div className="relative aspect-square w-full rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-xs group select-none">
        
        {/* Dynamic Badges Overlay */}
        {(badges || (selectedColor && selectedColor.name && selectedColor.name !== 'Mặc định')) && (
          <div className="absolute top-5 left-5 z-10 flex flex-wrap gap-2 max-w-[75%] pointer-events-none">
            {badges}
            {selectedColor && selectedColor.name && selectedColor.name !== 'Mặc định' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white/50 shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span>{selectedColor.name}</span>
              </span>
            )}
          </div>
        )}

        {/* Floating Actions Overlay (Wishlist, Share) */}
        {floatingActions && (
          <div className="absolute top-5 right-5 z-10 flex flex-col gap-2">
            {floatingActions}
          </div>
        )}

        {/* Previous Button (<) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 border border-neutral-200 text-neutral-800 shadow-md transition-all hover:bg-black hover:text-white hover:border-black active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
            title="Xem ảnh trước (<)"
            aria-label="Xem ảnh trước"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
        )}

        {/* Next Button (>) */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 border border-neutral-200 text-neutral-800 shadow-md transition-all hover:bg-black hover:text-white hover:border-black active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
            title="Xem ảnh tiếp theo (>)"
            aria-label="Xem ảnh tiếp theo"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>
        )}

        {/* Image Counter Badge (e.g. 1 / 5) */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-neutral-900/75 backdrop-blur-md px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-xs pointer-events-none">
            {activeIndex + 1} / {totalImages}
          </div>
        )}

        {/* Main Product Image with Smooth Transition */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`${currentImgUrl}-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            src={currentImgUrl}
            alt={`${productName} - Ảnh góc ${activeIndex + 1}`}
            className="max-h-[360px] sm:max-h-[420px] w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => handleImageError(activeIndex)}
          />
        </AnimatePresence>

        {/* Toast Notification Slot (e.g. when added to cart) */}
        {notification}
      </div>

      {/* 2. THUMBNAIL GALLERY STRIP */}
      {/* Exactly 4 thumbnails in 1 neat row */}
      {hasThumbnails && (
        <div
          className={`grid gap-2.5 sm:gap-3 ${
            totalImages === 3
              ? 'grid-cols-3'
              : totalImages === 2
              ? 'grid-cols-2'
              : 'grid-cols-4'
          }`}
        >
          {galleryImages.map((imgUrl, idx) => {
            const isSelected = activeIndex === idx;
            const displayUrl = failedImages[idx]
              ? (mainImage || galleryImages[0])
              : imgUrl;

            return (
              <button
                key={idx}
                ref={(el) => { thumbnailRefs.current[idx] = el; }}
                type="button"
                onClick={() => handleSelectThumbnail(idx)}
                className={`aspect-square w-full rounded-xl sm:rounded-2xl bg-white border-2 p-1 sm:p-1.5 overflow-hidden transition-all cursor-pointer relative flex items-center justify-center ${
                  isSelected
                    ? 'border-black shadow-md scale-105 opacity-100 ring-1 ring-black/10 z-10'
                    : 'border-[#E5E7EB] hover:border-neutral-400 opacity-70 hover:opacity-100'
                }`}
                title={`Xem góc ảnh ${idx + 1}`}
                aria-label={`Xem góc ảnh ${idx + 1}`}
              >
                <img
                  src={displayUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(idx)}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
