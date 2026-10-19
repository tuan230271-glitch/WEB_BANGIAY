import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Lock,
  Unlock,
  Trash2,
  X,
  Check,
  AlertCircle,
  ShoppingBag,
  Clock,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  ExternalLink,
  ShieldAlert,
  Key,
  CheckCircle2,
  Loader2,
  Info
} from 'lucide-react';
import { UserProfile, Order, Review } from '../../types';
import { usersApi } from '../../services/api';
import { ADMINISTRATIVE_PROVINCES } from '../../data/locations';

// Helper component for Searchable Location Dropdowns (Provinces & Wards)
interface LocationDropdownProps {
  id?: string;
  label: string;
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  disabledHint?: string;
  error?: string;
  required?: boolean;
}

function LocationDropdown({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  disabledHint,
  error,
  required = false
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((opt) => opt.name.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <label className="block text-xs font-bold text-neutral-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              setSearch('');
            }
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
            disabled
              ? 'bg-neutral-100/80 border-neutral-200 text-neutral-400 cursor-not-allowed'
              : error
              ? 'bg-rose-50/30 border-rose-400 text-neutral-900 cursor-pointer'
              : isOpen
              ? 'bg-white border-black ring-1 ring-black text-neutral-900'
              : 'bg-neutral-50 border-neutral-200 hover:border-neutral-400 text-neutral-900 cursor-pointer'
          }`}
        >
          <span className={value ? 'font-bold text-neutral-900 truncate' : 'text-neutral-400 truncate'}>
            {value || placeholder}
          </span>
          <ChevronDown
            size={14}
            className={`text-neutral-400 shrink-0 ml-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-black' : ''
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden p-2 space-y-1">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm nhanh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-black focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="max-h-44 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-0.5 mt-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = value === opt.name;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChange(opt.name);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white font-bold'
                          : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <span className="truncate">{opt.name}</span>
                      {isSelected && <Check size={13} className="text-white shrink-0 ml-2" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-3 text-center text-[11px] text-neutral-400">
                  Không tìm thấy kết quả phù hợp
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {disabled && disabledHint && (
        <p className="text-[10px] text-neutral-400 italic mt-0.5">{disabledHint}</p>
      )}

      {error && (
        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// Helper to parse existing single string address into { province, ward, detail }
function parseCustomerAddress(fullAddr?: string): { province: string; ward: string; detail: string } {
  if (!fullAddr || !fullAddr.trim()) {
    return { province: '', ward: '', detail: '' };
  }

  const raw = fullAddr.trim();

  // Find matching province from 34 provinces
  let matchedProvince = ADMINISTRATIVE_PROVINCES.find((p) =>
    raw.toLowerCase().includes(p.name.toLowerCase())
  );

  // Special aliases check for Hồ Chí Minh
  if (!matchedProvince && (raw.toLowerCase().includes('hồ chí minh') || raw.toLowerCase().includes('hcm') || raw.toLowerCase().includes('tp.hcm'))) {
    matchedProvince = ADMINISTRATIVE_PROVINCES.find((p) => p.name.includes('Hồ Chí Minh'));
  }

  const provinceName = matchedProvince ? matchedProvince.name : '';
  let wardName = '';

  if (matchedProvince) {
    const matchedWard = matchedProvince.wards.find((w) =>
      raw.toLowerCase().includes(w.name.toLowerCase())
    );
    if (matchedWard) {
      wardName = matchedWard.name;
    }
  }

  // Extract detail street address
  let detailStr = raw;
  if (provinceName) {
    const parts = raw.split(',').map((s) => s.trim());
    if (parts.length >= 3) {
      detailStr = parts[0];
    } else if (parts.length === 2 && wardName) {
      detailStr = parts[0];
    } else {
      let remaining = raw;
      if (provinceName) remaining = remaining.replace(new RegExp(provinceName, 'gi'), '');
      if (wardName) remaining = remaining.replace(new RegExp(wardName, 'gi'), '');
      detailStr = remaining.replace(/^[,\s-]+|[,\s-]+$/g, '').trim();
    }
  }

  return {
    province: provinceName,
    ward: wardName,
    detail: detailStr || raw
  };
}

interface CustomerManagementProps {
  usersList: UserProfile[];
  setUsersList: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  orders: Order[];
  reviews: Review[];
  showToast: (msg: string) => void;
  onNavigateToOrders: (customerEmailOrCode?: string) => void;
}

export default function CustomerManagement({
  usersList,
  setUsersList,
  orders,
  reviews,
  showToast,
  onNavigateToOrders
}: CustomerManagementProps) {
  // Search, Filter, Sort, Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Đang hoạt động' | 'Bị khóa'>('All');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'newest' | 'oldest' | 'spent_desc' | 'orders_desc'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals & Drawers States
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProvince, setEditProvince] = useState('');
  const [editWard, setEditWard] = useState('');
  const [editAddressDetail, setEditAddressDetail] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [isResetPasswordConfirmOpen, setIsResetPasswordConfirmOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'Đang hoạt động' as 'Đang hoạt động' | 'Bị khóa',
    address: ''
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Lock / Unlock Confirmation Modal
  const [customerToToggleLock, setCustomerToToggleLock] = useState<UserProfile | null>(null);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  // Delete Confirmation Modal
  const [customerToDelete, setCustomerToDelete] = useState<UserProfile | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Currency Formatter
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // ----------------------------------------------------
  // CALCULATED CUSTOMER STATS & AGGREGATIONS
  // ----------------------------------------------------
  
  // Non-deleted customers list
  const activeUsers = useMemo(() => {
    return usersList.filter(u => !u.isDeleted);
  }, [usersList]);

  // Quick Stats Cards
  const stats = useMemo(() => {
    const total = activeUsers.length;
    const active = activeUsers.filter(u => u.status !== 'Bị khóa').length;
    const locked = activeUsers.filter(u => u.status === 'Bị khóa').length;
    
    // New customers in last 30 days or default seed new
    const newCount = activeUsers.filter(u => {
      if (!u.createdAt) return false;
      return true; // Count non-empty created date
    }).length;

    return { total, active, newCount, locked };
  }, [activeUsers]);

  // Compute Order Stats for a specific user
  const getCustomerOrderStats = (user: UserProfile) => {
    const userOrders = orders.filter(o => {
      if (user.id && o.userId === user.id) return true;
      if (user.email && o.email?.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.phone && o.phone === user.phone) return true;
      if (user.name && o.recipientName?.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });

    const totalOrders = userOrders.length;
    const completedOrders = userOrders.filter(o => o.status === 'Đã giao' || o.status === 'Đã giao hàng');
    const cancelledOrders = userOrders.filter(o => o.status === 'Đã hủy');
    const totalSpent = completedOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    return {
      ordersList: userOrders,
      totalOrders,
      completedCount: completedOrders.length,
      cancelledCount: cancelledOrders.length,
      totalSpent
    };
  };

  // Compute Reviews written by a user
  const getCustomerReviews = (user: UserProfile) => {
    return reviews.filter(r => {
      if (user.id && r.userId === user.id) return true;
      if (user.email && r.name && user.name && r.name.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });
  };

  // ----------------------------------------------------
  // SEARCH, FILTER, SORT & PAGINATION
  // ----------------------------------------------------
  const filteredCustomers = useMemo(() => {
    return activeUsers.filter(u => {
      // Status Filter
      if (statusFilter === 'Đang hoạt động' && u.status === 'Bị khóa') return false;
      if (statusFilter === 'Bị khóa' && u.status !== 'Bị khóa') return false;

      // Search Query (Name, Email, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchPhone = u.phone ? u.phone.includes(q) : false;
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name, 'vi');
      }
      if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name, 'vi');
      }
      if (sortBy === 'oldest') {
        return (a.id || '').localeCompare(b.id || '');
      }
      if (sortBy === 'spent_desc') {
        const spentA = getCustomerOrderStats(a).totalSpent;
        const spentB = getCustomerOrderStats(b).totalSpent;
        return spentB - spentA;
      }
      if (sortBy === 'orders_desc') {
        const ordersA = getCustomerOrderStats(a).totalOrders;
        const ordersB = getCustomerOrderStats(b).totalOrders;
        return ordersB - ordersA;
      }
      // Default: newest
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [activeUsers, searchQuery, statusFilter, sortBy, orders]);

  // Paginated List
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Reset to page 1 on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: 'All' | 'Đang hoạt động' | 'Bị khóa') => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // ADD NEW CUSTOMER
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!newCustomer.name.trim()) {
      errors.name = 'Họ và tên không được để trống.';
    }

    if (!newCustomer.email.trim()) {
      errors.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email.trim())) {
      errors.email = 'Email không đúng định dạng.';
    } else {
      const emailExists = usersList.some(
        u => u.email.toLowerCase() === newCustomer.email.trim().toLowerCase()
      );
      if (emailExists) {
        errors.email = 'Email này đã tồn tại trong hệ thống.';
      }
    }

    if (!newCustomer.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống.';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(newCustomer.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ (10 chữ số).';
    } else {
      const phoneExists = usersList.some(
        u => u.phone && u.phone.trim() === newCustomer.phone.trim()
      );
      if (phoneExists) {
        errors.phone = 'Số điện thoại này đã tồn tại trong hệ thống.';
      }
    }

    if (!newCustomer.password) {
      errors.password = 'Mật khẩu tạm thời không được để trống.';
    } else if (newCustomer.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const newUserObj: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newCustomer.name.trim(),
      email: newCustomer.email.trim().toLowerCase(),
      phone: newCustomer.phone.trim(),
      role: 'user',
      status: newCustomer.status,
      address: newCustomer.address.trim() || undefined,
      createdAt: todayStr,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80`
    };

    setUsersList(prev => [newUserObj, ...prev]);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'Đang hoạt động',
      address: ''
    });
    setAddErrors({});
    showToast(`Thêm khách hàng "${newUserObj.name}" thành công.`);
  };

  // OPEN EDIT CUSTOMER MODAL
  const handleOpenEditModal = (customer: UserProfile) => {
    const parsed = parseCustomerAddress(customer.address);
    setEditingCustomer({ ...customer });
    setEditProvince(parsed.province);
    setEditWard(parsed.ward);
    setEditAddressDetail(parsed.detail);
    setEditErrors({});
    setIsSavingCustomer(false);
    setIsEditModalOpen(true);
  };

  // CONFIRM RESET PASSWORD
  const handleConfirmResetPassword = () => {
    if (!editingCustomer) return;
    setIsResettingPassword(true);
    setTimeout(() => {
      setIsResettingPassword(false);
      setIsResetPasswordConfirmOpen(false);
      showToast('Đã đặt lại mật khẩu thành công.');
    }, 450);
  };

  // EDIT CUSTOMER SAVE HANDLER
  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const errors: Record<string, string> = {};

    // 1. Validate Họ và tên (không được để trống)
    if (!editingCustomer.name || !editingCustomer.name.trim()) {
      errors.name = 'Họ và tên không được để trống.';
    }

    // 2. Validate Số điện thoại (chỉ số, chuẩn VN 10 số)
    if (editingCustomer.phone && editingCustomer.phone.trim()) {
      const cleanPhone = editingCustomer.phone.trim();
      if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
        errors.phone = 'Số điện thoại không hợp lệ (10 chữ số VN, VD: 0987654321).';
      }
    }

    // 3. Validate Địa chỉ nếu có chọn Tỉnh/Thành phố
    if (editProvince && !editWard) {
      errors.ward = 'Vui lòng chọn Phường/Xã cho tỉnh/thành phố đã chọn.';
    }

    setEditErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSavingCustomer(true);

    // Build final combined address
    let finalAddress = '';
    if (editAddressDetail.trim() || editWard || editProvince) {
      const parts: string[] = [];
      if (editAddressDetail.trim()) parts.push(editAddressDetail.trim());
      if (editWard) parts.push(editWard);
      if (editProvince) parts.push(editProvince);
      finalAddress = parts.join(', ');
    } else {
      finalAddress = editingCustomer.address || '';
    }

    const updatedCustomer: UserProfile = {
      ...editingCustomer,
      name: editingCustomer.name.trim(),
      phone: editingCustomer.phone?.trim() || undefined,
      address: finalAddress || undefined,
    };

    setTimeout(() => {
      // 1. Update usersList state
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === updatedCustomer.id || u.email.toLowerCase() === updatedCustomer.email.toLowerCase()
            ? updatedCustomer
            : u
        )
      );
      if (updatedCustomer.id) {
        usersApi.update(updatedCustomer.id, updatedCustomer).catch((err) => console.warn('Update user in API failed:', err));
      }

      // 2. Sync localStorage 'solestyle_users'
      try {
        const saved = localStorage.getItem('solestyle_users');
        if (saved) {
          const parsed: UserProfile[] = JSON.parse(saved);
          const updated = parsed.map((u) =>
            u.id === updatedCustomer.id || u.email.toLowerCase() === updatedCustomer.email.toLowerCase()
              ? updatedCustomer
              : u
          );
          localStorage.setItem('solestyle_users', JSON.stringify(updated));
        }
      } catch (err) {
        console.error(err);
      }

      // 3. If currently logged in user is being edited, sync active session
      try {
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
          const curUser = JSON.parse(currentUserStr);
          if (
            curUser.id === updatedCustomer.id ||
            curUser.email?.toLowerCase() === updatedCustomer.email?.toLowerCase()
          ) {
            localStorage.setItem('user', JSON.stringify({ ...curUser, ...updatedCustomer }));
          }
        }
      } catch (err) {
        console.error(err);
      }

      setIsSavingCustomer(false);
      setIsEditModalOpen(false);
      setEditingCustomer(null);
      showToast('Đã cập nhật thông tin khách hàng.');
    }, 450);
  };

  // LOCK / UNLOCK TOGGLE
  const handleConfirmToggleLock = () => {
    if (!customerToToggleLock) return;

    const newStatus = customerToToggleLock.status === 'Bị khóa' ? 'Đang hoạt động' : 'Bị khóa';

    setUsersList(prev =>
      prev.map(u =>
        u.id === customerToToggleLock.id ? { ...u, status: newStatus } : u
      )
    );
    if (customerToToggleLock.id) {
      usersApi.update(customerToToggleLock.id, { status: newStatus }).catch((err) => console.warn('Toggle user lock in API failed:', err));
    }

    setIsLockModalOpen(false);
    showToast(
      `Đã ${newStatus === 'Bị khóa' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản khách hàng "${customerToToggleLock.name}".`
    );

    if (selectedCustomer && selectedCustomer.id === customerToToggleLock.id) {
      setSelectedCustomer(prev => (prev ? { ...prev, status: newStatus } : null));
    }

    setCustomerToToggleLock(null);
  };

  // DELETE CUSTOMER (SOFT DELETE SAFETY)
  const handleConfirmDelete = () => {
    if (!customerToDelete) return;

    const statsObj = getCustomerOrderStats(customerToDelete);

    if (statsObj.totalOrders > 0) {
      // Soft Delete: Disable account & mark as deleted to preserve order history
      setUsersList(prev =>
        prev.map(u =>
          u.id === customerToDelete.id
            ? { ...u, status: 'Bị khóa', isDeleted: true }
            : u
        )
      );
      if (customerToDelete.id) {
        usersApi.update(customerToDelete.id, { status: 'Bị khóa' }).catch((err) => console.warn('Soft delete user in API failed:', err));
      }
      showToast(`Đã vô hiệu hóa tài khoản "${customerToDelete.name}". Lịch sử ${statsObj.totalOrders} đơn hàng đã được bảo toàn.`);
    } else {
      // Hard delete if no orders
      setUsersList(prev => prev.filter(u => u.id !== customerToDelete.id));
      if (customerToDelete.id) {
        usersApi.delete(customerToDelete.id).catch((err) => console.warn('Delete user in API failed:', err));
      }
      showToast(`Đã xóa khách hàng "${customerToDelete.name}" khỏi hệ thống.`);
    }

    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans">
      {/* -------------------------------------------------- */}
      {/* 1. HEADER & TOP ACTION BUTTON - COMPACT            */}
      {/* -------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <Users size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 uppercase tracking-tight">
              Quản Lý Khách Hàng
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {stats.total} khách hàng
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Theo dõi danh sách khách hàng, thống kê chi tiêu, trạng thái tài khoản và đơn hàng
          </p>
        </div>

        <button
          onClick={() => {
            setNewCustomer({
              name: '',
              email: '',
              phone: '',
              password: '',
              status: 'Đang hoạt động',
              address: ''
            });
            setAddErrors({});
            setIsAddModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={15} className="text-amber-400" />
          <span>Thêm Khách Hàng</span>
        </button>
      </div>

      {/* -------------------------------------------------- */}
      {/* 2. STATS CARDS (4 CARDS) - HÀNG NGANG              */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Tổng khách hàng */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
          <span className="text-xs font-bold text-neutral-600">Tất cả khách hàng :</span>
          <span className="text-xs font-black text-neutral-900">
            {stats.total} <span className="font-semibold text-neutral-500">khách</span>
          </span>
        </div>

        {/* Card 2: Khách hàng hoạt động */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đang hoạt động :</span>
          </span>
          <span className="text-xs font-black text-emerald-700">
            {stats.active} <span className="font-semibold text-neutral-500">tài khoản</span>
          </span>
        </div>

        {/* Card 3: Khách hàng mới */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>⭐</span>
            <span>Khách hàng mới :</span>
          </span>
          <span className="text-xs font-black text-amber-700">
            {stats.newCount} <span className="font-semibold text-neutral-500">người</span>
          </span>
        </div>

        {/* Card 4: Khách hàng bị khóa */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
          <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>🔒</span>
            <span>Tài khoản khóa :</span>
          </span>
          <span className="text-xs font-black text-rose-700">
            {stats.locked} <span className="font-semibold text-neutral-500">tài khoản</span>
          </span>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 3. SEARCH & FILTERS BAR                            */}
      {/* -------------------------------------------------- */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="🔍 Tìm kiếm khách hàng theo Tên, Email, Số điện thoại..."
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-black pl-10 pr-9 py-2 rounded-xl text-xs font-semibold border border-transparent focus:border-black transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value as any)}
              className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 outline-none cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang hoạt động">● Đang hoạt động</option>
              <option value="Bị khóa">● Bị khóa</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 outline-none cursor-pointer"
            >
              <option value="newest">Mới đăng ký nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="spent_desc">Tổng chi tiêu cao nhất</option>
              <option value="orders_desc">Số đơn hàng nhiều nhất</option>
              <option value="name_asc">Tên A → Z</option>
              <option value="name_desc">Tên Z → A</option>
            </select>
          </div>

          {/* Items Per Page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 px-2.5 py-2 rounded-xl text-xs font-bold border border-neutral-200 outline-none cursor-pointer"
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>

        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 4. TABLE VIEW (DESKTOP) & CARD VIEW (MOBILE)       */}
      {/* -------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1100px]">
            <thead className="bg-neutral-50/90 border-b border-neutral-200/80 text-neutral-500 font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 w-12 text-center">STT</th>
                <th className="py-3.5 px-5 min-w-[200px]">Khách hàng</th>
                <th className="py-3.5 px-5 min-w-[200px]">Email</th>
                <th className="py-3.5 px-5 min-w-[130px]">Số điện thoại</th>
                <th className="py-3.5 px-5 text-center min-w-[90px]">Số đơn</th>
                <th className="py-3.5 px-5 text-right min-w-[130px]">Tổng chi tiêu</th>
                <th className="py-3.5 px-5 text-center min-w-[120px]">Trạng thái</th>
                <th className="py-3.5 px-5 min-w-[120px]">Ngày đăng ký</th>
                <th className="py-3.5 px-5 text-right min-w-[110px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + index + 1;
                  const orderStats = getCustomerOrderStats(customer);
                  const isLocked = customer.status === 'Bị khóa';

                  return (
                    <tr
                      key={customer.id || index}
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-4 px-5 text-center text-neutral-400 font-extrabold">
                        {globalIdx}
                      </td>

                      {/* Khách hàng Avatar + Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-neutral-200 text-neutral-800 font-black text-xs flex items-center justify-center overflow-hidden shrink-0 border border-neutral-300">
                            {customer.avatar ? (
                              <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
                            ) : (
                              customer.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 group-hover:text-black block truncate">
                              {customer.name}
                            </span>
                            {customer.role === 'admin' && (
                              <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 text-neutral-600 font-medium">
                        {customer.email}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 text-neutral-700 font-bold">
                        {customer.phone || 'Chưa cập nhật'}
                      </td>

                      {/* Số đơn hàng */}
                      <td className="py-4 px-5 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-neutral-100 font-black text-neutral-900 text-[11px]">
                          {orderStats.totalOrders}
                        </span>
                      </td>

                      {/* Tổng chi tiêu */}
                      <td className="py-4 px-5 text-right font-black text-emerald-600">
                        {formatVND(orderStats.totalSpent)}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-5 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                            Bị khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Đang hoạt động
                          </span>
                        )}
                      </td>

                      {/* Ngày đăng ký */}
                      <td className="py-4 px-5 text-neutral-500 font-medium">
                        {customer.createdAt || '15/01/2026'}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Xem Chi Tiết */}
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDetailDrawerOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                            title="Xem chi tiết khách hàng"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Sửa thông tin */}
                          <button
                            onClick={() => handleOpenEditModal(customer)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit size={15} />
                          </button>

                          {/* Khóa / Mở khóa */}
                          <button
                            onClick={() => {
                              setCustomerToToggleLock(customer);
                              setIsLockModalOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isLocked
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white'
                            }`}
                            title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                          </button>

                          {/* Xóa khách hàng */}
                          <button
                            onClick={() => {
                              setCustomerToDelete(customer);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-600 hover:text-white text-neutral-400 transition-colors cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    <Users size={32} className="mx-auto mb-2 text-neutral-300" />
                    <p className="font-bold text-xs">Không tìm thấy khách hàng nào phù hợp.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-neutral-100">
          {paginatedCustomers.length > 0 ? (
            paginatedCustomers.map((customer, index) => {
              const orderStats = getCustomerOrderStats(customer);
              const isLocked = customer.status === 'Bị khóa';

              return (
                <div key={customer.id || index} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-neutral-200 text-neutral-800 font-black text-xs flex items-center justify-center overflow-hidden border">
                        {customer.avatar ? (
                          <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
                        ) : (
                          customer.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-neutral-900">{customer.name}</h4>
                        <p className="text-[11px] text-neutral-500">{customer.email}</p>
                      </div>
                    </div>

                    {isLocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                        Bị khóa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        Hoạt động
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold bg-neutral-50 p-2.5 rounded-2xl">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Số điện thoại:</span>
                      <span className="text-neutral-800 font-bold">{customer.phone || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Số đơn hàng:</span>
                      <span className="text-neutral-800 font-bold">{orderStats.totalOrders} đơn</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Tổng chi tiêu:</span>
                      <span className="text-emerald-600 font-black">{formatVND(orderStats.totalSpent)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Ngày đăng ký:</span>
                      <span className="text-neutral-800">{customer.createdAt || '15/01/2026'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsDetailDrawerOpen(true);
                      }}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Xem</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(customer)}
                      className="px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit size={13} />
                      <span>Sửa</span>
                    </button>

                    <button
                      onClick={() => {
                        setCustomerToToggleLock(customer);
                        setIsLockModalOpen(true);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        isLocked ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isLocked ? <Unlock size={13} /> : <Lock size={13} />}
                      <span>{isLocked ? 'Mở khóa' : 'Khóa'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-neutral-400 text-xs font-bold">
              Không tìm thấy khách hàng nào.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-neutral-600">
            <span>
              Hiển thị {paginatedCustomers.length} / {filteredCustomers.length} khách hàng
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-extrabold cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-black text-white'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* -------------------------------------------------- */}
      {/* 5. DRAWER / MODAL: CHI TIẾT KHÁCH HÀNG              */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isDetailDrawerOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 font-black text-sm text-neutral-800 flex items-center justify-center overflow-hidden border">
                    {selectedCustomer.avatar ? (
                      <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="h-full w-full object-cover" />
                    ) : (
                      selectedCustomer.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900">{selectedCustomer.name}</h3>
                    <p className="text-xs text-neutral-500 font-medium">{selectedCustomer.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                
                {/* 1. Thông tin cá nhân */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
                  <h4 className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users size={14} className="text-amber-500" />
                    THÔNG TIN CÁ NHÂN
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Họ và tên:</span>
                      <span className="text-neutral-900 font-bold">{selectedCustomer.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Trạng thái tài khoản:</span>
                      {selectedCustomer.status === 'Bị khóa' ? (
                        <span className="text-rose-600 font-black">Bị khóa</span>
                      ) : (
                        <span className="text-emerald-600 font-black">Đang hoạt động</span>
                      )}
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Email:</span>
                      <span className="text-neutral-900">{selectedCustomer.email}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Số điện thoại:</span>
                      <span className="text-neutral-900">{selectedCustomer.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Ngày đăng ký:</span>
                      <span className="text-neutral-900">{selectedCustomer.createdAt || '15/01/2026'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Giới tính:</span>
                      <span className="text-neutral-900 uppercase">{selectedCustomer.gender || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Địa chỉ giao hàng đã lưu */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                  <h4 className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    ĐỊA CHỈ GIAO HÀNG ĐÃ LƯU
                  </h4>

                  <p className="text-neutral-800 font-medium leading-relaxed">
                    {selectedCustomer.address || '123 Nguyễn Trãi, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa'}
                  </p>
                </div>

                {/* 3. Thống kê mua hàng */}
                {(() => {
                  const statsObj = getCustomerOrderStats(selectedCustomer);
                  return (
                    <div className="space-y-3">
                      <h4 className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-emerald-500" />
                          THỐNG KÊ MUA HÀNG
                        </span>
                        
                        <button
                          onClick={() => {
                            setIsDetailDrawerOpen(false);
                            onNavigateToOrders(selectedCustomer.email);
                          }}
                          className="text-amber-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Xem trong Đơn hàng</span>
                          <ExternalLink size={12} />
                        </button>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
                          <span className="text-[10px] font-bold text-neutral-400 block">Tổng số đơn</span>
                          <span className="text-lg font-black text-neutral-900">{statsObj.totalOrders}</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
                          <span className="text-[10px] font-bold text-neutral-400 block">Đơn hoàn thành</span>
                          <span className="text-lg font-black text-emerald-600">{statsObj.completedCount}</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
                          <span className="text-[10px] font-bold text-neutral-400 block">Đơn đã hủy</span>
                          <span className="text-lg font-black text-rose-500">{statsObj.cancelledCount}</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
                          <span className="text-[10px] font-bold text-neutral-400 block">Tổng chi tiêu</span>
                          <span className="text-xs font-black text-emerald-600 block mt-1">{formatVND(statsObj.totalSpent)}</span>
                        </div>
                      </div>

                      {/* Lịch sử đơn hàng */}
                      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                        <div className="p-3 bg-neutral-50 border-b border-neutral-200 font-extrabold text-[11px] text-neutral-700 uppercase">
                          LỊCH SỬ ĐƠN HÀNG ({statsObj.ordersList.length})
                        </div>

                        {statsObj.ordersList.length > 0 ? (
                          <div className="divide-y divide-neutral-100 max-h-52 overflow-y-auto">
                            {statsObj.ordersList.map(ord => (
                              <div key={ord.id} className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50">
                                <div>
                                  <span className="font-black text-neutral-900 block">{ord.orderCode}</span>
                                  <span className="text-[10px] text-neutral-400 font-medium">{ord.orderDate}</span>
                                </div>

                                <span className="font-bold text-neutral-800">{formatVND(ord.grandTotal)}</span>

                                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-extrabold">
                                  {ord.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-neutral-400">
                            Khách hàng chưa có đơn hàng nào.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Đánh giá gần đây của khách */}
                {(() => {
                  const userReviews = getCustomerReviews(selectedCustomer);
                  return (
                    <div className="space-y-2">
                      <h4 className="font-black text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Star size={14} className="text-amber-500 fill-amber-400" />
                        ĐÁNH GIÁ GẦN ĐÂY CỦA KHÁCH ({userReviews.length})
                      </h4>

                      {userReviews.length > 0 ? (
                        <div className="space-y-2">
                          {userReviews.map(rev => (
                            <div key={rev.id} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-neutral-900">{rev.productName}</span>
                                <span className="text-amber-500 font-bold">{rev.rating} ⭐</span>
                              </div>
                              <p className="text-neutral-600 italic">"{rev.comment}"</p>
                              <span className="text-[10px] text-neutral-400 block mt-1">{rev.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-400 italic">Khách hàng chưa để lại đánh giá nào.</p>
                      )}
                    </div>
                  );
                })()}

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCustomerToToggleLock(selectedCustomer);
                    setIsLockModalOpen(true);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedCustomer.status === 'Bị khóa'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {selectedCustomer.status === 'Bị khóa' ? 'Mở Khóa Tài Khoản' : 'Khóa Tài Khoản'}
                </button>

                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------- */}
      {/* 6. MODAL: THÊM KHÁCH HÀNG MỚI                       */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase">THÊM KHÁCH HÀNG MỚI</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4 text-xs font-bold">
                
                {/* Họ và tên */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className={`w-full bg-neutral-50 p-2.5 rounded-xl border outline-none transition-all ${
                      addErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200 focus:border-black'
                    }`}
                  />
                  {addErrors.name && <p className="text-rose-500 text-[11px] mt-1">{addErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="VD: nguyenvana@gmail.com"
                    className={`w-full bg-neutral-50 p-2.5 rounded-xl border outline-none transition-all ${
                      addErrors.email ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200 focus:border-black'
                    }`}
                  />
                  {addErrors.email && <p className="text-rose-500 text-[11px] mt-1">{addErrors.email}</p>}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="VD: 0987654321"
                    className={`w-full bg-neutral-50 p-2.5 rounded-xl border outline-none transition-all ${
                      addErrors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200 focus:border-black'
                    }`}
                  />
                  {addErrors.phone && <p className="text-rose-500 text-[11px] mt-1">{addErrors.phone}</p>}
                </div>

                {/* Mật khẩu tạm thời */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Mật khẩu tạm thời <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full bg-neutral-50 p-2.5 rounded-xl border outline-none transition-all ${
                      addErrors.password ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200 focus:border-black'
                    }`}
                  />
                  {addErrors.password && <p className="text-rose-500 text-[11px] mt-1">{addErrors.password}</p>}
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-neutral-700 mb-1">Trạng thái tài khoản:</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value as any })}
                    className="w-full bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 outline-none cursor-pointer"
                  >
                    <option value="Đang hoạt động">● Đang hoạt động</option>
                    <option value="Bị khóa">● Bị khóa</option>
                  </select>
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-neutral-700 mb-1">Địa chỉ giao hàng:</label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Địa chỉ nhà, tên đường, phường/xã..."
                    className="w-full bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold cursor-pointer transition-colors shadow-md"
                  >
                    Tạo Khách Hàng
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------- */}
      {/* 7. MODAL: CHỈNH SỬA KHÁCH HÀNG                       */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isEditModalOpen && editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSavingCustomer) setIsEditModalOpen(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-neutral-100 text-neutral-900 rounded-xl">
                    <Edit size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">
                      CHỈNH SỬA KHÁCH HÀNG
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Cập nhật thông tin chi tiết và quyền truy cập của khách hàng
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isSavingCustomer) setIsEditModalOpen(false);
                  }}
                  disabled={isSavingCustomer}
                  className="text-neutral-400 hover:text-black p-1 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* SECTION: THÔNG TIN TÀI KHOẢN (READONLY STATS) */}
              {(() => {
                const statsObj = getCustomerOrderStats(editingCustomer);
                return (
                  <div className="mb-5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Info size={13} className="text-blue-500" />
                        THỐNG KÊ TÀI KHOẢN (READONLY)
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">Dữ liệu thực tế từ hệ thống</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/70 text-center">
                        <span className="text-[10px] font-bold text-neutral-400 block mb-0.5 flex items-center justify-center gap-1">
                          <Calendar size={11} className="text-neutral-400" />
                          Ngày đăng ký
                        </span>
                        <span className="text-xs font-black text-neutral-800">
                          {editingCustomer.createdAt || '15/01/2026'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/70 text-center">
                        <span className="text-[10px] font-bold text-neutral-400 block mb-0.5 flex items-center justify-center gap-1">
                          <ShoppingBag size={11} className="text-neutral-400" />
                          Số đơn hàng
                        </span>
                        <span className="text-xs font-black text-neutral-900">
                          {statsObj.totalOrders} đơn
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/70 text-center">
                        <span className="text-[10px] font-bold text-neutral-400 block mb-0.5 flex items-center justify-center gap-1">
                          <DollarSign size={11} className="text-emerald-500" />
                          Tổng chi tiêu
                        </span>
                        <span className="text-xs font-black text-emerald-600 truncate block">
                          {formatVND(statsObj.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <form onSubmit={handleSaveEditCustomer} className="space-y-4 text-xs font-bold">
                
                {/* 1. HỌ VÀ TÊN */}
                <div className="space-y-1">
                  <label className="block text-neutral-700">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => {
                      setEditingCustomer({ ...editingCustomer, name: e.target.value });
                      if (editErrors.name) setEditErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Nhập họ và tên khách hàng..."
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                      editErrors.name
                        ? 'bg-rose-50/40 border-rose-400 text-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-neutral-900'
                    }`}
                  />
                  {editErrors.name && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      <span>{editErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. EMAIL (READONLY) */}
                <div className="space-y-1">
                  <label className="block text-neutral-700 flex items-center justify-between">
                    <span>Email tài khoản</span>
                    <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                      <Lock size={10} /> Không thể sửa
                    </span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="email"
                      value={editingCustomer.email}
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-bold text-xs cursor-not-allowed select-none"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium italic mt-1">
                    Email đăng nhập không thể thay đổi tại đây.
                  </p>
                </div>

                {/* 3. SỐ ĐIỆN THOẠI */}
                <div className="space-y-1">
                  <label className="block text-neutral-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="tel"
                      value={editingCustomer.phone || ''}
                      onChange={(e) => {
                        // Only allow numbers and optional leading +
                        const val = e.target.value.replace(/[^0-9+]/g, '');
                        setEditingCustomer({ ...editingCustomer, phone: val });
                        if (editErrors.phone) setEditErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="0987654321"
                      maxLength={12}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                        editErrors.phone
                          ? 'bg-rose-50/40 border-rose-400 text-neutral-900'
                          : 'bg-neutral-50 border-neutral-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black text-neutral-900'
                      }`}
                    />
                  </div>
                  {editErrors.phone && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      <span>{editErrors.phone}</span>
                    </p>
                  )}
                </div>

                {/* 4. TRẠNG THÁI TÀI KHOẢN */}
                <div className="space-y-1">
                  <label className="block text-neutral-700">Trạng thái tài khoản</label>
                  <div className="relative">
                    <select
                      value={editingCustomer.status || 'Đang hoạt động'}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          status: e.target.value as 'Đang hoạt động' | 'Bị khóa'
                        })
                      }
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer appearance-none transition-colors pr-8 ${
                        editingCustomer.status === 'Bị khóa'
                          ? 'bg-rose-50/40 border-rose-300 text-rose-700'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:bg-white focus:border-black'
                      }`}
                    >
                      <option value="Đang hoạt động">🟢 Đang hoạt động (Cho phép đăng nhập và mua hàng)</option>
                      <option value="Bị khóa">🔴 Đã khóa / Bị khóa (Khóa quyền truy cập)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* 5. ĐỊA CHỈ GIAO HÀNG (34 TỈNH THÀNH & PHƯỜNG XÃ CHUẨN) */}
                <div className="space-y-3 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-500" />
                      ĐỊA CHỈ GIAO HÀNG
                    </label>
                    <span className="text-[10px] text-neutral-400 font-medium">Hệ thống 34 tỉnh thành Việt Nam</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Tỉnh / Thành phố */}
                    <LocationDropdown
                      id="edit-customer-province"
                      label="Tỉnh / Thành phố"
                      placeholder="Chọn Tỉnh / Thành phố..."
                      options={ADMINISTRATIVE_PROVINCES.map((p) => ({ id: p.id, name: p.name }))}
                      value={editProvince}
                      onChange={(newProv) => {
                        setEditProvince(newProv);
                        if (editErrors.province) setEditErrors((prev) => ({ ...prev, province: '' }));
                        const foundProv = ADMINISTRATIVE_PROVINCES.find((p) => p.name === newProv);
                        if (foundProv) {
                          const wardStillValid = foundProv.wards.some((w) => w.name === editWard);
                          if (!wardStillValid) {
                            setEditWard('');
                          }
                        } else {
                          setEditWard('');
                        }
                      }}
                      error={editErrors.province}
                    />

                    {/* Phường / Xã */}
                    {(() => {
                      const selectedProvObj = ADMINISTRATIVE_PROVINCES.find((p) => p.name === editProvince);
                      const wardList = selectedProvObj ? selectedProvObj.wards.map((w) => ({ id: w.id, name: w.name })) : [];

                      return (
                        <LocationDropdown
                          id="edit-customer-ward"
                          label="Phường / Xã"
                          placeholder={editProvince ? 'Chọn Phường / Xã...' : 'Vui lòng chọn Tỉnh trước'}
                          options={wardList}
                          value={editWard}
                          onChange={(newWard) => {
                            setEditWard(newWard);
                            if (editErrors.ward) setEditErrors((prev) => ({ ...prev, ward: '' }));
                          }}
                          disabled={!editProvince}
                          disabledHint="Hãy chọn Tỉnh / Thành phố ở ô bên cạnh trước."
                          error={editErrors.ward}
                        />
                      );
                    })()}
                  </div>

                  {/* Địa chỉ chi tiết */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà...)
                    </label>
                    <input
                      type="text"
                      value={editAddressDetail}
                      onChange={(e) => setEditAddressDetail(e.target.value)}
                      placeholder="VD: 123 Nguyễn Trãi, Tòa nhà Bitexco..."
                      className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none text-xs font-semibold text-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Preview full combined address */}
                  {(editAddressDetail || editWard || editProvince) && (
                    <div className="p-2.5 rounded-xl bg-neutral-100/80 border border-neutral-200/80 text-[11px] flex items-start gap-2 text-neutral-700">
                      <MapPin size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-neutral-400 block text-[9px] uppercase tracking-wider">
                          ĐỊA CHỈ HOÀN CHỈNH:
                        </span>
                        <span className="font-bold text-neutral-900 leading-tight">
                          {[editAddressDetail.trim(), editWard, editProvince].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. RESET PASSWORD */}
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                      <Key size={16} />
                    </div>
                    <div>
                      <span className="font-black text-amber-950 block text-xs">
                        Bảo mật & Mật khẩu
                      </span>
                      <p className="text-[10px] text-amber-800/90 font-medium">
                        Cấp lại mật khẩu mặc định an toàn cho khách hàng
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsResetPasswordConfirmOpen(true)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <span>🔑 ĐẶT LẠI MẬT KHẨU</span>
                  </button>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isSavingCustomer}
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingCustomer}
                    className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold cursor-pointer transition-colors shadow-md flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSavingCustomer ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------- */}
      {/* 7.1 MODAL: XÁC NHẬN ĐẶT LẠI MẬT KHẨU KHÁCH HÀNG       */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isResetPasswordConfirmOpen && editingCustomer && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isResettingPassword) setIsResetPasswordConfirmOpen(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <Key size={26} />
              </div>

              <h3 className="text-base sm:text-lg font-black text-neutral-900 mb-2">
                Xác nhận đặt lại mật khẩu?
              </h3>

              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                Bạn có chắc muốn đặt lại mật khẩu cho khách hàng{' '}
                <span className="font-black text-neutral-900">{editingCustomer.name}</span> (
                <span className="font-semibold text-neutral-800">{editingCustomer.email}</span>)?
                <br />
                <span className="text-[11px] text-neutral-400 block mt-1">
                  Mật khẩu mới sẽ được thiết lập tự động và thông báo tới khách hàng.
                </span>
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isResettingPassword}
                  onClick={() => setIsResetPasswordConfirmOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  disabled={isResettingPassword}
                  onClick={handleConfirmResetPassword}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      <span>Xác nhận</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------- */}
      {/* 8. MODAL: XÁC NHẬN KHÓA / MỞ KHÓA TÀI KHOẢN         */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isLockModalOpen && customerToToggleLock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLockModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 text-center"
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                customerToToggleLock.status === 'Bị khóa'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}>
                {customerToToggleLock.status === 'Bị khóa' ? <Unlock size={28} /> : <Lock size={28} />}
              </div>

              <h3 className="text-lg font-black text-neutral-900 mb-2">
                {customerToToggleLock.status === 'Bị khóa'
                  ? 'Mở khóa tài khoản khách hàng?'
                  : 'Bạn có chắc muốn khóa tài khoản này?'}
              </h3>

              <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                Tài khoản: <span className="font-bold text-neutral-900">{customerToToggleLock.name}</span> ({customerToToggleLock.email})<br />
                {customerToToggleLock.status === 'Bị khóa'
                  ? 'Sau khi mở khóa, khách hàng có thể đăng nhập lại vào hệ thống bình thường.'
                  : 'Khi bị khóa, khách hàng sẽ KHÔNG THỂ ĐĂNG NHẬP vào hệ thống.'}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsLockModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  onClick={handleConfirmToggleLock}
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer transition-colors ${
                    customerToToggleLock.status === 'Bị khóa'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {customerToToggleLock.status === 'Bị khóa' ? 'Xác Nhận Mở Khóa' : 'Xác Nhận Khóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------- */}
      {/* 9. MODAL: XÁC NHẬN XÓA / VÔ HIỆU HÓA KHÁCH HÀNG     */}
      {/* -------------------------------------------------- */}
      <AnimatePresence>
        {isDeleteModalOpen && customerToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
                <Trash2 size={28} />
              </div>

              <h3 className="text-lg font-black text-neutral-900 mb-2">
                Xác nhận xóa tài khoản khách hàng?
              </h3>

              {(() => {
                const statsObj = getCustomerOrderStats(customerToDelete);
                if (statsObj.totalOrders > 0) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs mb-6 space-y-1 text-amber-900">
                      <p className="font-bold flex items-center gap-1">
                        <ShieldAlert size={14} className="text-amber-600 shrink-0" />
                        Khách hàng đã có {statsObj.totalOrders} đơn hàng!
                      </p>
                      <p className="text-[11px] leading-relaxed text-amber-800">
                        Để bảo toàn lịch sử giao dịch và doanh thu hệ thống, tài khoản sẽ chuyển sang trạng thái <strong>VÔ HIỆU HÓA</strong> thay vì xóa cứng.
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <p className="text-xs text-neutral-600 mb-6">
                      Khách hàng <span className="font-bold text-neutral-900">{customerToDelete.name}</span> chưa có lịch sử mua hàng. Bạn có thể xóa hoàn toàn tài khoản này khỏi cơ sở dữ liệu.
                    </p>
                  );
                }
              })()}

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  {getCustomerOrderStats(customerToDelete).totalOrders > 0 ? 'Vô Hiệu Hóa Tài Khoản' : 'Xác Nhận Xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
