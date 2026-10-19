import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  RotateCcw,
  Minimize2,
  Maximize2,
  ShoppingCart,
  ArrowRight,
  Star,
  Check,
  Tag,
  ShieldCheck,
  Compass,
  Sparkle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Product } from '../types';
import { API_BASE_URL, DEFAULT_HEADERS, api } from '../config/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedProductIds?: string[];
  quickReplies?: string[];
  timestamp: string;
}

interface AiAssistantWidgetProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, qty: number) => void;
  onOpenCart?: () => void;
}

// 8 Rich and diverse horizontal quick prompts
const DIVERSE_QUICK_PROMPTS = [
  { id: 'cleaning', text: '🧼 Cách vệ sinh giày không bị ố vàng?' },
  { id: 'compare', text: '👟 So sánh Air Force 1 và Stan Smith' },
  { id: 'outfit', text: '👕 Gợi ý phối đồ đi học/đi làm trẻ trung' },
  { id: 'size-wide', text: '📏 Hướng dẫn đo size cho chân bè' },
  { id: 'budget', text: '💰 Tìm giày hot dưới 2.5 triệu' },
  { id: 'policy', text: '🛡️ Chính sách đổi trả & bảo hành' },
  { id: 'running', text: '🏃 Tư vấn giày chạy bộ êm ái' },
  { id: 'promo', text: '🔥 Mã giảm giá SOLE20 hôm nay' },
];

