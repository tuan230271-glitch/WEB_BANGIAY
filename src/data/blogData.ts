import { BlogPost } from '../types';
import blogWhiteSneakerImg from '../assets/images/blog/blog-white-sneaker-styling.jpg';
import blogPreservationImg from '../assets/images/blog/blog-sneaker-preservation-storage.jpg';
import blogCleaningSpaImg from '../assets/images/blog/blog-sneaker-cleaning-spa.jpg';
import blogRetroRunnersImg from '../assets/images/blog/blog-retro-runners-trend-2026.jpg';
import blogSuedeCareImg from '../assets/images/blog/blog-suede-shoe-care.jpg';
import blogSizeMeasureImg from '../assets/images/blog/blog-shoe-size-measurement.jpg';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-001',
    slug: 'bi-quyet-phoi-do-sneaker-trang',
    title: 'Bí Quyết Phối Đồ Với Giày Sneaker Trắng: Đơn Giản Nhưng Luôn Đỉnh Cao',
    excerpt: 'Sneaker trắng là món đồ không thể thiếu trong tủ giày. Cùng khám phá 5 công thức mix-and-match từ phong cách tối giản, công sở trẻ trung đến streetwear sành điệu.',
    coverImage: blogWhiteSneakerImg,
    category: 'styling',
    categoryLabel: 'Cách phối đồ',
    tags: ['Phối đồ', 'Sneaker trắng', 'Streetwear', 'Thời trang nam nữ'],
    author: {
      name: 'Minh Trí K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Fashion Stylist'
    },
    publishedAt: '20/02/2026',
    readTime: '4 phút đọc',
    featured: true,
    relatedProductIds: ['nike-air-force-1', 'adidas-stan-smith', 'converse-chuck-70'],
    content: `
### 1. Sức hút bất diệt của đôi Sneaker trắng

Dù xu hướng thời trang có thay đổi chóng mặt qua từng năm, một đôi **sneaker trắng tinh giản** vẫn luôn giữ vững vị trí độc tôn trong tủ giày của mọi tín đồ thời trang. Điểm mạnh lớn nhất của giày trắng là tính linh hoạt: bạn có thể diện đi học, đi làm văn phòng năng động hay đi dạo phố cuối tuần mà không sợ lỗi mốt.

---

### 2. Công thức 1: Quần Jeans Ống Suông + Áo Phông Basic
- **Phong cách:** Casual, trẻ trung, năng động.
- **Cách phối:** Chọn một chiếc quần jeans xanh wash nhẹ hoặc đen trơn, kết hợp cùng áo phông oversize trắng/đen hoặc màu pastel.
- **Điểm nhấn:** Xắn gấu quần nhẹ hoặc để ống quần phủ vừa vặn lên phần upper của giày để khoe trọn form dáng sneaker.

---

### 3. Công thức 2: Quần Tây Smart-Casual + Áo Blazer Trẻ Trung
- **Phong cách:** Lịch lãm, hiện đại, thích hợp cho môi trường công sở mở.
- **Cách phối:** Quần tây ống đứng màu xám, đen hoặc be kết hợp cùng áo thun polo hoặc sơ mi và khoác blazer mỏng nhẹ bên ngoài.
- **Điểm nhấn:** Đôi sneaker trắng sạch sẽ sẽ giúp bạn giảm bớt sự cứng nhắc của âu phục, tạo vẻ ngoài cuốn hút và đầy phong thái.

---

### 4. Công thức 3: Quần Short Kaki / Nỉ + Hoodie / Áo Thun Oversize
- **Phong cách:** Sporty / Athleisure mùa hè hoặc dạo phố.
- **Cách phối:** Quần short thể thao trên gối phối cùng tất cổ cao K-NICKS trắng và đôi giày form chunky hoặc low-top.

---

### 5. Lưu ý giữ đôi giày luôn trắng sáng
Đừng quên trang bị **bình xịt nano chống thấm** và **bọt vệ sinh chuyên dụng** để đôi giày trắng của bạn luôn giữ được vẻ đẹp như ngày đầu mới đập hộp!
    `
  },
  {
    id: 'blog-002',
    slug: '5-meo-bao-quan-giay-sneaker-tranh-am-moc-o-vang',
    title: '5 Mẹo Bảo Quản Giày Sneaker Tránh Ẩm Mốc & Ố Vàng Trong Mùa Mưa',
    excerpt: 'Độ ẩm cao và thời tiết thất thường là kẻ thù số 1 của chất liệu da và đế giày. Áp dụng ngay 5 mẹo bảo quản khoa học để giữ form giày chuẩn đẹp dài lâu.',
    coverImage: blogPreservationImg,
    category: 'shoe_care',
    categoryLabel: 'Mẹo bảo quản giày',
    tags: ['Bảo quản giày', 'Chống ẩm mốc', 'Bảo quản đế giày', 'Mẹo hay'],
    author: {
      name: 'Hoàng Long K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Shoe Care Specialist'
    },
    publishedAt: '18/02/2026',
    readTime: '5 phút đọc',
    featured: true,
    relatedProductIds: ['nike-pegasus-40', 'adidas-ultraboost-light'],
    content: `
### Kẻ thù của giày Sneaker: Độ ẩm & Ánh nắng gắt

Nhiều bạn thường thắc mắc vì sao đôi giày ít mang vẫn bị **nứt da, bong keo hoặc ố vàng đế**. Nguyên nhân chính là do bảo quản sai cách trong môi trường độ ẩm không khí cao hoặc phơi trực tiếp dưới nắng gắt.

---

### 1. Luôn sử dụng Shoe Tree hoặc Giấy Giữ Form
- Khi không mang, chất liệu da và vải dệt có xu hướng co lại hoặc gãy nếp (creases).
- Sử dụng **Shoe Tree gỗ tuyết tùng** không chỉ giúp giữ nguyên form mũi giày mà còn có khả năng hút ẩm và khử mùi tự nhiên cực tốt.

---

### 2. Bỏ gói hút ẩm (Silica Gel) vào hộp giày
- Đặt 2–3 gói hút ẩm vào bên trong giày trước khi cất vào hộp hoặc tủ giày kín.
- Tránh bọc giày bằng túi nilon quá kín khi giày còn ẩm vì sẽ tạo điều kiện cho nấm mốc phát triển.

---

### 3. Vệ sinh đất cát và lau khô ngay sau khi đi mưa
- Nếu giày bị dính nước mưa, hãy dùng khăn microfiber thấm khô bề mặt ngoài ngay lập tức.
- Nhét giấy báo mềm hoặc giấy ăn không mùi vào bên trong để hút nước (thay giấy sau mỗi 2–3 tiếng).
- **Tuyệt đối KHÔNG sấy bằng máy sấy nhiệt độ cao** hoặc phơi dưới ánh nắng trưa trực tiếp vì nhiệt độ cao sẽ làm giòn keo và nứt da.

---

### 4. Để giày có khoảng nghỉ giữa các lần mang
- Không nên mang một đôi giày liên tục 7 ngày/tuần. Giày cần ít nhất 24 giờ để bay hết hơi ẩm mồ hôi chân và đàn hồi lại bộ đệm mút.

---

### 5. Sử dụng túi đựng giày có lỗ thoáng khí
- Khi đi du lịch hoặc cất giữ dài ngày, hãy dùng túi đựng giày chuyên dụng bằng vải không dệt có khóa kéo để tránh bụi bẩn mà vẫn đảm bảo độ thoáng.
    `
  },
  {
    id: 'blog-003',
    slug: 'quy-trinh-6-buoc-ve-sinh-giay-sneaker-tai-nha',
    title: 'Quy Trình 6 Bước Vệ Sinh Giày Sneaker Tại Nhà Chuẩn Spa',
    excerpt: 'Hướng dẫn chi tiết từng bước làm sạch từ đế giày, thân giày vải knit, da trơn đến dây giày mà không làm phai màu hay xù lông vải.',
    coverImage: blogCleaningSpaImg,
    category: 'cleaning',
    categoryLabel: 'Hướng dẫn vệ sinh',
    tags: ['Vệ sinh giày', 'Giặt giày đúng cách', 'Sneaker Spa', 'Chăm sóc giày'],
    author: {
      name: 'Văn Tuấn K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'Master Cleaner'
    },
    publishedAt: '15/02/2026',
    readTime: '6 phút đọc',
    featured: false,
    content: `
### Dụng cụ cần chuẩn bị trước khi giặt giày:
- Dung dịch vệ sinh giày chuyên dụng (độ pH trung tính).
- Bàn chải lông mềm (cho thân giày/da/vải) & Bàn chải lông cứng (cho đế ngoài).
- Khăn lau sợi Microfiber siêu thấm.
- Thau nước ấm sạch.

---

### Bước 1: Tháo dây giày và lót giày
- Tháo riêng dây giày và miếng lót để ngâm riêng trong dung dịch xà phòng loãng.

### Bước 2: Chải khô bụi bẩn ban đầu
- Dùng bàn chải khô gõ nhẹ và quét sạch lớp bùn đất khô bám trên đế và thân giày. Bước này giúp tránh biến bụi khô thành bùn nhão khi tiếp xúc với nước.

### Bước 3: Vệ sinh phần thân giày (Upper)
- Nhúng ướt bàn chải lông mềm, nhỏ 2–3 giọt dung dịch vệ sinh chuyên dụng.
- Đánh nhẹ nhàng theo chuyển động tròn trên thân giày để bọt làm sạch đẩy bụi bẩn từ sâu trong sợi vải hoặc lỗ chân lông của da ra ngoài.

### Bước 4: Vệ sinh đế giữa (Midsole) và đế ngoài (Outsole)
- Dùng bàn chải lông cứng vừa phải chà kỹ các rãnh đế và phần viền cao su để loại bỏ vết ố đen.

### Bước 5: Thấm khô bằng khăn Microfiber
- Dùng khăn khô vỗ nhẹ và thấm sạch lớp bọt bẩn. Tránh chà xát quá mạnh gây trầy xước bề mặt da bóng.

### Bước 6: Phơi giày nơi khô ráo, thoáng gió
- Đặt giày ở nơi có gió lưu thông tốt, bóng râm mát. Có thể để trước quạt gió để giày khô tự nhiên trong vòng 6–8 tiếng.
    `
  },
  {
    id: 'blog-004',
    slug: 'xu-huong-sneaker-2026-retro-runner-va-cong-nghe-xanh',
    title: 'Xu Hướng Sneaker 2026: Sự Trỗi Dậy Của Retro Runners & Chất Liệu Tái Chế',
    excerpt: 'Điểm qua những trào lưu thống trị làng giày thể thao năm nay: phong cách Y2K Retro Runners, đệm siêu nhẹ thế hệ mới và cam kết bền vững từ Nike, Adidas, Puma.',
    coverImage: blogRetroRunnersImg,
    category: 'news',
    categoryLabel: 'Tin tức & Thời trang',
    tags: ['Xu hướng 2026', 'Retro Runners', 'Nike', 'Adidas', 'Puma'],
    author: {
      name: 'Phương Thảo K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      role: 'Trends Editor'
    },
    publishedAt: '12/02/2026',
    readTime: '4 phút đọc',
    featured: false,
    content: `
### 1. Trào lưu Retro Runners thập niên 2000s tiếp tục bùng nổ

Năm 2026 chứng kiến sự trở lại mạnh mẽ của các thiết kế giày chạy bộ mang đậm hơi thở **Y2K Retro Runners**. Với chất liệu lưới mesh thoáng khí kết hợp cùng các dải overlays bạc ánh kim (Metallic Silver), phong cách này mang đến sự thoải mái tối đa cho người mang cả ngày dài.

Các đại diện tiêu biểu như Nike Vomero, Puma Velophasis hay Asics Gel-Kayano đang là tâm điểm chú ý trên khắp các tuần lễ thời trang thế giới.

---

### 2. Cuộc đua công nghệ đệm siêu nhẹ & đàn hồi cao

Các thương hiệu hàng đầu không ngừng cải tiến cấu trúc bọt khí (Supercritical Foam) giúp giảm trọng lượng đôi giày xuống mức kỷ lục mà vẫn mang lại độ êm ái vượt trội. Người tiêu dùng ngày nay không chỉ tìm kiếm một đôi giày đẹp mắt mà còn đòi hỏi cảm giác nâng niu bàn chân trong từng bước di chuyển.

---

### 3. Cam kết thời trang xanh & chất liệu tuần hoàn

Hơn 60% các dòng sản phẩm mới ra mắt trong năm 2026 đều ứng dụng ít nhất 20–40% sợi tái chế từ rác thải đại dương và cao su sinh học tái sinh. Tại K-NICKS, chúng tôi tự hào đồng hành cùng các thương hiệu lớn để mang tới cho bạn những sản phẩm chất lượng chuẩn quốc tế và thân thiện với môi trường.
    `
  },
  {
    id: 'blog-005',
    slug: 'huong-dan-ve-sinh-giay-da-lon-suede-khong-hong-form',
    title: 'Bí Kíp Vệ Sinh Giày Da Lộn (Suede) Chuẩn Đẹp Không Bị Bạc Màu',
    excerpt: 'Da lộn nổi tiếng là chất liệu khó chiều nhất. Hãy cùng xem bí quyết làm sạch vết bẩn cứng đầu bằng gôm tẩy và bàn chải cao su non mà không lo hư lông da.',
    coverImage: blogSuedeCareImg,
    category: 'cleaning',
    categoryLabel: 'Hướng dẫn vệ sinh',
    tags: ['Giày da lộn', 'Suede care', 'Vệ sinh giày', 'K-NICKS tips'],
    author: {
      name: 'Văn Tuấn K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'Master Cleaner'
    },
    publishedAt: '08/02/2026',
    readTime: '5 phút đọc',
    featured: false,
    content: `
### Đặc tính của da lộn (Suede / Nubuck)
Da lộn có bề mặt xơ mềm tự nhiên, rất nhạy cảm với nước và hóa chất tẩy rửa thông thường. Nếu bạn giặt da lộn trực tiếp bằng nước xà phòng, da sẽ bị xơ cứng, co rút và bạc màu nhanh chóng.

---

### 3 Dụng cụ "Cứu Tinh" Cho Giày Da Lộn:
1. **Gôm tẩy da lộn (Suede Eraser):** Dùng để tẩy các vết ố đen, vết quẹt dơ trên bề mặt khô ráo.
2. **Bàn chải lông ngựa hoặc cao su non (Crepe Brush):** Giúp chải tơi các sợi lông da lộn sau khi làm sạch.
3. **Bình xịt Nano chống thấm nước:** Tạo lớp màng bảo vệ vô hình ngăn nước và bụi bẩn bám dính.

---

### Các bước thực hiện:
- **Bước 1:** Dùng bàn chải chải nhẹ theo một chiều cố định để loại bỏ bụi khô bám trên các thớ da.
- **Bước 2:** Dùng gôm tẩy chà xát nhẹ lên các vết bẩn cứng đầu như vết chì, vết bùn khô.
- **Bước 3:** Nếu có vết ố loang, dùng dung dịch tạo bọt khô chuyên dụng cho da lộn, dùng khăn microfiber khô lau bớt bọt ngay lập tức.
- **Bước 4:** Sau khi da khô hoàn toàn, dùng bàn chải chải ngược lại để phục hồi độ mềm mượt của lớp lông.
    `
  },
  {
    id: 'blog-006',
    slug: 'cach-chon-size-giay-chuan-xac-khi-mua-online',
    title: 'Cách Đo Bàn Chân & Chọn Size Giày Chuẩn Xác 100% Khi Mua Online',
    excerpt: 'Không còn nỗi lo giày bị chật mũi hay tuột gót khi mua online. Bảng quy đổi size chuẩn US, UK, CM từ Nike, Adidas, Puma đến Converse.',
    coverImage: blogSizeMeasureImg,
    category: 'styling',
    categoryLabel: 'Cách phối đồ',
    tags: ['Chọn size giày', 'Bảng size', 'Mua giày online', 'Kinh nghiệm'],
    author: {
      name: 'Minh Trí K-NICKS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Fashion Stylist'
    },
    publishedAt: '03/02/2026',
    readTime: '4 phút đọc',
    featured: false,
    content: `
### Vì sao mỗi hãng giày lại có form size khác nhau?
Nike thường có xu hướng ôm chân (True to size hoặc nên tăng 0.5 size cho người chân bè), trong khi Converse Chuck Taylor thường có form dài hơn (nên lùi 0.5 - 1 size).

---

### Hướng dẫn 3 bước đo chiều dài bàn chân tại nhà:
1. Đặt tờ giấy A4 sát mép tường, đặt gót chân chạm nhẹ vào tường.
2. Dùng bút đánh dấu điểm xa nhất của ngón chân cái (hoặc ngón trỏ dài nhất).
3. Dùng thước đo khoảng cách từ mép tường đến điểm đánh dấu (đơn vị Centimet - CM).
4. **Cộng thêm 0.5 cm – 1 cm** đối với giày chạy bộ hoặc giày đá bóng để tạo khoảng thở thoải mái cho các ngón chân khi vận động.
    `
  }
];
