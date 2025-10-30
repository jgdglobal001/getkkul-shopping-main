export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  discountPercentage: string;
  rating: string;
  stock: string;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  detailImages: string[];
  tags: string[];
  sku: string;
  isActive: boolean;
  availabilityStatus: string;
  minimumOrderQuantity: string;
  productName: string;
  modelNumber: string;
  size: string;
  material: string;
  releaseDate: string;
  manufacturer: string;
  madeInCountry: string;
  warrantyStandard: string;
  asResponsible: string;
  kcCertification: string;
  color: string;
  productComposition: string;
  detailedSpecs: string;
  shippingMethod: string;
  shippingCost: string;
  bundleShipping: string;
  shippingPeriod: string;
  exchangeReturnCost: string;
  exchangeReturnDeadline: string;
  exchangeReturnLimitations: string;
  clothingLimitations: string;
  foodLimitations: string;
  electronicsLimitations: string;
  autoLimitations: string;
  mediaLimitations: string;
  sellerName: string;
  sellerPhone: string;
  sellerLegalNotice: string;
}

export interface TemplateData {
  name: string;
  productName?: string;
  modelNumber?: string;
  size?: string;
  material?: string;
  releaseDate?: string;
  manufacturer?: string;
  madeInCountry?: string;
  warrantyStandard?: string;
  asResponsible?: string;
  kcCertification?: string;
  color?: string;
  productComposition?: string;
  detailedSpecs?: string;
  shippingMethod: string;
  shippingCost: string;
  bundleShipping: string;
  shippingPeriod: string;
  exchangeReturnCost: string;
  exchangeReturnDeadline: string;
  exchangeReturnLimitations: string;
  clothingLimitations?: string;
  foodLimitations?: string;
  electronicsLimitations?: string;
  autoLimitations?: string;
  mediaLimitations?: string;
  sellerName: string;
  sellerPhone: string;
  sellerLegalNotice: string;
}

export interface ProductFormClientProps {
  mode: "create" | "edit";
  productId?: string;
}