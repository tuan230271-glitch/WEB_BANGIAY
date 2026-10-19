export type BrandName = 'Nike' | 'Adidas' | 'Puma' | 'Converse' | string;

export type CategoryName = 'Sneaker' | 'Running' | 'Football' | 'Lifestyle' | 'Training' | string;

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country?: string;
  description?: string;
  tagline?: string;
  color?: string;
  subcategories?: string[];
  status: 'Đang hoạt động' | 'Ẩn';
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type GenderType = 'Nam' | 'Nữ' | 'Trẻ em' | 'Unisex';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  group?: 'shoes' | 'accessories' | 'other';
  description?: string;
  image?: string;
  imageFileName?: string;
  imageFileSize?: string;
  status: 'Đang hoạt động' | 'Ẩn';
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  images?: string[];
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  brand?: BrandName;
  category: CategoryName;
  gender?: GenderType;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isPromotion?: boolean;
  isHot?: boolean;
  hasSizes?: boolean;
  sizes: number[];
  sizeStock?: Record<number, number>;
  stockQuantity?: number;
  colors: ProductColor[];
  shortDescription?: string;
  description: string;
  status?: 'Đang bán' | 'Ẩn' | 'Ngừng kinh doanh' | 'Đã xóa';
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  orderId?: string;
  userId?: string;
  email?: string;
  name: string;
  avatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  images?: string[]; // array of base64/URL photos
  video?: string; // base64/URL video
  isVerifiedBuyer?: boolean; // true if purchased and order delivered
  purchasedSize?: number;
  purchasedColor?: string;
  helpfulCount?: number;
  helpfulUserIds?: string[];
  status?: 'Chờ duyệt' | 'Đã hiển thị' | 'Đã ẩn';
  isHidden?: boolean;
  isDeleted?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize: number;
  selectedColor: ProductColor;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  brand: string;
  size: number;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderCode: string;
  userId?: string;
  recipientName: string;
  phone: string;
  email?: string;
  province: string;
  district?: string;
  ward: string;
  provinceId?: string;
  provinceName?: string;
  wardId?: string;
  wardName?: string;
  addressDetail: string;
  fullAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  promotionId?: string;
  shippingFee: number;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'banking' | 'momo' | 'vnpay' | 'zalopay';
  grandTotal: number;
  note?: string;
  orderDate: string;
  status: 'Chờ xử lý' | 'Đã xác nhận' | 'Đang chuẩn bị hàng' | 'Đang giao' | 'Đã giao' | 'Đã hủy' | 'Chờ xác nhận' | 'Đã giao hàng';
  cancelReason?: string;
  cancelDate?: string;
  paymentStatus?: 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hoàn tiền';
  transactionId?: string;
  trackingTimeline?: { title: string; time: string; completed: boolean; current?: boolean }[];
  isRestocked?: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderCode: string;
  recipientName: string;
  phone: string;
  paymentMethod: 'cod' | 'banking' | 'momo' | 'vnpay' | 'zalopay';
  amount: number;
  transactionId?: string;
  paymentDate?: string;
  paymentStatus: 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hoàn tiền';
  note?: string;
  bankRefNo?: string;
  refundDate?: string;
  refundReason?: string;
}

export interface SavedAddress {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: 'nam' | 'nu' | 'khac';
  role?: 'user' | 'admin';
  avatar?: string;
  address?: string;
  addresses?: SavedAddress[];
  status?: 'Đang hoạt động' | 'Bị khóa';
  createdAt?: string;
  isDeleted?: boolean;
}

