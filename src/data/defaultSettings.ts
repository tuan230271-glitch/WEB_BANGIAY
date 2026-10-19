import { SystemSettings } from '../types';

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  storeName: 'K-NICKS',
  storeTagline: 'PREMIUM SNEAKERS & STREETWEAR',
  logo: '', // empty means fallback to stylish default 'K' badge or custom image
  favicon: '', // empty means fallback default
  adminLogo: '', // empty means fallback to default gradient badge
  adminName: 'K-NICKS',
  adminSubtitle: 'ADMIN CONTROL PANEL',
  email: 'support@knicks.vn',
  hotline: '1900 8463',
  address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  googleMapsUrl: 'https://maps.google.com/?q=123+Le+Loi+Ben+Thanh+Quan+1+Ho+Chi+Minh',
  workingHours: '08:30 - 21:30 (Thứ 2 - Chủ Nhật, kể cả ngày lễ)',
  storeDescription: 'Nơi hội tụ các dòng sản phẩm giày sneaker và thể thao chính hãng cao cấp từ những thương hiệu hàng đầu thế giới: Nike, Adidas, Puma, Converse. Định hình phong cách và hiệu suất cho sải bước của bạn.',
  socialLinks: {
    facebook: 'https://facebook.com/knicks.official',
    instagram: 'https://instagram.com/knicks.sneakers',
    tiktok: 'https://tiktok.com/@knicks.vn',
    twitter: '',
    youtube: 'https://youtube.com/@knicks'
  },
  shipping: {
    defaultFee: 35000,
    freeShippingThreshold: 500000, // Configurable (e.g. 500,000 VND)
    expressFee: 30000,
    estimatedDaysStandard: '2 – 5 ngày làm việc',
    estimatedDaysExpress: '1 – 2 ngày hỏa tốc',
    enableExpress: true
  },
  payment: {
    enableCod: true,
    enableBanking: true,
    enableMomo: true,
    enableVnpay: true,
    enableZalopay: false,
    bankInfo: {
      bankName: 'Vietcombank (VCB)',
      accountName: 'CONG TY TNHH K-NICKS VIET NAM',
      accountNumber: '998822334455',
      branch: 'Chi nhánh Sài Gòn - TP.HCM',
      transferSyntax: 'KN [Mã Đơn Hàng] [Số Điện Thoại]',
      qrTemplate: 'compact2'
    }
  },
  notifications: {
    notifyNewOrder: true,
    notifyOrderConfirmed: true,
    notifyOrderShipping: true,
    notifyOrderDelivered: true,
    notifyPromotions: true,
    adminEmailNotification: 'admin@knicks.vn'
  },
  seo: {
    websiteTitle: 'K-NICKS | Giày Sneaker & Thể Thao Chính Hãng Cao Cấp',
    metaTitle: 'K-NICKS - Hệ Thống Phân Phối Sneaker Chính Hãng 100%',
    metaDescription: 'Mua sắm giày thể thao, sneaker chính hãng từ Nike, Adidas, Puma, Converse tại K-NICKS. Cam kết 100% Authentic, bảo hành đổi trả 30 ngày, miễn phí giao hàng toàn quốc.',
    metaKeywords: 'k-nicks, knicks, giay sneaker chinh hang, giay the thao nam nu, nike air jordan, adidas ultraboost, puma rsx, converse chuck 70',
    favicon: '',
    ogImage: ''
  },
  policies: {
    returnPolicy: `### CHÍNH SÁCH ĐỔI TRẢ & HOÀN TIỀN TẠI K-NICKS (30 NGÀY)

**1. Điều kiện chấp nhận đổi trả:**
- Sản phẩm được mua trực tiếp tại website hoặc cửa hàng chính hãng của K-NICKS.
- Sản phẩm còn nguyên tem mác, hộp giày nguyên vẹn (không móp méo, rách nát), phụ kiện kèm theo (dây giày dự phòng, túi bọc, hoá đơn nếu có).
- Giày chưa qua sử dụng, đế giày không trầy xước, không bám bẩn hoặc có mùi lạ.
- Thời gian yêu cầu đổi trả trong vòng **30 ngày** kể từ ngày nhận hàng thành công.

**2. Các trường hợp được hỗ trợ đổi trả:**
- Khách hàng không vừa size chân (hỗ trợ đổi sang size vừa vặn miễn phí cước gửi 1 chiều).
- Sản phẩm giao sai mẫu mã, sai màu sắc hoặc sai size so với đơn đặt hàng.
- Sản phẩm có lỗi từ nhà sản xuất (hở keo, rách chỉ, lỗi da/vải khi vừa bóc hộp).

**3. Quy trình thực hiện:**
- Bước 1: Liên hệ hotline **1900 8463** hoặc gửi yêu cầu qua email **support@knicks.vn**.
- Bước 2: Đóng gói sản phẩm cẩn thận, nhân viên vận chuyển của K-NICKS sẽ đến tận nhà thu hồi hàng đổi.
- Bước 3: Sau khi kiểm tra tình trạng giày, K-NICKS sẽ gửi sản phẩm mới hoặc hoàn tiền trong vòng 2-3 ngày làm việc.`,

    shippingPolicy: `### CHÍNH SÁCH VẬN CHUYỂN & GIAO HÀNG TOÀN QUỐC

**1. Thời gian giao hàng:**
- **Nội thành TP.HCM & Hà Nội:** 1 – 2 ngày làm việc (Hỗ trợ giao hỏa tốc 4h).
- **Các tỉnh/thành phố khác:** 2 – 4 ngày làm việc.
- **Tuyến huyện, xã vùng sâu vùng xa:** 3 – 5 ngày làm việc.

**2. Biểu phí vận chuyển:**
- **Giao hàng tiêu chuẩn:** 35.000 VNĐ / đơn hàng.
- **Miễn phí vận chuyển (Freeship):** Áp dụng tự động cho mọi đơn hàng có giá trị từ **500.000 VNĐ** trở lên trên toàn quốc.
- **Giao hàng hỏa tốc:** 30.000 VNĐ phụ phí ưu tiên.

**3. Quyền lợi kiểm hàng (Đồng kiểm):**
- Khách hàng được quyền mở hộp kiểm tra ngoại quan sản phẩm (mẫu mã, màu sắc, size giày) trước khi thanh toán tiền mặt cho shipper (COD).
- Không hỗ trợ mang thử giày đi lại ngoài đường trước khi thanh toán.`,

    privacyPolicy: `### CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG

**1. Mục đích thu thập thông tin:**
- K-NICKS thu thập họ tên, số điện thoại, email và địa chỉ nhận hàng nhằm mục đích xử lý đơn hàng, giao nhận và chăm sóc hậu mãi.
- Thông tin đăng ký nhận ưu đãi (Email/Newsletter) chỉ được sử dụng để gửi thông báo chương trình khuyến mãi đặc quyền, không spam.

**2. Cam kết bảo mật:**
- Chúng tôi tuyệt đối **không bán, chia sẻ hoặc tiết lộ** thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.
- Mọi dữ liệu thanh toán thẻ/ngân hàng đều được mã hóa theo tiêu chuẩn SSL an toàn cao cấp.

**3. Quyền của khách hàng:**
- Khách hàng có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ thông tin tài khoản của mình bất kỳ lúc nào trong trang Hồ sơ cá nhân.`,

    termsOfService: `### ĐIỀU KHOẢN DỊCH VỤ & MUA SẮM TRỰC TUYẾN

**1. Chấp thuận điều khoản:**
Khi truy cập và đặt hàng trên website K-NICKS, quý khách đồng ý tuân thủ toàn bộ các quy định, chính sách bán hàng và điều khoản sử dụng được niêm yết công khai.

**2. Giá cả & Tình trạng hàng hóa:**
- Giá bán niêm yết trên website là giá cuối cùng đã bao gồm thuế GTGT (VAT).
- K-NICKS luôn nỗ lực cập nhật tình trạng tồn kho theo thời gian thực; trong trường hợp hy hữu sản phẩm vừa hết hàng tại kho do nhiều người đặt cùng lúc, tư vấn viên sẽ gọi điện thông báo ngay cho quý khách.

**3. Quyền sở hữu trí tuệ:**
Toàn bộ hình ảnh, logo, bài viết, kiểu dáng giao diện và nội dung thuộc bản quyền của K-NICKS hoặc các đối tác thương hiệu (Nike, Adidas, Puma, Converse). Nghiêm cấm mọi hành vi sao chép không có sự đồng ý bằng văn bản.`,

    warrantyPolicy: `### CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG 6 THÁNG

- Bảo hành bung keo, đứt chỉ hoàn toàn miễn phí trong suốt **06 tháng** sử dụng.
- Bảo hành trọn đời đối với việc phát hiện hàng giả / nhái: Hoàn tiền **200%** giá trị đơn hàng.
- Hỗ trợ vệ sinh, bảo dưỡng giày cơ bản trọn đời cho thành viên K-NICKS VIP.`
  }
};

export function mergeSystemSettings(base: SystemSettings, custom?: any): SystemSettings {
  if (!custom || typeof custom !== 'object') return base;
  return {
    ...base,
    ...custom,
    socialLinks: {
      ...base.socialLinks,
      ...(custom.socialLinks || {})
    },
    shipping: {
      ...base.shipping,
      ...(custom.shipping || {})
    },
    payment: {
      ...base.payment,
      ...(custom.payment || {}),
      bankInfo: {
        ...base.payment.bankInfo,
        ...((custom.payment && custom.payment.bankInfo) || {})
      }
    },
    notifications: {
      ...base.notifications,
      ...(custom.notifications || {})
    },
    seo: {
      ...base.seo,
      ...(custom.seo || {})
    },
    policies: {
      ...base.policies,
      ...(custom.policies || {})
    }
  };
}

