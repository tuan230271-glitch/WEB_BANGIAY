import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  Calendar,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  DollarSign,
  Truck,
  Clock,
  PieChart as PieIcon,
  BarChart2,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Order, Product, UserProfile, CategoryItem, BrandItem, Promotion } from '../../types';
import {
  TimeFilterType,
  getDateRangeBounds,
  filterOrdersByDate,
  filterUsersByDate,
  calculateReportKPIs,
  generateRevenueTimeSeries,
  generateOrderStatusBreakdown,
  generateTopProducts,
  generateCategoryRevenue,
  generateBrandRevenue,
  generateCustomerAnalytics,
  generatePromotionAnalytics,
  getLowStockProducts,
  generateCSVReport,
  formatVND,
  formatShortVND
} from '../../utils/reportUtils';

interface ReportManagementProps {
  orders: Order[];
  products: Product[];
  usersList: UserProfile[];
  categories?: CategoryItem[];
  brands?: BrandItem[];
  promotions?: Promotion[];
  onNavigateTab?: (tab: string) => void;
  onSelectOrder?: (order: Order) => void;
  showToast?: (message: string) => void;
}

export default function ReportManagement({
  orders,
  products,
  usersList,
  categories = [],
  brands = [],
  promotions = [],
  onNavigateTab,
  onSelectOrder,
  showToast
}: ReportManagementProps) {
  // 1. Time Filter State
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // Chart view granularity (day, week, month)
  const [chartGranularity, setChartGranularity] = useState<'day' | 'week' | 'month'>('day');

  // Chart type toggles for Category & Brand
  const [categoryChartType, setCategoryChartType] = useState<'list' | 'donut' | 'bar'>('donut');
  const [brandChartType, setBrandChartType] = useState<'list' | 'donut' | 'bar'>('bar');

  // Search keyword for top products or recent orders
  const [productSearch, setProductSearch] = useState('');

  // 2. Compute Filtered Bounds
  const dateBounds = useMemo(() => {
    return getDateRangeBounds(timeFilter, customStartDate, customEndDate);
  }, [timeFilter, customStartDate, customEndDate]);

  // Previous period bounds for comparative metrics
  const prevDateBounds = useMemo(() => {
    const duration = dateBounds.end.getTime() - dateBounds.start.getTime();
    const prevEnd = new Date(dateBounds.start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { start: prevStart, end: prevEnd, label: 'Kỳ trước' };
  }, [dateBounds]);

  // 3. Filter orders and users based on bounds
  const filteredOrders = useMemo(() => {
    return filterOrdersByDate(orders, dateBounds);
  }, [orders, dateBounds]);

  const prevFilteredOrders = useMemo(() => {
    return filterOrdersByDate(orders, prevDateBounds);
  }, [orders, prevDateBounds]);

  const filteredUsers = useMemo(() => {
    return filterUsersByDate(usersList, dateBounds);
  }, [usersList, dateBounds]);

  // 4. Compute KPIs & Chart Data
  const kpis = useMemo(() => {
    return calculateReportKPIs(filteredOrders, filteredUsers, prevFilteredOrders);
  }, [filteredOrders, filteredUsers, prevFilteredOrders]);

  const revenueTimeSeries = useMemo(() => {
    return generateRevenueTimeSeries(filteredOrders, dateBounds, chartGranularity);
  }, [filteredOrders, dateBounds, chartGranularity]);

  const orderStatusData = useMemo(() => {
    return generateOrderStatusBreakdown(filteredOrders);
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const list = generateTopProducts(filteredOrders, products);
    if (!productSearch) return list;
    const q = productSearch.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  }, [filteredOrders, products, productSearch]);

  const categoryRevenue = useMemo(() => {
    return generateCategoryRevenue(filteredOrders, products, categories);
  }, [filteredOrders, products, categories]);

  const brandRevenue = useMemo(() => {
    return generateBrandRevenue(filteredOrders, products, brands);
  }, [filteredOrders, products, brands]);

  const customerAnalytics = useMemo(() => {
    return generateCustomerAnalytics(orders, usersList, dateBounds);
  }, [orders, usersList, dateBounds]);

  const promoAnalytics = useMemo(() => {
    return generatePromotionAnalytics(filteredOrders, promotions);
  }, [filteredOrders, promotions]);

  const lowStockProducts = useMemo(() => {
    return getLowStockProducts(products, 12, 3);
  }, [products]);

  // Recent 10 orders in period
  const recentOrders = useMemo(() => {
    return [...filteredOrders]
      .sort((a, b) => {
        const tA = new Date(a.orderDate).getTime();
        const tB = new Date(b.orderDate).getTime();
        return tB - tA;
      })
      .slice(0, 10);
  }, [filteredOrders]);

  // Peak revenue point calculation
  const peakRevenuePoint = useMemo(() => {
    if (revenueTimeSeries.length === 0) return null;
    let max = revenueTimeSeries[0];
    revenueTimeSeries.forEach((p) => {
      if (p.revenue > max.revenue) max = p;
    });
    return max.revenue > 0 ? max : null;
  }, [revenueTimeSeries]);

  // Export handlers
  const handleExportCSV = () => {
    generateCSVReport(
      kpis,
      revenueTimeSeries,
      topProducts,
      categoryRevenue,
      brandRevenue,
      filteredOrders,
      dateBounds.label
    );
    showToast?.('✓ Đã xuất file báo cáo Excel (CSV) thành công!');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const timeFilterOptions: { id: TimeFilterType; label: string }[] = [
    { id: 'today', label: 'Hôm nay' },
    { id: '7days', label: '7 ngày' },
    { id: '30days', label: '30 ngày' },
    { id: 'this_month', label: 'Tháng này' },
    { id: 'last_month', label: 'Tháng trước' },
    { id: 'this_year', label: 'Năm nay' },
    { id: 'custom', label: 'Tùy chỉnh' }
  ];

  return (
    <main className="p-4 sm:p-5 md:p-6 max-w-[1920px] w-full mx-auto space-y-4 antialiased report-page font-sans">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER & ACTION BUTTONS                           */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <TrendingUp size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Báo Cáo & Thống Kê
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {dateBounds.label}
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Dữ liệu kinh doanh thực tế từ hệ thống SoleStyle • Tự động tính toán & cập nhật theo thời gian thực
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center flex-wrap gap-2 print:hidden shrink-0 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Tải bảng báo cáo định dạng Excel/CSV"
          >
            <FileSpreadsheet size={14} />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="In hoặc lưu PDF"
          >
            <Printer size={14} />
            <span>In / PDF</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. BỘ LỌC THỜI GIAN (TIME FILTER)                     */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5 print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick presets pills */}
          <div className="flex items-center flex-wrap gap-1.5 bg-neutral-100 p-1.5 rounded-2xl">
            {timeFilterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeFilter(opt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === opt.id
                    ? 'bg-amber-400 text-neutral-950 shadow-xs font-black'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Active Range Information Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200">
            <Calendar size={14} className="text-amber-500" />
            <span>{dateBounds.label}</span>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        <AnimatePresence>
          {timeFilter === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-600">Từ ngày:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white font-medium text-neutral-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-600">Đến ngày:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white font-medium text-neutral-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <span className="text-[11px] text-neutral-400 font-medium">
                * Dữ liệu các biểu đồ và số liệu sẽ tự động tính toán tức thì theo khoảng thời gian đã chọn.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. THỐNG KÊ TỔNG QUAN (7 KPI CARDS)                  */}
      {/* ---------------------------------------------------- */}
      {/* ---------------------------------------------------- */}
      {/* 3. THỐNG KÊ TỔNG QUAN (4 KPI CARDS) - HÀNG NGANG     */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>💰</span>
            <span>Doanh thu thực tế :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {formatVND(kpis.totalRevenue)}
          </span>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs">
          <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
            <span>📦</span>
            <span>Tổng đơn hàng :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {kpis.totalOrders} <span className="font-semibold text-blue-700">đơn</span> ({kpis.completedOrders} xong)
          </span>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs">
          <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
            <span>💳</span>
            <span>Giá trị đơn TB :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {formatVND(kpis.averageOrderValue)}
          </span>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>👟</span>
            <span>Đã bán / Khách mới :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {kpis.totalItemsSold} <span className="font-semibold text-emerald-700">đôi</span> / +{kpis.newCustomersCount}
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. DOANH THU & TRẠNG THÁI ĐƠN HÀNG (CHARTS)          */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DOANH THU AREA CHART (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                  BIỂU ĐỒ DOANH THU THEO THỜI GIAN
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                {peakRevenuePoint
                  ? `Đỉnh doanh thu: ${formatVND(peakRevenuePoint.revenue)} (${peakRevenuePoint.displayLabel})`
                  : 'Xu hướng doanh thu thực tế trong kỳ'}
              </p>
            </div>

            {/* Granularity switch buttons */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setChartGranularity('day')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartGranularity === 'day' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setChartGranularity('week')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartGranularity === 'week' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setChartGranularity('month')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartGranularity === 'month' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Tháng
              </button>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="h-72 w-full">
            {revenueTimeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTimeSeries}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="displayLabel"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(val) => formatShortVND(val)}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                    labelFormatter={(label) => `Thời gian: ${label}`}
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderRadius: '16px',
                      color: '#fff',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                      fontSize: '12px',
                      padding: '10px 14px'
                    }}
                    itemStyle={{ color: '#FBBF24', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D97706"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-medium">
                Chưa có dữ liệu đơn hàng trong khoảng thời gian này
              </div>
            )}
          </div>
        </div>

        {/* TRẠNG THÁI ĐƠN HÀNG (1 Column) */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                TRẠNG THÁI ĐƠN HÀNG
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Cơ cấu trạng thái xử lý {kpis.totalOrders} đơn hàng trong kỳ
            </p>
          </div>

          {/* Status Breakdown List & Progress */}
          <div className="space-y-3.5 my-4">
            {orderStatusData.map((st) => (
              <div key={st.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: st.color }} />
                    {st.status}
                  </span>
                  <span className="font-bold text-neutral-900">
                    {st.count} đơn ({st.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, st.percentage)}%`,
                      backgroundColor: st.color
                    }}
                  />
                </div>
              </div>
            ))}

            {orderStatusData.length === 0 && (
              <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                Chưa có đơn hàng trong khoảng thời gian này
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Tỷ lệ giao thành công:</span>
            <span className="font-bold text-emerald-600">
              {kpis.totalOrders > 0
                ? `${Math.round((kpis.completedOrders / kpis.totalOrders) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. DOANH THU THEO DANH MỤC & THƯƠNG HIỆU             */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DOANH THU THEO DANH MỤC */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                    DOANH THU THEO DANH MỤC
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 font-medium">
                  Sneaker, Running, Basketball, Lifestyle...
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={() => setCategoryChartType('donut')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    categoryChartType === 'donut' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Biểu đồ tròn (Doughnut)"
                >
                  Tròn
                </button>
                <button
                  onClick={() => setCategoryChartType('bar')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    categoryChartType === 'bar' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Biểu đồ cột (Bar)"
                >
                  Cột
                </button>
                <button
                  onClick={() => setCategoryChartType('list')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    categoryChartType === 'list' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Danh sách chi tiết"
                >
                  Chi tiết
                </button>
              </div>
            </div>

            {/* Content based on selected chart type */}
            <div className="pt-4">
              {categoryRevenue.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 font-medium">
                  Không có dữ liệu bán hàng theo danh mục trong kỳ
                </div>
              ) : categoryChartType === 'donut' ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryRevenue}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {categoryRevenue.map((entry, index) => (
                          <Cell key={`cat-cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                        contentStyle={{
                          backgroundColor: '#171717',
                          borderRadius: '14px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                        }}
                        itemStyle={{ color: '#FBBF24', fontWeight: 'bold' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                          <span className="text-[11px] font-bold text-neutral-700">
                            {value} ({entry.payload?.percentage}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : categoryChartType === 'bar' ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis
                        tickFormatter={(val) => formatShortVND(val)}
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                        contentStyle={{
                          backgroundColor: '#171717',
                          borderRadius: '14px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                        }}
                      />
                      <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                        {categoryRevenue.map((entry, index) => (
                          <Cell key={`bar-cat-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {categoryRevenue.map((cat) => (
                    <div key={cat.name} className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="font-black text-neutral-900">{cat.name}</span>
                          <span className="text-[11px] text-neutral-400 font-medium">({cat.quantitySold} đôi)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-neutral-900">{formatVND(cat.revenue)}</span>
                          <span className="text-[11px] text-neutral-500 font-bold ml-1.5">({cat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, cat.percentage)}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Tổng danh mục có doanh thu:</span>
            <span className="font-bold text-neutral-900">{categoryRevenue.length} danh mục</span>
          </div>
        </div>

        {/* DOANH THU THEO THƯƠNG HIỆU */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                    DOANH THU THEO THƯƠNG HIỆU
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 font-medium">
                  Nike, Adidas, Puma, Converse, New Balance...
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={() => setBrandChartType('bar')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    brandChartType === 'bar' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Biểu đồ cột (Bar)"
                >
                  Cột
                </button>
                <button
                  onClick={() => setBrandChartType('donut')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    brandChartType === 'donut' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Biểu đồ tròn (Doughnut)"
                >
                  Tròn
                </button>
                <button
                  onClick={() => setBrandChartType('list')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    brandChartType === 'list' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                  title="Danh sách chi tiết"
                >
                  Chi tiết
                </button>
              </div>
            </div>

            {/* Content based on selected chart type */}
            <div className="pt-4">
              {brandRevenue.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 font-medium">
                  Không có dữ liệu bán hàng theo thương hiệu trong kỳ
                </div>
              ) : brandChartType === 'bar' ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brandRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis
                        tickFormatter={(val) => formatShortVND(val)}
                        tick={{ fontSize: 10, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                        contentStyle={{
                          backgroundColor: '#171717',
                          borderRadius: '14px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                        }}
                      />
                      <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                        {brandRevenue.map((entry, index) => (
                          <Cell key={`bar-brand-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : brandChartType === 'donut' ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={brandRevenue}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {brandRevenue.map((entry, index) => (
                          <Cell key={`brand-cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                        contentStyle={{
                          backgroundColor: '#171717',
                          borderRadius: '14px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                        }}
                        itemStyle={{ color: '#FBBF24', fontWeight: 'bold' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                          <span className="text-[11px] font-bold text-neutral-700">
                            {value} ({entry.payload?.percentage}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {brandRevenue.map((b) => (
                    <div key={b.name} className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                          <span className="font-black text-neutral-900">{b.name}</span>
                          <span className="text-[11px] text-neutral-400 font-medium">({b.quantitySold} đôi)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-neutral-900">{formatVND(b.revenue)}</span>
                          <span className="text-[11px] text-neutral-500 font-bold ml-1.5">({b.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, b.percentage)}%`, backgroundColor: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Thương hiệu dẫn đầu:</span>
            <span className="font-bold text-neutral-900">
              {brandRevenue.length > 0 ? `${brandRevenue[0].name} (${brandRevenue[0].percentage}%)` : 'Chưa có'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 6. TOP 10 SẢN PHẨM BÁN CHẠY & CẢNH BÁO TỒN KHO THẤP */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP 10 SẢN PHẨM BÁN CHẠY (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                  TOP 10 SẢN PHẨM BÁN CHẠY NHẤT
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Xếp hạng theo số lượng đôi đã bán & doanh thu đem lại
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm tên, SKU, hãng..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-none focus:border-amber-400 w-44 sm:w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Top</th>
                  <th className="py-3.5 px-5">Sản phẩm</th>
                  <th className="py-3.5 px-5">Hãng</th>
                  <th className="py-3.5 px-5 text-center">Đã bán</th>
                  <th className="py-3.5 px-5 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {topProducts.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <span
                        className={`h-6 w-6 rounded-lg flex items-center justify-center font-black text-[11px] ${
                          idx === 0
                            ? 'bg-amber-400 text-neutral-950 shadow-xs'
                            : idx === 1
                            ? 'bg-neutral-300 text-neutral-900'
                            : idx === 2
                            ? 'bg-amber-700/20 text-amber-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-xl object-contain bg-white border border-neutral-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-neutral-900 line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-neutral-400 font-medium">
                            {p.sku || 'SKU-SS2026'} • {p.category || 'Sneaker'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 font-bold text-[11px] text-neutral-700">
                        {p.brand}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="font-black text-neutral-900 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                        {p.quantitySold} đôi
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-black text-neutral-900">
                      {formatVND(p.revenue)}
                    </td>
                  </tr>
                ))}

                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-neutral-400 font-medium">
                      Không tìm thấy sản phẩm nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CẢNH BÁO SẢN PHẨM SẮP HẾT HÀNG (1 Column) */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 font-bold">
                  <AlertTriangle size={16} />
                </span>
                <h2 className="text-base font-black text-neutral-900 uppercase">
                  SẢN PHẨM SẮP HẾT HÀNG
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {lowStockProducts.length} mẫu
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Cần nhập hàng bổ sung các size có tồn kho ≤ 3 đôi
            </p>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {lowStockProducts.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between gap-3 hover:border-neutral-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-xl object-contain bg-white border border-neutral-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-xs text-neutral-900 line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                      {item.lowStockSizes.length > 0 ? (
                        <span>
                          Size {item.lowStockSizes.map((s) => s.size).join(', ')}: Còn{' '}
                          {item.lowStockSizes.reduce((acc, curr) => acc + curr.stock, 0)} đôi
                        </span>
                      ) : (
                        <span>Tổng tồn kho: {item.totalStock} đôi</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab?.('products')}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 text-[11px] font-bold hover:bg-neutral-100 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  title="Chuyển đến trang Quản lý sản phẩm"
                >
                  <span>Xem</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                Tất cả sản phẩm đều có số lượng tồn kho dồi dào
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => onNavigateTab?.('products')}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
            >
              Xem toàn bộ kho hàng (/admin/products)
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 7. PHÂN TÍCH KHÁCH HÀNG & MÃ KHUYẾN MÃI              */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHÂN TÍCH KHÁCH HÀNG */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                  KHÁCH HÀNG & MỨC ĐỘ TRUNG THÀNH
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Phân loại khách mới, khách quay lại & top chi tiêu
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {customerAnalytics.totalCustomersWhoPurchased} khách đã mua
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
              <span className="text-[10px] font-black uppercase text-neutral-400 block">Khách mới</span>
              <span className="text-lg font-black text-neutral-900">{customerAnalytics.newCustomersCount}</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
              <span className="text-[10px] font-black uppercase text-neutral-400 block">Khách quay lại</span>
              <span className="text-lg font-black text-emerald-600">
                {customerAnalytics.returningCustomersCount}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
              <span className="text-[10px] font-black uppercase text-neutral-400 block">Tỷ lệ quay lại</span>
              <span className="text-lg font-black text-neutral-900">
                {customerAnalytics.totalCustomersWhoPurchased > 0
                  ? `${Math.round(
                      (customerAnalytics.returningCustomersCount /
                        customerAnalytics.totalCustomersWhoPurchased) *
                        100
                    )}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
              TOP KHÁCH HÀNG CHI TIÊU NHIỀU NHẤT
            </span>
            <div className="space-y-2">
              {customerAnalytics.topCustomers.slice(0, 5).map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-400/20 text-amber-700 font-black flex items-center justify-center text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-neutral-900">{c.name}</div>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        {c.phone} {c.email ? `• ${c.email}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-neutral-900">{formatVND(c.totalSpent)}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{c.ordersCount} đơn hàng</div>
                  </div>
                </div>
              ))}

              {customerAnalytics.topCustomers.length === 0 && (
                <div className="py-6 text-center text-xs text-neutral-400 font-medium">
                  Chưa có dữ liệu khách hàng mua sắm trong kỳ
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HIỆU QUẢ KHUYẾN MÃI & MÃ GIẢM GIÁ */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                  HIỆU QUẢ MÃ KHUYẾN MÃI
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Thống kê lượt sử dụng voucher & doanh thu thúc đẩy
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
              {promoAnalytics.length} mã đã dùng
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {promoAnalytics.map((promo) => (
              <div
                key={promo.code}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2 hover:border-neutral-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-black tracking-wider text-xs">
                      {promo.code}
                    </span>
                    <span className="font-bold text-neutral-800 line-clamp-1">{promo.name}</span>
                  </div>
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                    {promo.usageCount} lượt dùng
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-200/60">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Tổng tiền đã giảm</span>
                    <span className="font-bold text-rose-600">-{formatVND(promo.totalDiscountAmount)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-medium">Doanh thu mang lại</span>
                    <span className="font-black text-neutral-900">{formatVND(promo.associatedRevenue)}</span>
                  </div>
                </div>
              </div>
            ))}

            {promoAnalytics.length === 0 && (
              <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                Chưa có mã giảm giá nào được áp dụng trong khoảng thời gian này
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 8. ĐƠN HÀNG GẦN ĐÂY TRONG KỲ                         */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
              <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                DANH SÁCH ĐƠN HÀNG GẦN ĐÂY TRONG KỲ
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Hiển thị {recentOrders.length} đơn hàng mới nhất theo bộ lọc thời gian
            </p>
          </div>

          <button
            onClick={() => onNavigateTab?.('orders')}
            className="text-xs font-bold text-neutral-800 hover:text-amber-500 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Quản lý tất cả đơn hàng</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Mã đơn</th>
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Ngày đặt</th>
                <th className="py-3.5 px-5">Phương thức TT</th>
                <th className="py-3.5 px-5 text-right">Tổng tiền</th>
                <th className="py-3.5 px-5 text-center">Trạng thái</th>
                <th className="py-3.5 px-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {recentOrders.map((order) => {
                const isCancelled = order.status === 'Đã hủy';
                const isCompleted = order.status === 'Đã giao' || order.status === 'Đã giao hàng';
                const isShipping = order.status === 'Đang giao';

                return (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-4 px-5 font-black text-neutral-900">
                      {order.orderCode || order.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-neutral-900">{order.recipientName}</div>
                      <div className="text-[10px] text-neutral-400 font-medium">{order.phone}</div>
                    </td>
                    <td className="py-4 px-5 text-neutral-600 font-medium">
                      {order.orderDate}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 font-bold text-[10px] text-neutral-700 uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-black text-neutral-900">
                      {formatVND(order.grandTotal)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-700'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : isShipping
                            ? 'bg-cyan-100 text-cyan-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onSelectOrder?.(order)}
                        className="px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}

              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-neutral-400 font-medium">
                    Không có đơn hàng nào trong khoảng thời gian đã chọn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
