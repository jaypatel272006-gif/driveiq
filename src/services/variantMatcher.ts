import { Vehicle, Variant } from '../types/car';

export interface DesiredFeatureSelection {
  sunroof?: boolean;
  adas?: boolean;
  ventilatedSeats?: boolean;
  camera360?: boolean;
  wirelessCharger?: boolean;
  autoAC?: boolean;
  minAirbags?: number;
  automatic?: boolean;
}

export interface VariantMatchResult {
  recommendedVariant: Variant;
  matchScore: number;
  includedFeatures: string[];
  missingFeatures: string[];
  whyRecommended: string;
  cheapestAlternative?: Variant;
  fullyLoadedAlternative?: Variant;
}

export function matchVehicleVariant(
  vehicle: Vehicle,
  desires: DesiredFeatureSelection,
  userBudgetLakhs?: number
): VariantMatchResult {
  const variants = vehicle.variants;
  if (!variants || variants.length === 0) {
    throw new Error(`No variants found for ${vehicle.name}`);
  }

  // Score each variant against desired features
  const scoredVariants = variants.map(v => {
    let score = 100;
    const included: string[] = [];
    const missing: string[] = [];

    if (desires.sunroof) {
      if (v.hasSunroof) included.push('Panoramic/Electric Sunroof');
      else { missing.push('Sunroof'); score -= 20; }
    }
    if (desires.adas) {
      if (v.hasADAS) included.push('Level-2 ADAS');
      else { missing.push('Level-2 ADAS'); score -= 30; }
    }
    if (desires.ventilatedSeats) {
      if (v.hasVentilatedSeats) included.push('Ventilated Front Seats');
      else { missing.push('Ventilated Seats'); score -= 15; }
    }
    if (desires.camera360) {
      if (v.has360Camera) included.push('360 Surround View Camera');
      else { missing.push('360 Camera'); score -= 15; }
    }
    if (desires.wirelessCharger) {
      if (v.hasWirelessCharger) included.push('Wireless Charger');
      else { missing.push('Wireless Charger'); score -= 10; }
    }
    if (desires.autoAC) {
      if (v.hasAutoAC) included.push('Automatic Climate Control');
      else { missing.push('Automatic AC'); score -= 10; }
    }
    if (desires.minAirbags && desires.minAirbags > 0) {
      if (v.airbagCount >= desires.minAirbags) included.push(`${v.airbagCount} Airbags`);
      else { missing.push(`Requires ${desires.minAirbags} Airbags (Has ${v.airbagCount})`); score -= 20; }
    }
    if (desires.automatic) {
      if (v.transmission !== 'Manual') included.push(`Automatic (${v.transmission})`);
      else { missing.push('Automatic Transmission'); score -= 35; }
    }

    // Budget Penalty if exceeds user budget
    if (userBudgetLakhs && v.priceLakhs > userBudgetLakhs) {
      const over = v.priceLakhs - userBudgetLakhs;
      score -= Math.round(over * 15);
    }

    return {
      variant: v,
      score: Math.max(10, score),
      included,
      missing
    };
  });

  // Sort by score descending
  scoredVariants.sort((a, b) => b.score - a.score);

  const best = scoredVariants[0];
  const sortedByPrice = [...variants].sort((a, b) => a.priceLakhs - b.priceLakhs);
  const cheapest = sortedByPrice[0];
  const fullyLoaded = sortedByPrice[sortedByPrice.length - 1];

  let whyRec = `${best.variant.name} offers the best balance of your desired features (${best.included.join(', ')}) at ₹${best.variant.priceLakhs} Lakhs.`;
  if (userBudgetLakhs && best.variant.priceLakhs <= userBudgetLakhs) {
    whyRec += ` It fits within your target ₹${userBudgetLakhs} Lakh budget.`;
  }

  return {
    recommendedVariant: best.variant,
    matchScore: Math.min(100, Math.max(30, best.score)),
    includedFeatures: best.included,
    missingFeatures: best.missing,
    whyRecommended: whyRec,
    cheapestAlternative: cheapest.id !== best.variant.id ? cheapest : undefined,
    fullyLoadedAlternative: fullyLoaded.id !== best.variant.id ? fullyLoaded : undefined
  };
}
