import { Promotion, CartItem, UserProfile, Order, AppliedPromoInfo } from '../types';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function formatPromotionDateTime(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('T')) {
    const [datePart, timePart] = dateStr.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart || '00:00'}`;
  }
  return dateStr;
}

export function getPromotionEffectiveStatus(promo: Promotion): 'Đang hoạt động' | 'Tạm dừng' | 'Nháp' | 'Hết hạn' | 'Sắp diễn ra' {
  if (promo.status === 'Tạm dừng') return 'Tạm dừng';
  if (promo.status === 'Nháp') return 'Nháp';
  if (promo.status === 'Hết hạn') return 'Hết hạn';

  if (promo.maxUsageLimit && promo.maxUsageLimit > 0 && promo.usedCount >= promo.maxUsageLimit) {
    return 'Hết hạn';
  }

  const now = new Date().getTime();

  if (promo.endDate) {
    const end = new Date(promo.endDate).getTime();
    if (!isNaN(end) && end < now) {
      return 'Hết hạn';
    }
  }

  if (promo.startDate) {
    const start = new Date(promo.startDate).getTime();
    if (!isNaN(start) && start > now) {
      return 'Sắp diễn ra';
    }
  }

  return 'Đang hoạt động';
}

export function formatPromotionValue(promo: {
  discountType: 'percent' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
}): string {
  if (promo.discountType === 'percent') {
    return `${promo.discountValue}%${promo.maxDiscountAmount ? ` (Tối đa ${formatPrice(promo.maxDiscountAmount)})` : ''}`;
  }
  return formatPrice(promo.discountValue);
}

export interface PromotionValidationResult {
  isValid: boolean;
  errorMessage?: string;
  successMessage?: string;
  appliedPromo?: AppliedPromoInfo;
  discountAmount: number;
  promotion?: Promotion;
}

export function validateAndCalculatePromotion({
  code,
  cartItems,
  promotions,
  user,
  orders = []
}: {
  code: string;
  cartItems: CartItem[];
  promotions: Promotion[];
  user?: UserProfile | null;
  orders?: Order[];
}): PromotionValidationResult {
  const normalizedCode = (code || '').trim().toUpperCase();

  if (!normalizedCode) {
    return {
      isValid: false,
      errorMessage: 'Vui lòng nhập mã giảm giá.',
      discountAmount: 0
    };
  }

  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Giỏ hàng của bạn đang trống.',
      discountAmount: 0
    };
  }

  // 1. Check existence
  const promo = promotions.find(
    (p) => !p.isDeleted && p.code.trim().toUpperCase() === normalizedCode
  );

  if (!promo) {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${normalizedCode}" không tồn tại hoặc đã bị xóa.`,
      discountAmount: 0
    };
  }

  // 2. Check effective status
  const effectiveStatus = getPromotionEffectiveStatus(promo);

  if (effectiveStatus === 'Tạm dừng') {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${promo.code}" hiện đang tạm dừng áp dụng.`,
      discountAmount: 0,
      promotion: promo
    };
  }

  if (effectiveStatus === 'Nháp') {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${promo.code}" chưa được kích hoạt áp dụng.`,
      discountAmount: 0,
      promotion: promo
    };
  }

  if (effectiveStatus === 'Sắp diễn ra') {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${promo.code}" chưa đến thời gian áp dụng (Bắt đầu từ ${formatPromotionDateTime(promo.startDate)}).`,
      discountAmount: 0,
      promotion: promo
    };
  }

  if (effectiveStatus === 'Hết hạn') {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${promo.code}" đã hết hạn hoặc hết lượt sử dụng.`,
      discountAmount: 0,
      promotion: promo
    };
  }

  // 3. Check overall max usage
  if (promo.maxUsageLimit && promo.maxUsageLimit > 0 && promo.usedCount >= promo.maxUsageLimit) {
    return {
      isValid: false,
      errorMessage: `Mã giảm giá "${promo.code}" đã đạt giới hạn tối đa ${promo.maxUsageLimit} lượt sử dụng.`,
      discountAmount: 0,
      promotion: promo
    };
  }

  // 4. Check Per-User Limit
  if (promo.perUserLimit && promo.perUserLimit > 0 && user) {
    const userOrders = orders.filter((o) => {
      const isUserMatch =
        (user.id && o.userId === user.id) ||
        (user.email && o.email?.toLowerCase() === user.email.toLowerCase());
      const isPromoMatch =
        o.discountCode?.toUpperCase() === promo.code.toUpperCase() ||
        o.promotionId === promo.id;
      const isNotCancelled = o.status !== 'Đã hủy';
      return isUserMatch && isPromoMatch && isNotCancelled;
    });

    if (userOrders.length >= promo.perUserLimit) {
      return {
        isValid: false,
        errorMessage: `Bạn đã sử dụng hết số lượt cho phép (${promo.perUserLimit} lần) của mã "${promo.code}".`,
        discountAmount: 0,
        promotion: promo
      };
    }
  }

  // 5. Scope check & Filter eligible items
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let eligibleItems = cartItems;
  if (promo.scope === 'category') {
    eligibleItems = cartItems.filter((item) =>
      promo.targetCategories?.some(
        (cat) => cat.toLowerCase() === (item.product.category || '').toLowerCase()
      )
    );
  } else if (promo.scope === 'brand') {
    eligibleItems = cartItems.filter((item) =>
      promo.targetBrands?.some(
        (b) => b.toLowerCase() === (item.product.brand || '').toLowerCase()
      )
    );
  } else if (promo.scope === 'product') {
    eligibleItems = cartItems.filter((item) =>
      promo.targetProductIds?.includes(item.product.id)
    );
  }

  if (eligibleItems.length === 0) {
    let scopeDesc = 'các sản phẩm quy định';
    if (promo.scope === 'category') scopeDesc = `danh mục: ${promo.targetCategories?.join(', ')}`;
    else if (promo.scope === 'brand') scopeDesc = `thương hiệu: ${promo.targetBrands?.join(', ')}`;
    else if (promo.scope === 'product') scopeDesc = 'sản phẩm áp dụng cụ thể';

    return {
      isValid: false,
      errorMessage: `Giỏ hàng không có sản phẩm nào thuộc phạm vi áp dụng của mã này (${scopeDesc}).`,
      discountAmount: 0,
      promotion: promo
    };
  }

  // 6. Minimum Order Value Check (based on cart subtotal)
  if (promo.minOrderValue && cartSubtotal < promo.minOrderValue) {
    return {
      isValid: false,
      errorMessage: `Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã (Tối thiểu: ${formatPrice(promo.minOrderValue)}, hiện tại: ${formatPrice(cartSubtotal)}).`,
      discountAmount: 0,
      promotion: promo
    };
  }

  // 7. Calculate Discount
  const eligibleSubtotal = eligibleItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let calculatedDiscount = 0;

  if (promo.discountType === 'percent') {
    const rawDiscount = Math.round((eligibleSubtotal * promo.discountValue) / 100);
    if (promo.maxDiscountAmount && promo.maxDiscountAmount > 0) {
      calculatedDiscount = Math.min(rawDiscount, promo.maxDiscountAmount);
    } else {
      calculatedDiscount = rawDiscount;
    }
  } else {
    // Fixed amount
    calculatedDiscount = Math.min(eligibleSubtotal, promo.discountValue);
  }

  // Never exceed total cart subtotal
  calculatedDiscount = Math.min(calculatedDiscount, cartSubtotal);

  const appliedPromo: AppliedPromoInfo = {
    id: promo.id,
    code: promo.code,
    name: promo.name,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount: calculatedDiscount,
    minOrderValue: promo.minOrderValue,
    maxDiscountAmount: promo.maxDiscountAmount,
    scope: promo.scope
  };

  return {
    isValid: true,
    successMessage: `Áp dụng mã giảm giá "${promo.code}" (${promo.name}) thành công! Bạn được giảm ${formatPrice(calculatedDiscount)}.`,
    discountAmount: calculatedDiscount,
    appliedPromo,
    promotion: promo
  };
}
