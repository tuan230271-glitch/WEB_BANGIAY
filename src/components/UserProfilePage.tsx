import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  ShoppingBag,
  Heart,
  Lock,
  LogOut,
  MapPin,
  ChevronRight,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Camera,
  Eye,
  EyeOff,
  ShieldAlert,
  Sparkles,
  X,
  CreditCard,
  Building2,
  Calendar,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import { Product, SavedAddress, UserProfile, Order } from '../types';

interface UserProfilePageProps {
  user: UserProfile | null;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'checkout' | 'my-orders' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'profile' | 'wishlist', extraId?: string | null) => void;
  orders: Order[];
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: { name: string; hex: string }, quantity: number) => void;
  initialTab?: 'profile' | 'addresses' | 'orders' | 'wishlist' | 'password';
}

export default function UserProfilePage({
  user,
  onUpdateUser,
  onLogout,
  onNavigate,
  orders,
  favorites,
  onRemoveFavorite,
  onAddToCart,
  initialTab = 'profile'
}: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'addresses' | 'password' | 'wishlist'>(
    initialTab === 'password' ? 'password' : initialTab === 'addresses' ? 'addresses' : initialTab === 'wishlist' ? 'wishlist' : 'profile'
  );

  // Edit Personal Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '0987654321');
  const [profileBirthday, setProfileBirthday] = useState(user?.birthday || '1995-05-15');
  const [profileGender, setProfileGender] = useState<'nam' | 'nu' | 'khac'>(user?.gender || 'nam');
  const [toastMessage, setToastMessage] = useState('');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    if (user?.addresses && user.addresses.length > 0) return user.addresses;
    return [
      {
        id: 'addr-1',
        recipientName: user?.name || 'Nguyễn Văn A',
        phone: user?.phone || '0987654321',
        province: 'Khánh Hòa',
        district: 'Thành phố Nha Trang',
        ward: 'Phường Lộc Thọ',
        addressDetail: '123 Nguyễn Trãi',
        fullAddress: '123 Nguyễn Trãi, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
        isDefault: true
      },
      {
        id: 'addr-2',
        recipientName: user?.name || 'Nguyễn Văn A',
        phone: '0912345678',
        province: 'Thành phố Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        addressDetail: '45 Lê Duẩn',
        fullAddress: '45 Lê Duẩn, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
        isDefault: false
      }
    ];
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Address Form State
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrProvince, setAddrProvince] = useState('Khánh Hòa');
  const [addrDistrict, setAddrDistrict] = useState('Thành phố Nha Trang');
  const [addrWard, setAddrWard] = useState('Phường Lộc Thọ');
  const [addrDetail, setAddrDetail] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addrFormError, setAddrFormError] = useState('');

  // Logout Confirm Dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // If user is not logged in, prompt to log in
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-neutral-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/80 p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
            <User size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
              YÊU CẦU ĐĂNG NHẬP
            </h2>
            <p className="text-xs text-neutral-500">
              Vui lòng đăng nhập vào tài khoản K-NICKS để quản lý hồ sơ cá nhân và xem đơn hàng của bạn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="py-3 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="py-3 rounded-2xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial letter for Avatar
  const initialLetter = user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }

    onUpdateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      birthday: profileBirthday,
      gender: profileGender
    });

    setIsEditingProfile(false);
    setToastMessage('Cập nhật thông tin thành công.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Password strength helper
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

  const passStrength = getPasswordStrength(newPassword);

  // Handle password update
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (!newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải từ 8 ký tự trở lên.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    // Simulate success
    setPasswordSuccess('✓ Đổi mật khẩu thành công.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  // Open address modal for add or edit
  const handleOpenAddressModal = (addr?: SavedAddress) => {
    setAddrFormError('');
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrRecipient(addr.recipientName);
      setAddrPhone(addr.phone);
      setAddrProvince(addr.province);
      setAddrDistrict(addr.district);
      setAddrWard(addr.ward);
      setAddrDetail(addr.addressDetail);
      setAddrIsDefault(addr.isDefault);
    } else {
      setEditingAddressId(null);
      setAddrRecipient(user.name);
      setAddrPhone(user.phone || '');
      setAddrProvince('Khánh Hòa');
      setAddrDistrict('Thành phố Nha Trang');
      setAddrWard('Phường Lộc Thọ');
      setAddrDetail('');
      setAddrIsDefault(addresses.length === 0);
    }
    setShowAddressModal(true);
  };

  // Save address item
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrRecipient.trim() || !addrPhone.trim() || !addrDetail.trim()) {
      setAddrFormError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const fullAddr = `${addrDetail.trim()}, ${addrWard}, ${addrDistrict}, ${addrProvince}`;

    let updatedList: SavedAddress[] = [...addresses];

    if (editingAddressId) {
      updatedList = updatedList.map((item) => {
        if (item.id === editingAddressId) {
          return {
            ...item,
            recipientName: addrRecipient.trim(),
            phone: addrPhone.trim(),
            province: addrProvince,
            district: addrDistrict,
            ward: addrWard,
            addressDetail: addrDetail.trim(),
            fullAddress: fullAddr,
            isDefault: addrIsDefault
          };
        }
        return item;
      });
    } else {
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        recipientName: addrRecipient.trim(),
        phone: addrPhone.trim(),
        province: addrProvince,
        district: addrDistrict,
        ward: addrWard,
        addressDetail: addrDetail.trim(),
        fullAddress: fullAddr,
        isDefault: addrIsDefault
      };
      updatedList.push(newAddr);
    }

    // If set as default, remove default flag from others
    if (addrIsDefault) {
      const targetId = editingAddressId || updatedList[updatedList.length - 1].id;
      updatedList = updatedList.map((item) => ({
        ...item,
        isDefault: item.id === targetId
      }));
    }

    setAddresses(updatedList);
    onUpdateUser({ addresses: updatedList });
    setShowAddressModal(false);

    setToastMessage(editingAddressId ? 'Đã cập nhật địa chỉ.' : 'Đã thêm địa chỉ mới.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Set default address
  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    onUpdateUser({ addresses: updated });
    setToastMessage('Đã cập nhật địa chỉ mặc định.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Delete address
  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      alert('Bạn phải giữ ít nhất 1 địa chỉ liên hệ.');
      return;
    }
    const updated = addresses.filter((a) => a.id !== id);
    // If deleted default, set first as default
    if (!updated.some((a) => a.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    onUpdateUser({ addresses: updated });
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => onNavigate('home')} className="hover:text-black">Trang chủ</button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-400">Tài khoản</span>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="font-bold text-black">
            {activeTab === 'profile' && 'Hồ sơ cá nhân'}
            {activeTab === 'addresses' && 'Địa chỉ của tôi'}
            {activeTab === 'password' && 'Đổi mật khẩu'}
            {activeTab === 'wishlist' && 'Sản phẩm yêu thích'}
            {activeTab === 'overview' && 'Tổng quan tài khoản'}
          </span>
        </nav>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-bold shadow-2xl flex items-center justify-between gap-3 max-w-lg mx-auto"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-neutral-400 hover:text-white">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN LAYOUT: SIDEBAR (DESKTOP) + CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= ACCOUNT SIDEBAR (4 COLS) ================= */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 space-y-6 sticky top-24">
            
            {/* User Profile Brief Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
              <div className="relative group">
                <div className="h-16 w-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-2xl font-black uppercase shadow-md overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{initialLetter}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setToastMessage('Chức năng tải ảnh đại diện đã sẵn sàng.');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-neutral-300 shadow-sm flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer active:scale-95"
                  title="Thay đổi ảnh"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div className="space-y-1 overflow-hidden">
                <h2 className="text-base font-black text-neutral-900 truncate uppercase">
                  {user.name}
                </h2>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {user.role === 'admin' ? '⚡ Quản trị viên' : '👤 Thành viên'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block px-3 mb-2">
                TÀI KHOẢN CỦA TÔI
              </span>

              {/* Tab 1: Tổng quan */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Sparkles size={16} />
                <span className="flex-1 text-left">Tổng quan tài khoản</span>
              </button>

              {/* Tab 2: Hồ sơ cá nhân */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <User size={16} />
                <span className="flex-1 text-left">Hồ sơ cá nhân</span>
              </button>

              {/* Tab 3: Đơn hàng của tôi */}
              <button
                onClick={() => onNavigate('my-orders')}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span className="flex-1 text-left">Đơn hàng của tôi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-neutral-100 text-neutral-700">
                  {orders.length}
                </span>
              </button>

              {/* Tab 4: Yêu thích */}
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Heart size={16} />
                <span className="flex-1 text-left">Sản phẩm yêu thích</span>
                {favorites.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Tab 5: Địa chỉ */}
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <MapPin size={16} />
                <span className="flex-1 text-left">Địa chỉ của tôi</span>
              </button>

              {/* Tab 6: Đổi mật khẩu */}
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Lock size={16} />
                <span className="flex-1 text-left">Đổi mật khẩu</span>
              </button>

              <div className="pt-4 border-t border-neutral-100 mt-2">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  <span className="flex-1 text-left">Đăng xuất</span>
                </button>
              </div>

            </div>

          </div>

          {/* ================= CONTENT AREA (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ---------------- ACTIVE TAB 1: OVERVIEW ---------------- */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                    TỔNG QUAN TÀI KHOẢN
                  </h1>
                  <p className="text-xs text-neutral-500 mt-1">
                    Xin chào <strong>{user.name}</strong>, quản lý hồ sơ và theo dõi đơn hàng của bạn.
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      TỔNG ĐƠN HÀNG
                    </span>
                    <p className="text-2xl font-black text-neutral-900">{orders.length}</p>
                    <button
                      onClick={() => onNavigate('my-orders')}
                      className="text-[11px] font-bold text-neutral-700 hover:text-black underline flex items-center gap-1"
                    >
                      <span>Xem đơn hàng</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      SẢN PHẨM YÊU THÍCH
                    </span>
                    <p className="text-2xl font-black text-neutral-900">{favorites.length}</p>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className="text-[11px] font-bold text-neutral-700 hover:text-black underline flex items-center gap-1"
                    >
                      <span>Xem yêu thích</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      ĐỊA CHỈ ĐÃ LƯU
                    </span>
                    <p className="text-2xl font-black text-neutral-900">{addresses.length}</p>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-[11px] font-bold text-neutral-700 hover:text-black underline flex items-center gap-1"
                    >
                      <span>Quản lý địa chỉ</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Default Address Summary */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                      <MapPin size={16} className="text-neutral-600" />
                      <span>Địa chỉ mặc định</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-xs font-bold text-black underline hover:text-neutral-600"
                    >
                      Thay đổi
                    </button>
                  </div>

                  {addresses.find((a) => a.isDefault) ? (
                    <div className="text-xs text-neutral-600 space-y-1">
                      <p className="font-bold text-neutral-900">
                        {addresses.find((a) => a.isDefault)?.recipientName} ({addresses.find((a) => a.isDefault)?.phone})
                      </p>
                      <p>{addresses.find((a) => a.isDefault)?.fullAddress}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">Chưa thiết lập địa chỉ mặc định.</p>
                  )}
                </div>

              </div>
            )}

            {/* ---------------- ACTIVE TAB 2: PROFILE INFO ---------------- */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                      THÔNG TIN CÁ NHÂN
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Quản lý thông tin tài khoản của bạn.
                    </p>
                  </div>

                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2.5 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Edit3 size={14} />
                      <span>CHỈNH SỬA</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileName(user.name);
                          setProfilePhone(user.phone || '');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        HỦY
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  
                  {/* Row 1: Avatar Letter + Name */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <div className="h-16 w-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-black uppercase shrink-0">
                      {initialLetter}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500">Ảnh đại diện từ tên viết tắt của bạn</p>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage('Chức năng tải ảnh đại diện đã sẵn sàng.');
                          setTimeout(() => setToastMessage(''), 3000);
                        }}
                        className="text-[11px] font-bold text-black underline hover:text-neutral-600 cursor-pointer"
                      >
                        Thay đổi ảnh
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-800 block">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 px-4 text-xs font-semibold text-neutral-900 outline-none disabled:opacity-75 focus:bg-white focus:border-black"
                      />
                    </div>

                    {/* Email (Read only login email) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-800 block">
                          Email đăng nhập
                        </label>
                        <span className="text-[10px] text-neutral-400 italic">Cố định</span>
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-100 py-3 px-4 text-xs font-semibold text-neutral-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-800 block">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditingProfile}
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 px-4 text-xs font-semibold text-neutral-900 outline-none disabled:opacity-75 focus:bg-white focus:border-black"
                      />
                    </div>

                    {/* Birthday */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-800 block">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        disabled={!isEditingProfile}
                        value={profileBirthday}
                        onChange={(e) => setProfileBirthday(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 px-4 text-xs font-semibold text-neutral-900 outline-none disabled:opacity-75 focus:bg-white focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">Giới tính</label>
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          disabled={!isEditingProfile}
                          checked={profileGender === 'nam'}
                          onChange={() => setProfileGender('nam')}
                          className="accent-black"
                        />
                        <span>Nam</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          disabled={!isEditingProfile}
                          checked={profileGender === 'nu'}
                          onChange={() => setProfileGender('nu')}
                          className="accent-black"
                        />
                        <span>Nữ</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          disabled={!isEditingProfile}
                          checked={profileGender === 'khac'}
                          onChange={() => setProfileGender('khac')}
                          className="accent-black"
                        />
                        <span>Khác</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons when editing */}
                  {isEditingProfile && (
                    <div className="pt-3 flex gap-3 border-t border-neutral-100">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                      >
                        LƯU THAY ĐỔI
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileName(user.name);
                        }}
                        className="px-5 py-3 rounded-2xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all cursor-pointer"
                      >
                        HỦY
                      </button>
                    </div>
                  )}

                </form>

              </div>
            )}

            {/* ---------------- ACTIVE TAB 3: ADDRESSES ---------------- */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                      SỔ ĐỊA CHỈ
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Quản lý địa chỉ giao hàng cho các đơn hàng của bạn.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenAddressModal()}
                    className="px-4 py-2.5 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus size={16} />
                    <span>THÊM ĐỊA CHỈ</span>
                  </button>
                </div>

                {/* Addresses List */}
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-neutral-900 bg-neutral-900/5 shadow-2xs'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-neutral-900">
                              {addr.recipientName}
                            </h3>
                            <span className="text-xs font-bold text-neutral-500">|</span>
                            <span className="text-xs font-bold text-neutral-700">{addr.phone}</span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-neutral-900 text-white uppercase tracking-wider">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                            {addr.fullAddress}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenAddressModal(addr)}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ---------------- ACTIVE TAB 4: WISHLIST ---------------- */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                    SẢN PHẨM YÊU THÍCH ({favorites.length})
                  </h1>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Các sản phẩm bạn đã lưu để mua sau.
                  </p>
                </div>

                {favorites.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Heart size={40} className="mx-auto text-neutral-300" />
                    <p className="text-sm font-bold text-neutral-700">Danh sách yêu thích trống</p>
                    <p className="text-xs text-neutral-400">Khám phá bộ sưu tập mới nhất để thêm vào yêu thích.</p>
                    <button
                      onClick={() => onNavigate('products')}
                      className="px-5 py-2.5 rounded-2xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                      MUA SẮM NGAY
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center gap-4 hover:border-neutral-300 transition-all"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-20 w-20 rounded-xl object-contain shrink-0 bg-white border border-neutral-100 p-1"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs font-black text-neutral-900">
                            {product.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                onAddToCart(
                                  product,
                                  product.sizes[0] || 40,
                                  product.colors[0] || { name: 'Mặc định', hex: '#000000' },
                                  1
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-black text-white text-[10px] font-bold uppercase hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                              Thêm giỏ hàng
                            </button>
                            <button
                              onClick={() => onRemoveFavorite(product)}
                              className="p-1.5 rounded-xl bg-neutral-100 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Xóa khỏi yêu thích"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- ACTIVE TAB 5: CHANGE PASSWORD ---------------- */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
                    ĐỔI MẬT KHẨU
                  </h1>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
                  </p>
                </div>

                <AnimatePresence>
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}

                  {passwordSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>{passwordSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  
                  {/* Field 1: Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Mật khẩu hiện tại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-medium outline-none focus:bg-white focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Field 2: New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-medium outline-none focus:bg-white focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength Indicator */}
                    {newPassword && (
                      <div className="pt-1 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-neutral-500">Mức độ an toàn:</span>
                          <span className={passStrength.textColor}>{passStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-neutral-200'}`} />
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 2 ? passStrength.color : 'bg-neutral-200'}`} />
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-neutral-200'}`} />
                          <div className={`h-full flex-1 rounded-full ${passStrength.score >= 4 ? passStrength.color : 'bg-neutral-200'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Field 3: Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-11 text-xs font-medium outline-none focus:bg-white focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showConfirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md cursor-pointer pt-3"
                  >
                    CẬP NHẬT MẬT KHẨU
                  </button>

                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= MODAL: ADD / EDIT ADDRESS ================= */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-black text-neutral-900 uppercase">
                  {editingAddressId ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI'}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>

              {addrFormError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {addrFormError}
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Họ tên người nhận *
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs font-medium outline-none focus:bg-white focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      placeholder="09xxxxxxxx"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs font-medium outline-none focus:bg-white focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Tỉnh/Thành *</label>
                    <select
                      value={addrProvince}
                      onChange={(e) => setAddrProvince(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-3 text-xs font-medium outline-none focus:bg-white focus:border-black"
                    >
                      <option value="Khánh Hòa">Khánh Hòa</option>
                      <option value="Thành phố Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Quận/Huyện *</label>
                    <input
                      type="text"
                      placeholder="Quận/Huyện"
                      value={addrDistrict}
                      onChange={(e) => setAddrDistrict(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-3 text-xs font-medium outline-none focus:bg-white focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Phường/Xã *</label>
                    <input
                      type="text"
                      placeholder="Phường/Xã"
                      value={addrWard}
                      onChange={(e) => setAddrWard(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-3 text-xs font-medium outline-none focus:bg-white focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-800 block">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường..."
                    value={addrDetail}
                    onChange={(e) => setAddrDetail(e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs font-medium outline-none focus:bg-white focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="addrDefaultCheck"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded-md border-neutral-300 accent-black cursor-pointer"
                  />
                  <label htmlFor="addrDefaultCheck" className="text-xs text-neutral-700 font-medium cursor-pointer">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                  >
                    LƯU ĐỊA CHỈ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-5 py-3.5 rounded-2xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    HỦY
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: LOGOUT CONFIRM ================= */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut size={22} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-neutral-900 uppercase">
                  XÁC NHẬN ĐĂNG XUẤT
                </h3>
                <p className="text-xs text-neutral-500">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản K-NICKS không?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="py-3 rounded-2xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                >
                  ĐĂNG XUẤT
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-3 rounded-2xl bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  HỦY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
