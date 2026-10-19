import { useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

export const TRANSLATIONS = {
  vi: {
    // Header
    home: 'Trang chủ',
    products: 'Sản phẩm',
    brands: 'Thương hiệu',
    promotions: 'Khuyến mãi',
    blog: 'Tin tức',
    contact: 'Liên hệ',
    searchPlaceholder: 'Tìm giày...',
    searchSuggestions: 'Gợi ý sản phẩm',
    viewAllResults: 'Xem tất cả kết quả',
    favorites: 'Sản phẩm yêu thích',
    viewAllFavorites: 'XEM TẤT CẢ TRANG YÊU THÍCH',
    noFavorites: 'Chưa có sản phẩm yêu thích nào.',
    cart: 'Giỏ hàng',
    login: 'Đăng nhập',
    loginRegister: 'Đăng nhập / Đăng ký',
    adminDashboard: 'Trang quản trị (/admin)',
    adminLogout: 'Đăng xuất Admin',
    profile: 'Hồ sơ cá nhân',
    myOrders: 'Đơn hàng của tôi',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    logoutSuccess: 'Đã đăng xuất thành công',
    aboutContact: 'Về chúng tôi & Liên hệ',
    all: 'Tất cả',

    // Hero & Promo
    heroTitle: 'MOVE YOUR WAY',
    heroSubtitle: 'Find your style. Own your move.',
    shopNow: 'MUA NGAY',
    explore: 'Khám phá',
    sneaker: 'SNEAKER',
    sportShoes: 'GIÀY THỂ THAO',
    runningShoes: 'GIÀY CHẠY BỘ',
    promoTitle: 'KHUYẾN MÃI',

    // Featured Brands
    officialPartners: 'Đối tác chính hãng',
    featuredBrands: 'THƯƠNG HIỆU NỔI BẬT',
    viewAll: 'Xem tất cả',
    authentic100: 'Chính hãng 100%',

    // Top Categories
    exploreByCategory: 'Khám phá theo danh mục',
    topCategories: 'TOP DANH MỤC NỔI BẬT',
    catAll: 'Tất cả',
    catSneaker: 'Sneaker',
    catSport: 'Giày thể thao',
    catRunning: 'Giày chạy bộ',
    catLifestyle: 'Lifestyle',

    // Featured Products
    topPicks: 'Lựa chọn hàng đầu',
    featuredProducts: 'SẢN PHẨM NỔI BẬT',
    featuredProductsSub: 'Top 4 mẫu giày sneaker và thể thao được săn đón nhiều nhất tại K-NICKS.',
    viewAllProducts: 'XEM TẤT CẢ SẢN PHẨM',

    // News
    newsBadge: 'Bản tin K-NICKS',
    newsTitle: 'TIN TỨC CHÍNH & XU HƯỚNG',
    newsSubtitle: 'Cập nhật xu hướng sneaker 2026, cẩm nang phối đồ thời thượng và mẹo chăm sóc giày chuẩn chuyên gia.',
    viewAllArticles: 'XEM TẤT CẢ BÀI VIẾT',
    readMore: 'Đọc tiếp',

    // Benefits
    benefit1Title: 'CHÍNH HÃNG 100%',
    benefit1Desc: 'Cam kết 100% sản phẩm chính hãng từ Nike, Adidas, Puma, Converse.',
    benefit2Title: 'ĐỔI TRẢ 30 NGÀY',
    benefit2Desc: 'Hỗ trợ đổi size và mẫu mã dễ dàng tận nơi nhanh chóng.',
    benefit3Title: 'GIAO HÀNG HỎA TỐC',
    benefit3Desc: 'Giao nhanh toàn quốc, đồng kiểm tra hàng trước khi thanh toán.',
    benefit4Title: 'THANH TOÁN AN TOÀN',
    benefit4Desc: 'Bảo mật tuyệt đối, linh hoạt COD, VNPAY, MOMO & chuyển khoản.',

    // Newsletter
    newsletterTitle: 'ĐĂNG KÝ NHẬN BẢN TIN',
    newsletterSub: 'Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên cùng những tin tức độc quyền về các đợt phát hành sneaker giới hạn.',
    newsletterPlaceholder: 'Nhập địa chỉ email của bạn...',
    newsletterBtn: 'Đăng ký',
    newsletterSubscribedMsg: 'Bạn đã đăng ký nhận bản tin thành công.',

    // Product Card & Quick View
    add: 'Thêm',
    soldOut: 'Hết hàng',
    discount: 'GIẢM',
    newBadge: 'MỚI',
    addToWishlist: 'Thêm vào yêu thích',
    quickView: 'Xem nhanh',
    reviewsCount: 'đánh giá',
    selectSize: 'Chọn Kích Cỡ (Size EU)',
    sizeGuide: 'Bảng quy đổi size',
    selectColor: 'Chọn Màu Sắc',
    quantity: 'Số Lượng',
    addToCartModal: 'Thêm Vào Giỏ Hàng',
    addedToCartSuccess: 'Đã thêm vào giỏ hàng',
    authenticGuarantee: '100% Chính Hãng',
    returnGuarantee: 'Đổi trả miễn phí trong 30 ngày',
    viewProductDetail: 'Xem trang chi tiết & tất cả đánh giá',
    reviewsFromUsers: 'đánh giá từ người dùng',

    // Footer
    navColTitle: 'Điều hướng',
    policyColTitle: 'Chính sách & Hỗ trợ',
    contactColTitle: 'Thông tin liên hệ',
    policyWarranty: 'Chính sách bảo hành chính hãng',
    policyReturn: 'Chính sách đổi trả trong 30 ngày',
    policyShipping: 'Chính sách vận chuyển & giao hàng',
    policyTerms: 'Điều khoản dịch vụ & mua sắm',
    policyPrivacy: 'Chính sách bảo mật thông tin',
    hotline: 'Hotline',
    email: 'Email',
    workingHours: 'Giờ làm việc',
    backToTop: 'Lên đầu trang',
    allRightsReserved: 'Bảo lưu mọi quyền.',
  },
  en: {
    // Header
    home: 'Home',
    products: 'Products',
    brands: 'Brands',
    promotions: 'Promotions',
    blog: 'News',
    contact: 'Contact',
    searchPlaceholder: 'Search shoes...',
    searchSuggestions: 'Product suggestions',
    viewAllResults: 'View all results',
    favorites: 'Favorites',
    viewAllFavorites: 'VIEW ALL FAVORITES',
    noFavorites: 'No favorite products yet.',
    cart: 'Cart',
    login: 'Login',
    loginRegister: 'Login / Register',
    adminDashboard: 'Admin Dashboard (/admin)',
    adminLogout: 'Admin Logout',
    profile: 'My Profile',
    myOrders: 'My Orders',
    changePassword: 'Change Password',
    logout: 'Logout',
    logoutSuccess: 'Logged out successfully',
    aboutContact: 'About Us & Contact',
    all: 'All',

    // Hero & Promo
    heroTitle: 'MOVE YOUR WAY',
    heroSubtitle: 'Find your style. Own your move.',
    shopNow: 'SHOP NOW',
    explore: 'Explore',
    sneaker: 'SNEAKERS',
    sportShoes: 'SPORTS SHOES',
    runningShoes: 'RUNNING SHOES',
    promoTitle: 'PROMOTIONS',

    // Featured Brands
    officialPartners: 'Official Partners',
    featuredBrands: 'FEATURED BRANDS',
    viewAll: 'View All',
    authentic100: '100% Authentic',

    // Top Categories
    exploreByCategory: 'Explore by Category',
    topCategories: 'TOP CATEGORIES',
    catAll: 'All',
    catSneaker: 'Sneakers',
    catSport: 'Sports Shoes',
    catRunning: 'Running Shoes',
    catLifestyle: 'Lifestyle',

    // Featured Products
    topPicks: 'Top Picks',
    featuredProducts: 'FEATURED PRODUCTS',
    featuredProductsSub: 'Top 4 most sought-after sneakers and sports shoes at K-NICKS.',
    viewAllProducts: 'VIEW ALL PRODUCTS',

    // News
    newsBadge: 'K-NICKS Bulletin',
    newsTitle: 'LATEST NEWS & TRENDS',
    newsSubtitle: 'Stay updated with 2026 sneaker trends, expert styling guides, and professional shoe care tips.',
    viewAllArticles: 'VIEW ALL ARTICLES',
    readMore: 'Read More',

    // Benefits
    benefit1Title: '100% AUTHENTIC',
    benefit1Desc: 'Committed to 100% genuine products from Nike, Adidas, Puma, Converse.',
    benefit2Title: '30-DAY RETURNS',
    benefit2Desc: 'Easy size and model exchange at your doorstep with fast support.',
    benefit3Title: 'EXPRESS DELIVERY',
    benefit3Desc: 'Fast nationwide shipping, check your package upon arrival before payment.',
    benefit4Title: 'SECURE PAYMENT',
    benefit4Desc: 'Absolute security, flexible COD, VNPAY, MOMO & bank transfer.',

    // Newsletter
    newsletterTitle: 'SUBSCRIBE TO NEWSLETTER',
    newsletterSub: 'Get an instant 10% discount voucher for your first order and exclusive updates on limited sneaker drops.',
    newsletterPlaceholder: 'Enter your email address...',
    newsletterBtn: 'Subscribe',
    newsletterSubscribedMsg: 'You have subscribed to the newsletter successfully.',

    // Product Card & Quick View
    add: 'Add',
    soldOut: 'Sold Out',
    discount: 'OFF',
    newBadge: 'NEW',
    addToWishlist: 'Add to wishlist',
    quickView: 'Quick view',
    reviewsCount: 'reviews',
    selectSize: 'Select Size (EU Size)',
    sizeGuide: 'Size Chart',
    selectColor: 'Select Color',
    quantity: 'Quantity',
    addToCartModal: 'Add to Cart',
    addedToCartSuccess: 'Added to cart successfully',
    authenticGuarantee: '100% Authentic',
    returnGuarantee: 'Free 30-day returns',
    viewProductDetail: 'View product details & all reviews',
    reviewsFromUsers: 'customer reviews',

    // Footer
    navColTitle: 'Navigation',
    policyColTitle: 'Policies & Support',
    contactColTitle: 'Contact Info',
    policyWarranty: 'Authentic Warranty Policy',
    policyReturn: '30-Day Return & Exchange Policy',
    policyShipping: 'Shipping & Delivery Policy',
    policyTerms: 'Terms of Service & Shopping',
    policyPrivacy: 'Privacy & Data Protection Policy',
    hotline: 'Hotline',
    email: 'Email',
    workingHours: 'Working Hours',
    backToTop: 'Back to Top',
    allRightsReserved: 'All rights reserved.',
  }
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('solestyle_language');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {}
    return 'vi';
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'solestyle_language' && (e.newValue === 'vi' || e.newValue === 'en')) {
        setLanguageState(e.newValue);
      }
    };
    const handleCustom = (e: any) => {
      if (e.detail === 'vi' || e.detail === 'en') {
        setLanguageState(e.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('languageChanged', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('languageChanged', handleCustom);
    };
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('solestyle_language', newLang);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }));
  };

  const t = TRANSLATIONS[language];

  return { language, setLanguage, t };
}
