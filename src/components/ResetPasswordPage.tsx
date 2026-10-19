import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist') => void;
}

export default function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Strength check
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

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải chứa ít nhất 8 ký tự.');
      return;
    }

    if (!confirmPassword) {
      setError('Vui lòng nhập lại mật khẩu xác nhận.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => onNavigate('home')} className="hover:text-black">Trang chủ</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <button onClick={() => onNavigate('login')} className="hover:text-black">Đăng nhập</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">Đặt lại mật khẩu</span>
        </nav>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl p-6 sm:p-10 space-y-6">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-black shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
                MẬT KHẨU MỚI
              </h1>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                Tạo mật khẩu mới an toàn cho tài khoản K-NICKS của bạn.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                    {error}
                  </div>
                )}

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Mật khẩu mới <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-10 pr-11 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
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
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-10 pr-11 text-xs font-medium outline-none transition-all focus:bg-white focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <span>ĐẶT LẠI MẬT KHẨU</span>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>

                <div>
                  <h3 className="text-base font-black text-emerald-900 uppercase">
                    ĐỔI MẬT KHẨU THÀNH CÔNG!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Mật khẩu mới của bạn đã được cập nhật an toàn. Vui lòng đăng nhập lại để sử dụng tài khoản.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                >
                  ĐĂNG NHẬP NGAY
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
