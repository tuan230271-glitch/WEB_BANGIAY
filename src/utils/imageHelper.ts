import React from 'react';

/**
 * Default high-quality sneaker placeholder image
 */
export const DEFAULT_SNEAKER_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';

/**
 * Offline SVG placeholder as emergency fallback
 */
export const DEFAULT_SNEAKER_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="%23f3f4f6"/><path d="M60 210 C100 210 130 190 160 170 C190 150 240 120 280 120 C320 120 340 140 340 175 C340 195 320 210 290 210 Z" fill="%23e5e7eb" stroke="%239ca3af" stroke-width="4"/><path d="M110 210 C130 185 165 170 210 165 C260 160 300 175 325 210 Z" fill="%23d1d5db"/><circle cx="120" cy="180" r="6" fill="%239ca3af"/><circle cx="140" cy="170" r="6" fill="%239ca3af"/><circle cx="160" cy="160" r="6" fill="%239ca3af"/><text x="200" y="255" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%236b7280" text-anchor="middle">K-NICKS SNEAKER</text></svg>';

/**
 * Normalizes image source:
 * - Base64 strings (data:image/...) returned as-is
 * - Blob URLs returned as-is
 * - Full http/https URLs returned as-is
 * - Relative paths like src/assets/... normalized to /src/assets/...
 * - Missing/empty/falsy strings fallback to DEFAULT_SNEAKER_IMAGE
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_SNEAKER_IMAGE;
  }

  const clean = url.trim();

  // Base64 format: data:image/jpeg;base64,... or data:image/png;base64,...
  if (clean.startsWith('data:image/')) {
    return clean;
  }

  // Blob object URLs
  if (clean.startsWith('blob:')) {
    return clean;
  }

  // Remote Web URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // Local assets path without leading slash
  if (clean.startsWith('src/')) {
    return `/${clean}`;
  }

  return clean;
}

/**
 * Image error handler for <img> elements:
 * Replaces broken images with a sneaker placeholder.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_SNEAKER_IMAGE
): void {
  const target = e.currentTarget;

  // Prevent infinite retry loops
  if (target.dataset.hasFailed === 'svg-fallback') {
    return;
  }

  if (target.dataset.hasFailed === 'primary-fallback') {
    target.dataset.hasFailed = 'svg-fallback';
    target.src = DEFAULT_SNEAKER_SVG;
    return;
  }

  target.dataset.hasFailed = 'primary-fallback';
  target.src = fallbackSrc;
}
