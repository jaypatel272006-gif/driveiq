import { DriveIQScores } from '../../types/database';

export const DRIVEIQ_SCORES_DB: Record<string, DriveIQScores> = {
  'model-creta': {
    safetyScore: 82,
    comfortScore: 92,
    performanceScore: 85,
    featureScore: 95,
    reliabilityScore: 88,
    maintenanceScore: 85,
    ownershipScore: 88,
    resaleScore: 92,
    citySuitability: 9,
    highwaySuitability: 8,
    familySuitability: 9,
    valueForMoneyScore: 89
  },
  'model-nexon-ev': {
    safetyScore: 98,
    comfortScore: 88,
    performanceScore: 92,
    featureScore: 92,
    reliabilityScore: 82,
    maintenanceScore: 96,
    ownershipScore: 92,
    resaleScore: 78,
    citySuitability: 10,
    highwaySuitability: 8,
    familySuitability: 9,
    valueForMoneyScore: 94
  },
  'model-xuv700': {
    safetyScore: 98,
    comfortScore: 95,
    performanceScore: 98,
    featureScore: 94,
    reliabilityScore: 84,
    maintenanceScore: 75,
    ownershipScore: 84,
    resaleScore: 88,
    citySuitability: 7,
    highwaySuitability: 10,
    familySuitability: 10,
    valueForMoneyScore: 91
  }
};
