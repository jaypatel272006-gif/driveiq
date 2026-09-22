/*
================================================================================
DRIVEIQ — CANONICAL SLUG & ROUTING UTILITY
================================================================================
Single source of truth for URL slugification, route building, and normalization.
================================================================================
*/

/**
 * Normalizes any string into a clean, lowercased, hyphenated URL slug.
 * Handles spaces, special characters, ampersands, brackets, dots, and underscores.
 *
 * Examples:
 *  "Maruti Suzuki" -> "maruti-suzuki"
 *  "Alto K10" -> "alto-k10"
 *  "XUV 3XO" -> "xuv-3xo"
 *  "i20 N Line" -> "i20-n-line"
 *  "Grand i10 Nios" -> "grand-i10-nios"
 *  "Tiago EV" -> "tiago-ev"
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts normalized brand slug
 */
export function getCanonicalBrandSlug(brandName: string): string {
  return slugify(brandName);
}

/**
 * Extracts normalized model slug, stripping brand prefix if present to avoid duplication.
 *
 * Example:
 *  modelName: "Maruti Suzuki Alto K10", brandName: "Maruti Suzuki" -> "alto-k10"
 *  modelName: "Alto K10", brandName: "Maruti Suzuki" -> "alto-k10"
 */
export function getCanonicalModelSlug(modelName: string, brandName?: string): string {
  let cleanName = modelName;
  if (brandName) {
    const brandLower = brandName.toLowerCase();
    const modelLower = cleanName.toLowerCase();
    if (modelLower.startsWith(brandLower)) {
      cleanName = cleanName.substring(brandName.length).trim();
    }
  }
  return slugify(cleanName);
}

/**
 * Returns canonical route for a vehicle model.
 * Format: `/cars/:brandSlug/:modelSlug`
 */
export function getVehicleCanonicalRoute(brandName: string, modelName: string, explicitModelSlug?: string, explicitBrandSlug?: string): string {
  const bSlug = explicitBrandSlug || getCanonicalBrandSlug(brandName);
  const mSlug = explicitModelSlug || getCanonicalModelSlug(modelName, brandName);
  return `/cars/${bSlug}/${mSlug}`;
}
