import { BRANDS_DB } from './brands';
import { MODELS_DB } from './models';
import { VARIANTS_DB } from './variants';
import { FEATURES_DB } from './features';
import { VARIANT_FEATURES_DB } from './variantFeatures';
import { SAFETY_PROFILES_DB } from './safetyProfiles';
import { OWNERSHIP_PROFILES_DB } from './ownershipProfiles';
import { RESALE_PROFILES_DB } from './resaleProfiles';
import { DRIVEIQ_SCORES_DB } from './driveiqScores';
import { Brand, VehicleModel, Variant, CompleteVehicleData, FeatureStatus, MarketStatus } from '../../types/database';
import { slugify, getCanonicalBrandSlug, getCanonicalModelSlug, getVehicleCanonicalRoute } from '../../utils/slugify';

export interface DatabaseHealthReport {
  totalBrands: number;
  totalModels: number;
  totalVariants: number;
  totalEVs: number;
  currentModelsCount: number;
  discontinuedModelsCount: number;
  upcomingModelsCount: number;
  missingImagesCount: number;
  missingPricingCount: number;
  missingSpecificationsCount: number;
  dataHealthScore: number;
  routeValidation: {
    totalRoutesTested: number;
    validRoutesCount: number;
    duplicateSlugsCount: number;
    errors: string[];
  };
}

