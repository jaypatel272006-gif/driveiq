import { Vehicle, UserProfile } from '../types/car';
import { calculateRecommendation } from './recommendationEngine';

export interface WhyThisCarExplanation {
  userSummary: string;
  matchHighlights: string[];
  competitorComparison: string;
  tradeOffs: string[];
  detailedVerdict: string;
}

export function generateWhyThisCarExplanation(
  vehicle: Vehicle,
  profile: UserProfile,
  competitor?: Vehicle
): WhyThisCarExplanation {
  const result = calculateRecommendation(vehicle, profile);

  const topPriority = profile.priorities[0] || 'Safety';
  const secondPriority = profile.priorities[1] || 'Mileage';

  const userSummary = `You requested a car within ₹${profile.budgetLakhs} Lakhs, preferring ${profile.fuelPreference} fuel and ${profile.transmissionPreference} transmission, for a family of ${profile.familySize} driving ${profile.monthlyKm} km/month (${profile.cityPercentage}% City / ${profile.highwayPercentage}% Highway). Your top priorities are ${topPriority} and ${secondPriority}.`;

  const avgMileage = vehicle.variants[0]?.mileageKmpl || 16;
  const mileageText = avgMileage > 100 ? `${avgMileage} km claimed range` : `${avgMileage} km/l efficiency`;

  const matchHighlights: string[] = [
    ...result.whyRecommend,
    `Scores ${vehicle.comfortScore}/100 in overall ride & cabin comfort for ${profile.familySize} passengers`,
    `Delivers ${mileageText}`
  ];

  let competitorComparison = '';
  if (competitor) {
    const competitorResult = calculateRecommendation(competitor, profile);
    const scoreDiff = result.matchPercentage - competitorResult.matchPercentage;

    if (scoreDiff >= 0) {
      competitorComparison = `${vehicle.name} (${result.matchPercentage}% match) scores higher than ${competitor.name} (${competitorResult.matchPercentage}% match) for your profile because it offers superior ${topPriority.toLowerCase()} alignment, better ${profile.fuelPreference.toLowerCase()} suitability, and lower long-term ownership friction.`;
    } else {
      competitorComparison = `While ${competitor.name} (${competitorResult.matchPercentage}% match) scores slightly higher overall, ${vehicle.name} (${result.matchPercentage}% match) remains a strong alternative if you value ${vehicle.brand}'s design aesthetic or specific feature offerings.`;
    }
  } else {
    competitorComparison = `${vehicle.name} outperforms category rivals for your specific profile by aligning tightly with your top-ranked priority of ${topPriority} while remaining within your financial ceiling.`;
  }

  const tradeOffs = [
    ...result.thingsToConsider,
    `Check on-road pricing for top variants as road taxes and insurance add ~12-15% above ex-showroom price`
  ];

  const detailedVerdict = `${vehicle.name} achieves a ${result.matchPercentage}% DriveIQ Match Score for your exact profile. It delivers an optimal balance between your requirement for ${profile.fuelPreference} driving and your family's comfort needs without exceeding your ₹${profile.budgetLakhs} Lakh budget threshold.`;

  return {
    userSummary,
    matchHighlights,
    competitorComparison,
    tradeOffs,
    detailedVerdict
  };
}
