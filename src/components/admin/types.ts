// 옵션 정의 인터페이스
export interface OptionDefinition {
  name: string;      // 옵션명 (색상, 사이즈 등)
  values: string[];  // 옵션값 배열 (블랙, 화이트 등)
}

// 옵션 조합 (Variant) 인터페이스
export interface VariantData {
  id?: string;
  optionCombination: Record<string, string>; // {color: "블랙", size: "265"}
  sku: string;           // 판매자상품코드
  originalPrice: string; // 정상가
  price: string;         // 판매가
  stock: string;         // 재고
  image?: string;        // 옵션별 이미지
  barcode?: string;      // 상품 바코드
  modelNumber?: string;  // 모델번호
  isActive: boolean;
}

// 상품 폼 데이터 인터페이스
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
  // ⭐ 옵션 시스템
  hasOptions: boolean;           // 옵션 상품 여부
  optionCount: number;           // 옵션 개수 (1~3)
  options: OptionDefinition[];   // 옵션 정의
  variants: VariantData[];       // 옵션 조합별 데이터
  // 필수 표기 정보
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
  // 배송 정보
  shippingMethod: string;
  shippingCost: string;
  bundleShipping: string;
  shippingPeriod: string;
  // 교환/반품 정보
  exchangeReturnCost: string;
  exchangeReturnDeadline: string;
  exchangeReturnLimitations: string;
  clothingLimitations: string;
  foodLimitations: string;
  electronicsLimitations: string;
  autoLimitations: string;
  mediaLimitations: string;
  // 판매자 정보
  sellerName: string;
  sellerPhone: string;
  sellerLegalNotice: string;
}

// 템플릿 데이터 인터페이스
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

// 상품 폼 클라이언트 Props
export interface ProductFormClientProps {
  mode: "create" | "edit";
  productId?: string;
}

// 기본 제출 데이터 타입
export interface ProductSubmitData extends Omit<ProductFormData, 'price' | 'discountPercentage' | 'rating' | 'stock' | 'minimumOrderQuantity'> {
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  minimumOrderQuantity: number;
  weight?: null;
  dimensions?: null;
}