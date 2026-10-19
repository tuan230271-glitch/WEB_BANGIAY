import { Order, Product, UserProfile, CategoryItem, BrandItem, Promotion } from '../types';

export type TimeFilterType = 'today' | '7days' | '30days' | 'this_month' | 'last_month' | 'this_year' | 'custom';

export interface DateRangeBounds {
  start: Date;
  end: Date;
  label: string;
}

/**
 * Format currency VND (e.g. 2.450.000 ₫)
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

/**
 * Format short currency for chart axes (e.g. 2.5Tr, 500K)
 */
export function formatShortVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}Tr`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return `${amount}`;
}

/**
 * Parse various order date formats to standard Date object
 * Supported formats:
 * - '22/07/2026 - 20:30'
 * - '22/07/2026'
 * - '2026-08-15T14:30:00'
 * - '2026-08-15'
 */
export function parseOrderDate(dateStr?: string): Date {
  if (!dateStr) return new Date();

  // If already standard ISO or parseable by Date.parse
  if (dateStr.includes('-') && !dateStr.includes('/')) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  }

  // If format 'DD/MM/YYYY - HH:mm' or 'DD/MM/YYYY'
  if (dateStr.includes('/')) {
    const parts = dateStr.split(' - ');
    const datePart = parts[0].trim();
    const timePart = parts[1]?.trim() || '00:00';

    const [d, m, y] = datePart.split('/').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);

    if (d && m && y) {
      return new Date(y, m - 1, d, hh || 0, mm || 0, 0);
    }
  }

  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Get start and end Date for a given filter preset
 * Reference current date: 2026-08-15
 */
export function getDateRangeBounds(
  filter: TimeFilterType,
  customStart?: string,
  customEnd?: string,
  refDate: Date = new Date() // default to current date (e.g. 2026-08-15)
): DateRangeBounds {
  const now = new Date(refDate);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (7 for August)
  const currentDate = now.getDate();

  switch (filter) {
    case 'today': {
      const start = new Date(currentYear, currentMonth, currentDate, 0, 0, 0, 0);
      const end = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
      const dayStr = `${String(currentDate).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
      return { start, end, label: `Hôm nay (${dayStr})` };
    }

    case '7days': {
      const end = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const sStr = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}`;
      const eStr = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`;
      return { start, end, label: `7 ngày qua (${sStr} - ${eStr})` };
    }

    case '30days': {
      const end = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      const sStr = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}`;
      const eStr = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`;
      return { start, end, label: `30 ngày qua (${sStr} - ${eStr})` };
    }

    case 'this_month': {
      const start = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      return { start, end, label: `Tháng này (Tháng ${currentMonth + 1}/${currentYear})` };
    }

    case 'last_month': {
      const start = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      const prevMonthNum = currentMonth === 0 ? 12 : currentMonth;
      const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return { start, end, label: `Tháng trước (Tháng ${prevMonthNum}/${prevMonthYear})` };
    }

    case 'this_year': {
      const start = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      return { start, end, label: `Năm nay (Năm ${currentYear})` };
    }

    case 'custom': {
      let start = customStart ? new Date(customStart + 'T00:00:00') : new Date(currentYear, currentMonth, 1);
      let end = customEnd ? new Date(customEnd + 'T23:59:59') : new Date(currentYear, currentMonth, currentDate, 23, 59, 59);

      if (isNaN(start.getTime())) start = new Date(currentYear, currentMonth, 1);
      if (isNaN(end.getTime())) end = new Date(currentYear, currentMonth, currentDate, 23, 59, 59);

      if (end < start) {
        // Swap if inverted
        const temp = start;
        start = end;
        end = temp;
      }

      const sStr = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`;
      const eStr = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`;
      return { start, end, label: `Tùy chỉnh (${sStr} - ${eStr})` };
    }

    default: {
      const start = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
      return { start, end, label: `Tháng ${currentMonth + 1}/${currentYear}` };
    }
  }
}

/**
 * Filter orders that fall within start & end Date bounds
 */
