import React, { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp, Clock, ShieldCheck, RefreshCw, Truck, FileText, Lock, ChevronRight } from 'lucide-react';
import { SystemSettings, BrandItem } from '../types';
import { INITIAL_BRANDS } from '../data';
import PolicyModal from './PolicyModal';
import { useLanguage } from '../utils/translations';

interface FooterProps {
  settings?: SystemSettings;
  brands?: BrandItem[];
  onNavigate?: (view: any, targetId?: string) => void;
  onNavigateBrand?: (brand: BrandItem) => void;
  onNavigateBrandsPage?: () => void;
  onNavigatePromotions?: () => void;
  onNavigateContact?: () => void;
  onNavigateBlog?: () => void;
  onNavigateAboutContact?: () => void;
}

export default function Footer({
  settings,
  brands = INITIAL_BRANDS,
  onNavigate,
  onNavigateBrand,
  onNavigateBrandsPage,
  onNavigatePromotions,
  onNavigateContact,
  onNavigateBlog,
  onNavigateAboutContact
}: FooterProps) {
  const { t, language } = useLanguage();
  const [activePolicyModal, setActivePolicyModal] = useState<
    'return' | 'shipping' | 'privacy' | 'terms' | 'warranty' | null
  >(null);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (view: any, targetId?: string) => {
    if (view === 'contact' && onNavigateContact) {
      onNavigateContact();
      return;
    }
    if (onNavigate) {
      onNavigate(view, targetId);
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        scrollToTop();
      }
    } else {
      scrollToTop();
    }
  };

  const storeName = settings?.storeName || 'K-NICKS';
  const tagline = settings?.storeTagline || 'PREMIUM';
  const storeDesc =
    settings?.storeDescription ||
    'Nơi hội tụ các dòng sản phẩm giày sneaker và thể thao chính hãng cao cấp từ những thương hiệu hàng đầu thế giới: Nike, Adidas, Puma, Converse. Định hình phong cách và hiệu suất cho sải bước của bạn.';
  const hotline = settings?.hotline || '1900 8463';
  const email = settings?.email || 'support@knicks.vn';
  const address = settings?.address || '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh';
  const workingHours = settings?.workingHours || '08:30 - 21:30 (Thứ 2 - Chủ Nhật, kể cả ngày lễ)';

  const social = settings?.socialLinks;

  return (
    <>
      <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-900" id="main-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Upper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div
                onClick={() => handleLinkClick('home')}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={storeName}
                    className="h-9 max-w-[150px] object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-black text-lg shadow-md transition-transform group-hover:scale-105">
                      {storeName ? storeName.charAt(0).toUpperCase() : 'K'}
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-white group-hover:text-amber-400 transition-colors">
                      {storeName}
                    </span>
                  </>
                )}
                {tagline && (
                  <span className="rounded-md bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-black uppercase tracking-wider">
                    {tagline.length > 15 ? 'AUTHENTIC' : tagline}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {storeDesc}
              </p>
              
              {/* Social Icons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {social?.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    title="Facebook K-NICKS"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {social?.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-pink-600 hover:text-white transition-all duration-300"
                    title="Instagram K-NICKS"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {social?.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all duration-300 text-xs font-black"
                    title="TikTok K-NICKS"
                  >
                    TT
                  </a>
                )}
                {social?.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-sky-500 hover:text-white transition-all duration-300"
                    title="Twitter K-NICKS"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {social?.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:bg-red-600 hover:text-white transition-all duration-300"
                    title="YouTube K-NICKS"
                  >
                    <Youtube size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-300">{t.navColTitle}</h4>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('home')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.home}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('products')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.products}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateBrandsPage) {
                        onNavigateBrandsPage();
                      } else {
                        handleLinkClick('brands');
                      }
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.brands}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigatePromotions) {
                        onNavigatePromotions();
                      } else {
                        handleLinkClick('promotions');
                      }
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                    id="footer-promotions-link"
                  >
                    <span>{t.promotions}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateBlog) {
                        onNavigateBlog();
                      } else {
                        handleLinkClick('blog');
                      }
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                    id="footer-blog-link"
                  >
                    <span>{t.blog}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateContact) {
                        onNavigateContact();
                      } else if (onNavigateAboutContact) {
                        onNavigateAboutContact();
                      } else {
                        handleLinkClick('about-contact');
                      }
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                    id="footer-contact-link"
                  >
                    <span>{t.contact}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Policy & Support */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-300">{t.policyColTitle}</h4>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('warranty')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={13} className="text-neutral-500" />
                    <span>{t.policyWarranty}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('return')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} className="text-neutral-500" />
                    <span>{t.policyReturn}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('shipping')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <Truck size={13} className="text-neutral-500" />
                    <span>{t.policyShipping}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('terms')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={13} className="text-neutral-500" />
                    <span>{t.policyTerms}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('privacy')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock size={13} className="text-neutral-500" />
                    <span>{t.policyPrivacy}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold tracking-widest uppercase text-neutral-300">{t.contactColTitle}</h4>
              <ul className="space-y-3 text-xs text-neutral-400 font-light">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 text-amber-400 flex-shrink-0" />
                  <span className="leading-relaxed">{address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-amber-400 flex-shrink-0" />
                  <a
                    href={`tel:${hotline.replace(/\s+/g, '')}`}
                    className="hover:text-amber-400 transition-colors font-medium text-white"
                  >
                    {t.hotline}: {hotline}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-amber-400 flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-amber-400 transition-colors text-neutral-300"
                  >
                    {t.email}: {email}
                  </a>
                </li>
                {workingHours && (
                  <li className="flex items-start gap-2.5">
                    <Clock size={16} className="mt-0.5 text-amber-400 flex-shrink-0" />
                    <span className="leading-relaxed text-neutral-400">{workingHours}</span>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Lower Grid: Copyright & Go to Top */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} {storeName} Sneaker Store. {t.allRightsReserved}
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300 group cursor-pointer text-neutral-300 font-semibold"
            >
              <span>{t.backToTop}</span>
              <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </footer>

      {/* Interactive Policy Modal */}
      <PolicyModal
        isOpen={!!activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
        policyType={activePolicyModal}
        settings={settings}
      />
    </>
  );
}

