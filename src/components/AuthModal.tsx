import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    if (mode === 'register' && !name) {
      setError('Vui lòng điền tên của bạn!');
      return;
    }

    setIsLoading(true);

    // Simulate server delay
    setTimeout(() => {
      setIsLoading(false);
      const userDisplay = mode === 'login' ? email.split('@')[0] : name;
      setSuccess(mode === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký tài khoản thành công!');
      
      setTimeout(() => {
        onLoginSuccess(userDisplay, email);
        setName('');
        setEmail('');
        setPassword('');
        setSuccess('');
        onClose();
      }, 1000);
    }, 1500);
  };

  const handleSocialMockLogin = (platform: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(`Khách hàng ${platform}`, `guest_${platform.toLowerCase()}@gmail.com`);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl md:p-8"
            id="auth-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon Banner */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-black mb-3">
                <ShieldCheck size={26} />
              </div>
              <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                {mode === 'login' ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'ĐĂNG KÝ THÀNH VIÊN'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-[280px]">
                Nhận ngay mã khuyến mãi 10% khi tham gia cộng đồng của chúng tôi
              </p>
            </div>

            {/* Error or Success notification */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100 text-center"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 border border-emerald-100 text-center flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Họ và tên</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-xs font-medium outline-none transition-colors focus:border-black focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Email của bạn</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-xs font-medium outline-none transition-colors focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-700">Mật khẩu</label>
                  {mode === 'login' && (
                    <span className="text-[10px] text-neutral-400 underline hover:text-black cursor-pointer">
                      Quên mật khẩu?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-11 text-xs font-medium outline-none transition-colors focus:border-black focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex h-12 items-center justify-center rounded-xl bg-black font-bold text-xs text-white uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-md"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span>{mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Ngay'}</span>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Social Mock Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialMockLogin('Google')}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-50 transition-colors"
              >
                <span className="text-red-500 font-extrabold">G</span> Google
              </button>
              <button
                onClick={() => handleSocialMockLogin('Apple')}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-xs font-bold hover:bg-neutral-50 transition-colors"
              >
                <span className="text-black font-extrabold"></span> Apple
              </button>
            </div>

            {/* Switch Mode Footer */}
            <div className="mt-6 text-center text-xs">
              <span className="text-neutral-400 font-medium">
                {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              </span>
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="font-extrabold text-black underline transition-colors"
              >
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