export const vehicleDb = {
  // Brand Queries
  getAllBrands(): Brand[] {
    return BRANDS_DB.filter(b => b.active);
  },
  getBrandById(id: string): Brand | undefined {
    return BRANDS_DB.find(b => b.id === id);
  },
  getBrandBySlug(slug: string): Brand | undefined {
    const norm = slugify(slug);
    return BRANDS_DB.find(b => slugify(b.slug) === norm || slugify(b.name) === norm);
  },

  // Model Queries
  getAllModels(includeDiscontinuedAndUpcoming = true): VehicleModel[] {
    if (includeDiscontinuedAndUpcoming) {
      return MODELS_DB.filter(m => m.active);
    }
    return MODELS_DB.filter(m => m.active && m.marketStatus === 'current');
  },

  getModelsByMarketStatus(status: MarketStatus): VehicleModel[] {
    return MODELS_DB.filter(m => m.active && m.marketStatus === status);
  },

  getModelById(id: string): VehicleModel | undefined {
    return MODELS_DB.find(m => m.id === id || slugify(m.id) === slugify(id));
  },

  /**
   * CANONICAL & RESILIENT MODEL SLUG LOOKUP ENGINE
   * Resolves URLs like:
   *  - /cars/maruti-suzuki/alto-k10 (Canonical)
   *  - /cars/maruti-suzuki/suzuki-alto-k10 (Legacy fallback)
   */
  getModelBySlug(rawBrandSlug: string, rawModelSlug: string): VehicleModel | undefined {
    if (!rawBrandSlug || !rawModelSlug) return undefined;

    const normBrand = slugify(rawBrandSlug);
    const normModel = slugify(rawModelSlug);

    // 1. Resolve Brand
    const brand = this.getBrandBySlug(normBrand);

    // 2. Search Models
    return MODELS_DB.find(m => {
      const mBrand = this.getBrandById(m.brandId);
      const mBrandSlug = mBrand ? slugify(mBrand.name) : '';
      const mModelSlug = slugify(m.slug);
      const mNameSlug = slugify(m.name);

      // Check Brand Alignment
      const brandMatches = !brand || m.brandId === brand.id || mBrandSlug === normBrand;
      if (!brandMatches) return false;

      // Check Direct Slug / Name Match
      if (mModelSlug === normModel || mNameSlug === normModel || slugify(m.id) === normModel) {
        return true;
      }

      // Legacy fallback: Handle redundant brand prefix in modelSlug (e.g. "suzuki-alto-k10")
      if (mBrand) {
        const brandNameSlug = slugify(mBrand.name);
        const parts = brandNameSlug.split('-');
        for (const part of parts) {
          if (part.length > 2 && normModel.startsWith(part + '-')) {
            const stripped = normModel.replace(new RegExp(`^(${parts.join('|')})+[-]?`, 'g'), '');
            if (mModelSlug === stripped || mNameSlug === stripped) return true;
          }
        }
      }

      return false;
    });
  },

  // Variant Queries
  getVariantsByModelId(modelId: string): Variant[] {
    return VARIANTS_DB.filter(v => v.modelId === modelId && v.active);
  },

  getVariantBySlug(brandSlug: string, modelSlug: string, variantSlug: string): { model: VehicleModel; variant: Variant } | undefined {
    const model = this.getModelBySlug(brandSlug, modelSlug);
    if (!model) return undefined;
    const normVar = slugify(variantSlug);
    const variant = VARIANTS_DB.find(v => v.modelId === model.id && (slugify(v.slug) === normVar || slugify(v.name) === normVar));
    if (!variant) return undefined;
    return { model, variant };
  },

  // Complete Aggregated Composite Data Engine
  getCompleteVehicleDataByModelId(modelId: string): CompleteVehicleData | undefined {
    const model = this.getModelById(modelId);
    if (!model) return undefined;
    const brand = this.getBrandById(model.brandId);
    if (!brand) return undefined;

    const variants = this.getVariantsByModelId(modelId);
    const safety = SAFETY_PROFILES_DB[modelId] || {
      id: `safe-${modelId}`,
      modelId,
      officialNcapRating: null,
      ncapTestingAgency: 'Untested / Pending',
      adultProtectionPercentage: null,
      childProtectionPercentage: null,
      airbagCount: 6,
      abs: true,
      esc: true,
      hillHold: true,
      tractionControl: true,
      rearCamera: true,
      parkingSensors: true,
      camera360: false,
      hasADAS: false,
      blindSpotMonitoring: false,
      laneKeepAssist: false,
      adaptiveCruiseControl: false,
      autonomousEmergencyBraking: false,
      isofixChildSeatMounts: true,
      tpms: true,
      dataQuality: 'DEMO'
    };

    const scores = DRIVEIQ_SCORES_DB[modelId] || {
      safetyScore: 80,
      comfortScore: 85,
      performanceScore: 82,
      featureScore: 88,
      reliabilityScore: 88,
      maintenanceScore: 85,
      ownershipScore: 86,
      resaleScore: 85,
      citySuitability: 9,
      highwaySuitability: 8,
      familySuitability: 9,
      valueForMoneyScore: 88
    };

    const ownership = OWNERSHIP_PROFILES_DB[modelId] || {
      modelId,
      annualMaintenanceEstRs: 10000,
      annualInsuranceEstRs: 35000,
      warrantyYears: 3,
      warrantyKm: 100000,
      serviceIntervalMonths: 12,
      serviceIntervalKm: 10000,
      partsAvailabilityScore: 90,
      serviceNetworkScore: 90
    };

    const resale = RESALE_PROFILES_DB[modelId] || {
      modelId,
      resaleAfter1YearPercent: 82,
      resaleAfter3YearsPercent: 72,
      resaleAfter5YearsPercent: 60,
      annualDepreciationRatePct: 8.0,
      resaleConfidence: 'Medium'
    };

    const defaultVariant = variants[0];
    const featuresMap: Record<string, FeatureStatus> = {};
    if (defaultVariant) {
      VARIANT_FEATURES_DB.filter(vf => vf.variantId === defaultVariant.id).forEach(vf => {
        featuresMap[vf.featureId] = vf.status;
      });
    }

    return {
      model,
      brand,
      variants,
      safety,
      scores,
      ownership,
      resale,
      featuresMap
    };
  },

  // DATABASE HEALTH & ROUTE VALIDATION AUDIT REPORT
  getDatabaseHealthReport(): DatabaseHealthReport {
    const brands = this.getAllBrands();
    const models = MODELS_DB.filter(m => m.active);
    const variants = VARIANTS_DB.filter(v => v.active);

    const currentModelsCount = models.filter(m => m.marketStatus === 'current').length;
    const discontinuedModelsCount = models.filter(m => m.marketStatus === 'discontinued').length;
    const upcomingModelsCount = models.filter(m => m.marketStatus === 'upcoming').length;
    const totalEVs = models.filter(m => m.availableFuelTypes.includes('Electric')).length;

    const missingImagesCount = models.filter(m => !m.heroImage).length;
    const missingPricingCount = models.filter(m => m.startingPriceLakhs <= 0).length;
    const missingSpecificationsCount = models.filter(m => !m.description).length;

    // Route & Slug Audit
    const seenCanonicalRoutes = new Set<string>();
    const routeErrors: string[] = [];
    let validRoutesCount = 0;
    let duplicateSlugsCount = 0;

    models.forEach(m => {
      const brand = this.getBrandById(m.brandId);
      if (!brand) {
        routeErrors.push(`Model ${m.name} (${m.id}) has invalid brandId ${m.brandId}`);
        return;
      }
      const bSlug = getCanonicalBrandSlug(brand.name);
      const mSlug = getCanonicalModelSlug(m.name, brand.name);
      const route = getVehicleCanonicalRoute(brand.name, m.name, mSlug, bSlug);

      if (seenCanonicalRoutes.has(route)) {
        duplicateSlugsCount++;
        routeErrors.push(`Duplicate canonical route detected: ${route}`);
      } else {
        seenCanonicalRoutes.add(route);
        validRoutesCount++;
      }
    });

    const dataHealthScore = Math.max(0, 100 - (missingImagesCount * 5 + missingPricingCount * 5 + duplicateSlugsCount * 10));

    return {
      totalBrands: brands.length,
      totalModels: models.length,
      totalVariants: variants.length,
      totalEVs,
      currentModelsCount,
      discontinuedModelsCount,
      upcomingModelsCount,
      missingImagesCount,
      missingPricingCount,
      missingSpecificationsCount,
      dataHealthScore,
      routeValidation: {
        totalRoutesTested: models.length,
        validRoutesCount,
        duplicateSlugsCount,
        errors: routeErrors
      }
    };
  }
};
