import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Sneaker knowledge base for smart fallback & prompting
const SNEAKER_CATALOG_SUMMARY = `
Cửa hàng K-NICKS Sneaker Store chuyên cung cấp giày chính hãng:
1. Nike:
   - Nike Air Max Pulse (4.200.000đ, ID: nike-air-max-pulse) - Đệm khí Air Max thế hệ mới, phong cách đường phố London năng động. Form vừa vặn (True to size).
   - Nike ZoomX Vaporfly 3 (6.800.000đ, ID: nike-vaporfly-3) - Đỉnh cao chạy bộ Marathon, đệm ZoomX siêu nhẹ hoàn trả năng lượng 85%, tấm Carbon Flyplate. Nên tăng 0.5 size cho cự ly dài.
   - Nike Phantom GX II Academy (3.200.000đ, ID: nike-phantom-gx) - Giày bóng đá cỏ nhân tạo/tự nhiên với lớp NikeSkin bám dính bóng tuyệt hảo.
2. Adidas:
   - Adidas Ultraboost Light (5.200.000đ, ID: adidas-ultraboost-light) - Đệm Light BOOST siêu nhẹ, vải Primeknit+ ôm sát. Khuyên tăng 0.5 size nếu chân bè ngang.
   - Adidas Samba Classic (2.900.000đ, ID: adidas-samba-classic) - Phong cách retro bóng đá cổ điển, da mềm phối mũi da lộn. True to size hoặc tăng 0.5 size cho chân bè.
   - Adidas Predator Accuracy (6.200.000đ, ID: adidas-predator-elite) - Giày bóng đá đỉnh cao với công nghệ gai cao su High Definition Grip.
3. Puma:
   - Puma RS-X Retro Drift (3.400.000đ, ID: puma-rsx-retro) - Chunky sneaker hầm hố, đệm Running System êm ái, màu sắc retro 80s cá tính. True to size.
   - Puma Future Ultimate FG (5.800.000đ, ID: puma-future-ultimate) - Giày bóng đá công nghệ dệt FUZIONFIT360 co giãn thích ứng.
4. Converse:
   - Converse Chuck Taylor '70 (2.100.000đ, ID: converse-chuck-70) - Canvas dày dặn 12oz, lót OrthoLite êm ái, đế cao su bóng bẩy. Form dài, khuyên giảm 0.5 size so với giày thể thao khác.
   - Converse Run Star Hike (2.800.000đ, ID: converse-run-star) - Đế răng cưa platform hầm hố tôn dáng cực đỉnh phong cách streetwear.

Mã giảm giá đang hoạt động:
- SOLE20: Giảm 20% tối đa 200.000đ cho đơn hàng từ 500.000đ
- KNICKS10: Giảm 10% tối đa 150.000đ cho khách hàng mới
- FREESHIP: Miễn phí vận chuyển toàn quốc cho đơn từ 1.500.000đ

Chính sách K-NICKS:
- Cam kết 100% Chính Hãng (Authentic), đền bù 200% nếu phát hiện hàng giả
- Đổi size miễn phí trong vòng 30 ngày (sản phẩm nguyên tem mác)
- Bảo hành keo chỉ 6 tháng miễn phí
- Giao hàng hỏa tốc 2H nội thành, giao toàn quốc 2-4 ngày
- Đồng kiểm hàng trước khi thanh toán (COD)
`;

// Priority model list with automatic fallbacks
const CANDIDATE_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-3.7-flash",
  "gemini-1.5-flash",
];

async function generateWithGeminiFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    topP?: number;
  }
): Promise<{ text: string; model: string } | null> {
  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          temperature: params.temperature ?? 0.7,
          topP: params.topP ?? 0.9,
        },
      });

      if (response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      // Log cleanly and gracefully try next candidate model
      console.log(`[Gemini API] Model ${model} unavailable (status: ${err?.status || '503/busy'}), trying next candidate...`);
    }
  }
  return null;
}

