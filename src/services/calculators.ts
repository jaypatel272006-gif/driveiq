import { Vehicle, OwnershipCalculation, EMICalculation } from '../types/car';

// 1. Total Cost of Ownership Calculator (3, 5, 7 Years)
export function calculateOwnershipCost(
  vehicle: Vehicle,
  purchasePriceRs: number,
  annualKm: number = 15000,
  yearsOwned: number = 5,
  fuelPriceRsPerLiter: number = 96.7
): OwnershipCalculation {
  const isEV = vehicle.fuelTypes.includes('Electric');
  const isCNG = vehicle.fuelTypes.includes('CNG');

  // Fuel / Energy Calculation
  let annualFuelCostRs = 0;
  if (isEV) {
    // EV assumption: ~15 kWh per 100 km @ ₹8 per kWh domestic charging
    const kwhPerYear = (annualKm / 100) * 15;
    annualFuelCostRs = kwhPerYear * 8;
  } else if (isCNG) {
    // CNG assumption: ~25 km/kg @ ₹76 per kg
    annualFuelCostRs = (annualKm / 26) * 76;
  } else {
    // Petrol/Diesel: avg mileage 15 km/l
    const avgMileage = vehicle.variants[0]?.mileageKmpl || 16;
    annualFuelCostRs = (annualKm / avgMileage) * fuelPriceRsPerLiter;
  }

  const totalFuelCostRs = Math.round(annualFuelCostRs * yearsOwned);

  // Maintenance Calculation
  const baseAnnualMaint = vehicle.annualMaintenanceEstRs || 10000;
  let totalMaintenanceRs = 0;
  for (let yr = 1; yr <= yearsOwned; yr++) {
    // Maintenance increases slightly as car ages
    totalMaintenanceRs += baseAnnualMaint * Math.pow(1.08, yr - 1);
  }
  totalMaintenanceRs = Math.round(totalMaintenanceRs);

  // Insurance Calculation (Depreciating IDV each year)
  const baseInsurance = vehicle.annualInsuranceEstRs || 35000;
  let totalInsuranceRs = 0;
  for (let yr = 1; yr <= yearsOwned; yr++) {
    totalInsuranceRs += baseInsurance * Math.pow(0.88, yr - 1);
  }
  totalInsuranceRs = Math.round(totalInsuranceRs);

  // Taxes & Registration
  const totalTaxesRs = Math.round(purchasePriceRs * 0.12); // ~12% RTO

  // Depreciation / Resale Value Calculation
  // Standard depreciation curve: Year 1: 15%, Year 2: 25%, Year 3: 35%, Year 5: 45-50%, Year 7: 60%
  const retentionPercent = yearsOwned === 3 ? 0.72 : yearsOwned === 5 ? (vehicle.resaleValue5YrPercent / 100) : 0.42;
  const depreciatedResaleRs = Math.round(purchasePriceRs * retentionPercent);

  // Net Ownership Cost = Purchase + Fuel + Maintenance + Insurance + Taxes - Resale Value
  const netOwnershipCostRs = Math.round((purchasePriceRs + totalFuelCostRs + totalMaintenanceRs + totalInsuranceRs + totalTaxesRs) - depreciatedResaleRs);
  const totalKm = annualKm * yearsOwned;
  const costPerKmRs = Number((netOwnershipCostRs / totalKm).toFixed(2));
  const monthlyCostRs = Math.round(netOwnershipCostRs / (yearsOwned * 12));

  return {
    years: yearsOwned,
    purchasePriceRs,
    totalFuelCostRs,
    totalMaintenanceRs,
    totalInsuranceRs,
    totalTaxesRs,
    depreciatedResaleRs,
    netOwnershipCostRs,
    costPerKmRs,
    monthlyCostRs
  };
}

