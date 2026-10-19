/**
 * API Configuration & Centralized Client
 * Connected to Ngrok backend: https://defensive-trimness-helper.ngrok-free.dev/api
 */

import { Product } from '../types';
import { normalizeImageUrl } from '../utils/imageHelper';

export const API_BASE_URL = "https://defensive-trimness-helper.ngrok-free.dev/api";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

/**
 * Standard fetch wrapper that automatically attaches the required ngrok header and content type.
 */
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.message || errJson?.error) {
        errorMsg = errJson.message || errJson.error;
      }
    } catch {
      // Ignore json parse error
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Concrete API Endpoints
 */
export const api = {
  // 1. Chat AI: POST ${API_BASE_URL}/ai/chat
  chatAi: async (message: string, history: Array<{ role: string; content: string }> = []) => {
    return apiFetch<{
      reply: string;
      suggestedProductIds?: string[];
      quickReplies?: string[];
      model?: string;
    }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },

  // 2. Gợi ý size: POST ${API_BASE_URL}/ai/size-recommend
  recommendSize: async (payload: {
    brand: string;
    productName: string;
    normalShoeSize: number;
    footShape: string;
    activityType: string;
    footLengthCm?: number;
  }) => {
    return apiFetch<{
      recommendedSize: number;
      baseSize?: number;
      delta?: number;
      confidence?: string;
      fitSummary?: string;
      expertAdvice?: string;
    }>("/ai/size-recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // 3. Lấy danh sách sản phẩm: GET ${API_BASE_URL}/products hoặc /api/products
  getProducts: async () => {
    return fetchProductsFromApi();
  },

  // 4. Đăng nhập: POST ${API_BASE_URL}/auth/login
  login: async (credentials: {
    email?: string;
    username?: string;
    password: string;
  }) => {
    return apiFetch<{
      token?: string;
      user?: {
        id?: string;
        name?: string;
        fullName?: string;
        email?: string;
        role?: "user" | "admin";
        phone?: string;
        avatar?: string;
      };
      name?: string;
      fullName?: string;
      email?: string;
      role?: "user" | "admin";
      phone?: string;
      message?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

/**
 * Normalizes raw product data from API:
 * - Ensures correct types and required fields
 * - Accurately normalizes stockQuantity
 * - Cleans up Base64 and relative image paths
 */
export function normalizeProductFromApi(item: any): Product {
  // Extract stock quantity properly
  const rawStock = item.stockQuantity ?? item.stock ?? item.quantity ?? item.inventory ?? item.stock_quantity;
  const stockQuantity = rawStock !== undefined && rawStock !== null ? Math.max(0, Number(rawStock) || 0) : undefined;

  const mainImage = normalizeImageUrl(item.image || (Array.isArray(item.images) ? item.images[0] : ''));
  const galleryImages: string[] = Array.isArray(item.images) && item.images.length > 0
    ? item.images.map((img: string) => normalizeImageUrl(img))
    : [mainImage];

  const hasSizes = item.hasSizes !== undefined
    ? Boolean(item.hasSizes)
    : (Array.isArray(item.sizes) ? item.sizes.length > 0 : true);

  const sizes = hasSizes
    ? (Array.isArray(item.sizes) && item.sizes.length > 0
        ? item.sizes.map(Number)
        : (item.sizeStock ? Object.keys(item.sizeStock).map(Number) : [39, 40, 41, 42, 43]))
    : [];

  return {
    id: String(item.id || item._id || `prod-${Date.now()}`),
    sku: item.sku || undefined,
    name: String(item.name || 'Sản phẩm K-NICKS'),
    brand: item.brand || 'Khác',
    category: item.category || 'Sneaker',
    gender: item.gender || 'Unisex',
    price: Number(item.price) || 0,
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    image: mainImage,
    images: galleryImages,
    rating: typeof item.rating === 'number' ? item.rating : 4.8,
    reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : 12,
    isNew: !!item.isNew,
    isBestSeller: !!item.isBestSeller,
    isPromotion: !!item.isPromotion,
    isHot: !!item.isHot,
    hasSizes: hasSizes,
    sizes: sizes,
    sizeStock: item.sizeStock && typeof item.sizeStock === 'object' ? item.sizeStock : undefined,
    stockQuantity: stockQuantity,
    colors: Array.isArray(item.colors) && item.colors.length > 0
      ? item.colors
      : [{ name: 'Default', hex: '#111111' }],
    shortDescription: item.shortDescription || undefined,
    description: item.description || '',
    status: item.status || (stockQuantity === 0 ? 'Hết hàng' : 'Đang bán'),
    createdAt: item.createdAt || undefined,
    updatedAt: item.updatedAt || undefined,
  };
}

/**
 * Fetch products from backend with dual fallback:
 * 1. Checks GET /api/products
 * 2. Checks GET ${API_BASE_URL}/products
 * 3. Normalizes images (Base64 & paths) and stock count
 */
export async function fetchProductsFromApi(): Promise<Product[]> {
  const endpoints = [
    '/api/products',
    `${API_BASE_URL}/products`
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      // Ensure we received JSON and not an HTML ngrok warning or 404 page
      if (res.ok && contentType.includes('application/json')) {
        const rawData = await res.json();
        const rawList = Array.isArray(rawData)
          ? rawData
          : (rawData?.data || rawData?.products || rawData?.items);

        if (Array.isArray(rawList) && rawList.length > 0) {
          return rawList.map(normalizeProductFromApi);
        }
      }
    } catch {
      // Continue to next candidate endpoint
    }
  }

  return [];
}

