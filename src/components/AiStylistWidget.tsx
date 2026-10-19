import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  ArrowUp, 
  Square, 
  RotateCcw, 
  ChevronRight, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Bot,
  User,
  ShoppingBag
} from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  quickReplies?: string[];
  isStreaming?: boolean;
}

interface AiStylistWidgetProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, category?: string, product?: Product) => void;
}

const DEFAULT_QUICK_CHIPS = [
  '👟 Tư vấn chọn size cho chân bè',
  '👕 Gợi ý phối đồ phong cách Streetwear',
  '🔥 Mẫu giày nào đang bán chạy nhất?',
  '🧼 Hướng dẫn vệ sinh và tẩy ố giày',
  '🎁 Hôm nay có mã giảm giá nào không?'
];

const INITIAL_WELCOME_TEXT = `👋 **Chào bạn! Tôi là K-NICKS AI Stylist.**

Tôi là trợ lý AI chuyên tư vấn giày thể thao, định hình phong cách thời trang và tìm deal giảm giá tốt nhất tại shop **K-NICKS**.

Bạn đang cần tìm giày theo phong cách nào, hay cần hỗ trợ chọn size chuẩn xác hôm nay?`;

export default function AiStylistWidget({
  products,
  onQuickView,
  onNavigate
}: AiStylistWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentFullTextRef = useRef<string>('');
  const currentStreamingIdRef = useRef<string>('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: DEFAULT_QUICK_CHIPS
    }
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto focus textarea
      setTimeout(() => textareaRef.current?.focus(), 250);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Stop streaming generator
  const handleStopGenerating = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    const streamingId = currentStreamingIdRef.current;
    if (streamingId && currentFullTextRef.current) {
      setMessages(prev => prev.map(m => 
        m.id === streamingId 
          ? { ...m, text: currentFullTextRef.current, isStreaming: false } 
          : m
      ));
    }
    setIsStreaming(false);
    setIsLoading(false);
  };

  // Reset conversation to initial state
  const handleResetChat = () => {
    handleStopGenerating();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: INITIAL_WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: DEFAULT_QUICK_CHIPS
      }
    ]);
  };

  // Copy message text to clipboard
  const handleCopyMessage = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  // Start real-time typewriter / streaming effect like ChatGPT
  const startTypewriterEffect = (
    fullText: string, 
    suggestedIds: string[] = [], 
    quickReplies: string[] = []
  ) => {
    const aiMessageId = `ai-${Date.now()}`;
    currentFullTextRef.current = fullText;
    currentStreamingIdRef.current = aiMessageId;

    // Add empty placeholder message with streaming flag
    setMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: suggestedIds,
        quickReplies: quickReplies,
        isStreaming: true
      }
    ]);

    setIsLoading(false);
    setIsStreaming(true);

    // Split text into words to simulate natural ChatGPT word-by-word streaming
    const words = fullText.split(' ');
    let wordIndex = 0;

    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    streamIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        wordIndex += 1;
        const currentChunk = words.slice(0, wordIndex).join(' ');
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, text: currentChunk } : m
        ));
        scrollToBottom();
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, isStreaming: false } : m
        ));
        setIsStreaming(false);
      }
    }, 28);
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (isStreaming) {
      handleStopGenerating();
      return;
    }

    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const tryFetch = async (url: string) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: query,
            history: messages.slice(-6).map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.text
            }))
          })
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return await res.json();
        }
      } catch {
        // fetch failed or aborted
      }
      return null;
    };

    try {
      const data = await tryFetch('/api/ai/chat');

      if (data && data.reply) {
        clearTimeout(timeoutId);
        startTypewriterEffect(
          data.reply,
          data.suggestedProductIds || [],
          data.quickReplies && data.quickReplies.length > 0 ? data.quickReplies : DEFAULT_QUICK_CHIPS.slice(0, 3)
        );
        return;
      }
    } catch (err) {
      console.warn('API call fallback to client-side smart stylist engine:', err);
    } finally {
      clearTimeout(timeoutId);
    }

    // Intelligent Client-side Instant Fallback with streaming
    const fallback = generateSmartFallbackReply(query, products);
    startTypewriterEffect(fallback.reply, fallback.suggestedIds, fallback.quickReplies);
  };

  const generateSmartFallbackReply = (query: string, allProducts: Product[]) => {
    const q = query.toLowerCase();

    // 0. Specific size query (e.g. size 38, size 39, 40, 41...)
    const sizeMatch = q.match(/\b(3[5-9]|4[0-6])(?:\.5)?\b/);
    if (sizeMatch) {
      const targetSize = parseFloat(sizeMatch[1]);
      const matched = allProducts.filter(p => p.sizes && (p.sizes.includes(targetSize) || p.sizes.some(s => Number(s) === targetSize)));
      if (matched.length > 0) {
        return {
          reply: `👟 **Dạ CÓ bạn nhé! Hiện tại K-NICKS đang có sẵn các mẫu giày Size ${targetSize} sau đây:**\n\n` +
            matched.slice(0, 4).map(p => `• **${p.name}** (${p.brand} - ${p.category}): Giá **${(p.price || 0).toLocaleString('vi-VN')}đ** (Còn sẵn Size ${targetSize})`).join('\n') +
            `\n\nTất cả sản phẩm đều là **hàng chính hãng 100%**, có đầy đủ hộp tem mác và được hỗ trợ **thử giày, đổi size miễn phí trong 30 ngày** nếu mang không vừa.\n\n` +
            `👉 *Bạn có thể bấm nút **'Xem'** ở các thẻ sản phẩm bên dưới để xem chi tiết và đặt hàng ngay nhé!*`,
          suggestedIds: matched.slice(0, 4).map(p => p.id),
          quickReplies: [`Tư vấn form giày size ${targetSize}`, 'Gợi ý phối đồ Streetwear', 'Hôm nay có mã giảm giá nào?']
        };
      } else {
        return {
          reply: `Rất tiếc hiện tại các mẫu giày **Size ${targetSize}** tạm thời đang hết hàng hoặc đang về thêm lô mới tại kho.\n\n` +
            `Tuy nhiên bạn có thể tham khảo size liền kề (${targetSize - 0.5} hoặc ${targetSize + 0.5}) hoặc các mẫu bán chạy khác dưới đây:`,
          suggestedIds: allProducts.slice(0, 3).map(p => p.id),
          quickReplies: ['Tư vấn chọn size chân bè', 'Mẫu giày bán chạy nhất', 'Mã giảm giá hôm nay']
        };
      }
    }

    // Size recommendation
    if (q.includes('size') || q.includes('bè') || q.includes('chân') || q.includes('đo')) {
      return {
        reply: `📏 **Tư Vấn Chọn Size Giày Chuẩn Xác Tại K-NICKS:**\n\n` +
          `• **Chân bè ngang / mu bàn chân dày:** Bạn nên **tăng thêm 0.5 đến 1 size** (ví dụ bình thường đi 41 thì chọn 41.5 hoặc 42) để không bị tức mũi hoặc ép mu bàn chân.\n` +
          `• **Giày chạy bộ (Running):** Nên chọn dư 0.5 - 1cm ở mũi chân để ngón chân không bị thâm khi vận động bứt tốc.\n` +
          `• **Chính sách K-NICKS:** Hỗ trợ **đổi trả, đổi size miễn phí trong 30 ngày** tận nhà!\n\n` +
          `👉 *Bạn muốn tôi tư vấn size cụ thể cho dòng giày Nike, Adidas hay Puma?*`,
        suggestedIds: allProducts.filter(p => p.category?.toLowerCase().includes('sneaker') || p.category?.toLowerCase().includes('chạy')).slice(0, 2).map(p => p.id),
        quickReplies: ['Xem bảng size chi tiết', 'Tư vấn giày chạy bộ', 'Mã giảm giá hôm nay']
      };
    }

    // Outfit Styling
    if (q.includes('phối') || q.includes('mặc') || q.includes('quần') || q.includes('áo') || q.includes('đồ') || q.includes('style')) {
      return {
        reply: `👕 **Gợi Ý Phối Đồ Chuẩn Gu Cùng K-NICKS Stylist:**\n\n` +
          `1. **Phong cách Streetwear / Hip-hop năng động:** Quần ống rộng (Cargo pants / Baggy) + Áo Hoodie Oversize phối cùng **Puma RS-X** hoặc **Nike Air Max Pulse** tạo nét phá cách đậm chất đường phố.\n` +
          `2. **Phong cách Casual / Đi học / Đi dạo:** Quần Jean thẳng hoặc Kaki xắn gấu + Áo phông Basic phối cùng **Adidas Samba** hoặc **Converse Chuck 70** thanh lịch, trẻ trung.\n` +
          `3. **Phong cách Smart Casual đi làm:** Quần Tây / Chinos + Áo sơ mi Oxford phối cùng **Giày Tây Oxford Classic Leather** lịch lãm.\n\n` +
          `Bạn đang thích phong cách nào nhất trong 3 phong cách trên?`,
        suggestedIds: allProducts.slice(0, 3).map(p => p.id),
        quickReplies: ['Phong cách Streetwear', 'Phong cách Đi làm thanh lịch', 'Xem giày hot nhất']
      };
    }

    // Cleaning & Care
    if (q.includes('vệ sinh') || q.includes('giặt') || q.includes('ố') || q.includes('bảo quản')) {
      return {
        reply: `🧼 **Bí Quyết Vệ Sinh & Bảo Quản Giày Bền Đẹp Như Mới:**\n\n` +
          `• ❌ **Tuyệt đối không:** Giặt giày bằng máy giặt hoặc ngâm bột giặt thông thường (dễ làm gãy form, bung keo nhiệt và ố vàng đế cao su).\n` +
          `• ✅ **Nên dùng:** Bộ bọt vệ sinh chuyên dụng (như **K-Nicks Care Foam**), chải nhẹ bằng bàn chải lông mềm và lau khô bằng khăn sợi microfiber.\n` +
          `• ☀️ **Phơi giày:** Luôn hong khô ở nơi râm mát, thoáng khí, tránh ánh nắng gắt trực tiếp. Có thể nhét giấy báo hút ẩm bên trong để giữ form giày hoàn hảo.`,
        suggestedIds: allProducts.filter(p => p.category?.toLowerCase().includes('vệ sinh') || p.category?.toLowerCase().includes('phụ kiện') || p.name?.toLowerCase().includes('dây')).slice(0, 2).map(p => p.id),
        quickReplies: ['Xem phụ kiện K-NICKS', 'Tư vấn giày thể thao', 'Mã giảm giá hôm nay']
      };
    }

    // Promotions / Discounts
    if (q.includes('giảm giá') || q.includes('khuyến mãi') || q.includes('voucher') || q.includes('mã') || q.includes('sale') || q.includes('deal')) {
      return {
        reply: `🎁 **Các Chương Trình Ưu Đãi Đang Áp Dụng Tại K-NICKS:**\n\n` +
          `• Nhập mã **\`SOLE20\`**: Giảm ngay **20%** (tối đa 200.000đ) cho đơn hàng từ 500.000đ.\n` +
          `• Nhập mã **\`SOLE300\`**: Giảm thẳng **300.000đ** cho các dòng Sneaker cao cấp từ 2.500.000đ.\n` +
          `• **Miễn phí vận chuyển toàn quốc (Freeship)**: Áp dụng tự động cho mọi đơn hàng từ **500.000đ**.\n\n` +
          `Bạn có thể nhập các mã này tại bước Giỏ hàng hoặc Thanh toán để nhận ưu đãi ngay!`,
        suggestedIds: allProducts.filter(p => p.isPromotion || p.isHot).slice(0, 3).map(p => p.id),
        quickReplies: ['Xem sản phẩm giảm giá', 'Mẫu mới về (New)', 'Hướng dẫn đặt hàng']
      };
    }

    // Hot & Best Seller
    return {
      reply: `🔥 **Top Sản Phẩm Nổi Bật Được Săn Đón Nhất Tại K-NICKS:**\n\n` +
        `• **Nike Air Max Pulse**: Đệm khí Air đàn hồi êm ái, thiết kế hiện đại bứt phá năng động.\n` +
        `• **Adidas Samba Classic / Ultraboost**: Biểu tượng streetwear huyền thoại, êm chân từng sải bước.\n` +
        `• **Converse One Star Pro Suede**: Chất liệu da lộn cao cấp, phối đồ cực kỳ tôn dáng.\n\n` +
        `Tôi có thể hỗ trợ tư vấn chi tiết hơn về size chân hoặc phối trang phục cho mẫu nào giúp bạn không?`,
      suggestedIds: allProducts.slice(0, 3).map(p => p.id),
      quickReplies: DEFAULT_QUICK_CHIPS.slice(0, 3)
    };
  };

  // Render markdown line by line with bold and code tags
  const renderFormattedText = (text: string, streaming?: boolean) => {
    return (
      <div className="whitespace-pre-line leading-relaxed">
        {text.split('\n').map((line, idx) => {
          const boldFormatted = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[11px] text-amber-600 font-bold border border-neutral-200/60">$1</code>');
          return (
            <p 
              key={idx} 
              className={idx > 0 ? 'mt-1.5' : ''}
              dangerouslySetInnerHTML={{ __html: boldFormatted }}
            />
          );
        })}
        {streaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse align-middle rounded-xs" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON (MÀU CAM RỰC RỠ NHƯ HÌNH 2) */}
      <div className="fixed bottom-6 right-6 z-[9999] select-none pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl hover:shadow-orange-500/30 transition-all cursor-pointer focus:outline-none ring-4 ${
            isOpen
              ? 'bg-neutral-900 border border-neutral-700 ring-neutral-800'
              : 'bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 ring-orange-300/40'
          }`}
          id="btn-ai-stylist-toggle"
          title="K-NICKS AI Stylist - Tư vấn thời trang 24/7"
        >
          {isOpen ? (
            <X size={26} className="text-white transition-transform duration-200" />
          ) : (
            <>
              <Sparkles size={28} className="text-white drop-shadow-sm animate-pulse" />
              {/* Online Green Indicator Dot */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* 2. CHATGPT-STYLE INTERACTIVE CHAT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-24 right-4 sm:right-6 z-[9999] flex flex-col overflow-hidden rounded-[26px] border border-neutral-200/90 bg-white shadow-2xl transition-all duration-300 backdrop-blur-md ${
              isExpanded 
                ? 'w-[95vw] sm:w-[90vw] max-w-[680px] h-[84vh]' 
                : 'w-[94vw] sm:w-[420px] h-[600px] max-h-[85vh]'
            }`}
          >
            {/* Header Phong cách ChatGPT Tối giản & Tinh tế */}
            <div className="relative flex items-center justify-between bg-neutral-900 px-4 sm:px-5 py-3.5 text-white border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-700 text-amber-400 border border-neutral-700 shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight text-white uppercase">K-NICKS AI</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      GPT Engine
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400">Trợ lý AI chọn size & định hình phong cách</p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1 text-neutral-400">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="rounded-lg p-1.5 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  title="Cuộc trò chuyện mới"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-lg p-1.5 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  title="Đóng chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[88%]">
                    {msg.sender === 'ai' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-amber-400 text-xs font-bold shadow-xs border border-neutral-700 mt-0.5">
                        <Bot size={15} />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div
                        className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-xs transition-all ${
                          msg.sender === 'user'
                            ? 'bg-neutral-900 text-white rounded-tr-xs'
                            : 'bg-white border border-neutral-200/90 text-neutral-800 rounded-tl-xs'
                        }`}
                      >
                        {/* Formatted Text Content */}
                        {renderFormattedText(msg.text, msg.isStreaming)}

                        {/* Product Cards (chỉ hiển thị sau khi AI stream xong) */}
                        {!msg.isStreaming && msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                              <ShoppingBag size={12} className="text-amber-500" />
                              <span>Sản phẩm gợi ý:</span>
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {msg.suggestedProductIds.map((prodId) => {
                                const prod = products.find((p) => p.id === prodId);
                                if (!prod) return null;
                                return (
                                  <div
                                    key={prod.id}
                                    onClick={() => onQuickView(prod)}
                                    className="group/item flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-50 hover:bg-amber-50/50 border border-neutral-200/80 hover:border-amber-300 transition-all cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img
                                        src={prod.image}
                                        alt={prod.name}
                                        className="h-11 w-11 rounded-lg object-contain bg-white border border-neutral-200 p-0.5 shrink-0"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      <div className="min-w-0">
                                        <p className="text-[12px] font-bold text-neutral-900 group-hover/item:text-amber-600 transition-colors truncate">
                                          {prod.name}
                                        </p>
                                        <p className="text-[11px] font-extrabold text-neutral-900">
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onQuickView(prod);
                                      }}
                                      className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-800 border border-neutral-300 hover:border-black hover:bg-black hover:text-white transition-all shadow-2xs shrink-0 cursor-pointer"
                                    >
                                      <span>Xem</span>
                                      <ChevronRight size={11} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Controls on AI Message (Copy & Timestamp) */}
                      <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-neutral-400">
                        <span>{msg.timestamp}</span>

                        {msg.sender === 'ai' && !msg.isStreaming && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="flex items-center gap-1 hover:text-neutral-700 transition-colors cursor-pointer"
                              title="Sao chép câu trả lời"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check size={11} className="text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Đã sao chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Sao chép</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Reply Chips below AI message */}
                  {msg.sender === 'ai' && !msg.isStreaming && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%] pl-9">
                      {msg.quickReplies.map((chip, chipIdx) => (
                        <button
                          key={chipIdx}
                          type="button"
                          onClick={() => handleSendMessage(chip)}
                          className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-neutral-700 border border-neutral-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Dot Loader (khi đang chờ server phản hồi) */}
              {isLoading && !isStreaming && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-amber-400 text-xs font-bold border border-neutral-700 shadow-xs">
                    <Bot size={15} />
                  </div>
                  <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-3 shadow-xs rounded-tl-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Phong cách ChatGPT (Auto-expanding Textarea & Circular Send Button) */}
            <div className="border-t border-neutral-200/90 bg-white p-3 sm:p-3.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isStreaming) {
                    handleStopGenerating();
                  } else {
                    handleSendMessage();
                  }
                }}
                className="relative flex items-end gap-2 bg-[#F3F4F6] rounded-2xl p-2 border border-neutral-200 focus-within:border-neutral-400 focus-within:bg-white transition-all shadow-2xs"
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    // Auto resize textarea height up to 120px
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isStreaming && inputValue.trim()) {
                        handleSendMessage();
                      }
                    }
                  }}
                  placeholder="Hỏi K-NICKS AI về chọn size, phối đồ..."
                  className="flex-1 max-h-28 resize-none bg-transparent px-2.5 py-1.5 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  disabled={isLoading && !isStreaming}
                />

                {/* Nút Send / Stop Generating kiểu ChatGPT */}
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
                    title="Dừng phản hồi"
                  >
                    <Square size={13} className="fill-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all shadow-sm ${
                      inputValue.trim()
                        ? 'bg-black text-white hover:bg-neutral-800 scale-100 cursor-pointer active:scale-95'
                        : 'bg-neutral-300 text-neutral-500 opacity-60 cursor-not-allowed'
                    }`}
                    title="Gửi câu hỏi (Enter)"
                  >
                    <ArrowUp size={16} />
                  </button>
                )}
              </form>

              {/* Disclaimer Footer kiểu ChatGPT */}
              <div className="mt-2 text-center text-[10px] text-neutral-400">
                <span>K-NICKS AI Stylist có thể nhầm lẫn. Vui lòng kiểm tra lại thông tin quan trọng.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
