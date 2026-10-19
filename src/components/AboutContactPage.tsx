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
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Truck,
  Building2,
  MessageSquare,
  Award,
  Users,
  Check
} from 'lucide-react';
import { SystemSettings, ContactMessage, UserProfile } from '../types';

interface AboutContactPageProps {
  settings: SystemSettings;
  user?: UserProfile | null;
  onBackToHome: () => void;
  onNavigateProducts?: () => void;
  onNavigateBlog?: () => void;
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

export default function AboutContactPage({
  settings,
  user,
  onBackToHome,
  onSendMessage,
  showNotification
}: AboutContactPageProps) {
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
  const storeTagline = settings?.storeTagline || 'Authentic Sneakers & Sportswear';
  const hotline = settings?.hotline || '1900 8463';
  const cleanHotline = hotline.replace(/\s+/g, '');
  const email = settings?.email || 'support@knicks.vn';
  const address = settings?.address || '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh';
  const workingHours = settings?.workingHours || '08:30 - 21:30 (Thứ 2 - Chủ Nhật, kể cả ngày lễ)';
  const googleMapsUrl = settings?.googleMapsUrl;
  const social = settings?.socialLinks;
  const storeDescription =
    settings?.storeDescription ||
    'K-NICKS là hệ thống phân phối giày Sneaker và trang phục thể thao chính hãng hàng đầu tại Việt Nam. Được thành lập với niềm đam mê bất tận dành cho văn hóa sát mặt đất, chúng tôi cam kết đem lại những trải nghiệm mua sắm chuẩn Authentic 100% cùng dịch vụ bảo hành và chăm sóc khách hàng tận tâm nhất.';

  // Validation function
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Họ và tên *
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    // Email *
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

    // Chủ đề *
    const finalSubject = formData.subject === 'Chủ đề khác' ? formData.customSubject.trim() : formData.subject.trim();
    if (!finalSubject) {
      newErrors.subject = 'Vui lòng chọn hoặc nhập chủ đề liên hệ.';
    }

    // Nội dung *
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

  const hasSocial = social && (social.facebook || social.instagram || social.tiktok || social.youtube || social.twitter);

  return (
    <main className="min-h-screen bg-neutral-50/70 pt-4 pb-20 font-sans" id="about-contact-page-root">
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
                id="about-breadcrumb-home"
              >
                <span>Trang chủ</span>
              </button>
            </li>
            <li>
              <ChevronRight size={14} className="text-neutral-400" />
            </li>
            <li className="text-black font-extrabold" aria-current="page">
              Về chúng tôi & Liên hệ
            </li>
          </ol>
        </nav>

        {/* ==================================================== */}
        {/* 2. HEADER BANNER                                    */}
        {/* ==================================================== */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>K-NICKS OFFICIAL BRAND & SUPPORT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            VỀ CHÚNG TÔI & LIÊN HỆ
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-3xl font-normal leading-relaxed">
            Tìm hiểu câu chuyện thương hiệu {storeName}, thông tin hệ thống cửa hàng và gửi tin nhắn trao đổi trực tiếp với đội ngũ hỗ trợ của chúng tôi.
          </p>
        </header>

        {/* ==================================================== */}
        {/* PHẦN 1: VỀ CHÚNG TÔI (ABOUT K-NICKS)                 */}
        {/* ==================================================== */}
        <section className="mb-14" aria-label="Giới thiệu về K-NICKS" id="section-about-us">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-8">
            
            {/* Tiêu đề phần 1 */}
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                  VỀ CHÚNG TÔI
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  {storeName} — {storeTagline}
                </p>
              </div>
            </div>

            {/* Giới thiệu ngắn về K-NICKS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                <p>
                  Chào mừng bạn đến với <strong className="text-neutral-950 font-black">{storeName}</strong>! Chúng tôi tự hào là điểm đến tin cậy của cộng đồng yêu giày sneaker và thời trang thể thao tại Việt Nam.
                </p>
                <p>
                  {storeDescription}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                  Tại <strong className="text-black">{storeName}</strong>, mỗi đôi giày bán ra đều trải qua quy trình kiểm định nguồn gốc nghiêm ngặt, đảm bảo từng đường may mũi chỉ và chất lượng đệm đạt tiêu chuẩn chính hãng quốc tế.
                </p>
              </div>

              {/* 3 cam kết thương hiệu */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-950 text-white flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">100% AUTHENTIC</h3>
                    <p className="text-[11px] text-neutral-300 mt-0.5">Cam kết chính hãng từ Nike, Adidas, Puma, Converse. Đền 200% nếu phát hiện giả.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                    <RotateCcw size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">ĐỔI TRẢ 30 NGÀY</h3>
                    <p className="text-[11px] text-neutral-300 mt-0.5">Hỗ trợ đổi size và đổi mẫu nhanh chóng, linh hoạt trên toàn quốc.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">GIAO HÀNG TOÀN QUỐC</h3>
                    <p className="text-[11px] text-neutral-300 mt-0.5">Đóng gói chuẩn hộp hai lớp (Double Box), kiểm tra hàng trước khi thanh toán.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin cửa hàng (Địa chỉ, Hotline, Email, Giờ hoạt động) */}
            <div className="pt-6 border-t border-neutral-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-4">
                THÔNG TIN CỬA HÀNG & HỆ THỐNG PHỤC VỤ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Địa chỉ */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Địa chỉ Showroom</span>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 mt-1 leading-snug">{address}</p>
                    </div>
                  </div>
                  {googleMapsUrl && googleMapsUrl.trim() !== '' && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-amber-700 hover:text-black uppercase tracking-wider cursor-pointer"
                    >
                      <span>Xem Google Maps</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* 2. Hotline */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Hotline tư vấn</span>
                      <a
                        href={`tel:${cleanHotline}`}
                        className="text-base sm:text-lg font-black text-neutral-950 hover:text-amber-600 transition-colors inline-block mt-0.5"
                      >
                        {hotline}
                      </a>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Tư vấn chọn size & đơn hàng 24/7</p>
                    </div>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Email hỗ trợ</span>
                      <a
                        href={`mailto:${email}`}
                        className="text-xs sm:text-sm font-black text-neutral-950 hover:text-amber-600 transition-colors inline-block mt-1 break-all"
                      >
                        {email}
                      </a>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Phản hồi trong 2-4 giờ</p>
                    </div>
                  </div>
                </div>

                {/* 4. Giờ hoạt động */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">Giờ hoạt động</span>
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-1">{workingHours}</p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Mở cửa đón khách</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              {hasSocial && (
                <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-neutral-500">Kênh truyền thông chính thức:</span>
                  <div className="flex flex-wrap gap-2">
                    {social.facebook && (
                      <a
                        href={social.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Facebook size={14} />
                        <span>Facebook</span>
                      </a>
                    )}
                    {social.instagram && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Instagram size={14} />
                        <span>Instagram</span>
                      </a>
                    )}
                    {social.youtube && (
                      <a
                        href={social.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Youtube size={14} />
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ==================================================== */}
        {/* PHẦN 2: LIÊN HỆ (CONTACT FORM)                       */}
        {/* ==================================================== */}
        <section aria-label="Biểu mẫu liên hệ" id="section-contact-form">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs">
            
            {/* Tiêu đề phần 2 */}
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">
                  LIÊN HỆ
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  Gửi yêu cầu, phản ánh hoặc câu hỏi trực tiếp cho đội ngũ K-NICKS
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSubmittedSuccess ? (
                /* Thành công */
                <motion.div
                  key="success-banner"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="py-12 px-4 text-center space-y-5 max-w-lg mx-auto"
                  id="contact-success-box"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase">
                      TIN NHẮN ĐÃ ĐƯỢC GỬI THÀNH CÔNG!
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      Cảm ơn bạn đã liên hệ với <strong className="text-black">{storeName}</strong>. Đội ngũ chăm sóc khách hàng của chúng tôi đã ghi nhận thông tin và sẽ phản hồi sớm nhất qua email hoặc số điện thoại của bạn.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-bold">Người gửi:</span>
                      <span className="font-black text-neutral-800">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-bold">Email:</span>
                      <span className="font-bold text-neutral-800">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Số điện thoại:</span>
                        <span className="font-bold text-neutral-800">{formData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
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
                /* Form nhập liệu */
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 max-w-3xl"
                  noValidate
                  id="contact-message-form"
                >
                  <p className="text-xs text-neutral-500">
                    Các trường thông tin có dấu <span className="text-rose-500 font-bold">*</span> là bắt buộc.
                  </p>

                  {/* 1. Họ và tên * & Email * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-form-fullName" className="text-xs font-bold text-neutral-800 block mb-1.5">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-form-fullName"
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-form-email" className="text-xs font-bold text-neutral-800 block mb-1.5">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-form-email"
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Số điện thoại & Chủ đề * */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-form-phone" className="text-xs font-bold text-neutral-800 block mb-1.5">
                        Số điện thoại <span className="text-neutral-400 font-normal">(Tùy chọn)</span>
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="Ví dụ: 0912 345 678"
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all ${
                          errors.phone
                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                            : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-form-subject" className="text-xs font-bold text-neutral-800 block mb-1.5">
                        Chủ đề liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="contact-form-subject"
                        value={formData.subject}
                        onChange={(e) => handleFieldChange('subject', e.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all cursor-pointer ${
                          errors.subject
                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                            : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                        }`}
                      >
                        <option value="">-- Vui lòng chọn chủ đề --</option>
                        {COMMON_SUBJECTS.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{errors.subject}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nhập chủ đề tùy chỉnh nếu chọn "Chủ đề khác" */}
                  {formData.subject === 'Chủ đề khác' && (
                    <div>
                      <label htmlFor="contact-custom-subject" className="text-xs font-bold text-neutral-800 block mb-1.5">
                        Nhập chủ đề cụ thể của bạn <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-custom-subject"
                        type="text"
                        value={formData.customSubject}
                        onChange={(e) => handleFieldChange('customSubject', e.target.value)}
                        placeholder="Nhập tiêu đề hoặc vấn đề bạn cần hỗ trợ..."
                        className="w-full rounded-2xl border border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white px-4 py-3 text-xs font-medium text-neutral-900 outline-none"
                      />
                    </div>
                  )}

                  {/* 3. Nội dung * */}
                  <div>
                    <label htmlFor="contact-form-content" className="text-xs font-bold text-neutral-800 block mb-1.5">
                      Nội dung tin nhắn <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-form-content"
                      rows={5}
                      value={formData.content}
                      onChange={(e) => handleFieldChange('content', e.target.value)}
                      placeholder="Mô tả chi tiết thắc mắc, mã đơn hàng (nếu có), hoặc nội dung bạn muốn gửi tới K-NICKS..."
                      className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium outline-none transition-all resize-y ${
                        errors.content
                          ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                          : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white text-neutral-900'
                      }`}
                    />
                    {errors.content && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.content}</span>
                      </p>
                    )}
                  </div>

                  {/* 4. Nút GỬI TIN NHẮN */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      id="submit-contact-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Đang gửi tin nhắn...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} className="text-amber-400" />
                          <span>GỬI TIN NHẮN</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </section>

      </div>
    </main>
  );
}
