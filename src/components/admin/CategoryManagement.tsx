import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  AlertTriangle,
  X,
  Check,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { CategoryItem, Product } from '../../types';
import { categoriesApi } from '../../services/api';

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface CategoryManagementProps {
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  showToast: (msg: string) => void;
  onNavigateToProducts?: () => void;
}

export default function CategoryManagement({
  categories,
  setCategories,
  products,
  setCategories: _setCategories,
  setProducts,
  showToast,
  onNavigateToProducts
}: CategoryManagementProps) {
  // ----------------------------------------------------
  // FILTER & SEARCH STATES
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<'All' | 'shoes' | 'accessories'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Đang hoạt động' | 'Ẩn' | 'Đã xóa'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ----------------------------------------------------
  // MODAL STATES
  // ----------------------------------------------------
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    group: 'shoes' | 'accessories';
    status: 'Đang hoạt động' | 'Ẩn';
  }>({
    name: '',
    slug: '',
    description: '',
    group: 'shoes',
    status: 'Đang hoạt động'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Detail Modal
  const [viewingCategory, setViewingCategory] = useState<CategoryItem | null>(null);

  // Delete & Constraint Dialog States
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [constraintAlert, setConstraintAlert] = useState<{ category: CategoryItem; count: number } | null>(null);

  // ----------------------------------------------------
  // PRODUCT COUNT PER CATEGORY MAP
  // ----------------------------------------------------
  const categoryProductCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (!p.isDeleted) {
        const catName = p.category || '';
        map[catName] = (map[catName] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // ----------------------------------------------------
  // FILTERED CATEGORIES LIST
  // ----------------------------------------------------
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Group filter
      if (groupFilter !== 'All') {
        const catGroup = cat.group || 'shoes';
        if (catGroup !== groupFilter) return false;
      }

      // Status filter
      if (statusFilter === 'Đã xóa') {
        if (!cat.isDeleted) return false;
      } else if (statusFilter === 'Đang hoạt động') {
        if (cat.isDeleted || cat.status !== 'Đang hoạt động') return false;
      } else if (statusFilter === 'Ẩn') {
        if (cat.isDeleted || cat.status !== 'Ẩn') return false;
      } else {
        // 'All' - exclude soft-deleted unless explicitly searched or selected 'Đã xóa'
        if (cat.isDeleted) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchSlug = cat.slug.toLowerCase().includes(q);
        const matchDesc = (cat.description || '').toLowerCase().includes(q);
        const matchGroup = cat.group === 'shoes' ? 'giay giày shoes' : 'phu kien phụ kiện accessories';
        return matchName || matchSlug || matchDesc || matchGroup.includes(q);
      }

      return true;
    });
  }, [categories, groupFilter, statusFilter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // ----------------------------------------------------
  // STATS SUMMARY
  // ----------------------------------------------------
  const totalActive = useMemo(() => categories.filter((c) => !c.isDeleted && c.status === 'Đang hoạt động').length, [categories]);
  const totalHidden = useMemo(() => categories.filter((c) => !c.isDeleted && c.status === 'Ẩn').length, [categories]);
  const totalShoes = useMemo(() => categories.filter((c) => !c.isDeleted && (c.group === 'shoes' || !c.group)).length, [categories]);
  const totalAccessories = useMemo(() => categories.filter((c) => !c.isDeleted && c.group === 'accessories').length, [categories]);
  const totalDeleted = useMemo(() => categories.filter((c) => c.isDeleted).length, [categories]);

  // ----------------------------------------------------
  // OPEN MODAL FOR CREATING NEW CATEGORY
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      group: 'shoes',
      status: 'Đang hoạt động'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // ----------------------------------------------------
  // OPEN MODAL FOR EDITING CATEGORY
  // ----------------------------------------------------
  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      group: cat.group === 'accessories' ? 'accessories' : 'shoes',
      status: cat.status
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // ----------------------------------------------------
  // AUTO SLUG GENERATOR ON NAME CHANGE OR BLUR
  // ----------------------------------------------------
  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const prevAutoSlug = slugify(prev.name);
      const shouldAutoSlug = !prev.slug || prev.slug === prevAutoSlug;
      return {
        ...prev,
        name: val,
        slug: shouldAutoSlug ? slugify(val) : prev.slug
      };
    });
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  // ----------------------------------------------------
  // SAVE / SUBMIT FORM HANDLER (WITH VALIDATION & SYNC)
  // ----------------------------------------------------
  const handleSaveCategory = () => {
    const errors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    let finalSlug = formData.slug.trim();

    if (!trimmedName) {
      errors.name = 'Tên danh mục không được để trống.';
    }

    // Check invalid gender keywords being created as categories
    const forbiddenGenderNames = ['nam', 'nữ', 'nu', 'trẻ em', 'tre em', 'unisex', 'men', 'women', 'kids'];
    if (forbiddenGenderNames.includes(trimmedName.toLowerCase())) {
      errors.name = `"${trimmedName}" là Đối tượng (Nam/Nữ/Trẻ em) thuộc sản phẩm, không tạo thành Danh mục riêng.`;
    }

    // Generate slug if empty
    if (!finalSlug) {
      finalSlug = slugify(trimmedName);
    }

    if (!finalSlug) {
      errors.slug = 'Slug không hợp lệ.';
    }

    // Check Name uniqueness (case-insensitive)
    const isDuplicateName = categories.some((cat) => {
      if (editingCategory && cat.id === editingCategory.id) return false;
      return cat.name.toLowerCase() === trimmedName.toLowerCase() && !cat.isDeleted;
    });

    if (isDuplicateName) {
      errors.name = `Tên danh mục "${trimmedName}" đã tồn tại trong hệ thống.`;
    }

    // Check Slug uniqueness
    const isDuplicateSlug = categories.some((cat) => {
      if (editingCategory && cat.id === editingCategory.id) return false;
      return cat.slug.toLowerCase() === finalSlug.toLowerCase() && !cat.isDeleted;
    });

    if (isDuplicateSlug) {
      errors.slug = `Slug "${finalSlug}" đã bị trùng với danh mục khác.`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const todayStr = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (editingCategory) {
        // Update existing category
        const updatedCatName = editingCategory.name;

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name: trimmedName,
                  slug: finalSlug,
                  description: formData.description.trim(),
                  group: formData.group,
                  status: formData.status,
                  updatedAt: todayStr
                }
              : c
          )
        );

        // Sync name update to existing products if category name changed!
        if (updatedCatName !== trimmedName) {
          setProducts((prevProds) =>
            prevProds.map((p) =>
              p.category === updatedCatName ? { ...p, category: trimmedName } : p
            )
          );
        }

        categoriesApi.update(editingCategory.id, {
          name: trimmedName,
          slug: finalSlug,
          description: formData.description.trim(),
          group: formData.group,
          status: formData.status,
        }).catch((err) => console.warn('Update category to API failed:', err));

        showToast(`Cập nhật danh mục "${trimmedName}" thành công.`);
      } else {
        // Create new category
        const newCategory: CategoryItem = {
          id: 'cat-' + Date.now(),
          name: trimmedName,
          slug: finalSlug,
          description: formData.description.trim(),
          group: formData.group,
          status: formData.status,
          createdAt: todayStr
        };

        setCategories((prev) => [newCategory, ...prev]);
        categoriesApi.create(newCategory).catch((err) => console.warn('Create category to API failed:', err));
        showToast(`Thêm danh mục "${trimmedName}" thành công.`);
      }

      setIsSaving(false);
      setIsFormModalOpen(false);
    }, 300);
  };

  // ----------------------------------------------------
  // DELETE CATEGORY WITH CONSTRAINT CHECK
  // ----------------------------------------------------
  const handleRequestDelete = (cat: CategoryItem) => {
    const count = categoryProductCountMap[cat.name] || 0;
    if (count > 0) {
      // CONSTRAINT BLOCKED!
      setConstraintAlert({ category: cat, count });
    } else {
      // ALLOW SOFT DELETE
      setDeletingCategory(cat);
    }
  };

  const handleConfirmSoftDelete = () => {
    if (!deletingCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === deletingCategory.id ? { ...c, isDeleted: true, status: 'Ẩn' } : c))
    );
    categoriesApi.update(deletingCategory.id, {
      name: deletingCategory.name,
      status: 'Ẩn',
    }).catch((err) => console.warn('Soft delete category to API failed:', err));
    showToast(`Đã xóa mềm danh mục "${deletingCategory.name}".`);
    setDeletingCategory(null);
  };

  // ----------------------------------------------------
  // RESTORE SOFT-DELETED CATEGORY
  // ----------------------------------------------------
  const handleRestoreCategory = (cat: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === cat.id ? { ...c, isDeleted: false, status: 'Đang hoạt động' } : c
      )
    );
    categoriesApi.update(cat.id, {
      name: cat.name,
      status: 'Đang hoạt động',
    }).catch((err) => console.warn('Restore category to API failed:', err));
    showToast(`Đã khôi phục danh mục "${cat.name}".`);
  };

  return (
    <main className="p-4 sm:p-5 md:p-6 space-y-4 max-w-[1920px] w-full mx-auto font-sans">
      {/* ==================================================== */}
      {/* 1. HEADER KHU VỰC QUẢN LÝ DANH MỤC - GỌN GÀNG        */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2.5 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
              <FolderTree size={15} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-900 uppercase">
              Quản Lý Danh Mục
            </h1>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
              {categories.filter((c) => !c.isDeleted).length} danh mục
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
            Tạo, chỉnh sửa, phân nhóm Giày / Phụ kiện và quản lý trạng thái hiển thị trên Menu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
          id="admin-add-category-btn"
        >
          <Plus size={15} className="text-amber-400" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* 2. THỐNG KÊ NHANH (STATISTICS CARDS) - HÀNG NGANG */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div 
          onClick={() => { setGroupFilter('All'); setStatusFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            groupFilter === 'All' && statusFilter === 'All'
              ? 'border-neutral-900 bg-neutral-50/70 ring-1 ring-neutral-900/10'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-neutral-600">Tất cả danh mục :</span>
          <span className="text-xs font-black text-neutral-900">
            {categories.filter((c) => !c.isDeleted).length} <span className="font-semibold text-neutral-500">danh mục</span>
          </span>
        </div>

        <div 
          onClick={() => { setGroupFilter('shoes'); setStatusFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            groupFilter === 'shoes'
              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>👟</span>
            <span>Nhóm Giày :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {totalShoes} <span className="font-semibold text-amber-700">loại</span>
          </span>
        </div>

        <div 
          onClick={() => { setGroupFilter('accessories'); setStatusFilter('All'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            groupFilter === 'accessories'
              ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-sky-800 flex items-center gap-1">
            <span>🎒</span>
            <span>Nhóm Phụ kiện :</span>
          </span>
          <span className="text-xs font-black text-neutral-900">
            {totalAccessories} <span className="font-semibold text-sky-700">loại</span>
          </span>
        </div>

        <div 
          onClick={() => { setStatusFilter('Đang hoạt động'); }}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            statusFilter === 'Đang hoạt động'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
              : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <span>✅</span>
            <span>Đang hoạt động :</span>
          </span>
          <span className="text-xs font-black text-emerald-700">
            {totalActive} <span className="font-semibold text-neutral-400">/ {totalHidden} ẩn</span>
          </span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. THANH CÔNG CỤ (SEARCH, GROUP FILTER & REFRESH)    */}
      {/* ==================================================== */}
      <div className="bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm Tên danh mục, Slug hoặc Mô tả..."
            className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white focus:ring-1 focus:ring-black pl-8 pr-7 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 focus:border-black transition-all outline-hidden h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Nhóm danh mục Filter */}
          <div className="flex items-center gap-1 bg-neutral-50 px-2 rounded-lg border border-neutral-200 text-xs font-bold shrink-0 h-9">
            <span className="text-neutral-400 text-[10px] font-black uppercase">Nhóm:</span>
            <select
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent pr-1 text-xs font-bold text-neutral-800 outline-hidden cursor-pointer"
            >
              <option value="All">Tất cả nhóm</option>
              <option value="shoes">Giày ({totalShoes})</option>
              <option value="accessories">Phụ kiện ({totalAccessories})</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-neutral-50 px-2 rounded-lg border border-neutral-200 text-xs font-bold shrink-0 h-9">
            <Filter size={13} className="text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent pr-1 text-xs font-bold text-neutral-800 outline-hidden cursor-pointer"
            >
              <option value="All">Tất cả trạng thái ({categories.filter((c) => !c.isDeleted).length})</option>
              <option value="Đang hoạt động">Đang hoạt động ({totalActive})</option>
              <option value="Ẩn">Đang Ẩn ({totalHidden})</option>
              <option value="Đã xóa">Thùng rác / Đã xóa ({totalDeleted})</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setGroupFilter('All');
              setStatusFilter('All');
              setCurrentPage(1);
              showToast('Đã làm mới danh sách danh mục!');
            }}
            className="h-9 w-9 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Làm mới bộ lọc"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. DANH SÁCH DANH MỤC (DESKTOP TABLE & MOBILE CARDS)  */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1100px]">
            <thead className="bg-neutral-50/90 border-b border-neutral-200/90 text-neutral-500 font-black uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 w-12 text-center">STT</th>
                <th className="py-3.5 px-5 min-w-[180px]">Tên danh mục</th>
                <th className="py-3.5 px-5 min-w-[140px]">Slug</th>
                <th className="py-3.5 px-5 min-w-[130px] text-center">Nhóm danh mục</th>
                <th className="py-3.5 px-5 min-w-[240px]">Mô tả</th>
                <th className="py-3.5 px-5 text-center min-w-[110px]">Số sản phẩm</th>
                <th className="py-3.5 px-5 text-center min-w-[130px]">Trạng thái</th>
                <th className="py-3.5 px-5 min-w-[110px]">Ngày tạo</th>
                <th className="py-3.5 px-5 text-right min-w-[150px]">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-800">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    <FolderTree size={40} className="mx-auto mb-2 opacity-30 text-neutral-500" />
                    <p className="font-bold text-neutral-600 text-sm">Không tìm thấy danh mục nào phù hợp.</p>
                    <p className="text-xs text-neutral-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat, index) => {
                  const stt = (currentPage - 1) * itemsPerPage + index + 1;
                  const prodCount = categoryProductCountMap[cat.name] || 0;
                  const isAccessory = cat.group === 'accessories';

                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-amber-50/30 transition-colors ${
                        cat.isDeleted ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-4 px-5 text-center font-bold text-neutral-400">{stt}</td>

                      {/* Tên danh mục (KHÔNG có ảnh/icon bên cạnh) */}
                      <td className="py-4 px-5 font-black text-neutral-900">
                        <span className="text-sm font-black text-neutral-900 block">{cat.name}</span>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-5 font-mono text-[11px] text-neutral-600 bg-neutral-50/50">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-bold border border-neutral-200">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Nhóm danh mục */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border ${
                            isAccessory
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isAccessory ? '🎒 Phụ kiện' : '👟 Giày'}
                        </span>
                      </td>

                      {/* Mô tả */}
                      <td className="py-4 px-5 text-neutral-600 max-w-sm">
                        <p className="line-clamp-2 text-xs">{cat.description || 'Chưa có mô tả'}</p>
                      </td>

                      {/* Số sản phẩm */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                            prodCount > 0
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                        >
                          <Package size={12} />
                          <span>{prodCount} sp</span>
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-5 text-center">
                        {cat.isDeleted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                            Đã xóa
                          </span>
                        ) : cat.status === 'Đang hoạt động' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase">
                            Đang Ẩn
                          </span>
                        )}
                      </td>

                      {/* Ngày tạo */}
                      <td className="py-4 px-5 text-neutral-500 font-medium">{cat.createdAt}</td>

                      {/* Thao tác */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cat.isDeleted ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreCategory(cat)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Khôi phục danh mục"
                            >
                              <RotateCcw size={13} />
                              <span>Khôi phục</span>
                            </button>
                          ) : (
                            <>
                              {/* Xem */}
                              <button
                                type="button"
                                onClick={() => setViewingCategory(cat)}
                                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Sửa */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(cat)}
                                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
                                title="Chỉnh sửa danh mục"
                              >
                                <Edit size={15} />
                              </button>

                              {/* Xóa */}
                              <button
                                type="button"
                                onClick={() => handleRequestDelete(cat)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Xóa danh mục"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="block md:hidden p-4 space-y-3">
          {paginatedCategories.length === 0 ? (
            <div className="py-8 text-center text-neutral-400">
              <FolderTree size={36} className="mx-auto mb-2 opacity-30 text-neutral-500" />
              <p className="font-bold text-neutral-600 text-xs">Không tìm thấy danh mục nào phù hợp.</p>
            </div>
          ) : (
            paginatedCategories.map((cat, index) => {
              const stt = (currentPage - 1) * itemsPerPage + index + 1;
              const prodCount = categoryProductCountMap[cat.name] || 0;
              const isAccessory = cat.group === 'accessories';

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border bg-white shadow-xs space-y-3 ${
                    cat.isDeleted ? 'border-rose-200 bg-rose-50/20' : 'border-neutral-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-neutral-400">#{stt}</span>
                        <h3 className="font-black text-base text-neutral-900">{cat.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-neutral-500 block bg-neutral-100 px-1.5 py-0.5 rounded">
                          {cat.slug}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isAccessory ? 'bg-sky-50 text-sky-800' : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {isAccessory ? 'Phụ kiện' : 'Giày'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {cat.isDeleted ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                          Đã xóa
                        </span>
                      ) : cat.status === 'Đang hoạt động' ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase">
                          Ẩn
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2">{cat.description || 'Chưa có mô tả'}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100">
                    <span className="text-neutral-500 font-semibold text-[11px]">
                      {prodCount} sản phẩm • Tạo: {cat.createdAt}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {cat.isDeleted ? (
                        <button
                          type="button"
                          onClick={() => handleRestoreCategory(cat)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Khôi phục
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setViewingCategory(cat)}
                            className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cat)}
                            className="p-1.5 rounded-lg bg-amber-100 text-amber-900 cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestDelete(cat)}
                            className="p-1.5 rounded-lg bg-rose-100 text-rose-600 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Bar */}
        {filteredCategories.length > 0 && (
          <div className="p-4 bg-neutral-50 border-t border-neutral-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-neutral-600">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-neutral-200 px-2 py-1 rounded-xl font-bold text-neutral-800 outline-hidden cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>/ trang (Tổng {filteredCategories.length} danh mục)</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-3 py-1 text-xs font-black text-neutral-900">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 5. MODAL THÊM / CHỈNH SỬA DANH MỤC (NO IMAGES)        */}
      {/* ==================================================== */}
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
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-5">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 uppercase flex items-center gap-2">
                    <FolderTree className="text-amber-500" size={20} />
                    <span>{editingCategory ? 'CHỈNH SỬA DANH MỤC' : 'THÊM DANH MỤC MỚI'}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    {editingCategory
                      ? 'Cập nhật lại tên, slug, nhóm danh mục hoặc trạng thái hoạt động'
                      : 'Tạo danh mục mới để đồng bộ trực tiếp vào Menu Website'}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="space-y-4 text-xs font-bold">
                {/* Notice regarding Gender / Đối tượng */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 font-medium leading-relaxed">
                  💡 <strong>Lưu ý cấu trúc:</strong> Danh mục được chia làm 2 nhóm (<strong>Giày</strong> &amp; <strong>Phụ kiện</strong>). Các thuộc tính <em>Nam / Nữ / Trẻ em</em> thuộc trường <strong>Đối tượng</strong> trong Sản phẩm, không tạo thành Danh mục riêng.
                </div>

                {/* 1. Tên danh mục * */}
                <div>
                  <label className="block text-neutral-800 mb-1 font-black">
                    TÊN DANH MỤC <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="VD: Sneaker, Giày bóng rổ, Dây giày, Lót giày..."
                    className={`w-full bg-neutral-100 focus:bg-white p-3 rounded-2xl border ${
                      formErrors.name ? 'border-rose-500 ring-2 ring-rose-200' : 'border-neutral-200 focus:border-black'
                    } text-xs outline-hidden transition-all`}
                  />
                  {formErrors.name && (
                    <p className="text-rose-500 text-[11px] font-bold mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. Slug */}
                <div>
                  <label className="block text-neutral-800 mb-1 font-black flex items-center justify-between">
                    <span>SLUG (ĐƯỜNG DẪN CHUẨN SEO)</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Tự động tạo nếu để trống</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData({ ...formData, slug: e.target.value });
                      if (formErrors.slug) setFormErrors({ ...formErrors, slug: '' });
                    }}
                    placeholder="VD: sneaker, giay-bong-ro, day-giay"
                    className={`w-full bg-neutral-100 focus:bg-white p-3 rounded-2xl border ${
                      formErrors.slug ? 'border-rose-500 ring-2 ring-rose-200' : 'border-neutral-200 focus:border-black'
                    } text-xs font-mono outline-hidden transition-all`}
                  />
                  {formErrors.slug && (
                    <p className="text-rose-500 text-[11px] font-bold mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      <span>{formErrors.slug}</span>
                    </p>
                  )}
                </div>

                {/* 3. Nhóm danh mục * */}
                <div>
                  <label className="block text-neutral-800 mb-1 font-black">
                    NHÓM DANH MỤC <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                    className="w-full bg-neutral-100 focus:bg-white p-3 rounded-2xl border border-neutral-200 font-bold text-xs outline-hidden cursor-pointer"
                  >
                    <option value="shoes">👟 Giày (Sneaker, Giày thể thao, Giày chạy bộ, Giày bóng đá, Lifestyle, Training...)</option>
                    <option value="accessories">🎒 Phụ kiện (Dây giày, Tất, Lót giày, Túi đựng giày, Dụng cụ vệ sinh giày...)</option>
                  </select>
                  <p className="text-[10px] text-neutral-400 font-normal mt-1">
                    * Nhóm danh mục quyết định vị trí phân bổ trên Menu Customer và cơ chế quản lý size sản phẩm.
                  </p>
                </div>

                {/* 4. Mô tả */}
                <div>
                  <label className="block text-neutral-800 mb-1 font-black">MÔ TẢ DANH MỤC</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả tóm tắt về loại sản phẩm này..."
                    className="w-full bg-neutral-100 focus:bg-white p-3 rounded-2xl border border-neutral-200 focus:border-black text-xs outline-hidden transition-all resize-none"
                  />
                </div>

                {/* 5. Trạng thái */}
                <div>
                  <label className="block text-neutral-800 mb-1 font-black">TRẠNG THÁI HOẠT ĐỘNG</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-neutral-100 focus:bg-white p-3 rounded-2xl border border-neutral-200 font-bold text-xs outline-hidden cursor-pointer"
                  >
                    <option value="Đang hoạt động">Đang hoạt động (Hiển thị trên Menu Website Customer)</option>
                    <option value="Ẩn">Ẩn (Tạm ngưng hiển thị danh mục trên Website)</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-neutral-200 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveCategory}
                    className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin text-amber-400" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} className="text-amber-400" />
                        <span>{editingCategory ? 'Cập Nhật Danh Mục' : 'Lưu Danh Mục Mới'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 6. MODAL XEM CHI TIẾT DANH MỤC                       */}
      {/* ==================================================== */}
      <AnimatePresence>
        {viewingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="text-base font-black text-neutral-900 uppercase flex items-center gap-2">
                  <FolderTree size={18} className="text-amber-500" />
                  <span>Chi Tiết Danh Mục #{viewingCategory.name}</span>
                </h3>
                <button
                  onClick={() => setViewingCategory(null)}
                  className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Tên danh mục</span>
                    <span className="text-sm font-black text-neutral-900">{viewingCategory.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Slug</span>
                    <span className="text-xs font-mono font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200 inline-block">
                      {viewingCategory.slug}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Nhóm danh mục</span>
                    <span className={`font-black ${viewingCategory.group === 'accessories' ? 'text-sky-700' : 'text-amber-800'}`}>
                      {viewingCategory.group === 'accessories' ? '🎒 Phụ kiện' : '👟 Giày'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Trạng thái</span>
                    <span className={`font-bold ${viewingCategory.status === 'Đang hoạt động' ? 'text-emerald-700' : 'text-neutral-500'}`}>
                      {viewingCategory.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Ngày khởi tạo</span>
                    <span className="font-bold text-neutral-800">{viewingCategory.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Cập nhật lần cuối</span>
                    <span className="font-bold text-neutral-800">{viewingCategory.updatedAt || viewingCategory.createdAt}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Mô tả</span>
                  <p className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 leading-relaxed">
                    {viewingCategory.description || 'Chưa có mô tả chi tiết cho danh mục này.'}
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-amber-600" />
                    <span>Số lượng sản phẩm gắn danh mục này:</span>
                  </div>
                  <span className="text-base font-black">
                    {categoryProductCountMap[viewingCategory.name] || 0} SP
                  </span>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setViewingCategory(null)}
                    className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 7. MODAL CẢNH BÁO RÀNG BUỘC KHI XÓA (HAS PRODUCTS)   */}
      {/* ==================================================== */}
      <AnimatePresence>
        {constraintAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConstraintAlert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-200 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-sm">
                <ShieldAlert size={32} />
              </div>

              <h3 className="text-lg font-black text-neutral-900 uppercase mb-2">
                KHÔNG THỂ XÓA DANH MỤC NÀY
              </h3>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 text-xs font-bold space-y-2 mb-5 leading-relaxed text-left">
                <p>
                  Danh mục <strong>"{constraintAlert.category.name}"</strong> hiện đang chứa{' '}
                  <span className="text-rose-700 font-black underline">{constraintAlert.count} sản phẩm</span>.
                </p>
                <p className="text-neutral-700 font-medium">
                  Vui lòng chuyển tất cả sản phẩm này sang danh mục khác trước khi thực hiện thao tác xóa danh mục.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConstraintAlert(null)}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Đã hiểu
                </button>

                {onNavigateToProducts && (
                  <button
                    type="button"
                    onClick={() => {
                      setConstraintAlert(null);
                      onNavigateToProducts();
                    }}
                    className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Xem sản phẩm</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 7. MODAL XÁC NHẬN XÓA MỀM (CONFIRM SOFT DELETE)     */}
      {/* ==================================================== */}
      <AnimatePresence>
        {deletingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
                <Trash2 size={28} />
              </div>

              <h3 className="text-lg font-black text-neutral-900 uppercase mb-2">
                XÁC NHẬN XÓA DANH MỤC
              </h3>

              <p className="text-xs text-neutral-600 font-medium mb-6 leading-relaxed">
                Bạn có chắc muốn xóa danh mục <strong>"{deletingCategory.name}"</strong>? Danh mục sẽ được chuyển sang trạng thái <strong>Đã xóa (Soft Delete)</strong> và có thể khôi phục lại bất kỳ lúc nào.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSoftDelete}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Xóa Danh Mục
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
