import { VariantFeatureAssignment } from '../../types/database';

export const VARIANT_FEATURES_DB: VariantFeatureAssignment[] = [
  // Creta EX
  { variantId: 'var-creta-ex', featureId: 'feat-auto-ac', status: 'standard' },
  { variantId: 'var-creta-ex', featureId: 'feat-sunroof', status: 'unavailable' },
  { variantId: 'var-creta-ex', featureId: 'feat-vent-seats', status: 'unavailable' },
  { variantId: 'var-creta-ex', featureId: 'feat-adas-l2', status: 'unavailable' },
  { variantId: 'var-creta-ex', featureId: 'feat-airbags-6', status: 'standard' },

  // Creta S(O) IVT
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-auto-ac', status: 'standard' },
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-sunroof', status: 'standard' },
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-vent-seats', status: 'unavailable' },
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-adas-l2', status: 'unavailable' },
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-wireless-charger', status: 'standard' },
  { variantId: 'var-creta-s-o-ivt', featureId: 'feat-airbags-6', status: 'standard' },

  // Creta SX Tech ADAS
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-auto-ac', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-sunroof', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-vent-seats', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-adas-l2', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-camera-360', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-bose-audio', status: 'standard' },
  { variantId: 'var-creta-sx-tech-adas', featureId: 'feat-airbags-6', status: 'standard' }
];