export function filterOrdersByDate(orders: Order[], bounds: DateRangeBounds): Order[] {
  return orders.filter((order) => {
    const orderTime = parseOrderDate(order.orderDate).getTime();
    return orderTime >= bounds.start.getTime() && orderTime <= bounds.end.getTime();
  });
}

/**
 * Filter users registered within date bounds
 */
export function filterUsersByDate(users: UserProfile[], bounds: DateRangeBounds): UserProfile[] {
  return users.filter((user) => {
    if (!user.createdAt) return false;
    const userTime = parseOrderDate(user.createdAt).getTime();
    return userTime >= bounds.start.getTime() && userTime <= bounds.end.getTime();
  });
}

export interface ReportKPIs {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  canceledOrders: number;
  processingOrders: number;
  shippingOrders: number;
  averageOrderValue: number;
  newCustomersCount: number;
  totalItemsSold: number;
  totalDiscounts: number;
  revenueComparison?: number; // % change vs previous period
}

/**
 * Calculate KPI summary for filtered orders
 */
export function calculateReportKPIs(
  filteredOrders: Order[],
  filteredUsers: UserProfile[],
  previousPeriodOrders: Order[] = []
): ReportKPIs {
  let totalRevenue = 0;
  let completedOrders = 0;
  let canceledOrders = 0;
  let processingOrders = 0;
  let shippingOrders = 0;
  let totalItemsSold = 0;
  let totalDiscounts = 0;

  const validOrders = filteredOrders.filter((o) => o.status !== 'Đã hủy');

  filteredOrders.forEach((o) => {
    if (o.status === 'Đã hủy') {
      canceledOrders++;
      return;
    }

    // Revenue calculation uses actual grandTotal paid / confirmed at order time
    totalRevenue += o.grandTotal || 0;
    totalDiscounts += o.discount || 0;

    if (o.status === 'Đã giao' || o.status === 'Đã giao hàng') {
      completedOrders++;
    } else if (o.status === 'Đang giao') {
      shippingOrders++;
    } else {
      processingOrders++;
    }

    // Count items sold in valid orders
    if (Array.isArray(o.items)) {
      o.items.forEach((item) => {
        totalItemsSold += item.quantity || 1;
      });
    }
  });

  const totalOrders = filteredOrders.length;
  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  const newCustomersCount = filteredUsers.length;

  // Previous period revenue comparison
  let previousRevenue = 0;
  previousPeriodOrders.forEach((o) => {
    if (o.status !== 'Đã hủy') {
      previousRevenue += o.grandTotal || 0;
    }
  });

  let revenueComparison: number | undefined = undefined;
  if (previousRevenue > 0) {
    revenueComparison = Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100);
  }

  return {
    totalRevenue,
    totalOrders,
    completedOrders,
    canceledOrders,
    processingOrders,
    shippingOrders,
    averageOrderValue,
    newCustomersCount,
    totalItemsSold,
    totalDiscounts,
    revenueComparison
  };
}

export interface RevenueDataPoint {
  dateKey: string;
  displayLabel: string;
  revenue: number;
  ordersCount: number;
  itemsCount: number;
}

/**
 * Generate Time-Series Data for Revenue Chart
 */
