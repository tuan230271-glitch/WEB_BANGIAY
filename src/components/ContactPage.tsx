import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Truck
} from 'lucide-react';
import { SystemSettings, ContactMessage, UserProfile } from '../types';

interface ContactPageProps {
  settings: SystemSettings;
  user?: UserProfile | null;
  onBackToHome: () => void;
  onSendMessage?: (message: ContactMessage) => void;
  showNotification?: (msg: string) => void;
}

const COMMON_SUBJECTS = [
  'Tư vấn chọn size & mẫu giày',
  'Tra cứu tình trạng đơn hàng',
  'Hỗ trợ đổi trả & bảo hành (30 ngày)',
  'Phản ánh chất lượng dịch vụ & thái độ',
  'Hợp tác truyền thông & đại lý',
  'Chủ đề khác'
];

export default function ContactPage({
  settings,
  user,
  onBackToHome,
  onSendMessage,
  showNotification
}: ContactPageProps) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    customSubject: '',
    content: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const storeName = settings?.storeName || 'K-NICKS';
  const hotline = settings?.hotline || '1900 8463';
  const cleanHotline = hotline.replace(/\s+/g, '');
  const email = settings?.email || 'support@knicks.vn';
  const address = settings?.address || '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh';
  const workingHours = settings?.workingHours || '08:30 - 21:30 (Thứ 2 - Chủ Nhật, kể cả ngày lễ)';
  const googleMapsUrl = settings?.googleMapsUrl;
  const social = settings?.socialLinks;

  // Validation function
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Họ và tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Định dạng email không hợp lệ (Ví dụ: name@gmail.com).';
    }

    // Số điện thoại (tùy chọn nhưng nếu nhập thì kiểm tra)
    if (formData.phone.trim()) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ (gồm 10 chữ số, ví dụ 0987654321).';
      }
    }

    // Chủ đề
    const finalSubject = formData.subject === 'Chủ đề khác' ? formData.customSubject.trim() : formData.subject.trim();
    if (!finalSubject) {
      newErrors.subject = 'Vui lòng chọn hoặc nhập chủ đề liên hệ.';
    }

    // Nội dung
    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung tin nhắn.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Nội dung tin nhắn quá ngắn (tối thiểu 10 ký tự).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const finalSubject = formData.subject === 'Chủ đề khác' ? formData.customSubject.trim() : formData.subject.trim();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      subject: finalSubject,
      content: formData.content.trim(),
      createdAt: formattedDate,
      status: 'Chưa xử lý'
    };

    // Save to persistence
    try {
      const saved = localStorage.getItem('solestyle_contact_messages_v1');
      const messages: ContactMessage[] = saved ? JSON.parse(saved) : [];
      messages.unshift(newMessage);
      localStorage.setItem('solestyle_contact_messages_v1', JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save contact message locally', err);
    }

    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    // Simulate sending delay for smooth UX
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      if (showNotification) {
        showNotification('✓ Tin nhắn của bạn đã được gửi thành công!');
      }
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      subject: '',
      customSubject: '',
      content: ''
    });
    setErrors({});
    setIsSubmittedSuccess(false);
  };

  // Determine active social links
  const hasSocial = social && (social.facebook || social.instagram || social.tiktok || social.youtube || social.twitter);

  return (
    <main className="min-h-screen bg-neutral-50/70 pt-4 pb-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ==================================================== */}
        {/* 1. BREADCRUMB                                       */}
        {/* ==================================================== */}
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <li>
              <button
                type="button"
                onClick={onBackToHome}
                className="hover:text-black transition-colors cursor-pointer flex items-center gap-1 text-neutral-600 font-bold"
                id="breadcrumb-home-link"
              >
                <span>Trang chủ</span>
              </button>
            </li>
            <li>
              <ChevronRight size={14} className="text-neutral-400" />
            </li>
            <li className="text-black font-extrabold" aria-current="page">
              Liên hệ
            </li>
          </ol>
        </nav>

        {/* ==================================================== */}
        {/* 2. HEADER BANNER & INTRO                             */}
        {/* ==================================================== */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>K-NICKS CUSTOMER CARE & SUPPORT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            LIÊN HỆ {storeName}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl font-normal leading-relaxed">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Mọi thắc mắc về sản phẩm, đơn hàng, chính sách bảo hành hay đóng góp ý kiến, xin vui lòng liên hệ theo các kênh dưới đây.
          </p>
        </header>

        {/* ==================================================== */}
        {/* 3. MAIN GRID (LEFT: INFO | RIGHT: FORM)             */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* -------------------------------------------------- */}
          {/* LEFT COLUMN: THÔNG TIN LIÊN HỆ (5 cols on lg)       */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card thông tin chính */}
            <section
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-6"
              aria-label="Thông tin liên hệ cửa hàng"
            >
              <div>
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-wide flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <MessageSquare size={18} className="text-amber-500" />
                  <span>THÔNG TIN LIÊN HỆ TRỰC TIẾP</span>
                </h2>
              </div>

              {/* 1. HOTLINE */}
              <div className="flex items-start gap-4 group">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                  <Phone size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    Hotline Tư Vấn & CSKH
                  </span>
                  <a
                    href={`tel:${cleanHotline}`}
                    className="text-base sm:text-lg font-black text-neutral-950 hover:text-amber-600 transition-colors inline-block mt-0.5"
                    title="Bấm để gọi điện hotline"
                    id="contact-hotline-link"
                  >
                    ☎ {hotline}
                  </a>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Hỗ trợ nhanh, tư vấn chọn size giày và kiểm tra đơn hàng 24/7.
                  </p>
                </div>
              </div>

              {/* 2. EMAIL */}
              <div className="flex items-start gap-4 group">
                <div className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    Email Hỗ Trợ Khách Hàng
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm sm:text-base font-black text-neutral-950 hover:text-amber-600 transition-colors inline-block mt-0.5 break-all"
                    title="Bấm để gửi email cho K-NICKS"
                    id="contact-email-link"
                  >
                    ✉ {email}
                  </a>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Phản hồi tất cả thư yêu cầu trong vòng 2 - 4 giờ làm việc.
                  </p>
                </div>
              </div>

              {/* 3. SHOWROOM / ĐỊA CHỈ */}
              <div className="flex items-start gap-4 group">
                <div className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    Showroom & Trụ Sở Chính
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5 leading-relaxed">
                    {address}
                  </p>
                  
                  {/* Google Maps link button if provided in Settings */}
                  {googleMapsUrl && googleMapsUrl.trim() !== '' ? (
                    <div className="mt-2.5">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-amber-500 hover:text-black transition-all text-xs font-black uppercase tracking-wider shadow-xs cursor-pointer"
                        id="contact-map-btn"
                      >
                        <span>XEM BẢN ĐỒ</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 4. GIỜ HOẠT ĐỘNG */}
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
                  <Clock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                    Giờ Hoạt Động Cửa Hàng
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-0.5">
                    {workingHours}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đang mở cửa đón khách & phục vụ online</span>
                  </p>
                </div>
              </div>

              {/* 5. MẠNG XÃ HỘI */}
              {hasSocial && (
                <div className="pt-4 border-t border-neutral-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 block mb-3">
                    KẾT NỐI VỚI CHÚNG TÔI
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {social.facebook && social.facebook.trim() !== '' && (
                      <a
                        href={social.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/60 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                        title="Facebook K-NICKS"
                        id="social-facebook-link"
                      >
                        <Facebook size={16} />
                        <span>Facebook</span>
                      </a>
                    )}

                    {social.instagram && social.instagram.trim() !== '' && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-3.5 rounded-xl bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200/60 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                        title="Instagram K-NICKS"
                        id="social-instagram-link"
                      >
                        <Instagram size={16} />
                        <span>Instagram</span>
                      </a>
                    )}

                    {social.tiktok && social.tiktok.trim() !== '' && (
                      <a
                        href={social.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-2 text-xs font-black transition-colors cursor-pointer"
                        title="TikTok K-NICKS"
                        id="social-tiktok-link"
                      >
                        <span className="font-black">TT</span>
                        <span>TikTok</span>
                      </a>
                    )}

                    {social.youtube && social.youtube.trim() !== '' && (
                      <a
                        href={social.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-3.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/60 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                        title="YouTube K-NICKS"
                        id="social-youtube-link"
                      >
                        <Youtube size={16} />
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </section>

            {/* Service Highlights Box */}
            <div className="bg-neutral-900 rounded-3xl p-6 text-white border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>CAM KẾT DỊCH VỤ TẠI {storeName}</span>
              </h3>
              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                  <span>100% Sản phẩm chính hãng, đền 200% nếu phát hiện hàng giả</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={14} className="text-amber-400 shrink-0" />
                  <span>Đổi size & mẫu dễ dàng trong vòng 30 ngày trên toàn quốc</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck size={14} className="text-amber-400 shrink-0" />
                  <span>Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ</span>
                </div>
              </div>
            </div>

          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT COLUMN: CONTACT FORM (7 cols on lg)           */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7">
            <section
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs relative"
              aria-label="Biểu mẫu gửi tin nhắn liên hệ"
            >
              
              <AnimatePresence mode="wait">
                {isSubmittedSuccess ? (
                  /* Success Feedback Screen */
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-10 px-4 text-center space-y-5"
                    id="contact-success-banner"
                  >
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase">
                        TIN NHẮN ĐÃ ĐƯỢC GỬI THÀNH CÔNG!
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        Cảm ơn bạn đã liên hệ với <strong className="text-black">{storeName}</strong>. Đội ngũ chuyên viên chăm sóc khách hàng của chúng tôi đã nhận được thông tin và sẽ phản hồi sớm nhất qua email hoặc điện thoại.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 max-w-md mx-auto text-left text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Người gửi:</span>
                        <span className="font-black text-neutral-800">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Email phản hồi:</span>
                        <span className="font-bold text-neutral-800">{formData.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400 font-bold">Số điện thoại:</span>
                          <span className="font-bold text-neutral-800">{formData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                      >
                        Gửi tin nhắn khác
                      </button>

                      <button
                        type="button"
                        onClick={onBackToHome}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-800 text-xs font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Về trang chủ
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Standard Form State */
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="border-b border-neutral-100 pb-4 mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                        <Send size={20} className="text-amber-500" />
                        <span>GỬI TIN NHẮN CHO CHÚNG TÔI</span>
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Vui lòng điền đầy đủ các thông tin có dấu <span className="text-rose-500 font-bold">*</span> để chúng tôi có thể phục vụ bạn tốt nhất.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate id="contact-form">
                      
                      {/* 1. HỌ VÀ TÊN & EMAIL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-fullName" className="text-xs font-bold text-neutral-800 block mb-1.5">
                            Họ và tên <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="contact-fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleFieldChange('fullName', e.target.value)}
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all ${
                              errors.fullName
                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                                : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1" id="error-fullName">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{errors.fullName}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="contact-email" className="text-xs font-bold text-neutral-800 block mb-1.5">
                            Email của bạn <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            placeholder="name@example.com"
                            className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all ${
                              errors.email
                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                                : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                            }`}
                          />
                          {errors.email && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1" id="error-email">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 2. SỐ ĐIỆN THOẠI & CHỦ ĐỀ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-phone" className="text-xs font-bold text-neutral-800 block mb-1.5">
                            Số điện thoại <span className="text-neutral-400 font-normal">(Tùy chọn)</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            placeholder="0987 654 321"
                            className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all ${
                              errors.phone
                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                                : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1" id="error-phone">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{errors.phone}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="contact-subject-select" className="text-xs font-bold text-neutral-800 block mb-1.5">
                            Chủ đề liên hệ <span className="text-rose-500">*</span>
                          </label>
                          <select
                            id="contact-subject-select"
                            value={formData.subject}
                            onChange={(e) => handleFieldChange('subject', e.target.value)}
                            className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all cursor-pointer ${
                              errors.subject
                                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                                : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                            }`}
                          >
                            <option value="">-- Chọn chủ đề cần hỗ trợ --</option>
                            {COMMON_SUBJECTS.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                          {errors.subject && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1" id="error-subject">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{errors.subject}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Custom subject field if user chose 'Chủ đề khác' */}
                      {formData.subject === 'Chủ đề khác' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-1"
                        >
                          <label htmlFor="contact-customSubject" className="text-xs font-bold text-neutral-800 block mb-1.5">
                            Nhập tiêu đề chủ đề của bạn <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id="contact-customSubject"
                            type="text"
                            value={formData.customSubject}
                            onChange={(e) => handleFieldChange('customSubject', e.target.value)}
                            placeholder="Nhập tiêu đề ngắn gọn..."
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900"
                          />
                        </motion.div>
                      )}

                      {/* 3. NỘI DUNG TIN NHẮN */}
                      <div>
                        <label htmlFor="contact-content" className="text-xs font-bold text-neutral-800 block mb-1.5">
                          Nội dung tin nhắn <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          id="contact-content"
                          rows={5}
                          value={formData.content}
                          onChange={(e) => handleFieldChange('content', e.target.value)}
                          placeholder="Mô tả chi tiết yêu cầu, mã đơn hàng cần tra cứu, hoặc thông tin sản phẩm bạn quan tâm..."
                          className={`w-full rounded-2xl border p-4 text-xs font-medium outline-none transition-all leading-relaxed resize-y ${
                            errors.content
                              ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                              : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                          }`}
                        />
                        {errors.content && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1" id="error-content">
                            <AlertCircle size={12} className="shrink-0" />
                            <span>{errors.content}</span>
                          </p>
                        )}
                      </div>

                      {/* 4. SUBMIT BUTTON */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                          id="contact-submit-btn"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>ĐANG GỬI TIN NHẮN...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              <span>GỬI TIN NHẮN</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </section>
          </div>

        </div>

      </div>
    </main>
  );
}
