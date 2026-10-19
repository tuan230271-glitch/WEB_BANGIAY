import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ImageIcon,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  Layers,
  ArrowRight,
  Upload,
  Sparkles,
  Check,
  X,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Play,
  Pause,
  Info,
  RefreshCw,
  Sliders,
  Tag
} from 'lucide-react';
import { BannerItem, BannerPosition, BannerStatus } from '../../types';
import { bannersApi } from '../../services/api';
import {
  formatBannerDateTime,
  getBannerEffectiveStatus,
  getBannerPositionLabel,
  getBannerPositionColor
} from '../../utils/bannerUtils';

interface BannerManagementProps {
  banners: BannerItem[];
  setBanners: React.Dispatch<React.SetStateAction<BannerItem[]>>;
  showToast?: (msg: string) => void;
}

export default function BannerManagement({
  banners,
  setBanners,
  showToast = () => {}
}: BannerManagementProps) {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'all' | BannerPosition>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Đang hoạt động' | 'Sắp diễn ra' | 'Hết hạn' | 'Tạm dừng' | 'Nháp'
  >('all');
  const [sortBy, setSortBy] = useState<'order' | 'newest' | 'expiring' | 'name'>('order');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [previewBanner, setPreviewBanner] = useState<BannerItem | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<BannerItem | null>(null);

  // 1. STATS CALCULATION
  const stats = useMemo(() => {
    const activeBanners = banners.filter((b) => !b.isDeleted);
    const total = activeBanners.length;
    let activeCount = 0;
    let upcomingCount = 0;
    let expiredCount = 0;
    let pausedCount = 0;

    activeBanners.forEach((b) => {
      const effStatus = getBannerEffectiveStatus(b);
      if (effStatus === 'Đang hoạt động') activeCount++;
      else if (effStatus === 'Sắp diễn ra') upcomingCount++;
      else if (effStatus === 'Hết hạn') expiredCount++;
      else if (effStatus === 'Tạm dừng') pausedCount++;
    });

    return { total, activeCount, upcomingCount, expiredCount, pausedCount };
  }, [banners]);

  // 2. FILTER & SORT BANNERS
  const filteredBanners = useMemo(() => {
    return banners
      .filter((b) => {
        if (b.isDeleted) return false;

        const effectiveStatus = getBannerEffectiveStatus(b);

        // Search check
        const matchQuery =
          b.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase().trim()));

        if (!matchQuery) return false;

        // Position filter
        if (positionFilter !== 'all' && b.position !== positionFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'Tạm dừng' && b.status !== 'Tạm dừng') return false;
          if (statusFilter === 'Nháp' && b.status !== 'Nháp') return false;
          if (statusFilter === 'Đang hoạt động' && effectiveStatus !== 'Đang hoạt động') return false;
          if (statusFilter === 'Sắp diễn ra' && effectiveStatus !== 'Sắp diễn ra') return false;
          if (statusFilter === 'Hết hạn' && effectiveStatus !== 'Hết hạn') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'order') {
          // If same position, sort by order asc, then position
          if (a.position === b.position) {
            return (a.order || 0) - (b.order || 0);
          }
          return a.position.localeCompare(b.position);
        }
        if (sortBy === 'newest') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortBy === 'expiring') {
          if (!a.endDate) return 1;
          if (!b.endDate) return -1;
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [banners, searchQuery, positionFilter, statusFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / pageSize));
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBanners.slice(start, start + pageSize);
  }, [filteredBanners, currentPage, pageSize]);

  // Quick toggle Active / Pause
  const handleToggleStatus = (banner: BannerItem) => {
    const newStatus = banner.status === 'Tạm dừng' ? 'Đang hoạt động' : 'Tạm dừng';
    setBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id
          ? { ...b, status: newStatus, updatedAt: new Date().toLocaleDateString('vi-VN') }
          : b
      )
    );
    bannersApi.update(banner.id, { status: newStatus }).catch((err) => console.warn('Toggle banner in API failed:', err));
    showToast(`Đã ${newStatus === 'Tạm dừng' ? 'tạm dừng' : 'kích hoạt'} banner "${banner.name}".`);
  };

  // Confirm delete banner
  const handleConfirmDelete = (banner: BannerItem) => {
    setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    bannersApi.delete(banner.id).catch((err) => console.warn('Delete banner in API failed:', err));
    showToast(`Đã xóa banner "${banner.name}".`);
    setDeletingBanner(null);
  };

  // Render Status Badge
  const renderStatusBadge = (banner: BannerItem) => {
    const effStatus = getBannerEffectiveStatus(banner);

    switch (effStatus) {
      case 'Đang hoạt động':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đang hoạt động
          </span>
        );
      case 'Sắp diễn ra':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} className="text-blue-500" />
            Sắp diễn ra
          </span>
        );
      case 'Hết hạn':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <XCircle size={12} className="text-neutral-400" />
            Đã hết hạn
          </span>
        );
      case 'Tạm dừng':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle size={12} className="text-amber-500" />
            Tạm dừng
          </span>
        );
      case 'Nháp':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-50 text-neutral-500 border border-neutral-200">
            Bản nháp
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans" id="banner-management-view">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <ImageIcon size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Banner
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {stats.total} banner
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Cấu hình slider trang chủ, banner khuyến mãi, thương hiệu và đồng bộ tự động tới Website
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBanner(null);
            setIsFormModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
          id="btn-add-banner"
        >
          <Plus size={15} className="text-amber-400" />
          <span>Thêm banner</span>
        </button>
      </div>

      {/* 2. STATS 4 CARDS - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Total Banners */}
        <div
          onClick={() => { setStatusFilter('all'); setPositionFilter('all'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'all' && positionFilter === 'all'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả banner :</span>
          <span className="text-xs font-black text-neutral-900">
            {stats.total} <span className="font-semibold text-neutral-500">banner</span>
          </span>
        </div>

        {/* Active Banners */}
        <div
          onClick={() => setStatusFilter('Đang hoạt động')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Đang hoạt động'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đang hiển thị :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {stats.activeCount} <span className="font-semibold text-emerald-700">banner</span>
          </span>
        </div>

        {/* Upcoming */}
        <div
          onClick={() => setStatusFilter('Sắp diễn ra')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Sắp diễn ra'
              ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
            <span>⏳</span>
            <span>Sắp diễn ra :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {stats.upcomingCount} <span className="font-semibold text-blue-700">banner</span>
          </span>
        </div>

        {/* Paused & Expired */}
        <div
          onClick={() => setStatusFilter('Tạm dừng')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Tạm dừng'
              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>⏸️</span>
            <span>Tạm dừng / Ẩn :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {stats.pausedCount + stats.expiredCount} <span className="font-semibold text-amber-700">banner</span>
          </span>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm theo tên banner, tiêu đề, mô tả..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-9 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-neutral-900 focus:bg-white transition-all"
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

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Position Select */}
            <select
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="all">Tất cả vị trí</option>
              <option value="home_hero">Banner trang chủ</option>
              <option value="promo">Banner khuyến mãi</option>
              <option value="brand">Banner thương hiệu</option>
              <option value="secondary">Banner phụ</option>
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Tạm dừng">Tạm dừng</option>
              <option value="Hết hạn">Đã hết hạn</option>
              <option value="Nháp">Bản nháp</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="order">Theo thứ tự hiển thị</option>
              <option value="newest">Mới cập nhật nhất</option>
              <option value="expiring">Hết hạn gần nhất</option>
              <option value="name">Tên banner (A-Z)</option>
            </select>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-700 outline-none focus:border-black cursor-pointer"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchQuery || positionFilter !== 'all' || statusFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <span>
              Tìm thấy <strong className="text-neutral-900">{filteredBanners.length}</strong> banner phù hợp
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setPositionFilter('all');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="text-neutral-700 hover:text-black font-bold underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* 4. BANNER LIST / TABLE */}
      {filteredBanners.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-base font-black text-neutral-800">Không tìm thấy banner nào</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Không có banner nào khớp với điều kiện tìm kiếm. Hãy thử từ khóa khác hoặc tạo mới banner quảng cáo.
          </p>
          <button
            onClick={() => {
              setEditingBanner(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            + Thêm banner mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1100px] border-collapse">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-black text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5 w-12 text-center">STT</th>
                    <th className="py-3.5 px-5 w-28">Ảnh Banner</th>
                    <th className="py-3.5 px-5">Tên & Nội dung</th>
                    <th className="py-3.5 px-5">Vị trí</th>
                    <th className="py-3.5 px-5 text-center">Thứ tự</th>
                    <th className="py-3.5 px-5">Thời gian hiển thị</th>
                    <th className="py-3.5 px-5 text-center">Trạng thái</th>
                    <th className="py-3.5 px-5 text-center">Ngày cập nhật</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedBanners.map((banner, idx) => {
                    const posColor = getBannerPositionColor(banner.position);
                    const globalIdx = (currentPage - 1) * pageSize + idx + 1;

                    return (
                      <tr key={banner.id} className="hover:bg-neutral-50/80 transition-colors group">
                        {/* STT */}
                        <td className="py-4 px-5 text-center text-neutral-400 font-bold">{globalIdx}</td>

                        {/* Thumbnail Image */}
                        <td className="py-4 px-5">
                          <div
                            onClick={() => setPreviewBanner(banner)}
                            className="relative h-16 w-24 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200 group-hover:border-neutral-900 transition-all cursor-pointer shadow-2xs"
                            title="Click để xem trước"
                          >
                            <img
                              src={banner.image}
                              alt={banner.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        </td>

                        {/* Tên & Nội dung */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-neutral-900 text-xs">{banner.name}</span>
                              {banner.badge && (
                                <span
                                  className="text-[9px] font-black px-1.5 py-0.5 rounded text-white tracking-wider uppercase"
                                  style={{ backgroundColor: banner.accentColor || '#000000' }}
                                >
                                  {banner.badge}
                                </span>
                              )}
                            </div>
                            {banner.title && (
                              <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-tight">
                                {banner.title}
                              </p>
                            )}
                            {banner.description && (
                              <p className="text-[11px] text-neutral-400 font-light truncate max-w-sm">
                                {banner.description}
                              </p>
                            )}
                            {banner.link && (
                              <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                                <ExternalLink size={9} />
                                <span>{banner.link}</span>
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Vị trí */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${posColor.bg} ${posColor.text} ${posColor.border}`}
                          >
                            {getBannerPositionLabel(banner.position)}
                          </span>
                        </td>

                        {/* Thứ tự */}
                        <td className="py-4 px-5 text-center">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-neutral-100 text-neutral-900 font-black text-xs">
                            {banner.order || 1}
                          </span>
                        </td>

                        {/* Thời gian hiển thị */}
                        <td className="py-4 px-5">
                          {banner.startDate || banner.endDate ? (
                            <div className="space-y-0.5 text-[11px] text-neutral-600">
                              {banner.startDate && (
                                <div>
                                  <span className="text-neutral-400">Từ:</span>{' '}
                                  {formatBannerDateTime(banner.startDate)}
                                </div>
                              )}
                              {banner.endDate && (
                                <div>
                                  <span className="text-neutral-400">Đến:</span>{' '}
                                  {formatBannerDateTime(banner.endDate)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic">Hiển thị liên tục</span>
                          )}
                        </td>

                        {/* Trạng thái */}
                        <td className="py-4 px-5 text-center">{renderStatusBadge(banner)}</td>

                        {/* Ngày cập nhật */}
                        <td className="py-4 px-5 text-center text-[11px] text-neutral-500 font-medium">
                          {banner.updatedAt || banner.createdAt}
                        </td>

                        {/* Thao tác */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Preview */}
                            <button
                              onClick={() => setPreviewBanner(banner)}
                              title="Xem trước Banner"
                              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Toggle active / pause */}
                            <button
                              onClick={() => handleToggleStatus(banner)}
                              title={banner.status === 'Tạm dừng' ? 'Kích hoạt banner' : 'Tạm dừng banner'}
                              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                                banner.status === 'Tạm dừng'
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-amber-600 hover:bg-amber-50'
                              }`}
                            >
                              {banner.status === 'Tạm dừng' ? <Play size={15} /> : <Pause size={15} />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => {
                                setEditingBanner(banner);
                                setIsFormModalOpen(true);
                              }}
                              title="Chỉnh sửa Banner"
                              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <Edit2 size={15} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeletingBanner(banner)}
                              title="Xóa Banner"
                              className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
                  {Math.min(currentPage * pageSize, filteredBanners.length)} / {filteredBanners.length} banner
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        currentPage === p
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Card Grid View */}
          <div className="md:hidden space-y-3.5">
            {paginatedBanners.map((banner) => {
              const posColor = getBannerPositionColor(banner.position);

              return (
                <div
                  key={banner.id}
                  className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${posColor.bg} ${posColor.text} ${posColor.border}`}
                    >
                      {getBannerPositionLabel(banner.position)}
                    </span>
                    <div>{renderStatusBadge(banner)}</div>
                  </div>

                  {/* Banner Image Preview */}
                  <div
                    onClick={() => setPreviewBanner(banner)}
                    className="relative h-32 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 cursor-pointer shadow-inner"
                  >
                    <img
                      src={banner.image}
                      alt={banner.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                      <div>
                        {banner.badge && (
                          <span
                            className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase"
                            style={{ backgroundColor: banner.accentColor || '#FF5400' }}
                          >
                            {banner.badge}
                          </span>
                        )}
                        <h4 className="font-black text-sm uppercase tracking-tight">{banner.title || banner.name}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold uppercase">TÊN BANNER</span>
                      <span className="font-bold text-neutral-900 truncate block">{banner.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold uppercase">THỨ TỰ</span>
                      <span className="font-black text-neutral-900">{banner.order || 1}</span>
                    </div>
                    {banner.startDate && (
                      <div className="col-span-2 pt-1 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                        <span className="text-neutral-400">Thời gian:</span> {formatBannerDateTime(banner.startDate)}
                        {banner.endDate ? ` - ${formatBannerDateTime(banner.endDate)}` : ' (Liên tục)'}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setPreviewBanner(banner)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Xem trước</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 ${
                        banner.status === 'Tạm dừng'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {banner.status === 'Tạm dừng' ? <Play size={13} /> : <Pause size={13} />}
                      <span>{banner.status === 'Tạm dừng' ? 'Bật' : 'Tắt'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setIsFormModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => setDeletingBanner(banner)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold disabled:opacity-40"
                >
                  Trước
                </button>
                <span className="text-xs font-bold text-neutral-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FORM MODAL: THÊM & SỬA BANNER */}
      <AnimatePresence>
        {isFormModalOpen && (
          <BannerFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingBanner(null);
            }}
            banner={editingBanner}
            onSave={(savedBanner) => {
              if (editingBanner) {
                setBanners((prev) =>
                  prev.map((b) => (b.id === savedBanner.id ? savedBanner : b))
                );
                bannersApi.update(savedBanner.id, savedBanner).catch((err) => console.warn('Update banner in API failed:', err));
                showToast(`Đã cập nhật banner "${savedBanner.name}" thành công!`);
              } else {
                setBanners((prev) => [savedBanner, ...prev]);
                bannersApi.create(savedBanner).catch((err) => console.warn('Create banner in API failed:', err));
                showToast(`Đã thêm banner "${savedBanner.name}" thành công!`);
              }
              setIsFormModalOpen(false);
              setEditingBanner(null);
            }}
            onPreview={(tempBanner) => {
              setPreviewBanner(tempBanner);
            }}
          />
        )}
      </AnimatePresence>

      {/* 6. PREVIEW MODAL (GIỐNG GIAO DIỆN WEBSITE KHÁCH HÀNG) */}
      <AnimatePresence>
        {previewBanner && (
          <BannerPreviewModal
            isOpen={!!previewBanner}
            onClose={() => setPreviewBanner(null)}
            banner={previewBanner}
          />
        )}
      </AnimatePresence>

      {/* 7. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingBanner(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900">Xác Nhận Xóa Banner</h3>
                    <p className="text-xs text-neutral-500">Thao tác này không thể hoàn tác</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeletingBanner(null)}
                  className="text-neutral-400 hover:text-black p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-neutral-600">
                <p>
                  Bạn có chắc chắn muốn xóa banner <strong className="text-neutral-900 font-bold">{deletingBanner.name}</strong> không?
                </p>
                <div className="p-3 bg-neutral-50 rounded-2xl flex items-center gap-3 border border-neutral-200">
                  <img
                    src={deletingBanner.image}
                    alt={deletingBanner.name}
                    className="h-12 w-20 rounded-xl object-cover bg-neutral-900"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-neutral-900 text-xs">{deletingBanner.title || deletingBanner.name}</p>
                    <p className="text-[11px] text-neutral-500">{getBannerPositionLabel(deletingBanner.position)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDeletingBanner(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDelete(deletingBanner)}
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
                >
                  Xóa Banner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: BANNER FORM MODAL (THÊM / SỬA)
// ---------------------------------------------------------------------------
interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: BannerItem | null;
  onSave: (banner: BannerItem) => void;
  onPreview: (banner: BannerItem) => void;
}

const PRESET_BANNER_IMAGES = [
  { label: 'Nike Air Max Pulse', url: '/src/assets/images/nike_hero_shoe_1784366503176.jpg' },
  { label: 'Adidas Ultraboost Black', url: '/src/assets/images/adidas_black_shoe_1784366517769.jpg' },
  { label: 'Puma RS-X Retro', url: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg' },
  { label: 'Converse Classic Star', url: '/src/assets/images/converse_classic_shoe_1784366541899.jpg' },
  { label: 'Boutique Store Background', url: '/src/assets/images/hero_banner_background_1784366559173.jpg' }
];

const PRESET_COLORS = ['#FF5400', '#007BC4', '#D946EF', '#F43F5E', '#10B981', '#3B82F6', '#8B5CF6', '#000000'];

function BannerFormModal({ isOpen, onClose, banner, onSave, onPreview }: BannerFormModalProps) {
  const isEditing = !!banner;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [name, setName] = useState(banner?.name || '');
  const [image, setImage] = useState(banner?.image || '');
  const [title, setTitle] = useState(banner?.title || '');
  const [subtitle, setSubtitle] = useState(banner?.subtitle || '');
  const [description, setDescription] = useState(banner?.description || '');
  const [buttonText, setButtonText] = useState(banner?.buttonText || 'MUA NGAY');
  const [link, setLink] = useState(banner?.link || '/products');
  const [position, setPosition] = useState<BannerPosition>(banner?.position || 'home_hero');
  const [order, setOrder] = useState<number | string>(banner?.order || 1);
  const [badge, setBadge] = useState(banner?.badge || 'NEW ARRIVAL');
  const [accentColor, setAccentColor] = useState(banner?.accentColor || '#FF5400');

  // Dates
  const [startDate, setStartDate] = useState(banner?.startDate || '');
  const [endDate, setEndDate] = useState(banner?.endDate || '');
  const [status, setStatus] = useState<BannerStatus>(banner?.status || 'Đang hoạt động');

  // Upload info & image dimension check
  const [fileSizeWarning, setFileSizeWarning] = useState<string | null>(null);
  const [aspectRatioNotice, setAspectRatioNotice] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle image upload from computer file explorer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Định dạng ảnh không hợp lệ. Vui lòng chọn file JPG, JPEG, PNG hoặc WEBP.'
      }));
      return;
    }

    // Check file size (Warn if > 5MB, Reject if > 10MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setErrors((prev) => ({
        ...prev,
        image: `Ảnh quá lớn (${sizeInMB.toFixed(1)}MB). Vui lòng chọn ảnh dung lượng dưới 10MB.`
      }));
      return;
    }

    if (sizeInMB > 5) {
      setFileSizeWarning(`Dung lượng ảnh tương đối lớn (${sizeInMB.toFixed(1)}MB), khuyến khích dưới 3MB để tải nhanh nhất.`);
    } else {
      setFileSizeWarning(null);
    }

    // Read File as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);

      // Check aspect ratio
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setImageDimensions({ width: w, height: h });

        const ratio = w / h;
        if (ratio < 1.3) {
          setAspectRatioNotice(
            `Ảnh có tỷ lệ dạng đứng/vuông (${w}x${h}). Banner trang chủ đẹp nhất ở tỷ lệ ngang 16:6 hoặc 16:7.`
          );
        } else {
          setAspectRatioNotice(null);
        }
      };
      img.src = dataUrl;

      if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên Banner.';
    if (!image.trim()) newErrors.image = 'Vui lòng tải lên ảnh cho Banner.';

    if (startDate && endDate) {
      const startT = new Date(startDate).getTime();
      const endT = new Date(endDate).getTime();
      if (endT <= startT) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildCurrentBanner = (): BannerItem => {
    return {
      id: banner?.id || `banner-${Date.now()}`,
      name: name.trim(),
      image: image.trim(),
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      buttonText: buttonText.trim() || undefined,
      link: link.trim() || undefined,
      position,
      order: Number(order) || 1,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status,
      badge: badge.trim() || undefined,
      accentColor: accentColor || '#FF5400',
      createdAt: banner?.createdAt || new Date().toLocaleDateString('vi-VN'),
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(buildCurrentBanner());
  };

  const handleOpenPreview = () => {
    if (!image) {
      setErrors((prev) => ({ ...prev, image: 'Cần có ảnh để xem trước' }));
      return;
    }
    onPreview(buildCurrentBanner());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 uppercase">
                {isEditing ? `CHỈNH SỬA BANNER: ${banner.name}` : 'THÊM BANNER MỚI'}
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                {isEditing ? 'Cập nhật hình ảnh, thông điệp và vị trí hiển thị' : 'Điền thông tin và tải ảnh banner để xuất bản lên website'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Image Upload (Crucial Requirement) */}
          <div className="space-y-3 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={15} />
                <span>1. Ảnh Banner <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">
                Hỗ trợ JPG, JPEG, PNG, WEBP (Khuyến nghị 16:6 hoặc 16:7)
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Image Preview Box or Upload Trigger */}
            {image ? (
              <div className="space-y-2.5">
                <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-inner group max-h-56 flex items-center justify-center">
                  <img
                    src={image}
                    alt="Banner Preview"
                    className="w-full h-48 sm:h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl shadow-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Thay đổi ảnh</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="px-4 py-2 bg-black/80 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                    >
                      <Eye size={14} />
                      <span>Xem trước</span>
                    </button>
                  </div>
                </div>

                {/* Dimension & notices */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={12} /> Đã chọn ảnh
                    </span>
                    {imageDimensions && (
                      <span className="text-neutral-400 font-mono">
                        ({imageDimensions.width} x {imageDimensions.height} px)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-neutral-800 underline cursor-pointer hover:text-black"
                  >
                    + Chọn ảnh khác từ máy tính
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-neutral-100/80 ${
                  errors.image ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-300 hover:border-neutral-900'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-3">
                  <Upload size={22} />
                </div>
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Bấm để chọn file ảnh từ máy tính
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Định dạng: JPG, JPEG, PNG, WEBP. Tỷ lệ tối ưu 16:6 hoặc 16:7 cho Slider Trang chủ.
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 bg-black text-white text-xs font-bold rounded-xl shadow-xs pointer-events-none"
                >
                  + Chọn ảnh
                </button>
              </div>
            )}

            {/* Warnings */}
            {errors.image && <p className="text-[11px] text-rose-500 font-bold">{errors.image}</p>}
            {fileSizeWarning && (
              <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                <span>{fileSizeWarning}</span>
              </p>
            )}
            {aspectRatioNotice && (
              <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Info size={12} />
                <span>{aspectRatioNotice}</span>
              </p>
            )}

            {/* Quick Sample Presets Picker */}
            <div className="pt-2 border-t border-neutral-200/60">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1.5">
                Hoặc chọn nhanh ảnh mẫu có sẵn trong cửa hàng:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_BANNER_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setAspectRatioNotice(null);
                      setFileSizeWarning(null);
                      if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <img src={preset.url} alt="" className="h-4 w-4 rounded object-cover" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Core Info (Tên, Vị trí, Thứ tự, Trạng thái) */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={15} />
              <span>2. Vị trí & Cấu hình hiển thị</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tên Banner * */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Tên Banner quản lý <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Nike Air Max Pulse - Slider Trang Chủ Mùa Thu"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium outline-none focus:border-black transition-all ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name}</p>}
              </div>

              {/* Vị trí Banner */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Vị trí hiển thị <span className="text-rose-500">*</span>
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as BannerPosition)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
                >
                  <option value="home_hero">Banner trang chủ (Slider Hero)</option>
                  <option value="promo">Banner khuyến mãi (Mid Season Sale)</option>
                  <option value="brand">Banner thương hiệu (Đối tác nổi bật)</option>
                  <option value="secondary">Banner phụ (Bộ sưu tập chạy bộ)</option>
                </select>
              </div>

              {/* Thứ tự */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Thứ tự hiển thị (Số nhỏ xuất hiện trước)
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-black outline-none focus:border-black"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Trạng thái phát hành</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BannerStatus)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
                >
                  <option value="Đang hoạt động">Đang hoạt động (Hiển thị ngay trên web)</option>
                  <option value="Tạm dừng">Tạm dừng (Ẩn tạm thời)</option>
                  <option value="Nháp">Bản nháp</option>
                  <option value="Hết hạn">Hết hạn</option>
                </select>
              </div>

              {/* Badge & Accent Color */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Nhãn dán (Badge) & Màu</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="VD: NEW ARRIVAL"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-black"
                  />
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-10 p-1 rounded-xl border border-neutral-200 cursor-pointer bg-white"
                    title="Chọn màu điểm nhấn"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Content / Typography (Tiêu đề, Mô tả, Nút, Link) */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={15} />
              <span>3. Thông điệp & Nút bấm</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tiêu đề chính */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Tiêu đề chính (Title)</label>
                <input
                  type="text"
                  placeholder="VD: NIKE AIR MAX PULSE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-black"
                />
              </div>

              {/* Phụ đề (Subtitle) */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Phụ đề (Subtitle)</label>
                <input
                  type="text"
                  placeholder="VD: THẾ HỆ ĐỆM KHÍ ĐỘT PHÁ"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium uppercase outline-none focus:border-black"
                />
              </div>

              {/* Mô tả */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  placeholder="VD: Sự giao thoa hoàn hảo giữa thời trang đường phố và hiệu suất đỉnh cao..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-normal outline-none focus:border-black resize-none"
                />
              </div>

              {/* Text nút */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Text nút bấm (CTA Button)</label>
                <input
                  type="text"
                  placeholder="VD: MUA NGAY, KHÁM PHÁ"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-black uppercase outline-none focus:border-black"
                />
              </div>

              {/* Link khi click */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Link chuyển hướng khi click</label>
                <input
                  type="text"
                  placeholder="VD: /products, nike, running"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-mono outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Schedule (Thời gian hiển thị) */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={15} />
              <span>4. Thời gian hiển thị (Tùy chọn)</span>
            </h4>
            <p className="text-[11px] text-neutral-500">
              Nếu không đặt thời gian, banner sẽ hiển thị liên tục khi trạng thái là "Đang hoạt động". Khi hết hạn, banner tự động ẩn khỏi website.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Ngày bắt đầu hiển thị</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Ngày kết thúc hiển thị</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3.5 py-2 bg-white border rounded-xl text-xs font-medium outline-none focus:border-black ${
                    errors.endDate ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200'
                  }`}
                />
                {errors.endDate && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-4 py-2.5 rounded-2xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={15} />
              <span>Xem trước Banner</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                {isEditing ? 'LƯU CẬP NHẬT' : 'TẠO BANNER MỚI'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: BANNER PREVIEW MODAL (WEBSITE CLIENT SIMULATION)
// ---------------------------------------------------------------------------
interface BannerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: BannerItem;
}

function BannerPreviewModal({ isOpen, onClose, banner }: BannerPreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-neutral-900 text-white rounded-3xl p-4 sm:p-6 max-w-5xl w-full shadow-2xl border border-neutral-700 my-auto overflow-hidden"
      >
        {/* Header with Device Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-black flex items-center justify-center font-bold">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span>XEM TRƯỚC BANNER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {getBannerPositionLabel(banner.position)}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Giao diện hiển thị trực tiếp tới khách hàng trên website SoleStyle
              </p>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-2xl border border-neutral-700 self-start sm:self-auto">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'tablet' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 cursor-pointer absolute top-4 right-4 sm:static">
            <X size={20} />
          </button>
        </div>

        {/* Device Container Frame */}
        <div className="flex justify-center items-center py-2 overflow-x-auto">
          <div
            className={`transition-all duration-300 bg-neutral-950 rounded-3xl p-3 sm:p-4 border border-neutral-800 shadow-2xl ${
              deviceMode === 'desktop'
                ? 'w-full max-w-4xl'
                : deviceMode === 'tablet'
                ? 'w-[640px]'
                : 'w-[360px]'
            }`}
          >
            {/* 1. If Position == Home Hero Slider */}
            {banner.position === 'home_hero' && (
              <div className="relative w-full rounded-[28px] overflow-hidden bg-neutral-900 shadow-2xl min-h-[380px] md:min-h-[460px] flex flex-col justify-between">
                {/* Background backdrop */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/src/assets/images/hero_banner_background_1784366559173.jpg"
                    alt=""
                    className="h-full w-full object-cover opacity-20 filter blur-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black via-neutral-950/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
                  {/* Left Content */}
                  <div className="flex-1 space-y-3 text-left">
                    {banner.badge && (
                      <span
                        className="inline-block rounded-full px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase"
                        style={{ backgroundColor: banner.accentColor || '#FF5400' }}
                      >
                        {banner.badge}
                      </span>
                    )}

                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                      {banner.title || banner.name}
                    </h2>

                    {banner.subtitle && (
                      <p className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.description && (
                      <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3">
                        {banner.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs font-black text-black shadow-lg">
                        <span>{banner.buttonText || 'MUA NGAY'}</span>
                        <ArrowRight size={13} />
                      </button>
                      <button className="flex h-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-extrabold text-white">
                        KHÁM PHÁ
                      </button>
                    </div>
                  </div>

                  {/* Right Shoe Image */}
                  <div className="flex-1 flex items-center justify-center relative w-full">
                    <img
                      src={banner.image}
                      alt={banner.name}
                      className="max-h-[180px] md:max-h-[260px] object-contain drop-shadow-[0_20px_20px_rgba(255,255,255,0.2)] filter z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className="absolute h-44 w-44 rounded-full blur-[60px] opacity-35"
                      style={{ backgroundColor: banner.accentColor || '#FF5400' }}
                    />
                  </div>
                </div>

                {/* Footer Dots */}
                <div className="relative z-10 flex justify-center pb-4 gap-2">
                  <span className="h-2 w-7 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                </div>
              </div>
            )}

            {/* 2. If Position == Promo Banner */}
            {banner.position === 'promo' && (
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 md:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-rose-500/15 blur-[90px] pointer-events-none" />

                <div className="flex-1 space-y-3 text-left z-10">
                  {banner.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-rose-300">
                      <Sparkles size={11} className="text-rose-400" />
                      <span>{banner.badge}</span>
                    </span>
                  )}
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-tight">
                    {banner.title || banner.name}
                  </h3>
                  {banner.description && (
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">{banner.description}</p>
                  )}
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-black text-black shadow-lg">
                      <span>{banner.buttonText || 'KHÁM PHÁ NGAY'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative z-10">
                  <img
                    src={banner.image}
                    alt={banner.name}
                    className="max-h-[160px] md:max-h-[220px] object-contain drop-shadow-[0_20px_20px_rgba(255,255,255,0.15)] filter"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* 3. If Position == Brand or Secondary */}
            {(banner.position === 'brand' || banner.position === 'secondary') && (
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-2.5 text-left z-10">
                  {banner.badge && (
                    <span
                      className="inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase text-white"
                      style={{ backgroundColor: banner.accentColor || '#3B82F6' }}
                    >
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="text-xl md:text-2xl font-black uppercase">{banner.title || banner.name}</h3>
                  {banner.subtitle && <p className="text-xs text-neutral-300 font-bold uppercase">{banner.subtitle}</p>}
                  {banner.description && <p className="text-xs text-neutral-400 font-light">{banner.description}</p>}
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2 text-xs font-black text-black">
                      <span>{banner.buttonText || 'XEM NGAY'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center z-10">
                  <img
                    src={banner.image}
                    alt={banner.name}
                    className="max-h-[150px] md:max-h-[200px] object-contain drop-shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Trạng thái:</span>
            <span className="font-bold text-white">{banner.status}</span>
            {banner.link && (
              <span className="text-neutral-500 font-mono">| Link: {banner.link}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Đóng xem trước
          </button>
        </div>
      </motion.div>
    </div>
  );
}