export function generateRevenueTimeSeries(
  filteredOrders: Order[],
  bounds: DateRangeBounds,
  granularity: 'day' | 'week' | 'month' = 'day'
): RevenueDataPoint[] {
  const validOrders = filteredOrders.filter((o) => o.status !== 'Đã hủy');
  const durationDays = Math.max(1, Math.round((bounds.end.getTime() - bounds.start.getTime()) / (1000 * 60 * 60 * 24)));

  // Auto select granularity if duration is large
  let actualGranularity = granularity;
  if (durationDays > 90 && granularity === 'day') {
    actualGranularity = 'month';
  } else if (durationDays > 35 && granularity === 'day') {
    actualGranularity = 'week';
  }

  const map = new Map<string, RevenueDataPoint>();

  if (actualGranularity === 'day') {
    // Fill all days in range to avoid gaps
    const cur = new Date(bounds.start);
    while (cur <= bounds.end) {
      const d = cur.getDate();
      const m = cur.getMonth() + 1;
      const y = cur.getFullYear();
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const displayLabel = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;

      map.set(dateKey, {
        dateKey,
        displayLabel,
        revenue: 0,
        ordersCount: 0,
        itemsCount: 0
      });
      cur.setDate(cur.getDate() + 1);
    }

    validOrders.forEach((o) => {
      const d = parseOrderDate(o.orderDate);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const entry = map.get(dateKey);
      if (entry) {
        entry.revenue += o.grandTotal || 0;
        entry.ordersCount += 1;
        o.items?.forEach((it) => (entry.itemsCount += it.quantity || 1));
      }
    });
  } else if (actualGranularity === 'month') {
    // Fill all months
    const cur = new Date(bounds.start.getFullYear(), bounds.start.getMonth(), 1);
    while (cur <= bounds.end) {
      const m = cur.getMonth() + 1;
      const y = cur.getFullYear();
      const dateKey = `${y}-${String(m).padStart(2, '0')}`;
      const displayLabel = `T${m}/${y}`;

      map.set(dateKey, {
        dateKey,
        displayLabel,
        revenue: 0,
        ordersCount: 0,
        itemsCount: 0
      });
      cur.setMonth(cur.getMonth() + 1);
    }

    validOrders.forEach((o) => {
      const d = parseOrderDate(o.orderDate);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const entry = map.get(dateKey);
      if (entry) {
        entry.revenue += o.grandTotal || 0;
        entry.ordersCount += 1;
        o.items?.forEach((it) => (entry.itemsCount += it.quantity || 1));
      }
    });
  } else {
    // 'week' granularity
    validOrders.forEach((o) => {
      const d = parseOrderDate(o.orderDate);
      const day = d.getDate();
      const weekNum = Math.ceil(day / 7);
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-W${weekNum}`;
      const displayLabel = `Tuần ${weekNum} (T${d.getMonth() + 1})`;

      if (!map.has(dateKey)) {
        map.set(dateKey, {
          dateKey,
          displayLabel,
          revenue: 0,
          ordersCount: 0,
          itemsCount: 0
        });
      }

      const entry = map.get(dateKey)!;
      entry.revenue += o.grandTotal || 0;
      entry.ordersCount += 1;
      o.items?.forEach((it) => (entry.itemsCount += it.quantity || 1));
    });
  }

  return Array.from(map.values());
}

export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
  revenue: number;
}

/**
 * Generate Order Status Breakdown
 */
export function generateOrderStatusBreakdown(orders: Order[]): StatusBreakdownItem[] {
  const total = orders.length;
  if (total === 0) return [];

  const counts: Record<string, { count: number; revenue: number; color: string }> = {
    'Chờ xử lý': { count: 0, revenue: 0, color: '#F59E0B' },
    'Đã xác nhận': { count: 0, revenue: 0, color: '#2563EB' },
    'Đang chuẩn bị hàng': { count: 0, revenue: 0, color: '#3B82F6' },
    'Đang giao': { count: 0, revenue: 0, color: '#60A5FA' },
    'Đã giao': { count: 0, revenue: 0, color: '#16A34A' },
    'Đã hủy': { count: 0, revenue: 0, color: '#EF4444' }
  };

  orders.forEach((o) => {
    let key = o.status as string;
    if (key === 'Chờ xác nhận') key = 'Chờ xử lý';
    if (key === 'Đã giao hàng') key = 'Đã giao';

    if (!counts[key]) {
      counts[key] = { count: 0, revenue: 0, color: '#6B7280' };
    }
    counts[key].count += 1;
    if (key !== 'Đã hủy') {
      counts[key].revenue += o.grandTotal || 0;
    }
  });

  return Object.entries(counts)
    .filter(([_, data]) => data.count > 0)
    .map(([status, data]) => ({
      status,
      count: data.count,
      percentage: Math.round((data.count / total) * 100),
      color: data.color,
      revenue: data.revenue
    }));
}

export interface TopProductItem {
  id: string;
  name: string;
  sku?: string;
  brand: string;
  category?: string;
  image: string;
  quantitySold: number;
  revenue: number;
  currentPrice: number;
  currentStock: number;
}

/**
 * Generate Top 10 Best Sellers
 */
export function generateTopProducts(orders: Order[], products: Product[]): TopProductItem[] {
  const productMap = new Map<string, TopProductItem>();

  // Map existing products for stock and category info
  const catalogMap = new Map<string, Product>();
  products.forEach((p) => {
    catalogMap.set(p.id, p);
    if (p.name) catalogMap.set(p.name.toLowerCase().trim(), p);
  });

  orders.forEach((o) => {
    if (o.status === 'Đã hủy') return;

    o.items?.forEach((item) => {
      const pId = item.productId || item.productName;
      const catalogProd = catalogMap.get(item.productId) || catalogMap.get(item.productName.toLowerCase().trim());

      let totalStock = 0;
      if (catalogProd?.sizeStock) {
        totalStock = Object.values(catalogProd.sizeStock).reduce((a, b) => a + b, 0);
      } else if (catalogProd?.sizes) {
        totalStock = catalogProd.sizes.length * 5; // fallback estimation
      }

      if (!productMap.has(pId)) {
        productMap.set(pId, {
          id: item.productId || `prod-${Date.now()}`,
          name: item.productName,
          sku: catalogProd?.sku || `SKU-${item.productId.slice(0, 6).toUpperCase()}`,
          brand: item.brand || catalogProd?.brand || 'SoleStyle',
          category: catalogProd?.category || 'Sneaker',
          image: item.image || catalogProd?.image || '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
          quantitySold: 0,
          revenue: 0,
          currentPrice: catalogProd?.price || item.unitPrice || 0,
          currentStock: totalStock
        });
      }

      const entry = productMap.get(pId)!;
      entry.quantitySold += item.quantity || 1;
      entry.revenue += item.totalPrice || (item.unitPrice * (item.quantity || 1));
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue)
    .slice(0, 10);
}

export interface CategoryRevenueItem {
  name: string;
  revenue: number;
  quantitySold: number;
  percentage: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Sneaker: '#FF5400',
  Running: '#007BC4',
  Lifestyle: '#10B981',
  Football: '#8B5CF6',
  Basketball: '#F59E0B',
  Training: '#EC4899',
  'Khác': '#6B7280'
};

/**
 * Generate Revenue Breakdown by Category
 */
export function generateCategoryRevenue(
  orders: Order[],
  products: Product[],
  _categories: CategoryItem[] = []
): CategoryRevenueItem[] {
  const prodCatMap = new Map<string, string>();
  products.forEach((p) => {
    prodCatMap.set(p.id, p.category || 'Sneaker');
    if (p.name) prodCatMap.set(p.name.toLowerCase().trim(), p.category || 'Sneaker');
  });

  const catMap = new Map<string, { revenue: number; quantity: number }>();
  let totalRevenue = 0;

  orders.forEach((o) => {
    if (o.status === 'Đã hủy') return;

    o.items?.forEach((item) => {
      const cat = prodCatMap.get(item.productId) || prodCatMap.get(item.productName.toLowerCase().trim()) || 'Sneaker';
      const itemRev = item.totalPrice || (item.unitPrice * (item.quantity || 1));

      if (!catMap.has(cat)) {
        catMap.set(cat, { revenue: 0, quantity: 0 });
      }
      const entry = catMap.get(cat)!;
      entry.revenue += itemRev;
      entry.quantity += item.quantity || 1;
      totalRevenue += itemRev;
    });
  });

  return Array.from(catMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      quantitySold: data.quantity,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
      color: CATEGORY_COLORS[name] || '#6366F1'
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface BrandRevenueItem {
  name: string;
  revenue: number;
  quantitySold: number;
  percentage: number;
  color: string;
}

const BRAND_COLORS: Record<string, string> = {
  Nike: '#111111',
  Adidas: '#007BC4',
  Puma: '#D946EF',
  Converse: '#F43F5E',
  'New Balance': '#10B981',
  Vans: '#F59E0B',
  'Khác': '#6B7280'
};

/**
 * Generate Revenue Breakdown by Brand
 */
export function generateBrandRevenue(
  orders: Order[],
  products: Product[],
  _brands: BrandItem[] = []
): BrandRevenueItem[] {
  const prodBrandMap = new Map<string, string>();
  products.forEach((p) => {
    prodBrandMap.set(p.id, p.brand || 'Nike');
    if (p.name) prodBrandMap.set(p.name.toLowerCase().trim(), p.brand || 'Nike');
  });

  const brandMap = new Map<string, { revenue: number; quantity: number }>();
  let totalRevenue = 0;

  orders.forEach((o) => {
    if (o.status === 'Đã hủy') return;

    o.items?.forEach((item) => {
      const brand = item.brand || prodBrandMap.get(item.productId) || prodBrandMap.get(item.productName.toLowerCase().trim()) || 'Nike';
      const itemRev = item.totalPrice || (item.unitPrice * (item.quantity || 1));

      if (!brandMap.has(brand)) {
        brandMap.set(brand, { revenue: 0, quantity: 0 });
      }
      const entry = brandMap.get(brand)!;
      entry.revenue += itemRev;
      entry.quantity += item.quantity || 1;
      totalRevenue += itemRev;
    });
  });

  return Array.from(brandMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      quantitySold: data.quantity,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
      color: BRAND_COLORS[name] || '#3B82F6'
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface CustomerAnalyticsSummary {
  newCustomersCount: number;
  returningCustomersCount: number;
  totalCustomersWhoPurchased: number;
  topCustomers: {
    name: string;
    phone: string;
    email?: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }[];
}

/**
 * Generate Customer Analytics
 */
export function generateCustomerAnalytics(
  orders: Order[],
  usersList: UserProfile[],
  bounds: DateRangeBounds
): CustomerAnalyticsSummary {
  // Map customer purchases
  const customerMap = new Map<
    string,
    {
      name: string;
      phone: string;
      email?: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }
  >();

  // Count distinct all-time orders per customer to detect returning vs new
  const allTimeOrderCounts = new Map<string, number>();
  orders.forEach((o) => {
    if (o.status === 'Đã hủy') return;
    const key = (o.phone || o.email || o.recipientName).toLowerCase().trim();
    allTimeOrderCounts.set(key, (allTimeOrderCounts.get(key) || 0) + 1);
  });

  let returningCount = 0;
  let newPurchasersCount = 0;

  // Filtered orders in period
  const validOrdersInPeriod = orders.filter((o) => {
    if (o.status === 'Đã hủy') return false;
    const t = parseOrderDate(o.orderDate).getTime();
    return t >= bounds.start.getTime() && t <= bounds.end.getTime();
  });

  const periodPurchasers = new Set<string>();

  validOrdersInPeriod.forEach((o) => {
    const key = (o.phone || o.email || o.recipientName).toLowerCase().trim();
    periodPurchasers.add(key);

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: o.recipientName || 'Khách hàng',
        phone: o.phone || 'N/A',
        email: o.email || '',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: o.orderDate
      });
    }

    const c = customerMap.get(key)!;
    c.ordersCount += 1;
    c.totalSpent += o.grandTotal || 0;
    c.lastOrderDate = o.orderDate;
  });

  periodPurchasers.forEach((key) => {
    const allTime = allTimeOrderCounts.get(key) || 1;
    if (allTime > 1) {
      returningCount++;
    } else {
      newPurchasersCount++;
    }
  });

  // Top Customers sorted by total spent
  const topCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent || b.ordersCount - a.ordersCount)
    .slice(0, 10);

  // New registered users in period
  const newUsersCount = usersList.filter((u) => {
    if (!u.createdAt) return false;
    const t = parseOrderDate(u.createdAt).getTime();
    return t >= bounds.start.getTime() && t <= bounds.end.getTime();
  }).length;

  return {
    newCustomersCount: newUsersCount || newPurchasersCount,
    returningCustomersCount: returningCount,
    totalCustomersWhoPurchased: periodPurchasers.size,
    topCustomers
  };
}

export interface PromoAnalyticsItem {
  code: string;
  name?: string;
  usageCount: number;
  totalDiscountAmount: number;
  associatedRevenue: number;
  discountType?: string;
}

/**
 * Generate Promotion Analytics
 */
export function generatePromotionAnalytics(
  orders: Order[],
  promotions: Promotion[] = []
): PromoAnalyticsItem[] {
  const promoMap = new Map<string, PromoAnalyticsItem>();

  // Map known promotions
  const promoCatalog = new Map<string, Promotion>();
  promotions.forEach((p) => promoCatalog.set(p.code.toUpperCase().trim(), p));

  orders.forEach((o) => {
    if (o.status === 'Đã hủy') return;

    if (o.discountCode && o.discount > 0) {
      const code = o.discountCode.toUpperCase().trim();
      const catalog = promoCatalog.get(code);

      if (!promoMap.has(code)) {
        promoMap.set(code, {
          code,
          name: catalog?.name || 'Mã giảm giá đơn hàng',
          usageCount: 0,
          totalDiscountAmount: 0,
          associatedRevenue: 0,
          discountType: catalog?.discountType === 'percent' ? `${catalog.discountValue}%` : 'Giảm tiền trực tiếp'
        });
      }

      const entry = promoMap.get(code)!;
      entry.usageCount += 1;
      entry.totalDiscountAmount += o.discount;
      entry.associatedRevenue += o.grandTotal;
    }
  });

  return Array.from(promoMap.values()).sort((a, b) => b.usageCount - a.usageCount || b.associatedRevenue - a.associatedRevenue);
}

export interface LowStockProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  totalStock: number;
  lowStockSizes: { size: number; stock: number }[];
}

/**
 * Low stock threshold checking
 */
export function getLowStockProducts(products: Product[], totalStockThreshold = 10, sizeThreshold = 3): LowStockProductItem[] {
  const list: LowStockProductItem[] = [];

  products.forEach((p) => {
    if (p.isDeleted || p.status === 'Đã xóa' || p.status === 'Ngừng kinh doanh') return;

    let totalStock = 0;
    const lowSizes: { size: number; stock: number }[] = [];

    if (p.sizeStock) {
      Object.entries(p.sizeStock).forEach(([sizeStr, count]) => {
        const numCount = Number(count) || 0;
        totalStock += numCount;
        if (numCount <= sizeThreshold) {
          lowSizes.push({ size: Number(sizeStr), stock: numCount });
        }
      });
    } else if (p.sizes) {
      // Default estimation
      p.sizes.forEach((s) => {
        const est = s % 2 === 0 ? 2 : 4;
        totalStock += est;
        if (est <= sizeThreshold) {
          lowSizes.push({ size: s, stock: est });
        }
      });
    }

    if (totalStock <= totalStockThreshold || lowSizes.length > 0) {
      list.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        image: p.image,
        price: p.price,
        totalStock,
        lowStockSizes: lowSizes
      });
    }
  });

  return list.sort((a, b) => a.totalStock - b.totalStock);
}

/**
 * Export CSV report helper with UTF-8 BOM for Microsoft Excel compatibility
 */
export function generateCSVReport(
  kpis: ReportKPIs,
  revenueTimeSeries: RevenueDataPoint[],
  topProducts: TopProductItem[],
  categoryRevenue: CategoryRevenueItem[],
  brandRevenue: BrandRevenueItem[],
  ordersList: Order[],
  filterLabel: string
): void {
  const rows: string[] = [];

  // Title
  rows.push(`"BÁO CÁO KINH DOANH & THỐNG KÊ K-NICKS"`);
  rows.push(`"Khoảng thời gian: ${filterLabel}"`);
  rows.push(`"Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}"`);
  rows.push('');

  // 1. KPI Overview
  rows.push(`"--- 1. TỔNG QUAN KINH DOANH ---"`);
  rows.push(`"Chỉ số","Giá trị"`);
  rows.push(`"Tổng doanh thu thực tế","${kpis.totalRevenue.toLocaleString('vi-VN')} đ"`);
  rows.push(`"Tổng số đơn hàng","${kpis.totalOrders}"`);
  rows.push(`"Đơn hoàn thành (Đã giao)","${kpis.completedOrders}"`);
  rows.push(`"Đơn đã hủy","${kpis.canceledOrders}"`);
  rows.push(`"Giá trị đơn hàng trung bình (AOV)","${kpis.averageOrderValue.toLocaleString('vi-VN')} đ"`);
  rows.push(`"Khách hàng mới","${kpis.newCustomersCount}"`);
  rows.push(`"Tổng sản phẩm đã bán","${kpis.totalItemsSold}"`);
  rows.push(`"Tổng tiền chiết khấu / voucher","${kpis.totalDiscounts.toLocaleString('vi-VN')} đ"`);
  rows.push('');

  // 2. Revenue by Day / Time
  rows.push(`"--- 2. BIỂU ĐỒ DOANH THU THEO MỐC THỜI GIAN ---"`);
  rows.push(`"Thời gian","Doanh thu (VND)","Số đơn hàng","Số lượng sản phẩm bán"`);
  revenueTimeSeries.forEach((pt) => {
    rows.push(`"${pt.displayLabel}","${pt.revenue}","${pt.ordersCount}","${pt.itemsCount}"`);
  });
  rows.push('');

  // 3. Top Products
  rows.push(`"--- 3. TOP 10 SẢN PHẨM BÁN CHẠY NHẤT ---"`);
  rows.push(`"STT","Tên sản phẩm","SKU","Thương hiệu","Danh mục","Số lượng đã bán","Doanh thu tạo ra (VND)","Giá hiện tại"`);
  topProducts.forEach((prod, idx) => {
    rows.push(`"${idx + 1}","${prod.name}","${prod.sku || ''}","${prod.brand}","${prod.category || ''}","${prod.quantitySold}","${prod.revenue}","${prod.currentPrice}"`);
  });
  rows.push('');

  // 4. Revenue by Category
  rows.push(`"--- 4. DOANH THU THEO DANH MỤC ---"`);
  rows.push(`"Danh mục","Doanh thu (VND)","Số lượng bán","Tỷ trọng (%)"`);
  categoryRevenue.forEach((cat) => {
    rows.push(`"${cat.name}","${cat.revenue}","${cat.quantitySold}","${cat.percentage}%"`);
  });
  rows.push('');

  // 5. Revenue by Brand
  rows.push(`"--- 5. DOANH THU THEO THƯƠNG HIỆU ---"`);
  rows.push(`"Thương hiệu","Doanh thu (VND)","Số lượng bán","Tỷ trọng (%)"`);
  brandRevenue.forEach((b) => {
    rows.push(`"${b.name}","${b.revenue}","${b.quantitySold}","${b.percentage}%"`);
  });
  rows.push('');

  // 6. Orders List
  rows.push(`"--- 6. DANH SÁCH ĐƠN HÀNG TRONG KỲ ---"`);
  rows.push(`"Mã đơn","Khách hàng","Số điện thoại","Ngày đặt","Phương thức TT","Giảm giá","Tổng tiền (VND)","Trạng thái"`);
  ordersList.forEach((o) => {
    rows.push(`"${o.orderCode || o.id}","${o.recipientName}","${o.phone}","${o.orderDate}","${o.paymentMethod?.toUpperCase()}","${o.discount || 0}","${o.grandTotal}","${o.status}"`);
  });

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanFilterName = filterLabel.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `BaoCao_SoleStyle_${cleanFilterName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
