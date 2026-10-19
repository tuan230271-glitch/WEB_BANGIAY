import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, Check, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { SystemSettings } from '../types';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSettings';

interface RegisterPageProps {
  onRegisterSuccess: (name: string, email: string) => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist') => void;
  settings?: SystemSettings;
}

export default function RegisterPage({ onRegisterSuccess, onNavigate, settings: settingsProp }: RegisterPageProps) {
  const settings = settingsProp || DEFAULT_SYSTEM_SETTINGS;
  const storeName = settings.storeName || 'K-NICKS';
  const logo = settings.logo;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Field Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: 'Yếu', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (score === 3) return { score, label: 'Trung bình', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { score, label: 'Mạnh', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống.';
    }

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Email không đúng định dạng.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số).';
    }

    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập.';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự.';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if email already used simulation
      if (email.trim().toLowerCase() === 'registered@gmail.com') {
        setErrors({ email: 'Email này đã được sử dụng.' });
        return;
      }

      setSuccessMessage('Tạo tài khoản thành công! Đang chuyển đến trang đăng nhập...');

      setTimeout(() => {
        onRegisterSuccess(fullName, email);
        onNavigate('login');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => onNavigate('home')} className="hover:text-black">Trang chủ</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-400">Tài khoản</span>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">Đăng ký</span>
        </nav>

        {/* 2-COLUMN CONTAINER */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* LEFT COLUMN: BRAND COVER */}
          <div className="lg:col-span-5 relative bg-neutral-900 text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            <div className="relative z-10">
              <span className="text-xl font-black tracking-widest uppercase italic bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                {storeName}
              </span>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                JOIN THE COMMUNITY
              </p>
            </div>

            <div className="relative z-10 space-y-4 my-auto pt-16 lg:pt-0">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200">
                ƯU ĐÃI THÀNH VIÊN MỚI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight uppercase">
                Tạo tài khoản ngay hôm nay
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
                Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên cùng đặc quyền tích điểm đổi quà từ {storeName}.
              </p>

              <div className="pt-2 space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>Theo dõi trạng thái đơn hàng thời gian thực</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>Lưu nhiều địa chỉ nhận hàng thuận tiện</span>
                </div>
              </div>
            </div>

            <p className="relative z-10 text-[10px] text-neutral-400">
              © 2026 K-NICKS Vietnam. All rights reserved.
            </p>
          </div>

          {/* RIGHT COLUMN: REGISTER FORM */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            <div className="max-w-lg w-full mx-auto space-y-6">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                  TẠO TÀI KHOẢN
                </h1>
                <p className="text-xs text-neutral-500 mt-1.5">
                  Tham gia K-NICKS để mua sắm và theo dõi đơn hàng dễ dàng hơn.
                </p>
              </div>

              {/* Success Notification */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2.5"
                  >
                    <Sparkles size={18} className="shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                        }}
                        className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                          errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                          errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2: Phone & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        placeholder="09xxxxxxxx"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.phone}</p>}
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Tên đăng nhập <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
                        }}
                        className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                          errors.username ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.username && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.username}</p>}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                        errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-1 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-neutral-500">Độ mạnh mật khẩu:</span>
                        <span className={strength.textColor}>{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-neutral-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-neutral-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-neutral-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-neutral-200'}`} />
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        * Yêu cầu: Ít nhất 8 ký tự, có chữ hoa, chữ thường và chữ số.
                      </p>
                    </div>
                  )}

                  {errors.password && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      className={`w-full rounded-2xl border bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black ${
                        errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded-md border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-xs text-neutral-600 font-medium select-none cursor-pointer leading-tight">
                      Tôi đồng ý với <span className="font-bold text-black underline">Điều khoản sử dụng</span> và <span className="font-bold text-black underline">Chính sách bảo mật</span> của K-NICKS.
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="text-[11px] font-semibold text-rose-500 pl-1">{errors.agreeTerms}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Đang xử lý đăng ký...</span>
                    </>
                  ) : (
                    <span>ĐĂNG KÝ</span>
                  )}
                </button>
              </form>

              {/* Switch to Login */}
              <div className="text-center pt-2 border-t border-neutral-100">
                <p className="text-xs text-neutral-500 font-medium">
                  Đã có tài khoản?{' '}
                  <button
                    onClick={() => onNavigate('login')}
                    className="font-black text-black underline hover:text-neutral-700 cursor-pointer uppercase"
                  >
                    ĐĂNG NHẬP
                  </button>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
