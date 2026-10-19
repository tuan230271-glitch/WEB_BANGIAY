import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, CheckCircle2, RotateCcw, Truck, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SystemSettings } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: 'return' | 'shipping' | 'privacy' | 'terms' | 'warranty' | null;
  settings?: SystemSettings;
}

export default function PolicyModal({
  isOpen,
  onClose,
  policyType,
  settings
}: PolicyModalProps) {
  if (!isOpen || !policyType) return null;

  const getPolicyContent = () => {
    switch (policyType) {
      case 'return':
        return {
          title: 'CHÍNH SÁCH ĐỔI TRẢ 30 NGÀY',
          icon: RotateCcw,
          content: settings?.policies.returnPolicy || ''
        };
      case 'shipping':
        return {
          title: 'CHÍNH SÁCH VẬN CHUYỂN & GIAO HÀNG',
          icon: Truck,
          content: settings?.policies.shippingPolicy || ''
        };
      case 'privacy':
        return {
          title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN',
          icon: Lock,
          content: settings?.policies.privacyPolicy || ''
        };
      case 'terms':
        return {
          title: 'ĐIỀU KHOẢN DỊCH VỤ & MUA HÀNG',
          icon: FileText,
          content: settings?.policies.termsOfService || ''
        };
      case 'warranty':
        return {
          title: 'CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG',
          icon: ShieldCheck,
          content: settings?.policies.warrantyPolicy || ''
        };
      default:
        return {
          title: 'CHÍNH SÁCH',
          icon: FileText,
          content: ''
        };
    }
  };

  const { title, icon: Icon, content } = getPolicyContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col z-10 border border-neutral-200 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-neutral-100 text-black flex items-center justify-center font-bold">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-neutral-900 uppercase tracking-tight">
                  {title}
                </h3>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">
                  {settings?.storeName || 'K-NICKS'} • CẬP NHẬT CHÍNH THỨC
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Content with Markdown render */}
          <div className="flex-1 overflow-y-auto py-5 pr-2 space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed custom-scrollbar">
            <div className="prose prose-neutral prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-neutral-100 pt-4 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Áp dụng trên toàn bộ hệ thống {settings?.storeName || 'K-NICKS'}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