// 2. Finance Studio EMI Calculator
export function calculateEMI(
  carPriceRs: number,
  downPaymentRs: number,
  annualInterestRate: number = 8.8,
  loanTenureMonths: number = 60,
  userMonthlyIncomeRs?: number
): EMICalculation {
  const loanAmountRs = Math.max(0, carPriceRs - downPaymentRs);
  
  if (loanAmountRs === 0) {
    return {
      carPriceRs,
      downPaymentRs,
      loanAmountRs: 0,
      annualInterestRate,
      loanTenureMonths,
      monthlyEmiRs: 0,
      totalInterestRs: 0,
      totalRepaymentRs: 0,
      principalRatioPercent: 100,
      affordabilityStatus: 'Comfortable'
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = (loanAmountRs * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) / 
              (Math.pow(1 + monthlyRate, loanTenureMonths) - 1);
  
  const monthlyEmiRs = Math.round(emi);
  const totalRepaymentRs = Math.round(monthlyEmiRs * loanTenureMonths);
  const totalInterestRs = Math.round(totalRepaymentRs - loanAmountRs);
  const principalRatioPercent = Math.round((loanAmountRs / totalRepaymentRs) * 100);

  let affordabilityStatus: 'Comfortable' | 'Stretch' | 'High Risk' = 'Comfortable';
  if (userMonthlyIncomeRs && userMonthlyIncomeRs > 0) {
    const emiRatio = monthlyEmiRs / userMonthlyIncomeRs;
    if (emiRatio <= 0.20) affordabilityStatus = 'Comfortable';
    else if (emiRatio <= 0.35) affordabilityStatus = 'Stretch';
    else affordabilityStatus = 'High Risk';
  }

  return {
    carPriceRs,
    downPaymentRs,
    loanAmountRs,
    annualInterestRate,
    loanTenureMonths,
    monthlyEmiRs,
    totalInterestRs,
    totalRepaymentRs,
    principalRatioPercent,
    affordabilityStatus
  };
}

// 3. Multi-Fuel Running Cost Calculator
export interface FuelComparisonItem {
  fuelType: string;
  monthlyCostRs: number;
  annualCostRs: number;
  threeYearCostRs: number;
  fiveYearCostRs: number;
  costPerKmRs: number;
}

export function calculateFuelComparison(
  monthlyKm: number = 1500,
  petrolPriceRs: number = 96.7,
  dieselPriceRs: number = 89.6,
  cngPriceRs: number = 76.5,
  evKwhPriceRs: number = 8.5
): FuelComparisonItem[] {
  const annualKm = monthlyKm * 12;

  // Petrol (15 km/l)
  const petrolMonthlyCost = Math.round((monthlyKm / 15) * petrolPriceRs);
  // Diesel (18 km/l)
  const dieselMonthlyCost = Math.round((monthlyKm / 18) * dieselPriceRs);
  // CNG (25 km/kg)
  const cngMonthlyCost = Math.round((monthlyKm / 25) * cngPriceRs);
  // EV (15 kWh/100km -> 0.15 kWh/km)
  const evMonthlyCost = Math.round(monthlyKm * 0.15 * evKwhPriceRs);

  return [
    {
      fuelType: 'Electric (EV)',
      monthlyCostRs: evMonthlyCost,
      annualCostRs: evMonthlyCost * 12,
      threeYearCostRs: evMonthlyCost * 36,
      fiveYearCostRs: evMonthlyCost * 60,
      costPerKmRs: Number((evMonthlyCost / monthlyKm).toFixed(2))
    },
    {
      fuelType: 'CNG',
      monthlyCostRs: cngMonthlyCost,
      annualCostRs: cngMonthlyCost * 12,
      threeYearCostRs: cngMonthlyCost * 36,
      fiveYearCostRs: cngMonthlyCost * 60,
      costPerKmRs: Number((cngMonthlyCost / monthlyKm).toFixed(2))
    },
    {
      fuelType: 'Diesel',
      monthlyCostRs: dieselMonthlyCost,
      annualCostRs: dieselMonthlyCost * 12,
      threeYearCostRs: dieselMonthlyCost * 36,
      fiveYearCostRs: dieselMonthlyCost * 60,
      costPerKmRs: Number((dieselMonthlyCost / monthlyKm).toFixed(2))
    },
    {
      fuelType: 'Petrol',
      monthlyCostRs: petrolMonthlyCost,
      annualCostRs: petrolMonthlyCost * 12,
      threeYearCostRs: petrolMonthlyCost * 36,
      fiveYearCostRs: petrolMonthlyCost * 60,
      costPerKmRs: Number((petrolMonthlyCost / monthlyKm).toFixed(2))
    }
  ];
}

// 4. Resale Predictor Curve
export interface ResaleCurveYear {
  year: number;
  retentionPercentage: number;
  estimatedValueLakhs: number;
  minEstimatedValueLakhs: number;
  maxEstimatedValueLakhs: number;
}

export function predictResaleValue(
  vehicle: Vehicle,
  purchasePriceLakhs: number,
  annualKm: number = 12000,
  conditionMultiplier: number = 1.0 // 1.05 Excellent, 1.0 Good, 0.9 Fair
): ResaleCurveYear[] {
  // Base depreciation rates: Year 1: 15%, Year 2: 24%, Year 3: 32%, Year 4: 39%, Year 5: 46%, Year 6: 53%, Year 7: 60%
  const baseRetention = [1.0, 0.85, 0.76, 0.68, 0.61, 0.54, 0.47, 0.40];

  // Adjust for high/low annual mileage (>18k lowers resale, <10k improves resale)
  const kmModifier = annualKm > 18000 ? 0.94 : annualKm < 9000 ? 1.04 : 1.0;

  return baseRetention.map((ret, yr) => {
    if (yr === 0) {
      return {
        year: 0,
        retentionPercentage: 100,
        estimatedValueLakhs: purchasePriceLakhs,
        minEstimatedValueLakhs: purchasePriceLakhs,
        maxEstimatedValueLakhs: purchasePriceLakhs
      };
    }

    let retPct = Math.round(ret * conditionMultiplier * kmModifier * 100);
    // vehicle specific resale boost
    if (vehicle.resaleScore >= 90) retPct = Math.min(95, retPct + 3);

    const estVal = Number(((purchasePriceLakhs * retPct) / 100).toFixed(2));
    const minVal = Number((estVal * 0.95).toFixed(2));
    const maxVal = Number((estVal * 1.05).toFixed(2));

    return {
      year: yr,
      retentionPercentage: retPct,
      estimatedValueLakhs: estVal,
      minEstimatedValueLakhs: minVal,
      maxEstimatedValueLakhs: maxVal
    };
  });
}
