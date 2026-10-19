import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  ShoppingBag,
  UserCheck,
  RefreshCw,
  Copy,
  ChevronDown,
  Info,
  Check,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Promotion, Product, CategoryItem, BrandItem, Order, UserProfile, DiscountType, PromotionScope } from '../../types';
import { promotionsApi } from '../../services/api';
import {
  formatPrice,
  formatPromotionDateTime,
  getPromotionEffectiveStatus,
  formatPromotionValue
} from '../../utils/promotionUtils';

interface PromotionManagementProps {
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  products: Product[];
  categories?: CategoryItem[];
  brands?: BrandItem[];
  orders: Order[];
  usersList?: UserProfile[];
  showToast?: (msg: string) => void;
  onNavigateToOrders?: (orderCodeOrQuery?: string) => void;
}

export default function PromotionManagement({
  promotions,
  setPromotions,
  products,
  categories = [],
  brands = [],
  orders,
  usersList = [],
  showToast = () => {},
  onNavigateToOrders
}: PromotionManagementProps) {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Đang hoạt động' | 'Sắp diễn ra' | 'Hết hạn' | 'Tạm dừng' | 'Nháp'>('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState<'all' | DiscountType>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | PromotionScope>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'expiring' | 'usage' | 'value'>('newest');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [detailPromotion, setDetailPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã "${code}" vào clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 1. STATS CALCULATION (Real database data)
  const stats = useMemo(() => {
    const activePromos = promotions.filter((p) => !p.isDeleted);
    const total = activePromos.length;
    let activeCount = 0;
    let upcomingCount = 0;
    let expiredCount = 0;

    activePromos.forEach((p) => {
      const effStatus = getPromotionEffectiveStatus(p);
      if (effStatus === 'Đang hoạt động') activeCount++;
      else if (effStatus === 'Sắp diễn ra') upcomingCount++;
      else if (effStatus === 'Hết hạn') expiredCount++;
    });

    return { total, activeCount, upcomingCount, expiredCount };
  }, [promotions]);

  // 2. FILTER & SORT PROMOTIONS
  const filteredPromotions = useMemo(() => {
    return promotions
      .filter((p) => {
        if (p.isDeleted) return false;

        const effectiveStatus = getPromotionEffectiveStatus(p);

        // Search check
        const matchQuery =
          p.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase().trim()));

        if (!matchQuery) return false;

        // Status check
        if (statusFilter !== 'all') {
          if (statusFilter === 'Tạm dừng' && p.status !== 'Tạm dừng') return false;
          if (statusFilter === 'Nháp' && p.status !== 'Nháp') return false;
          if (statusFilter === 'Đang hoạt động' && effectiveStatus !== 'Đang hoạt động') return false;
          if (statusFilter === 'Sắp diễn ra' && effectiveStatus !== 'Sắp diễn ra') return false;
          if (statusFilter === 'Hết hạn' && effectiveStatus !== 'Hết hạn') return false;
        }

        // Discount Type check
        if (discountTypeFilter !== 'all' && p.discountType !== discountTypeFilter) {
          return false;
        }

        // Scope check
        if (scopeFilter !== 'all' && p.scope !== scopeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortBy === 'expiring') {
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        }
        if (sortBy === 'usage') {
          return b.usedCount - a.usedCount;
        }
        if (sortBy === 'value') {
          return b.discountValue - a.discountValue;
        }
        return 0;
      });
  }, [promotions, searchQuery, statusFilter, discountTypeFilter, scopeFilter, sortBy]);

  // Helper for quick status toggle
  const handleToggleStatus = (promo: Promotion) => {
    const newStatus = promo.status === 'Tạm dừng' ? 'Đang hoạt động' : 'Tạm dừng';
    setPromotions((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p))
    );
    promotionsApi.update(promo.id, { status: newStatus }).catch((err) => console.warn('Toggle promo status in API failed:', err));
    showToast(`Đã ${newStatus === 'Tạm dừng' ? 'tạm dừng' : 'kích hoạt lại'} mã "${promo.code}".`);
  };

  // Helper for delete/deactivate
  const handleConfirmDelete = (promo: Promotion) => {
    if (promo.usedCount > 0) {
      // Cannot hard delete -> pause it
      setPromotions((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, status: 'Tạm dừng', updatedAt: new Date().toISOString() } : p))
      );
      promotionsApi.update(promo.id, { status: 'Tạm dừng' }).catch((err) => console.warn('Pause promo in API failed:', err));
      showToast(`Mã "${promo.code}" đã được chuyển sang trạng thái "Tạm dừng" để bảo vệ lịch sử giao dịch.`);
    } else {
      // Hard delete or mark isDeleted
      setPromotions((prev) => prev.filter((p) => p.id !== promo.id));
      promotionsApi.delete(promo.id).catch((err) => console.warn('Delete promo in API failed:', err));
      showToast(`Đã xóa vĩnh viễn khuyến mãi "${promo.code}".`);
    }
    setDeletingPromotion(null);
  };

  // Render Status Badge
  const renderStatusBadge = (promo: Promotion) => {
    const effStatus = getPromotionEffectiveStatus(promo);

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
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans" id="promotion-management-view">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <Percent size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Khuyến Mãi
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {stats.total} mã
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Thiết lập mã giảm giá, voucher ưu đãi, điều kiện và theo dõi lượt sử dụng
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPromotion(null);
            setIsFormModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
          id="btn-create-promotion"
        >
          <Plus size={15} className="text-amber-400" />
          <span>Tạo khuyến mãi</span>
        </button>
      </div>

      {/* 2. STATS 4 CARDS - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div
          onClick={() => setStatusFilter('all')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'all'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả mã :</span>
          <span className="text-xs font-black text-neutral-900">
            {stats.total} <span className="font-semibold text-neutral-500">mã</span>
          </span>
        </div>

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
            <span>Đang áp dụng :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {stats.activeCount} <span className="font-semibold text-emerald-700">mã</span>
          </span>
        </div>

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
            {stats.upcomingCount} <span className="font-semibold text-blue-700">mã</span>
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('Hết hạn')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Hết hạn'
              ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>⚠️</span>
            <span>Đã hết hạn :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {stats.expiredCount} <span className="font-semibold text-rose-700">mã</span>
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
              placeholder="Tìm kiếm theo mã (SOLE20), tên chương trình..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* Status select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Hết hạn">Đã hết hạn</option>
              <option value="Tạm dừng">Tạm dừng</option>
              <option value="Nháp">Bản nháp</option>
            </select>

            {/* Discount Type Select */}
            <select
              value={discountTypeFilter}
              onChange={(e) => setDiscountTypeFilter(e.target.value as any)}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="all">Tất cả loại giảm</option>
              <option value="percent">Giảm theo %</option>
              <option value="fixed">Giảm theo số tiền</option>
            </select>

            {/* Scope Select */}
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as any)}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="all">Mọi phạm vi</option>
              <option value="all">Tất cả sản phẩm</option>
              <option value="category">Theo danh mục</option>
              <option value="brand">Theo thương hiệu</option>
              <option value="product">Theo sản phẩm</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
            >
              <option value="newest">Mới tạo nhất</option>
              <option value="expiring">Hết hạn gần nhất</option>
              <option value="usage">Lượt dùng nhiều nhất</option>
              <option value="value">Giá trị giảm cao nhất</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchQuery || statusFilter !== 'all' || discountTypeFilter !== 'all' || scopeFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <span>
              Tìm thấy <strong className="text-neutral-900">{filteredPromotions.length}</strong> mã khuyến mãi phù hợp
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDiscountTypeFilter('all');
                setScopeFilter('all');
              }}
              className="text-neutral-700 hover:text-black font-bold underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* 4. PROMOTIONS LIST / TABLE */}
      {filteredPromotions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Tag size={32} />
          </div>
          <h3 className="text-base font-black text-neutral-800">Không tìm thấy mã khuyến mãi nào</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Không có kết quả nào khớp với điều kiện tìm kiếm. Hãy thử từ khóa khác hoặc tạo mới chương trình ưu đãi!
          </p>
          <button
            onClick={() => {
              setEditingPromotion(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            + Tạo khuyến mãi mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1100px]">
                <thead className="bg-neutral-50/90 border-b border-neutral-200 text-[11px] font-black text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5 w-12 text-center">STT</th>
                    <th className="py-3.5 px-5 min-w-[140px]">Mã giảm giá</th>
                    <th className="py-3.5 px-5 min-w-[200px]">Tên chương trình</th>
                    <th className="py-3.5 px-5 min-w-[120px]">Loại giảm</th>
                    <th className="py-3.5 px-5 min-w-[120px]">Giá trị giảm</th>
                    <th className="py-3.5 px-5 min-w-[130px]">Đơn tối thiểu</th>
                    <th className="py-3.5 px-5 min-w-[170px]">Thời gian áp dụng</th>
                    <th className="py-3.5 px-5 min-w-[110px]">Lượt sử dụng</th>
                    <th className="py-3.5 px-5 text-center min-w-[130px]">Trạng thái</th>
                    <th className="py-3.5 px-5 text-right min-w-[100px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPromotions.map((promo, idx) => {
                    const usagePercent = promo.maxUsageLimit && promo.maxUsageLimit > 0
                      ? Math.min(100, Math.round((promo.usedCount / promo.maxUsageLimit) * 100))
                      : null;

                    return (
                      <tr key={promo.id} className="hover:bg-neutral-50/80 transition-colors group">
                        {/* STT */}
                        <td className="py-4 px-5 text-center text-neutral-400 font-bold">{idx + 1}</td>

                        {/* Mã giảm giá */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCode(promo.code)}
                              title="Click để sao chép mã"
                              className="font-black text-xs px-2.5 py-1 rounded-xl bg-neutral-900 text-white tracking-wider hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{promo.code}</span>
                              {copiedCode === promo.code ? (
                                <Check size={11} className="text-emerald-400" />
                              ) : (
                                <Copy size={11} className="text-neutral-400 group-hover:text-white" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Tên chương trình */}
                        <td className="py-4 px-5">
                          <div>
                            <p className="font-bold text-neutral-900">{promo.name}</p>
                            {promo.description && (
                              <p className="text-[11px] text-neutral-400 max-w-sm">{promo.description}</p>
                            )}
                          </div>
                        </td>

                        {/* Loại giảm */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            promo.discountType === 'percent' ? 'text-indigo-600' : 'text-emerald-600'
                          }`}>
                            {promo.discountType === 'percent' ? (
                              <>
                                <Percent size={13} />
                                <span>Giảm theo %</span>
                              </>
                            ) : (
                              <>
                                <DollarSign size={13} />
                                <span>Giảm theo tiền</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Giá trị giảm */}
                        <td className="py-4 px-5">
                          <div className="font-black text-neutral-900">
                            {formatPromotionValue(promo)}
                          </div>
                        </td>

                        {/* Đơn tối thiểu */}
                        <td className="py-4 px-5">
                          <span className="font-medium text-neutral-700">
                            {promo.minOrderValue ? formatPrice(promo.minOrderValue) : 'Không yêu cầu'}
                          </span>
                        </td>

                        {/* Thời gian */}
                        <td className="py-4 px-5">
                          <div className="space-y-0.5 text-[11px] text-neutral-600">
                            <div><span className="text-neutral-400">Từ:</span> {formatPromotionDateTime(promo.startDate)}</div>
                            <div><span className="text-neutral-400">Đến:</span> {formatPromotionDateTime(promo.endDate)}</div>
                          </div>
                        </td>

                        {/* Lượt dùng */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <div className="font-bold text-neutral-800">
                              {promo.usedCount} / {promo.maxUsageLimit ? promo.maxUsageLimit : '∞'}
                            </div>
                            {usagePercent !== null && (
                              <div className="w-20 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    usagePercent >= 100
                                      ? 'bg-rose-500'
                                      : usagePercent >= 80
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${usagePercent}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-4 px-5 text-center">
                          {renderStatusBadge(promo)}
                        </td>

                        {/* Thao tác */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailPromotion(promo)}
                              title="Xem chi tiết & danh sách đơn đã dùng"
                              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() => {
                                setEditingPromotion(promo);
                                setIsFormModalOpen(true);
                              }}
                              title="Chỉnh sửa khuyến mãi"
                              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              onClick={() => setDeletingPromotion(promo)}
                              title={promo.usedCount > 0 ? 'Tạm dừng / Vô hiệu hóa mã' : 'Xóa mã giảm giá'}
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredPromotions.map((promo) => {
              const usagePercent = promo.maxUsageLimit && promo.maxUsageLimit > 0
                ? Math.min(100, Math.round((promo.usedCount / promo.maxUsageLimit) * 100))
                : null;

              return (
                <div
                  key={promo.id}
                  className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="inline-flex items-center gap-1.5 font-black text-xs px-2.5 py-1 rounded-xl bg-neutral-900 text-white tracking-wider cursor-pointer"
                      >
                        <span>{promo.code}</span>
                        <Copy size={11} className="text-neutral-400" />
                      </button>
                      <h4 className="font-bold text-neutral-900 text-sm mt-1.5">{promo.name}</h4>
                    </div>
                    <div>{renderStatusBadge(promo)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold uppercase">GIÁ TRỊ GIẢM</span>
                      <span className="font-black text-neutral-900">{formatPromotionValue(promo)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-bold uppercase">ĐƠN TỐI THIỂU</span>
                      <span className="font-medium text-neutral-800">
                        {promo.minOrderValue ? formatPrice(promo.minOrderValue) : 'Không'}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-neutral-200/60">
                      <span className="text-[10px] text-neutral-400 block font-bold uppercase">LƯỢT SỬ DỤNG</span>
                      <div className="flex items-center justify-between font-bold text-neutral-800">
                        <span>{promo.usedCount} / {promo.maxUsageLimit || 'Không giới hạn'}</span>
                        {usagePercent !== null && <span className="text-[11px] text-neutral-500">{usagePercent}%</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 space-y-0.5">
                    <div><span className="text-neutral-400">Áp dụng:</span> {formatPromotionDateTime(promo.startDate)} - {formatPromotionDateTime(promo.endDate)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setDetailPromotion(promo)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Xem</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingPromotion(promo);
                        setIsFormModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => setDeletingPromotion(promo)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>{promo.usedCount > 0 ? 'Dừng' : 'Xóa'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. FORM MODAL: TẠO / SỬA KHUYẾN MÃI */}
      <AnimatePresence>
        {isFormModalOpen && (
          <PromotionFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingPromotion(null);
            }}
            promotion={editingPromotion}
            promotions={promotions}
            products={products}
            categories={categories}
            brands={brands}
            onSave={(savedPromo) => {
              if (editingPromotion) {
                setPromotions((prev) =>
                  prev.map((p) => (p.id === savedPromo.id ? savedPromo : p))
                );
                promotionsApi.update(savedPromo.id, savedPromo).catch((err) => console.warn('Update promo in API failed:', err));
                showToast(`Đã cập nhật chương trình "${savedPromo.code}" thành công!`);
              } else {
                setPromotions((prev) => [savedPromo, ...prev]);
                promotionsApi.create(savedPromo).catch((err) => console.warn('Create promo in API failed:', err));
                showToast(`Đã tạo mã khuyến mãi "${savedPromo.code}" thành công!`);
              }
              setIsFormModalOpen(false);
              setEditingPromotion(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* 6. DETAIL MODAL: CHI TIẾT & LỊCH SỬ ĐƠN HÀNG */}
      <AnimatePresence>
        {detailPromotion && (
          <PromotionDetailModal
            isOpen={!!detailPromotion}
            onClose={() => setDetailPromotion(null)}
            promotion={detailPromotion}
            orders={orders}
            products={products}
            onNavigateToOrders={onNavigateToOrders}
          />
        )}
      </AnimatePresence>

      {/* 7. DELETE / PAUSE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingPromotion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingPromotion(null)}
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
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                    deletingPromotion.usedCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {deletingPromotion.usedCount > 0 ? <AlertTriangle size={20} /> : <Trash2 size={20} />}
                  </div>
                  <h3 className="text-base font-black text-neutral-900">
                    {deletingPromotion.usedCount > 0 ? 'Tạm Dừng Khuyến Mãi' : 'Xác Nhận Xóa Khuyến Mãi'}
                  </h3>
                </div>
                <button onClick={() => setDeletingPromotion(null)} className="text-neutral-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-neutral-600">
                {deletingPromotion.usedCount > 0 ? (
                  <div className="space-y-2">
                    <p className="font-bold text-neutral-800">
                      Mã <span className="px-2 py-0.5 bg-neutral-100 rounded-md font-mono text-black">{deletingPromotion.code}</span> đã có{' '}
                      <strong className="text-rose-600">{deletingPromotion.usedCount} đơn hàng</strong> sử dụng thực tế.
                    </p>
                    <p className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800">
                      Để đảm bảo tính toàn vẹn dữ liệu kế toán và báo cáo doanh thu, hệ thống không cho phép xóa vĩnh viễn. Bạn có thể chuyển sang trạng thái <strong>Tạm dừng / Vô hiệu hóa</strong> để khách hàng không thể tiếp tục áp dụng mã này.
                    </p>
                  </div>
                ) : (
                  <p>
                    Bạn có chắc chắn muốn xóa vĩnh viễn mã khuyến mãi{' '}
                    <strong className="text-black font-mono px-1.5 py-0.5 bg-neutral-100 rounded">{deletingPromotion.code}</strong> (
                    {deletingPromotion.name})? Thao tác này không thể hoàn tác.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDeletingPromotion(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDelete(deletingPromotion)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase text-white shadow-md cursor-pointer ${
                    deletingPromotion.usedCount > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {deletingPromotion.usedCount > 0 ? 'Tạm dừng mã này' : 'Xóa vĩnh viễn'}
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
// SUB-COMPONENT: PROMOTION FORM MODAL (TẠO & SỬA)
// ---------------------------------------------------------------------------
interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  promotions: Promotion[];
  products: Product[];
  categories: CategoryItem[];
  brands: BrandItem[];
  onSave: (promo: Promotion) => void;
}

function PromotionFormModal({
  isOpen,
  onClose,
  promotion,
  promotions,
  products,
  categories,
  brands,
  onSave
}: PromotionFormModalProps) {
  const isEditing = !!promotion;
  const hasOrders = isEditing && (promotion.usedCount > 0);

  // Form States
  const [name, setName] = useState(promotion?.name || '');
  const [code, setCode] = useState(promotion?.code || '');
  const [description, setDescription] = useState(promotion?.description || '');
  const [discountType, setDiscountType] = useState<DiscountType>(promotion?.discountType || 'percent');
  const [discountValue, setDiscountValue] = useState<number | string>(promotion?.discountValue || 10);
  const [minOrderValue, setMinOrderValue] = useState<number | string>(promotion?.minOrderValue || 0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | string>(promotion?.maxDiscountAmount || '');
  const [maxUsageLimit, setMaxUsageLimit] = useState<number | string>(promotion?.maxUsageLimit || 0);
  const [perUserLimit, setPerUserLimit] = useState<number>(promotion?.perUserLimit || 1);

  // Dates (format YYYY-MM-DDTHH:mm)
  const defaultStart = () => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  };
  const defaultEnd = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 16);
  };

  const [startDate, setStartDate] = useState(promotion?.startDate || defaultStart());
  const [endDate, setEndDate] = useState(promotion?.endDate || defaultEnd());
  const [status, setStatus] = useState<Promotion['status']>(promotion?.status || 'Đang hoạt động');
  const [scope, setScope] = useState<PromotionScope>(promotion?.scope || 'all');
  const [targetCategories, setTargetCategories] = useState<string[]>(promotion?.targetCategories || []);
  const [targetBrands, setTargetBrands] = useState<string[]>(promotion?.targetBrands || []);
  const [targetProductIds, setTargetProductIds] = useState<string[]>(promotion?.targetProductIds || []);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto uppercase and clean code
  const handleCodeChange = (val: string) => {
    // Only letters, digits, and hyphens, auto uppercase
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(cleaned);
    if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên chương trình khuyến mãi.';

    if (!code.trim()) {
      newErrors.code = 'Vui lòng nhập mã giảm giá.';
    } else if (!/^[A-Z0-9-]+$/.test(code.trim())) {
      newErrors.code = 'Mã chỉ được chứa chữ cái in hoa, chữ số và dấu gạch ngang (-).';
    } else {
      // Check duplicate code
      const duplicate = promotions.find(
        (p) =>
          !p.isDeleted &&
          p.code.toUpperCase() === code.trim().toUpperCase() &&
          p.id !== promotion?.id
      );
      if (duplicate) {
        newErrors.code = `Mã giảm giá "${code}" đã tồn tại trong hệ thống. Vui lòng chọn mã khác.`;
      }
    }

    const numericDiscount = Number(discountValue);
    if (isNaN(numericDiscount) || numericDiscount <= 0) {
      newErrors.discountValue = 'Giá trị giảm phải lớn hơn 0.';
    } else if (discountType === 'percent' && numericDiscount > 100) {
      newErrors.discountValue = 'Phần trăm giảm không được vượt quá 100%.';
    }

    if (discountType === 'percent' && maxDiscountAmount) {
      const numericMax = Number(maxDiscountAmount);
      if (isNaN(numericMax) || numericMax < 0) {
        newErrors.maxDiscountAmount = 'Số tiền giảm tối đa không được âm.';
      }
    }

    if (minOrderValue) {
      const numericMin = Number(minOrderValue);
      if (isNaN(numericMin) || numericMin < 0) {
        newErrors.minOrderValue = 'Giá trị đơn tối thiểu không được âm.';
      }
    }

    if (maxUsageLimit) {
      const numericUsage = Number(maxUsageLimit);
      if (isNaN(numericUsage) || numericUsage < 0) {
        newErrors.maxUsageLimit = 'Số lượt dùng tối đa không được âm.';
      }
    }

    if (!startDate) newErrors.startDate = 'Vui lòng chọn thời gian bắt đầu.';
    if (!endDate) newErrors.endDate = 'Vui lòng chọn thời gian kết thúc.';

    if (startDate && endDate) {
      const startT = new Date(startDate).getTime();
      const endT = new Date(endDate).getTime();
      if (endT <= startT) {
        newErrors.endDate = 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.';
      }
    }

    if (scope === 'category' && targetCategories.length === 0) {
      newErrors.scope = 'Vui lòng chọn ít nhất 1 danh mục áp dụng.';
    }
    if (scope === 'brand' && targetBrands.length === 0) {
      newErrors.scope = 'Vui lòng chọn ít nhất 1 thương hiệu áp dụng.';
    }
    if (scope === 'product' && targetProductIds.length === 0) {
      newErrors.scope = 'Vui lòng chọn ít nhất 1 sản phẩm áp dụng.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    const savedPromo: Promotion = {
      id: promotion?.id || `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountAmount: discountType === 'percent' && maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      maxUsageLimit: Number(maxUsageLimit) || 0,
      usedCount: promotion?.usedCount || 0,
      perUserLimit: Number(perUserLimit) || 0,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status,
      scope,
      targetCategories: scope === 'category' ? targetCategories : undefined,
      targetBrands: scope === 'brand' ? targetBrands : undefined,
      targetProductIds: scope === 'product' ? targetProductIds : undefined,
      createdAt: promotion?.createdAt || new Date().toLocaleDateString('vi-VN'),
      updatedAt: new Date().toISOString()
    };

    onSave(savedPromo);
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
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 uppercase">
                {isEditing ? `CHỈNH SỬA MÃ ${promotion.code}` : 'TẠO MÃ KHUYẾN MÃI MỚI'}
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                {isEditing ? 'Cập nhật điều kiện và thông tin chương trình ưu đãi' : 'Điền đầy đủ các thông tin để phát hành mã giảm giá'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group 1: Core Information */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} />
              <span>1. Thông tin cơ bản</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Code */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Mã giảm giá <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: SOLE20, FREESHIP"
                  value={code}
                  disabled={hasOrders}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-black tracking-wider uppercase outline-none transition-all ${
                    hasOrders ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed border-neutral-200' : 'focus:border-black'
                  } ${errors.code ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200'}`}
                />
                {hasOrders && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    * Mã đã có đơn hàng sử dụng nên không thể thay đổi tên mã.
                  </p>
                )}
                {errors.code && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.code}</p>}
              </div>

              {/* Program Name */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Tên chương trình <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: SALE THÁNG 8, TRI ÂN KHÁCH HÀNG"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium outline-none focus:border-black ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả quyền lợi hoặc ghi chú nội bộ cho mã khuyến mãi này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black resize-none"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Discount Value & Conditions */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Percent size={14} />
              <span>2. Loại giảm giá & Điều kiện áp dụng</span>
            </h4>

            {/* Discount Type Radio */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-2">
                Loại giảm giá <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setDiscountType('percent')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    discountType === 'percent'
                      ? 'border-black bg-white shadow-sm ring-1 ring-black'
                      : 'border-neutral-200 bg-white hover:bg-neutral-100/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="discountType"
                    checked={discountType === 'percent'}
                    onChange={() => setDiscountType('percent')}
                    className="accent-black"
                  />
                  <div>
                    <span className="font-black text-xs text-neutral-900 block">Giảm theo % (Phần trăm)</span>
                    <span className="text-[11px] text-neutral-400">Ví dụ: Giảm 20% giá trị đơn</span>
                  </div>
                </label>

                <label
                  onClick={() => setDiscountType('fixed')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    discountType === 'fixed'
                      ? 'border-black bg-white shadow-sm ring-1 ring-black'
                      : 'border-neutral-200 bg-white hover:bg-neutral-100/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="discountType"
                    checked={discountType === 'fixed'}
                    onChange={() => setDiscountType('fixed')}
                    className="accent-black"
                  />
                  <div>
                    <span className="font-black text-xs text-neutral-900 block">Giảm theo Số tiền (VNĐ)</span>
                    <span className="text-[11px] text-neutral-400">Ví dụ: Giảm thẳng 100.000 ₫</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Discount Value Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Discount Value */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  {discountType === 'percent' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={discountType === 'percent' ? 100 : undefined}
                    placeholder={discountType === 'percent' ? '20' : '100000'}
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      if (errors.discountValue) setErrors((prev) => ({ ...prev, discountValue: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-black outline-none focus:border-black ${
                      errors.discountValue ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200'
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    {discountType === 'percent' ? '%' : '₫'}
                  </span>
                </div>
                {errors.discountValue && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.discountValue}</p>}
              </div>

              {/* Max Discount Amount (Only for percent) */}
              {discountType === 'percent' ? (
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Giảm tối đa (VNĐ) <span className="text-neutral-400 font-normal">(Để trống nếu không giới hạn)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      placeholder="VD: 200000"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₫</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">VD: Giảm 20% nhưng tối đa không quá 200.000 ₫</p>
                </div>
              ) : (
                <div className="flex items-center text-xs text-neutral-500 p-3 bg-neutral-100 rounded-xl">
                  <span>Mã giảm theo số tiền cố định trừ trực tiếp vào đơn hàng.</span>
                </div>
              )}

              {/* Min Order Value */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Giá trị đơn hàng tối thiểu (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    placeholder="VD: 500000"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₫</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">Khách phải mua tối thiểu số tiền này để mã có hiệu lực</p>
              </div>

              {/* Per User Limit */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Giới hạn mỗi khách hàng</label>
                <select
                  value={perUserLimit}
                  onChange={(e) => setPerUserLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
                >
                  <option value={0}>Không giới hạn số lần</option>
                  <option value={1}>Chỉ 1 lần duy nhất / mỗi tài khoản</option>
                  <option value={2}>Tối đa 2 lần / mỗi tài khoản</option>
                  <option value={3}>Tối đa 3 lần / mỗi tài khoản</option>
                  <option value={5}>Tối đa 5 lần / mỗi tài khoản</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">Kiểm tra theo User ID / Email trong lịch sử mua hàng</p>
              </div>

              {/* Max total usage */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Tổng số lượt sử dụng tối đa <span className="text-neutral-400 font-normal">(0 = Không giới hạn)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="VD: 500 (Để 0 nếu không giới hạn)"
                  value={maxUsageLimit}
                  onChange={(e) => setMaxUsageLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Scope & Scope Selection */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} />
              <span>3. Phạm vi áp dụng</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: 'all', label: 'Tất cả sản phẩm' },
                  { id: 'category', label: 'Theo danh mục' },
                  { id: 'brand', label: 'Theo thương hiệu' },
                  { id: 'product', label: 'Theo sản phẩm' },
                ] as { id: PromotionScope; label: string }[]
              ).map((sc) => (
                <button
                  type="button"
                  key={sc.id}
                  onClick={() => setScope(sc.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    scope === sc.id
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Sub-selector based on Scope */}
            {scope === 'category' && (
              <div className="space-y-2 pt-2 bg-white p-4 rounded-xl border border-neutral-200">
                <label className="text-xs font-bold text-neutral-800 block">
                  Chọn các danh mục áp dụng: <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = targetCategories.includes(cat.name);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setTargetCategories((prev) =>
                            isSelected ? prev.filter((c) => c !== cat.name) : [...prev, cat.name]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white font-bold'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cat.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
                {errors.scope && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.scope}</p>}
              </div>
            )}

            {scope === 'brand' && (
              <div className="space-y-2 pt-2 bg-white p-4 rounded-xl border border-neutral-200">
                <label className="text-xs font-bold text-neutral-800 block">
                  Chọn các thương hiệu áp dụng: <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => {
                    const isSelected = targetBrands.includes(b.name);
                    return (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => {
                          setTargetBrands((prev) =>
                            isSelected ? prev.filter((brand) => brand !== b.name) : [...prev, b.name]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white font-bold'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {b.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
                {errors.scope && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.scope}</p>}
              </div>
            )}

            {scope === 'product' && (
              <div className="space-y-2 pt-2 bg-white p-4 rounded-xl border border-neutral-200">
                <label className="text-xs font-bold text-neutral-800 block">
                  Chọn các sản phẩm áp dụng: <span className="text-rose-500">*</span>
                </label>
                <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-1">
                  {products.map((p) => {
                    const isSelected = targetProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setTargetProductIds((prev) =>
                            isSelected ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                          );
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isSelected ? 'bg-neutral-100 font-bold text-black' : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} alt={p.name} className="h-8 w-8 object-contain rounded-lg bg-white p-0.5 border border-neutral-200" />
                          <div>
                            <p className="line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-neutral-400">{p.brand} • {formatPrice(p.price)}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="accent-black h-4 w-4 rounded"
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.scope && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.scope}</p>}
              </div>
            )}
          </div>

          {/* Group 4: Validity Period & Status */}
          <div className="space-y-4 bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} />
              <span>4. Thời gian hiệu lực & Trạng thái</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Thời gian bắt đầu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium outline-none focus:border-black ${
                    errors.startDate ? 'border-rose-500' : 'border-neutral-200'
                  }`}
                />
                {errors.startDate && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Thời gian kết thúc <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium outline-none focus:border-black ${
                    errors.endDate ? 'border-rose-500' : 'border-neutral-200'
                  }`}
                />
                {errors.endDate && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.endDate}</p>}
              </div>

              {/* Status */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-neutral-700 block mb-1">Trạng thái quản trị</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 outline-none focus:border-black cursor-pointer"
                >
                  <option value="Đang hoạt động">Đang hoạt động (Tự động tính theo thời gian)</option>
                  <option value="Tạm dừng">Tạm dừng (Khóa mã tạm thời)</option>
                  <option value="Nháp">Bản nháp (Chưa kích hoạt)</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Hệ thống tự động chuyển sang <strong>"Sắp diễn ra"</strong> nếu chưa đến giờ bắt đầu, hoặc <strong>"Đã hết hạn"</strong> khi qua thời gian kết thúc hoặc hết lượt dùng.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              {isEditing ? 'Lưu thay đổi' : 'Phát hành khuyến mãi'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: PROMOTION DETAIL MODAL (CHI TIẾT & ĐƠN HÀNG SỬ DỤNG)
// ---------------------------------------------------------------------------
interface PromotionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion;
  orders: Order[];
  products: Product[];
  onNavigateToOrders?: (orderCodeOrQuery?: string) => void;
}

function PromotionDetailModal({
  isOpen,
  onClose,
  promotion,
  orders,
  products,
  onNavigateToOrders
}: PromotionDetailModalProps) {
  // Query all orders that applied this promo code
  const usedOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.discountCode?.toUpperCase() === promotion.code.toUpperCase() ||
        o.promotionId === promotion.id
    );
  }, [orders, promotion]);

  const totalDiscountGranted = useMemo(() => {
    return usedOrders.reduce((acc, o) => acc + (o.discount || 0), 0);
  }, [usedOrders]);

  const totalRevenueWithPromo = useMemo(() => {
    return usedOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  }, [usedOrders]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-lg">
              %
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-black px-2 py-0.5 bg-neutral-100 rounded-lg">
                  {promotion.code}
                </span>
                <span className="text-sm font-bold text-neutral-800">{promotion.name}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">Khởi tạo ngày: {promotion.createdAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1">
            <X size={20} />
          </button>
        </div>

        {/* 3 Metric cards for this promo */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
            <span className="text-[10px] font-black text-neutral-400 uppercase block">ĐÃ SỬ DỤNG</span>
            <span className="text-lg sm:text-xl font-black text-neutral-900 mt-0.5 block">
              {promotion.usedCount} <span className="text-xs text-neutral-400 font-normal">/ {promotion.maxUsageLimit || '∞'}</span>
            </span>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
            <span className="text-[10px] font-black text-emerald-600 uppercase block">TỔNG TIỀN ĐÃ GIẢM</span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5 block">
              {formatPrice(totalDiscountGranted)}
            </span>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
            <span className="text-[10px] font-black text-neutral-400 uppercase block">DOANH THU KÉO THEO</span>
            <span className="text-lg sm:text-xl font-black text-neutral-900 mt-0.5 block">
              {formatPrice(totalRevenueWithPromo)}
            </span>
          </div>
        </div>

        {/* Detailed Condition specs */}
        <div className="space-y-3 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200 text-xs mb-6">
          <h4 className="font-black text-neutral-900 uppercase tracking-wider text-[11px]">Chi tiết quy định mã</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
            <div>
              <span className="text-neutral-400">Loại giảm giá:</span>{' '}
              <strong className="text-neutral-900">
                {promotion.discountType === 'percent' ? 'Giảm theo phần trăm (%)' : 'Giảm theo số tiền (VNĐ)'}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Giá trị giảm:</span>{' '}
              <strong className="text-neutral-900">{formatPromotionValue(promotion)}</strong>
            </div>
            <div>
              <span className="text-neutral-400">Đơn tối thiểu:</span>{' '}
              <strong className="text-neutral-900">
                {promotion.minOrderValue ? formatPrice(promotion.minOrderValue) : 'Không giới hạn'}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Giới hạn mỗi khách:</span>{' '}
              <strong className="text-neutral-900">
                {promotion.perUserLimit ? `${promotion.perUserLimit} lần / tài khoản` : 'Không giới hạn'}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Thời gian bắt đầu:</span>{' '}
              <strong className="text-neutral-900">{formatPromotionDateTime(promotion.startDate)}</strong>
            </div>
            <div>
              <span className="text-neutral-400">Thời gian kết thúc:</span>{' '}
              <strong className="text-neutral-900">{formatPromotionDateTime(promotion.endDate)}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-neutral-400">Phạm vi áp dụng:</span>{' '}
              <strong className="text-neutral-900">
                {promotion.scope === 'all' && 'Tất cả sản phẩm trên toàn cửa hàng'}
                {promotion.scope === 'category' && `Danh mục: ${promotion.targetCategories?.join(', ')}`}
                {promotion.scope === 'brand' && `Thương hiệu: ${promotion.targetBrands?.join(', ')}`}
                {promotion.scope === 'product' && `Áp dụng cho ${promotion.targetProductIds?.length || 0} sản phẩm chỉ định`}
              </strong>
            </div>
            {promotion.description && (
              <div className="sm:col-span-2 pt-1 border-t border-neutral-200">
                <span className="text-neutral-400">Mô tả:</span> <span className="italic">{promotion.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* List of Orders using this Promo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag size={14} />
              <span>Danh sách đơn hàng áp dụng ({usedOrders.length})</span>
            </h4>
          </div>

          {usedOrders.length === 0 ? (
            <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-400 text-xs font-medium">
              Chưa có đơn hàng nào áp dụng mã giảm giá này.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
              {usedOrders.map((ord) => (
                <div key={ord.id} className="p-3 bg-white hover:bg-neutral-50 flex items-center justify-between text-xs transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{ord.orderCode}</span>
                      <span className="text-neutral-500 font-medium">• {ord.recipientName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{ord.orderDate} • {(ord.items || []).length} món</p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-emerald-600">- {formatPrice(ord.discount)}</p>
                    <p className="text-[11px] text-neutral-500">Tổng trả: {formatPrice(ord.grandTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-neutral-100 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
}
