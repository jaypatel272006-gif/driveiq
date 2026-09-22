import { vehicleDb } from '../data/db/vehicleDatabase';

export interface ValidationReport {
  isValid: boolean;
  totalBrandsChecked: number;
  totalModelsChecked: number;
  totalVariantsChecked: number;
  errors: string[];
  warnings: string[];
}

export function validateVehicleDatabase(): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const brands = vehicleDb.getAllBrands();
  const models = vehicleDb.getAllModels();

  let totalVariants = 0;

  // Validate Models & Foreign Keys
  models.forEach(model => {
    const brand = vehicleDb.getBrandById(model.brandId);
    if (!brand) {
      errors.push(`Model "${model.name}" (${model.id}) references invalid brandId: "${model.brandId}"`);
    }

    if (model.startingPriceLakhs <= 0) {
      errors.push(`Model "${model.name}" has invalid non-positive starting price: ₹${model.startingPriceLakhs}L`);
    }

    if (model.endingPriceLakhs < model.startingPriceLakhs) {
      errors.push(`Model "${model.name}" ending price (₹${model.endingPriceLakhs}L) is lower than starting price (₹${model.startingPriceLakhs}L)`);
    }

    if (model.seatingCapacity <= 0 || model.seatingCapacity > 10) {
      errors.push(`Model "${model.name}" has unrealistic seating capacity: ${model.seatingCapacity}`);
    }

    const variants = vehicleDb.getVariantsByModelId(model.id);
    totalVariants += variants.length;

    if (variants.length === 0) {
      warnings.push(`Model "${model.name}" currently has 0 defined variant trims.`);
    }

    variants.forEach(variant => {
      if (variant.price.exShowroomPriceLakhs <= 0) {
        errors.push(`Variant "${variant.name}" (${variant.id}) has invalid ex-showroom price.`);
      }

      if (variant.specifications.powerBhp <= 0) {
        errors.push(`Variant "${variant.name}" has invalid power figure: ${variant.specifications.powerBhp} PS`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    totalBrandsChecked: brands.length,
    totalModelsChecked: models.length,
    totalVariantsChecked: totalVariants,
    errors,
    warnings
  };
}
