import { ResaleProfile } from '../../types/database';

export const RESALE_PROFILES_DB: Record<string, ResaleProfile> = {
  'model-creta': {
    modelId: 'model-creta',
    resaleAfter1YearPercent: 85,
    resaleAfter3YearsPercent: 76,
    resaleAfter5YearsPercent: 66,
    annualDepreciationRatePct: 7.5,
    resaleConfidence: 'High'
  },
  'model-nexon-ev': {
    modelId: 'model-nexon-ev',
    resaleAfter1YearPercent: 80,
    resaleAfter3YearsPercent: 68,
    resaleAfter5YearsPercent: 55,
    annualDepreciationRatePct: 9.0,
    resaleConfidence: 'Medium'
  },
  'model-xuv700': {
    modelId: 'model-xuv700',
    resaleAfter1YearPercent: 86,
    resaleAfter3YearsPercent: 75,
    resaleAfter5YearsPercent: 64,
    annualDepreciationRatePct: 7.8,
    resaleConfidence: 'High'
  }
};
