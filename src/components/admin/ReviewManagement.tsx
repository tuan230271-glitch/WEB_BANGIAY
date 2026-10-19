import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  EyeOff,
  Trash2,
  X,
  AlertCircle,
  MessageSquare,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ShoppingBag,
  UserCheck,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { Review, Product, UserProfile, Order } from '../../types';
import { reviewsApi } from '../../services/api';

interface ReviewManagementProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  products: Product[];
  usersList: UserProfile[];
  orders: Order[];
}

export default function ReviewManagement({
  reviews,
  setReviews,
  products,
  usersList,
  orders,
}: ReviewManagementProps) {
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Chờ duyệt' | 'Đã hiển thị' | 'Đã ẩn'>('all');
  const [starFilter, setStarFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [hasImageFilter, setHasImageFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detail Modal state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Delete Confirm Modal state
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Calculate Stats Cards Data
  const stats = useMemo(() => {
    const activeReviews = reviews.filter((r) => !r.isDeleted);
    const total = activeReviews.length;
    
    let pendingCount = 0;
    let visibleCount = 0;
    let hiddenCount = 0;

    activeReviews.forEach((r) => {
      const status = r.status || (r.isHidden ? 'Đã ẩn' : 'Đã hiển thị');
      if (status === 'Chờ duyệt') pendingCount++;
      else if (status === 'Đã ẩn' || r.isHidden) hiddenCount++;
      else visibleCount++;
    });

    return {
      total,
      pendingCount,
      visibleCount,
      hiddenCount,
    };
  }, [reviews]);

  // 2. Filter & Sort Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => !r.isDeleted)
      .filter((r) => {
        // Status filter
        const rStatus = r.status || (r.isHidden ? 'Đã ẩn' : 'Đã hiển thị');
        if (statusFilter !== 'all' && rStatus !== statusFilter) return false;

        // Star filter
        if (starFilter !== 'all' && Math.round(r.rating) !== parseInt(starFilter, 10)) return false;

        // Image filter
        const hasImages = (r.images && r.images.length > 0) || !!r.video;
        if (hasImageFilter === 'yes' && !hasImages) return false;
        if (hasImageFilter === 'no' && hasImages) return false;

        // Search Query (Customer Name, Email, Product Name, SKU/ID)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = r.name.toLowerCase().includes(q);
          const emailMatch = (r.email || '').toLowerCase().includes(q);
          const prodNameMatch = r.productName.toLowerCase().includes(q);
          const skuMatch = (r.productSku || r.productId).toLowerCase().includes(q);
          if (!nameMatch && !emailMatch && !prodNameMatch && !skuMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'rating-high') {
          return b.rating - a.rating;
        }
        if (sortBy === 'rating-low') {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, statusFilter, starFilter, hasImageFilter, searchQuery, sortBy]);

  // 3. Paginated items
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  // Handle Actions
  const handleApprove = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: 'Đã hiển thị',
            isHidden: false,
          };
        }
        return r;
      })
    );
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview((prev) => prev ? { ...prev, status: 'Đã hiển thị', isHidden: false } : null);
    }
    reviewsApi.updateStatus(reviewId, 'Đã hiển thị').catch((err) => console.warn('Approve review in API failed:', err));
    showToast('Đã duyệt đánh giá! Đánh giá đã hiển thị công khai trên trang sản phẩm.');
  };

  const handleHide = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: 'Đã ẩn',
            isHidden: true,
          };
        }
        return r;
      })
    );
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview((prev) => prev ? { ...prev, status: 'Đã ẩn', isHidden: true } : null);
    }
    reviewsApi.updateStatus(reviewId, 'Đã ẩn').catch((err) => console.warn('Hide review in API failed:', err));
    showToast('Đã ẩn đánh giá khỏi trang sản phẩm.');
  };

  const handleDelete = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setReviewToDelete(null);
    if (selectedReview?.id === reviewId) {
      setSelectedReview(null);
    }
    reviewsApi.delete(reviewId).catch((err) => console.warn('Delete review in API failed:', err));
    showToast('Đã xóa đánh giá thành công.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setStarFilter('all');
    setHasImageFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Đã làm mới dữ liệu và khôi phục bộ lọc.');
  };

  // Render Stars Component Helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 fill-neutral-100'}
          />
        ))}
        <span className="ml-1 text-xs font-bold text-neutral-700">{rating}</span>
      </div>
    );
  };

  // Render Status Badge
  const renderStatusBadge = (status?: string, isHidden?: boolean) => {
    const finalStatus = status || (isHidden ? 'Đã ẩn' : 'Đã hiển thị');

    if (finalStatus === 'Chờ duyệt') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
          <Clock size={12} className="animate-pulse text-amber-600" />
          <span>CHỜ DUYỆT</span>
        </span>
      );
    }

    if (finalStatus === 'Đã ẩn') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <EyeOff size={12} />
          <span>ĐÃ ẨN</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
        <CheckCircle2 size={12} />
        <span>ĐÃ HIỂN THỊ</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-neutral-700 text-xs font-bold"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION - COMPACT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <MessageSquare size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 uppercase tracking-tight">
              Quản Lý Đánh Giá Sản Phẩm
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {stats.total} đánh giá
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Duyệt, kiểm duyệt nội dung và quản lý phản hồi của khách hàng
          </p>
        </div>

        <button
          onClick={handleResetFilters}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200 transition-colors border border-neutral-200 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* STATS CARDS - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Total Reviews */}
        <div 
          onClick={() => { setStatusFilter('all'); setStarFilter('all'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'all'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả đánh giá :</span>
          <span className="text-xs font-black text-neutral-900">
            {stats.total} <span className="font-semibold text-neutral-500">đánh giá</span>
          </span>
        </div>

        {/* Pending Approval */}
        <div 
          onClick={() => setStatusFilter('Chờ duyệt')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Chờ duyệt'
              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>⏳</span>
            <span>Chờ duyệt :</span>
          </span>
          <span className="text-xs font-black text-amber-700">
            {stats.pendingCount} <span className="font-semibold text-neutral-500">đánh giá</span>
          </span>
        </div>

        {/* Published */}
        <div 
          onClick={() => setStatusFilter('Đã hiển thị')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Đã hiển thị'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đã hiển thị :</span>
          </span>
          <span className="text-xs font-black text-emerald-700">
            {stats.visibleCount} <span className="font-semibold text-neutral-500">đánh giá</span>
          </span>
        </div>

        {/* Hidden */}
        <div 
          onClick={() => setStatusFilter('Đã ẩn')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Đã ẩn'
              ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>👁️</span>
            <span>Đã ẩn :</span>
          </span>
          <span className="text-xs font-black text-rose-700">
            {stats.hiddenCount} <span className="font-semibold text-neutral-500">đánh giá</span>
          </span>
        </div>
      </div>

      {/* FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm kiếm đánh giá theo Tên, Email, Sản phẩm, SKU..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 px-3 text-xs rounded-2xl border border-neutral-200 bg-neutral-50 font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="Chờ duyệt">Chờ duyệt ({stats.pendingCount})</option>
              <option value="Đã hiển thị">Đã hiển thị ({stats.visibleCount})</option>
              <option value="Đã ẩn">Đã ẩn ({stats.hiddenCount})</option>
            </select>
          </div>

          {/* Star Filter */}
          <div className="w-full lg:w-40">
            <select
              value={starFilter}
              onChange={(e) => {
                setStarFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 px-3 text-xs rounded-2xl border border-neutral-200 bg-neutral-50 font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="all">Số sao: Tất cả</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="1">1 ⭐</option>
            </select>
          </div>

          {/* Has Image Filter */}
          <div className="w-full lg:w-40">
            <select
              value={hasImageFilter}
              onChange={(e) => {
                setHasImageFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 px-3 text-xs rounded-2xl border border-neutral-200 bg-neutral-50 font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="all">Hình ảnh: Tất cả</option>
              <option value="yes">Có ảnh / Video</option>
              <option value="no">Không có ảnh</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full lg:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs rounded-2xl border border-neutral-200 bg-neutral-50 font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="oldest">Sắp xếp: Cũ nhất</option>
              <option value="rating-high">Sao: Cao đến Thấp</option>
              <option value="rating-low">Sao: Thấp đến Cao</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Active Info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pt-1 border-t border-neutral-100">
          <span>
            Tìm thấy <strong className="text-black font-black">{filteredReviews.length}</strong> đánh giá
          </span>

          {(searchQuery || statusFilter !== 'all' || starFilter !== 'all' || hasImageFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setStarFilter('all');
                setHasImageFilter('all');
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <X size={12} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* REVIEWS TABLE (DESKTOP) & CARDS (MOBILE) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-16 w-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare size={28} />
            </div>
            <p className="text-sm font-bold text-neutral-800">Không tìm thấy đánh giá nào</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc để xem đầy đủ danh sách.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
                <thead>
                  <tr className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-5 w-12 text-center">STT</th>
                    <th className="py-3.5 px-5 min-w-[180px]">Khách hàng</th>
                    <th className="py-3.5 px-5 min-w-[220px]">Sản phẩm</th>
                    <th className="py-3.5 px-5 min-w-[280px]">Đánh giá & Nội dung</th>
                    <th className="py-3.5 px-5 w-28 text-center">Số sao</th>
                    <th className="py-3.5 px-5 w-28 text-center">Ngày tạo</th>
                    <th className="py-3.5 px-5 w-28 text-center">Trạng thái</th>
                    <th className="py-3.5 px-5 w-36 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedReviews.map((rev, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const rStatus = rev.status || (rev.isHidden ? 'Đã ẩn' : 'Đã hiển thị');
                    const hasPhotos = (rev.images && rev.images.length > 0) || !!rev.video;

                    return (
                      <tr key={rev.id} className="hover:bg-neutral-50/80 transition-colors">
                        {/* STT */}
                        <td className="py-4 px-5 text-center text-neutral-400 font-bold">
                          {rowNumber}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                              alt={rev.name}
                              className="h-9 w-9 rounded-full object-cover border border-neutral-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 truncate flex items-center gap-1.5">
                                <span>{rev.name}</span>
                              </p>
                              {rev.email && (
                                <p className="text-[11px] text-neutral-500 truncate">{rev.email}</p>
                              )}
                              {rev.isVerifiedBuyer && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60 mt-0.5">
                                  <Check size={10} /> Đã mua hàng
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Product */}
                        <td className="py-4 px-5 min-w-[220px] max-w-sm">
                          <div className="flex items-center gap-2.5">
                            {rev.productImage && (
                              <img
                                src={rev.productImage}
                                alt={rev.productName}
                                className="h-10 w-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 truncate leading-tight">{rev.productName}</p>
                              <p className="text-[10px] font-semibold text-neutral-400 truncate mt-0.5">
                                SKU: {rev.productSku || rev.productId}
                              </p>
                              {(rev.purchasedSize || rev.purchasedColor) && (
                                <p className="text-[10px] text-neutral-500 truncate">
                                  {rev.purchasedSize && `Size: ${rev.purchasedSize}`}
                                  {rev.purchasedSize && rev.purchasedColor && ' | '}
                                  {rev.purchasedColor && `Màu: ${rev.purchasedColor}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Comment & Photos */}
                        <td className="py-4 px-5 min-w-[280px]">
                          <p className="text-neutral-700 font-medium line-clamp-2 leading-relaxed">
                            {rev.comment}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {hasPhotos && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                <ImageIcon size={11} /> {rev.images?.length || 1} tệp đính kèm
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedReview(rev)}
                              className="text-[11px] font-bold text-neutral-900 hover:underline cursor-pointer ml-auto"
                            >
                              Xem chi tiết →
                            </button>
                          </div>
                        </td>

                        {/* Rating Stars */}
                        <td className="py-4 px-5 text-center">
                          {renderStars(rev.rating)}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-center text-neutral-500 font-medium text-[11px]">
                          {rev.date}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5 text-center">
                          {renderStatusBadge(rev.status, rev.isHidden)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rStatus === 'Chờ duyệt' && (
                              <button
                                onClick={() => handleApprove(rev.id)}
                                title="Duyệt đánh giá"
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 size={12} />
                                <span>Duyệt</span>
                              </button>
                            )}

                            {rStatus === 'Đã hiển thị' && (
                              <button
                                onClick={() => handleHide(rev.id)}
                                title="Ẩn đánh giá"
                                className="px-2.5 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] font-bold hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <EyeOff size={12} />
                                <span>Ẩn</span>
                              </button>
                            )}

                            {rStatus === 'Đã ẩn' && (
                              <button
                                onClick={() => handleApprove(rev.id)}
                                title="Hiển thị lại"
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Eye size={12} />
                                <span>Hiện lại</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedReview(rev)}
                              title="Xem chi tiết"
                              className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => setReviewToDelete(rev)}
                              title="Xóa đánh giá"
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-neutral-100">
              {paginatedReviews.map((rev) => {
                const rStatus = rev.status || (rev.isHidden ? 'Đã ẩn' : 'Đã hiển thị');
                return (
                  <div key={rev.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                          alt={rev.name}
                          className="h-8 w-8 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <p className="font-bold text-xs text-neutral-900">{rev.name}</p>
                          <p className="text-[10px] text-neutral-500">{rev.date}</p>
                        </div>
                      </div>

                      {renderStatusBadge(rev.status, rev.isHidden)}
                    </div>

                    <div className="bg-neutral-50 p-3 rounded-2xl space-y-1.5 border border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900 leading-snug">{rev.productName}</p>
                      {renderStars(rev.rating)}
                      <p className="text-xs text-neutral-700 leading-relaxed pt-1">{rev.comment}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setSelectedReview(rev)}
                        className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Eye size={14} />
                        <span>Xem chi tiết</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {rStatus === 'Chờ duyệt' && (
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                          >
                            Duyệt
                          </button>
                        )}
                        {rStatus === 'Đã hiển thị' && (
                          <button
                            onClick={() => handleHide(rev.id)}
                            className="px-2.5 py-1 rounded-xl bg-neutral-100 border text-neutral-700 text-[11px] font-bold cursor-pointer"
                          >
                            Ẩn
                          </button>
                        )}
                        {rStatus === 'Đã ẩn' && (
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold cursor-pointer"
                          >
                            Hiện lại
                          </button>
                        )}
                        <button
                          onClick={() => setReviewToDelete(rev)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Toolbar */}
            <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-600">
              <div className="flex items-center gap-3">
                <span>Hiển thị</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 text-xs font-bold rounded-xl border border-neutral-200 bg-white cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>trên tổng {filteredReviews.length} đánh giá</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="font-bold text-neutral-900 px-2">
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-neutral-200 my-8 space-y-6 relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <MessageSquare size={20} className="text-black" />
                  <h3 className="font-black text-base text-neutral-900 uppercase tracking-tight">
                    CHI TIẾT ĐÁNH GIÁ #REV-{selectedReview.id.slice(-4)}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedReview(null)}
                  className="h-8 w-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                <span className="text-xs font-bold text-neutral-500 uppercase">TRẠNG THÁI HIỆN TẠI:</span>
                {renderStatusBadge(selectedReview.status, selectedReview.isHidden)}
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">THÔNG TIN KHÁCH HÀNG</p>
                <div className="flex items-center gap-3 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  <img
                    src={selectedReview.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'}
                    alt={selectedReview.name}
                    className="h-11 w-11 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <p className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                      <span>{selectedReview.name}</span>
                      {selectedReview.isVerifiedBuyer && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✓ Đã mua hàng
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-neutral-500">{selectedReview.email || 'Khách hàng chưa cập nhật email'}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Ngày gửi: {selectedReview.date}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">SẢN PHẨM ĐÁNH GIÁ</p>
                <div className="flex items-center gap-3 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-100">
                  {selectedReview.productImage && (
                    <img
                      src={selectedReview.productImage}
                      alt={selectedReview.productName}
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-bold text-xs text-neutral-900">{selectedReview.productName}</p>
                    <p className="text-[11px] text-neutral-500">Mã SKU: {selectedReview.productSku || selectedReview.productId}</p>
                    {(selectedReview.purchasedSize || selectedReview.purchasedColor) && (
                      <p className="text-[10px] font-semibold text-neutral-600 mt-0.5">
                        {selectedReview.purchasedSize && `Size: ${selectedReview.purchasedSize}`}
                        {selectedReview.purchasedSize && selectedReview.purchasedColor && ' | '}
                        {selectedReview.purchasedColor && `Màu: ${selectedReview.purchasedColor}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Stars & Comment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">NỘI DUNG ĐÁNH GIÁ</p>
                  {renderStars(selectedReview.rating)}
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">
                  {selectedReview.comment}
                </div>
              </div>

              {/* Attached Photos / Videos */}
              {((selectedReview.images && selectedReview.images.length > 0) || selectedReview.video) && (
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">HÌNH CẢNH & VIDEO ĐÍNH KÈM</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReview.images?.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Attach ${idx}`}
                        onClick={() => setPreviewPhoto(img)}
                        className="h-16 w-16 rounded-xl object-cover border border-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                    {selectedReview.video && (
                      <video
                        src={selectedReview.video}
                        controls
                        className="h-16 w-24 rounded-xl object-cover border border-neutral-200 bg-black"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="text-[11px] text-neutral-400 bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Admin không có quyền sửa đổi nội dung, số sao hoặc hình ảnh của khách hàng. Bạn chỉ có thể chuyển đổi trạng thái hiển thị hoặc xóa đánh giá.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-end gap-2">
                {(selectedReview.status === 'Chờ duyệt' || selectedReview.status === 'Đã ẩn' || selectedReview.isHidden) && (
                  <button
                    onClick={() => handleApprove(selectedReview.id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    <span>DUYỆT & HIỂN THỊ</span>
                  </button>
                )}

                {selectedReview.status === 'Đã hiển thị' && !selectedReview.isHidden && (
                  <button
                    onClick={() => handleHide(selectedReview.id)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <EyeOff size={14} />
                    <span>ẨN ĐÁNH GIÁ</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setReviewToDelete(selectedReview);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 size={14} />
                  <span>XÓA ĐÁNH GIÁ</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL PHOTO LIGHTBOX */}
      <AnimatePresence>
        {previewPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl"
            >
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center cursor-pointer z-10"
              >
                <X size={16} />
              </button>
              <img src={previewPhoto} alt="Review Photo Full" className="max-h-[80vh] w-auto object-contain rounded-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {reviewToDelete && (
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
                Bạn có chắc chắn muốn xóa đánh giá của <strong>{reviewToDelete.name}</strong> về sản phẩm <strong>{reviewToDelete.productName}</strong>? Hành động này sẽ loại bỏ hoàn toàn đánh giá khỏi hệ thống và không thể hoàn tác.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setReviewToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleDelete(reviewToDelete.id)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
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
