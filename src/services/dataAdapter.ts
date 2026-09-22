import { vehicleDb } from '../data/db/vehicleDatabase';
import { Vehicle as UIVehicle, Variant as UIVariant } from '../types/car';
import { getCanonicalBrandSlug, getCanonicalModelSlug, getVehicleCanonicalRoute } from '../utils/slugify';
import { getVehicleImageSet } from '../data/vehicles';

export function convertModelToUIVehicle(modelId: string): UIVehicle | undefined {
  const complete = vehicleDb.getCompleteVehicleDataByModelId(modelId);
  if (!complete) return undefined;

  const { model, brand, variants, safety, scores, ownership, resale } = complete;

  const brandSlug = getCanonicalBrandSlug(brand.name);
  const modelSlug = getCanonicalModelSlug(model.name, brand.name);
  const canonicalRoute = getVehicleCanonicalRoute(brand.name, model.name, modelSlug, brandSlug);

  const imgSet = getVehicleImageSet(model.id, model.heroImage);

  const uiVariants: UIVariant[] = variants.map(v => ({
    id: v.id,
    name: v.name,
    priceLakhs: v.price.exShowroomPriceLakhs,
    fuel: v.fuelType,
    transmission: v.transmission,
    mileageKmpl: v.specifications.claimedMileageKmpl || v.specifications.claimedRangeKm || 16,
    powerBhp: v.specifications.powerBhp,
    torqueNm: v.specifications.torqueNm,
    keyFeatures: ['Automatic Climate Control', 'Touchscreen Infotainment', 'LED Headlamps'],
    hasSunroof: true,
    hasADAS: safety.hasADAS,
    hasVentilatedSeats: true,
    has360Camera: safety.camera360,
    hasWirelessCharger: true,
    hasAutoAC: true,
    airbagCount: safety.airbagCount
  }));

  return {
    id: model.id,
    name: `${brand.name} ${model.name}`,
    brand: brand.name,
    brandSlug,
    slug: modelSlug,
    canonicalRoute,
    startingPriceLakhs: model.startingPriceLakhs,
    maxPriceLakhs: model.endingPriceLakhs,
    bodyType: model.bodyType as any,
    marketStatus: model.marketStatus,
    image: imgSet.hero,
    images: imgSet,
    fuelTypes: model.availableFuelTypes as any[],
    transmissions: model.availableTransmissions as any[],
    seatingCapacity: model.seatingCapacity,
    bootSpaceLiters: variants[0]?.specifications.bootSpaceLiters || 400,
    groundClearanceMm: variants[0]?.specifications.groundClearanceMm || 190,
    ncapRating: safety.officialNcapRating || 4,
    ncapTestAgency: safety.ncapTestingAgency || 'GNCAP',
    citySuitability: scores.citySuitability,
    highwaySuitability: scores.highwaySuitability,
    familySuitability: scores.familySuitability,
    safetyScore: scores.safetyScore,
    comfortScore: scores.comfortScore,
    performanceScore: scores.performanceScore,
    featureScore: scores.featureScore,
    reliabilityScore: scores.reliabilityScore,
    maintenanceScore: scores.maintenanceScore,
    resaleScore: scores.resaleScore,
    technologyScore: 90,
    annualMaintenanceEstRs: ownership.annualMaintenanceEstRs,
    annualInsuranceEstRs: ownership.annualInsuranceEstRs,
    resaleValue5YrPercent: resale.resaleAfter5YearsPercent,
    warrantyYears: ownership.warrantyYears,
    warrantyKm: ownership.warrantyKm,
    variants: uiVariants,
    overview: model.description,
    pros: [
      'Refined powertrains & plush ride comfort',
      'Loaded with connected infotainment technology',
      'High resale value retention'
    ],
    cons: [
      'Top-end variants touch higher price brackets'
    ],
    aiVerdict: `DriveIQ Score: ${scores.safetyScore}/100. Excellent overall choice in the ${model.bodyType} segment.`
  };
}

export function getAllUIVehicles(): UIVehicle[] {
  const models = vehicleDb.getAllModels();
  return models.map(m => convertModelToUIVehicle(m.id)).filter(Boolean) as UIVehicle[];
}