// Helper: Comprehensive Smart Rule-Based Fallback for Chat
function generateSmartChatFallback(message: string): { reply: string; suggestedProductIds: string[]; quickReplies?: string[] } {
  const lower = message.toLowerCase();
  let reply = "";
  const suggestedProductIds: string[] = [];
  let quickReplies: string[] = [];

  // 1. Cleaning / De-yellowing / Maintenance
  if (lower.includes("vệ sinh") || lower.includes("ố vàng") || lower.includes("tẩy ố") || lower.includes("bảo quản") || lower.includes("giặt giày")) {
    reply = `🧼 **BÍ QUYẾT VỆ SINH & TRỊ Ố VÀNG GIÀY CHUẨN SNEAKERHEAD:**

1. **Vệ sinh phần thân (Upper):**
   - *Giày vải Canvas (Converse):* Pha nước ấm + xà phòng dịu nhẹ hoặc bọt vệ sinh chuyên dụng, dùng bàn chải lông mềm chà xoay tròn nhẹ nhàng.
   - *Giày da (Leather) & Da lộn (Suede):* Lau bằng khăn ẩm chuyên dụng hoặc bọt khô. Tuyệt đối không nhúng sũng nước đối với da lộn.

2. **Cách tẩy ố vàng đế cao su:**
   - Dùng hỗn hợp **Baking Soda + Kem đánh răng trắng** thoa lên vùng ố, ủ 15 phút rồi chà sạch.
   - Hoặc dùng dung dịch **Cream De-yellowing** bọc màng thực phẩm phơi nắng nhẹ 30 phút.

3. **Nguyên tắc phơi & bảo quản:**
   - ❌ **Tuyệt đối không giặt máy:** Làm nứt da, biến dạng form và gãy đế.
   - 🧻 **Bọc khăn giấy ăn khi phơi:** Đắp 2-3 lớp giấy ăn kín thân giày khi phơi gió để giấy hút hết cặn ố vàng từ bột giặt.
   - 📦 Luôn để gói hút ẩm silica gel và cây giữ form (shoe tree) khi cất hộp.`;
    suggestedProductIds.push("converse-chuck-70", "nike-air-max-pulse");
    quickReplies = ["👕 Phối đồ đi học/đi làm", "👟 So sánh AF1 và Stan Smith", "📏 Hướng dẫn đo size"];

  // 2. Comparison between models
  } else if (lower.includes("so sánh") || lower.includes("stan smith") || lower.includes("air force") || lower.includes("vs") || lower.includes("khác nhau")) {
    reply = `👟 **SO SÁNH CHI TIẾT: NIKE AIR FORCE 1 '07 vs ADIDAS STAN SMITH**

| Tiêu chí | Nike Air Force 1 '07 | Adidas Stan Smith |
| :--- | :--- | :--- |
| **Phong cách** | Streetwear, Hip-hop, Chunky tôn dáng | Minimalist, Casual, Thanh lịch cổ điển |
| **Chất liệu** | Da lì dày dặn, đệm Air ẩn ở gót | Da mềm / Primegreen nhẹ nhàng, thoáng |
| **Độ cao đế** | ~3.8cm (hack dáng cực tốt) | ~2.5cm (đế bệt thanh thoát) |
| **Form dáng** | Form to, rộng rãi (Chân thon lùi 0.5 size) | Form ôm vừa vặn (True to size) |
| **Phù hợp nhất** | Quần ống rộng, Cargo pants, Streetwear | Quần Tây, Chinos, Váy xếp ly, Sơ mi |

💡 **Lời khuyên từ K-NICKS:** Nếu bạn thích phong cách cá tính nổi bật và muốn hack chiều cao, hãy chọn **Air Force 1 / Air Max Pulse**. Nếu bạn cần một đôi giày đa năng đi làm, đi học nhẹ nhàng mỗi ngày, **Stan Smith / Samba** là chân ái!`;
    suggestedProductIds.push("nike-air-max-pulse", "adidas-samba-classic", "converse-chuck-70");
    quickReplies = ["👕 Gợi ý phối đồ đi học/đi làm", "💰 Tìm giày dưới 2.5 triệu", "🧼 Cách vệ sinh không bị ố"];

  // 3. Outfit styling / Mix & Match
  } else if (lower.includes("phối đồ") || lower.includes("outfit") || lower.includes("mặc gì") || lower.includes("đi học") || lower.includes("đi làm") || lower.includes("streetwear")) {
    reply = `👕 **CÔNG THỨC MIX & MATCH OUTFIT SNEAKER TRẺ TRUNG & LỊCH LÃM:**

1. **Outfit Đi Học / Đi Làm Năng Động (Smart Casual):**
   - **Top:** Áo sơ mi Oxford cộc tay/dài tay khoác ngoài áo thun trắng trơn.
   - **Bottom:** Quần Chinos ống suông hoặc quần Jeans đen tối giản.
   - **Sneaker:** **Adidas Samba** hoặc **Converse Chuck 70** tạo vẻ thư sinh, thanh lịch.

2. **Outfit Dạo Phố / Cà Phê Cuối Tuần (Streetwear Trend):**
   - **Top:** Áo phông Oversize graphic hoặc áo Hoodie/Sweater dáng rộng.
   - **Bottom:** Quần túi hộp (Cargo Pants) hoặc quần Parachute rộng rãi.
   - **Sneaker:** **Nike Air Max Pulse** hoặc **Puma RS-X** hầm hố cực chất.

3. **Outfit Nữ Tính / Tôn Dáng:**
   - Chân váy chữ A / Tennis skirt + Áo croptop + **Converse Run Star Hike** (đế bánh mì hack chân dài miên man).`;
    suggestedProductIds.push("adidas-samba-classic", "nike-air-max-pulse", "converse-run-star");
    quickReplies = ["💰 Giày đẹp dưới 2.5 triệu", "📏 Cách đo size cho chân bè", "🔥 Nhận mã giảm giá 20%"];

  // 4. Sizing for wide feet / measuring guide
  } else if (lower.includes("chân bè") || lower.includes("bè ngang") || lower.includes("đo size") || lower.includes("chọn size") || lower.includes("bảng size") || lower.includes("chân dày")) {
    reply = `📏 **HƯỚNG DẪN CHỌN SIZE CHUẨN XÁC CHO NGƯỜI CHÂN BÈ & MU DÀY:**

1. **Cách đo chiều dài chân tại nhà:**
   - Đặt bàn chân lên tờ giấy trắng sát mép tường.
   - Dùng bút vạch điểm xa nhất ở ngón chân cái và gót chân.
   - Đo khoảng cách (cm) và cộng thêm **0.5cm - 1.0cm** độ dư ngón chân.

2. **Quy tắc chọn size theo từng thương hiệu:**
   - **Nike / Adidas (Form chạy bộ):** Nên **TĂNG 0.5 size** (ví dụ bình thường đi 41 thì chọn 41.5 hoặc 42) để không bị tức 2 bên má bàn chân.
   - **Converse Chuck 70:** Do form vốn dài nhưng mũi thon, người chân bè nên đi **True to size (đúng size thông thường)**, không nên lùi size.
   - **Puma RS-X:** Thiết kế khoang mũi to bè tự nhiên, đi đúng size rất thoải mái.

👉 Bạn có thể nhấn vào nút **"🤖 Gợi ý size bằng AI"** ở trang sản phẩm để hệ thống tính toán size chính xác đến từng milimet nhé!`;
    suggestedProductIds.push("puma-rsx-retro", "adidas-ultraboost-light", "nike-air-max-pulse");
    quickReplies = ["👟 So sánh AF1 và Stan Smith", "🛡️ Chính sách đổi size", "🔥 Mã giảm SOLE20"];

  // 5. Budget / Low price filter
  } else if (lower.includes("dưới 2") || lower.includes("dưới 3") || lower.includes("2.5 triệu") || lower.includes("ngân sách") || lower.includes("giá rẻ") || lower.includes("sinh viên") || lower.includes("tài chính") || lower.includes("tiền")) {
    reply = `💰 **TOP SNEAKER CHÍNH HÃNG CỰC HOT DƯỚI 2.5 - 3.0 TRIỆU ĐỒNG:**

1. **Converse Chuck Taylor '70** (~2.100.000đ):
   - Mẫu giày "quốc dân" bất tử, vải canvas 12oz siêu bền, phối đồ phong cách vintage/casual đỉnh chóp.

2. **Converse Run Star Hike** (~2.800.000đ):
   - Đột phá với đế răng cưa hack chiều cao 5cm, phong cách thời trang đường phố nổi bật.

3. **Adidas Samba Classic** (~2.900.000đ):
   - Cơn sốt thời trang Y2K toàn cầu, chất liệu da êm ái, form dáng nhỏ gọn tinh tế.

4. **Puma RS-X Retro Drift** (~3.400.000đ - *Áp mã SOLE20 còn ~2.720.000đ*):
   - Chunky sneaker đậm chất tương lai, đệm RS siêu êm chân.

🎁 **Mẹo tiết kiệm:** Đừng quên áp dụng mã voucher **SOLE20** (-20%) hoặc **KNICKS10** để được giảm thêm đến 200.000đ ngay nhé!`;
    suggestedProductIds.push("converse-chuck-70", "converse-run-star", "adidas-samba-classic");
    quickReplies = ["🔥 Nhận mã SOLE20 ngay", "👕 Gợi ý phối đồ đi học", "🛡️ Chính sách bảo hành"];

  // 6. Auth vs Fake / Authentic Verification
  } else if (lower.includes("auth") || lower.includes("fake") || lower.includes("chính hãng") || lower.includes("phân biệt") || lower.includes("hàng giả") || lower.includes("check")) {
    reply = `🛡️ **5 BƯỚC PHÂN BIỆT GIÀY AUTHENTIC vs FAKE TỪ K-NICKS:**

1. **Kiểm tra Tem & Font chữ (Tag / Label):**
   - Giày Auth font chữ in sắc nét, mã UPC/SKU khớp hoàn toàn với mã in trên vỏ hộp. Mã QR quét dẫn đúng trang thông tin sản phẩm của hãng.
2. **Mùi keo & Chất liệu Da:**
   - Giày chính hãng có mùi da tự nhiên hoặc mùi keo thơm nhẹ, không có mùi hắc nồng nặc hóa chất rẻ tiền.
3. **Đường may (Stitching):**
   - Chỉ may đều tăm tắp, không có chỉ thừa, mũi may sâu và chắc chắn quanh viền đế.
4. **Độ đàn hồi của Bộ Đệm (Air / Boost / Nitro):**
   - Đế Boost/ZoomX thật khi ấn tay sẽ đàn hồi nảy ngay lập tức, đi vào cảm giác bồng bềnh êm ái chứ không bị xẹp lún cứng ngắc như mút xốp giả.
5. **Cam kết tại K-NICKS:**
   - 100% sản phẩm có hóa đơn VAT, tem nhập khẩu chính hãng. K-NICKS **hoàn tiền 200%** nếu phát hiện hàng không chuẩn!`;
    suggestedProductIds.push("nike-air-max-pulse", "adidas-ultraboost-light");
    quickReplies = ["🛡️ Chính sách đổi trả & bảo hành", "💰 Giày hot dưới 2.5 triệu", "🔥 Lấy mã giảm giá"];

  // 7. Policy / Warranty / Returns / Shipping
  } else if (lower.includes("đổi trả") || lower.includes("bảo hành") || lower.includes("ship") || lower.includes("vận chuyển") || lower.includes("chính sách") || lower.includes("kiểm tra hàng") || lower.includes("cod")) {
    reply = `🛡️ **CHÍNH SÁCH BẢO HÀNH & ĐỔI TRẢ VƯỢT TRỘI TẠI K-NICKS:**

- 🔄 **Đổi size / Đổi mẫu trong 30 ngày:** Áp dụng miễn phí 100% nếu giày không vừa chân hoặc bạn muốn đổi sang màu khác (chỉ cần giày chưa qua sử dụng ngoài đường, còn nguyên tem hộp).
- 🛠️ **Bảo hành keo chỉ 6 tháng:** Miễn phí bảo hành keo, đường chỉ và hỗ trợ vệ sinh giày lần đầu.
- 📦 **Đồng kiểm khi nhận (COD):** Bạn được quyền mở hộp kiểm tra giày, kiểm tra tem mác và thử chân thoải mái trước khi thanh toán.
- 🚚 **Giao hàng toàn quốc:**
  - Nội thành TP.HCM & Hà Nội: Hỏa tốc trong **2 Giờ** (Grab/Ahamove).
  - Tỉnh thành khác: Nhận hàng sau **2 - 4 ngày** (Giao Hàng Tiết Kiệm/VNPost).
  - Miễn phí vận chuyển cho đơn hàng từ **1.500.000đ** (nhập mã **FREESHIP**).`;
    suggestedProductIds.push("nike-air-max-pulse", "converse-chuck-70");
    quickReplies = ["🔥 Lấy mã SOLE20 giảm 20%", "📏 Cách đo size chuẩn", "👟 Tìm giày dưới 2.5 triệu"];

  // 8. Running / Sports
  } else if (lower.includes("chạy bộ") || lower.includes("running") || lower.includes("marathon") || lower.includes("thể dục") || lower.includes("bóng đá") || lower.includes("gym")) {
    reply = `🏃 **GIÀY THỂ THAO & CHẠY BỘ ĐỈNH CAO TẠI K-NICKS:**

1. **Nike ZoomX Vaporfly 3** (Chạy Marathon / Bứt tốc):
   - Đĩa đệm Carbon Flyplate toàn phần cùng bọt ZoomX siêu nhẹ giúp hoàn trả 85% lực đẩy, giúp bạn duy trì pace cao mà không mất sức.
2. **Adidas Ultraboost Light** (Chạy hằng ngày / Tập Gym / Đi bộ):
   - Đế đệm Light BOOST nhẹ hơn 30%, bảo vệ khớp gối tối đa và độ bền cực cao lên đến hàng ngàn kilomet.
3. **Puma Future Ultimate / Nike Phantom GX** (Bóng đá sân cỏ):
   - Dòng giày đinh chuyên nghiệp ôm sát cổ chân và tăng cảm giác chạm bóng.

💡 **Lưu ý chọn size:** Giày thể thao vận động nên chọn dư ra **0.5 - 1.0cm (Up 0.5 size)** so với bình thường để bàn chân nở ra khi vận động không bị phồng rộp nhé!`;
    suggestedProductIds.push("adidas-ultraboost-light", "nike-vaporfly-3", "nike-phantom-gx");
    quickReplies = ["📏 Hướng dẫn đo size", "🧼 Cách vệ sinh giày", "🔥 Mã giảm SOLE20"];

  // 9. Discount / Voucher / Promotions
  } else if (lower.includes("mã giảm") || lower.includes("voucher") || lower.includes("khuyến mãi") || lower.includes("discount") || lower.includes("sale") || lower.includes("ưu đãi")) {
    reply = `🔥 **TỔNG HỢP MÃ GIẢM GIÁ ĐANG ÁP DỤNG HÔM NAY TẠI K-NICKS:**

- 🎟️ **SOLE20**: Giảm ngay **20%** (tối đa 200.000đ) cho mọi đơn hàng từ 500.000đ.
- 🎟️ **KNICKS10**: Giảm **10%** (tối đa 150.000đ) dành riêng cho thành viên đăng ký mới.
- 🚚 **FREESHIP**: Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1.500.000đ.

👉 Bạn chỉ cần sao chép mã và dán vào ô **Mã Giảm Giá** ở trang Giỏ Hàng hoặc Thanh Toán để áp dụng ngay!`;
    suggestedProductIds.push("nike-air-max-pulse", "adidas-ultraboost-light");
    quickReplies = ["💰 Giày hot dưới 2.5 triệu", "👕 Gợi ý phối đồ đi làm", "👟 So sánh AF1 và Stan Smith"];

  // 10. Default / Welcome General
  } else {
    reply = `Chào bạn! Tôi là **N-KICKS AI Stylist** 🤖 - Trợ lý Thời trang & Chuyên gia Giày Sneaker cao cấp của K-NICKS.

Tôi luôn sẵn sàng giải đáp và hỗ trợ bạn mọi vấn đề:
- 👟 **Tư vấn chọn giày:** Phù hợp với dáng chân, mục đích (đi chơi, đi học, chạy bộ, tập gym, bóng đá).
- 📏 **Tư vấn size giày:** Xử lý chân bè, chân thon, quy đổi size US/UK/EU theo từng thương hiệu.
- 👕 **Mix & Match Outfit:** Phối đồ Streetwear, Casual, Minimalist, Y2K thời thượng.
- 🧼 **Bảo quản & Vệ sinh:** Hướng dẫn làm sạch, tẩy ố vàng, phân biệt giày chính hãng.
- 💰 **Gợi ý theo ngân sách & Mã giảm giá:** Tận dụng tối đa voucher **SOLE20** giảm 20%.

Bạn đang tìm kiếm phong cách giày nào hoặc cần tôi hỗ trợ điều gì ngay bây giờ không ạ?`;
    suggestedProductIds.push("nike-air-max-pulse", "adidas-samba-classic", "puma-rsx-retro");
    quickReplies = [
      "🧼 Cách vệ sinh không bị ố vàng?",
      "👟 So sánh AF1 và Stan Smith",
      "👕 Gợi ý phối đồ đi học",
      "💰 Giày hot dưới 2.5 triệu"
    ];
  }

  return { reply, suggestedProductIds, quickReplies };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Default Server Product Catalog
const SERVER_PRODUCTS = [
  {
    "id": "acc-crep-protect-cleaning-kit",
    "sku": "AC-CLN-19",
    "name": "Bộ Dụng Cụ Vệ Sinh Giày Chuyên Dụng K-Nicks Care",
    "brand": "Puma",
    "category": "Dụng cụ vệ sinh giày",
    "gender": "Unisex",
    "price": 350000,
    "originalPrice": 420000,
    "image": "data:image/jpeg;base64,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",
    "images": [
      "data:image/jpeg;base64,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"
    ],
    "rating": 4.9,
    "reviewsCount": 145,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 80,
    "colors": [
      {
        "name": "Bộ Tiêu Chuẩn",
        "hex": "#0F172A"
      }
    ],
    "shortDescription": "Bộ vệ sinh cao cấp cho mọi loại giày.",
    "description": "Bộ vệ sinh cao cấp gồm dung dịch tạo bọt 98% tự nhiên, bàn chải lông mềm cao cấp và khăn lau sợi microfiber.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554572",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "acc-nike-cushioned-socks",
    "sku": "AC-SCK-17",
    "name": "Bộ 3 Đôi Tất Cổ Cao Everyday Cushion",
    "brand": "Nike",
    "category": "Tất / Vớ",
    "gender": "Unisex",
    "price": 290000,
    "originalPrice": 290000,
    "image": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.9,
    "reviewsCount": 320,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      38,
      40,
      42
    ],
    "sizeStock": {
      "36": 20,
      "38": 30,
      "40": 30,
      "42": 20
    },
    "stockQuantity": 100,
    "colors": [
      {
        "name": "Trắng Tinh",
        "hex": "#FFFFFF"
      }
    ],
    "shortDescription": "Công nghệ Dri-FIT thấm hút mồ hôi tối đa.",
    "description": "Bộ tất dệt kim công nghệ Dri-FIT thấm hút mồ hôi tối đa, lớp đệm tăng cường dưới gót và bàn chân.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554443",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "acc-ortholite-insoles",
    "sku": "AC-INS-18",
    "name": "Lót Giày Thể Thao OrthoLite Siêu Êm",
    "brand": "Converse",
    "category": "Lót giày",
    "gender": "Unisex",
    "price": 180000,
    "originalPrice": 220000,
    "image": "data:image/jpeg;base64,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",
    "images": [
      "data:image/jpeg;base64,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"
    ],
    "rating": 4.8,
    "reviewsCount": 94,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "37": 10,
      "38": 15,
      "39": 15,
      "40": 15,
      "41": 15,
      "42": 10,
      "43": 10,
      "44": 10
    },
    "stockQuantity": 100,
    "colors": [
      {
        "name": "Neon Green",
        "hex": "#84CC16"
      }
    ],
    "shortDescription": "Lót giày bọt PU tế bào mở thoáng khí.",
    "description": "Lót giày bọt PU tế bào mở thoáng khí, hỗ trợ vòm bàn chân, khử mùi kháng khuẩn và mang lại cảm giác êm ái.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554558",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "acc-shoe-cleaning-brush",
    "sku": "AC-BRS-21",
    "name": "Bàn Chải Vệ Sinh Giày Chuyên Dụng Lông Mềm",
    "brand": "Puma",
    "category": "Dụng cụ vệ sinh giày",
    "gender": "Unisex",
    "price": 85000,
    "originalPrice": 110000,
    "image": "data:image/jpeg;base64,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",
    "images": [
      "data:image/jpeg;base64,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"
    ],
    "rating": 4.9,
    "reviewsCount": 87,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 100,
    "colors": [
      {
        "name": "Tr?ng Xám",
        "hex": "#94A3B8"
      }
    ],
    "shortDescription": "Bàn chải lông mềm cao cấp không làm xước da hay sờn vải.",
    "description": "Bàn chải chuyên dụng dùng cho vệ sinh sneaker, lông bàn chải nhân tạo mềm mại giúp làm sạch sâu vết bẩn trên mọi chất liệu da, vải canvas và mesh.",
    "status": "Đang bán",
    "isDeleted": null,
    "createdAt": "2026-09-02T14:24:58.0766667",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "acc-shoelaces-reflective-3m",
    "sku": "AC-SLC-16",
    "name": "Dây Giày Thể Thao Phản Quang 3M",
    "brand": "Nike",
    "category": "Dây giày",
    "gender": "Unisex",
    "price": 95000,
    "originalPrice": 120000,
    "image": "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.9,
    "reviewsCount": 168,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 100,
    "colors": [
      {
        "name": "Trắng Phản Quang",
        "hex": "#E2E8F0"
      }
    ],
    "shortDescription": "Dây dệt phản quang 3M siêu sáng ban đêm.",
    "description": "Dây giày dệt sợi phản quang 3M siêu sáng khi có ánh đèn chiếu rọi trong đêm, tăng thêm độ bắt mắt và an toàn.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554388",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "acc-waterproof-shoe-bag",
    "sku": "AC-BAG-20",
    "name": "Túi Đựng Giày Thể Thao Chống Nước",
    "brand": "Adidas",
    "category": "Túi đựng giày",
    "gender": "Unisex",
    "price": 220000,
    "originalPrice": 220000,
    "image": "data:image/jpeg;base64,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",
    "images": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAG/Ab8DASIAAhEBAxEB/8QAHgABAAEFAQEBAQAAAAAAAAAAAAQCBQYHCAMJAQr/xABjEAABAwIDAggGDAYNCQcDBQADAAIEBQYHEhMiIwEIFDIzQkNTFSRSYmNyERYxNGFzgoOSo8LSCSWTorKzFyE1QURFVJTD0+Lj8BgmUVVkcXSEkTZWdYGhwfJGV9FlhbHh8//EABoBAQEBAQEBAQAAAAAAAAAAAAACAwQBBQb/xAAlEQEBAQACAQMEAgMAAAAAAAAAAhIDEwEEESIUIzEyJDMFFVL/2gAMAwEAAhEDEQA/APqmiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgL84fcX6uXeNZxsZmDZG2bYtNBULkMHhPIkyfetPH1OHz3+Yg6aecY2ahCMYxnPe/ZVnmX3ZkD39ddID600a+SFzYw4t31IfPvO97kkuft8AQyWRRj+bWK8rp+d5KlVJXz1aP/RovD6/SsasJ4vB7B8QKJ/5SmOXl+zzg/8A/cWifzlfIB77HexmvUD5/wDxSUvZkvC9m7Py3+en++oXh9fGY54SP5mIlC4f+a4FIZjJhY/mYgUT+dsXx45Xhf3lRZ/zp/vqsM7Dd7N3UKuz1Kof76GH2IZi3ho//wCvKF/PWL1Zinh2/wBy96J/PWL46sPh+TdjvS6Iv/7gpLIltvf4pipXgeu9j/sIYfYkN/2RK6C7qMT/AJ0f/wCVMHc1uH6Cv013qymcP/uvjmyjDf0GMk313sY9SWUasM3jMaHvf/wrF5s632NbVKe/g3VQjP8AVMzhXvrifwbsjH/LXxx5LfnYYyM+XF/tqsP7Mg95TcVKO/47XYm04fY/P5iZ/gXyCgXbxoKU/Uo+JFOf8TXZwPsLJ6bxiOORQ/48fO9SpsP+vTZh9WUXzMh8eLjV0b2R1WxpM3J7r+RAf+resmhfhG8TqfwexX8K5fzlMO39BNvMeX0NRcIQfwnlDARrK/aAQez1NZ4H/WLP6F+EWwUqvAwc2PUIxH+5wBMA322L3Zjy6wRaVoXG8wHrrGcI7z4I3C/+UgeNZxS8XcM65wfiq+6Mf/dLYrQzJFFizok4erBlhMzyhP4HqUgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIIsmTHhxiy5ZWMEFj3vf5LF8VcZMa5184gVqvUgRpLpsw8rgcPgf7HBwP6P0nR6a+sHGOuaPbuDtykfNfFNUob6ZGcxm3qH2Pvr5ZPodHtyB4Lo9PBo9d5pT87/SP01nbSGq31i9Dv1Pa/Kf68Vn9I9QzTr86TwfofkGLOalLjj3fgenfTO/7axifOGPmUOkM+Q/769brC+denaSHs/5pRnzrs/1hk/51TzVWQ/mU+l/zViojVKoa3veEzT/2IH3EFt5ddn+tD/zpGSrw/wBYH/LsWfwIhJYdTUhZ/wDgmbH5ioMCoROzpb2f+Hg+4s9oYSydfH8olfTAq2VK9Mnvc/5ACy1k6of6noj/AF6YxeJqwQfSWnRH/Mv++tFse8M3gP8Ait/81Aq2XBcn+o3/AC4QFkMas6nSWfRPr2fbVZqrHG/UfZ8L5E2V99SLCy5roGz9xz/zJimMvG7GfxXK/mTFdQ1+n9J7V3/IqZ1W+uUvpPA84H/O/wBhBamX/cgP4rlfzJezMVKoDpxnZ8wdiuQa5Q38/wAPM9TQevbwrbfRkqlUB68ID0EMONMgf8Mf8s7/AOkU+NjpIZ/Gh/50xVhnWm/d+GGfPUh/9GpPgaz5278KW9vPLCdn2EHszHCQTn5z+voPXibE225X7pW3RD/HUVj0/Y1tOX0Y7eP57D5PsKh+DNHPnyUeFu+vGqH9tD5vE16Yfn6e06Ixn+zMPFIqw3jYY+g5bF/4a4H/ANIqH4GD7CHN9fluf7ajPwLmdQdR/MegzCj4qeDchKVdF3xdPuagB62Lb3G9xMoeTkuKl0ZB9SZC5Uxc9mwMrA9546z14StpsNbsgv3H6D2Ij2dz23+EJvuI9g6xULaq7PTAfFetz2Jx87JrmWPdNClQfZ4PfMEzJTPZ+L6T/pnXyo8HXxB6PXf5mvn/AFikhnXBFf8AjKhv3fX5L9sap5h9zbOxLsS/IvDJtK5oU3h9jbBwEynZ64+HbWV6g/8ASvhXb2KlyW/JZIpVcqIJI94zfZ8n9IuqsG/wh93UIsalYiC8PU3mPM/32Nn2/lrzaMPpaiwnDPFuxMWaCyv2RW2Tg+xvBe4YPD57Pd4Fmy0ZiIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIoc2ZHgxTTJROAIQDeQj/JYz3UHDPH2xPG644NmRJG5oYeUymMf+3rk/u/03riOpXPqP6RbCxapt2Ym3tVb0qUgjA1aaSWxjOoMhN2P8msAZZRGPfr5935iwt1cf4Y3JlyDv+M8xI1GkS36iz+j4eSKlJZkjvyLKvaxQ6Ox45e2ZZrarjWUQ7NRg8jOu96rk2lHAHYHtjWwpmmRjNPmdRWqfTZBAv0+egw9kQkFnkKMaUQnaK6zKVWJZt3DfkVYbRmdIQb0GNvlkG/rqhhCPWYe1Ivdoy2djdjQYkwhBvVbyam7WQmtkj+zVDLcJ/8ABiDG3jkDTUI/n7xZJ7XCZNPbzrxNbEhnZoLIzTHvGDXtu3s2xsU99Hybsg3qjwUTs0StTPFDP3ewr3TZdLIzfx2M02dRQ5NKkZFajAJERTP4E63xhZH5OzIPmbaySBWKHsD02ZPIz89aTfUpDPMUmNXCD6QiDfYarR3qYydRydGT89aHDcxB/wAIep8a6ifyhDbeoSU/pByD+prqs3JyM2Jh2efnWn4F8aG8087/AD1sKjy6Pd0NnJJjwSfIQSZkEj2ampTjs9MDIrI+hw879SOcDxv58B+x9AiuUygXJB6MfKmD67Hq2srMgEnTnDez19hTtaz1KxKXWc5DjhHePvg6BPprD6rhzMpz3kgyDsf0jAzPsPW1Ayo5OkGxXsIxzg7vJ5+dmdU9w05hli1iJg9dIa3QKpKp84D/AF2P9dnbsX1n4ufGIoGO9lR67yfgplVYckOTCe7nnGNhH6PeMyEZw+yvmjdth0usw35I+Q3SBDn5npGPU/ATGm+LONbeE9lko75g3z4/I6kbIc1S25XL9fs9QewNnR7A1pthfG+wa/fY4OD3VorBHGum3jUA0KoXYCfVJ8Z8sAdRj3h0+ezOxjOB7Ov7K3m33Fcck8n4ctx543oiItAREQEREBERAREQEREBERAREQEREBERAREQFqTjN3MW1MF7jlxmvdJmiZAjsHz+F5H8DOHh+h7K2w9fOrjuYy3jcd9S8Pw1TwDbNtmyH0ffc0+nz/MHvEPDXEms2/TYf44rAKc/yDH3n0FZPbxhmd+7qEqqP8iBFedaxZUqHTZLCMo7Dv68mpPzk+sV1jXHeFSZp0qHUXh/2OFkZ9MiydXhsX28Ut4Xw4Nt3qxnoaEf7itT4NPl7zwPf+8//S/7CxJ8HEyWzUZQ68d/ppuT9WntcxYJvItt/LNUHv8Atr3BtlTINDA/eUO9X+vSHv8AsKeGdZ492en14H/E0w7CfoLFY2HmPktjCD8FxWE9O/771PDhPj49n/aylxfn1GEbX4NYssefxh7Pjor2fYUlk60z9BXIT3+RnYrCzBbHQ+7PihSAs9d714m4vWLEt+/xgpDPkH++mDTKmDo7/wCGU78uxH0aOfoBgezy2PWEv4sWIhOfjJRPlxT/AH14/wCSviZ/BcWLef8AIOxMG5Zm+2If8nVD7fh9nps+WsM/yVMYH9BiBQTv9d6o/wAkbGgnT3JS3+pnV4NyzbwHT2PfrkZzPLVD7cp/ZkWEv4pOLgP48hfTT/JTxcAzU5YD+df2FGDTLTWrHJ0Y1GfZWfs1hJuL7jRF6Mk17PQylANYGPlK3n47yD+X9tMG2cmssatVSsAZN5p5FivtgxkofvqPUXsH5cJSY2Odcg7u46GCUzr+KvAowvaifYBB8zOrDPseoA3gxrPIGOljzt3Opeg/yGHzrLYFfw7r7GDiVADDE6jzoOfjUOqM6SO/6C8Xwagzs3/QXRRrVt8mSQPXJ8Sxj/tqHJtG1+3qEoHx0J61eufnnkM543/LV7t656hSpjJEEi2o/Dm16k/Ti3JS3vJ1HvyEWJVvBK6ILzEocPlrP9mezYQbUs+8YdwRmDeTIZZDJBHnM8bGx65jpT7wsOth8MUebFCR/Pex+mt923eMOqhZvGPf12LFb2mWxTybwGcL/M5iQIkynG2yZ2K8a48moMmf1FGefb6NSp41Ukd8P/Gdc/YnEqFsXzQcRKGTQrdJeTmfFv3jPPW+579hc/Y/SyMNAGDYNrjGj2/0bgwXxQrlpV6iHp0h7JLH+EqY97+e/nkB6hM72L6x2Ld1Kvu16ddNGLnj1APAT2PZ4PZY/rjf57OHg9hfFe2BjqNhmkAkaEyy6hpmN6A+2Mn5TOxd4cRHGoNQHw2ZLk8HBHrBXyIbOEn7QZTGb0bPX4GcJP8AfnXFwcn0/Nj/ALVzx38Pu7g4F+qhns5N4q19p8wREQEREBERAREQEREBERAREQEREBERAREQUE1OovkdiFR65jvipdt4ah6XSj1o42Scmc+mMmQeRnxbF9cXrj7G7B+fh1UKhX7Rjj8EV2oklkYxnvI5+fn9GR+dByTPoeFeDMMMiueNTCP02ByZzm/q1Z5+M0ydGZHsqhgpzOuaTkOT6Ch3m/lUmYS4BvlUqeYhHv7SL6Rj1rSsU6qWPJDyuZy2my/eUxnX9H66w5tt4bOZipiBnZnqkV7B9R8JmmvaTi3fj+ZIhA9SEsJpVVjyg9Jnerrp6i4t26o445FyNijiAT+PMnqRWKHJxGvw7N5ckr5DGfcUA0VQ3gWe+ReE9993x/3oqPyHsUY163x/3sqn01EXm8a03aMJ7L8vgf8A9WVH6bFWHE3EAD/+0hyfHMY/7Cs7xrxexNqwyf8AZbvwf8YRX+vCYq2Y24mA6CsAZ6kVixXJ8KoexOy3uGchx+xUB0lTin+OiqZ/lGYiZ9TTp/5F/wB9a6yfCmT4U3aMNrxuNDejOno8V/qTXs++rqHjX1jtLbe9nX3zH/YWkFRoK+62fS6KgcaG2527uC33g8vODP8Aq1cg4v4P1z39DpzPPNsfrGLmPQVGmn1NnS6iNauB93M5R7X6XKYTrhex/wCrWPVXi7YN1LOODy2nP8uMf+jXPb4oydmqwkmRH6kGZKi6nP0TPYtvqkdLdMni31Smvf7VcWGPf5EwGRW2Th5jxb+8iRwVcI+vTZu8+gtbxrjuyJ0F0VRn/NPV1gYlYiU3mXRKf8dtqPqTotPn3/cFKN4PvGnniv7mtwsmf5aksuOjv8YJSzwv9pgHfk+r3ayG3sfqpKjeC8Q6PFrcDy3s3ikms7Ae7pmpaN4HtCqyOxY/Iz6BFpHJD35ocauVzRZ4KuxkqN/JqkBj/wA8ahvPS9bllcsfkTyc+fRzZ/pqivYM4gW4/lAI8WthJzJMB+gRWF9wVigSeT1WPK1vIks0D/lOjItVabLt6KOdG/zZrjKuzyH7BGI+dM5TyOVHew3kPWH0qq0upP1NQ8KYTmPZsH/vFkhrnrkHJ4cjsqkAbPfIenZ67FzkrlMZsdItD4og8OXnRKOAb3mJUADyM663Yw8c8blkWQw0MjOmZ1Fpa+SEi3bAqjM7zAfqMybD1C1cOq1Sx63dVjjGB4a7Uxxzm2D5wAJn0/yi33hfaUiPjjY9AsioRaPGqVTptXlGefbZpy85BgZ184x5Plrm+1aHIeF9UiR/H4GoOoRn7BGD7zeLqrBVnKuMXhHI7QdOZt+j13r4l3/Kh2zH2H1IYq1QxVr9X4fCEREBERAREQEREBERAREQEREBERAREQEREBQajTYVVhmgTooTxjs0zMe3nsU5EHB3GA4uPtImPrEIb5tClv3Jcm8ik8h/9YuVa9bkigQzRyQ+W0Q/vqB/SMX2MqdLp9Yhnp1UiDlQ5TNMwStzsexcU488XiZZBjVyhjJKt6W/5cPzH/fQfPKvUCoWVo1ymyHzbelv3ElnSB9G/wC+r3Qb1hy2BHUh7ZOY9iz+5KAS1ZMkg6fy2jn9+wMm79Ju1pa9rSJZZvDlAkPlW9PfqRX9z6N65bh1cfM2owYzsYQBM7PLYqDAGRaroN3VCmv8VmbHXYs/o960eqsYOcPksknX6j1y3Dfb2NBUN4MiyGTB2NQatrxrNotr2Kh4FPeNRnc9HqHydUPApj2Kh6PEPJwL8UrTVGmgjZPhVGT4VJ01Rp5EHimT4V6r9ycCDxyfCmT4VJYNHjQRsnwqvJ8K9tNV6aCNp7aPAN7FM0000erxZ9/3JY8nUik5bA68CS/Yf/VrZEbFfDe6mcju203wmE6j2a4Fp/TVegJaRz2m+OG4/wBh3C+8QvkYeXgyK8e8fGz67PoLG6lh5iZY/jDIfhGAPmGjb9n0Fr17Bk562Fg5ip7VZ77frkz8VH6F5n7sJFtHN2MbjrWSj3HHZM1AD5K879OVGfzDek9G9QLwpQ33tAp49/yh4yMXRWIuDtDvylPuC3Bgi1XJqMMHozfGLnilVwcGtxh1mPkmU0/J9vnsWlw82rx1iEp180GRTY+TwsDkk17PR5NP6tbx4tFOGfjZWznf7IaTSwAzv7zTO/7bFqatnHcdw0GO8efQ1Km/P1F7U2qzKPQarelO1wVWu10BKW/WyECdhGaZPkZF+b9ZyRx+qfXiPfgfZRvB7Kr/AGuBaWwDxuFi3T5lLqULk1eoumOZwM4N2bP+3qM/6bbP3lufh/eX6fg549RG4fnLjHn28q0RFu8EREBERAREQEREBERAREQEREBERAREQEREBQqjBh1OGWBUI4TxTsyGCVmdj2f7lNRBxLxheLxMtZ5rntmNwyqE/g4OE8dnBnfD9fzPPXHdz24S2XydOGybQalu6hTX/rGd2vsscQpAXhONjxP4PYe1/BsOXIXGG4sIqcyReFi0/NTuF+pJp4mZ+EPnj8zzEHy6vaxCWrkrlvkfNoM9+4k+QTuDqzw6kRdD3Jb5LfNMkAp/KqbLYQdQpr2buUP760nfOHMi3Avuy3JnhG3jv08/bxfRn++uW4b8drrbF6zKVkGQmeN5D1siNKp9cDygBGMeufocvP8A21k9vXBIpUlhBk2PIWGHS2dJikAoBhq8U2sw65D5QAnyOuqJkUfU5iwarCj1JMDIoz0FKoRE8ChEX49ahpppqjUTUWQr01+rz1FWxB6IiI9VqpjFSqs/wKFK1Q9UPOqHkQHkUCV+8pLyKMZbwh0JxdcRhno7LTnE8Zpv54Fg3GosSPFqX7IlDkMA87N+xnXJzPtsWB2lXyWrckO4NR7GAfvsnXH2g1ubFe3CXjbYbgiSHnhxAcoewL94YHmeetu74W5MfeaWs+VcHIA0+skeOsVp44jH/wCyD2/uflFmGKMGoUq4bV0Kfr02AzQihZ/LyE6/zemp9KB7Z4EOl6ehDBpy2VWS9jJUXvFk9w8nPMjZN/AyDJFe/r+kYvzHpv5nNe327+xHwXvCnGy5ML6kGv2WNlUNST6lapoX/umB/TjZ54+z+LX0ssG/rcxKtSnXlaUzhk02pB4CDc/gyEb5j2dR/wAH/wDS+OdBsq4KHeYRwRvBTTnJLzhPsBBqfVvXRGDONU/A28qRJuq6qtItepTOGHMCILOAEbU2GHPw5+p+UX1P8f3ek+w4PWxHP9zw+lyKMGQKYAZwEYYRGZ2PZw5mPUlfoXyRERAREQEREBERAREQEREBERAREQEREBERAREQFRpj7v8A9FWiDlrjEcWHgr4Jd14cQRtm8OckymjH03s88gfP8xcDXPQ6pZ0+ZMiUvlUA+pHqlNexm33mwvs8ufuMJxa6fiDEk3PaUMIbjYzhe8XMHM/3/wCh6D44XzZ0O35Ptgtwjz29PfuH/wAlJ3D/AOjVkjSl0Ve1j1Sy5k/Qo72bfJ6nR5LNg39W9aZuGwIfJn3Jh6R74w+npT+ni/FrC4bRaug3BIo0xkgEj5C2jTarDrMPlAOf12LQkOcMjNTU6PnrKrbuORSpPSZ2LluG8NlyOkVtMp4Tx50ZkyJ2igSv3ljhaM/3V4v9xVmIoz3rQV5+BM/AvFUZ/gRq9lUo+f4EWQk5+BGLxz/AjHoJC9VFY9V5+BBKReDHjR79RHr0XkqF+vR4PIoz1W9UPWkDxf7q27xfr/HEn+0esyM4Sang9j/rALT71QGXIgyQzIpHgMB+ox7FcfBhcbdCXPY47DrzBjqB6vTasw8uFA2GDYQG3pv7xRn1WHc0Oj3QAj9E4OTsC/sCd2szs99PxttuiSD1Q9OmRD6jHsYx+ifmEHvOp11pzEKXcGF8yfafgcDI3hDl4ZO3qP1O0Yvn/wCvvj9T3x+jpj1XwxbOQyhkNuF7VKmw65ANDONjwk3Z87OesYptYGeAGZFJnYRZVSieLL6aLdNcRfHI5mSuL5fFQKar0JmpQJhn+/ab2bPXHwLsrh4PZXyFrgq3TJUe5rMlGgXNb7+VUmWLg2+F/aDX0l4vGONBx6w+iXhSvYDOHuKnD4fZzxZP7Xss9X3V1RXu+dcNrIiLRAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDR/GA4u9FxWppqtSxCi3IIe7NzWSuDyCf8As/qL5l4i4V3BaVemDiQ30utxH6ZoxmdP6N/319pFpnjBYAUfGOkvkxCDp9xxA+JTODr+jN/pYg+MNboA7nM+ZBj+D62Ddyoz37Bv8eWsSYcgDGjnG9jwP03sf1FvjF/DO57VuSTArFLPS69TejY9nP8A6wa0/VQe2rdvGyLcMRnzZh92sLhpteLSuORBNp6mx11nJiDlM5QDmEWiodSyGfHPsGA/TeF/UWwrVuPQ3Z9thFjhtFr3J9xQ3kUypDybxis5jqFpLzqjXUN5xqjXEvMLXLUTUUDX+HgVesmBMYRVsIoGsvTXUYE7Oq8/wKBrqvUUYap+f4FXn+BQGEVeovBMVCoz/Amf4EBUPIq8/wAC8X+6g8X+4vF/MXs/3F4v5i1ZNl8X68SW5dT6OeRkZP3jPI1x/wBYxdFYx2HDxGtLwwAeeSNmox/kE+4RcSa5AGDIiEyPA/UZk7xdn4CYm0++LeDHlbBibiaF/UJ/eLs47c3NDmOz6lIt+vGtus7ATv5j2dCTu1t2GfQewax7jM2ASgXIy6KbHeMMvdnyd53nyxs+rUa2654cogZGp4yDdnYouG3HbLXnzs3ZMjx7xj2Mz5CKjDLFescWnFeNelKjvPbdw7itU0PX3m8H8YzePH853ijU0hBv1OezJqKu4aNDrlNk0s+wGXvGPZ0jCD/xqKIsuH1Zte56Hd9vwbotypgn0upBZKiyRP8AZYQb/c4eBXtfMviVcZGXhHcb8JsRqoNluTj+zENqe8pD+0+IJ+Y9fS8RGEY0g38D2v8Ac4Wrphy3HW9URFogREQEREBERAREQEREBERAREQEREBERAREQEREBERBqLHvAC1McaFySoj4ItZB7wqLGbY/d2H/AOli+TuO+AV2Ye3Maj1yGeDUoPQSewMPvM/XYvt+tc4y4N2vjPahrer4NMzGP5HMb+08BPue4g+ClbgyK4blkUYx16AzxoP8tH99eNsVwZ8mQi6E4w/F9uTC+vPpcobIsmI/UDJ8sfmeYuda2DUjGrkSO+FPiP8AHQ5OePvGLO4G0YEvXjcjJz+orPP3axKm35MAxmppymeWzrq5PuePOZ73XM6tvZ8vTf0iMnK1GnD7Ma8XzvSItfmVFezJyxvl3D3irZOUDJ+Vf71XyhY8GcpLJyC9sOq2HVqZL2E1/h4Eerxr/DwL2YdWRktezJSKXhh1XqK2slqth15hptctRNRQ8/wKvP8AAmGapeT1WqF6PE3urKsKL7JY95xpBCZIE94wSvM7snyFir1DMzUYrRT6EXnR6XiTYcnPt6jNN72dTuyfNkXG1HPMsC7TUOsD0GZ+TnZ6Rba4tOMWcPtPuOQ85gcx/fA/sK5cZPC6PUaIy+Lc23xGbeTnvB98a2v7kMY+3az03fv2NsI1PMTlfmbex8YsPwoubwzQTU85Ga0Tr+jWSMIRhtPT66wdLG7zt+RUozKxBGzwlE1MjOzf3g/nF2nxHeMj7cqRFwwuepvJMBF1KNLNw7ZwD2Hgf6Qa5QNpsmMJtvYTdnD5Y1YYFRqGFGItNuyjk0GHlDnxX592yWP+vHnYtOO0ckPsqitVBqXhiiU6raHCLl0YMnJ5Gdns/wDurqupxCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICodzFWiDW2MGCdnYxW6Wk3FD4ByGBeOLMYzeR/Z/wD5Z5i+VvGY4rdz4UP5HWOhPqclmMZsG+X1/i19mHrH7zse1cQrekWveNHBU6bK4PYIE3B/6+sg/nWqW8fp+D2QpI+Z3ZlAh1wY+fnZ67MmdfRPjQfgzbgotN5ZgRFnXPDI/fQ5Rh8rjfCPmMeuAbktisWrWDW/ccMz5MB+m+NJ2HxSD6Qb1ngeLKrHP0ZNtXilWVXLgjMqAx6EMnMN5ayTBzBIdzyWXZWI7/Ag3+Kw3/won9QuimW/DYz3v0ai20uWjYV1D/WEpQJlh3JTegmPf5j2LqiTQ4b948bFZKrbIz9ANZqcuvnVilbuq0t+QfXYrlDqUeWxhASGPYt0ybDHOYYgBve8flrSGJ1hzLHMyuQRvBGOfTMzs2EXv9i1y5Vk7ROV+kWExrjI9jM49tSfbAxRh5tmbJfpF7MlLBvbHp+epIbqH/J3pg2zZktSWS1hgbqh9fOxTw3BSyfwhn08iYXtlQZamMlrGI06OfeMIpjJaDIdf4eBUZ1bWHUlhFAkvUZ/uKvUXmgpgVGoUOqxqxTiZJMR+ox/+Oou5MIrth4o2MYYxgGY4NRjPIJ3a4YN7i2XxeL/APaVdr6eeRkjVJ49DP3/APbW0Wi4KrTf2HcUXwyDf4KO8n5Pu/m/6tbXNz+Uamuwm8Y/y1knGHw9j33ZhrsocfxkGnIPsbxhNPpP8ejWpcJbq8K0p9p1HcT4G7ZnV3Bw2yRhM8lZfQsIqvjXwBsSgj8YPKjnfJfzIQGHZnf9DOsKZqANtrtbiM2twx6JcF6G4GcL58gcAOz7G7Htv/8AV/BwfIUR+V26kgQRQIkeGHh4MgAjA3/cz9pTERdXhxCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIi8nlGzgdnfl4GoPVFo7E3jj8X3Clzo1w33HnT2cH7cCj+On/AOjFqzDvj5Mxkvklr4X4V1VlLgi4ZNRrlYOwbI7PY9geUAs/sve/9rJwvZ7j0HYioeuQsS8XcS+GDUy0u/zUHJFe9kkIAPZG2Ok3jFzVQbOxExItCk3BjRxg7+rUyoxeXzYEauvhQYQ39huMmo/bQfSq58SbAs5vCa7L1odH4GfvzZowO4P/ACfwrk3jKP4o2M1uSbppkSiXfccg3IGVSlSnsePhH3xB9Jk8hciSeJPaALvDW5dw1So290h4z2MfKf6PlXSZPrFtqpDpdOhho9DpYIVNgMGMMMLMgwj7vIoGPMiR6aEMMEdgGAZydjGMyDYNQ5jNALyKebbWJXPVeSMZ6NStbalVRje9Q4dZH0hFiRqrqVI0f/mGKtkrUCYfeLO2kNu0GmjO9/XesDx9st9Yw4ucgRszQYXL2euAmf8AV6i2Rh6flUYJO8ZqK/VihjlwKxDJzJdPINVxlvmDJpVQivfqR3+vkUNmp3izPxyJ4uQeR4N29nkEVDwDP76hhP67FuwYr7BO8XsEcw5mRwDed5N2xjOerxJo8PsBvB+etqYA4ejqNSk3AfOYINwDOztO0Is7aQs9sYNVCWxhLgI/P3IfvrPI2AsN4dTweuh6baUOnBZu1dWAjj7NYNHLsnAGOzmDez1DvVkmYV3BTfeNYOzT6htti6oqpI8EJpDyKHSosOqvYPTYnsOQpk64LYfp3BT9yTmGDzHqZDueGdnSba6fxFwZp9z2xMp/J2M1GajH+k7NcPPJIo0k0OXsSQP0zs9IvcPNtqBqscnaKSw439GRauDWVPjVwnUIowvbY6jyRrFY1fkD/hP0Fcg1+R3bHpg27J4s2MRLggGt+uEzz4DNvO/ph94sJx1w9kYbX/AvS2Pe0vUkBfk6f0D/AD1z9RLnqlv1iHXKMRjJkB+oDJ1+8G/zCcxdyUeVQ+MThQal8oezlYdSK83SRT//AOi2hjcdbWL50eqwIFwRPectnKPUX0+wBtdtoYRW1THB4GGJDZNM3g7w+3w/pr5g8XKh1C47zDg3c42RZgK6OJKY/mMHqbzJ8YNfYFnsMZps6qRHtaua3qiIt2IiIgIiICIiAiIgIiICIiAiIgIiICIiAiKNJkjijeeQRoxDZneR/DsNQSVDn1GHTIhZ8+QONGAzO8xn5GM4PhXKePf4RDCPCyaW1bJYS+Loz6WhT+HxQL/PN1/UHn4VyTes7jKcZM3hjGy8H2paRH6gaDGfk3fZ+K/0h/oIOpcavwjOGtn1J9n4TU8993M9+mPhi/tQRk/0cL+kJ82z2PPXJ2J1/wDGYxbMweL+Jkq1IEvUIy3qbnZu/TgAdn1hH+opkCJY+G1NfT7Ko7IryM3882/lG+X/AFawZ8HEDF+/30u0aHKq8/Q5gX5BsH5+p0Y0HRuCHEwwzo9HZcF/0P2wzKkDcQ6qxmhFGTtNAe7z9fecxbOgW/Y+Dtnvte1bbhW1Dj6ks72fwomntnO/pCP0+8VeG7yYa2rbeH943Yer1vQ05Ul+2OEQnRxM/kdRZPe1l0e9bbn2vc8N8qBUgkA/I/I/edpnUbW4qn3rXMd6x+LY8qFZIJRAbb8hK6fz/QM7Rn94trwCWeClMo9SmTQPGfUe94Xgzk7zPk7NZ5ZmCVh2PADT3jPKfEBoAeZ+wwfmMWQzLftN8Z8eJR4TGeRos6NZ/wBY54qVDHSobJFpXQxmgDTY9jMmcfrj+n9YrlZILsvWM/wzS2AgdIwxmb8xNjmMH1Oft9fdrZFSwMsusSQ1QFLfCmAfqP5Md4GG9GRnaMWf2NbENkx45Y2csAzUZ5D02YYGbi50/kHKCVQ4JJGdTqLlrG+yrssN7yVKO88Aj9Nk9nM1O7f3b13bWH3p7eabHg0/Pbz2EIczH88/dvZ9B6h3nasOuBfDPDBKYfUHKCZmdkoen2i0Q+U3hj8askEJ6B6uoalp9otzY38VCoW/JNcGHMPWhj3kqldpF+If2g/MWiqVblyVGpMpcGhzeUkfp5HhezJ66ztpt0bg5LGegwyeZprbsanElcsIMb93FH+s/sLDMJbD9rlKh0s5BypI2LZ1YGOjQORskZJh94/u9NX/AFvHzNxsofgPFe54YNgPLeUM7vebawbUkRfPW+8frAxMl3bXr4qtpnHQRnHHZMY9jwMBsaefu9Ty1pnQ0GPefItEPGleFKzMjUuDT3vmS36YWeWu28K8PI9v0SHT2Dz6DNt+Tnk7RYHxb8CJgA+2y4I+Q0sHisZ/SBB9966fDRx0oPkP8jyFncLhZHgyM09PYVnqumD6Cyc2mPpCLCb2qsMEN+8yL17bA7wqvixh6nUUmz6lnmB0+0ZqLAK9WBnmMHqbCuVmVwbJkYep0eoNFy6lgUrl1Efp5M+guG+M5hlS7YxRk1Akc4I10RR1YBmcxhOYcf5Rmf5a7ww6ljnQGR+fqMWseNjhzMquG8m5KbT+VTLMfyjzzRO0H82Pb+bXkIt8/farTz9BWPpp7VawPPoSAPYNZO+o2mfPy6GeK8jx8xVsptnyugrjGGI/mPemGbD/AByC/TnR3s+QpIa/TwdIR/0FlprVqESMwg6x0j9hjOYrVGodcqvTx36I/LYzUTDTaMy56OTd7/eeYuiuKpi2SDUpNn6eQPvuK9/xm8XPf7HMjlhqewb2eRt89bIwWsCuUPEiMPlBwGyEH6TqdRMG3XV525oY/WBelD3BroOCAfR65xkY8ZPX086+oLFxXhngPe9xYjWLWrqgEBb9lE8MvkyODISZP0+EIAMZ1xszke8nD6P5HajeYtGatERAREQEREBERAREQEREBERAREQEREBUO5itVy3NQLRosm4LnrUWmU2KzOeXJNkGPgXD+K3HgvvE+pycPOKZbc6U/g3cm5JLNAYx+WPX3Y/XJt+jQdGY88ajCvi+015bsq/La2RnsxaJD25ZuH+jZ8L1wjeuJ/GX44Ek3Kp77Kw3I/mMfoAMP9ZLf9Wptq4GWvR6w+7MVKx7crnJv3vmPeeKEnznTv8AX/JrJ7huORKzj1Nz1GIMesyw8N8Mo3+bNDY+sDZ+7ExjHyvkd382rbXqxIqUkxHyHvVZpZFajM1H6hPz0GN3PKGyGaQfs111xRbfj0PB+lVT2vyqfUq6c8uVJkhyPlbx+mRnmaenp/lPSLWnF7wdtvEqpTLku4bJVKosoY2U3PuzH5+/8zmbC6luSDWD+DZFvzNBlNPrvjMYzJKHp9H/AI8hBj11WPT6/WIFwHyPfA1NybbiPJ2Z3s7R41arYqV6DnzLfu225WiN+pFqUZm4ePs+k66zaNOjzo3KIuR7Oux/UVBjyBw9QFPPKMPsWc/6xQLDPgw50Y0OcPOEnP8A7D/LWk34JXYC9uT2xeE1lKHFJLZMknewmp2YPSPeto03Ean1m5H2vEt+r8vAwhHh5FzBj7T0ayqGel1mMyRFIw7PMz/0izv5ri2twy74sczI9/x3npR+ZVfIJ3Z9P9NZbTalHlXDSuQkf3mdjM+Qen5ayqlVWPyn2vnyHYcBCMCb5CmZIcELxwYYAaj+ZGYxmciRwvdo0nbfpjVkqT+SMfqc/wAtXWezQZsEY83SPD5awC6rg2Hk1PXz89bs1quedHIzTOTo1gzCUOVPfy6OB7ydd/XVquq6tNjx6i1LW7/8FT9QZNjzFnY6TpsSnxPGADAzz2dRYrPPHl1g3K8/P6byyeusJw3vgl4z/B4CP0YjNSU/yBrPzRJFZh+C9TksbqZGM2P6RY20hcqrYFHrlHn0OdD14FWikgSg58mcZB/VrmkPFQHhzeHhCUN9y0okrUousBmRn/Fanbs/Jro20q5XLHqTKPeo+W0Q/Q1gPMCQnZnZ0g/X6NbXfR4c6G/OMcqHL5ndmGkWu3P1sWldB3vJWbkYBhDkyMjdQfZ7a2EywPCIf+1lQO8fMe9jH/YVtxLpVUw2ohrotm26vdcMHTwID2MlBH3m8yan6xauw640NcvysSaXbmFcp4YDNSUZ8p+oz8xe7RDaNYwguR8Z46bVAHf6i5sxjw8xgtzxglHlVSlEeTxmHCe/J648n567DtW+6XUocbwxR6pSJh2bDJgPq2PWyIcSHUqPyM8d+7ft52LWC3x515hzGGTOx4+ex/UUmmy5lOmBkMJ0ZhkX07vDi/Yd4jZ/bHbcWU8epkk8yWz58e8XMGLXEiui3HvqmGtQfVwj/i2YdjD/ACDk3ZPl5F4vbJ8ELjGfRGOR1+v3a38+jR6xSqrHJthO/TyP+L3n6a5pwNw5vihsje2a25sKSPnsN/d7tdS0cGnGNqdofY89as3yFuqh1CLclYoYKW+KyBNODRe/O9mmR7FGh4cyKk9hDjYxnXzroTjA0qPRsb7tjjH0k0ctnz4GH+2sMzjI/T6iIY9TcOaHSoz5Bxvfp9fOo0CCM8OZWJcyUCHE3YWMVyuqsj5NyMHM6NWQ07JRw0sch7NN+o/4se2gx6sVi4LVqsOZBuCqMeQHTBfzPU1Ouvr3+D/Dh9emDjr4p9DoT63MqZeCo8IYpM8QjNgbM5+F5OZt/tbHskf8K+T7ADqsYwzjY/U3j2P6ndr6H/gjy8EShX/b/DNe/Q4aZLGzh8gnDKHn+oUWPoTwjY/nj/6r0RFfgEREBERAREQEREBERAREQEREBEVD+HIxAz/AtIcYvjVYecXql5atL4KjcchnswqLGfvyee/yGLAOM1xxQWFN/Y1whBw3DfMvh4YvsRR6w4T/AOs/MZ11zrZmFfgCqvvy/Ko+4b2l7w8ySfXZFITpMnn+f+TQUXbExAx3nhuTjE1io8mJpyItpU1+gCEMnRjf5/1npFk8Oqw7cpTKHblPi0umgZpsjQ2ZBq1GrBD1Wf5as8w786CZPrJCPeR5M+orIY+deL3kz9IvHedmgrN7q9qJbNYvWvRrXt+GQ8+e/TZ5neEf5i9qbQ6pXJ8Oj0OO+VPnv0wBZ3i7Dwuwno+GtNeODkPUj+/ZhtvOTu2d2xBhl+S6PxbMCvCFv0edUTULf54wHvPUJZOkz6fl8xbCsa7o992lSrogw50Ll8UZHw5gXgPFJ3b2EWTvAN8Z4z8wjNN7H9dQw0OnwX+IjYDY09ju0GGBsOl0q7alfEGZVGGnxRgNA5V4iwg+0yK8MPt9Jk9fYV15KTW1H7axv2oxx3U+4KlVDngEi6Hg17Nwwnf94oE9gBgmcsHsSeje/tHjUl8Sj1k341hsfPGz34HcPf6PdrxZbmTxih3A/k3R8mmM18ny+kVcahjBUvCnLDvNoaD2BfuOkVh4Ho4J/hTkeSSNnJ9Z79vTVZtRgeWHjve8jOh7Rez/ABt/SZw+YqHvkAeYkrQYzOPQYxnMGgtVwkJFDJkRRg5Zo7GdaZxCljGzU1Ca2TT9dbRuE4wPkyNTbOwf1a0DiFVR77eINS3DWPGXx+otV3PO1OYRZbdUscoJtMmQw37CxWwLcJiViLTbTIN74xDak3zADHnJ9z5wagdD8XKy49s2AGsViP4zcj+XvY/qA7Af2/nFm1bqsizn+GAQ3zaP0h2Z9+H1O8WSeAybnTp73xgbvkweoP1FfqVTqfUafvBsOwe7Ox/UJ3b1hbSEaiSrfu2iBrFuTATYZ2aewz6t7F7UGgVSjsNDo0iVyAj9RkN/RxfiH9IrOGyqxZU9kyx9CKw7x60OS/caazzwzUBvZkHCG/pOY96RDRangGN+8I87+ux5lMh0qn9SngY8nXyZFZ7ks4d41uBcFVqk0BoDCD5NDlHixZXx4xv3iv1t2la8GMyPUo81+nzJjKgfUZ668GVUeuR4Lw0+qkYxhN3Cz953bO8U8xNjUOR/M5ije1G3x8m8XPKfENygBpJs5GE08mx9NSZPjT3jBoZx9R7928i343OoeAgAs0O0Xi8Yzs0zqGyuaEzwfOjvimI/YYbmG9R/aKZr+j21oMen25T8/R+uzOvHQ5Izk/0Hq/Sd4rDcPLAMYQCD578bSpch4yc8Zx7mfRabIY/y928BP0Fq6sShxDMIAnSLbvH2g8hvCxro5jDhn017/P1GHZ+mdc8VWcTYz/IQJk7XftqMbfvYPr59P5vtF4xtMj9R5FXD2zamp6NBPZywc8I4PPPu/wCrX0W/Bngj0e7btGHdhn0wEQPpBwX8/wDKSzrgqz6VUKlP1IMfPJHpx4ufvydH9Dnr6C8SsEOgYm02lwSeLeDzxA+fu8/2FFr4/wBHezFWqGKtX4QIiICIiAiIgIiICIiAiIgIiIPIphjG9738DOBnWd7i4g4w/G5r95Vg2EHFzPrk5lTuERMjAM8wnUZ6T6C9eNfjfcF+XSXi/YTzPF3s4QXFVGP/AGhs4dggPU/b9j2eu/Y6nCsTtih2/YFK9r9Dj9G/fGfzzE7x71AgWHhdR8NYb5AM8qsS2eOzzc9/o2d2xXKqzo7GP1OZkVyDOHKzj2GLD7wljBGePU6isYlGna8+TI7x69pJxqyQz7DFJ19RB7MAR71MjQRsfqE239RnlrxDLjxd4cmTT6i3xgnhzUIMmNfl3UOUx/8AF8PRzkD6R7PL7tBk+DmENYtWiSbwqUf/ADkls0ww37HJQffJ+rU++bSxsrNBfHty7AUieeUMfiz2M0Qam8yPIzeE6i2KyqxwM1Dx5sXz3xX6amRjx5wXkizIUrzEGpaPh5clH0SVzECqMeP+WPefW+WRZmGDb5M8PlD2SeoYM1+R/qLKnsIxj484b4ofI57OkUB9s0OczUAOKB/UkhAzOwneM9IoFtfSiAC/klUlPMPmMmPzsevF86RuRzqPNivJzHsZnY9SWDqkEzIc4b5rOpMCzn+v3b0tiuR6q+ZHi6xAxD6DzZNh5FYjW8eqAlTIc6GfITTIwz2ZM/qfmKZJ37+TsJ66kySbfJwdN33kKiSORECzwUMD3kePPrP/AMeegh6EOcE0eLI0+SHHn0dh/lqNVTjyaamVIhORvHBkAG/r52Z2LErkrOgx+8QYfe1cyMePUXOV83Bqaw9RZ/f9zbZlz3dVwa5jbxBjFyVH+DjIugeKpZQ6PbcnEipQ/Ga6/kkLOzsB5+Z65P1Y1oqwLDqmK97Rrbp3M98VA3cxNjUJ+eu/KbTqfBDGp9Kpfi0BmgEOTY00EOlAmHNyg5NPyNhW2iYc1C3LnuS6KbVM8m5ZpKtNY/YYYnM5nqMYq58XEiDf9K9qtPhAtgdP/GjJ+2SbLIR+7Bt7jTH2nXWwqaOPOD0egYfTMfz2LIW21bgod1MNyGQDWiP05QeuxUX5FJSrYqVyUMfLZ8CKQjIATMY+V6Mfnq9vt+OPPI5Oxj8nP0FZIxKfrPHyiLrD6mdmdUt7U20bsPTYFQ8HxXvPFGeVGZK6EhB9GpL6bclSCaHEo82nScmw8wd39NT4YyM3gM4+k22LJ4FRJUoeocjM492/IgoY8gIzCHGzPk09jvFGz6GQYxveYj9t+RSTb8zx9SOvGMchwvIQbwPGYgNvrq0Ixogzxg0skeKSHn2wv7vTfzPP1FG5CSI/xGRyoPcm6T6f31PCAgGPHyg59R+pt9T0aofu0Fq8Kw874584zD54X7BP7xWetv8ASK63DEHWIfIyEyPH0Js/QkWvX3P4RpT5D9iTE8XMHyCD2CfWIOW+PJSAXTZZDj4SDmW/qVYPzbN4P6D3rh2Nc2vGZDlZNxzHrtjjCXAM9vVjXJsTwHj/ADYx7xfPeGfTCwb0Gc+EvFjEH5C9qaeZOnhp9NjvPJkPGNjPSLFYc4m3H0863Bg5av4nk3pO3D5b/BlP8wfbn+b6NBtfBy2OS1XpNfwaEks5vLOTYHk+gddY8W2WOLjLZg+Dt+Vkf84NaNw3ofIbSjE5PkNWn8r9QfMAP8mto4M1jkOPFnvZzPCA4/6bFk6sfB9KOD3F+qhirWvhyiIiAiIgIiICIiAiIgIiIC5243GO0nCy2A21anDqXZc/sx4PAznhHw8OR5PY+D/8+Quhnr573fUYd/Y0XVihIIM7I5vBNJZz9Fgx5NT/AB3hEEOwLOh4e0p+uN56rPZr1CS9+cjz/cR5yHkmJ1FPn1UnJnkl7ax5kvnoLq+WQbN2sGvmq7lg1e5lRHkWvbwqWuYI9RBRGOTIshtW1bovWf4LtWlnnSevk6MI/Pf2ayHBzCCqX/o1SpSDwre65mc+V6MH312TZlnUe1aUyn0Ongp0PuQs/wAaj/PQa3wr4uFHs4zK5c8wFXqo+gZk8Ui+p3j/AD/q1uwLNN7N2zITz0ZEHovjnj7HmddV9IwOmQ4PM5n5RACTphgI9jyP8h/SK2zKbSyRmElDfykjxgfMjMyEeTvN2rkYmg9ni736j+ezqeuqGMyM98Pf5D3oLawlwUpj8+nVAg6/MekOXT6rnJTZGgYfTh7T6CkyWcr0ScoODQNqbl/P9GodYiUuVJh643smHfpxTMY/UZpj8tBM1yZ9Mmw9eMw/JN3sZyPUNkGsAZyfwgCVG6msDefGZ1DfqEC+Q8e2B+nKZ+YgksISDuyD+Wo0l8ejQ5lQPIlHZLNqPZz9HmM02M8hXLnxlZ5Mvku7JzMgx5EFqqr48V8mQwbGST7t7/L01qW+bjyZ94swvCuDAHdk/PXOWIt3DGx/jHU8tBhl/wBxkI/TGTbWn58okszxgzverxWJXhLPVKkTQh5+v0j1Xh7atcxUvmlYf0OPyWHPNqSjdoyIPpyfk/rHjQdM8VTDUdv2G++J2fwldHQbHQxBk3eT1+et/UqDI6TUfn9Re1Kt+QCMyHBjshQ4DBx4rHv2NMfR5GfFqTMtysVKpBmRLomxYwwaZocZjOk7zvEHtoSOjPIf5mwvF9GjkrAa48krlgGc/Xf+gpL7cjnZp+2SvAMPtmTdtUGle1xjB3BIeeN1J+fd/L7tQJjKlIZn8YZk8jIrDb1j23b91V69AW/C5TcrIg5TAg7Mef8ATz7z4tX7Uh7e8fvPL214wwVR5nx2Uth+0Y+G/nj89iLT2W5adRY+ZSuVQn9dkY+Qf0FJpVDp9uRpnIdfxuVyt+d+cjyKBTYNwQa3GI+ODwaQJOVPe/fsJ2ewrxMJvviOerQjSRzAQNSDHAeTn7Z+Qb/8ba9jM12eQ/Oq2MGSTygFQfkGwkd4WP3fU6nloEhD627ex436e+2M/pEHi/3VAkv01MkvVhqs7QZqILbW6loMfvFo25J0gFerdPi5MlSYOWzzNTpPrGPf84szu24xxIxpBCLSGKN1R6VGk0/UyVI4fGjMfn5EDUQaBxsr/hU0mOAniGTkkL4vtCfLJ+rXJxqGQcl8fU6N+mt33PUvCNVNI5kYfP8AMGPo1paSeRKqUkmnkeQ5CIKI0GYCSwYCZDEfseeRddWxao5fgSz2Z+QDi8kf/wAIDpyeuQmwtCYUW5UK5PDWKwPQo8B/KOUmZz8nkLsCyaNMpsaTUJ0fJPqXMD14oB9GN6wtvxwzDU04b5DMm7ZsZFMwWHyrGmzP/FAKyVI+SmsjjJtkfqLJ+LYDlWOVpejm6n1b1Eflt+H0x4PcX6qG8xVrqcQiIgIiICIiAiIgIiICIiDGMQq1w25ZdarfBw8GeJDIRnr9T/1Xy+sm6va5cMyz6wTYJNINj/IPqZx/lBvGvoBxrLgHRsLyU/g6WrShgH/vZvPsL523tbnhkPLIn7pD3ex23+P7tQ2hsu6p3JYwYfXI/UWMGrgwM3hFhMC9ahWaayPOI88+mhJn7x41j0+7c7+kVsWeT7j2N3z1nOC2CVQxbqobkrkc4LYiP6/8NIPs2eZ3j1q7ByzpmLd8xrf3/g2Pv6pJYzoQd3n8snMGvo1SoI6PGhx6BHZFh00HJwhCzdsH3b0F1oNDp8ELBxBs3G7AxjN2EfmK8G1B8HKGR9d/R+QsbjVLfPHKhnpZvLC/OB/y1e4ZycmZqb/z2baCSwGm95OuRi8Tbt7IbI+dhOe/PzP6xV8uH0bPoKh50Dkg2M0+fp9d68XvHKyE1HseB/01W96o570B49T114s5RkfrjYz7Y1W/T7ReJpccDOzf8tAZywk/djBybQ2+81FDZ+70kbNsJGbfn7v/AB9NV68g/M1GM+h+eozDjA944JNeT0ednRsQUU0mnTflqw3DLjkDpj56usk46bTWR2c/rrV123ByUL8hPz0Gvb8ufQjGzk2xvXN921UdSe+oTve3YM8tbIv+ucukvJ2I2b9aNrdR1zcsITJ3DPIH99BZ6lLJLmcolaesN+mzPzA+ouxuJbhz4Hs+TiROH4/dG7i95yAZPtkZn/JrlHDqx6hipf8ASrHp2fxt/jRmfwaIPpCf47R419L4FuU+DTY0OmyH06m00IxhDGYzYGMe7H+TQXiMSZ0jKWfmeWxTNcb3+PUuUx+fn5OZ+TUCNSiEZqeGDMZk1NZ7GbC9jArgw6lKqgJXkawEEnxOWZgxzAPN1OU9IqH03QYaOffhybbDMzqt8uRosHVaO/Jk28m2o0k4+RmJSpmTUZ0Jn5xoLDbFpVSjMMSmzDyqad4yRYDw9D6jyfoKfMrMOjhZUJWozb8jbZ3iyoMrQyR5Q+Sv6j2dGpJmdoQefTZ11GBAz7nf8wm8fkUN8sdNYaoS47z6DOYFmd71PmbtjOv2j2KNJg6YdTnv66sVyYpABkjp2gwxNQjNjJvO8em8YFmvkz9fJ0agP3cmMQ8h72AfqZGP5/PZt94pkw48moMmwggTzjYsAuqsaYXrJ6xO02PWpbnqPhKT4P1Ngj9vzBoMJvOuEghZXJQ2P093Cjd9L7P5C5mxOuP3zT9TXeR+pKMztifc7tbXxLu7XfMmDJsA1IkJjOp3hPsLmy5KqQEwxNPPps2GeWRQMMuE+h4mPs3653/qxrHsOrKHfF7GHOIcFKjvJLqD2c/T1OgZ6R6uRotQqsnwfFE88w+oRjPLW4MOrA8DMDa9NkfjKWzlFTmZOgB2ny+7Xl2uIZtZlKj1KqsqDKeBlKorxx4rGM3Dzj7NnmA/Waiz8x+Qxnk7Ym7Yx6oZTYcFkOhwY/JY0AGnkUB5yVWpcof0I+Yua3bEPaYTUe/0YNNbO4pcUh8eLe9Hrk+oetS588YxO8W++JVSiS8UTVzqU2EQbPjCf3a84/3Rf6u/0VDFWu5xCIiAiIgIiICIiAiIgIi/OH3EHKHHnrD4g7SgDJs6x5XC3/T7GRcm3DqAns0NhdJceWQQt2UGPwfwen8L/pk/u1znPGM8aHMJ5H6tYW2hitz2xInZLgtzOCsR948LP4V/bWujUMlxmje1wbIs+WYcc8N+wxhCEyajFuCS+QM2oxYxdVseHDPrFGHkquTUMxmxrf21G2lw7bsay7bsC1YFHs6GAEAG7eZjNsx+0IQnlrPKPVSdmT+2uM8EONXMtwzLXvsmcI/F85mZ935/311jRJ1HuOAyqWjVAPYfmRnv5/qPW8WwuGeBPHJ0g8mozTe8Owj6dDO/U3Gf4nIT6Y1j0CWSK/k86O8D/IerkGWTvFaE9kGYPOQcyVkJ1NfX7T0iaczvGZ/iHs/VqthybHXXtrkegh+OMfu9Dn6e2d/zao19Pnx4r2fHqe8/rrx1+z00EblZCbvkdOZ5ef6xNSqep5gQekXtr92qHkJ6nqIIz4Ou/UPr5/TPVEnTYzTHkz+YxexpeRislSnbD94gs9w1XTY8mptrSF4VIh3mH3fPWc3VXNh+nn3fPf2bFoq86lnYaHFI9geu/Pz0GAXbVeXa2QfiYPriLUVYOR79PrrObwqO50+Z6izniu4Mx7xqRsRLgp/KodJlfiuN2co4+0f5jNj5xBvXii4Q+0uzPbRWaXoXDXQah3vZvAg54wfoPIuh2AmDezTIBjMhM+wvGlU3kkZkcm/1NTO/0naK5buCEIxjezb02MZtoBhk1mddhGbb3vTdgyR9vfs8hewRjAx5AbGvvH5+uRIzJBHvI+Qx4SdAxjOZu/8A5oEOLyWMyPE5gGabGP21Q+DHlMZ4SGx5snP8tVvHqPDHJDe9nSZ+ozTXsbUHGeQA85hs2GPfsPQWqMyZybUpUxkqNnIPRMvZkqZFfpghnZ6E22xTw6mRmvsPybaQ2EGzTPI1+kzv5hHoLVMeOXJZDl5wdGRhupqKuNOkAMal1HpvLZ0b/SMUwPI65TdTk5GBls2NZmR7Fjcmok8CBqh9iTEOMfzZNjTQXieyPkePTydm9YrUuWRc5IsjI/8AMer3MleLamosYqVVyM2CILDXrg12Pjk3EnJtsf8AYWnLtr5IlKfIBsTKm/kgPi+8WW3tO5VuwSMhs+wtLYnVzQkvjvJ+5oBx2MZ3hOk+rQalxCrg2a0cZNyBmmFa6o9sVS8XySAyRYAN5Knm6AP9Y/zFnka0iXMZ9cuCQenW8B+2btJRO4B3nrqex9QvGeG17KpYKdSqbu9hm4p/pPTnIs7XEMbtWzo8GpPpdsD5bUiM25MlmxCB5/8ARsW5rYt+n25AfHBqHknf41MN0hiLxpVDpdsQGUOjjyM6R5u0MTvCK6hJkDvOz565nVhDqUvTZMIzn9GoEbcQ5JGc/o2KiYfYYMnaP1FQbd01gx887yKFq4zx8meuvOJRbPDFAeqcA/2zv1Hrj2AyRVaxDodNG98mW/mM6i+l+CFjjse2oFP098Rmo9dPDDHmttFvMVaoYq1u5RERAREQEREBERAREQFQ9Vr8dzeFDw4h45B+XYmvhk5kSixPp6h3rn+NsQH6/MG9b341up+zLPGxnSU+J+guaq9dUOJSp8emjeeZEPthyPz/ABmRctunje0w+obpFG5XpmZvFZKVdUOsRuUcwzN3kVBqyPWUN3tcNHo9z5+XZIszPpsksZ+n99Wq27/xMwgn6lNqh+TdJsbcQymMqMcmcfP1EZOJFzjGRjwk54X7Y1cWi4dG4b8dm36ywNPvEb6c/wAgzM4P7tdD29iFZ9xhZIgyAPYTrwzZxr5oTLZtuq5xgI+lm3fM2wan9H8hRqbOxIw8MyqW5VD6Ofpoz84/l/2xq9sbh9X41Rp52eKVBj2eep+psfcXzxw645ZKc9ke/wCjnlMI/bmQzsZ+Z0a6QsPGbDe9Df5s4gABJJzIExjwHZ/WK9ow33r+jf8A9VG1x9Qg/prHo1SuBnaMf57DZ1WysVjfeJ9H19jbWjNftcfXIP6ajSZ0cbOk+grV4ZqnaD/MYoEyq1Am71GMf56CZMqRMmowb3+vsLBrkuOPkeM5Hkf6Fe1Ylk/ln0FgdeqUcbH5Bvz5NjPtoLPclYmTnv5XuA+YtUXPOGTP1GLJKxUiPZqEI/OtdXJUiaL9PyOe/qINdXIeoVWSyn06PyqZLfycIWdchNgY19FMH7Ap+HNmRrLiE130nTGc3aGPzyfn51x5xNrcj4k48PuA49ej2RF5e9/UPPPsRB/mHJ8hd5mZMptVNM5G88Y+8lMD0gfSM8xBk4R7DPIXszU1nkeRj9vYYxitVKqo5YeUUqQyohH5HSMU9lZpZM5DkfFeNmpkMg9pO70R8jedh36b+ZkZ66rYwfR7tVw4keVnmRJmdh+vn3bPi1XoZEHiFmo95GTNcI92xjOoTtFRJ0yGDH8IaL8+oxjH7x+n2fqL2CAYGaYBsYzzEfp9IQfR9dAftsf6TyFGDFGCGyPqZ9PtjPVEmcMAdSJHe/z39GrDMrIyMZqeOmz7DA9GxBPNUSSmGH0EYfXf11jFYqUepMYMe4gAfqPM9nTEU9/LKlkJOHkZn6EP6x6ttSnR4IWZ9Dd7xjGM3bCIKKlUfFmek8tYNclVyZ8hFRcN1R4jDSKrUARWeWZ605eGOFpx88eDUCVST/sbM/56C91Wqjgsk3BLJkDAZqMz9cndrSc+VRzvfULmI87z6kt8AL9sxCdGMj+zYod54m1i52Bo/J/B0Po2Qw7ZzKHSrAqFV8YuYnIoZOfDY/fv9d6w2344RtS4MVKlpwSMhUoHi75IWZGRR9xFZ9tbCgU2l2zSg0ejD0IwPzyd49T4wIdKpoafBGwEYbNhjOorVMPrvesW0QrYTb3naKt5BjZqdRQ9RUVI+hTTE7zd/lFDoWqSfXe+QTy1DuquR6HApuTbmH3cUPlqBW65T6BAfMqRH92ALOkeTu1triqcXquYo3CzES/472QwP3AX8zTW0Rtz8l9banE5wBqGd+JF6DzyT7wDDLuGkRMj8/kK1UGjQ6dDDDgjyMH5DFk8YeRi6nE9kREBERAREQEREBERAREQFQ9Vog4h43g+T4uPJ1D0iJI+sez7C5prdNh1GqvIeQzOfTyP68Ui6f48wCRLyoNUHzJdMID6BP7a5Un78LCEJk036mfyB8wn+PMXNbq4/wBGiqqe5LDv+fT64R7+VmJLiv5nxg/8d4r2apa+SYMnP6izzFeyyYjWGyuQRv8AD1JfzPLIMf2x/wBGtFW9WSHCwZ9h4929j+ewndq3rPw1X0imRqqsJNLIx6kxqkRZK2zxk4b+0UwMrQ6AnR9diwyNO1O0U8M4g+0QXueyj1XeVyjge8nbRtwf+8VkNY+pnmWxWMhukYx79An9Wvbl2oq2P1OkQX63scMdMLnhjjrFRfG7mYzOz6xbXtXj4zMjI922WB7/AOUw3vZn+QtLBqtQBuwSNjPzOevGT4Pl+/rfgn8/JkJ9Wvdow69onHEwfqrPG6hNhGJ3wVk4cbcL6yz8W3xTn6nUe/IuD325Zc7nw6pFf6E7Hs+sYjLOtvox3BKi/Ier2jDuSpXNS5fvGqQj+oZiwCvVgj36Y+eRcu+0qYP9xsQAfLNkUkNDxUiveODckWVp+RKY/wC2mzpbdqssg4zyHkZ3rRt/3b4SMaj0YmwPU5bJZ+rYp8keKh4xoculsmhJu3s/w9QI0G7Iujp4f7YHjJnZFf2abMO9uK1g7+wth1yOdt1uuvBU6p6EmnuwfNjW7I04b93Kj5w9TP1F89GcZfjERc+ccrOTn56f/YUlnG6x4ZkIcYH/AB1PV7Ol9ApNuUuXM8KU2QeFMI/3zDfkf8sfRkSSO6ARtPxWvPyajGSWclP9Po1weHjrYyA3fI6W9/xKn/5bmNmi8ZI9I5nXi5/tptHS7eDUhgNyeVT6pTtjrs2Gfk1dQ1UmTUiXAB7PXYvn6bjbcYCpZ9CuRYTCdSHC/wDmseqWKmOl1G1J14V47OkyBi5PuJtfS+jUm44YGP17gisYPn53sVkqWJtpwWaftgp3r8qYzIvnLJpV2T/3SmV4+pvN9NYxUMsqoHfvIbPnpudRtfQ7krePWFdKe8dfxIpf/DQH67/q1gdS44GF9K3duW/W6j2ewHJn+WRcxw7AJtjPMhAZ5AQ5/wBYp8ay6ODOSXMmyn/H5B/VqNvOls65OOXfkpmnQ7TpFICPrzDPe9axquNmMF1P033RUXhJ1IELJ+ep8OjW/BfqRKPFY/y8mdXLXJ6ijbTpYAa3LwrJmEqMM53k69Sm/YGrlDw5J/Gtc2O5hsyfnrMGEVDyba82vDxo9GodDz+CqewGozn89/01M579NUag86rC/I/UXorqR873qyPPtqfVSacPUWPMPqKGq5amwrPfNwQ6NDDy6RoMGzUf8Z2Y17VWuU+3KU+qVKRoMHzPPVGC2DV0cZC+WXBVYZ4tvAOPQY9mxpraI257vC5cXLAi4Md7tDdlzxyAokR+oxi+ndn2lT7ZpUaj06OxkYHkK24e2JR7Kokah0aGwARs6jFsKHE2F1Oa3tDi6fB+2piIjMREQEREBERAREQEREBERAREQco8fCj8roNsVQfPBKOD6vP9hcWmGRjHj6hGEX0H44lG8I4RSagwbnvpM0Ev9rqM5nD+mvn3JPnWFurhSbPPoTzRz59GWwYzMf3i1FjfhPIodSNfFubbCfunGYz6xizmSeZTql4YiZ8jN29nljWwmEh1mAGYMjHsIDT9caQW5FjSxy2bz8xScndrIcTsOfaVM8OUaO/wJLfqP7uKTu/UWMRj94qepkY+mrkGcrazTR5NNBfgzhqSycMaw987TVbKr6RZYGWsnDzqSycN/aLEmVFezJyhWmVMljXsw8dYwydqKvl2mgyTXjqtnJyPWPeEWKtlVRbJNQe2PUfzNPnr2jSiDY+MOYbIRmnz1jfhFVhqO2gzPl0gj2E5Yfds0+ep4alMyafhA79jT56w+NWe8V4jTlDVmAZ0h7N4TPsae2pPKybZO88xWSAdXUJBo8wnwzkIzb7PeKZvOk1HqAHd9Gpj+YreqDPI9ijB1GP1F7P6ioN0igRpOoR6ja5PP3akvVD+jQGHVfKFGYiCZrqth1Az/Aq9dBPecneKtj1AYdUcrzvQe1eJ+KtTz1iU+sw6NAfVKjI0Iw+u/rq63tXIdGtXlkuRk8aGP11AwQwWvDjA3UGoVGO+LRAP5mTYYP76uI25+Tkw9sH8JLs4x92hqlShni23EfsMX07w3w5odgW9GodHhsYEHX8tUYY4ZUPDygxqPQ4bAMAzTfsLYsODqLqc21dNg/QV1YPgYjGabfYVatmIiICIiAiIgIiICIiAiIgIiICIiDGr4oEK57en25UWeJ1OKeIf5bF8ub8tmsWJc8+17gHkkxH8/s3j7MjF9XqgzUE34OFc/wDGHwWpeI1KZM5H4/EYTQMzpFna+O/ZwGwmfdq62ZOICYajn5h94H4xQLttWuWdVX0+ox3s0+v2asnKiAeyQAmQw94x6xt1MzrGmNhteOyVGJuzhezON61LWMK6fOe+RZ1QYx/8gkv/AEHrbU+pDqVBjViIP0b2eQsSr1O2GTKcR+RNmWnKxQ6xbhuT1ynnhP8ATMVtePUYtzQ7nqkQL4crJKhk7E22xQDQcP6q/Ul0N8IxOvDfk/MTaMNUPAqGAWy34c0M/wC414Mf5kyLkJ9POrabDW5M/iscE34k7FezDBnxSdmReLCZFlsm1bgg5+XUeUDz9B+RWSpQdNjyaeRZvUDXINOXEGvHU0HqSw+3tjWmBR4V01X4VJnXt4u/s146cb/QmBJZVdT95TAythWpg4/eZF7Mlxx9ovRdeXaanw6/p9IRitQYlQqPvGnyn/IXsax7sJu4tH6Ty3rJbNqVXxvZ0jFmdKqI5fRkWq/aHMiMZ+PJsV5GbbDQs41k9t0q4Ka/UlSGHjD7ZjHsUri2zo2m/eL2MRRqb72YRVvHnUNFHX/80Ulg9Nmn1FRuyIIbxqh41JexeL92gjZNtHj7tez146nkI9UZCZF4vYpO8yKh7NhHiAZ+TdkUCsVyHblNfVKqTIHqM67yd2va56zR6HSvClSkbA+YxnSPJ3ak4D4F3ZxhbwjVysDfFoMR+wzJsMGtohlyWrwTwSuzjIXbGrlcjvi0SJ0LOowa+mWHWGtDsCiRqHQ4bAMAzqKfYGHtDsegxqHRobABAzqMWbRoK6nz1EOCroIeTg9hfrB8DFWgIiICIiAiIgIiICIiAiIgIiICIiAiIg8ZI87FYZgFkL1AkgQaWxRwZt/EKGaPLhsY8jOmXDeKnF6xEsOTJkUqnvqMDzF9NZkRWeTBGfxeUNjw+Q9Z4abfJS3ruHSjGt+q54TJb/4SzmEWQzBkiP2OYRdz4r8V7DvEIJtejsAYnXYxchYi8X3EjCTOSm69eo4+pzzhH5ixw2i2tJ4CMk7A9jpFGyDIpjKxT64x+gR7JI2bbHsyE+gozGKGzx5JHz6mn0aeMA6CQ9i9n7Co6RB7Q6zXInQVB7GeupntmrD/AH9Hiymemiserbk+FSdTOg8ZPtXlZyTrHpb3+WwORRmW/h2TpLPYx5PIe9T9POpkaIvNvcLbGsrDs7/+z8r8upjMOcO/+75/y6v0YA2M6Ma9tTIvdrwxv2h2Gx+7t/6autNty04L2Eg2/FZt+QpJnjyKM8+QOpp9GmzC8akMbNQEcDH+orVVarIB/COj3ew9Wrw4Qb92NWE0ojzPG8mwoepIalI5YYfLHs2/LV4o8sfI6xT50h8p5IWpnz8zTIsbjbupPJp52E3auVE0z1Wtx9PJqQifYVsmf0E/izN5n1GK5PHz/wAxY9TSEAxhHq8RpedQ1VvRez9MjF4oKHqM9mopjOY9ePxmwj1G00YNe2TbVD3jAxFPF+mNix657qp9uU18ycTY6NjO+IqLtu6n25DfInEzmJ0EZnSPV14v3F6vDHq6g3ZdQ3gpQ38zJu9Pu2LaIc98iNgJgRdnGFu0NwXBH0KIDeBZ1NNfUfDrD2h2PQY1Ho0NjAgZp7CosCwKPZVHjUejQwgCAOnsM56zyHE011OO1caJsKYwfAxVojMREQEREBERAREQEREBERAREQEREBERAREQFQ9nsqtEEM0HU/fVqmU1ZCvF4BkQYrJg7CsNVo8eUF8c8fXYTnses/NBGrbJpqLceYx8Tez77easW+PwXVekY9mwuS75wZxkwymP8JUvw3D75nSMGvq/Jpvo1ZKlRodSZyedDYdnkPZnWeHu3yFDc9LO/k5yPiye5MzIrqEmRnvf6C75xF4pOF9+MfqUdkUxPIYub7q/B83JTTGkWjcj2M6jNd7FGG3c0zrjIpgRj7xZDM4n+PlOe/klYlH+eVnk4A8ZiDzBvf8AMsUYs71YQR3v98M3auTAZ+jVhk4ZcZimh1CUfOwf+xMWDVK5r8o0nkdwDmwn/QWfXbfvht1hNtg+ooEyXHyM05gB6nPY961pGrHhVmoOoPP6717MYN+8eP1F7he2bSalHyGI+ZFZ5G3z1bTVUbA7uoRd55+RWFgxr2ZprxmrZOmZOUDkRX6m7568QjmMz/i9/P6mRVmgwz9moD6MNjPFZhweo9ei9vJpzGacd/M1M6uVtkIepVLqPPF/pFjEYFcY9gx1g6zygwSAY/Xka5js5+TIj2F7MzJux9mjD5DLxZqeuq9POoaL3GPqMVSt0YYxqfn+BW8pUqX8xUbxih1isw6VGfMnSGACNm296PXsY4x9IT6C17eGIw6U99Lg/jGq+QF+7D66sky8boxDn+1/DmGffv03yWM37/U7tdb8WniNw6Vo3JiHDY+Tn1GRnq4hyXbUvFv4pl2YsV5l6X/n5Nn1MhuuP1F9LLJsej2dR41HodPZFjA6jFcqDb8OlRgw4McYAjZpsYxiySNF011OVRDiaauSIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICocxhPdVaIIBoIydmrVJpyyRebmM/fQYbJpXo1AfBJ56zk0HU/fUA1O9Ggw98Qio5J5Y86yp9K9GvF9K9GoWxV9Ojk58dn0Fg154GYd3wF46zb8V7yddbdfSlGfB00HB+JH4PmG976hYdQ5KbyM65yvDBbGjDx7x1W331EI+uxfXR4NjTVtn0qn1IPJ50MB2eexHu3xnfcEcBuT1KOeE/r6zFMDOjn6CQx7PMevplfPFewnvXOSXRwAkk64WZFz3eH4PGjj8ctGsPAbqMzrPDbucusOpIXjWQ3hxbMbLEz/AIv8KRh9fIteyZ1yUZ+nXLXqMV/qKMPO5lodNZDTT5HrXUa9KOzdyyPA/wBMB6vcO+7bZz65FUOjcNiwyU/I8Zx7ZF7bvqLDA4hWWPpLgisf66PxUscH8YPN8SF70w87IZ4HbUli1XMxshjfyeh0OozX9TPsJSqBjpjNM8D0qlyoUA+70YzMjPlvVxCL5l7vPFuh0P8AF9H/ABjUvIC/YZ65F44b4H4scYKthqFVHKZTc/qAYNdOYFcQaj0Dk1cv/wAakj5geouybetGj2/DZT6NTwRQj3eRi2iOtzXydjUuCHFesvCiAHQpYDz+uZ7M63xDpox9GPIpMOD9YrqEGRaM1AQaamIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICoyfCq0QeL4oyc9QzUob+YrkiDHjUcnD7g3q2mpXo1mD2eyvN0UfCgwo1NUN9N9Gs5NThvUY1OGgwaTSo8tmmeP+YsSrGElj1j39b8V/wAhbafShqM+lDQc03DxO8I6495PAbAPJ12LBpn4PLDM73kBMOxdk+D+BOQ8H+lQOM434OrDv+WHV+pX4P8Awni++hvOutGQvhUkMEasaHtjii4N0DIRltse8flra9Bse36GFg6NRwRWD8hiyoMEamMiDZ7iC2hg+jU8MFTGBVbGewg/BDycHsL0REBERAREQEREBERAREQEREBERAREQEREBERB/9k="
    ],
    "rating": 4.7,
    "reviewsCount": 88,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 60,
    "colors": [
      {
        "name": "Đen Carbon",
        "hex": "#111827"
      }
    ],
    "shortDescription": "Túi đựng giày du lịch vải Oxford chống thấm.",
    "description": "Túi đựng giày du lịch chuyên dụng với chất liệu vải Oxford chống thấm nước, có ngăn thoáng khí chống ẩm mốc.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554615",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "adidas-kids-superstar",
    "sku": "AD-KSS-14",
    "name": "Adidas Superstar 360 Kids",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Trẻ em",
    "price": 1350000,
    "originalPrice": 1350000,
    "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.8,
    "reviewsCount": 45,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35
    ],
    "sizeStock": {
      "28": 4,
      "29": 6,
      "30": 8,
      "31": 8,
      "32": 6,
      "33": 5,
      "34": 4,
      "35": 4
    },
    "stockQuantity": 45,
    "colors": [
      {
        "name": "White / Black",
        "hex": "#FFFFFF"
      }
    ],
    "shortDescription": "Phiên bản thu nhỏ siêu dễ thương của Superstar.",
    "description": "Thân giày vải lưới co giãn hai lớp thoáng khí, đế EVA êm ái cùng rãnh uốn sâu giúp các bé vận động thoải mái cả ngày.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554243",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "adidas-predator-elite",
    "sku": "AD-PRD-10",
    "name": "Adidas Predator Accuracy",
    "brand": "Adidas",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 6200000,
    "originalPrice": 6200000,
    "image": "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.8,
    "reviewsCount": 84,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "40": 4,
      "41": 6,
      "42": 8,
      "43": 6,
      "44": 4
    },
    "stockQuantity": 28,
    "colors": [
      {
        "name": "Solar Red",
        "hex": "#EF4444"
      }
    ],
    "shortDescription": "Sát thủ săn bàn thực thụ.",
    "description": "Công nghệ High Definition Grip với hàng loạt gai cao su nổi trên thân giày giúp gia tăng ma sát tối đa với bóng.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554016",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "adidas-samba-classic",
    "sku": "AD-SMB-06",
    "name": "Adidas Samba Classic",
    "brand": "Adidas",
    "category": "Giày lifestyle",
    "gender": "Nữ",
    "price": 2900000,
    "originalPrice": 2900000,
    "image": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.6,
    "reviewsCount": 418,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41
    ],
    "sizeStock": {
      "36": 8,
      "37": 10,
      "38": 15,
      "39": 12,
      "40": 10,
      "41": 5
    },
    "stockQuantity": 60,
    "colors": [
      {
        "name": "Core White / Black",
        "hex": "#F8FAFC"
      }
    ],
    "shortDescription": "Biểu tượng thời trang đường phố toàn cầu.",
    "description": "Thân giày bằng da cao cấp phối da lộn ở mũi giày tạo nên nét cổ điển, thanh lịch và trường tồn với thời gian.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553805",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "adidas-ultraboost-light",
    "sku": "AD-UBL-02",
    "name": "Adidas Ultraboost Light",
    "brand": "Adidas",
    "category": "Giày chạy bộ",
    "gender": "Unisex",
    "price": 5200000,
    "originalPrice": 5800000,
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.9,
    "reviewsCount": 289,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "37": 4,
      "38": 8,
      "39": 12,
      "40": 15,
      "41": 12,
      "42": 8,
      "43": 6,
      "44": 5
    },
    "stockQuantity": 70,
    "colors": [
      {
        "name": "Core Black",
        "hex": "#111111"
      },
      {
        "name": "Cloud White",
        "hex": "#FFFFFF"
      }
    ],
    "shortDescription": "Phiên bản Ultraboost nhẹ nhất từ trước đến nay.",
    "description": "Trải nghiệm năng lượng đỉnh cao với Ultraboost Light. Đế giữa Light BOOST thế hệ mới mang lại khả năng hoàn trả năng lượng tối đa trên từng bước chạy.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553496",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "converse-chuck-70",
    "sku": "CV-C70-04",
    "name": "Converse Chuck Taylor '70",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Unisex",
    "price": 2100000,
    "originalPrice": 2100000,
    "image": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.8,
    "reviewsCount": 512,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 10,
      "37": 12,
      "38": 15,
      "39": 15,
      "40": 15,
      "41": 10,
      "42": 8,
      "43": 5
    },
    "stockQuantity": 90,
    "colors": [
      {
        "name": "Classic Navy",
        "hex": "#1E3A8A"
      },
      {
        "name": "Vintage Black",
        "hex": "#1C1917"
      }
    ],
    "shortDescription": "Mẫu giày sneaker kinh điển không bao giờ lỗi mốt.",
    "description": "Converse Chuck 70 tinh chỉnh lại các chi tiết từ phiên bản thập niên 1970 với chất liệu canvas dày dặn cao cấp và đệm OrthoLite êm ái.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.655361",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "converse-run-star",
    "sku": "CV-RSH-08",
    "name": "Converse Run Star Hike",
    "brand": "Converse",
    "category": "Sneaker",
    "gender": "Nữ",
    "price": 2800000,
    "originalPrice": 3200000,
    "image": "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.8,
    "reviewsCount": 215,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      35,
      36,
      37,
      38,
      39,
      40
    ],
    "sizeStock": {
      "35": 4,
      "36": 8,
      "37": 10,
      "38": 12,
      "39": 8,
      "40": 6
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "White Platform",
        "hex": "#FFFFFF"
      }
    ],
    "shortDescription": "Đế răng cưa hầm hố hai tông màu táo bạo.",
    "description": "Một phiên bản đột phá định hình lại phong cách canvas truyền thống với phần đế răng cưa cá tính.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553921",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "converse-weapon-mid",
    "sku": "CV-WPM-12",
    "name": "Converse Weapon Mid Retro",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Nam",
    "price": 3300000,
    "originalPrice": 3300000,
    "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.7,
    "reviewsCount": 64,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "40": 4,
      "41": 8,
      "42": 8,
      "43": 6,
      "44": 4
    },
    "stockQuantity": 30,
    "colors": [
      {
        "name": "Vintage Gold/White",
        "hex": "#EAB308"
      }
    ],
    "shortDescription": "Tái sinh từ hào quang sân bóng rổ thập niên 80.",
    "description": "Converse Weapon mang thiết kế cổ trung (mid-top) cá tính, sử dụng chất liệu da thật dày dặn bền bỉ.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554179",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "nike-air-max-pulse",
    "sku": "NK-AMP-01",
    "name": "Nike Air Max Pulse",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 4200000,
    "originalPrice": 4800000,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.8,
    "reviewsCount": 142,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 5,
      "40": 10,
      "41": 15,
      "42": 10,
      "43": 8,
      "44": 4
    },
    "stockQuantity": 52,
    "colors": [
      {
        "name": "Neon Orange",
        "hex": "#FF5400"
      },
      {
        "name": "Slate Grey",
        "hex": "#64748B"
      }
    ],
    "shortDescription": "Đệm khí Air cải tiến vượt trội.",
    "description": "Lấy cảm hứng từ bối cảnh âm nhạc London, Nike Air Max Pulse mang đến một nét phá cách đầy cá tính cho dòng Air Max mang tính biểu tượng.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6552472",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "nike-kids-flex-runner",
    "sku": "NK-KFR-13",
    "name": "Nike Flex Runner 2 Kids",
    "brand": "Nike",
    "category": "Giày thể thao",
    "gender": "Trẻ em",
    "price": 1450000,
    "originalPrice": 1700000,
    "image": "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.9,
    "reviewsCount": 52,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      30,
      31,
      32,
      33,
      34,
      35
    ],
    "sizeStock": {
      "30": 4,
      "31": 6,
      "32": 8,
      "33": 8,
      "34": 6,
      "35": 4
    },
    "stockQuantity": 36,
    "colors": [
      {
        "name": "Blue Glow",
        "hex": "#38BDF8"
      }
    ],
    "shortDescription": "Dạng xỏ không dây tiện lợi cho bé năng động.",
    "description": "Đế xốp mềm dẻo và các rãnh uốn lượn tạo cảm giác tự nhiên nhất cho từng bước chạy nhảy của bé.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554213",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "nike-phantom-gx",
    "sku": "NK-PTG-09",
    "name": "Nike Phantom GX II Academy",
    "brand": "Nike",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 3200000,
    "originalPrice": 3200000,
    "image": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.5,
    "reviewsCount": 39,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 4,
      "40": 6,
      "41": 10,
      "42": 8,
      "43": 6,
      "44": 4
    },
    "stockQuantity": 38,
    "colors": [
      {
        "name": "Hyper Turquoise",
        "hex": "#2DD4BF"
      }
    ],
    "shortDescription": "Dành cho các nhạc trưởng kiểm soát thế trận.",
    "description": "Thân giày NikeSkin mở rộng vùng tiếp xúc bóng, giúp bạn thực hiện những đường chuyền dọn cỗ chính xác.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.655396",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "nike-vaporfly-3",
    "sku": "NK-VPF-05",
    "name": "Nike ZoomX Vaporfly 3",
    "brand": "Nike",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 6800000,
    "originalPrice": 6800000,
    "image": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.9,
    "reviewsCount": 74,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 4,
      "40": 6,
      "41": 8,
      "42": 8,
      "43": 5,
      "44": 4
    },
    "stockQuantity": 35,
    "colors": [
      {
        "name": "Electric Pink",
        "hex": "#EC4899"
      },
      {
        "name": "Volt Yellow",
        "hex": "#84CC16"
      }
    ],
    "shortDescription": "Siêu giày chạy marathon bứt phá tốc độ.",
    "description": "Được thiết kế dành cho các vận động viên theo đuổi thành tích đỉnh cao, đĩa đệm carbon toàn phần kết hợp bọt ZoomX siêu đàn hồi.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553677",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "oxford-dress-leather-shoe",
    "sku": "PM-OXF-15",
    "name": "Giày Tây Oxford Classic Leather",
    "brand": "Puma",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 3200000,
    "originalPrice": 3800000,
    "image": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.7,
    "reviewsCount": 38,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 4,
      "40": 6,
      "41": 8,
      "42": 8,
      "43": 6,
      "44": 4
    },
    "stockQuantity": 36,
    "colors": [
      {
        "name": "Classic Black",
        "hex": "#171717"
      }
    ],
    "shortDescription": "Giày tây Oxford da bò thật cao cấp.",
    "description": "Giày tây kiểu dáng Oxford cao cấp từ da bò thật 100% đánh bóng thủ công tỉ mỉ. Phù hợp cho môi trường công sở lịch lãm.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.655436",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "puma-future-ultimate",
    "sku": "PM-FTU-07",
    "name": "Puma Future Ultimate FG",
    "brand": "Puma",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 5800000,
    "originalPrice": 6500000,
    "image": "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.7,
    "reviewsCount": 56,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 3,
      "40": 5,
      "41": 8,
      "42": 8,
      "43": 4,
      "44": 2
    },
    "stockQuantity": 30,
    "colors": [
      {
        "name": "Spectral Silver",
        "hex": "#CBD5E1"
      }
    ],
    "shortDescription": "Làm chủ cuộc chơi trên sân cỏ tự nhiên.",
    "description": "Công nghệ FUZIONFIT360 dệt co giãn thích ứng hoàn hảo với bàn chân, kết hợp dải PWRTAPE tăng cường độ ổn định.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553887",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "puma-rsx-retro",
    "sku": "PM-RSX-03",
    "name": "Puma RS-X Retro Drift",
    "brand": "Puma",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 3400000,
    "originalPrice": 3900000,
    "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.7,
    "reviewsCount": 98,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 4,
      "37": 6,
      "38": 8,
      "39": 10,
      "40": 10,
      "41": 8,
      "42": 6,
      "43": 4
    },
    "stockQuantity": 56,
    "colors": [
      {
        "name": "Retro Multi",
        "hex": "#D946EF"
      },
      {
        "name": "Teal Lagoon",
        "hex": "#06B6D4"
      }
    ],
    "shortDescription": "Thiết kế chunky hầm hố phá cách.",
    "description": "Dòng sản phẩm RS-X đã quay trở lại với diện mạo tương lai đầy nổi loạn. Thiết kế chunky hầm hố kết hợp các mảng màu tương phản phong cách retro hoài cổ.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6553554",
    "updatedAt": null,
    "variants": []
  },
  {
    "id": "puma-velocity-nitro",
    "sku": "PM-VLN-11",
    "name": "Puma Velocity Nitro 3",
    "brand": "Puma",
    "category": "Giày thể thao",
    "gender": "Nam",
    "price": 3100000,
    "originalPrice": 3100000,
    "image": "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80"
    ],
    "rating": 4.6,
    "reviewsCount": 110,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 5,
      "40": 8,
      "41": 10,
      "42": 10,
      "43": 5,
      "44": 4
    },
    "stockQuantity": 42,
    "colors": [
      {
        "name": "Sunset Orange",
        "hex": "#F97316"
      }
    ],
    "shortDescription": "Mẫu giày tập luyện đa năng cho mọi cự ly.",
    "description": "Lớp bọt Nitro cao cấp được bơm khí nitơ mang lại phản hồi lực êm ái vượt trội trong khi trọng lượng siêu nhẹ.",
    "status": "Đang bán",
    "isDeleted": false,
    "createdAt": "2026-09-02T10:20:18.6554047",
    "updatedAt": null,
    "variants": []
  }
];

