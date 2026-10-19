import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist') => void;
}

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Vui lòng nhập địa chỉ email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Email không đúng định dạng.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-50 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neutral-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-white border border-neutral-200/80 shadow-2xl rounded-[24px] p-6 sm:p-10 relative z-10 space-y-6"
      >
        
        {/* Header: Company Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="h-11 w-11 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
              <KeyRound size={20} />
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-wider uppercase block text-neutral-900 leading-none">
                K-NICKS
              </span>
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase block mt-0.5">
                PASSWORD RECOVERY
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">
              Quên Mật Khẩu?
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Nhập email đã đăng ký để nhận liên kết khôi phục mật khẩu.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang gửi mã...</span>
                  </>
                ) : (
                  <span>GỬI YÊU CẦU</span>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-extrabold text-sm text-emerald-900">Đã gửi yêu cầu khôi phục!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới email <span className="font-bold">{email}</span>. Vui lòng kiểm tra hòm thư của bạn.
              </p>
              <button
                onClick={() => onNavigate('reset-password')}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer mt-2"
              >
                Tiếp tục đặt lại mật khẩu
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Login button */}
        <div className="text-center pt-2 border-t border-neutral-100">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Quay lại trang Đăng nhập</span>
          </button>
        </div>

      </motion.div>

    </div>
  );
}
