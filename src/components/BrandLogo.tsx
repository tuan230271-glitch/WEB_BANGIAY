import React, { useState } from 'react';

interface BrandLogoProps {
  logo?: string;
  brandName: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

// Crisp inline SVGs for standard iconic brands as rock-solid defaults
const BRAND_SVG_ICONS: Record<string, React.ReactNode> = {
  nike: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21.707 5.293a1 1 0 00-1.414 0l-11.5 11.5-4.5-4.5a1 1 0 00-1.414 1.414l5.207 5.207a1 1 0 001.414 0l12.207-12.207a1 1 0 000-1.414z" style={{ display: 'none' }} />
      {/* Authentic Nike Swoosh path */}
      <path d="M21.71 7.04c-2.83 2.58-6.63 5.42-10.42 7.71-2.48 1.5-4.94 2.66-7.07 3.19-.53.13-1.02.2-1.45.2-.67 0-1.19-.18-1.5-.54-.4-.46-.47-1.19-.2-2.12.39-1.34 1.34-3.05 2.76-4.97C5.7 8.01 8.27 5.57 11.33 3.39c.66-.47 1.47-.35 1.95.27.46.61.35 1.47-.27 1.95-2.83 2.01-5.2 4.25-6.9 6.38-1.17 1.46-1.87 2.73-2.11 3.63-.09.34-.07.54-.03.62.05.11.17.21.43.21.31 0 .71-.06 1.15-.17 1.83-.46 4.02-1.48 6.27-2.84 3.52-2.12 7.08-4.78 9.77-7.22.61-.55 1.55-.5 2.11.11.55.61.51 1.55-.1 2.11z" />
    </svg>
  ),
  adidas: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Authentic 3 stripes angle */}
      <path d="M2 19h3.5L10 10.5 7.8 7zM7.5 19h3.5l5.2-9.7-2.3-2.8zM13 19h3.5L23 7.8l-2.4-1.8z" />
    </svg>
  ),
  puma: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Iconic leaping Puma shape */}
      <path d="M19.5 5.5c-1.2 0-2.2.8-2.6 1.9l-2.2 1.3c-.6-.4-1.4-.7-2.2-.7-1.8 0-3.3 1.2-3.8 2.8L5.5 12c-1.4.3-2.5 1.5-2.5 3 0 1.7 1.3 3 3 3 1.1 0 2-.6 2.5-1.5l3.2-1.2c.7.4 1.5.7 2.3.7 2.2 0 4-1.8 4-4 0-.3 0-.6-.1-.9l2.4-1.4c.5.5 1.2.8 1.9.8 1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.7-2.5z" />
    </svg>
  ),
  converse: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      {/* Converse star & chevron */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 7.5l1.4 2.8 3.1.4-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.4z" />
    </svg>
  )
};

export default function BrandLogo({
  logo,
  brandName,
  className = 'h-10 w-auto',
  imageClassName = 'h-full w-full object-contain',
  fallbackClassName = ''
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  const cleanName = (brandName || '').trim();
  const lowerName = cleanName.toLowerCase();
  const hasValidLogo = logo && typeof logo === 'string' && logo.trim().length > 0 && !imgError;

  // If we have a valid image source (Data URI, valid URL, local asset path)
  if (hasValidLogo) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src={logo}
          alt={cleanName}
          className={imageClassName}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If known iconic brand and no custom image or image errored, check if we have vector icon
  const vectorIcon = BRAND_SVG_ICONS[lowerName];
  if (vectorIcon) {
    return (
      <div
        className={`flex items-center justify-center text-neutral-900 ${className} ${fallbackClassName}`}
        title={cleanName}
      >
        <div className="h-full max-h-8 w-auto aspect-square flex items-center justify-center">
          {vectorIcon}
        </div>
      </div>
    );
  }

  // Stylized fallback typography badge: [ BRAND ]
  const initials = cleanName.length <= 4 ? cleanName.toUpperCase() : cleanName.slice(0, 3).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center select-none ${className} ${fallbackClassName}`}
      title={cleanName}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 text-white font-black text-xs tracking-widest uppercase shadow-xs">
        <span>{initials}</span>
      </div>
    </div>
  );
}
