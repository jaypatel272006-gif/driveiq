import { Vehicle, UserProfile, RecommendationResult, ScoreBreakdown, PriorityCategory } from '../types/car';
import { vehicleDb } from '../data/db/vehicleDatabase';

export function calculateRecommendation(vehicle: Vehicle, profile: UserProfile): RecommendationResult {
  const complete = vehicleDb.getCompleteVehicleDataByModelId(vehicle.id);
  const scores = complete?.scores || {
    safetyScore: vehicle.safetyScore,
    comfortScore: vehicle.comfortScore,
    performanceScore: vehicle.performanceScore,
    featureScore: vehicle.featureScore,
    reliabilityScore: vehicle.reliabilityScore,
    maintenanceScore: vehicle.maintenanceScore,
    ownershipScore: 88,
    resaleScore: vehicle.resaleScore,
    citySuitability: vehicle.citySuitability,
    highwaySuitability: vehicle.highwaySuitability,
    familySuitability: vehicle.familySuitability,
    valueForMoneyScore: 88
  };

  // 1. Budget Fit Score (0 - 100)
  let budgetFit = 100;
  const startPrice = vehicle.startingPriceLakhs;
  const userBudget = profile.budgetLakhs;

  if (startPrice <= userBudget && vehicle.maxPriceLakhs >= userBudget * 0.8) {
    budgetFit = 100;
  } else if (startPrice <= userBudget * 1.15) {
    budgetFit = Math.max(50, 100 - Math.round(((startPrice - userBudget) / userBudget) * 200));
  } else if (startPrice > userBudget * 1.15) {
    budgetFit = Math.max(10, 100 - Math.round(((startPrice - userBudget) / userBudget) * 300));
  } else {
    budgetFit = 92; // Slightly under budget
  }

  // 2. Fuel Fit Score (0 - 100)
  let fuelFit = 100;
  if (profile.fuelPreference !== "Doesn't matter") {
    if (vehicle.fuelTypes.includes(profile.fuelPreference)) {
      fuelFit = 100;
    } else if (profile.fuelPreference === 'Hybrid' && vehicle.fuelTypes.includes('Petrol')) {
      fuelFit = 75;
    } else if (profile.fuelPreference === 'Electric' && !vehicle.fuelTypes.includes('Electric')) {
      fuelFit = 20;
    } else {
      fuelFit = 40;
    }
  }

  // 3. Transmission Fit Score (0 - 100)
  let transmissionFit = 100;
  if (profile.transmissionPreference !== "Doesn't matter") {
    if (profile.transmissionPreference === 'Any Automatic') {
      const hasAuto = vehicle.transmissions.some(t => t !== 'Manual');
      transmissionFit = hasAuto ? 100 : 30;
    } else {
      const hasExact = vehicle.transmissions.includes(profile.transmissionPreference);
      transmissionFit = hasExact ? 100 : (vehicle.transmissions.some(t => t !== 'Manual') ? 70 : 40);
    }
  }

  // 4. Environment / Usage Fit Score (City vs Highway vs Hills)
  const usageFit = Math.round(
    ((scores.citySuitability * 10 * profile.cityPercentage) +
     (scores.highwaySuitability * 10 * profile.highwayPercentage) +
     (scores.familySuitability * 10 * profile.hillsPercentage)) / 100
  );

  // 5. Family & Boot Practicality Fit (0 - 100)
  let familyFit = 100;
  if (vehicle.seatingCapacity < profile.familySize) {
    familyFit = 30;
  } else if (vehicle.seatingCapacity === profile.familySize) {
    familyFit = 95;
  } else {
    familyFit = 100;
  }

  const reqLiters = profile.bootRequirement === 'Small' ? 300
    : profile.bootRequirement === 'Medium' ? 370
    : profile.bootRequirement === 'Large' ? 430 : 480;

  if (vehicle.bootSpaceLiters < reqLiters) {
    familyFit = Math.max(40, familyFit - 20);
  }

  // 6. Running Cost Fit (based on monthly KM & fuel efficiency)
  let runningCostFit = 80;
  if (vehicle.fuelTypes.includes('Electric')) {
    runningCostFit = 98;
  } else if (vehicle.fuelTypes.includes('Hybrid') || vehicle.fuelTypes.includes('CNG')) {
    runningCostFit = 92;
  } else if (vehicle.fuelTypes.includes('Diesel')) {
    runningCostFit = 85;
  } else {
    runningCostFit = 72;
  }

  // Sub-scores
  const safetyFit = scores.safetyScore;
  const comfortFit = scores.comfortScore;
  const performanceFit = scores.performanceScore;
  const reliabilityFit = scores.reliabilityScore;
  const resaleFit = scores.resaleScore;

  const scoreBreakdown: ScoreBreakdown = {
    budgetFit,
    fuelFit,
    transmissionFit,
    usageFit,
    familyFit,
    safetyFit,
    comfortFit,
    performanceFit,
    runningCostFit,
    reliabilityFit,
    resaleFit
  };

  // Dynamic Priority Weights Mapping
  const priorityWeights: Record<PriorityCategory, number> = {
    'Safety': 1.0,
    'Mileage': 1.0,
    'Performance': 1.0,
    'Comfort': 1.0,
    'Features': 1.0,
    'Space': 1.0,
    'Reliability': 1.0,
    'Maintenance': 1.0,
    'Resale': 1.0,
    'Looks': 1.0,
    'Driving Experience': 1.0,
    'Technology': 1.0
  };

  profile.priorities.forEach((p, idx) => {
    const weightMultiplier = Math.max(1.1, 2.5 - (idx * 0.15));
    if (priorityWeights[p] !== undefined) {
      priorityWeights[p] = weightMultiplier;
    }
  });

  // Calculate Weighted Match Sum
  let totalScore = 0;
  let totalWeight = 0;

  const components = [
    { value: budgetFit, weight: 2.2 },
    { value: fuelFit, weight: 1.8 },
    { value: transmissionFit, weight: 1.6 },
    { value: usageFit, weight: 1.5 },
    { value: familyFit, weight: 1.4 },
    { value: safetyFit, weight: priorityWeights['Safety'] },
    { value: runningCostFit, weight: priorityWeights['Mileage'] },
    { value: performanceFit, weight: priorityWeights['Performance'] },
    { value: comfortFit, weight: priorityWeights['Comfort'] },
    { value: scores.featureScore, weight: priorityWeights['Features'] },
    { value: reliabilityFit, weight: priorityWeights['Reliability'] },
    { value: resaleFit, weight: priorityWeights['Resale'] },
  ];

  components.forEach(c => {
    totalScore += c.value * c.weight;
    totalWeight += c.weight;
  });

  const finalMatchPercent = Math.min(99, Math.max(45, Math.round(totalScore / totalWeight)));

  // Dynamic Score Ring Color
  let matchRingColor = '#06b6d4';
  if (finalMatchPercent >= 90) matchRingColor = '#10b981'; // Emerald
  else if (finalMatchPercent >= 80) matchRingColor = '#06b6d4'; // Cyan
  else if (finalMatchPercent >= 70) matchRingColor = '#3b82f6'; // Blue
  else matchRingColor = '#f59e0b'; // Amber

  // Why We Recommend List
  const whyRecommend: string[] = [];
  if (budgetFit >= 90) whyRecommend.push(`Fits within your ₹${profile.budgetLakhs} Lakh target budget`);
  if (safetyFit >= 90) whyRecommend.push(`Outstanding ${vehicle.ncapRating}-Star safety rating for family protection`);
  if (usageFit >= 85) whyRecommend.push(`Optimized for your ${profile.cityPercentage}% City / ${profile.highwayPercentage}% Highway driving pattern`);
  if (runningCostFit >= 85) whyRecommend.push(`Ultra-efficient running economics for your ${profile.monthlyKm} km monthly distance`);
  if (resaleFit >= 88) whyRecommend.push(`High 5-year resale value retention (${vehicle.resaleValue5YrPercent}%)`);
  if (whyRecommend.length < 3) whyRecommend.push(`High family practicality with ${vehicle.bootSpaceLiters}L boot space`);

  // Things to Consider List
  const thingsToConsider: string[] = [];
  if (vehicle.ncapRating < 4) thingsToConsider.push(`Safety rating is ${vehicle.ncapRating}-Star GNCAP; top trim required for ADAS`);
  if (startPrice > profile.budgetLakhs) thingsToConsider.push(`Starting price is slightly above your target ₹${profile.budgetLakhs}L budget`);
  if (vehicle.bootSpaceLiters < reqLiters) thingsToConsider.push(`Boot capacity (${vehicle.bootSpaceLiters}L) is tighter than your ${profile.bootRequirement} requirement`);
  if (scores.maintenanceScore < 80) thingsToConsider.push(`Annual maintenance costs are slightly higher than class average`);
  if (thingsToConsider.length === 0) thingsToConsider.push(`Higher trim levels required to unlock full feature potential`);

  return {
    vehicle,
    matchPercentage: finalMatchPercent,
    matchRingColor,
    scoreBreakdown,
    whyRecommend,
    thingsToConsider
  };
}

export function rankVehicles(vehicles: Vehicle[], profile: UserProfile): RecommendationResult[] {
  const results = vehicles.map(v => calculateRecommendation(v, profile));
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
