import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Download,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  Building2,
  Truck,
  ArrowUpDown,
  Calendar,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { Order, PaymentTransaction } from '../../types';

interface PaymentManagementProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showToast: (msg: string) => void;
  onNavigateToOrders?: (orderQuery?: string) => void;
}

export default function PaymentManagement({
  orders,
  setOrders,
  showToast,
  onNavigateToOrders
}: PaymentManagementProps) {
  // 1. Search, Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'cod' | 'banking' | 'momo' | 'vnpay' | 'zalopay'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Đã thanh toán' | 'Chưa thanh toán' | 'Đã hoàn tiền'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-desc' | 'amount-asc'>('newest');

  // 2. Selected Transaction for Detail Modal
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [auditNote, setAuditNote] = useState('');
  const [bankRefCode, setBankRefCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 3. Persistent Local Storage for Audit Notes and Custom Bank References
  const [accountingNotes, setAccountingNotes] = useState<Record<string, { note: string; bankRef: string; refundReason?: string }>>(() => {
    try {
      const saved = localStorage.getItem('nkicks_payment_audit_notes_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nkicks_payment_audit_notes_v1', JSON.stringify(accountingNotes));
    } catch (e) {
      console.error(e);
    }
  }, [accountingNotes]);

  // 4. Derive Payment Transactions from Orders list
  const transactions: PaymentTransaction[] = useMemo(() => {
    return orders.map((order) => {
      const audit = (accountingNotes[order.id] || {}) as { note?: string; bankRef?: string; refundReason?: string };
      const status: 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hoàn tiền' = 
        order.paymentStatus === 'Đã hoàn tiền'
          ? 'Đã hoàn tiền'
          : order.paymentStatus === 'Đã thanh toán'
            ? 'Đã thanh toán'
            : 'Chưa thanh toán';

      return {
        id: `TXN-${order.orderCode}`,
        orderId: order.id,
        orderCode: order.orderCode,
        recipientName: order.recipientName,
        phone: order.phone,
        paymentMethod: order.paymentMethod || 'cod',
        amount: order.grandTotal,
        transactionId: order.transactionId || `TXN-${order.orderCode}`,
        paymentDate: order.orderDate,
        paymentStatus: status,
        note: audit.note || order.note,
        bankRefNo: audit.bankRef || (order.paymentMethod === 'banking' ? `MB-${order.orderCode.slice(-6)}` : undefined),
        refundReason: audit.refundReason || order.cancelReason
      };
    });
  }, [orders, accountingNotes]);

  // 5. Calculate KPI Metrics
  const stats = useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let totalRefunded = 0;
    let countPaid = 0;
    let countPending = 0;
    let countRefunded = 0;

    const methodStats: Record<string, { count: number; total: number }> = {
      cod: { count: 0, total: 0 },
      banking: { count: 0, total: 0 },
      momo: { count: 0, total: 0 },
      vnpay: { count: 0, total: 0 },
      zalopay: { count: 0, total: 0 }
    };

    transactions.forEach((txn) => {
      if (txn.paymentStatus === 'Đã thanh toán') {
        totalPaid += txn.amount;
        countPaid += 1;
      } else if (txn.paymentStatus === 'Chưa thanh toán') {
        totalPending += txn.amount;
        countPending += 1;
      } else if (txn.paymentStatus === 'Đã hoàn tiền') {
        totalRefunded += txn.amount;
        countRefunded += 1;
      }

      const m = txn.paymentMethod;
      if (methodStats[m]) {
        methodStats[m].count += 1;
        methodStats[m].total += txn.amount;
      }
    });

    const totalTransactions = transactions.length;
    const successRate = totalTransactions > 0 ? ((countPaid / totalTransactions) * 100).toFixed(1) : '0';

    return {
      totalPaid,
      totalPending,
      totalRefunded,
      countPaid,
      countPending,
      countRefunded,
      totalTransactions,
      successRate,
      methodStats
    };
  }, [transactions]);

  // 6. Filter & Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        txn.transactionId?.toLowerCase().includes(q) ||
        txn.orderCode.toLowerCase().includes(q) ||
        txn.recipientName.toLowerCase().includes(q) ||
        txn.phone.includes(q) ||
        txn.bankRefNo?.toLowerCase().includes(q);

      // Method filter
      const matchMethod = selectedMethod === 'all' || txn.paymentMethod === selectedMethod;

      // Status filter
      const matchStatus = selectedStatus === 'all' || txn.paymentStatus === selectedStatus;

      // Date filter
      let matchDate = true;
      if (dateFilter !== 'all' && txn.paymentDate) {
        const txnDate = new Date(txn.paymentDate);
        const now = new Date();
        if (dateFilter === 'today') {
          matchDate = txnDate.toDateString() === now.toDateString();
        } else if (dateFilter === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchDate = txnDate >= sevenDaysAgo;
        } else if (dateFilter === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchDate = txnDate >= thirtyDaysAgo;
        }
      }

      return matchQuery && matchMethod && matchStatus && matchDate;
    }).sort((a, b) => {
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      if (sortBy === 'oldest') {
        return new Date(a.paymentDate || 0).getTime() - new Date(b.paymentDate || 0).getTime();
      }
      // default newest
      return new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime();
    });
  }, [transactions, searchQuery, selectedMethod, selectedStatus, dateFilter, sortBy]);

  // 7. Actions: Update Payment Status
  const handleUpdateStatus = (orderId: string, newStatus: 'Đã thanh toán' | 'Chưa thanh toán' | 'Đã hoàn tiền', reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus: newStatus,
            cancelReason: reason ? reason : o.cancelReason
          };
        }
        return o;
      })
    );

    if (reason) {
      setAccountingNotes((prev) => ({
        ...prev,
        [orderId]: {
          ...(prev[orderId] || { note: '', bankRef: '' }),
          refundReason: reason
        }
      }));
    }

    showToast(`Đã cập nhật trạng thái thanh toán thành "${newStatus}"!`);
  };

  // 8. Save Audit Notes for a Transaction
  const handleSaveAudit = () => {
    if (!selectedTxn) return;
    setAccountingNotes((prev) => ({
      ...prev,
      [selectedTxn.orderId]: {
        note: auditNote,
        bankRef: bankRefCode,
        refundReason: prev[selectedTxn.orderId]?.refundReason
      }
    }));
    showToast('Đã lưu ghi chú đối soát kế toán thành công!');
    setIsDetailModalOpen(false);
  };

  // 9. Copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`Đã sao chép "${text}"`);
  };

  // 10. Export to CSV
  const handleExportCSV = () => {
    const headers = ['Mã Giao Dịch', 'Mã Đơn Hàng', 'Khách Hàng', 'Số Điện Thoại', 'Phương Thức', 'Số Tiền (VND)', 'Trạng Thái', 'Ngày Giao Dịch', 'Mã Ngân Hàng', 'Ghi Chú'];
    const rows = filteredTransactions.map((t) => [
      t.transactionId || '',
      t.orderCode,
      `"${t.recipientName}"`,
      `"${t.phone}"`,
      getMethodLabel(t.paymentMethod),
      t.amount,
      t.paymentStatus,
      t.paymentDate || '',
      t.bankRefNo || '',
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Thanh_Toan_NKICKS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất báo cáo thanh toán thành công!');
  };

  // Helpers for UI
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'banking':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Building2 size={13} className="text-blue-600" />
            <span>Chuyển khoản QR</span>
          </span>
        );
      case 'momo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
            <Smartphone size={13} className="text-fuchsia-600" />
            <span>Ví MoMo</span>
          </span>
        );
      case 'vnpay':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <CreditCard size={13} className="text-sky-600" />
            <span>VNPay QR</span>
          </span>
        );
      case 'zalopay':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Smartphone size={13} className="text-emerald-600" />
            <span>ZaloPay</span>
          </span>
        );
      case 'cod':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Truck size={13} className="text-amber-600" />
            <span>COD (Thu hộ)</span>
          </span>
        );
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'banking': return 'Chuyển khoản QR (Banking)';
      case 'momo': return 'Ví MoMo';
      case 'vnpay': return 'VNPay';
      case 'zalopay': return 'ZaloPay';
      case 'cod': default: return 'COD (Thu tiền khi giao)';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'Đã hoàn tiền':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <RotateCcw size={13} className="text-purple-600" />
            <span>Đã hoàn tiền</span>
          </span>
        );
      case 'Chưa thanh toán':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            <span>Chờ thanh toán</span>
          </span>
        );
    }
  };

  // Find linked order for modal
  const linkedOrder = useMemo(() => {
    if (!selectedTxn) return null;
    return orders.find((o) => o.id === selectedTxn.orderId) || null;
  }, [selectedTxn, orders]);

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto antialiased">
      {/* 1. Header Section - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <CreditCard size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Thanh Toán & Đối Soát
            </h1>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Theo dõi dòng tiền, phương thức giao dịch, trạng thái thu hộ COD và đối soát chuyển khoản ngân hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs cursor-pointer"
            title="Xuất danh sách ra file Excel / CSV"
          >
            <Download size={13} className="text-neutral-600" />
            <span>Xuất báo cáo CSV</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Financial KPI Stat Cards - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Received */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-neutral-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Doanh thu thực nhận</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-neutral-900 mt-1">
            {formatCurrency(stats.totalPaid)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600">
            <span>{stats.countPaid} giao dịch đã hoàn tất</span>
          </div>
        </div>

        {/* Card 2: Total Pending / COD */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-neutral-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Chờ thu / COD đối soát</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={15} />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-amber-600 mt-1">
            {formatCurrency(stats.totalPending)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-700">
            <span>{stats.countPending} đơn đang chờ tiền về</span>
          </div>
        </div>

        {/* Card 3: Total Refunded */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-neutral-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Đã hoàn trả (Refund)</span>
            <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw size={15} />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-purple-700 mt-1">
            {formatCurrency(stats.totalRefunded)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-purple-600">
            <span>{stats.countRefunded} đơn hoàn tiền thành công</span>
          </div>
        </div>

        {/* Card 4: Success Rate */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-neutral-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Tỷ lệ thanh toán</span>
            <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={15} />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-black text-blue-600 mt-1">
            {stats.successRate}%
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-neutral-500">
            <span>Trên {stats.totalTransactions} đơn hàng</span>
          </div>
        </div>
      </div>

      {/* 3. Compact Payment Methods Bar / Filter Chips */}
      <div className="bg-white rounded-xl px-3.5 py-2.5 border border-neutral-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
          <Receipt size={14} className="text-amber-500" />
          <span className="uppercase tracking-wider text-[11px] font-black text-neutral-600">Cổng thanh toán:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Tất cả */}
          <button
            type="button"
            onClick={() => setSelectedMethod('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedMethod === 'all'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <span>Tất cả</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedMethod === 'all' ? 'bg-neutral-700 text-neutral-100' : 'bg-neutral-200 text-neutral-700'
            }`}>{stats.totalTransactions}</span>
          </button>

          {/* COD */}
          <button
            type="button"
            onClick={() => setSelectedMethod(selectedMethod === 'cod' ? 'all' : 'cod')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedMethod === 'cod'
                ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
          >
            <Truck size={13} className="text-amber-600" />
            <span>COD:</span>
            <span className="font-extrabold text-neutral-900">{formatCurrency(stats.methodStats.cod.total)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-800 font-semibold">{stats.methodStats.cod.count}</span>
          </button>

          {/* Banking */}
          <button
            type="button"
            onClick={() => setSelectedMethod(selectedMethod === 'banking' ? 'all' : 'banking')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedMethod === 'banking'
                ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-400/20 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
          >
            <Building2 size={13} className="text-blue-600" />
            <span>QR Bank:</span>
            <span className="font-extrabold text-neutral-900">{formatCurrency(stats.methodStats.banking.total)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100/80 text-blue-800 font-semibold">{stats.methodStats.banking.count}</span>
          </button>

          {/* MoMo */}
          <button
            type="button"
            onClick={() => setSelectedMethod(selectedMethod === 'momo' ? 'all' : 'momo')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedMethod === 'momo'
                ? 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-900 ring-2 ring-fuchsia-400/20 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
          >
            <Smartphone size={13} className="text-fuchsia-600" />
            <span>Ví MoMo:</span>
            <span className="font-extrabold text-neutral-900">{formatCurrency(stats.methodStats.momo.total)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-fuchsia-100/80 text-fuchsia-800 font-semibold">{stats.methodStats.momo.count}</span>
          </button>

          {/* VNPay */}
          <button
            type="button"
            onClick={() => setSelectedMethod(selectedMethod === 'vnpay' ? 'all' : 'vnpay')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedMethod === 'vnpay'
                ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-400/20 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}
          >
            <CreditCard size={13} className="text-sky-600" />
            <span>VNPay:</span>
            <span className="font-extrabold text-neutral-700">{formatCurrency(stats.methodStats.vnpay.total)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/80 text-neutral-600 font-semibold">{stats.methodStats.vnpay.count}</span>
          </button>

          {/* ZaloPay */}
          <button
            type="button"
            onClick={() => setSelectedMethod(selectedMethod === 'zalopay' ? 'all' : 'zalopay')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedMethod === 'zalopay'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/20 shadow-2xs'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}
          >
            <Smartphone size={13} className="text-emerald-600" />
            <span>ZaloPay:</span>
            <span className="font-extrabold text-neutral-700">{formatCurrency(stats.methodStats.zalopay.total)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200/80 text-neutral-600 font-semibold">{stats.methodStats.zalopay.count}</span>
          </button>
        </div>
      </div>

      {/* 4. Filter Toolbar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã GD, Mã đơn, Tên KH, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-neutral-200 bg-neutral-50/80 text-xs font-medium focus:bg-white focus:border-black outline-hidden transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/80 text-xs font-semibold focus:bg-white focus:border-black outline-hidden cursor-pointer"
            >
              <option value="all">Mọi trạng thái thanh toán</option>
              <option value="Đã thanh toán">Đã thanh toán (Thành công)</option>
              <option value="Chưa thanh toán">Chờ thanh toán (Chưa thu)</option>
              <option value="Đã hoàn tiền">Đã hoàn tiền (Refunded)</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/80 text-xs font-semibold focus:bg-white focus:border-black outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="cod">COD (Thanh toán khi nhận)</option>
              <option value="banking">Chuyển khoản QR (Banking)</option>
              <option value="momo">Ví MoMo</option>
              <option value="vnpay">VNPay</option>
              <option value="zalopay">ZaloPay</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/80 text-xs font-semibold focus:bg-white focus:border-black outline-hidden cursor-pointer"
            >
              <option value="all">Toàn bộ thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
            </select>
          </div>
        </div>

        {/* Results summary & active filter chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2 text-neutral-500 font-medium">
            <span>Tìm thấy <strong className="text-neutral-900">{filteredTransactions.length}</strong> giao dịch</span>
            {(searchQuery || selectedMethod !== 'all' || selectedStatus !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMethod('all');
                  setSelectedStatus('all');
                  setDateFilter('all');
                }}
                className="text-amber-600 font-bold hover:underline cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-neutral-600">
            <ArrowUpDown size={13} />
            <span className="font-medium text-[11px]">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-xs text-neutral-900 border-none outline-hidden cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="amount-desc">Số tiền cao nhất</option>
              <option value="amount-asc">Số tiền thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Transactions Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 px-5">Mã Giao Dịch</th>
                <th className="py-3.5 px-5">Đơn Hàng Liên Kết</th>
                <th className="py-3.5 px-5">Khách Hàng</th>
                <th className="py-3.5 px-5">Cổng Thanh Toán</th>
                <th className="py-3.5 px-5 text-right">Số Tiền</th>
                <th className="py-3.5 px-5">Thời Gian</th>
                <th className="py-3.5 px-5 text-center">Trạng Thái</th>
                <th className="py-3.5 px-5 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={32} className="text-neutral-300" />
                      <span>Không tìm thấy giao dịch thanh toán nào phù hợp.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  return (
                    <tr key={txn.id} className="hover:bg-neutral-50/80 transition-colors group">
                      {/* 1. Transaction ID */}
                      <td className="py-4 px-5 font-mono font-bold text-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <span>{txn.transactionId}</span>
                          <button
                            onClick={() => handleCopy(txn.transactionId || '', txn.id)}
                            className="text-neutral-400 hover:text-neutral-900 transition-colors p-0.5 rounded cursor-pointer"
                            title="Sao chép mã giao dịch"
                          >
                            {copiedId === txn.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                        {txn.bankRefNo && (
                          <span className="block text-[10px] text-neutral-400 font-sans mt-0.5">
                            Ref: {txn.bankRefNo}
                          </span>
                        )}
                      </td>

                      {/* 2. Linked Order Code */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => {
                            if (onNavigateToOrders) {
                              onNavigateToOrders(txn.orderCode);
                            }
                          }}
                          className="font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Xem đơn hàng này trong Quản lý đơn hàng"
                        >
                          <span>#{txn.orderCode}</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>

                      {/* 3. Customer */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-neutral-900">{txn.recipientName}</p>
                        <p className="text-[11px] text-neutral-500">{txn.phone}</p>
                      </td>

                      {/* 4. Payment Method */}
                      <td className="py-4 px-5">
                        {getMethodBadge(txn.paymentMethod)}
                      </td>

                      {/* 5. Amount */}
                      <td className="py-4 px-5 text-right font-mono font-black text-neutral-900 text-sm">
                        {formatCurrency(txn.amount)}
                      </td>

                      {/* 6. Date & Time */}
                      <td className="py-4 px-5 text-neutral-500">
                        <span className="block font-medium">
                          {txn.paymentDate ? new Date(txn.paymentDate).toLocaleDateString('vi-VN') : '—'}
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          {txn.paymentDate ? new Date(txn.paymentDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </td>

                      {/* 7. Status Badge */}
                      <td className="py-4 px-5 text-center">
                        {getStatusBadge(txn.paymentStatus)}
                      </td>

                      {/* 8. Quick Actions */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Mark as Paid (if pending) */}
                          {txn.paymentStatus === 'Chưa thanh toán' && (
                            <button
                              onClick={() => handleUpdateStatus(txn.orderId, 'Đã thanh toán')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              title="Xác nhận đã nhận đủ tiền"
                            >
                              <Check size={12} />
                              <span>Đã thu</span>
                            </button>
                          )}

                          {/* Refund Button (if paid) */}
                          {txn.paymentStatus === 'Đã thanh toán' && (
                            <button
                              onClick={() => {
                                setSelectedTxn(txn);
                                setRefundReason('');
                                setIsRefundModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-purple-100 text-neutral-700 hover:text-purple-800 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Hoàn tiền cho đơn hàng này"
                            >
                              <RotateCcw size={12} />
                              <span>Hoàn tiền</span>
                            </button>
                          )}

                          {/* View Detail & Audit */}
                          <button
                            onClick={() => {
                              setSelectedTxn(txn);
                              setAuditNote(txn.note || '');
                              setBankRefCode(txn.bankRefNo || '');
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                            title="Xem chi tiết & Ghi chú đối soát"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Transaction Detail & Audit Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-neutral-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Receipt size={18} className="text-amber-400" />
                  <div>
                    <h3 className="text-sm font-black tracking-wide uppercase">
                      Chi Tiết Giao Dịch & Đối Soát
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {selectedTxn.transactionId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Status and Method Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <div>
                    <span className="text-[11px] text-neutral-400 font-bold uppercase block">Phương thức thanh toán</span>
                    <div className="mt-1">{getMethodBadge(selectedTxn.paymentMethod)}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 font-bold uppercase block">Trạng thái thanh toán</span>
                    <div className="mt-1">{getStatusBadge(selectedTxn.paymentStatus)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 font-bold uppercase block">Tổng tiền giao dịch</span>
                    <p className="text-lg font-black text-neutral-900 mt-0.5">{formatCurrency(selectedTxn.amount)}</p>
                  </div>
                </div>

                {/* Customer and Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                      Thông Tin Khách Hàng
                    </span>
                    <p className="font-bold text-neutral-900 text-sm">{selectedTxn.recipientName}</p>
                    <p className="text-neutral-600 font-mono mt-0.5">{selectedTxn.phone}</p>
                    {linkedOrder?.fullAddress && (
                      <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                        📍 {linkedOrder.fullAddress}
                      </p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                      Thông Tin Đơn Hàng Liên Kết
                    </span>
                    <p className="font-bold text-neutral-900 text-sm">Mã đơn: #{selectedTxn.orderCode}</p>
                    <p className="text-neutral-600 mt-0.5">
                      Thời gian: {selectedTxn.paymentDate ? new Date(selectedTxn.paymentDate).toLocaleString('vi-VN') : '—'}
                    </p>
                    {linkedOrder?.status && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                        Giao hàng: {linkedOrder.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Purchased Items Preview */}
                {linkedOrder && linkedOrder.items && linkedOrder.items.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                      Sản Phẩm Đã Mua ({linkedOrder.items.length})
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-neutral-100 pr-1">
                      {linkedOrder.items.map((item, idx) => (
                        <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900">{item.productName || (item as any).name}</span>
                            {item.size && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                                Size {item.size}
                              </span>
                            )}
                            <span className="text-neutral-400 font-medium">x{item.quantity}</span>
                          </div>
                          <span className="font-bold text-neutral-800 font-mono">
                            {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accounting & Audit Form */}
                <div className="space-y-3 pt-3 border-t border-neutral-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 block flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-amber-500" />
                    <span>Ghi Chú Kế Toán & Mã Tham Chiếu Ngân Hàng</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Mã giao dịch ngân hàng / Ref No.:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: FT262518921820 / MB19283..."
                        value={bankRefCode}
                        onChange={(e) => setBankRefCode(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono font-medium focus:bg-white focus:border-black outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Cập nhật trạng thái thanh toán:
                      </label>
                      <select
                        value={selectedTxn.paymentStatus}
                        onChange={(e) => handleUpdateStatus(selectedTxn.orderId, e.target.value as any)}
                        className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold focus:bg-white focus:border-black outline-hidden cursor-pointer"
                      >
                        <option value="Chưa thanh toán">Chờ thanh toán (Chưa thu)</option>
                        <option value="Đã thanh toán">Đã thanh toán (Hoàn tất)</option>
                        <option value="Đã hoàn tiền">Đã hoàn tiền (Refund)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Ghi chú đối soát nội bộ:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ghi chú xác nhận thu tiền, số tài khoản nhận tiền, hoặc thông tin shipper nộp COD..."
                      value={auditNote}
                      onChange={(e) => setAuditNote(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:border-black outline-hidden resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>In biên lai</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleSaveAudit}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Lưu Thông Tin Đối Soát
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Refund Confirmation Modal */}
      <AnimatePresence>
        {isRefundModalOpen && selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-neutral-200 max-w-md w-full p-6 text-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-neutral-900">Xác Nhận Hoàn Tiền Giao Dịch</h3>
                  <p className="text-neutral-500 font-mono text-[11px]">{selectedTxn.transactionId}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-900">
                <p className="font-semibold">Số tiền cần hoàn trả:</p>
                <p className="text-xl font-black text-purple-700 mt-0.5">{formatCurrency(selectedTxn.amount)}</p>
                <p className="text-[11px] text-purple-600 mt-1">Khách hàng: <strong>{selectedTxn.recipientName}</strong> ({selectedTxn.phone})</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Lý do hoàn tiền (Bắt buộc):
                </label>
                <textarea
                  rows={3}
                  placeholder="VD: Khách trả hàng do sai kích cỡ / Hủy đơn trước khi giao hàng..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:border-black outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    if (!refundReason.trim()) {
                      alert('Vui lòng nhập lý do hoàn tiền!');
                      return;
                    }
                    handleUpdateStatus(selectedTxn.orderId, 'Đã hoàn tiền', refundReason.trim());
                    setIsRefundModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Xác Nhận Hoàn Tiền
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