// Client-side Intelligent Fallback Engine for offline / network interruption
function getClientSideAiFallback(query: string): { reply: string; suggestedProductIds: string[]; quickReplies: string[] } {
  const lower = query.toLowerCase();

  if (lower.includes('vệ sinh') || lower.includes('ố vàng') || lower.includes('tẩy ố') || lower.includes('giặt giày') || lower.includes('bảo quản')) {
    return {
      reply: `🧼 **BÍ QUYẾT VỆ SINH & TRỊ Ố VÀNG ĐẾ GIÀY CHUẨN SNEAKERHEAD:**

1. **Vệ sinh phần thân (Upper):**
   - *Giày vải Canvas (Converse):* Pha nước ấm + bọt vệ sinh dịu nhẹ, dùng bàn chải lông mềm chà xoay tròn.
   - *Giày da & Da lộn:* Dùng bọt khô hoặc khăn mềm ẩm lau nhẹ, không ngâm nước với da lộn.

2. **Cách khử ố vàng đế cao su:**
   - Thoa hỗn hợp **Baking Soda + Kem đánh răng trắng** lên vết ố 15 phút rồi chà sạch.
   - Dùng dung dịch tẩy ố chuyên dụng bọc màng bọc thực phẩm phơi nắng nhẹ 30 phút.

3. **Lưu ý quan trọng:**
   - ❌ **Tuyệt đối không giặt máy:** Dễ gãy đế, rách upper và bong keo.
   - 🧻 **Bọc khăn giấy ăn khi phơi:** Đắp 2-3 lớp khăn giấy ăn quanh giày giúp hút hết cặn bẩn và ố vàng khi khô.`,
      suggestedProductIds: ['converse-chuck-70', 'nike-air-max-pulse'],
      quickReplies: ['👕 Gợi ý phối đồ đi học', '👟 So sánh AF1 và Stan Smith', '📏 Hướng dẫn đo size']
    };
  }

  if (lower.includes('so sánh') || lower.includes('stan smith') || lower.includes('air force') || lower.includes('af1') || lower.includes('vs')) {
    return {
      reply: `👟 **SO SÁNH CHI TIẾT: NIKE AIR FORCE 1 '07 vs ADIDAS STAN SMITH**

- **Nike Air Force 1 '07:**
  - *Phong cách:* Streetwear, Hip-hop, Chunky cá tính và tôn dáng (đế cao ~3.8cm).
  - *Đặc điểm:* Da lì dày dặn, đệm Air ở gót chân, form to rộng rãi (chân thon có thể lùi 0.5 size).
  - *Hợp với:* Quần ống rộng, Cargo Pants túi hộp, Streetwear năng động.

- **Adidas Stan Smith:**
  - *Phong cách:* Minimalist, Vintage, Cổ điển thanh lịch (đế bệt ~2.5cm).
  - *Đặc điểm:* Da mềm mại, form gọn gàng, siêu nhẹ, đi làm hoặc đi học đều cực kỳ lịch thiệp.
  - *Hợp với:* Quần Tây, Chinos, sơ mi hoặc chân váy.

💡 **Kết luận:** Muốn cá tính & hack dáng chọn **Air Force 1 / Air Max Pulse**; muốn thanh lịch đa năng hàng ngày chọn **Stan Smith / Samba**!`,
      suggestedProductIds: ['nike-air-max-pulse', 'adidas-samba-classic', 'converse-chuck-70'],
      quickReplies: ['👕 Gợi ý phối đồ đi học/đi làm', '💰 Tìm giày hot dưới 2.5 triệu', '🧼 Cách vệ sinh không bị ố']
    };
  }

  if (lower.includes('phối đồ') || lower.includes('outfit') || lower.includes('đi học') || lower.includes('đi làm') || lower.includes('mặc gì') || lower.includes('streetwear')) {
    return {
      reply: `👕 **GỢI Ý PHỐI ĐỒ SNEAKER ĐI HỌC / ĐI LÀM TRẺ TRUNG & LỊCH LÃM:**

1. **Phối đồ Đi Học / Đi Làm (Smart Casual):**
   - **Áo:** Sơ mi Oxford ngắn tay khoác ngoài áo thun basic trắng trơn.
   - **Quần:** Quần Chinos ống suông hoặc quần Jeans đen tối giản.
   - **Giày:** **Adidas Samba Classic** hoặc **Converse Chuck 70** tạo diện mạo trẻ trung, lịch sự.

2. **Phối đồ Dạo Phố / Cà Phê (Streetwear phóng khoáng):**
   - **Áo:** Phông Oversize graphic hoặc Hoodie nỉ dáng rộng.
   - **Quần:** Quần túi hộp Cargo Pants hoặc quần nỉ Jogger.
   - **Giày:** **Nike Air Max Pulse** hoặc **Puma RS-X** hầm hố phá cách.

3. **Phong cách Nữ Tôn Dáng:**
   - Chân váy xếp ly / Quần Jeans ống loe + **Converse Run Star Hike** (đế bánh mì hack chiều cao 5cm).`,
      suggestedProductIds: ['adidas-samba-classic', 'nike-air-max-pulse', 'converse-run-star'],
      quickReplies: ['💰 Giày hot dưới 2.5 triệu', '📏 Cách đo size cho chân bè', '🔥 Mã giảm giá SOLE20']
    };
  }

  if (lower.includes('chân bè') || lower.includes('bè ngang') || lower.includes('đo size') || lower.includes('chọn size') || lower.includes('chân dày')) {
    return {
      reply: `📏 **HƯỚNG DẪN ĐO VÀ CHỌN SIZE CHO BÀN CHÂN BÈ NGANG:**

1. **Cách đo chiều dài bàn chân tại nhà:**
   - Đặt bàn chân lên tờ giấy trắng sát mép tường.
   - Đánh dấu đỉnh ngón chân dài nhất và gót chân.
   - Đo chiều dài (cm) và cộng thêm **0.5cm - 1.0cm** để chân cử động thoải mái.

2. **Kinh nghiệm chọn size từng hãng:**
   - **Nike / Adidas (Giày chạy):** Nên **TĂNG 0.5 size** (ví dụ bình thường đi 41 thì chọn 41.5 hoặc 42) để không bị tức 2 bên má bàn chân.
   - **Converse Chuck 70:** Form giày dài nhưng mũi thon, người chân bè nên đi **True to size (đúng size thông thường)**.
   - **Puma RS-X:** Thiết kế chunky khoang mũi rộng, đi đúng size rất êm ái.

👉 Bạn có thể bấm vào nút **"🤖 Gợi ý size bằng AI"** ở trang chi tiết sản phẩm để tính toán size chuẩn xác nhất nhé!`,
      suggestedProductIds: ['puma-rsx-retro', 'adidas-ultraboost-light', 'nike-air-max-pulse'],
      quickReplies: ['👟 So sánh AF1 và Stan Smith', '🛡️ Chính sách đổi size', '🔥 Mã giảm giá SOLE20']
    };
  }

  if (lower.includes('dưới 2') || lower.includes('dưới 3') || lower.includes('2.5 triệu') || lower.includes('ngân sách') || lower.includes('giá rẻ') || lower.includes('sinh viên')) {
    return {
      reply: `💰 **TOP SNEAKER CHÍNH HÃNG CỰC HOT DƯỚI 2.5 - 3.0 TRIỆU ĐỒNG TẠI K-NICKS:**

1. **Converse Chuck Taylor '70** (~2.100.000đ):
   - Mẫu giày huyền thoại không bao giờ lỗi mốt, vải canvas 12oz dày dặn, lót OrthoLite êm ái.
2. **Converse Run Star Hike** (~2.800.000đ):
   - Đột phá thời trang với đế răng cưa hack dáng 5cm cực đỉnh.
3. **Adidas Samba Classic** (~2.900.000đ):
   - Cơn sốt retro thời thượng toàn cầu, phối đồ cực kỳ đa năng.
4. **Puma RS-X Retro Drift** (~3.400.000đ - *Áp mã SOLE20 còn ~2.720.000đ*):
   - Chunky sneaker đậm chất tương lai, đệm RS êm chân.

🎁 **Mẹo:** Đừng quên áp dụng mã giảm giá **SOLE20** (-20%) ở bước thanh toán nhé!`,
      suggestedProductIds: ['converse-chuck-70', 'converse-run-star', 'adidas-samba-classic'],
      quickReplies: ['🔥 Nhận mã SOLE20 ngay', '👕 Gợi ý phối đồ đi học', '🛡️ Chính sách đổi trả']
    };
  }

  if (lower.includes('đổi trả') || lower.includes('bảo hành') || lower.includes('ship') || lower.includes('chính sách') || lower.includes('cod') || lower.includes('kiểm tra')) {
    return {
      reply: `🛡️ **CHÍNH SÁCH BẢO HÀNH & ĐỔI TRẢ VƯỢT TRỘI TẠI K-NICKS:**

- 🔄 **Đổi size / Đổi mẫu trong 30 ngày:** Miễn phí 100% khi giày không vừa chân hoặc bạn muốn đổi màu khác (giày chưa sử dụng ngoài đường, còn nguyên tem hộp).
- 🛠️ **Bảo hành keo chỉ 6 tháng:** Bảo hành keo dán, đường may và hỗ trợ làm sạch miễn phí lần đầu.
- 📦 **Đồng kiểm hàng khi nhận (COD):** Bạn được mở hộp kiểm tra giày, soi tem mác và thử chân thoải mái trước khi thanh toán.
- 🚚 **Giao hàng toàn quốc:**
  - Hỏa tốc 2H tại nội thành TP.HCM & Hà Nội.
  - Giao toàn quốc 2-4 ngày.
  - Miễn phí vận chuyển cho đơn từ **1.500.000đ** (nhập mã **FREESHIP**).`,
      suggestedProductIds: ['nike-air-max-pulse', 'converse-chuck-70'],
      quickReplies: ['🔥 Lấy mã SOLE20 giảm 20%', '📏 Cách đo size chuẩn', '👟 Giày hot dưới 2.5 triệu']
    };
  }

  if (lower.includes('chạy bộ') || lower.includes('running') || lower.includes('marathon') || lower.includes('thể dục') || lower.includes('gym')) {
    return {
      reply: `🏃 **TƯ VẤN GIÀY CHẠY BỘ & THỂ THAO ÊM ÁI NHẤT TẠI K-NICKS:**

1. **Adidas Ultraboost Light** (Chạy hằng ngày / Gym / Đi bộ):
   - Đế **Light BOOST** thế hệ mới nhẹ hơn 30%, hoàn trả năng lượng tối đa và bảo vệ khớp gối êm ái.
2. **Nike ZoomX Vaporfly 3** (Chạy Marathon / Bứt tốc cự ly dài):
   - Đĩa đệm **Carbon Flyplate** cùng bọt ZoomX siêu nhẹ giúp đẩy người về phía trước với hiệu suất cao nhất.

💡 **Mẹo chọn size chạy bộ:** Nên tăng **0.5 size (Up 0.5 size)** so với giày đi chơi thông thường để các ngón chân không bị ép khi tiếp đất nhé!`,
      suggestedProductIds: ['adidas-ultraboost-light', 'nike-vaporfly-3'],
      quickReplies: ['📏 Hướng dẫn đo size', '🧼 Cách vệ sinh giày', '🔥 Mã giảm giá SOLE20']
    };
  }

  if (lower.includes('mã giảm') || lower.includes('voucher') || lower.includes('khuyến mãi') || lower.includes('discount') || lower.includes('sale')) {
    return {
      reply: `🔥 **MÃ GIẢM GIÁ & ƯU ĐÃI ĐỘC QUYỀN HÔM NAY TẠI K-NICKS:**

- 🎟️ **SOLE20**: Giảm ngay **20%** (tối đa 200.000đ) cho mọi đơn hàng từ 500.000đ.
- 🎟️ **KNICKS10**: Giảm **10%** (tối đa 150.000đ) dành cho thành viên mới.
- 🚚 **FREESHIP**: Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1.500.000đ.

👉 Bạn chỉ cần copy mã và dán vào ô **Mã giảm giá** trong Giỏ hàng hoặc trang Thanh toán nhé!`,
      suggestedProductIds: ['nike-air-max-pulse', 'adidas-ultraboost-light'],
      quickReplies: ['💰 Giày hot dưới 2.5 triệu', '👕 Gợi ý phối đồ đi làm', '👟 So sánh AF1 và Stan Smith']
    };
  }

  // Default response
  return {
    reply: `Chào bạn! Tôi là **N-KICKS AI Stylist** 🤖 - Trợ lý Thời trang & Chuyên gia Giày Sneaker cao cấp của K-NICKS.

Tôi luôn sẵn sàng giải đáp và tư vấn cho bạn:
- 👟 **Tư vấn chọn giày:** Phù hợp với dáng chân, mục đích (đi chơi, đi học, chạy bộ, tập gym).
- 📏 **Tư vấn size chuẩn xác:** Xử lý chân bè, chân thon, quy đổi size Nike/Adidas/Puma/Converse.
- 👕 **Mix & Match Outfit:** Phối đồ Streetwear, Casual, Minimalist thời thượng.
- 🧼 **Bảo quản & Vệ sinh:** Hướng dẫn làm sạch, tẩy ố vàng, phân biệt giày chính hãng.
- 💰 **Gợi ý theo ngân sách & Mã giảm giá:** Áp dụng voucher **SOLE20** giảm 20%.

Bạn đang quan tâm đến phong cách giày nào hoặc cần tư vấn điều gì không ạ?`,
    suggestedProductIds: ['nike-air-max-pulse', 'adidas-samba-classic', 'puma-rsx-retro'],
    quickReplies: [
      '🧼 Cách vệ sinh không bị ố vàng?',
      '👟 So sánh AF1 và Stan Smith',
      '👕 Gợi ý phối đồ đi học',
      '💰 Giày hot dưới 2.5 triệu'
    ]
  };
}

