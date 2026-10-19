import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Store,
  Phone,
  Truck,
  CreditCard,
  Bell,
  Search,
  FileText,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Save,
  AlertCircle,
  Building2,
  QrCode,
  Globe,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Trash2,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Sliders,
  Eye
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { settingsApi } from '../../services/api';

interface SettingsManagementProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  showToast: (msg: string) => void;
}

type SettingsSection =
  | 'admin'
  | 'store'
  | 'contact'
  | 'shipping'
  | 'payment'
  | 'notifications'
  | 'seo'
  | 'policies';

export default function SettingsManagement({
  settings,
  setSettings,
  showToast
}: SettingsManagementProps) {
  // Active sub-section state
  const [activeSection, setActiveSection] = useState<SettingsSection>('admin');

  // Form draft state (copy from settings)
  const [formData, setFormData] = useState<SystemSettings>(() => JSON.parse(JSON.stringify(settings)));

  // Tracking unsaved changes
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Active policy tab for the text editor
  const [activePolicyTab, setActivePolicyTab] = useState<
    'return' | 'shipping' | 'privacy' | 'terms' | 'warranty'
  >('return');

  // Hidden File input refs for Logo, Admin Logo and Favicon upload
  const logoInputRef = useRef<HTMLInputElement>(null);
  const adminLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Sync draft whenever external settings change
  useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(settings)));
    setIsDirty(false);
  }, [settings]);

  // Handle generic field update
  const handleChange = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(true);
      return next;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Handle nested object updates
  const handleNestedChange = <K extends keyof SystemSettings>(
    parentKey: K,
    childKey: string,
    value: any
  ) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [parentKey]: {
          ...(prev[parentKey] as any),
          [childKey]: value
        }
      };
      setIsDirty(true);
      return next;
    });
  };

  // Handle Admin Logo Upload via File Explorer (PNG, JPG, JPEG, WEBP, SVG)
  const handleAdminLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      showToast('Định dạng ảnh không hợp lệ! Vui lòng chọn ảnh PNG, JPG, JPEG, WEBP hoặc SVG.');
      return;
    }

    // Limit file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('adminLogo', event.target.result);
        showToast('Đã chọn Logo Admin mới! Bấm [LƯU THAY ĐỔI] để áp dụng vào Sidebar.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Logo Upload via File Explorer (PNG, JPG, JPEG, WEBP)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Định dạng ảnh không hợp lệ! Vui lòng chọn ảnh PNG, JPG, JPEG hoặc WEBP.');
      return;
    }

    // Limit file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('logo', event.target.result);
        showToast('Đã tải ảnh Logo lên thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Favicon Upload via File Explorer
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.ico')) {
      showToast('Vui lòng chọn file Favicon hợp lệ (.png, .ico, .svg, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('favicon', event.target.result);
        handleNestedChange('seo', 'favicon', event.target.result);
        showToast('Đã tải Favicon lên thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Validate form before save
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.storeName.trim()) {
      errs.storeName = 'Tên cửa hàng không được để trống.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email cửa hàng không được để trống.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Địa chỉ email không đúng định dạng.';
      }
    }

    if (!formData.hotline.trim()) {
      errs.hotline = 'Số hotline không được để trống.';
    }

    if (!formData.address.trim()) {
      errs.address = 'Địa chỉ cửa hàng không được để trống.';
    }

    if (formData.shipping.freeShippingThreshold < 0) {
      errs.freeShippingThreshold = 'Ngưỡng miễn phí giao hàng không được âm.';
    }

    if (formData.shipping.defaultFee < 0) {
      errs.defaultFee = 'Phí giao hàng không được âm.';
    }

    // Payment validation: At least one payment method enabled
    const hasActivePayment =
      formData.payment.enableCod ||
      formData.payment.enableBanking ||
      formData.payment.enableMomo ||
      formData.payment.enableVnpay ||
      formData.payment.enableZalopay;

    if (!hasActivePayment) {
      errs.payment = 'Phải bật ít nhất 1 phương thức thanh toán trong hệ thống.';
    }

    if (formData.payment.enableBanking) {
      if (!formData.payment.bankInfo.bankName.trim()) {
        errs.bankName = 'Vui lòng nhập tên ngân hàng.';
      }
      if (!formData.payment.bankInfo.accountNumber.trim()) {
        errs.accountNumber = 'Vui lòng nhập số tài khoản ngân hàng.';
      }
      if (!formData.payment.bankInfo.accountName.trim()) {
        errs.accountName = 'Vui lòng nhập tên chủ tài khoản.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Settings Handler
  const handleSave = () => {
    if (!validateForm()) {
      showToast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const updated: SystemSettings = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      setSettings(updated);
      settingsApi.update(updated).catch((err) => console.warn('Sync settings to API failed:', err));
      try {
        localStorage.setItem('knicks_system_settings_v1', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist settings', err);
      }

      setIsSaving(false);
      setIsDirty(false);
      setSaveSuccessBanner(true);
      showToast('Đã cập nhật cài đặt hệ thống.');

      setTimeout(() => {
        setSaveSuccessBanner(false);
      }, 4000);
    }, 600);
  };

  // Cancel / Reset draft
  const handleCancel = () => {
    setFormData(JSON.parse(JSON.stringify(settings)));
    setIsDirty(false);
    setErrors({});
    showToast('Đã khôi phục cài đặt về trạng thái ban đầu.');
  };

  // Nav Items configuration
  const sectionsList: { id: SettingsSection; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'admin', label: 'Nhận diện Admin', icon: ShieldCheck, desc: 'Logo, Tên & Subtitle trang quản trị' },
    { id: 'store', label: 'Thông tin cửa hàng', icon: Store, desc: 'Tên, Logo, Favicon, giờ hoạt động' },
    { id: 'contact', label: 'Thông tin liên hệ & MXH', icon: Phone, desc: 'Hotline, Email, Địa chỉ, Facebook, TikTok...' },
    { id: 'shipping', label: 'Cấu hình giao hàng', icon: Truck, desc: 'Phí mặc định, Freeship, Hỏa tốc' },
    { id: 'payment', label: 'Phương thức thanh toán', icon: CreditCard, desc: 'COD, Chuyển khoản, VietQR, Ví điện tử' },
    { id: 'notifications', label: 'Thông báo & Email', icon: Bell, desc: 'Cấu hình sự kiện đơn hàng & email' },
    { id: 'seo', label: 'Cấu hình SEO & Meta', icon: Search, desc: 'Tên website, Meta tags, Keywords' },
    { id: 'policies', label: 'Quản lý chính sách', icon: FileText, desc: 'Đổi trả 30 ngày, Bảo hành, Vận chuyển...' },
  ];

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 max-w-[1920px] w-full mx-auto space-y-4 pb-28 font-sans">
      {/* 1. Header Bar with Save & Cancel Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <Settings size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Cài Đặt Hệ Thống
            </h1>
            {isDirty && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Chưa lưu
              </span>
            )}
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Quản lý thông tin thương hiệu, nhận diện, thanh toán, giao vận, chính sách và SEO
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty || isSaving}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isDirty && !isSaving
                ? 'border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100 shadow-2xs'
                : 'border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw size={13} />
            <span>Hủy</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
              isDirty && !isSaving
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : isSaving
                ? 'bg-neutral-800 text-white cursor-wait'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={14} className="text-amber-400" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      <AnimatePresence>
        {saveSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Đã cập nhật cài đặt hệ thống thành công! Toàn bộ thay đổi đã được áp dụng trực tiếp cho Header, Footer, Checkout và các trang liên quan.</span>
            </div>
            <button
              onClick={() => setSaveSuccessBanner(false)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Indicator */}
      {isDirty && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-600 shrink-0" />
            <span>Bạn đang có thay đổi chưa lưu. Hãy nhấn <strong>LƯU THAY ĐỔI</strong> để áp dụng toàn hệ thống.</span>
          </div>
          <button
            onClick={handleSave}
            className="underline font-bold text-amber-900 hover:text-black cursor-pointer"
          >
            Lưu ngay
          </button>
        </div>
      )}

      {/* 2. Main Grid Layout: Section Tabs Sidebar + Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Section Tabs (Desktop Left Column / Mobile Horizontal Scroll) */}
        <div className="lg:col-span-4 space-y-2 bg-white p-3 sm:p-4 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="px-3 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            DANH MỤC CÀI ĐẶT
          </div>
          <div className="space-y-1">
            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-md'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{sec.label}</p>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        isActive ? 'text-neutral-300' : 'text-neutral-400'
                      }`}
                    >
                      {sec.desc}
                    </p>
                  </div>
                  {isActive && <Check size={14} className="text-white shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>

          {/* Quick System Info badge */}
          <div className="mt-4 pt-4 border-t border-neutral-100 px-3 text-[11px] text-neutral-400 space-y-1">
            <div className="flex justify-between">
              <span>Hệ thống:</span>
              <span className="font-bold text-neutral-700">K-NICKS Engine v2.4</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="text-emerald-600 font-bold">● Trực tuyến (Hoạt động)</span>
            </div>
            {formData.updatedAt && (
              <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                <span>Cập nhật lần cuối:</span>
                <span>{new Date(formData.updatedAt).toLocaleTimeString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-8 space-y-6">

          {/* ======================================================== */}
          {/* SECTION: NHẬN DIỆN ADMIN                                  */}
          {/* ======================================================== */}
          {activeSection === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                      NHẬN DIỆN ADMIN
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                      Cấu hình logo và tên hiển thị của khu vực quản trị.
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin mô tả hướng dẫn */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Quản lý nhận diện độc lập cho trang Quản trị (Admin Panel)</p>
                  <p className="text-amber-800 leading-relaxed">
                    Logo và tên Admin được cấu hình và hiển thị riêng biệt trên Sidebar / Header của trang quản trị. Thay đổi tại đây sẽ <strong>không làm ảnh hưởng</strong> đến Logo hay Tên thương hiệu hiển thị cho khách hàng ở trang chủ.
                  </p>
                </div>
              </div>

              {/* LOGO ADMIN SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    LOGO ADMIN
                  </label>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Hỗ trợ: PNG, JPG, JPEG, WEBP, SVG (&lt; 5MB)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Logo Preview box */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 relative shadow-inner overflow-hidden group">
                      {formData.adminLogo ? (
                        <img
                          src={formData.adminLogo}
                          alt="Admin Logo Preview"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-black text-lg shadow-md select-none">
                          {((formData.adminName || 'SS').trim().slice(0, 2) || 'SS').toUpperCase()}
                        </div>
                      )}

                      {formData.adminLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            handleChange('adminLogo', '');
                            showToast('Đã xóa logo Admin tùy chỉnh (sử dụng biểu tượng mặc định).');
                          }}
                          className="absolute inset-0 bg-black/70 text-rose-400 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                          title="Xóa logo và dùng mặc định"
                        >
                          <Trash2 size={16} />
                          <span>Gỡ logo</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-neutral-800">
                        {formData.adminLogo ? 'Logo Admin Tùy Chỉnh' : 'Biểu Tượng Mặc Định (SS Gradient)'}
                      </p>
                      <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed">
                        Logo sẽ hiển thị ở góc trên cùng của thanh Sidebar quản trị với tỷ lệ vuông hoặc chữ nhật nhỏ.
                      </p>
                    </div>
                  </div>

                  {/* Upload Action */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      ref={adminLogoInputRef}
                      onChange={handleAdminLogoUpload}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => adminLogoInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Upload size={14} />
                      <span>Thay đổi Logo</span>
                    </button>

                    {formData.adminLogo && (
                      <button
                        type="button"
                        onClick={() => {
                          handleChange('adminLogo', '');
                          showToast('Đã chuyển về logo Admin mặc định.');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        <span>Dùng mặc định</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* TÊN HIỂN THỊ ADMIN & SUBTITLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    TÊN HIỂN THỊ ADMIN
                  </label>
                  <input
                    type="text"
                    value={formData.adminName ?? 'K-NICKS'}
                    onChange={(e) => handleChange('adminName', e.target.value)}
                    placeholder="K-NICKS ADMIN"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all font-sans"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Ví dụ: <strong>K-NICKS</strong>, <strong>K-NICKS ADMIN</strong>, <strong>K-NICKS</strong>.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    DÒNG MÔ TẢ ADMIN (SUBTITLE)
                  </label>
                  <input
                    type="text"
                    value={formData.adminSubtitle ?? ''}
                    onChange={(e) => handleChange('adminSubtitle', e.target.value)}
                    placeholder="ADMIN CONTROL PANEL"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all font-sans"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Ví dụ: <strong>ADMIN CONTROL PANEL</strong>, <strong>QUẢN TRỊ HỆ THỐNG</strong>. (Để trống nếu không hiển thị).
                  </p>
                </div>
              </div>

              {/* LIVE PREVIEW BLOCK */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>XEM TRƯỚC GIAO DIỆN SIDEBAR ADMIN THỰC TẾ</span>
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400">
                    CẬP NHẬT TỨC THÌ (REAL-TIME PREVIEW)
                  </span>
                </div>

                {/* Simulated Sidebar Header Container */}
                <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Sidebar Admin Preview (Chế độ mở rộng)
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                      Đồng bộ 1:1
                    </span>
                  </div>

                  {/* Expanded Sidebar Mock */}
                  <div className="max-w-xs">
                    <div className="h-16 px-4 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5 select-none min-w-0">
                        {formData.adminLogo ? (
                          <img
                            src={formData.adminLogo}
                            alt="Admin Logo"
                            className="h-9 w-9 rounded-xl object-contain bg-neutral-800 border border-neutral-700/80 p-0.5 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-black text-sm shadow-md shrink-0">
                            {((formData.adminName || 'SS').trim().slice(0, 2) || 'SS').toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 overflow-hidden">
                          <span className="text-base font-black tracking-tight text-white flex items-center gap-1 truncate">
                            <span className="truncate">{formData.adminName || 'K-NICKS'}</span>
                            <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                          </span>
                          {(formData.adminSubtitle || formData.adminSubtitle === undefined) && formData.adminSubtitle !== '' && (
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block truncate">
                              {formData.adminSubtitle ?? 'ADMIN CONTROL PANEL'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-neutral-400 p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50">
                        <Sliders size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Collapsed Sidebar Mock */}
                  <div className="pt-2 border-t border-neutral-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                      Khi thu gọn Sidebar (Collapsed Mode):
                    </span>
                    <div className="h-14 w-14 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-center shadow-md">
                      {formData.adminLogo ? (
                        <img
                          src={formData.adminLogo}
                          alt="Admin Logo"
                          className="h-9 w-9 rounded-xl object-contain bg-neutral-800 border border-neutral-700/80 p-0.5"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-black text-sm shadow-md">
                          {((formData.adminName || 'SS').trim().slice(0, 2) || 'SS').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: THÔNG TIN CỬA HÀNG (Store Info & Logo/Favicon) */}
          {/* ======================================================== */}
          {activeSection === 'store' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <Store size={18} className="text-neutral-700" />
                  <span>THÔNG TIN CỬA HÀNG & NHẬN DIỆN THƯƠNG HIỆU</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Cập nhật tên thương hiệu, khẩu hiệu, logo, favicon và giới thiệu cửa hàng.
                </p>
              </div>

              {/* Tên cửa hàng & Slogan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Tên cửa hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    placeholder="K-NICKS"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                      errors.storeName
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white'
                    }`}
                  />
                  {errors.storeName && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.storeName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Khẩu hiệu (Tagline / Slogan)
                  </label>
                  <input
                    type="text"
                    value={formData.storeTagline || ''}
                    onChange={(e) => handleChange('storeTagline', e.target.value)}
                    placeholder="PREMIUM SNEAKERS & STREETWEAR"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Logo & Favicon Upload Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* 1. LOGO UPLOAD */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Logo Cửa Hàng</span>
                    <span className="text-[10px] text-neutral-400 font-medium">PNG, JPG, WEBP (&lt;5MB)</span>
                  </div>

                  {/* Logo Preview box */}
                  <div className="h-28 rounded-xl bg-white border border-dashed border-neutral-300 flex items-center justify-center p-3 overflow-hidden relative group">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Store Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 select-none">
                        <div className="h-10 w-10 rounded-xl bg-black text-white font-black text-xl flex items-center justify-center shadow-md">
                          K
                        </div>
                        <span className="text-lg font-black tracking-tighter text-black uppercase">
                          {formData.storeName || 'K-NICKS'}
                        </span>
                      </div>
                    )}

                    {formData.logo && (
                      <button
                        type="button"
                        onClick={() => handleChange('logo', '')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa logo tùy chỉnh và dùng mặc định"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 hover:border-black text-xs font-bold text-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Upload size={14} />
                    <span>Thay đổi Logo</span>
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center">
                    Mở File Explorer chọn ảnh trực tiếp từ thiết bị của bạn.
                  </p>
                </div>

                {/* 2. FAVICON UPLOAD */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Favicon Trình Duyệt</span>
                    <span className="text-[10px] text-neutral-400 font-medium">ICO, PNG, SVG</span>
                  </div>

                  {/* Favicon Preview */}
                  <div className="h-28 rounded-xl bg-white border border-dashed border-neutral-300 flex flex-col items-center justify-center p-3 relative group">
                    <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                      {formData.favicon ? (
                        <img
                          src={formData.favicon}
                          alt="Favicon"
                          className="h-5 w-5 rounded-xs object-contain"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded bg-black text-white text-[10px] font-black flex items-center justify-center">
                          K
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-neutral-600 truncate max-w-[120px]">
                        {formData.storeName || 'K-NICKS'} - Tab
                      </span>
                    </div>

                    {formData.favicon && (
                      <button
                        type="button"
                        onClick={() => {
                          handleChange('favicon', '');
                          handleNestedChange('seo', 'favicon', '');
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa favicon tùy chỉnh"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Hidden Favicon File Input */}
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={handleFaviconUpload}
                    accept="image/png, image/jpeg, image/x-icon, image/vnd.microsoft.icon, image/svg+xml, image/webp"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 hover:border-black text-xs font-bold text-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Upload size={14} />
                    <span>Upload Favicon</span>
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center">
                    Icon hiển thị trên thanh tab trình duyệt của khách hàng.
                  </p>
                </div>

              </div>

              {/* Giờ hoạt động & Mô tả */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Giờ hoạt động cửa hàng
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => handleChange('workingHours', e.target.value)}
                    placeholder="08:30 - 21:30 (Thứ 2 - Chủ Nhật, kể cả ngày lễ)"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Mô tả / Giới thiệu cửa hàng (Hiển thị Footer & Header)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.storeDescription}
                    onChange={(e) => handleChange('storeDescription', e.target.value)}
                    placeholder="Nơi hội tụ các dòng sản phẩm giày sneaker và thể thao chính hãng cao cấp..."
                    className="w-full rounded-xl border border-neutral-200 p-3.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all leading-relaxed resize-y"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: THÔNG TIN LIÊN HỆ & MẠNG XÃ HỘI (Contact & Social) */}
          {/* ======================================================== */}
          {activeSection === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <Phone size={18} className="text-neutral-700" />
                  <span>THÔNG TIN LIÊN HỆ & MẠNG XÃ HỘI</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Đồng bộ thông tin hotline, email, showroom và liên kết mạng xã hội chính thức hiển thị ở Footer.
                </p>
              </div>

              {/* Thông tin liên hệ cơ bản */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Hotline CSKH <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hotline}
                    onChange={(e) => handleChange('hotline', e.target.value)}
                    placeholder="1900 8463"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                      errors.hotline
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white'
                    }`}
                  />
                  {errors.hotline && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.hotline}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Email hỗ trợ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="support@knicks.vn"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                      errors.email
                        ? 'border-rose-500 bg-rose-50/30'
                        : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Địa chỉ Showroom / Văn phòng chính <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-all ${
                    errors.address
                      ? 'border-rose-500 bg-rose-50/30'
                      : 'border-neutral-200 focus:border-black bg-neutral-50/50 focus:bg-white'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1">{errors.address}</p>
                )}
              </div>

              {/* Giờ làm việc & Google Maps URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Thời gian làm việc (Working Hours)
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours || ''}
                    onChange={(e) => handleChange('workingHours', e.target.value)}
                    placeholder="08:00 - 22:00 (Tất cả các ngày trong tuần)"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Hiển thị trên Trang Liên Hệ (/contact) và Footer của website.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Link nhúng bản đồ Google Maps (Embed URL)
                  </label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl || ''}
                    onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Link nhúng iframe bản đồ vị trí Showroom trên Trang Liên Hệ.
                  </p>
                </div>
              </div>

              {/* Mạng xã hội */}
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                    LIÊN KẾT MẠNG XÃ HỘI (SOCIAL LINKS)
                  </h3>
                  <span className="text-[10px] text-neutral-400">
                    * Nếu để trống, icon tương ứng sẽ tự động ẩn ở Footer
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Facebook */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Facebook size={16} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.socialLinks.facebook || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                        placeholder="Link Facebook (e.g. https://facebook.com/knicks.official)"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <Instagram size={16} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.socialLinks.instagram || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                        placeholder="Link Instagram (e.g. https://instagram.com/knicks.sneakers)"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 font-black text-xs">
                      TT
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.socialLinks.tiktok || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'tiktok', e.target.value)}
                        placeholder="Link TikTok (e.g. https://tiktok.com/@knicks.vn)"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Youtube size={16} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.socialLinks.youtube || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                        placeholder="Link YouTube (e.g. https://youtube.com/@knicks)"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: CẤU HÌNH GIAO HÀNG (Shipping Configuration) */}
          {/* ======================================================== */}
          {activeSection === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <Truck size={18} className="text-neutral-700" />
                  <span>CẤU HÌNH VẬN CHUYỂN & GIAO HÀNG</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Thiết lập phí ship mặc định, ngưỡng miễn phí vận chuyển (Freeship) và thời gian giao hàng dự kiến.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Default Standard Shipping Fee */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Phí giao hàng tiêu chuẩn mặc định (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      value={formData.shipping.defaultFee}
                      onChange={(e) =>
                        handleNestedChange('shipping', 'defaultFee', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-bold text-neutral-900 outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-neutral-400">₫</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Hiển thị: <strong>{formatPrice(formData.shipping.defaultFee)}</strong>
                  </p>
                </div>

                {/* Free Shipping Threshold */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Ngưỡng miễn phí vận chuyển (Freeship từ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      value={formData.shipping.freeShippingThreshold}
                      onChange={(e) =>
                        handleNestedChange(
                          'shipping',
                          'freeShippingThreshold',
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-bold text-emerald-700 outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-neutral-400">₫</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Đơn hàng từ <strong>{formatPrice(formData.shipping.freeShippingThreshold)}</strong> sẽ được miễn phí giao hàng toàn quốc.
                  </p>
                </div>
              </div>

              {/* Express Shipping Option */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="text-xs font-bold text-neutral-900">Tùy chọn giao hàng hỏa tốc 🚀</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping.enableExpress}
                      onChange={(e) => handleNestedChange('shipping', 'enableExpress', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {formData.shipping.enableExpress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200/60">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Phí giao hàng hỏa tốc (VNĐ)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          step={5000}
                          value={formData.shipping.expressFee}
                          onChange={(e) =>
                            handleNestedChange(
                              'shipping',
                              'expressFee',
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black bg-white"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-neutral-400">₫</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Thời gian nhận hàng hỏa tốc
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.estimatedDaysExpress}
                        onChange={(e) =>
                          handleNestedChange('shipping', 'estimatedDaysExpress', e.target.value)
                        }
                        placeholder="1 – 2 ngày hỏa tốc"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Thời gian nhận tiêu chuẩn */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Mô tả thời gian nhận hàng tiêu chuẩn
                </label>
                <input
                  type="text"
                  value={formData.shipping.estimatedDaysStandard}
                  onChange={(e) => handleNestedChange('shipping', 'estimatedDaysStandard', e.target.value)}
                  placeholder="2 – 5 ngày làm việc"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: PHƯƠNG THỨC THANH TOÁN & THÔNG TIN NGÂN HÀNG  */}
          {/* ======================================================== */}
          {activeSection === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <CreditCard size={18} className="text-neutral-700" />
                  <span>CẤU HÌNH PHƯƠNG THỨC THANH TOÁN</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Bật/tắt các cổng thanh toán được phép hiển thị tại trang Checkout và cấu hình tài khoản nhận tiền chuyển khoản.
                </p>
              </div>

              {errors.payment && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{errors.payment}</span>
                </div>
              )}

              {/* Danh sách phương thức thanh toán */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  CÁC PHƯƠNG THỨC THANH TOÁN CHO PHÉP
                </h3>

                {/* 1. COD */}
                <div className="p-4 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                      COD
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Thanh toán khi nhận hàng (COD)</span>
                      <span className="text-[11px] text-neutral-500">Khách thanh toán tiền mặt trực tiếp cho nhân viên giao hàng</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.enableCod}
                      onChange={(e) => handleNestedChange('payment', 'enableCod', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* 2. Bank Transfer */}
                <div className="p-4 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Chuyển khoản Ngân hàng (VietQR)</span>
                      <span className="text-[11px] text-neutral-500">Tự động tạo mã QR chuyển khoản chính xác theo đơn hàng</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.enableBanking}
                      onChange={(e) => handleNestedChange('payment', 'enableBanking', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* 3. Ví MoMo */}
                <div className="p-4 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                      M
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Ví điện tử MoMo</span>
                      <span className="text-[11px] text-neutral-500">Quét mã MoMo QR hoặc thanh toán qua ứng dụng MoMo</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.enableMomo}
                      onChange={(e) => handleNestedChange('payment', 'enableMomo', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* 4. VNPAY */}
                <div className="p-4 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      VN
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Cổng VNPAY / Thẻ ATM Nội địa</span>
                      <span className="text-[11px] text-neutral-500">Hỗ trợ quét qua hơn 40 ứng dụng Mobile Banking</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.enableVnpay}
                      onChange={(e) => handleNestedChange('payment', 'enableVnpay', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              {/* THÔNG TIN TÀI KHOẢN NGÂN HÀNG (Only shown if Banking is enabled) */}
              {formData.payment.enableBanking ? (
                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-emerald-700" />
                    <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      THÔNG TIN TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Tên Ngân hàng <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.payment.bankInfo.bankName}
                        onChange={(e) => {
                          const nextBank = { ...formData.payment.bankInfo, bankName: e.target.value };
                          handleNestedChange('payment', 'bankInfo', nextBank);
                        }}
                        placeholder="Vietcombank (VCB)"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Số tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.payment.bankInfo.accountNumber}
                        onChange={(e) => {
                          const nextBank = { ...formData.payment.bankInfo, accountNumber: e.target.value };
                          handleNestedChange('payment', 'bankInfo', nextBank);
                        }}
                        placeholder="998822334455"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Tên chủ tài khoản <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.payment.bankInfo.accountName}
                        onChange={(e) => {
                          const nextBank = { ...formData.payment.bankInfo, accountName: e.target.value.toUpperCase() };
                          handleNestedChange('payment', 'bankInfo', nextBank);
                        }}
                        placeholder="CONG TY TNHH K-NICKS VIET NAM"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-bold uppercase text-neutral-900 outline-none focus:border-black bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Chi nhánh ngân hàng
                      </label>
                      <input
                        type="text"
                        value={formData.payment.bankInfo.branch || ''}
                        onChange={(e) => {
                          const nextBank = { ...formData.payment.bankInfo, branch: e.target.value };
                          handleNestedChange('payment', 'bankInfo', nextBank);
                        }}
                        placeholder="Chi nhánh Sài Gòn - TP.HCM"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Cú pháp / Nội dung chuyển khoản mặc định
                    </label>
                    <input
                      type="text"
                      value={formData.payment.bankInfo.transferSyntax || ''}
                      onChange={(e) => {
                        const nextBank = { ...formData.payment.bankInfo, transferSyntax: e.target.value };
                        handleNestedChange('payment', 'bankInfo', nextBank);
                      }}
                      placeholder="KN [Mã Đơn Hàng] [Số Điện Thoại]"
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium outline-none focus:border-black bg-white"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Hệ thống tự động thay thế <code>[Mã Đơn Hàng]</code> và <code>[Số Điện Thoại]</code> khi tạo mã QR ở Checkout.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-neutral-100 text-neutral-500 text-xs text-center">
                  Phương thức chuyển khoản ngân hàng đang tắt. Bật phương thức để cấu hình số tài khoản.
                </div>
              )}
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: THÔNG BÁO & EMAIL                             */}
          {/* ======================================================== */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <Bell size={18} className="text-neutral-700" />
                  <span>CẤU HÌNH THÔNG BÁO & EMAIL HỆ THỐNG</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Thiết lập các sự kiện gửi thông báo và email tự động khi có biến động về đơn hàng và chương trình khuyến mãi.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Email quản trị viên nhận thông báo đơn mới
                </label>
                <input
                  type="email"
                  value={formData.notifications.adminEmailNotification || ''}
                  onChange={(e) =>
                    handleNestedChange('notifications', 'adminEmailNotification', e.target.value)
                  }
                  placeholder="admin@knicks.vn"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  CÁC SỰ KIỆN GỬI THÔNG BÁO TỰ ĐỘNG
                </h3>

                {/* Event 1 */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Khi có Đơn hàng mới</span>
                    <span className="text-[11px] text-neutral-500">Gửi thông báo xác nhận đặt hàng thành công tới khách hàng</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifyNewOrder}
                      onChange={(e) =>
                        handleNestedChange('notifications', 'notifyNewOrder', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* Event 2 */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Khi Đơn hàng được xác nhận</span>
                    <span className="text-[11px] text-neutral-500">Thông báo đơn hàng đã được duyệt và đang chuẩn bị đóng gói</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifyOrderConfirmed}
                      onChange={(e) =>
                        handleNestedChange('notifications', 'notifyOrderConfirmed', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* Event 3 */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Khi Đơn hàng đang giao</span>
                    <span className="text-[11px] text-neutral-500">Cập nhật mã vận đơn và tiến trình shipper giao tới nhà</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifyOrderShipping}
                      onChange={(e) =>
                        handleNestedChange('notifications', 'notifyOrderShipping', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* Event 4 */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Khi Đơn hàng hoàn thành / Đã giao</span>
                    <span className="text-[11px] text-neutral-500">Gửi lời cảm ơn và lời mời đánh giá sản phẩm</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifyOrderDelivered}
                      onChange={(e) =>
                        handleNestedChange('notifications', 'notifyOrderDelivered', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {/* Event 5 */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Thông báo Khuyến mãi & Flash Sale</span>
                    <span className="text-[11px] text-neutral-500">Gửi mã giảm giá đặc quyền tới danh sách khách hàng đăng ký nhận tin</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.notifyPromotions}
                      onChange={(e) =>
                        handleNestedChange('notifications', 'notifyPromotions', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 6: CẤU HÌNH SEO & META                           */}
          {/* ======================================================== */}
          {activeSection === 'seo' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <Search size={18} className="text-neutral-700" />
                  <span>CẤU HÌNH SEO CƠ BẢN & META TAGS</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Tối ưu hóa tiêu đề trang, mô tả tìm kiếm và từ khóa giúp website đạt thứ hạng cao trên Google.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Tên Website (Site Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.seo.websiteTitle}
                  onChange={(e) => handleNestedChange('seo', 'websiteTitle', e.target.value)}
                  placeholder="K-NICKS | Giày Sneaker & Thể Thao Chính Hãng Cao Cấp"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Meta Title (Tiêu đề tìm kiếm Google)
                </label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                  placeholder="K-NICKS - Hệ Thống Phân Phối Sneaker Chính Hãng 100%"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Meta Description (Mô tả tìm kiếm)
                </label>
                <textarea
                  rows={3}
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                  placeholder="Mua sắm giày thể thao, sneaker chính hãng từ Nike, Adidas, Puma, Converse tại K-NICKS..."
                  className="w-full rounded-xl border border-neutral-200 p-3.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all leading-relaxed resize-y"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Từ khóa SEO (Keywords, phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.seo.metaKeywords}
                  onChange={(e) => handleNestedChange('seo', 'metaKeywords', e.target.value)}
                  placeholder="knicks, giay sneaker chinh hang, nike air jordan, adidas ultraboost..."
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-black bg-neutral-50/50 focus:bg-white transition-all"
                />
              </div>

              {/* Google Search Result Preview */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                  XEM TRƯỚC HIỂN THỊ TRÊN GOOGLE (GOOGLE SEARCH SNIPPET)
                </span>
                <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                    <Globe size={12} className="text-neutral-400" />
                    <span>https://knicks.vn</span>
                  </div>
                  <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
                    {formData.seo.metaTitle || formData.seo.websiteTitle || formData.storeName}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {formData.seo.metaDescription || formData.storeDescription}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* SECTION 7: QUẢN LÝ NỘI DUNG CHÍNH SÁCH (Policies Editor)  */}
          {/* ======================================================== */}
          {activeSection === 'policies' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                  <FileText size={18} className="text-neutral-700" />
                  <span>QUẢN LÝ NỘI DUNG CHÍNH SÁCH & ĐIỀU KHOẢN</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Tùy chỉnh nội dung chi tiết các chính sách đổi trả, bảo hành, giao hàng, bảo mật và điều khoản sử dụng.
                </p>
              </div>

              {/* Policy Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
                {[
                  { id: 'return', label: 'Chính sách đổi trả (30 ngày)' },
                  { id: 'shipping', label: 'Chính sách vận chuyển' },
                  { id: 'privacy', label: 'Chính sách bảo mật' },
                  { id: 'terms', label: 'Điều khoản dịch vụ' },
                  { id: 'warranty', label: 'Chính sách bảo hành' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePolicyTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activePolicyTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Text Editor for Selected Policy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800">
                    Nội dung {activePolicyTab === 'return' ? 'Đổi trả' : activePolicyTab === 'shipping' ? 'Vận chuyển' : activePolicyTab === 'privacy' ? 'Bảo mật' : activePolicyTab === 'terms' ? 'Điều khoản' : 'Bảo hành'} (Hỗ trợ Markdown)
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Định dạng hỗ trợ: **in đậm**, - danh sách, # tiêu đề
                  </span>
                </div>

                {activePolicyTab === 'return' && (
                  <textarea
                    rows={12}
                    value={formData.policies.returnPolicy}
                    onChange={(e) => handleNestedChange('policies', 'returnPolicy', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 p-4 text-xs font-mono outline-none focus:border-black bg-neutral-50/30 focus:bg-white transition-all leading-relaxed"
                  />
                )}

                {activePolicyTab === 'shipping' && (
                  <textarea
                    rows={12}
                    value={formData.policies.shippingPolicy}
                    onChange={(e) => handleNestedChange('policies', 'shippingPolicy', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 p-4 text-xs font-mono outline-none focus:border-black bg-neutral-50/30 focus:bg-white transition-all leading-relaxed"
                  />
                )}

                {activePolicyTab === 'privacy' && (
                  <textarea
                    rows={12}
                    value={formData.policies.privacyPolicy}
                    onChange={(e) => handleNestedChange('policies', 'privacyPolicy', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 p-4 text-xs font-mono outline-none focus:border-black bg-neutral-50/30 focus:bg-white transition-all leading-relaxed"
                  />
                )}

                {activePolicyTab === 'terms' && (
                  <textarea
                    rows={12}
                    value={formData.policies.termsOfService}
                    onChange={(e) => handleNestedChange('policies', 'termsOfService', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 p-4 text-xs font-mono outline-none focus:border-black bg-neutral-50/30 focus:bg-white transition-all leading-relaxed"
                  />
                )}

                {activePolicyTab === 'warranty' && (
                  <textarea
                    rows={12}
                    value={formData.policies.warrantyPolicy || ''}
                    onChange={(e) => handleNestedChange('policies', 'warrantyPolicy', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 p-4 text-xs font-mono outline-none focus:border-black bg-neutral-50/30 focus:bg-white transition-all leading-relaxed"
                  />
                )}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </main>
  );
}