let cachedProducts: any[] = SERVER_PRODUCTS;


// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "N-KICKS AI Backend", time: new Date().toISOString() });
});

// Products Endpoint: GET /api/products
app.get("/api/products", async (req: Request, res: Response) => {
  const REMOTE_URL = "https://defensive-trimness-helper.ngrok-free.dev/api/products";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const remoteRes = await fetch(REMOTE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = remoteRes.headers.get("content-type") || "";
    if (remoteRes.ok && contentType.includes("application/json")) {
      const data: any = await remoteRes.json();
      const list = Array.isArray(data) ? data : (data?.data || data?.products);
      if (Array.isArray(list) && list.length >= 21) {
        // Enforce distinct unique images for each product
        const imgMap = new Map(SERVER_PRODUCTS.map(p => [p.id, p.image]));
        const merged = list.map((item: any) => {
          const distinctImg = imgMap.get(item.id) || item.image;
          return {
            ...item,
            image: distinctImg,
            images: [distinctImg],
            status: item.status || 'Đang bán',
          };
        });
        cachedProducts = merged;
        return res.json(merged);
      }
    }
  } catch (err) {
    console.warn("Backend proxy fetch to ngrok failed or timed out, returning server products:", (err as any)?.message);
  }

  // Return server products catalog (all 21 items with guaranteed unique images)
  return res.json(SERVER_PRODUCTS);
});

