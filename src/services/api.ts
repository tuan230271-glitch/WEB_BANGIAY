import {
  Product,
  CategoryItem,
  BrandItem,
  Order,
  OrderItem,
  Promotion,
  BannerItem,
  Review,
  UserProfile,
  SystemSettings,
} from '../types';

const getApiBaseUrl = (): string => {
  return '/api';
};

function handleLocalFallback<T>(endpoint: string, options?: RequestInit): T {
  const method = (options?.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0].toLowerCase();

  // Storage keys mapping
  let storageKey = '';
  if (cleanEndpoint.startsWith('/products')) storageKey = 'solestyle_products_v13';
  else if (cleanEndpoint.startsWith('/categories')) storageKey = 'solestyle_categories_v2';
  else if (cleanEndpoint.startsWith('/brands')) storageKey = 'solestyle_brands_v1';
  else if (cleanEndpoint.startsWith('/orders')) storageKey = 'solestyle_orders';
  else if (cleanEndpoint.startsWith('/promotions')) storageKey = 'solestyle_promotions_v1';
  else if (cleanEndpoint.startsWith('/banners')) storageKey = 'solestyle_banners_v1';
  else if (cleanEndpoint.startsWith('/reviews')) storageKey = 'solestyle_reviews';
  else if (cleanEndpoint.startsWith('/users') || cleanEndpoint.startsWith('/customers')) storageKey = 'solestyle_users';
  else if (cleanEndpoint.startsWith('/settings')) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('solestyle_system_settings_v1') || '{}';
      return { id: 'settings-1', key: 'SystemSettings', value: saved } as unknown as T;
    }
    return {} as T;
  }

  if (typeof window === 'undefined' || !storageKey) {
    return (Array.isArray([] as unknown as T) ? [] : {}) as T;
  }

  let items: any[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) items = JSON.parse(raw);
    if (!Array.isArray(items)) items = [];
  } catch {
    items = [];
  }

  if (method === 'GET') {
    const parts = endpoint.split('?')[0].split('/');
    const id = parts[2];
    if (id) {
      const found = items.find((item: any) => String(item.id) === String(id));
      return (found || {}) as T;
    }
    return items as unknown as T;
  }

  if (method === 'POST') {
    let body: any = {};
    try {
      body = options?.body ? JSON.parse(options.body as string) : {};
    } catch {}
    const newItem = {
      ...body,
      id: body.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: body.createdAt || new Date().toISOString(),
    };
    items.unshift(newItem);
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
    return newItem as T;
  }

  if (method === 'PUT') {
    const parts = endpoint.split('?')[0].split('/');
    const id = parts[2];
    let body: any = {};
    try {
      body = options?.body ? JSON.parse(options.body as string) : {};
    } catch {}
    let updatedItem: any = body;
    items = items.map((item: any) => {
      if (String(item.id) === String(id)) {
        updatedItem = { ...item, ...body, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
    return updatedItem as T;
  }

  if (method === 'DELETE') {
    const parts = endpoint.split('?')[0].split('/');
    const id = parts[2];
    items = items.filter((item: any) => String(item.id) !== String(id));
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
    return {} as T;
  }

  return items as unknown as T;
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      throw new Error(`Endpoint not available: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch {
    // Graceful fallback to persistent localStorage mock state
    return handleLocalFallback<T>(endpoint, options);
  }
}

// ----------------------------------------------------
// PRODUCTS API
// ----------------------------------------------------
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>('/Products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiRequest<Product>(`/Products/${id}`);
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>('/Products', {
      method: 'POST',
      body: JSON.stringify({
        id: product.id,
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        category: product.category,
        gender: product.gender,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        images: product.images || (product.image ? [product.image] : []),
        sizes: product.sizes || [],
        sizeStock: product.sizeStock || {},
        stockQuantity: product.stockQuantity ?? 0,
        colors: product.colors || [],
        isPromotion: !!product.isPromotion,
        isHot: !!product.isHot,
        isBestSeller: !!product.isBestSeller,
        hasSizes: product.hasSizes ?? true,
        shortDescription: product.shortDescription,
        description: product.description || '',
        status: product.status || 'Đang bán',
      }),
    });
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>(`/Products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        category: product.category,
        gender: product.gender,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        images: product.images,
        sizes: product.sizes,
        sizeStock: product.sizeStock,
        stockQuantity: product.stockQuantity,
        colors: product.colors,
        isPromotion: product.isPromotion,
        isHot: product.isHot,
        isBestSeller: product.isBestSeller,
        hasSizes: product.hasSizes,
        shortDescription: product.shortDescription,
        description: product.description,
        status: product.status,
        isDeleted: product.isDeleted,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// CATEGORIES API
// ----------------------------------------------------
export const categoriesApi = {
  getAll: async (): Promise<CategoryItem[]> => {
    return apiRequest<CategoryItem[]>('/Categories');
  },

  getById: async (id: string): Promise<CategoryItem> => {
    return apiRequest<CategoryItem>(`/Categories/${id}`);
  },

  create: async (cat: Partial<CategoryItem>): Promise<CategoryItem> => {
    return apiRequest<CategoryItem>('/Categories', {
      method: 'POST',
      body: JSON.stringify({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-'),
        group: cat.group,
        description: cat.description,
        image: cat.image,
      }),
    });
  },

  update: async (id: string, cat: Partial<CategoryItem>): Promise<CategoryItem> => {
    return apiRequest<CategoryItem>(`/Categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: cat.name,
        slug: cat.slug,
        group: cat.group,
        description: cat.description,
        image: cat.image,
        status: cat.status,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// BRANDS API
// ----------------------------------------------------
export const brandsApi = {
  getAll: async (): Promise<BrandItem[]> => {
    return apiRequest<BrandItem[]>('/Brands');
  },

  getById: async (id: string): Promise<BrandItem> => {
    return apiRequest<BrandItem>(`/Brands/${id}`);
  },

  create: async (brand: Partial<BrandItem>): Promise<BrandItem> => {
    return apiRequest<BrandItem>('/Brands', {
      method: 'POST',
      body: JSON.stringify({
        name: brand.name,
        slug: brand.slug || brand.name?.toLowerCase().replace(/\s+/g, '-'),
        logo: brand.logo,
        country: brand.country,
        description: brand.description,
        tagline: brand.tagline,
        color: brand.color,
      }),
    });
  },

  update: async (id: string, brand: Partial<BrandItem>): Promise<BrandItem> => {
    return apiRequest<BrandItem>(`/Brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        country: brand.country,
        description: brand.description,
        tagline: brand.tagline,
        color: brand.color,
        status: brand.status,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Brands/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// ORDERS API
// ----------------------------------------------------
export const mapOrderFromBackend = (raw: any): Order => {
  if (!raw) return raw;

  // Map orderDetails or items to OrderItem[]
  const rawItems = Array.isArray(raw.items) && raw.items.length > 0
    ? raw.items
    : Array.isArray(raw.orderDetails)
    ? raw.orderDetails
    : Array.isArray(raw.OrderDetails)
    ? raw.OrderDetails
    : [];

  const items: OrderItem[] = rawItems.map((d: any) => ({
    productId: d.productId || d.ProductId || '',
    productName: d.productName || d.ProductName || 'Sản phẩm',
    image: d.image || d.Image || '',
    brand: d.brand || d.Brand || 'Khác',
    size: Number(d.size ?? d.Size) || 40,
    colorName: d.colorName || d.ColorName || 'Tiêu chuẩn',
    colorHex: d.colorHex || d.ColorHex || '#000000',
    quantity: Number(d.quantity ?? d.Quantity) || 1,
    unitPrice: Number(d.unitPrice ?? d.UnitPrice) || 0,
    totalPrice:
      Number(d.totalPrice ?? d.TotalPrice) ||
      (Number(d.unitPrice ?? d.UnitPrice) || 0) * (Number(d.quantity ?? d.Quantity) || 1),
  }));

  let trackingTimeline = Array.isArray(raw.trackingTimeline) ? raw.trackingTimeline : [];
  if (trackingTimeline.length === 0 && (raw.trackingTimelineJson || raw.TrackingTimelineJson)) {
    try {
      const parsedTimeline = JSON.parse(raw.trackingTimelineJson || raw.TrackingTimelineJson || '[]');
      if (Array.isArray(parsedTimeline)) {
        trackingTimeline = parsedTimeline;
      }
    } catch {
      trackingTimeline = [];
    }
  }

  return {
    ...raw,
    id: raw.id || raw.Id || '',
    orderCode: raw.orderCode || raw.OrderCode || `ORD-${Date.now()}`,
    userId: raw.userId || raw.UserId || undefined,
    recipientName: raw.recipientName || raw.RecipientName || '',
    phone: raw.phone || raw.Phone || '',
    email: raw.email || raw.Email || '',
    province: raw.province || raw.Province || '',
    district: raw.district || raw.District || '',
    ward: raw.ward || raw.Ward || '',
    provinceId: raw.provinceId || raw.ProvinceId || '',
    provinceName: raw.provinceName || raw.ProvinceName || '',
    wardId: raw.wardId || raw.WardId || '',
    wardName: raw.wardName || raw.WardName || '',
    addressDetail: raw.addressDetail || raw.AddressDetail || '',
    fullAddress: raw.fullAddress || raw.FullAddress || '',
    items,
    subtotal: Number(raw.subtotal ?? raw.Subtotal) || 0,
    discount: Number(raw.discount ?? raw.Discount) || 0,
    discountCode: raw.discountCode || raw.DiscountCode || '',
    promotionId: raw.promotionId || raw.PromotionId || '',
    shippingFee: Number(raw.shippingFee ?? raw.ShippingFee) || 0,
    shippingMethod: raw.shippingMethod || raw.ShippingMethod || 'standard',
    paymentMethod: raw.paymentMethod || raw.PaymentMethod || 'cod',
    grandTotal: Number(raw.grandTotal ?? raw.GrandTotal) || 0,
    note: raw.note || raw.Note || '',
    orderDate: raw.orderDate || raw.OrderDate || new Date().toISOString(),
    status: raw.status || raw.Status || 'Chờ xử lý',
    cancelReason: raw.cancelReason || raw.CancelReason,
    cancelDate: raw.cancelDate || raw.CancelDate,
    paymentStatus: raw.paymentStatus || raw.PaymentStatus || 'Chưa thanh toán',
    transactionId: raw.transactionId || raw.TransactionId,
    trackingTimeline,
  };
};

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const raw = await apiRequest<any[]>('/Orders');
    return Array.isArray(raw) ? raw.map(mapOrderFromBackend) : [];
  },

  getById: async (id: string): Promise<Order> => {
    const raw = await apiRequest<any>(`/Orders/${id}`);
    return mapOrderFromBackend(raw);
  },

  create: async (order: Partial<Order>): Promise<Order> => {
    const raw = await apiRequest<any>('/Orders', {
      method: 'POST',
      body: JSON.stringify({
        userId: order.userId,
        recipientName: order.recipientName,
        phone: order.phone,
        email: order.email,
        province: order.province,
        district: order.district,
        ward: order.ward,
        provinceId: order.provinceId,
        provinceName: order.provinceName,
        wardId: order.wardId,
        wardName: order.wardName,
        addressDetail: order.addressDetail,
        fullAddress: order.fullAddress,
        items: (order.items || []).map((item) => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          brand: item.brand,
          size: item.size,
          colorName: item.colorName,
          colorHex: item.colorHex,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        discountCode: order.discountCode,
        promotionId: order.promotionId,
        shippingFee: order.shippingFee,
        shippingMethod: order.shippingMethod || 'standard',
        paymentMethod: order.paymentMethod || 'cod',
        note: order.note,
      }),
    });
    return mapOrderFromBackend(raw);
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const raw = await apiRequest<any>(`/Orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return mapOrderFromBackend(raw);
  },
};

// ----------------------------------------------------
// PROMOTIONS API
// ----------------------------------------------------
export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    return apiRequest<Promotion[]>('/Promotions');
  },

  getByCode: async (code: string): Promise<Promotion> => {
    return apiRequest<Promotion>(`/Promotions/code/${code}`);
  },

  create: async (promo: Partial<Promotion>): Promise<Promotion> => {
    return apiRequest<Promotion>('/Promotions', {
      method: 'POST',
      body: JSON.stringify({
        code: promo.code,
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType || 'percent',
        discountValue: promo.discountValue || 0,
        minOrderValue: promo.minOrderValue,
        maxDiscountAmount: promo.maxDiscountAmount,
        maxUsageLimit: promo.maxUsageLimit,
        perUserLimit: promo.perUserLimit,
        startDate: promo.startDate ? new Date(promo.startDate).toISOString() : new Date().toISOString(),
        endDate: promo.endDate ? new Date(promo.endDate).toISOString() : new Date().toISOString(),
        status: promo.status || 'Đang hoạt động',
        scope: promo.scope || 'all',
        targetCategories: promo.targetCategories || [],
        targetBrands: promo.targetBrands || [],
        targetProductIds: promo.targetProductIds || [],
      }),
    });
  },

  update: async (id: string, promo: Partial<Promotion>): Promise<Promotion> => {
    return apiRequest<Promotion>(`/Promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        minOrderValue: promo.minOrderValue,
        maxDiscountAmount: promo.maxDiscountAmount,
        maxUsageLimit: promo.maxUsageLimit,
        perUserLimit: promo.perUserLimit,
        startDate: promo.startDate ? new Date(promo.startDate).toISOString() : undefined,
        endDate: promo.endDate ? new Date(promo.endDate).toISOString() : undefined,
        status: promo.status,
        scope: promo.scope,
        targetCategories: promo.targetCategories,
        targetBrands: promo.targetBrands,
        targetProductIds: promo.targetProductIds,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Promotions/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// BANNERS API
// ----------------------------------------------------
export const bannersApi = {
  getAll: async (onlyActive = false): Promise<BannerItem[]> => {
    return apiRequest<BannerItem[]>(`/Banners?onlyActive=${onlyActive}`);
  },

  create: async (banner: Partial<BannerItem>): Promise<BannerItem> => {
    return apiRequest<BannerItem>('/Banners', {
      method: 'POST',
      body: JSON.stringify({
        name: banner.name,
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        buttonText: banner.buttonText,
        link: banner.link,
        position: banner.position || 'home_hero',
        order: banner.order ?? 1,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString() : null,
        endDate: banner.endDate ? new Date(banner.endDate).toISOString() : null,
        status: banner.status || 'Đang hoạt động',
        badge: banner.badge,
        accentColor: banner.accentColor,
      }),
    });
  },

  update: async (id: string, banner: Partial<BannerItem>): Promise<BannerItem> => {
    return apiRequest<BannerItem>(`/Banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: banner.name,
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        buttonText: banner.buttonText,
        link: banner.link,
        position: banner.position,
        order: banner.order,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString() : null,
        endDate: banner.endDate ? new Date(banner.endDate).toISOString() : null,
        status: banner.status,
        badge: banner.badge,
        accentColor: banner.accentColor,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Banners/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// REVIEWS API
// ----------------------------------------------------
export const reviewsApi = {
  getAll: async (productId?: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`/Reviews${productId ? `?productId=${productId}` : ''}`);
  },

  create: async (review: Partial<Review>): Promise<Review> => {
    return apiRequest<Review>('/Reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: review.productId,
        productName: review.productName,
        productSku: review.productSku,
        productImage: review.productImage,
        orderId: review.orderId,
        userId: review.userId,
        name: review.name,
        email: review.email,
        avatar: review.avatar,
        rating: review.rating,
        comment: review.comment,
        images: review.images || [],
        video: review.video,
        purchasedSize: review.purchasedSize,
        purchasedColor: review.purchasedColor,
        isVerifiedBuyer: review.isVerifiedBuyer ?? true,
      }),
    });
  },

  updateStatus: async (id: string, status: string): Promise<Review> => {
    return apiRequest<Review>(`/Reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// USERS API
// ----------------------------------------------------
export const usersApi = {
  getAll: async (): Promise<UserProfile[]> => {
    return apiRequest<UserProfile[]>('/Users');
  },

  getById: async (id: string): Promise<UserProfile> => {
    return apiRequest<UserProfile>(`/Users/${id}`);
  },

  update: async (id: string, user: Partial<UserProfile>): Promise<UserProfile> => {
    return apiRequest<UserProfile>(`/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: user.name,
        phone: user.phone,
        birthday: user.birthday,
        gender: user.gender,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        status: user.status,
      }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// CUSTOMERS API
// ----------------------------------------------------
export const customersApi = {
  getAll: async (): Promise<any[]> => {
    return apiRequest<any[]>('/Customers');
  },

  create: async (customer: { name: string; email: string; phone?: string; address?: string }): Promise<any> => {
    return apiRequest<any>('/Customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  update: async (id: string, customer: { name: string; email: string; phone?: string; address?: string; status?: string }): Promise<any> => {
    return apiRequest<any>(`/Customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/Customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// SETTINGS API
// ----------------------------------------------------
export const settingsApi = {
  get: async (key = 'SystemSettings'): Promise<SystemSettings | null> => {
    try {
      const res = await apiRequest<{ id: string; key: string; value: string }>(`/Settings?key=${key}`);
      if (res && res.value) {
        return JSON.parse(res.value) as SystemSettings;
      }
      return null;
    } catch {
      return null;
    }
  },

  update: async (settings: SystemSettings, key = 'SystemSettings'): Promise<any> => {
    return apiRequest('/Settings', {
      method: 'POST',
      body: JSON.stringify({
        key,
        value: JSON.stringify(settings),
      }),
    });
  },
};

