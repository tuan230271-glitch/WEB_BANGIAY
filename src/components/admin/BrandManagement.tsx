import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  RotateCcw,
  Edit,
  Trash2,
  Eye,
  Check,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  Package,
  Globe,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Building2,
  Calendar,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { BrandItem, Product } from '../../types';
import BrandLogo from '../BrandLogo';
import { brandsApi } from '../../services/api';

interface BrandManagementProps {
  brands: BrandItem[];
  setBrands: React.Dispatch<React.SetStateAction<BrandItem[]>>;
  products: Product[];
  showToast: (msg: string) => void;
  onNavigateToProducts?: (brandFilter?: string) => void;
}

const COUNTRY_OPTIONS = [
  'Mỹ',
  'Đức',
  'Nhật',
  'Ý',
  'Hàn Quốc',
  'Pháp',
  'Việt Nam',
  'Thụy Sĩ',
  'Anh',
  'Trung Quốc',
  'Khác'
];

// Helper to convert brand name to kebab-case slug
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

export default function BrandManagement({
  brands,
  setBrands,
  products,
  showToast,
  onNavigateToProducts
}: BrandManagementProps) {
  // ----------------------------------------------------
  // 1. FILTER & SEARCH STATES
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Modals
  const [viewingBrand, setViewingBrand] = useState<BrandItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

  const [deletingBrand, setDeletingBrand] = useState<BrandItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteWarningMsg, setDeleteWarningMsg] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCountry, setFormCountry] = useState('Mỹ');
  const [formLogo, setFormLogo] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'Đang hoạt động' | 'Ẩn'>('Đang hoạt động');
  const [formError, setFormError] = useState<string | null>(null);
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Active non-deleted brands list
  const activeBrandsList = useMemo(() => {
    return brands.filter(b => !b.isDeleted);
  }, [brands]);

  // Compute products count per brand map
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      if (!p.isDeleted) {
        map[p.brand] = (map[p.brand] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Brand quick stats
  const brandStats = useMemo(() => {
    const total = activeBrandsList.length;
    const active = activeBrandsList.filter(b => b.status === 'Đang hoạt động').length;
    const hidden = activeBrandsList.filter(b => b.status === 'Ẩn').length;
    let totalProducts = 0;
    products.forEach(p => {
      if (!p.isDeleted && p.brand) totalProducts++;
    });
    return { total, active, hidden, totalProducts };
  }, [activeBrandsList, products]);

  // ----------------------------------------------------
  // 2. SEARCH & FILTER LOGIC
  // ----------------------------------------------------
  const filteredBrands = useMemo(() => {
    return activeBrandsList.filter(b => {
      // Search by Name or Slug
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.country && b.country.toLowerCase().includes(q));

      // Filter by Status
      const matchesStatus =
        selectedStatusFilter === 'All' || b.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activeBrandsList, searchQuery, selectedStatusFilter]);

  // Pagination computations
  const totalItems = filteredBrands.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBrands = useMemo(() => {
    return filteredBrands.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBrands, startIndex, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatusFilter('All');
    setCurrentPage(1);
  };

  // ----------------------------------------------------
  // 3. FORM HANDLERS (ADD / EDIT)
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormName('');
    setFormSlug('');
    setFormCountry('Mỹ');
    setFormLogo('');
    setFormDescription('');
    setFormStatus('Đang hoạt động');
    setFormError(null);
    setIsAutoSlug(true);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormSlug(brand.slug);
    setFormCountry(brand.country || 'Mỹ');
    setFormLogo(brand.logo);
    setFormDescription(brand.description || '');
    setFormStatus(brand.status);
    setFormError(null);
    setIsAutoSlug(false);
    setIsFormModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (isAutoSlug && !editingBrand) {
      setFormSlug(slugify(val));
    }
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Dung lượng ảnh vượt quá 2MB. Vui lòng chọn ảnh nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLogo(reader.result as string);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    const cleanSlug = formSlug.trim().toLowerCase();

    // Validation 1: Required Name
    if (!cleanName) {
      setFormError('Vui lòng nhập tên thương hiệu!');
      return;
    }

    // Validation 2: Required Slug
    if (!cleanSlug) {
      setFormError('Vui lòng nhập slug thương hiệu!');
      return;
    }

    // Validation 3: Required Logo
    if (!formLogo.trim()) {
      setFormError('Vui lòng cung cấp logo thương hiệu (Upload hoặc nhập URL)!');
      return;
    }

    // Validation 4: Duplicate Name check
    const duplicateName = activeBrandsList.find(
      b =>
        b.name.toLowerCase() === cleanName.toLowerCase() &&
        (!editingBrand || b.id !== editingBrand.id)
    );
    if (duplicateName) {
      setFormError(`Tên thương hiệu "${cleanName}" đã tồn tại trên hệ thống!`);
      return;
    }

    // Validation 5: Duplicate Slug check
    const duplicateSlug = activeBrandsList.find(
      b =>
        b.slug.toLowerCase() === cleanSlug.toLowerCase() &&
        (!editingBrand || b.id !== editingBrand.id)
    );
    if (duplicateSlug) {
      setFormError(`Slug "${cleanSlug}" đã bị trùng lặp với thương hiệu khác!`);
      return;
    }

    const todayStr = new Date().toLocaleDateString('vi-VN');

    if (editingBrand) {
      // Update existing brand
      const oldName = editingBrand.name;
      const updatedBrands = brands.map(b => {
        if (b.id === editingBrand.id) {
          return {
            ...b,
            name: cleanName,
            slug: cleanSlug,
            country: formCountry,
            logo: formLogo.trim(),
            description: formDescription.trim(),
            status: formStatus,
            updatedAt: todayStr
          };
        }
        return b;
      });

      setBrands(updatedBrands);
      brandsApi.update(editingBrand.id, {
        name: cleanName,
        slug: cleanSlug,
        country: formCountry,
        logo: formLogo.trim(),
        description: formDescription.trim(),
        status: formStatus,
      }).catch((err) => console.warn('Update brand to API failed:', err));
      showToast(`Đã cập nhật thương hiệu "${cleanName}" thành công!`);

      // If brand name changed, optionally we notify or update products brand name if needed
      if (oldName !== cleanName) {
        showToast(`Tên thương hiệu đã đổi từ "${oldName}" sang "${cleanName}"`);
      }
    } else {
      // Add new brand
      const newBrandItem: BrandItem = {
        id: 'brand-' + Date.now(),
        name: cleanName,
        slug: cleanSlug,
        country: formCountry,
        logo: formLogo.trim(),
        description: formDescription.trim(),
        status: formStatus,
        createdAt: todayStr,
        updatedAt: todayStr
      };

      setBrands(prev => [newBrandItem, ...prev]);
      brandsApi.create(newBrandItem).catch((err) => console.warn('Create brand to API failed:', err));
      showToast(`Đã thêm thương hiệu mới "${cleanName}" thành công!`);
    }

    setIsFormModalOpen(false);
  };

  // ----------------------------------------------------
  // 4. DELETE BRAND HANDLERS
  // ----------------------------------------------------
  const handleInitiateDelete = (brand: BrandItem) => {
    setDeletingBrand(brand);
    const count = productCountMap[brand.name] || 0;

    if (count > 0) {
      setDeleteWarningMsg(
        `Không thể xóa thương hiệu "${brand.name}" vì đang có ${count} sản phẩm liên kết trong hệ thống!`
      );
    } else {
      setDeleteWarningMsg(null);
    }

    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingBrand) return;

    const count = productCountMap[deletingBrand.name] || 0;
    if (count > 0) {
      alert(`Không thể xóa thương hiệu "${deletingBrand.name}" do có ${count} sản phẩm.`);
      setIsDeleteModalOpen(false);
      return;
    }

    // Perform soft delete
    setBrands(prev =>
      prev.map(b => (b.id === deletingBrand.id ? { ...b, isDeleted: true } : b))
    );
    brandsApi.update(deletingBrand.id, {
      name: deletingBrand.name,
      status: 'Ẩn',
    }).catch((err) => console.warn('Delete brand to API failed:', err));

    showToast(`Đã xóa thương hiệu "${deletingBrand.name}" thành công!`);
    setIsDeleteModalOpen(false);
    setDeletingBrand(null);
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans">
      {/* ---------------------------------------------------- */}
      {/* HEADER PHÍA TRÊN - GỌN GÀNG                           */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <Building2 size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Thương Hiệu
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {brandStats.total} thương hiệu
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Quản lý các thương hiệu giày chính hãng, logo, quốc gia và đồng bộ với danh mục sản phẩm
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} className="text-amber-400" />
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      {/* STATS 4 CARDS - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div
          onClick={() => setSelectedStatusFilter('All')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'All'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả thương hiệu :</span>
          <span className="text-xs font-black text-neutral-900">
            {brandStats.total} <span className="font-semibold text-neutral-500">nhãn hàng</span>
          </span>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('Đang hoạt động')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Đang hoạt động'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đang hoạt động :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {brandStats.active} <span className="font-semibold text-emerald-700">nhãn hàng</span>
          </span>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('Ẩn')}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            selectedStatusFilter === 'Ẩn'
              ? 'border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
            <span>👁️</span>
            <span>Đang ẩn :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {brandStats.hidden} <span className="font-semibold text-neutral-500">nhãn hàng</span>
          </span>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('All')}
          className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 shadow-2xs cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
            <span>👟</span>
            <span>Tổng sản phẩm :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {brandStats.totalProducts} <span className="font-semibold text-blue-700">đôi giày</span>
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* THANH CÔNG CỤ (SEARCH & FILTER BAR)                  */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên thương hiệu, slug..."
              className="w-full bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white focus:ring-1 focus:ring-neutral-900 pl-9 pr-8 py-2 rounded-xl text-xs font-semibold border border-neutral-200 focus:border-neutral-900 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={selectedStatusFilter}
              onChange={e => {
                setSelectedStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white focus:ring-1 focus:ring-neutral-900 px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 outline-hidden transition-all cursor-pointer"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Ẩn">Ẩn</option>
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className="px-3.5 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer w-full md:w-auto justify-center"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw size={14} className="text-neutral-500" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* DESKTOP TABLE VIEW                                   */}
      {/* ---------------------------------------------------- */}
      <div className="hidden md:block bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1100px] border-collapse">
            <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5 text-center w-12">#</th>
                <th className="py-3.5 px-5 w-20 text-center">Logo</th>
                <th className="py-3.5 px-5">Tên thương hiệu</th>
                <th className="py-3.5 px-5">Slug</th>
                <th className="py-3.5 px-5">Quốc gia</th>
                <th className="py-3.5 px-5 text-center">Số sản phẩm</th>
                <th className="py-3.5 px-5 text-center">Trạng thái</th>
                <th className="py-3.5 px-5 text-right pr-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <Building2 size={36} className="mx-auto mb-2 opacity-40 text-neutral-400" />
                    <p className="font-bold text-sm text-neutral-600">Không tìm thấy thương hiệu nào!</p>
                    <p className="text-xs text-neutral-400 mt-1">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((brand, idx) => {
                  const itemIndex = startIndex + idx + 1;
                  const count = productCountMap[brand.name] || 0;

                  return (
                    <tr
                      key={brand.id}
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-4 px-5 text-center font-bold text-neutral-400">
                        {itemIndex}
                      </td>

                      {/* LOGO */}
                      <td className="py-4 px-5 text-center">
                        <div className="h-10 w-10 mx-auto rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center p-1 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                          <BrandLogo
                            logo={brand.logo}
                            brandName={brand.name}
                            className="h-full w-full"
                          />
                        </div>
                      </td>

                      {/* TÊN THƯƠNG HIỆU */}
                      <td className="py-4 px-5">
                        <div className="font-black text-neutral-900 text-sm group-hover:text-amber-600 transition-colors">
                          {brand.name}
                        </div>
                        {brand.tagline && (
                          <span className="text-[10px] text-neutral-400 font-medium italic block truncate max-w-sm">
                            "{brand.tagline}"
                          </span>
                        )}
                      </td>

                      {/* SLUG */}
                      <td className="py-4 px-5">
                        <span className="bg-neutral-100 text-neutral-700 font-mono text-[11px] px-2 py-0.5 rounded-md border border-neutral-200 font-bold">
                          {brand.slug}
                        </span>
                      </td>

                      {/* QUỐC GIA */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-neutral-700 font-bold">
                          <Globe size={13} className="text-neutral-400" />
                          <span>{brand.country || 'Chưa cập nhật'}</span>
                        </div>
                      </td>

                      {/* SỐ SẢN PHẨM */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => onNavigateToProducts && onNavigateToProducts(brand.name)}
                          className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            count > 0
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                          title="Xem danh sách sản phẩm thuộc thương hiệu này"
                        >
                          <Package size={12} />
                          <span>{count} sản phẩm</span>
                        </button>
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border inline-block ${
                            brand.status === 'Đang hoạt động'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {brand.status}
                        </span>
                      </td>

                      {/* THAO TÁC */}
                      <td className="py-4 px-5 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => {
                              setViewingBrand(brand);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Sửa */}
                          <button
                            onClick={() => handleOpenEditModal(brand)}
                            className="p-1.5 rounded-xl text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa thương hiệu"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Xóa */}
                          <button
                            onClick={() => handleInitiateDelete(brand)}
                            className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa thương hiệu"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MOBILE CARD VIEW                                     */}
      {/* ---------------------------------------------------- */}
      <div className="block md:hidden space-y-3">
        {paginatedBrands.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center text-neutral-400">
            <Building2 size={32} className="mx-auto mb-2 opacity-40 text-neutral-400" />
            <p className="font-bold text-xs text-neutral-600">Không tìm thấy thương hiệu nào!</p>
          </div>
        ) : (
          paginatedBrands.map(brand => {
            const count = productCountMap[brand.name] || 0;
            return (
              <div
                key={brand.id}
                className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      <BrandLogo
                        logo={brand.logo}
                        brandName={brand.name}
                        className="h-full w-full"
                      />
                    </div>

                    <div>
                      <h3 className="font-black text-neutral-900 text-sm">{brand.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-neutral-100 text-neutral-700 font-mono text-[10px] px-1.5 py-0.5 rounded-md border border-neutral-200 font-bold">
                          {brand.slug}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-semibold flex items-center gap-0.5">
                          <Globe size={11} />
                          {brand.country || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                      brand.status === 'Đang hoạt động'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Sản phẩm:</span>
                  <span className="font-black text-blue-600">{count} sản phẩm</span>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setViewingBrand(brand);
                      setIsDetailModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Chi tiết</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(brand)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit size={14} />
                    <span>Sửa</span>
                  </button>

                  <button
                    onClick={() => handleInitiateDelete(brand)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* PAGINATION FOOTER                                    */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị mỗi trang:</span>
          <select
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-neutral-100 px-2 py-1 rounded-xl border border-neutral-200 font-bold outline-hidden cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-neutral-400 font-medium ml-2">
            Hiển thị {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} trên tổng số {totalItems} thương hiệu
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-neutral-100 disabled:opacity-40 hover:bg-neutral-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-black text-white shadow-md'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-neutral-100 disabled:opacity-40 hover:bg-neutral-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL THÊM / CHỈNH SỬA THƯƠNG HIỆU                  */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
                      {editingBrand ? 'CHỈNH SỬA THƯƠNG HIỆU' : 'THÊM THƯƠNG HIỆU MỚI'}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Nhập đầy đủ thông tin thương hiệu bên dưới
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Validation Error Alert */}
              {formError && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveBrand} className="space-y-4 text-xs font-bold">
                {/* 1. Brand Name */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Tên thương hiệu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="VD: Nike, Adidas, New Balance..."
                    className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white focus:ring-2 focus:ring-black p-3 rounded-2xl border border-neutral-200 outline-hidden font-bold transition-all"
                  />
                </div>

                {/* 2. Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-700">
                      Slug đường dẫn <span className="text-rose-500">*</span>
                    </label>
                    {!editingBrand && (
                      <button
                        type="button"
                        onClick={() => setIsAutoSlug(!isAutoSlug)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          isAutoSlug ? 'bg-amber-100 text-amber-800' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {isAutoSlug ? '✓ Tự động tạo Slug' : 'Nhập thủ công'}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={e => {
                      setFormSlug(e.target.value);
                      setIsAutoSlug(false);
                    }}
                    placeholder="VD: nike, adidas, new-balance"
                    className="w-full bg-neutral-100 font-mono hover:bg-neutral-100/80 focus:bg-white focus:ring-2 focus:ring-black p-3 rounded-2xl border border-neutral-200 outline-hidden font-bold transition-all text-neutral-800"
                  />
                </div>

                {/* 3. Country */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Quốc gia xuất xứ
                  </label>
                  <select
                    value={formCountry}
                    onChange={e => setFormCountry(e.target.value)}
                    className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white focus:ring-2 focus:ring-black p-3 rounded-2xl border border-neutral-200 outline-hidden font-bold transition-all cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Logo (Upload / URL) */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Logo Thương hiệu <span className="text-rose-500">*</span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formLogo}
                        onChange={e => setFormLogo(e.target.value)}
                        placeholder="Dán link URL ảnh Logo (https://...)"
                        className="flex-1 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white focus:ring-2 focus:ring-black p-3 rounded-2xl border border-neutral-200 outline-hidden font-bold transition-all"
                      />

                      <label className="px-3 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                        <Upload size={14} />
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Logo Preview */}
                    {formLogo && (
                      <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          <img
                            src={formLogo}
                            alt="Logo preview"
                            className="h-full w-full object-contain"
                            onError={e => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-extrabold text-emerald-600 block uppercase">
                            ✓ Xem trước Logo
                          </span>
                          <span className="text-[10px] text-neutral-400 truncate block font-mono">
                            {formLogo}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Description */}
                <div>
                  <label className="block text-neutral-700 mb-1">
                    Mô tả thương hiệu
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Mô tả tóm tắt về lịch sử, phong cách, các dòng sản phẩm nổi bật..."
                    className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white focus:ring-2 focus:ring-black p-3 rounded-2xl border border-neutral-200 outline-hidden font-bold transition-all resize-none"
                  />
                </div>

                {/* 6. Status */}
                <div>
                  <label className="block text-neutral-700 mb-2">
                    Trạng thái hoạt động
                  </label>
                  <div className="flex items-center gap-4 bg-neutral-100 p-2.5 rounded-2xl border border-neutral-200">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="radio"
                        name="brandStatus"
                        value="Đang hoạt động"
                        checked={formStatus === 'Đang hoạt động'}
                        onChange={() => setFormStatus('Đang hoạt động')}
                        className="accent-emerald-600 h-4 w-4"
                      />
                      <span className="text-emerald-700 font-extrabold">Đang hoạt động</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="radio"
                        name="brandStatus"
                        value="Ẩn"
                        checked={formStatus === 'Ẩn'}
                        onChange={() => setFormStatus('Ẩn')}
                        className="accent-neutral-600 h-4 w-4"
                      />
                      <span className="text-neutral-600 font-extrabold">Ẩn thương hiệu</span>
                    </label>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    {editingBrand ? 'Lưu Thay Đổi' : 'Tạo Thương Hiệu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL XEM CHI TIẾT THƯƠNG HIỆU                      */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isDetailModalOpen && viewingBrand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 border border-neutral-200 p-1.5 flex items-center justify-center shrink-0">
                    <BrandLogo
                      logo={viewingBrand.logo}
                      brandName={viewingBrand.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-neutral-900">{viewingBrand.name}</h3>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          viewingBrand.status === 'Đang hoạt động'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}
                      >
                        {viewingBrand.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      slug: /{viewingBrand.slug}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase block mb-1">
                    Quốc gia xuất xứ
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-neutral-900 text-sm">
                    <Globe size={15} className="text-amber-500" />
                    <span>{viewingBrand.country || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase block mb-1">
                    Tổng sản phẩm
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-neutral-900 text-sm">
                    <Package size={15} className="text-blue-500" />
                    <span>{productCountMap[viewingBrand.name] || 0} sản phẩm</span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 sm:col-span-2">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase block mb-1">
                    Mô tả thương hiệu
                  </span>
                  <p className="text-neutral-700 font-medium leading-relaxed">
                    {viewingBrand.description || 'Chưa có mô tả cho thương hiệu này.'}
                  </p>
                </div>
              </div>

              {/* Products list under this brand */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                  <span>DANH SÁCH SẢN PHẨM THUỘC THƯƠNG HIỆU</span>
                  <span className="text-neutral-400 font-semibold">
                    ({products.filter(p => p.brand === viewingBrand.name && !p.isDeleted).length})
                  </span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {products.filter(p => p.brand === viewingBrand.name && !p.isDeleted).length === 0 ? (
                    <div className="p-4 bg-neutral-50 rounded-2xl text-center text-neutral-400 text-xs font-semibold">
                      Chưa có sản phẩm nào thuộc thương hiệu này.
                    </div>
                  ) : (
                    products
                      .filter(p => p.brand === viewingBrand.name && !p.isDeleted)
                      .map(prod => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200/60 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-10 w-10 object-contain bg-white rounded-xl p-0.5 border border-neutral-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 text-xs truncate">{prod.name}</p>
                              <p className="text-[10px] text-neutral-400 font-medium">
                                Danh mục: {prod.category}
                              </p>
                            </div>
                          </div>

                          <span className="font-black text-xs text-neutral-900 shrink-0">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL CẢNH BÁO / XÁC NHẬN XÓA THƯƠNG HIỆU            */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingBrand && (
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
              {deleteWarningMsg ? (
                /* CANNOT DELETE WARNING */
                <div>
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
                    <ShieldAlert size={28} />
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 mb-2">
                    Không thể xóa thương hiệu!
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-semibold mb-6">
                    {deleteWarningMsg}
                  </p>

                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Đã Hiểu
                  </button>
                </div>
              ) : (
                /* CONFIRM DELETE DIALOG */
                <div>
                  <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
                    <Trash2 size={28} />
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 mb-2">
                    Xác nhận xóa thương hiệu?
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-medium">
                    Bạn có chắc chắn muốn xóa thương hiệu{' '}
                    <span className="font-black text-neutral-900">"{deletingBrand.name}"</span> không?
                    Thao tác này có thể khôi phục lại khi cần.
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                    >
                      Xóa Thương Hiệu
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
