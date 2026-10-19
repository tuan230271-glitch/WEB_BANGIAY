import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { SystemSettings } from '../types';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSettings';

interface LoginPageProps {
  onLoginSuccess: (name: string, email: string, role?: 'user' | 'admin', phone?: string) => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist') => void;
  redirectAfterLogin?: 'checkout' | 'my-orders' | 'profile' | 'home' | null;
  settings?: SystemSettings;
}

export default function LoginPage({ onLoginSuccess, onNavigate, settings: settingsProp }: LoginPageProps) {
  const settings = settingsProp || DEFAULT_SYSTEM_SETTINGS;
  const storeName = settings.storeName || 'K-NICKS';
  const logo = settings.logo;
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!emailOrUsername.trim()) {
      setEmailError('Vui lòng nhập địa chỉ email hoặc tên đăng nhập.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    // Simulate authentication login
    setTimeout(() => {
      setIsLoading(false);

      const cleanInput = emailOrUsername.trim().toLowerCase();

      // Check admin account credentials
      if (cleanInput === 'admin' || cleanInput === 'admin@knicks.vn' || cleanInput === 'admin@knicks.com') {
        if (password !== 'admin123' && password !== '123456') {
          setGeneralError('Mật khẩu quản trị viên không chính xác (mật khẩu demo: admin123).');
          return;
        }
        onLoginSuccess('Quản trị viên (Admin)', 'admin@knicks.vn', 'admin', '0901234567');
        return;
      }

      // Customer account validation
      if (password.length < 6) {
        setGeneralError('Email/tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
        return;
      }

      const displayName = cleanInput.includes('@')
        ? cleanInput.split('@')[0].toUpperCase()
        : cleanInput.toUpperCase();

      const userEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@gmail.com`;

      // Check if user is locked in database/localStorage
      const savedUsersJson = localStorage.getItem('knicks_users');
      if (savedUsersJson) {
        try {
          const list = JSON.parse(savedUsersJson);
          const foundUser = list.find((u: any) => 
            u.email.toLowerCase() === userEmail.toLowerCase() || 
            (u.phone && u.phone === cleanInput)
          );
          if (foundUser && (foundUser.status === 'Bị khóa' || foundUser.isDeleted)) {
            setGeneralError('Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa. Vui lòng liên hệ Quản trị viên.');
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      onLoginSuccess(displayName, userEmail, 'user', '0987654321');
    }, 800);
  };

  // Quick Demo Login helper
  const handleDemoLogin = (role: 'user' | 'admin') => {
    setGeneralError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        setEmailOrUsername('admin@knicks.vn');
        setPassword('admin123');
        onLoginSuccess('Quản trị viên (Admin)', 'admin@knicks.vn', 'admin', '0901234567');
      } else {
        setEmailOrUsername('user@knicks.vn');
        setPassword('123456');
        onLoginSuccess('Nguyễn Văn A', 'user@knicks.vn', 'user', '0987654321');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-100/80 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Split-Screen Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white shadow-2xl shadow-slate-900/10 rounded-[20px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] border border-slate-200/80 relative z-10"
      >
        
        {/* LEFT SIDE: PROMOTIONAL BANNER (42% width ~ 5 Cols) */}
        <div className="lg:col-span-5 relative bg-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
          
          {/* Background Image with Dark Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50" />

          {/* Top Brand Logo */}
          <div className="relative z-10 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center gap-2.5">
              {logo ? (
                <img src={logo} alt={storeName} className="h-9 w-auto max-w-[120px] object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black italic text-lg shadow-md">
                  {storeName.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-lg font-black tracking-widest uppercase block text-white leading-none">
                  {storeName}
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-amber-400 uppercase block mt-0.5">
                  PREMIUM FOOTWEAR & SNEAKERS
                </span>
              </div>
            </div>
          </div>

          {/* Middle Marketing Content */}
          <div className="relative z-10 space-y-5 my-auto py-10 lg:py-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md">
              <ShieldCheck size={12} className="text-amber-400" />
              TRẢI NGHIỆM MUA SẮM ĐẲNG CẤP
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight">
              Phong cách bắt đầu từ đôi chân của bạn.
            </h2>

            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Đăng nhập tài khoản SoleStyle để theo dõi đơn hàng, lưu danh sách yêu thích và nhận những ưu đãi phát hành sneaker giới hạn.
            </p>

            {/* Benefits List */}
            <div className="pt-2 space-y-2.5 text-xs text-neutral-200">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-neutral-800 border border-neutral-700 text-amber-400 flex items-center justify-center shrink-0">
                  <Truck size={13} />
                </div>
                <span className="font-medium">Miễn phí giao hàng cho đơn từ 1.000.000 VNĐ</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-neutral-800 border border-neutral-700 text-amber-400 flex items-center justify-center shrink-0">
                  <RefreshCw size={13} />
                </div>
                <span className="font-medium">Đổi trả dễ dàng trong vòng 30 ngày</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-neutral-800 border border-neutral-700 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span className="font-medium">Cam kết 100% sản phẩm chính hãng</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-[11px] text-neutral-400">
              © 2026 K-NICKS Vietnam. All rights reserved.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE: LOGIN FORM (58% width ~ 7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header Title */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
                Đăng Nhập
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Chào mừng bạn trở lại! Nhập thông tin đăng nhập của bạn.
              </p>
            </div>

            {/* General Error Alert */}
            <AnimatePresence mode="wait">
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5"
                >
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{generalError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email / Username Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block">
                  Email / Tên đăng nhập <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="email@example.com"
                    value={emailOrUsername}
                    onChange={(e) => {
                      setEmailOrUsername(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full rounded-2xl border bg-neutral-50/80 py-3 pl-10 pr-4 text-xs font-medium text-neutral-900 outline-none transition-all duration-200 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-amber-400/20 ${
                      emailError ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] font-semibold text-rose-500 pl-1">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    className={`w-full rounded-2xl border bg-neutral-50/80 py-3 pl-10 pr-11 text-xs font-medium text-neutral-900 outline-none transition-all duration-200 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-amber-400/20 ${
                      passwordError ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] font-semibold text-rose-500 pl-1">{passwordError}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-neutral-300 text-neutral-900 focus:ring-amber-400 accent-neutral-900 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-neutral-700 hover:text-amber-600 hover:underline transition-colors cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>ĐĂNG NHẬP</span>
                )}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Đăng nhập nhanh thử nghiệm:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user')}
                  className="py-2.5 px-3 rounded-xl bg-white border border-neutral-200 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 transition-colors text-center cursor-pointer shadow-xs"
                >
                  👤 Khách hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 text-white text-[11px] font-bold hover:bg-neutral-800 transition-colors text-center cursor-pointer shadow-xs"
                >
                  ⚡ Quản trị viên
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 font-medium">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="font-bold text-neutral-900 hover:text-amber-600 hover:underline cursor-pointer transition-colors"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}
