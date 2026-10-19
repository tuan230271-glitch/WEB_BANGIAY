import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  RotateCcw,
  Eye,
  Printer,
  XCircle,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShoppingBag,
  Download,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Ban,
  RefreshCw,
  Sliders,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { Order, OrderItem, Product } from '../../types';
import { ordersApi } from '../../services/api';


interface OrderManagementProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  showToast: (msg: string) => void;
  onNavigateToProducts?: () => void;
}

// Preset cancellation reasons
const CANCEL_REASONS = [
  'Khách hàng yêu cầu hủy đơn',
  'Hết size / Hết hàng trong kho',
  'Không thể liên hệ với khách hàng để xác nhận',
  'Địa chỉ nhận hàng không hợp lệ / giao thất bại',
  'Nghi ngờ đơn hàng giả mạo / spam',
  'Khách hàng muốn thay đổi phương thức thanh toán / sản phẩm',
  'Lý do khác'
];

const ORDER_STATUS_FLOW: Order['status'][] = [
  'Chờ xử lý',
  'Đã xác nhận',
  'Đang chuẩn bị hàng',
  'Đang giao',
  'Đã giao'
];

const TIMELINE_STEPS = [
  { key: 'Chờ xử lý', stepNum: 1, title: 'Chờ xử lý', desc: 'Tiếp nhận đơn' },
  { key: 'Đã xác nhận', stepNum: 2, title: 'Đã xác nhận', desc: 'Xác thực đơn hàng' },
  { key: 'Đang chuẩn bị hàng', stepNum: 3, title: 'Đang chuẩn bị hàng', desc: 'Đóng gói sản phẩm' },
  { key: 'Đang giao', stepNum: 4, title: 'Đang giao', desc: 'Bàn giao vận chuyển' },
  { key: 'Đã giao', stepNum: 5, title: 'Đã giao', desc: 'Giao hàng thành công' }
];

const normalizeStatusKey = (st: Order['status']): Order['status'] => {
  if (st === 'Chờ xác nhận') return 'Chờ xử lý';
  if (st === 'Đã giao hàng') return 'Đã giao';
  return st;
};