export default function AiAssistantWidget({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenCart
}: AiAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasDismissedTooltip, setHasDismissedTooltip] = useState(false);

  // Show tooltip bubble after 2 seconds on page
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasDismissedTooltip && !isOpen) {
        setShowTooltip(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasDismissedTooltip, isOpen]);

  // Hide tooltip when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Xin chào! Tôi là **N-KICKS AI Stylist** 🤖 - Trợ lý Thời trang & Chuyên gia Giày Sneaker của K-NICKS.

Tôi có thể hỗ trợ bạn mọi thắc mắc:
- ✨ **Tìm đôi sneaker chuẩn gu** theo phong cách, dáng chân và ngân sách.
- 📏 **Tư vấn chọn size chuẩn** (chân bè, chân thon, bảng size Nike/Adidas/Puma/Converse).
- 👕 **Gợi ý phối đồ (Mix & Match)** đi học, đi làm, dạo phố cực chất.
- 🧼 **Mẹo vệ sinh & tẩy ố vàng** giữ giày luôn như mới.
- 🔥 **Cập nhật mã giảm giá & chính sách bảo hành** đổi trả 30 ngày.

Bạn có thể bấm vào các gợi ý bên dưới hoặc gửi bất kỳ câu hỏi nào cho tôi nhé! 👇`,
      suggestedProductIds: ['nike-air-max-pulse', 'adidas-samba-classic'],
      quickReplies: [
        '🧼 Cách vệ sinh không bị ố vàng?',
        '👟 So sánh AF1 và Stan Smith',
        '👕 Gợi ý phối đồ đi học/đi làm',
        '💰 Tìm giày hot dưới 2.5 triệu'
      ],
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen, isMinimized]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }));

      // Connect to Backend: POST ${API_BASE_URL}/ai/chat with ngrok-skip-browser-warning header
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ message: query, history: historyPayload })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || getClientSideAiFallback(query).reply,
        suggestedProductIds: data.suggestedProductIds || getClientSideAiFallback(query).suggestedProductIds,
        quickReplies: data.quickReplies || getClientSideAiFallback(query).quickReplies,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Backend chat API failed, activating client-side intelligent fallback engine:', err);
      // Seamless client-side intelligent fallback response
      const fallbackResult = getClientSideAiFallback(query);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackResult.reply,
        suggestedProductIds: fallbackResult.suggestedProductIds,
        quickReplies: fallbackResult.quickReplies,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Đoạn chat đã được làm mới! Tôi là **N-KICKS AI Stylist** ✨. Bạn cần tư vấn về chọn giày, phối đồ, cách đo size hay kiểm tra mã giảm giá nào hôm nay?`,
        suggestedProductIds: ['nike-air-max-pulse', 'converse-chuck-70'],
        quickReplies: [
          '🧼 Cách vệ sinh không bị ố vàng?',
          '👟 So sánh AF1 và Stan Smith',
          '👕 Gợi ý phối đồ đi học',
          '💰 Giày hot dưới 2.5 triệu'
        ],
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleQuickAdd = (product: Product) => {
    const size = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 40;
    const color = (product.colors && product.colors.length > 0) ? product.colors[0] : { name: 'Mặc định', hex: '#111111' };
    onAddToCart(product, size, color, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2500);
  };

  // Find products matching suggested IDs or keywords
  const getProductsByIds = (ids?: string[]) => {
    if (!ids || ids.length === 0) return [];
    return products.filter((p) => 
      ids.includes(p.id) || ids.some((id) => p.id.toLowerCase().includes(id.toLowerCase()))
    ).slice(0, 3);
  };

  // Latest assistant message for dynamic quick replies
  const lastAssistantMessage = [...messages].reverse().find((m) => m.sender === 'assistant');

  return (
    <>
      {/* 1. FLOATING AI WIDGET BUTTON (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* INTERACTIVE TOOLTIP BUBBLE */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              className="pointer-events-auto relative bg-white/95 backdrop-blur-md text-neutral-800 border border-neutral-200/90 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.15)] rounded-2xl p-3 pr-8 max-w-[270px] cursor-pointer group hover:border-[#FF5400]/50 hover:shadow-[0_14px_35px_-5px_rgba(255,84,0,0.2)] transition-all"
              id="ai-widget-tooltip"
            >
              {/* Close tooltip button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                  setHasDismissedTooltip(true);
                }}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                title="Đóng gợi ý"
                aria-label="Đóng gợi ý"
              >
                <X size={13} className="stroke-[2.5]" />
              </button>

              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0 select-none animate-bounce [animation-duration:2.5s]">
                  👋
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-black text-[#FF5400] flex items-center gap-1">
                      <Sparkles size={13} className="fill-[#FF5400]" />
                      N-KICKS Stylist
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </div>
                  <p className="text-[11px] font-semibold text-neutral-700 leading-snug">
                    Cần tư vấn chọn size hay phối đồ chuẩn gu?
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium pt-0.5 flex items-center gap-1">
                    <span className="text-[#FF5400] font-bold">Bấm để chat</span>
                    <span>• Sẵn sàng 24/7</span>
                  </p>
                </div>
              </div>

              {/* Chat Bubble Tail Pointer pointing downward towards the button */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/95 border-b border-r border-neutral-200/90 rotate-45 transform pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN FLOATING TRIGGER BUTTON (58px x 58px) */}
        <motion.div className="relative pointer-events-auto">
          {/* Subtle Radiating Pulse Waves */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#FF5400] opacity-30 blur-xs animate-ping [animation-duration:3s] pointer-events-none" />
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FF5400] to-[#FF7700] opacity-20 blur-md animate-pulse [animation-duration:2s] pointer-events-none" />
            </>
          )}

          <motion.button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setIsMinimized(false);
              setShowTooltip(false);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative group h-14 w-14 sm:h-[58px] sm:w-[58px] rounded-full bg-gradient-to-tr from-[#FF5400] via-[#FF6600] to-[#FF7700] text-white shadow-[0_8px_25px_rgba(255,84,0,0.4)] hover:shadow-[0_12px_32px_rgba(255,84,0,0.65)] flex items-center justify-center cursor-pointer border-2 border-white/40 transition-all z-10"
            id="floating-ai-assistant-btn"
            aria-label="Mở Trợ lý N-KICKS AI Stylist"
          >
            {/* Center Icon: AI Sparkles with rotation / glow on hover */}
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              {isOpen ? (
                <X size={24} className="stroke-[2.5] text-white" />
              ) : (
                <Sparkles size={25} className="fill-white text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>

            {/* Online Green Status Dot */}
            {!isOpen && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </span>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* 2. AI CHAT MODAL / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 bg-white shadow-2xl border border-neutral-200/90 flex flex-col overflow-hidden transition-all duration-200 ${
              isMinimized
                ? 'bottom-24 right-6 w-80 sm:w-96 rounded-2xl h-16'
                : 'bottom-4 sm:bottom-6 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[440px] max-w-[460px] rounded-3xl h-[650px] max-h-[88vh]'
            }`}
            id="ai-chat-modal"
          >
            {/* MODAL HEADER */}
            <div className="bg-neutral-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#FF5400] to-[#FF8800] flex items-center justify-center text-white shadow-md">
                    <Bot size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-neutral-950 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      N-KICKS AI ASSISTANT
                    </h3>
                    <span className="px-1.5 py-0.2 bg-[#FF5400]/20 border border-[#FF5400]/40 text-[#FF8800] text-[9px] font-black rounded-md uppercase">
                      Stylist
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                    Đang trực tuyến (Sẵn sàng 24/7)
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Làm mới đoạn chat"
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  id="ai-chat-refresh-btn"
                >
                  <RotateCcw size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  id="ai-chat-minimize-btn"
                >
                  {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Đóng"
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  id="ai-chat-close-btn"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* CHAT BODY - Hidden when minimized */}
            {!isMinimized && (
              <>
                {/* MESSAGES SCROLL CONTAINER */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] text-neutral-800 text-xs">
                  
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const suggestedProducts = getProductsByIds(msg.suggestedProductIds);

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* AI Avatar */}
                        {!isUser && (
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#FF5400] to-[#FF8800] flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                            <Bot size={15} />
                          </div>
                        )}

                        <div className={`max-w-[88%] sm:max-w-[85%] space-y-2`}>
                          
                          {/* Bubble */}
                          <div
                            className={`p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                              isUser
                                ? 'bg-neutral-900 text-white rounded-tr-xs ml-auto'
                                : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-tl-xs'
                            }`}
                          >
                            {isUser ? (
                              <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                            ) : (
                              <div className="markdown-body space-y-2 leading-relaxed">
                                <Markdown>{msg.text}</Markdown>
                              </div>
                            )}
                          </div>

                          {/* Timestamp */}
                          <div className={`text-[10px] text-neutral-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp}
                          </div>

                          {/* SUGGESTED PRODUCT MINI CARDS */}
                          {suggestedProducts.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={11} className="text-[#FF5400]" />
                                Gợi ý giày phù hợp:
                              </span>
                              <div className="space-y-2">
                                {suggestedProducts.map((prod) => (
                                  <div
                                    key={prod.id}
                                    className="p-2.5 bg-white rounded-2xl border border-neutral-200/90 shadow-xs flex items-center gap-3 hover:border-black/30 transition-all group"
                                  >
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="h-14 w-14 object-contain rounded-xl bg-neutral-50 border border-neutral-100 p-1 shrink-0 group-hover:scale-105 transition-transform"
                                      referrerPolicy="no-referrer"
                                    />
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black uppercase text-[#FF5400] bg-orange-50 px-1.5 py-0.5 rounded">
                                          {prod.brand}
                                        </span>
                                        <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold ml-auto">
                                          <Star size={10} className="fill-amber-400 text-amber-400" />
                                          <span>{prod.rating || 5.0}</span>
                                        </div>
                                      </div>

                                      <h4 className="text-xs font-bold text-neutral-900 truncate mt-0.5">
                                        {prod.name}
                                      </h4>

                                      <p className="text-xs font-black text-neutral-900 mt-0.5">
                                        {formatPrice(prod.price)}
                                      </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onSelectProduct(prod);
                                          setIsMinimized(true);
                                        }}
                                        className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <span>Xem</span>
                                        <ArrowRight size={10} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleQuickAdd(prod)}
                                        className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                                          addedProductId === prod.id
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : 'border-neutral-200 hover:border-black text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                      >
                                        {addedProductId === prod.id ? (
                                          <>
                                            <Check size={10} className="stroke-[3]" />
                                            <span>Đã thêm</span>
                                          </>
                                        ) : (
                                          <>
                                            <ShoppingCart size={10} />
                                            <span>Thêm</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CONTEXTUAL QUICK REPLIES UNDER LAST ASSISTANT MESSAGE */}
                          {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && msg.id === lastAssistantMessage?.id && !isLoading && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {msg.quickReplies.map((replyText, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSendMessage(replyText)}
                                  className="text-[10px] font-bold text-neutral-700 bg-white hover:bg-orange-50 hover:text-[#FF5400] hover:border-[#FF5400]/40 border border-neutral-200/90 px-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer text-left"
                                >
                                  {replyText}
                                </button>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}

                  {/* LOADING TYPING INDICATOR */}
                  {isLoading && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#FF5400] to-[#FF8800] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Bot size={15} />
                      </div>
                      <div className="p-3.5 bg-white rounded-2xl rounded-tl-xs border border-neutral-200/90 shadow-xs flex items-center gap-2">
                        <div className="flex gap-1.5 items-center">
                          <span className="h-2 w-2 rounded-full bg-[#FF5400] animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-[#FF5400] animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-[#FF5400] animate-bounce" />
                        </div>
                        <span className="text-[11px] font-bold text-neutral-600">
                          N-KICKS AI đang phân tích & trả lời...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* HORIZONTAL QUICK PROMPTS SCROLL BAR */}
                <div className="px-3 py-2 bg-neutral-50/80 border-t border-neutral-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider shrink-0 flex items-center gap-0.5 mr-0.5">
                    <Compass size={10} className="text-[#FF5400]" />
                    Chủ đề:
                  </span>
                  {DIVERSE_QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSendMessage(prompt.text)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 rounded-full bg-white hover:bg-orange-50 hover:text-[#FF5400] hover:border-[#FF5400]/40 border border-neutral-200/90 text-[10px] font-bold text-neutral-700 whitespace-nowrap shadow-2xs transition-all cursor-pointer shrink-0 disabled:opacity-50 active:scale-95"
                    >
                      {prompt.text}
                    </button>
                  ))}
                </div>

                {/* INPUT BAR */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white border-t border-neutral-200/90 flex items-center gap-2 shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Hỏi về phối đồ, chọn size, tẩy ố, so sánh giày..."
                    disabled={isLoading}
                    className="flex-1 bg-neutral-100/80 border border-neutral-200 rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-neutral-400"
                    id="ai-chat-input-field"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#FF5400] to-[#FF7700] hover:from-[#e04a00] hover:to-[#ff6600] text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 shrink-0"
                    id="ai-chat-send-btn"
                    aria-label="Gửi tin nhắn"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