export type DiscountType = 'percent' | 'fixed';
export type PromotionScope = 'all' | 'category' | 'brand' | 'product';
export type PromotionStatus = 'Đang hoạt động' | 'Tạm dừng' | 'Nháp' | 'Hết hạn' | 'Sắp diễn ra';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number; // % (1-100) or amount in VND
  minOrderValue?: number; // VND
  maxDiscountAmount?: number; // max discount in VND for percent type
  maxUsageLimit?: number; // 0 or undefined = unlimited
  usedCount: number; // count of completed orders using this promo
  perUserLimit?: number; // 0 = unlimited, 1, 2, 3...
  startDate: string; // ISO or YYYY-MM-DDTHH:mm
  endDate: string; // ISO or YYYY-MM-DDTHH:mm
  status: 'Đang hoạt động' | 'Tạm dừng' | 'Nháp' | 'Hết hạn';
  scope: PromotionScope; // 'all' | 'category' | 'brand' | 'product'
  targetCategories?: string[];
  targetBrands?: string[];
  targetProductIds?: string[];
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface AppliedPromoInfo {
  id?: string;
  code: string;
  name?: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number; // calculated VND discount
  minOrderValue?: number;
  maxDiscountAmount?: number;
  scope?: PromotionScope;
}

export type BannerPosition = 'home_hero' | 'promo' | 'brand' | 'secondary';
export type BannerStatus = 'Đang hoạt động' | 'Tạm dừng' | 'Nháp' | 'Hết hạn';

export interface BannerItem {
  id: string;
  name: string; // Tên Banner *
  image: string; // Ảnh Banner * (URL or base64 data)
  title?: string; // Tiêu đề
  subtitle?: string; // Phụ đề / Slogan
  description?: string; // Mô tả
  buttonText?: string; // Text nút (e.g. 'MUA NGAY')
  link?: string; // Link khi click
  position: BannerPosition; // 'home_hero' | 'promo' | 'brand' | 'secondary'
  order: number; // Thứ tự (1, 2, 3...)
  startDate?: string; // Ngày bắt đầu (ISO or YYYY-MM-DDTHH:mm)
  endDate?: string; // Ngày kết thúc (ISO or YYYY-MM-DDTHH:mm)
  status: BannerStatus; // 'Đang hoạt động' | 'Tạm dừng' | 'Nháp' | 'Hết hạn'
  badge?: string; // e.g. 'NEW ARRIVAL', 'HOT DEAL'
  accentColor?: string; // e.g. '#FF5400'
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface BankAccountInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch?: string;
  transferSyntax?: string;
  qrTemplate?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
}

export interface ShippingConfig {
  defaultFee: number;
  freeShippingThreshold: number;
  expressFee: number;
  estimatedDaysStandard: string;
  estimatedDaysExpress: string;
  enableExpress: boolean;
}

export interface PaymentMethodsConfig {
  enableCod: boolean;
  enableBanking: boolean;
  enableMomo: boolean;
  enableVnpay: boolean;
  enableZalopay: boolean;
  bankInfo: BankAccountInfo;
}

export interface NotificationSettings {
  notifyNewOrder: boolean;
  notifyOrderConfirmed: boolean;
  notifyOrderShipping: boolean;
  notifyOrderDelivered: boolean;
  notifyPromotions: boolean;
  adminEmailNotification?: string;
}

export interface SeoSettings {
  websiteTitle: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage?: string;
  favicon?: string;
}

export interface PoliciesConfig {
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
  warrantyPolicy?: string;
}

export interface SystemSettings {
  storeName: string;
  storeTagline?: string;
  logo: string;
  favicon: string;
  adminLogo?: string;
  adminName?: string;
  adminSubtitle?: string;
  email: string;
  hotline: string;
  address: string;
  googleMapsUrl?: string;
  workingHours: string;
  storeDescription: string;
  socialLinks: SocialLinks;
  shipping: ShippingConfig;
  payment: PaymentMethodsConfig;
  notifications: NotificationSettings;
  seo: SeoSettings;
  policies: PoliciesConfig;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  content: string;
  createdAt: string;
  status?: 'Chưa xử lý' | 'Đã phản hồi' | 'Đã giải quyết';
  replyNote?: string;
}

export type BlogCategory = 'all' | 'styling' | 'shoe_care' | 'cleaning' | 'news';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'styling' | 'shoe_care' | 'cleaning' | 'news';
  categoryLabel: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  relatedProductIds?: string[];
}



