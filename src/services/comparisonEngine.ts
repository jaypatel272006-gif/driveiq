import { Vehicle, UserProfile } from '../types/car';

export interface CategoryWinner {
  category: string;
  winningVehicleId: string;
  winningVehicleName: string;
  reason: string;
}

export interface ComparisonAnalysis {
  vehicles: Vehicle[];
  winners: CategoryWinner[];
  aiVerdict: string;
  bestOverallVehicleId: string;
}

export function compareVehicles(vehicles: Vehicle[], profile?: UserProfile): ComparisonAnalysis {
  if (vehicles.length === 0) {
    return {
      vehicles: [],
      winners: [],
      aiVerdict: 'Select up to 3 vehicles to perform side-by-side comparison.',
      bestOverallVehicleId: ''
    };
  }

  const winners: CategoryWinner[] = [];

  // Safety Winner
  const safetySorted = [...vehicles].sort((a, b) => b.safetyScore - a.safetyScore);
  winners.push({
    category: 'Safety',
    winningVehicleId: safetySorted[0].id,
    winningVehicleName: safetySorted[0].name,
    reason: `${safetySorted[0].ncapRating}-Star rated (${safetySorted[0].ncapTestAgency}) with high structural integrity.`
  });

  // Performance Winner
  const perfSorted = [...vehicles].sort((a, b) => b.performanceScore - a.performanceScore);
  winners.push({
    category: 'Performance',
    winningVehicleId: perfSorted[0].id,
    winningVehicleName: perfSorted[0].name,
    reason: `Highest power output and dynamic highway responsiveness (Score: ${perfSorted[0].performanceScore}/100).`
  });

  // Comfort Winner
  const comfortSorted = [...vehicles].sort((a, b) => b.comfortScore - a.comfortScore);
  winners.push({
    category: 'Comfort & Space',
    winningVehicleId: comfortSorted[0].id,
    winningVehicleName: comfortSorted[0].name,
    reason: `Best cabin noise insulation, suspension compliance, and rear seat room (Score: ${comfortSorted[0].comfortScore}/100).`
  });

  // Running Cost / Efficiency Winner
  const maintSorted = [...vehicles].sort((a, b) => b.maintenanceScore - a.maintenanceScore);
  winners.push({
    category: 'Running Economics',
    winningVehicleId: maintSorted[0].id,
    winningVehicleName: maintSorted[0].name,
    reason: `Lowest annual maintenance expenditure (~₹${maintSorted[0].annualMaintenanceEstRs.toLocaleString()}/yr) and high fuel efficiency.`
  });

  // Resale Winner
  const resaleSorted = [...vehicles].sort((a, b) => b.resaleScore - a.resaleScore);
  winners.push({
    category: 'Resale Retention',
    winningVehicleId: resaleSorted[0].id,
    winningVehicleName: resaleSorted[0].name,
    reason: `Highest 5-year resale value retention (${resaleSorted[0].resaleValue5YrPercent}%).`
  });

  // Best overall determination
  let bestOverallVehicleId = vehicles[0].id;
  let aiVerdict = '';

  if (profile) {
    // Top priority check
    const topPriority = profile.priorities[0] || 'Safety';
    if (topPriority === 'Safety') bestOverallVehicleId = safetySorted[0].id;
    else if (topPriority === 'Performance') bestOverallVehicleId = perfSorted[0].id;
    else if (topPriority === 'Comfort') bestOverallVehicleId = comfortSorted[0].id;
    else if (topPriority === 'Maintenance' || topPriority === 'Mileage') bestOverallVehicleId = maintSorted[0].id;
    else if (topPriority === 'Resale') bestOverallVehicleId = resaleSorted[0].id;
    else bestOverallVehicleId = vehicles[0].id;

    const bestVehicle = vehicles.find(v => v.id === bestOverallVehicleId) || vehicles[0];
    aiVerdict = `Based on your profile priority of ${topPriority}, ${bestVehicle.name} emerges as the recommended choice among these ${vehicles.length} candidates. It balances your ₹${profile.budgetLakhs}L budget with category-winning ${topPriority.toLowerCase()} credentials.`;
  } else {
    bestOverallVehicleId = safetySorted[0].id;
    aiVerdict = `For buyers prioritizing safety and build quality, ${safetySorted[0].name} leads the comparison. If low operating cost and high resale are top priorities, ${maintSorted[0].name} is the strongest alternative.`;
  }

  return {
    vehicles,
    winners,
    aiVerdict,
    bestOverallVehicleId
  };
}
