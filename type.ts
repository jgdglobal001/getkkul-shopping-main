import { UserRole, OrderStatus } from "@/lib/rbac/roles";

type Review = {
  reviewerName: string;
  rating: number;
  comment: string;
  reviewerEmail: string;
};
export interface ProductType {
  availabilityStatus?: string | null;
  brand?: string | null;
  category: string;
  description: string;
  dimensions?: {
    depth?: number | null;
    height?: number | null;
    width?: number | null;
  } | null | any;
  discountPercentage: number | null;
  id: string | number;
  images: string[] | null;
  detailImages?: string[] | null;
  meta?: {
    createdAt?: string | null;
    updatedAt?: string | null;
    barcode?: string | null;
    qrCode?: string | null;
  } | null | any;
  minimumOrderQuantity?: number | null;
  price: number;
  rating?: number | null;
  returnPolicy?: string | null;
  reviews?: Review[];
  shippingInformation?: string | null;
  sku?: string | null;
  stock?: number | null;
  tags?: string[] | null;
  thumbnail?: string | null;
  title: string;
  warrantyInformation?: string | null;
  weight?: number | null;
  quantity?: number | null;
  isActive?: boolean | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  // ⭐ 필수 표기 정보
  productName?: string | null;
  modelNumber?: string | null;
  size?: string | null;
  material?: string | null;
  releaseDate?: string | null;
  manufacturer?: string | null;
  madeInCountry?: string | null;
  warrantyStandard?: string | null;
  asResponsible?: string | null;
  kcCertification?: string | null;
  color?: string | null;
  productComposition?: string | null;
  detailedSpecs?: string | null;
  // ⭐ 배송 정보
  shippingMethod?: string | null;
  shippingCost?: string | null;
  bundleShipping?: string | null;
  shippingPeriod?: string | null;
  // ⭐ 교환/반품 정보
  exchangeReturnCost?: string | null;
  exchangeReturnDeadline?: string | null;
  exchangeReturnLimitations?: string | null;
  clothingLimitations?: string | null;
  foodLimitations?: string | null;
  electronicsLimitations?: string | null;
  autoLimitations?: string | null;
  mediaLimitations?: string | null;
  // ⭐ 판매자 정보
  sellerName?: string | null;
  sellerPhone?: string | null;
  sellerLegalNotice?: string | null;
  // ⭐ 옵션 시스템
  hasOptions?: boolean | null;
  options?: ProductOption[];
  variants?: ProductVariant[];
}

// ⭐ 상품 옵션 타입 (색상, 사이즈 등)
export interface ProductOption {
  id?: string;
  productId?: string;
  name: string;        // 옵션명 (색상, 사이즈 등)
  values: string[];    // 옵션값 배열 (블랙, 화이트 등)
  order?: number;      // 옵션 순서
}

// ⭐ 상품 변형 타입 (옵션 조합별)
export interface ProductVariant {
  id?: string;
  productId?: string;
  optionCombination: Record<string, string>; // {color: "블랙", size: "265"}
  sku?: string;           // 판매자상품코드
  price: number;          // 판매가
  originalPrice?: number; // 정상가
  stock: number;          // 재고
  isActive?: boolean;
  image?: string;         // 옵션별 이미지 (색상 썸네일)
  barcode?: string;
  modelNumber?: string;
}

export interface StateType {
  shopy: {
    cart: ProductType[];
    favorite: ProductType[];
    userInfo: any;
  };
}

export interface Address {
  id?: string;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  deliveryRequest: string;
  entranceCode?: string;
  isDefault?: boolean;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  provider?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    addresses: Address[];
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  cart: ProductType[];
  wishlist: ProductType[];
  orders: OrderData[];
}

export interface OrderData {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  assignedDeliveryman?: string;
  assignedPacker?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  packedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  sku: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  changedBy: string;
  changedByRole: UserRole;
  timestamp: string;
  notes?: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  userId: string;
  question: string;
  isAnswered: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  answers?: ProductAnswer[];
}

export interface ProductAnswer {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
