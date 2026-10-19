import { BannerItem, BannerPosition, BannerStatus } from '../types';

export function formatBannerDateTime(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('T')) {
    const [datePart, timePart] = dateStr.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart || '00:00'}`;
  }
  return dateStr;
}

export function getBannerEffectiveStatus(
  banner: BannerItem
): 'Đang hoạt động' | 'Sắp diễn ra' | 'Tạm dừng' | 'Nháp' | 'Hết hạn' {
  if (banner.status === 'Tạm dừng') return 'Tạm dừng';
  if (banner.status === 'Nháp') return 'Nháp';
  if (banner.status === 'Hết hạn') return 'Hết hạn';

  const now = new Date().getTime();

  // Check end date
  if (banner.endDate) {
    const end = new Date(banner.endDate).getTime();
    if (!isNaN(end) && end < now) {
      return 'Hết hạn';
    }
  }

  // Check start date
  if (banner.startDate) {
    const start = new Date(banner.startDate).getTime();
    if (!isNaN(start) && start > now) {
      return 'Sắp diễn ra';
    }
  }

  return 'Đang hoạt động';
}

export function isBannerActiveForDisplay(banner: BannerItem): boolean {
  if (banner.isDeleted) return false;
  return getBannerEffectiveStatus(banner) === 'Đang hoạt động';
}

export function getBannerPositionLabel(pos: BannerPosition): string {
  switch (pos) {
    case 'home_hero':
      return 'Banner trang chủ';
    case 'promo':
      return 'Banner khuyến mãi';
    case 'brand':
      return 'Banner thương hiệu';
    case 'secondary':
      return 'Banner phụ';
    default:
      return 'Khác';
  }
}

export function getBannerPositionColor(pos: BannerPosition): {
  bg: string;
  text: string;
  border: string;
} {
  switch (pos) {
    case 'home_hero':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'promo':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'brand':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'secondary':
      return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' };
    default:
      return { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' };
  }
}
