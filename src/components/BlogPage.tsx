import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Tag,
  Clock,
  Calendar,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
  Eye,
  Shirt,
  ShieldAlert,
  Sparkle,
  Newspaper,
  X,
  User
} from 'lucide-react';
import { BlogPost, BlogCategory, Product } from '../types';
import { BLOG_POSTS } from '../data/blogData';

interface BlogPageProps {
  onBackToHome?: () => void;
  onNavigateHome?: () => void;
  onNavigateProducts?: (category?: string, brand?: string) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateProductDetail?: (product: Product) => void;
  products?: Product[];
  categories?: any[];
  brands?: any[];
  initialPostSlug?: string;
}

const CATEGORIES: { id: BlogCategory; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'all', label: 'Tất cả bài viết', icon: BookOpen },
  { id: 'styling', label: 'Cách phối đồ', icon: Shirt },
  { id: 'shoe_care', label: 'Mẹo bảo quản giày', icon: ShieldAlert },
  { id: 'cleaning', label: 'Hướng dẫn vệ sinh', icon: Sparkle },
  { id: 'news', label: 'Tin tức & Thời trang', icon: Newspaper }
];

export default function BlogPage({
  onBackToHome,
  onNavigateHome,
  onNavigateProducts,
  onSelectProduct,
  onNavigateProductDetail,
  products = [],
  initialPostSlug
}: BlogPageProps) {
  const handleGoHome = onNavigateHome || onBackToHome;
  const handleSelectProduct = onNavigateProductDetail || onSelectProduct;
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BlogPost | null>(() => {
    if (initialPostSlug) {
      return BLOG_POSTS.find((p) => p.slug === initialPostSlug) || null;
    }
    return null;
  });

  React.useEffect(() => {
    if (initialPostSlug) {
      const found = BLOG_POSTS.find((p) => p.slug === initialPostSlug);
      if (found) {
        setActivePost(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [initialPostSlug]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('knicks_saved_blogs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSavePost = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPosts((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      try {
        localStorage.setItem('knicks_saved_blogs', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCat = selectedCategory === 'all' || post.category === selectedCategory;
      const matchTag = !selectedTag || post.tags.includes(selectedTag);
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query);
      return matchCat && matchTag && matchQuery;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50/70 pt-4 pb-20 font-sans" id="blog-page-root">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ==================================================== */}
        {/* 1. BREADCRUMB                                       */}
        {/* ==================================================== */}
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <li>
              <button
                type="button"
                onClick={handleGoHome}
                className="hover:text-black transition-colors cursor-pointer flex items-center gap-1 text-neutral-600 font-bold"
                id="blog-breadcrumb-home"
              >
                <span>Trang chủ</span>
              </button>
            </li>
            <li>
              <ChevronRight size={14} className="text-neutral-400" />
            </li>
            <li className="text-black font-extrabold" aria-current="page">
              Tin tức / Blog
            </li>
          </ol>
        </nav>

        {/* ==================================================== */}
        {/* 2. HEADER BANNER & INTRO                             */}
        {/* ==================================================== */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>K-NICKS SNEAKER LIFESTYLE & CARE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            TIN TỨC & BÍ QUYẾT GIÀY SNEAKER
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-3xl font-normal leading-relaxed">
            Nơi chia sẻ phong cách phối đồ chuẩn gu, mẹo bảo quản giày tránh ố vàng, cẩm nang vệ sinh chuyên nghiệp và cập nhật xu hướng sneaker mới nhất từ K-NICKS.
          </p>
        </header>

        {/* ==================================================== */}
        {/* 3. FEATURED POST HIGHLIGHT (HERO CARD)              */}
        {/* ==================================================== */}
        {!searchQuery && !selectedTag && selectedCategory === 'all' && featuredPost && (
          <section className="mb-12" aria-label="Bài viết nổi bật">
            <div
              onClick={() => setActivePost(featuredPost)}
              className="group cursor-pointer bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
              id="featured-blog-card"
            >
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-neutral-100">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-xs font-black uppercase tracking-wider shadow-md">
                    <Sparkles size={13} />
                    <span>Nổi bật</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-bold mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-black uppercase tracking-wider text-[11px]">
                      {featuredPost.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {featuredPost.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {featuredPost.publishedAt}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 leading-tight group-hover:text-amber-600 transition-colors line-clamp-3">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-neutral-600 mt-3.5 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <p className="text-xs font-black text-neutral-900">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-neutral-500 font-medium">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-black text-black group-hover:text-amber-600 uppercase tracking-wider"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* 4. FILTER BAR & SEARCH                               */}
        {/* ==================================================== */}
        <section className="mb-8 space-y-4" aria-label="Bộ lọc chuyên mục">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedTag(null);
                  }}
                  id={`cat-btn-${cat.id}`}
                  className={`cursor-pointer whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-md'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Tag Chips */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết theo tiêu đề, mẹo bảo quản, vệ sinh..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
                id="blog-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Tags quick filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-neutral-400 text-[11px] font-bold shrink-0 flex items-center gap-1 mr-1">
                <Tag size={12} />
                <span>Tags:</span>
              </span>
              {allTags.slice(0, 5).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  className={`cursor-pointer shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    selectedTag === t
                      ? 'bg-amber-500 text-black font-black'
                      : 'bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  #{t}
                </button>
              ))}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="cursor-pointer text-[11px] font-bold text-rose-600 hover:underline shrink-0 ml-1"
                >
                  Xóa lọc tag
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 5. BLOG POSTS GRID                                  */}
        {/* ==================================================== */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 my-8">
            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-black text-neutral-900 uppercase">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ cẩm nang từ K-NICKS.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => {
              const isSaved = savedPosts.includes(post.id);
              return (
                <article
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group cursor-pointer bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  id={`blog-card-${post.id}`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-neutral-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-white font-black text-[10px] uppercase tracking-wider">
                          {post.categoryLabel}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleSavePost(post.id, e)}
                        title={isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm ${
                          isSaved
                            ? 'bg-amber-500 text-black'
                            : 'bg-black/50 text-white hover:bg-black'
                        }`}
                      >
                        <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Content preview */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-neutral-950 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Author footer */}
                  <div className="px-5 sm:px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                      />
                      <span className="text-xs font-bold text-neutral-800">{post.author.name}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-black text-neutral-900 group-hover:text-amber-600 uppercase tracking-wider">
                      <span>Đọc</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. BOTTOM BANNER: GỢI Ý SHOPPING                      */}
        {/* ==================================================== */}
        {onNavigateProducts && (
          <section className="mt-16 bg-neutral-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider">
                <Sparkles size={13} />
                <span>K-NICKS OFFICIAL STORE</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                TÌM ĐÔI GIÀY PHÙ HỢP VỚI PHONG CÁCH CỦA BẠN
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Khám phá bộ sưu tập Sneaker, Running, Basketball và phụ kiện chính hãng 100% từ Nike, Adidas, Puma, Converse với ưu đãi hấp dẫn và cam kết bảo hành 30 ngày.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateProducts?.()}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  id="blog-explore-products-btn"
                >
                  <span>KHÁM PHÁ SẢN PHẨM NGAY</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* ==================================================== */}
      {/* 7. ARTICLE READER MODAL (FULL VIEW)                  */}
      {/* ==================================================== */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl relative"
              id="blog-article-reader"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="fixed top-5 right-5 sm:absolute sm:top-5 sm:right-5 z-20 w-10 h-10 rounded-full bg-black/60 sm:bg-neutral-100 hover:bg-black text-white sm:text-neutral-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                id="close-article-modal"
              >
                <X size={20} />
              </button>

              {/* Cover Banner */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900">
                <img
                  src={activePost.coverImage}
                  alt={activePost.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-black text-xs uppercase tracking-wider">
                    {activePost.categoryLabel}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase leading-tight">
                    {activePost.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta Bar */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePost.author.avatar}
                      alt={activePost.author.name}
                      className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <p className="font-black text-neutral-900 text-sm">{activePost.author.name}</p>
                      <p className="text-neutral-500 text-xs">{activePost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-neutral-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {activePost.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {activePost.readTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleShare(activePost)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black cursor-pointer transition-colors"
                      id="share-article-btn"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                      <span>{copiedLink ? 'Đã sao chép link' : 'Chia sẻ'}</span>
                    </button>
                  </div>
                </div>

                {/* Article Body Content */}
                <div className="prose prose-neutral max-w-none text-sm sm:text-base text-neutral-800 leading-relaxed space-y-4 font-normal">
                  <p className="text-base sm:text-lg font-semibold text-neutral-900 italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/50 rounded-r-xl">
                    {activePost.excerpt}
                  </p>

                  <div className="space-y-4 whitespace-pre-line text-neutral-700 leading-relaxed font-sans">
                    {activePost.content.trim()}
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                    <Tag size={13} />
                    Tags:
                  </span>
                  {activePost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Modal Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Đóng bài viết
                  </button>

                  {onNavigateProducts && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePost(null);
                        onNavigateProducts();
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Xem các mẫu giày liên quan</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