// 1. AI Chat Endpoint
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Tin nhắn không hợp lệ" });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `
Bạn là "N-KICKS AI Assistant" - Trợ lý Thời Trang & Chuyên Gia Tư Vấn Giày Sneaker cao cấp của cửa hàng K-NICKS (chuyên các dòng Nike, Adidas, Puma, Converse chính hãng tại Việt Nam).

Nhiệm vụ & Phong cách:
1. Giao tiếp bằng tiếng Việt tự nhiên, thân thiện, sành điệu (sneakerhead enthusiast), am hiểu sâu sắc về sneaker culture và phối đồ thời trang.
2. Sẵn sàng giải đáp linh hoạt mọi câu hỏi của khách hàng:
   - Cách vệ sinh giày, tẩy ố vàng đế, bảo quản giày da/canvas/da lộn.
   - So sánh chi tiết các mẫu giày (Air Force 1 vs Stan Smith, Ultraboost vs Vaporfly, Samba vs Gazelle...).
   - Mix & Match outfit (đi học, đi làm, đi chơi phố, sporty, Y2K).
   - Đo size và chọn size chính xác (chân bè ngang, mu dày, chân thon, quy đổi size Nike/Adidas/Puma/Converse).
   - Tư vấn theo tầm giá / ngân sách (dưới 2.5 triệu, dưới 3 triệu, 3-5 triệu...).
   - Cách phân biệt giày thật (Auth) vs hàng giả (Fake), kiểm tra tem mác, đường chỉ, mùi keo.
   - Chính sách đổi trả 30 ngày, bảo hành keo 6 tháng, freeship, kiểm tra hàng COD trước khi nhận.
