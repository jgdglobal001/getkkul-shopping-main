import { UserRole, OrderStatus } from "@/lib/rbac/roles";

type Review = {
  reviewerName: string;
  rating: number;
  comment: string;
  reviewerEmail: string;
};
export interface ProductType {
  availabilityStatus?: string;
  brand?: string;
  category: string;
  description: string;
  dimensions?: {
    depth?: number;
    height?: number;
    width?: number;
  };
  discountPercentage: number;
  id: string | number;
  images: string[];
  detailImages?: string[];
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    barcode?: string;
    qrCode?: string;
  };
  minimumOrderQuantity?: number;
  price: number;
  rating?: number;
  returnPolicy?: string;
  reviews?: Review[];
  shippingInformation?: string;
  sku?: string;
  stock?: number;
  tags?: string[];
  thumbnail?: string;
  title: string;
  warrantyInformation?: string;
  weight?: number;
  quantity?: number;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // ⭐ 필수 표기 정보
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
  // ⭐ 배송 정보
  shippingMethod?: string;
  shippingCost?: string;
  bundleShipping?: string;
  shippingPeriod?: string;
  // ⭐ 교환/반품 정보
  exchangeReturnCost?: string;
  exchangeReturnDeadline?: string;
  exchangeReturnLimitations?: string;
  clothingLimitations?: string;
  foodLimitations?: string;
  electronicsLimitations?: string;
  autoLimitations?: string;
  mediaLimitations?: string;
  // ⭐ 판매자 정보
  sellerName?: string;
  sellerPhone?: string;
  sellerLegalNotice?: string;
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
