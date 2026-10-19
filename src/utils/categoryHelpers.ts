import { CategoryItem, Product, GenderType } from '../types';

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

/**
 * Checks if a category is an accessory (Phụ kiện)
 */
export function isAccessoryCategory(category: CategoryItem | string): boolean {
  if (!category) return false;
  
  if (typeof category === 'object') {
    if (category.group === 'accessories') return true;
    if (category.group === 'shoes') return false;
  }

  const name = typeof category === 'string' ? category : category.name;
  const slug = typeof category === 'string' ? slugify(category) : (category.slug || slugify(category.name));
  const combined = (name + ' ' + slug).toLowerCase();

  const accessoryKeywords = [
    'phụ kiện', 'phu kien', 'accessory', 'accessories',
    'dây', 'day giay', 'shoelace', 'shoelaces', 'lace',
    'tất', 'vớ', 'tat', 'vo', 'sock', 'socks',
    'lót', 'lot giay', 'insole', 'insoles',
    'túi', 'tui dung', 'tui giay', 'bag', 'shoe bag', 'shoe-bags',
    'vệ sinh', 've sinh', 'xi danh', 'cleaner', 'shoe care', 'shoe-care', 'crep', 'bình xịt', 'xit ve sinh',
    'chăm sóc', 'cham soc'
  ];

  return accessoryKeywords.some(kw => combined.includes(kw));
}

/**
 * Checks if a category is a shoe type (Giày theo loại)
 */
export function isShoeCategory(category: CategoryItem | string): boolean {
  return !isAccessoryCategory(category);
}

/**
 * Splits a list of CategoryItems into Shoe categories and Accessory categories
 */
export function splitCategories(categories: CategoryItem[]) {
  const activeCategories = (categories || []).filter(c => !c.isDeleted && c.status === 'Đang hoạt động');
  
  const shoeCategories: CategoryItem[] = [];
  const accessoryCategories: CategoryItem[] = [];

  activeCategories.forEach(cat => {
    if (isAccessoryCategory(cat)) {
      accessoryCategories.push(cat);
    } else {
      shoeCategories.push(cat);
    }
  });

  return {
    activeCategories,
    shoeCategories,
    accessoryCategories
  };
}

/**
 * Normalize gender query param or string
 */
export function normalizeGender(genderStr: string | null | undefined): GenderType | 'All' {
  if (!genderStr) return 'All';
  const lower = genderStr.toLowerCase().trim();
  if (['men', 'nam', 'male'].includes(lower)) return 'Nam';
  if (['women', 'nu', 'nữ', 'female'].includes(lower)) return 'Nữ';
  if (['kids', 'kid', 'children', 'tre-em', 'tre em', 'trẻ em'].includes(lower)) return 'Trẻ em';
  if (['unisex'].includes(lower)) return 'Unisex';
  return 'All';
}

/**
 * Check if a product matches a target gender filter
 */
export const GENDER_OPTIONS = [
  { key: 'men', name: 'Nam' as GenderType, label: 'Nam', description: 'Giày thể thao & sneaker nam' },
  { key: 'women', name: 'Nữ' as GenderType, label: 'Nữ', description: 'Giày thể thao & sneaker nữ' },
  { key: 'kids', name: 'Trẻ em' as GenderType, label: 'Trẻ em', description: 'Giày trẻ em năng động' },
] as const;

export function isProductMatchingGender(product: Product, targetGender: string): boolean {
  if (!targetGender || targetGender === 'All') return true;
  const prodGender = product.gender || 'Nam';
  
  if (targetGender === 'Nam') {
    return prodGender === 'Nam' || prodGender === 'Unisex';
  }
  if (targetGender === 'Nữ') {
    return prodGender === 'Nữ' || prodGender === 'Unisex';
  }
  if (targetGender === 'Trẻ em') {
    return prodGender === 'Trẻ em';
  }
  if (targetGender === 'Unisex') {
    return prodGender === 'Unisex';
  }
  return true;
}

export const isProductForGender = isProductMatchingGender;

