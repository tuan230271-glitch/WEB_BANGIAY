import { Product } from '../types';

/**
 * Calculates total available stock for a product:
 * 1. Checks explicit `stockQuantity` (respecting 0 as out of stock).
 * 2. Checks `sizeStock` object sum.
 * 3. Falls back to sizes array count * 8 only if stockQuantity is undefined.
 * 4. Otherwise returns 0.
 */
export function getProductTotalStock(product?: Product | null): number {
  if (!product) return 0;

  if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
    const num = Number(product.stockQuantity);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  if (product.sizeStock && Object.keys(product.sizeStock).length > 0) {
    const sum = Object.values(product.sizeStock).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    return Math.max(0, sum);
  }

  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    return product.sizes.length * 8;
  }

  return 0;
}

/**
 * Determine stock status label according to rule:
 * - Tồn kho > 0: 'ĐANG BÁN'
 * - Tồn kho = 0: 'HẾT HÀNG'
 */
export function getProductStockStatus(product?: Product | null): {
  status: 'ĐANG BÁN' | 'HẾT HÀNG' | 'ẨN';
  isAvailable: boolean;
  totalStock: number;
  badgeClass: string;
} {
  const totalStock = getProductTotalStock(product);

  if (product?.isDeleted) {
    return {
      status: 'HẾT HÀNG',
      isAvailable: false,
      totalStock: 0,
      badgeClass: 'bg-rose-100 text-rose-700 border-rose-200'
    };
  }

  if (product?.status === 'Ẩn') {
    return {
      status: 'ẨN',
      isAvailable: false,
      totalStock,
      badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200'
    };
  }

  if (totalStock > 0) {
    return {
      status: 'ĐANG BÁN',
      isAvailable: true,
      totalStock,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }

  return {
    status: 'HẾT HÀNG',
    isAvailable: false,
    totalStock: 0,
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-300'
  };
}