3. Đề xuất sản phẩm phù hợp dựa trên danh mục thực tế của cửa hàng:
${SNEAKER_CATALOG_SUMMARY}
4. Định dạng câu trả lời bằng Rich Markdown rõ ràng (sử dụng in đậm, danh sách có gạch đầu dòng, bảng so sánh nếu cần, các mẹo hữu ích).
5. Nếu trong câu trả lời có nhắc đến hoặc gợi ý các sản phẩm cụ thể, ở CUỐI CÙNG hãy thêm một dòng định dạng đặc biệt:
[[PRODUCTS: id1, id2]]
Các id hợp lệ: 'nike-air-max-pulse', 'adidas-ultraboost-light', 'puma-rsx-retro', 'converse-chuck-70', 'nike-vaporfly-3', 'adidas-samba-classic', 'converse-run-star' (tối đa 3 sản phẩm).

6. Bạn có thể đính kèm 2-3 gợi ý câu hỏi tiếp theo ở cuối câu:
[[QUICK_REPLIES: Câu hỏi 1, Câu hỏi 2, Câu hỏi 3]]
`;

        const chatContents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          history.slice(-6).forEach((h: any) => {
            if (h.content) {
              chatContents.push({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.content }],
              });
            }
          });
        }

        chatContents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const geminiResult = await generateWithGeminiFallback(ai, {
          contents: chatContents,
          systemInstruction: systemInstruction,
          temperature: 0.7,
          topP: 0.9,
        });

        if (!geminiResult || !geminiResult.text) {
          const fallback = generateSmartChatFallback(message);
          return res.json({
            reply: fallback.reply,
            suggestedProductIds: fallback.suggestedProductIds,
            quickReplies: fallback.quickReplies,
            fallback: true,
          });
        }

        const rawText = geminiResult.text;
        
        // Extract product tags and quick reply tags if any
        let reply = rawText;
        const suggestedProductIds: string[] = [];
        let quickReplies: string[] = [];

        const productTagMatch = reply.match(/\[\[PRODUCTS:\s*([a-zA-Z0-9-,\s]+)\]\]/);
        if (productTagMatch) {
          reply = reply.replace(productTagMatch[0], "").trim();
          const ids = productTagMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
          ids.forEach((id) => {
            if (!suggestedProductIds.includes(id)) suggestedProductIds.push(id);
          });
        }

        const quickRepliesMatch = reply.match(/\[\[QUICK_REPLIES:\s*([^\]]+)\]\]/);
        if (quickRepliesMatch) {
          reply = reply.replace(quickRepliesMatch[0], "").trim();
          quickReplies = quickRepliesMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
        }

        if (quickReplies.length === 0) {
          // Provide default contextual dynamic quick replies
          quickReplies = [
            "🧼 Cách vệ sinh không bị ố vàng?",
            "👟 So sánh AF1 và Stan Smith",
            "👕 Gợi ý phối đồ đi học",
            "💰 Giày hot dưới 2.5 triệu"
          ];
        }

        return res.json({
          reply,
          suggestedProductIds,
          quickReplies,
          model: geminiResult.model,
        });
      } catch (geminiError: any) {
        const fallback = generateSmartChatFallback(message);
        return res.json({
          reply: fallback.reply,
          suggestedProductIds: fallback.suggestedProductIds,
          quickReplies: fallback.quickReplies,
          fallback: true,
        });
      }
    } else {
      // API Key missing or not set - use smart fallback
      const fallback = generateSmartChatFallback(message);
      return res.json({
        reply: fallback.reply,
        suggestedProductIds: fallback.suggestedProductIds,
        quickReplies: fallback.quickReplies,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("AI Chat handler error:", error);
    const fallback = generateSmartChatFallback(req.body?.message || "");
    return res.json({
      reply: fallback.reply,
      suggestedProductIds: fallback.suggestedProductIds,
      fallback: true,
    });
  }
});

// 2. AI Size Recommendation Endpoint
app.post("/api/ai/size-recommend", async (req: Request, res: Response) => {
  try {
    const { brand, normalShoeSize, footShape, activityType, productName, footLengthCm } = req.body;
    const baseSize = Number(normalShoeSize) || 40;
    const brandName = (brand || "Nike").toString();
    const shape = (footShape || "normal").toString(); // 'normal' | 'wide' | 'narrow'
    const activity = (activityType || "casual").toString(); // 'casual' | 'running' | 'gym'

    // Mathematical sizing rule calculation
    let delta = 0;
    let brandAdvice = "";
    let shapeAdvice = "";
    let activityAdvice = "";

    // Brand specifics
    const brandLower = brandName.toLowerCase();
    if (brandLower.includes("converse")) {
      delta -= 0.5;
      brandAdvice = "Converse Chuck 70 có form giày thuôn dài truyền thống, nên form thường rộng hơn giày thể thao tiêu chuẩn khoảng 0.5 size.";
    } else if (brandLower.includes("adidas")) {
      brandAdvice = "Adidas Ultraboost/Samba có thiết kế ôm sát mu bàn chân (snug fit).";
    } else if (brandLower.includes("nike")) {
      brandAdvice = "Nike có form ôm chuẩn True to Size, phần mũi hơi thon gọn theo form thể thao.";
    } else if (brandLower.includes("puma")) {
      brandAdvice = "Puma RS-X có đế chunky và lòng giày tương đối rộng rãi, êm ái.";
    }

    // Foot shape factor
    if (shape === "wide" || shape.toLowerCase().includes("bè")) {
      delta += 0.5;
      shapeAdvice = "Bàn chân bè ngang cần thêm không gian hai bên má ngoài để tránh bị cấn phồng rộp.";
    } else if (shape === "narrow" || shape.toLowerCase().includes("thon")) {
      shapeAdvice = "Bàn chân thon gầy sẽ vừa vặn hoàn hảo với form giày chuẩn.";
    } else {
      shapeAdvice = "Dáng bàn chân chuẩn cân đối, dễ dàng chọn size theo bảng quy đổi quốc tế.";
    }

    // Activity factor
    if (activity === "running" || activity.toLowerCase().includes("chạy")) {
      if (shape !== "wide") delta += 0.5;
      activityAdvice = "Khi chạy bộ hoặc tập luyện cường độ cao, bàn chân sẽ nở ra nhẹ và dồn lực về mũi, nên cần khoảng trống 0.5cm - 1cm phía trước mũi ngón chân.";
    } else if (activity === "gym" || activity.toLowerCase().includes("gym")) {
      activityAdvice = "Tập gym & nâng tạ cần độ cố định cao, ôm khít gót chân để giữ thăng bằng tối đa.";
    } else {
      activityAdvice = "Đi chơi hàng ngày ưu tiên sự thoải mái và êm ái khi di chuyển liên tục.";
    }

    const calculatedSize = Math.round((baseSize + delta) * 2) / 2;

    const fitSummary = delta > 0
      ? `Khuyên bạn nên TĂNG ${delta} size (Chọn size ${calculatedSize}) để mang lại cảm giác êm ái và thoải mái nhất.`
      : delta < 0
      ? `Khuyên bạn nên GIẢM ${Math.abs(delta)} size (Chọn size ${calculatedSize}) vì form giày này tương đối dài.`
      : `Khuyên bạn nên chọn ĐÚNG SIZE ${calculatedSize} (True to Size) vì form giày hoàn toàn phù hợp với bàn chân bạn.`;

    const expertAdvice = `${brandAdvice} ${shapeAdvice} ${activityAdvice} Nếu bạn thường xuyên mang tất (vớ) thể thao dày, chọn size ${calculatedSize} sẽ là quyết định hoàn hảo.`;

    // Try Gemini explanation if client available
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Bạn là chuyên gia fitting giày sneaker. Khách hàng đang xem sản phẩm: "${productName || brandName}".
Thông số khách hàng:
- Size giày hay đi: ${baseSize}
- Dáng chân: ${shape} (${shape === "wide" ? "Bè ngang" : shape === "narrow" ? "Thon dài" : "Bình thường"})
- Nhu cầu sử dụng: ${activity} (${activity === "running" ? "Chạy bộ" : activity === "gym" ? "Tập gym" : "Đi chơi hàng ngày"})
- Thương hiệu: ${brandName}
${footLengthCm ? `- Chiều dài bàn chân: ${footLengthCm} cm` : ""}

Kích thước khuyến nghị tính toán: ${calculatedSize} EU.

Hãy viết một lời khuyên ngắn gọn (khoảng 2-3 câu), cực kỳ chuyên nghiệp và đáng tin cậy giải thích vì sao size ${calculatedSize} là tốt nhất cho khách hàng.`;

        const geminiResult = await generateWithGeminiFallback(ai, {
          contents: prompt,
          temperature: 0.5,
        });

        const customAdvice = geminiResult?.text?.trim() || expertAdvice;

        return res.json({
          recommendedSize: calculatedSize,
          baseSize,
          delta,
          confidence: "98%",
          fitSummary,
          expertAdvice: customAdvice,
          breakdown: {
            brandAdjustment: brandAdvice,
            footShapeFactor: shapeAdvice,
            activityFactor: activityAdvice,
          },
        });
      } catch (err) {
        // Fallback to local expert advice
      }
    }

    return res.json({
      recommendedSize: calculatedSize,
      baseSize,
      delta,
      confidence: "95%",
      fitSummary,
      expertAdvice,
      breakdown: {
        brandAdjustment: brandAdvice,
        footShapeFactor: shapeAdvice,
        activityFactor: activityAdvice,
      },
    });
  } catch (error: any) {
    console.error("AI Size Recommend error:", error);
    return res.status(500).json({
      error: "Không thể tính toán gợi ý size",
      recommendedSize: req.body?.normalShoeSize || 40,
    });
  }
});

// -------------------------------------------------------------
// VITE / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