export default function OrderManagement({
  orders,
  setOrders,
  products,
  setProducts,
  showToast,
  onNavigateToProducts
}: OrderManagementProps) {
  // ----------------------------------------------------
  // 1. TOOLBAR & FILTER STATES
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedPaymentMethodFilter, setSelectedPaymentMethodFilter] = useState<string>('All');
  const [selectedPaymentStatusFilter, setSelectedPaymentStatusFilter] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReasonOption, setCancelReasonOption] = useState(CANCEL_REASONS[0]);
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [shouldRestock, setShouldRestock] = useState(true);

  // Forward Status dropdown state for modal
  const [selectedNextStatus, setSelectedNextStatus] = useState<Order['status']>('Đã xác nhận');

  // Compute forward statuses for currently selected order (strict linear progression without backward steps)
  const forwardStatuses = useMemo(() => {
    if (!selectedOrder) return [];
    const currentNorm = normalizeStatusKey(selectedOrder.status);
    const currentIdx = ORDER_STATUS_FLOW.indexOf(currentNorm);
    if (currentIdx === -1) return []; // Canceled or finished
    return ORDER_STATUS_FLOW.slice(currentIdx + 1);
  }, [selectedOrder?.status]);

  // Sync selectedNextStatus with the next forward step whenever selectedOrder changes
  React.useEffect(() => {
    if (forwardStatuses.length > 0) {
      setSelectedNextStatus(forwardStatuses[0]);
    } else {
      setSelectedNextStatus('' as any);
    }
  }, [forwardStatuses]);

  // Invoice / Print Modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  // Currency Formatter
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // ----------------------------------------------------
  // 2. SUMMARY STATISTICS COMPUTATION
  // ----------------------------------------------------
  const orderStats = useMemo(() => {
    let pendingCount = 0;
    let confirmedCount = 0;
    let preparingCount = 0;
    let shippingCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let totalRev = 0;

    orders.forEach((o) => {
      if (o.status === 'Chờ xử lý' || o.status === 'Chờ xác nhận') pendingCount++;
      else if (o.status === 'Đã xác nhận') confirmedCount++;
      else if (o.status === 'Đang chuẩn bị hàng') preparingCount++;
      else if (o.status === 'Đang giao') shippingCount++;
      else if (o.status === 'Đã giao' || o.status === 'Đã giao hàng') {
        deliveredCount++;
        totalRev += o.grandTotal;
      } else if (o.status === 'Đã hủy') {
        cancelledCount++;
      }
    });

    return {
      total: orders.length,
      pending: pendingCount,
      confirmed: confirmedCount,
      preparing: preparingCount,
      shipping: shippingCount,
      delivered: deliveredCount,
      cancelled: cancelledCount,
      totalRevenue: totalRev
    };
  }, [orders]);

  // ----------------------------------------------------
  // 3. FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search query: orderCode, recipientName, phone, email, fullAddress
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const codeMatch = (order.orderCode || '').toLowerCase().includes(query) || (order.id || '').toLowerCase().includes(query);
        const nameMatch = (order.recipientName || '').toLowerCase().includes(query);
        const phoneMatch = (order.phone || '').toLowerCase().includes(query);
        const emailMatch = order.email ? order.email.toLowerCase().includes(query) : false;
        const addressMatch = (order.fullAddress || '').toLowerCase().includes(query);
        const itemMatch = (order.items || []).some((it) => (it.productName || '').toLowerCase().includes(query));

        if (!codeMatch && !nameMatch && !phoneMatch && !emailMatch && !addressMatch && !itemMatch) {
          return false;
        }
      }

      // Status filter
      if (selectedStatusFilter !== 'All') {
        if (selectedStatusFilter === 'Chờ xử lý') {
          if (order.status !== 'Chờ xử lý' && order.status !== 'Chờ xác nhận') return false;
        } else if (selectedStatusFilter === 'Đã giao') {
          if (order.status !== 'Đã giao' && order.status !== 'Đã giao hàng') return false;
        } else {
          if (order.status !== selectedStatusFilter) return false;
        }
      }

      // Payment method filter
      if (selectedPaymentMethodFilter !== 'All') {
        if (order.paymentMethod !== selectedPaymentMethodFilter) return false;
      }

      // Payment status filter
      if (selectedPaymentStatusFilter !== 'All') {
        const currentPayStatus = order.paymentStatus || (order.paymentMethod === 'cod' && order.status !== 'Đã giao' && order.status !== 'Đã giao hàng' ? 'Chưa thanh toán' : 'Đã thanh toán');
        if (currentPayStatus !== selectedPaymentStatusFilter) return false;
      }

      // Date filter
      if (selectedDateFilter !== 'All') {
        // Date parsing: order.orderDate can be "DD/MM/YYYY - HH:mm" or "DD/MM/YYYY"
        const parts = order.orderDate.split(' ')[0].split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const orderTime = new Date(year, month, day).getTime();
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

          if (selectedDateFilter === 'today') {
            if (orderTime < todayStart) return false;
          } else if (selectedDateFilter === '7days') {
            const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
            if (orderTime < sevenDaysAgo) return false;
          } else if (selectedDateFilter === '30days') {
            const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;
            if (orderTime < thirtyDaysAgo) return false;
          } else if (selectedDateFilter === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate).getTime();
            const end = new Date(customEndDate).setHours(23, 59, 59, 999);
            if (orderTime < start || orderTime > end) return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      } else if (sortBy === 'oldest') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'highest') {
        return b.grandTotal - a.grandTotal;
      } else if (sortBy === 'lowest') {
        return a.grandTotal - b.grandTotal;
      }
      return 0;
    });
  }, [
    orders,
    searchQuery,
    selectedStatusFilter,
    selectedPaymentMethodFilter,
    selectedPaymentStatusFilter,
    selectedDateFilter,
    customStartDate,
    customEndDate,
    sortBy
  ]);

  // ----------------------------------------------------
  // 4. PAGINATION CALCULATIONS
  // ----------------------------------------------------
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatusFilter('All');
    setSelectedPaymentMethodFilter('All');
    setSelectedPaymentStatusFilter('All');
    setSelectedDateFilter('All');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Đã làm mới bộ lọc danh sách đơn hàng!');
  };

  // ----------------------------------------------------
  // 5. STATUS BADGE STYLING HELPER
  // ----------------------------------------------------
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xử lý':
      case 'Chờ xác nhận':
        return {
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-400/20',
          dotClass: 'bg-amber-500 animate-pulse',
          icon: Clock,
          label: 'Chờ xử lý'
        };
      case 'Đã xác nhận':
        return {
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20',
          dotClass: 'bg-blue-500',
          icon: CheckCircle2,
          label: 'Đã xác nhận'
        };
      case 'Đang chuẩn bị hàng':
        return {
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20',
          dotClass: 'bg-blue-500',
          icon: Package,
          label: 'Đang chuẩn bị hàng'
        };
      case 'Đang giao':
        return {
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20',
          dotClass: 'bg-blue-500 animate-bounce',
          icon: Truck,
          label: 'Đang giao'
        };
      case 'Đã giao':
      case 'Đã giao hàng':
        return {
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-400/20',
          dotClass: 'bg-emerald-500',
          icon: CheckCircle2,
          label: 'Đã giao hàng'
        };
      case 'Đã hủy':
        return {
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-400/20',
          dotClass: 'bg-rose-500',
          icon: Ban,
          label: 'Đã hủy'
        };
      default:
        return {
          badgeClass: 'bg-neutral-100 text-neutral-700 border-neutral-200',
          dotClass: 'bg-neutral-400',
          icon: Clock,
          label: status
        };
    }
  };

  const getPaymentMethodBadge = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'cod':
        return { label: 'COD', full: 'Thanh toán khi nhận hàng (COD)', class: 'bg-neutral-100 text-neutral-800 border-neutral-300' };
      case 'banking':
        return { label: 'Banking', full: 'Chuyển khoản ngân hàng', class: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'momo':
        return { label: 'MoMo', full: 'Ví điện tử MoMo', class: 'bg-pink-50 text-pink-700 border-pink-200' };
      case 'vnpay':
        return { label: 'VNPAY', full: 'Cổng thanh toán VNPAY-QR', class: 'bg-red-50 text-red-700 border-red-200' };
      case 'zalopay':
        return { label: 'ZaloPay', full: 'Ví điện tử ZaloPay', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Thanh toán', full: 'Thanh toán trực tiếp', class: 'bg-neutral-100 text-neutral-800 border-neutral-300' };
    }
  };

  // ----------------------------------------------------
  // 6. ORDER STATUS TRANSITIONS
  // ----------------------------------------------------
  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const nowFormattedDate = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -');

    // Sync order status directly to Supabase PostgreSQL
    ordersApi.updateStatus(orderId, newStatus).catch((err) => {
      console.warn('API update order status failed:', err);
    });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderCode === orderId) {
          const isDelivered = newStatus === 'Đã giao' || newStatus === 'Đã giao hàng';

          // Build updated tracking timeline
          const existingTimeline = o.trackingTimeline && o.trackingTimeline.length > 0
            ? [...o.trackingTimeline]
            : [{ title: 'Chờ xử lý', time: o.orderDate || nowFormattedDate, completed: true }];

          const normNew = normalizeStatusKey(newStatus);
          const targetIdx = ORDER_STATUS_FLOW.indexOf(normNew);

          ORDER_STATUS_FLOW.forEach((stepName, sIdx) => {
            if (sIdx <= targetIdx) {
              const existing = existingTimeline.find((t) => t.title === stepName);
              if (!existing) {
                existingTimeline.push({
                  title: stepName,
                  time: sIdx === 0 ? (o.orderDate || nowFormattedDate) : nowFormattedDate,
                  completed: true,
                  current: sIdx === targetIdx
                });
              } else {
                existing.completed = true;
                existing.current = sIdx === targetIdx;
                if (sIdx === targetIdx) {
                  existing.time = nowFormattedDate;
                }
              }
            } else {
              const existing = existingTimeline.find((t) => t.title === stepName);
              if (existing) {
                existing.completed = false;
                existing.current = false;
              }
            }
          });

          return {
            ...o,
            status: newStatus,
            paymentStatus: isDelivered ? 'Đã thanh toán' : o.paymentStatus,
            trackingTimeline: existingTimeline
          };
        }
        return o;
      })
    );

    // If modal is open with this order, update selectedOrder as well
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderCode === orderId)) {
      const isDelivered = newStatus === 'Đã giao' || newStatus === 'Đã giao hàng';
      const existingTimeline = selectedOrder.trackingTimeline && selectedOrder.trackingTimeline.length > 0
        ? [...selectedOrder.trackingTimeline]
        : [{ title: 'Chờ xử lý', time: selectedOrder.orderDate || nowFormattedDate, completed: true }];

      const normNew = normalizeStatusKey(newStatus);
      const targetIdx = ORDER_STATUS_FLOW.indexOf(normNew);

      ORDER_STATUS_FLOW.forEach((stepName, sIdx) => {
        if (sIdx <= targetIdx) {
          const existing = existingTimeline.find((t) => t.title === stepName);
          if (!existing) {
            existingTimeline.push({
              title: stepName,
              time: sIdx === 0 ? (selectedOrder.orderDate || nowFormattedDate) : nowFormattedDate,
              completed: true,
              current: sIdx === targetIdx
            });
          } else {
            existing.completed = true;
            existing.current = sIdx === targetIdx;
            if (sIdx === targetIdx) {
              existing.time = nowFormattedDate;
            }
          }
        } else {
          const existing = existingTimeline.find((t) => t.title === stepName);
          if (existing) {
            existing.completed = false;
            existing.current = false;
          }
        }
      });

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              paymentStatus: isDelivered ? 'Đã thanh toán' : prev.paymentStatus,
              trackingTimeline: existingTimeline
            }
          : null
      );
    }

    showToast(`✓ Đã cập nhật trạng thái đơn hàng #${selectedOrder?.orderCode || orderId} sang "${newStatus}"`);
  };

  // Handle Order Cancellation with Reason and Restocking
  const handleConfirmCancelOrder = () => {
    if (!orderToCancel) return;

    const finalReason = cancelReasonOption === 'Lý do khác' ? (customCancelReason.trim() || 'Lý do khác') : cancelReasonOption;
    const cancelFormattedDate = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 1. Update Order in state
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderToCancel.id) {
          return {
            ...o,
            status: 'Đã hủy',
            cancelReason: finalReason,
            cancelDate: cancelFormattedDate,
            isRestocked: shouldRestock
          };
        }
        return o;
      })
    );

    // 2. Restock logic if requested & setProducts available
    if (shouldRestock && setProducts) {
      setProducts((prevProds) => {
        // Return cloned updated products
        return prevProds.map((prod) => {
          const itemInOrder = (orderToCancel.items || []).find(
            (it) => it && (it.productId === prod.id || (it.productName || '').toLowerCase() === (prod.name || '').toLowerCase())
          );
          if (itemInOrder) {
            // Ensure size is restored in product sizes array if missing
            const currentSizes = prod.sizes || [];
            if (!currentSizes.includes(itemInOrder.size)) {
              return {
                ...prod,
                sizes: [...currentSizes, itemInOrder.size].sort((a, b) => a - b)
              };
            }
          }
          return prod;
        });
      });
    }

    // Update selectedOrder if it was opened
    if (selectedOrder && selectedOrder.id === orderToCancel.id) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'Đã hủy',
              cancelReason: finalReason,
              cancelDate: cancelFormattedDate,
              isRestocked: shouldRestock
            }
          : null
      );
    }

    showToast(`Đã hủy đơn hàng ${orderToCancel.orderCode} thành công${shouldRestock ? ' & hoàn lại tồn kho.' : '.'}`);
    setIsCancelModalOpen(false);
    setOrderToCancel(null);
    setCustomCancelReason('');
  };

  // ----------------------------------------------------
  // 7. EXPORT EXCEL (CSV WITH UTF-8 BOM)
  // ----------------------------------------------------
  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      showToast('Không có đơn hàng nào để xuất file!');
      return;
    }

    const headers = [
      'Mã đơn hàng',
      'Tên khách hàng',
      'Số điện thoại',
      'Email',
      'Địa chỉ giao hàng',
      'Danh sách sản phẩm',
      'Tạm tính (VNĐ)',
      'Giảm giá (VNĐ)',
      'Phí vận chuyển (VNĐ)',
      'Tổng thanh toán (VNĐ)',
      'Phương thức thanh toán',
      'Trạng thái thanh toán',
      'Trạng thái đơn hàng',
      'Ngày đặt hàng',
      'Lý do hủy (nếu có)',
      'Ghi chú đơn hàng'
    ];

    const rows = filteredOrders.map((o) => {
      const itemsSummary = (o.items || [])
        .map((it) => `${it.productName} (Size: ${it.size}, SL: ${it.quantity}, Đơn giá: ${it.unitPrice})`)
        .join('; ');

      return [
        `"${o.orderCode}"`,
        `"${(o.recipientName || '').replace(/"/g, '""')}"`,
        `"${o.phone || ''}"`,
        `"${o.email || ''}"`,
        `"${(o.fullAddress || '').replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        o.subtotal || 0,
        o.discount || 0,
        o.shippingFee || 0,
        o.grandTotal || 0,
        `"${getPaymentMethodBadge(o.paymentMethod).full}"`,
        `"${o.paymentStatus || (o.paymentMethod === 'cod' && o.status !== 'Đã giao' ? 'Chưa thanh toán' : 'Đã thanh toán')}"`,
        `"${o.status}"`,
        `"${o.orderDate}"`,
        `"${(o.cancelReason || '').replace(/"/g, '""')}"`,
        `"${(o.note || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SoleStyle_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Đã xuất thành công ${filteredOrders.length} đơn hàng ra file Excel (CSV)!`);
  };

  // ----------------------------------------------------
  // 8. PRINT INVOICE GENERATOR & TRIGGER
  // ----------------------------------------------------
  const generateInvoiceHtml = (order: Order) => {
    const formattedDate = order.orderDate || new Date().toLocaleDateString('vi-VN');
    const paymentMethodText = getPaymentMethodBadge(order.paymentMethod).full;
    const isExpress = order.shippingMethod === 'express';

    const itemsRows = (order.items || []).map((item, idx) => `
      <tr>
        <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${idx + 1}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 700; color: #111827; font-size: 13px;">${item.productName}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
            ${item.brand ? `Thương hiệu: <strong>${item.brand}</strong> &bull; ` : ''}Màu: <strong>${item.colorName || 'Mặc định'}</strong>
          </div>
        </td>
        <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-weight: 700;">${item.size}</td>
        <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-weight: 800; font-size: 13px;">${item.quantity}</td>
        <td style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; color: #374151;">${formatVND(item.unitPrice)}</td>
        <td style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-weight: 800; color: #111827;">${formatVND(item.totalPrice)}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hóa Đơn Bán Hàng - ${order.orderCode}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #f3f4f6;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .print-actions-bar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      background: #111827;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    .print-actions-bar h4 {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .btn-group {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-print:hover { background: #059669; }
    .btn-close {
      background: #374151;
      color: #f3f4f6;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-close:hover { background: #4b5563; }
    .page-wrapper {
      padding: 24px;
      display: flex;
      justify-content: center;
    }
    .invoice-card {
      background: #ffffff;
      width: 100%;
      max-width: 800px;
      padding: 36px 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #111827;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.5px;
      color: #111827;
    }
    .brand-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #4b5563;
      margin-top: 3px;
    }
    .brand-details {
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
      margin-top: 6px;
    }
    .invoice-badge {
      text-align: right;
    }
    .invoice-badge h2 {
      font-size: 18px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #111827;
    }
    .invoice-badge .code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 800;
      color: #1f2937;
      margin-top: 4px;
    }
    .invoice-badge .date {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }
    .info-boxes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f9fafb;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .info-box-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .info-box-name {
      font-size: 14px;
      font-weight: 800;
      color: #111827;
    }
    .info-box-line {
      color: #4b5563;
      margin-top: 3px;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }
    th {
      background: #f3f4f6;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 10px 8px;
      border-bottom: 2px solid #111827;
      text-align: left;
      color: #111827;
    }
    .summary-section {
      border-top: 2px solid #111827;
      padding-top: 14px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #4b5563;
    }
    .summary-row.discount {
      color: #059669;
      font-weight: 700;
    }
    .grand-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      margin-top: 8px;
      font-size: 14px;
      font-weight: 900;
      color: #111827;
    }
    .grand-total-amount {
      font-size: 18px;
      color: #059669;
      font-weight: 900;
    }
    .payment-note {
      font-size: 11px;
      color: #6b7280;
      margin-top: 6px;
    }
    .policies-box {
      border-top: 1px dashed #d1d5db;
      padding-top: 16px;
      font-size: 10px;
      color: #6b7280;
      line-height: 1.6;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      text-align: center;
      margin-top: 28px;
      padding-top: 10px;
    }
    .sign-role {
      font-weight: 800;
      font-size: 12px;
      color: #1f2937;
    }
    .sign-caption {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 2px;
    }
    .sign-brand {
      margin-top: 48px;
      font-weight: 900;
      font-size: 12px;
      color: #111827;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-actions-bar {
        display: none !important;
      }
      .page-wrapper {
        padding: 0 !important;
      }
      .invoice-card {
        max-width: 100% !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions-bar">
    <div>
      <h4>HÓA ĐƠN BÁN HÀNG — ${order.orderCode}</h4>
    </div>
    <div class="btn-group">
      <button class="btn-print" onclick="window.print()">
        <span>🖨 IN HÓA ĐƠN (PRINT)</span>
      </button>
      <button class="btn-close" onclick="window.close()">Đóng</button>
    </div>
  </div>

  <div class="page-wrapper">
    <div class="invoice-card">
      <div class="header">
        <div>
          <div class="brand-title">K-NICKS</div>
          <div class="brand-subtitle">Giày Thể Thao & Sneaker Cao Cấp Chính Hãng</div>
          <div class="brand-details">
            Địa chỉ: 88 Đường 2 Tháng 4, P. Vĩnh Hải, TP. Nha Trang, Khánh Hòa<br/>
            Hotline: 1900 8888 | Email: support@knicks.vn | Website: www.knicks.vn
          </div>
        </div>
        <div class="invoice-badge">
          <h2>HÓA ĐƠN BÁN HÀNG</h2>
          <div class="code">Số: HD-${order.orderCode.replace('#', '')}</div>
          <div class="date">Ngày: ${formattedDate}</div>
        </div>
      </div>

      <div class="info-boxes">
        <div>
          <div class="info-box-title">Khách hàng</div>
          <div class="info-box-name">${order.recipientName}</div>
          <div class="info-box-line">SĐT: <strong>${order.phone}</strong></div>
          ${order.email ? `<div class="info-box-line">Email: ${order.email}</div>` : ''}
        </div>
        <div>
          <div class="info-box-title">Địa chỉ nhận hàng</div>
          <div class="info-box-name" style="font-size: 13px; font-weight: 700;">${order.fullAddress}</div>
          <div class="info-box-line">HT Vận chuyển: <strong>${isExpress ? 'Hỏa tốc (24h - 48h)' : 'Tiêu chuẩn'}</strong></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">STT</th>
            <th>Tên sản phẩm</th>
            <th style="width: 60px; text-align: center;">Size</th>
            <th style="width: 50px; text-align: center;">SL</th>
            <th style="width: 120px; text-align: right;">Đơn giá</th>
            <th style="width: 130px; text-align: right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="summary-section">
        <div class="summary-row">
          <span>Tạm tính tiền hàng:</span>
          <span style="font-weight: 700; color: #111827;">${formatVND(order.subtotal)}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="summary-row discount">
            <span>Giảm giá Voucher (${order.discountCode || 'KM'}):</span>
            <span>-${formatVND(order.discount)}</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span>Phí vận chuyển:</span>
          <span>${order.shippingFee > 0 ? formatVND(order.shippingFee) : 'Miễn phí'}</span>
        </div>
        <div class="grand-total-row">
          <span>TỔNG CỘNG THANH TOÁN:</span>
          <span class="grand-total-amount">${formatVND(order.grandTotal)}</span>
        </div>
        <div class="payment-note">
          Hình thức thanh toán: <strong>${paymentMethodText}</strong>
        </div>
      </div>

      <div class="policies-box">
        <p style="font-weight: 800; color: #374151; margin-bottom: 2px;">Chính sách bảo hành & Đổi trả:</p>
        <p>• Hỗ trợ đổi size trong vòng 30 ngày kể từ ngày nhận hàng với sản phẩm còn nguyên tem mác, chưa qua sử dụng.</p>
        <p>• Cam kết 100% sản phẩm chính hãng. Xin cảm ơn quý khách đã tin tưởng và ủng hộ SoleStyle!</p>
      </div>

      <div class="signatures">
        <div>
          <div class="sign-role">Người Mua Hàng</div>
          <div class="sign-caption">(Ký và ghi rõ họ tên)</div>
        </div>
        <div>
          <div class="sign-role">Người Lập Phiếu / Đại diện Cửa hàng</div>
          <div class="sign-caption">(Ký, đóng dấu)</div>
          <div class="sign-brand">K-NICKS</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.error(e);
        }
      }, 300);
    });
  </script>
</body>
</html>`;
  };

  const handlePrintWindow = (e?: React.MouseEvent, targetOrder?: Order | null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentOrder = targetOrder || orderToPrint || selectedOrder;
    if (!currentOrder) return;

    showToast(`Đang mở giao diện in hóa đơn cho đơn hàng ${currentOrder.orderCode}...`);

    // 1. Try opening popup window with complete standalone printable invoice
    try {
      const html = generateInvoiceHtml(currentOrder);
      const printWin = window.open('', '_blank', 'width=900,height=950,menubar=no,toolbar=no,location=no,status=no');
      if (printWin) {
        printWin.document.open();
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
      }
    } catch (winErr) {
      console.warn('Popup window blocked or not allowed:', winErr);
    }

    // 2. Also trigger standard window.print()
    try {
      window.focus();
      window.print();
    } catch (printErr) {
      console.warn('window.print error:', printErr);
    }
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans antialiased text-neutral-800">
      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION - COMPACT                             */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <ShoppingBag size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 uppercase tracking-tight">
              Quản Lý Đơn Hàng
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {orderStats.total} đơn hàng
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            Hệ thống quản lý, theo dõi tiến độ và xử lý đơn đặt hàng từ khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs cursor-pointer"
            title="Xuất file Excel/CSV danh sách đơn hàng"
          >
            <Download size={13} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
            title="Làm mới bộ lọc & dữ liệu"
          >
            <RotateCcw size={13} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* QUICK STATS CARDS - HÀNG NGANG                       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Total Orders */}
        <div
          onClick={() => {
            setSelectedStatusFilter('All');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'All'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả đơn :</span>
          <span className="text-xs font-black text-neutral-900">{orderStats.total}</span>
        </div>

        {/* Pending */}
        <div
          onClick={() => {
            setSelectedStatusFilter('Chờ xử lý');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Chờ xử lý'
              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-amber-800">Chờ xử lý :</span>
          <span className="text-xs font-black text-amber-700">{orderStats.pending}</span>
        </div>

        {/* Confirmed */}
        <div
          onClick={() => {
            setSelectedStatusFilter('Đã xác nhận');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đã xác nhận'
              ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-sky-800">Đã xác nhận :</span>
          <span className="text-xs font-black text-sky-700">{orderStats.confirmed}</span>
        </div>

        {/* Preparing */}
        <div
          onClick={() => {
            setSelectedStatusFilter('Đang chuẩn bị hàng');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đang chuẩn bị hàng'
              ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-indigo-800">Chuẩn bị :</span>
          <span className="text-xs font-black text-indigo-700">{orderStats.preparing}</span>
        </div>

        {/* Shipping */}
        <div
          onClick={() => {
            setSelectedStatusFilter('Đang giao');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đang giao'
              ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-orange-800">Đang giao :</span>
          <span className="text-xs font-black text-orange-700">{orderStats.shipping}</span>
        </div>

        {/* Delivered */}
        <div
          onClick={() => {
            setSelectedStatusFilter('Đã giao');
            setCurrentPage(1);
          }}
          className={`flex items-center justify-between px-3 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đã giao'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800">Hoàn thành :</span>
          <span className="text-xs font-black text-emerald-700">{orderStats.delivered}</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TOOLBAR: SEARCH & FILTERS                            */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
        {/* Row 1: Search input + Date & Payment filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm mã đơn, tên khách, SĐT..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={selectedPaymentMethodFilter}
              onChange={(e) => {
                setSelectedPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 outline-hidden focus:border-black transition-all cursor-pointer"
            >
              <option value="All">💳 Tất cả phương thức TT</option>
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="banking">Chuyển khoản ngân hàng</option>
              <option value="momo">Ví MoMo</option>
              <option value="vnpay">Cổng VNPay-QR</option>
              <option value="zalopay">Ví ZaloPay</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={selectedDateFilter}
              onChange={(e) => {
                setSelectedDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 outline-hidden focus:border-black transition-all cursor-pointer"
            >
              <option value="All">📅 Tất cả ngày đặt</option>
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="custom">Tùy chỉnh khoảng ngày...</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 outline-hidden focus:border-black transition-all cursor-pointer"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="highest">Giá trị cao nhất</option>
              <option value="lowest">Giá trị thấp nhất</option>
            </select>
          </div>
        </div>

        {/* Row 1.5: Custom Date Pickers if 'custom' is selected */}
        {selectedDateFilter === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs font-semibold">
            <span className="text-neutral-500">Từ ngày:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="p-1.5 bg-white border border-neutral-200 rounded-lg text-xs"
            />
            <span className="text-neutral-500">Đến ngày:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="p-1.5 bg-white border border-neutral-200 rounded-lg text-xs"
            />
          </div>
        )}

        {/* Row 2: Status Pills Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-bold no-scrollbar">
          {[
            { id: 'All', label: 'Tất cả', count: orderStats.total },
            { id: 'Chờ xử lý', label: 'Chờ xử lý', count: orderStats.pending },
            { id: 'Đã xác nhận', label: 'Đã xác nhận', count: orderStats.confirmed },
            { id: 'Đang chuẩn bị hàng', label: 'Đang chuẩn bị hàng', count: orderStats.preparing },
            { id: 'Đang giao', label: 'Đang giao', count: orderStats.shipping },
            { id: 'Đã giao', label: 'Đã giao', count: orderStats.delivered },
            { id: 'Đã hủy', label: 'Đã hủy', count: orderStats.cancelled }
          ].map((tab) => {
            const isActive = selectedStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-xs font-black'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black font-semibold'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* ORDERS LIST: DESKTOP TABLE & MOBILE CARDS            */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {/* Results count bar */}
        <div className="px-6 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500 font-semibold bg-neutral-50/50">
          <div>
            Hiển thị <span className="font-black text-neutral-900">{filteredOrders.length}</span> đơn hàng
            {searchQuery && <span> khớp với "{searchQuery}"</span>}
          </div>

          <div className="flex items-center gap-3">
            <span>Hiển thị mỗi trang:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 rounded-lg px-2 py-1 text-xs font-bold text-neutral-800 outline-hidden"
            >
              <option value={10}>10 đơn</option>
              <option value={20}>20 đơn</option>
              <option value={50}>50 đơn</option>
              <option value={100}>100 đơn</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <ShoppingBag size={48} className="mx-auto mb-3 text-neutral-300" />
            <h3 className="text-base font-bold text-neutral-800">Không tìm thấy đơn hàng nào</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Không có đơn hàng nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Mã đơn</th>
                    <th className="py-3.5 px-5">Khách hàng</th>
                    <th className="py-3.5 px-5 min-w-[220px]">Sản phẩm</th>
                    <th className="py-3.5 px-5">Tổng tiền</th>
                    <th className="py-3.5 px-5">Thanh toán</th>
                    <th className="py-3.5 px-5">Trạng thái</th>
                    <th className="py-3.5 px-5">Ngày đặt</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
                  {paginatedOrders.map((order) => {
                    const statusInfo = getStatusBadge(order.status);
                    const StatusIcon = statusInfo.icon;
                    const payMethod = getPaymentMethodBadge(order.paymentMethod);
                    const isPaid = order.paymentStatus === 'Đã thanh toán' || (order.paymentMethod !== 'cod');

                    return (
                      <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors group">
                        {/* Order Code */}
                        <td className="py-4 px-5">
                          <span className="font-mono font-black text-neutral-900 text-sm block">
                            {order.orderCode}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                            ID: {order.id.slice(0, 12)}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {order.recipientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-black text-neutral-900 block truncate min-w-[150px] max-w-xs">
                                {order.recipientName}
                              </span>
                              <span className="text-[11px] text-neutral-500 font-medium block">
                                {order.phone}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Products preview */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            {(order.items || []).length > 0 && (
                              <img
                                src={(order.items || [])[0].image}
                                alt={(order.items || [])[0].productName}
                                className="h-10 w-10 object-contain bg-white rounded-lg p-1 border border-neutral-200 shrink-0"
                              />
                            )}
                            <div className="min-w-0 text-xs">
                              <span className="font-bold text-neutral-900 block truncate min-w-[200px] max-w-sm" title={(order.items || [])[0]?.productName}>
                                {(order.items || [])[0]?.productName || 'Sản phẩm'}
                              </span>
                              <span className="text-[10px] text-neutral-400 block font-medium">
                                Size: {(order.items || [])[0]?.size} • SL: {(order.items || [])[0]?.quantity}
                                {(order.items || []).length > 1 && (
                                  <span className="text-black font-bold ml-1">
                                    +{(order.items || []).length - 1} món khác
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Grand Total */}
                        <td className="py-4 px-5">
                          <span className="font-black text-neutral-900 text-sm block">
                            {formatVND(order.grandTotal)}
                          </span>
                          {order.discount > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold block">
                              Giảm: -{formatVND(order.discount)}
                            </span>
                          )}
                        </td>

                        {/* Payment method & status */}
                        <td className="py-4 px-5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${payMethod.class} mb-1`}>
                            {payMethod.label}
                          </span>
                          <div className="text-[10px] font-bold">
                            {isPaid ? (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <Check size={10} className="stroke-[3]" /> Đã thanh toán
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                <Clock size={10} /> Chưa thanh toán
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Order Status Badge */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusInfo.badgeClass}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                            <StatusIcon size={12} />
                            <span>{statusInfo.label}</span>
                          </span>
                        </td>

                        {/* Order Date */}
                        <td className="py-4 px-5 text-neutral-500 text-[11px] whitespace-nowrap">
                          {order.orderDate}
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Detail */}
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 rounded-xl bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 transition-colors cursor-pointer"
                              title="Xem chi tiết đơn hàng"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Print Invoice */}
                            <button
                              onClick={() => {
                                setOrderToPrint(order);
                                setIsInvoiceModalOpen(true);
                              }}
                              className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-800 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                              title="In hóa đơn bán hàng"
                            >
                              <Printer size={15} />
                            </button>

                            {/* Cancel Button (if pending or confirmed) */}
                            {order.status !== 'Đã giao' && order.status !== 'Đã giao hàng' && order.status !== 'Đã hủy' && (
                              <button
                                onClick={() => {
                                  setOrderToCancel(order);
                                  setIsCancelModalOpen(true);
                                }}
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Hủy đơn hàng"
                              >
                                <XCircle size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-neutral-100">
              {paginatedOrders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                const StatusIcon = statusInfo.icon;
                const payMethod = getPaymentMethodBadge(order.paymentMethod);

                return (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-black text-neutral-900 text-sm block">
                          {order.orderCode}
                        </span>
                        <span className="text-[10px] text-neutral-400">{order.orderDate}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusInfo.badgeClass}`}>
                        <StatusIcon size={10} />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div className="bg-neutral-50 p-3 rounded-2xl text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Khách hàng:</span>
                        <span className="font-bold text-neutral-900">{order.recipientName} ({order.phone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Thanh toán:</span>
                        <span className="font-bold text-neutral-900">{payMethod.label}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-neutral-200/60 font-black">
                        <span className="text-neutral-800">Tổng tiền:</span>
                        <span className="text-neutral-900 text-sm">{formatVND(order.grandTotal)}</span>
                      </div>
                    </div>

                    {/* Products mini preview */}
                    <div className="flex items-center gap-2 text-xs">
                      {(order.items || []).slice(0, 3).map((it, idx) => (
                        <img
                          key={idx}
                          src={it.image}
                          alt={it.productName}
                          className="h-9 w-9 object-contain bg-white rounded-lg p-0.5 border border-neutral-200"
                        />
                      ))}
                      <span className="text-[11px] text-neutral-500 font-medium">
                        {(order.items || []).length} món sản phẩm
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>Chi tiết & Cập nhật</span>
                      </button>

                      <button
                        onClick={() => {
                          setOrderToPrint(order);
                          setIsInvoiceModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 cursor-pointer"
                        title="In hóa đơn"
                      >
                        <Printer size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* -------------------------------------------------- */}
        {/* PAGINATION CONTROLS                                */}
        {/* -------------------------------------------------- */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-neutral-500 font-semibold">
              Trang <span className="font-black text-neutral-900">{currentPage}</span> / {totalPages} (Tổng {filteredOrders.length} đơn hàng)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => {
                  const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-neutral-400">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`h-8 min-w-8 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Trang tiếp"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: CHI TIẾT ĐƠN HÀNG & CẬP NHẬT TRẠNG THÁI     */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-neutral-200 max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg sm:text-xl font-black text-neutral-900">
                      {selectedOrder.orderCode}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadge(selectedOrder.status).badgeClass}`}>
                      {getStatusBadge(selectedOrder.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Ngày đặt hàng: {selectedOrder.orderDate}</p>
                </div>

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                {/* 1. Status Progress Timeline (VIEW ONLY) */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-neutral-700" />
                      <span className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                        TIẾN ĐỘ ĐƠN HÀNG
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
                      Theo dõi tiến trình xử lý đơn hàng thực tế
                    </span>
                  </div>

                  {selectedOrder.status === 'Đã hủy' ? (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                      <div className="flex items-center gap-2 font-black text-sm text-rose-700">
                        <XCircle size={18} className="text-rose-600 shrink-0" />
                        <span>ĐƠN HÀNG ĐÃ BỊ HỦY</span>
                      </div>
                      <div className="space-y-1 text-xs text-rose-800 font-medium pl-6">
                        <p>
                          <span className="font-bold">Lý do hủy:</span> {selectedOrder.cancelReason || 'Khách hàng / Quản trị viên yêu cầu hủy.'}
                        </p>
                        {selectedOrder.cancelDate && (
                          <p className="text-[11px] text-rose-600">
                            <span className="font-bold">Thời gian hủy:</span> {selectedOrder.cancelDate}
                          </p>
                        )}
                        {selectedOrder.isRestocked && (
                          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>Đã hoàn lại số lượng tồn kho cho các sản phẩm trong đơn.</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Desktop Horizontal Timeline */}
                      <div className="hidden sm:grid grid-cols-5 gap-2 relative">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const currentNorm = normalizeStatusKey(selectedOrder.status);
                          const currentIdx = ORDER_STATUS_FLOW.indexOf(currentNorm);
                          const isCompleted = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          const isPending = idx > currentIdx;

                          // Find timestamp for this step
                          const timelineItem = selectedOrder.trackingTimeline?.find((t) => t.title === step.key);
                          const stepTime = timelineItem?.time || (idx === 0 ? selectedOrder.orderDate : (isCompleted ? selectedOrder.orderDate : null));

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center relative px-1">
                              {/* Step circle indicator */}
                              <div
                                className={`h-9 w-9 rounded-full flex items-center justify-center font-black text-xs transition-all z-10 ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : isCurrent
                                    ? 'bg-black text-white ring-4 ring-neutral-200 shadow-md'
                                    : 'bg-white border-2 border-neutral-300 text-neutral-400'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check size={16} strokeWidth={3} />
                                ) : isCurrent ? (
                                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                                ) : (
                                  <span>{step.stepNum}</span>
                                )}
                              </div>

                              {/* Title & Desc */}
                              <div className="mt-2.5 space-y-0.5">
                                <span
                                  className={`block text-xs leading-tight ${
                                    isCurrent
                                      ? 'font-black text-neutral-900'
                                      : isCompleted
                                      ? 'font-bold text-emerald-800'
                                      : 'font-semibold text-neutral-400'
                                  }`}
                                >
                                  {step.title}
                                </span>
                                <span className="text-[10px] text-neutral-400 block leading-tight">
                                  {step.desc}
                                </span>
                                {stepTime && (
                                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                    {stepTime}
                                  </span>
                                )}
                                {isCurrent && !stepTime && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                    Đang xử lý
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Vertical Timeline */}
                      <div className="sm:hidden space-y-3 pl-2">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const currentNorm = normalizeStatusKey(selectedOrder.status);
                          const currentIdx = ORDER_STATUS_FLOW.indexOf(currentNorm);
                          const isCompleted = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          const isPending = idx > currentIdx;

                          const timelineItem = selectedOrder.trackingTimeline?.find((t) => t.title === step.key);
                          const stepTime = timelineItem?.time || (idx === 0 ? selectedOrder.orderDate : (isCompleted ? selectedOrder.orderDate : null));

                          return (
                            <div key={step.key} className="flex items-start gap-3">
                              <div
                                className={`h-7 w-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-black text-white ring-2 ring-neutral-200'
                                    : 'bg-white border-2 border-neutral-300 text-neutral-400'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check size={13} strokeWidth={3} />
                                ) : isCurrent ? (
                                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                                ) : (
                                  <span className="text-[11px]">{step.stepNum}</span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs ${
                                      isCurrent
                                        ? 'font-black text-neutral-900'
                                        : isCompleted
                                        ? 'font-bold text-emerald-800'
                                        : 'font-semibold text-neutral-400'
                                    }`}
                                  >
                                    {step.stepNum}. {step.title}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-black text-white">
                                      Hiện tại
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-400">{step.desc}</p>
                                {stepTime && (
                                  <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{stepTime}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Status Control & Actions Area */}
                <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200/90 space-y-4">
                  {/* TRẠNG THÁI HIỆN TẠI & NÚT HỦY ĐƠN */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-200">
                    <div>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block mb-1">
                        TRẠNG THÁI HIỆN TẠI
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border ${getStatusBadge(selectedOrder.status).badgeClass}`}>
                          <span className={`h-2 w-2 rounded-full ${getStatusBadge(selectedOrder.status).dotClass}`} />
                          {getStatusBadge(selectedOrder.status).label}
                        </span>
                        {selectedOrder.status !== 'Đã hủy' && (
                          <span className="text-[11px] font-bold text-neutral-500">
                            (Bước {ORDER_STATUS_FLOW.indexOf(normalizeStatusKey(selectedOrder.status)) + 1}/5)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nút HỦY ĐƠN riêng biệt (chỉ hiển thị khi đơn chưa hoàn thành hoặc chưa hủy) */}
                    {selectedOrder.status !== 'Đã giao' &&
                      selectedOrder.status !== 'Đã giao hàng' &&
                      selectedOrder.status !== 'Đã hủy' && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderToCancel(selectedOrder);
                            setIsCancelModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-2xs active:scale-95"
                        >
                          <Ban size={14} className="text-rose-600" />
                          <span>HỦY ĐƠN</span>
                        </button>
                      )}
                  </div>

                  {/* CẬP NHẬT TRẠNG THÁI (Dropdown + Cập nhật button) */}
                  {selectedOrder.status === 'Đã hủy' ? (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-500">
                      <AlertTriangle size={15} className="text-neutral-400 shrink-0" />
                      <span>Đơn hàng đã hủy. Không thể thay đổi trạng thái xử lý.</span>
                    </div>
                  ) : selectedOrder.status === 'Đã giao' || selectedOrder.status === 'Đã giao hàng' ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Đơn hàng đã hoàn thành và giao thành công. Tiến trình đã kết thúc!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-wider block">
                        CẬP NHẬT TRẠNG THÁI
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <div className="relative flex-1">
                          <select
                            value={selectedNextStatus}
                            onChange={(e) => setSelectedNextStatus(e.target.value as Order['status'])}
                            className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-neutral-300 hover:border-neutral-400 focus:border-black rounded-xl text-xs font-bold text-neutral-900 outline-hidden transition-all appearance-none cursor-pointer"
                          >
                            {forwardStatuses.length === 0 ? (
                              <option value="">Không có trạng thái kế tiếp</option>
                            ) : (
                              forwardStatuses.map((st) => (
                                <option key={st} value={st}>
                                  Chuyển sang: {st}
                                </option>
                              ))
                            )}
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (selectedNextStatus && selectedNextStatus !== selectedOrder.status) {
                              handleUpdateStatus(selectedOrder.id, selectedNextStatus);
                            }
                          }}
                          disabled={!selectedNextStatus || selectedNextStatus === selectedOrder.status}
                          className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs active:scale-95"
                        >
                          <RefreshCw size={14} />
                          <span>Cập nhật</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        * Quy trình chuẩn: Chờ xử lý → Đã xác nhận → Đang chuẩn bị hàng → Đang giao → Đã giao. Không cho phép chuyển ngược.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Customer & Delivery Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-neutral-900 uppercase text-[11px] mb-1">
                      <Phone size={14} className="text-neutral-500" />
                      <span>Thông tin người nhận</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Họ và tên:</span>
                      <span className="font-black text-neutral-900 text-sm">{selectedOrder.recipientName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Số điện thoại:</span>
                      <span className="font-bold text-neutral-800">{selectedOrder.phone}</span>
                    </div>
                    {selectedOrder.email && (
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Email:</span>
                        <span className="font-medium text-neutral-600">{selectedOrder.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-neutral-900 uppercase text-[11px] mb-1">
                      <MapPin size={14} className="text-neutral-500" />
                      <span>Địa chỉ nhận hàng</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Địa chỉ đầy đủ:</span>
                      <p className="font-bold text-neutral-900 leading-relaxed">{selectedOrder.fullAddress}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Phương thức giao:</span>
                      <span className="font-bold text-neutral-800">
                        {selectedOrder.shippingMethod === 'express' ? '⚡ Giao Hỏa tốc (24h - 48h)' : '🚚 Giao Tiêu chuẩn (2 - 4 ngày)'}
                      </span>
                    </div>
                    {selectedOrder.note && (
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Ghi chú của khách:</span>
                        <p className="italic text-neutral-700 bg-white p-2 rounded-lg border border-neutral-200 mt-1">
                          "{selectedOrder.note}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Products List in Order */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 uppercase text-xs">
                      DANH SÁCH SẢN PHẨM ({(selectedOrder.items || []).length} món)
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Giá chuẩn tại thời điểm đặt hàng
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-50/50">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-white transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="h-12 w-12 object-contain bg-white rounded-xl p-1 border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-black text-neutral-900 block truncate">{item.productName}</span>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                              <span>Thương hiệu: <strong className="text-neutral-800">{item.brand}</strong></span>
                              <span>•</span>
                              <span>Size: <strong className="text-neutral-800">{item.size}</strong></span>
                              <span>•</span>
                              <span>Màu: <strong className="text-neutral-800">{item.colorName}</strong></span>
                              <span>•</span>
                              <span>SL: <strong className="text-neutral-900 font-black">{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-neutral-400 block font-medium">
                            {formatVND(item.unitPrice)} x {item.quantity}
                          </span>
                          <span className="font-black text-neutral-900 text-sm">
                            {formatVND(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Payment & Pricing Breakdown */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2.5">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính tiền hàng:</span>
                    <span className="font-bold text-neutral-800">{formatVND(selectedOrder.subtotal)}</span>
                  </div>

                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Giảm giá Voucher ({selectedOrder.discountCode || 'Khuyến mãi'}):</span>
                      <span className="font-black">-{formatVND(selectedOrder.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-bold text-neutral-800">
                      {selectedOrder.shippingFee > 0 ? formatVND(selectedOrder.shippingFee) : 'Miễn phí'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200 text-sm">
                    <div>
                      <span className="font-black text-neutral-900 block">TỔNG THANH TOÁN:</span>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        Phương thức: {getPaymentMethodBadge(selectedOrder.paymentMethod).full}
                      </span>
                    </div>
                    <span className="text-xl font-black text-emerald-600">
                      {formatVND(selectedOrder.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: XÁC NHẬN HỦY ĐƠN & HOÀN KHO                 */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isCancelModalOpen && orderToCancel && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelModalOpen(false)}
              className="fixed inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full my-auto p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">HỦY ĐƠN HÀNG</h3>
                  <p className="text-xs text-neutral-600 font-medium">Bạn có chắc chắn muốn hủy đơn hàng #{orderToCancel.orderCode}?</p>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">
                    Lý do hủy:
                  </label>
                  <select
                    value={cancelReasonOption}
                    onChange={(e) => setCancelReasonOption(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold outline-hidden focus:border-black"
                  >
                    {CANCEL_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {cancelReasonOption === 'Lý do khác' && (
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Nhập lý do nếu cần:
                    </label>
                    <textarea
                      rows={3}
                      value={customCancelReason}
                      onChange={(e) => setCustomCancelReason(e.target.value)}
                      placeholder="Nhập chi tiết nguyên nhân hủy đơn..."
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-hidden focus:border-black"
                    />
                  </div>
                )}

                {/* Restock Checkbox */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="restock-checkbox"
                    checked={shouldRestock}
                    onChange={(e) => setShouldRestock(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-md border-neutral-300 text-black focus:ring-black cursor-pointer"
                  />
                  <label htmlFor="restock-checkbox" className="text-xs text-neutral-700 cursor-pointer">
                    <strong className="block text-neutral-900 font-bold">Hoàn lại số lượng tồn kho</strong>
                    Tự động cộng lại số lượng theo đúng Size cho các sản phẩm trong đơn này.
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmCancelOrder}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: IN HÓA ĐƠN BÁN HÀNG (PRINTABLE INVOICE)     */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isInvoiceModalOpen && orderToPrint && (
          <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible print:block overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceModalOpen(false)}
              className="fixed inset-0 print:hidden overlay-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-neutral-200 text-neutral-900 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:my-0 print:max-w-full print:static print:w-full print:overflow-visible print:p-0 modal-frame"
            >
              {/* Top controls (sticky header) */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 bg-white shrink-0 sticky top-0 z-20 print:hidden modal-header">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">
                    Xem Trước Hóa Đơn Bán Hàng
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Mã đơn: <span className="font-mono font-bold text-neutral-800">{orderToPrint.orderCode}</span> &bull; Ngày: {orderToPrint.orderDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer close-button"
                    title="Đóng cửa sổ (X)"
                    aria-label="Đóng"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Sheet (Scrollable body) */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs print:p-0 print:overflow-visible print:space-y-4 print:text-neutral-900 invoice-preview invoice-print-area" id="printable-invoice">
                {/* Store Header */}
                <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tighter text-neutral-900 uppercase">
                      K-NICKS
                    </h2>
                    <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                      Giày Thể Thao & Sneaker Cao Cấp Chính Hãng
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                      Địa chỉ: 88 Đường 2 Tháng 4, P. Vĩnh Hải, TP. Nha Trang, Khánh Hòa<br />
                      Hotline: 1900 8888 | Email: support@knicks.vn | Website: www.knicks.vn
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black uppercase tracking-wider block text-neutral-900">
                      HÓA ĐƠN BÁN HÀNG
                    </span>
                    <span className="font-mono text-xs font-bold block mt-1">
                      Số: HD-{orderToPrint.orderCode.replace('#', '')}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">
                      Ngày: {orderToPrint.orderDate}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl print:bg-neutral-50 print:border print:border-neutral-200">
                  <div>
                    <span className="text-neutral-400 uppercase font-bold text-[10px] block">Khách hàng</span>
                    <strong className="text-neutral-900 text-sm block">{orderToPrint.recipientName}</strong>
                    <span className="text-neutral-600 block mt-0.5">SĐT: {orderToPrint.phone}</span>
                    {orderToPrint.email && <span className="text-neutral-500 block">Email: {orderToPrint.email}</span>}
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase font-bold text-[10px] block">Địa chỉ giao hàng</span>
                    <p className="text-neutral-800 font-semibold leading-relaxed mt-0.5">
                      {orderToPrint.fullAddress}
                    </p>
                    <span className="text-[10px] text-neutral-500 block mt-1">
                      HT Vận chuyển: {orderToPrint.shippingMethod === 'express' ? 'Hỏa tốc (24h-48h)' : 'Tiêu chuẩn'}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300 font-black text-neutral-800 uppercase text-[10px]">
                      <th className="py-2">STT</th>
                      <th className="py-2">Tên sản phẩm</th>
                      <th className="py-2 text-center">Size</th>
                      <th className="py-2 text-center">SL</th>
                      <th className="py-2 text-right">Đơn giá</th>
                      <th className="py-2 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-semibold">
                    {(orderToPrint.items || []).map((item, index) => (
                      <tr key={index}>
                        <td className="py-2.5 text-neutral-500">{index + 1}</td>
                        <td className="py-2.5 font-bold text-neutral-900">
                          {item.productName}
                          <span className="block text-[10px] text-neutral-400 font-normal">Màu: {item.colorName}</span>
                        </td>
                        <td className="py-2.5 text-center">{item.size}</td>
                        <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 text-right">{formatVND(item.unitPrice)}</td>
                        <td className="py-2.5 text-right font-black">{formatVND(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total breakdown */}
                <div className="border-t-2 border-neutral-900 pt-3 space-y-1.5 text-right">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính tiền hàng:</span>
                    <span className="font-bold">{formatVND(orderToPrint.subtotal)}</span>
                  </div>
                  {orderToPrint.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Giảm giá Voucher ({orderToPrint.discountCode || 'KM'}):</span>
                      <span>-{formatVND(orderToPrint.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển:</span>
                    <span>{orderToPrint.shippingFee > 0 ? formatVND(orderToPrint.shippingFee) : 'Miễn phí'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>TỔNG CỘNG THANH TOÁN:</span>
                    <span className="text-base text-emerald-600">{formatVND(orderToPrint.grandTotal)}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 text-left pt-1">
                    Hình thức thanh toán: <strong>{getPaymentMethodBadge(orderToPrint.paymentMethod).full}</strong>
                  </div>
                </div>

                {/* Footer notes & signature */}
                <div className="pt-4 border-t border-dashed border-neutral-300 text-neutral-500 text-[10px] leading-relaxed">
                  <p className="font-bold text-neutral-700">Chính sách bảo hành & Đổi trả:</p>
                  <p>• Hỗ trợ đổi size trong vòng 30 ngày kể từ ngày nhận hàng với sản phẩm còn nguyên tem mác, chưa qua sử dụng.</p>
                  <p>• Cam kết 100% sản phẩm chính hãng. Xin cảm ơn quý khách đã tin tưởng và ủng hộ SoleStyle!</p>

                  <div className="grid grid-cols-2 text-center pt-6 pb-4 font-bold text-neutral-800 text-xs">
                    <div>
                      <p>Người Mua Hàng</p>
                      <span className="text-[10px] text-neutral-400 font-normal">(Ký và ghi rõ họ tên)</span>
                    </div>
                    <div>
                      <p>Người Lập Phiếu / Đại diện Cửa hàng</p>
                      <span className="text-[10px] text-neutral-400 font-normal">(Ký, đóng dấu)</span>
                      <div className="mt-8 text-neutral-900 font-black">K-NICKS</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between shrink-0 print:hidden text-xs modal-actions">
                <span className="text-neutral-500 font-medium">
                  Khách hàng: <strong className="text-neutral-900">{orderToPrint.recipientName}</strong> ({orderToPrint.phone})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold transition-colors cursor-pointer close-button"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    id="footer-print-invoice-btn"
                    onClick={(e) => handlePrintWindow(e, orderToPrint)}
                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 print-button"
                  >
                    <Printer size={16} />
                    <span>In Hóa Đơn</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
