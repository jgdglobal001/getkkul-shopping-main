import { pgTable, text, integer, boolean, real, timestamp, unique, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  image: text('image'),
  role: text('role').default('user'),
  provider: text('provider'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  phone: text('phone'),
  newsletter: boolean('newsletter').default(false),
  notifications: boolean('notifications').default(true),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
});

// Accounts (OAuth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  providerAccountUnique: unique().on(table.provider, table.providerAccountId),
}));

// Sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().notNull(),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Verification Tokens
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  identifierTokenUnique: unique().on(table.identifier, table.token),
}));

// Addresses
export const addresses = pgTable('addresses', {
  id: text('id').primaryKey().notNull(),
  recipientName: text('recipientName').notNull(),
  phone: text('phone').notNull(),
  zipCode: text('zipCode').notNull(),
  address: text('address').notNull(),
  detailAddress: text('detailAddress').notNull(),
  deliveryRequest: text('deliveryRequest').default('문 앞'),
  entranceCode: text('entranceCode'),
  isDefault: boolean('isDefault').default(false),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  icon: text('icon'),
  order: integer('order').default(0),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Products
export const products = pgTable('products', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  discountPercentage: real('discountPercentage').default(0),
  rating: real('rating').default(0),
  stock: integer('stock').default(0),
  brand: text('brand'),
  category: text('category').notNull(),
  thumbnail: text('thumbnail').notNull(),
  images: text('images').array(),
  detailImages: text('detailImages').array(),
  tags: text('tags').array(),
  sku: text('sku').notNull().unique(),
  weight: real('weight'),
  dimensions: json('dimensions'),
  warrantyInformation: text('warrantyInformation'),
  shippingInformation: text('shippingInformation'),
  returnPolicy: text('returnPolicy'),
  minimumOrderQuantity: integer('minimumOrderQuantity').default(1),
  availabilityStatus: text('availabilityStatus').default('In Stock'),
  meta: json('meta'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
  // 필수 표기 정보
  productName: text('productName'),
  modelNumber: text('modelNumber'),
  size: text('size'),
  material: text('material'),
  releaseDate: text('releaseDate'),
  manufacturer: text('manufacturer'),
  madeInCountry: text('madeInCountry'),
  warrantyStandard: text('warrantyStandard'),
  asResponsible: text('asResponsible'),
  kcCertification: text('kcCertification'),
  color: text('color'),
  productComposition: text('productComposition'),
  detailedSpecs: text('detailedSpecs'),
  // 배송 정보
  shippingMethod: text('shippingMethod'),
  shippingCost: text('shippingCost'),
  bundleShipping: text('bundleShipping'),
  shippingPeriod: text('shippingPeriod'),
  // 교환/반품 정보
  exchangeReturnCost: text('exchangeReturnCost'),
  exchangeReturnDeadline: text('exchangeReturnDeadline'),
  exchangeReturnLimitations: text('exchangeReturnLimitations'),
  clothingLimitations: text('clothingLimitations'),
  foodLimitations: text('foodLimitations'),
  electronicsLimitations: text('electronicsLimitations'),
  autoLimitations: text('autoLimitations'),
  mediaLimitations: text('mediaLimitations'),
  // 판매자 정보
  sellerName: text('sellerName'),
  sellerPhone: text('sellerPhone'),
  sellerLegalNotice: text('sellerLegalNotice'),
  // 옵션 시스템
  hasOptions: boolean('hasOptions').default(false),
});

// Product Options
export const productOptions = pgTable('product_options', {
  id: text('id').primaryKey().notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  values: text('values').array(),
  order: integer('order').default(0),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Product Variants
export const productVariants = pgTable('product_variants', {
  id: text('id').primaryKey().notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  optionCombination: json('optionCombination'),
  sku: text('sku'),
  price: real('price').notNull(),
  originalPrice: real('originalPrice'),
  stock: integer('stock').default(0),
  isActive: boolean('isActive').default(true),
  image: text('image'),
  barcode: text('barcode'),
  modelNumber: text('modelNumber'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Cart Items
export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey().notNull(),
  quantity: integer('quantity').default(1),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  price: real('price').notNull(),
  image: text('image'),
  category: text('category'),
  brand: text('brand'),
  discountPercentage: real('discountPercentage'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  variantId: text('variantId').references(() => productVariants.id, { onDelete: 'set null' }),
  selectedOptions: json('selectedOptions'),
}, (table) => ({
  userProductVariantUnique: unique().on(table.userId, table.productId, table.variantId),
}));

// Wishlist Items
export const wishlistItems = pgTable('wishlist_items', {
  id: text('id').primaryKey().notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  price: real('price').notNull(),
  image: text('image'),
  category: text('category'),
  brand: text('brand'),
  discountPercentage: real('discountPercentage'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  userProductUnique: unique().on(table.userId, table.productId),
}));

// Orders
export const orders = pgTable('orders', {
  id: text('id').primaryKey().notNull(),
  orderId: text('orderId').notNull().unique(),
  status: text('status').default('pending'),
  paymentStatus: text('paymentStatus').default('pending'),
  paymentMethod: text('paymentMethod').default('online'),
  totalAmount: real('totalAmount').notNull(),
  currency: text('currency').default('KRW'),
  shippingAddress: json('shippingAddress').notNull(),
  billingAddress: json('billingAddress'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 토스페이먼츠 결제 정보
  tossOrderId: text('tossOrderId'),
  tossPaymentId: text('tossPaymentId'),
  tossPaymentKey: text('tossPaymentKey').unique(),
  tossPaymentMethod: text('tossPaymentMethod'),
  tossCardCompany: text('tossCardCompany'),
  tossCardNumber: text('tossCardNumber'),
  tossApprovalNumber: text('tossApprovalNumber'),
  tossFailureReason: text('tossFailureReason'),
  tossReceipt: json('tossReceipt'),
  tossPaymentAttempts: integer('tossPaymentAttempts').default(0),
  lastTossAttempt: timestamp('lastTossAttempt', { mode: 'date' }),
  // 파트너 정보 (지급대행용)
  partnerRef: text('partnerRef'),
  partnerSellerId: text('partnerSellerId'),
  partnerLinkId: text('partnerLinkId'),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().notNull(),
  quantity: integer('quantity').notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  price: real('price').notNull(),
  total: real('total').notNull(),
  image: text('image'),
  category: text('category'),
  originalPrice: real('originalPrice'),
  discountPercentage: real('discountPercentage'),
  orderId: text('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: text('variantId').references(() => productVariants.id, { onDelete: 'set null' }),
  selectedOptions: json('selectedOptions'),
});

// Product Questions
export const productQuestions = pgTable('product_questions', {
  id: text('id').primaryKey().notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  isAnswered: boolean('isAnswered').default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Product Answers
export const productAnswers = pgTable('product_answers', {
  id: text('id').primaryKey().notNull(),
  questionId: text('questionId').notNull().references(() => productQuestions.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  answer: text('answer').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});



// Partner Links 테이블 (파트너스와 공유 - 커미션 추적용)
export const partnerLinks = pgTable('partner_links', {
  id: text('id').primaryKey(),
  shortCode: text('shortCode').notNull().unique(),
  partnerId: text('partnerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  clickCount: integer('clickCount').notNull().default(0),
  conversionCount: integer('conversionCount').notNull().default(0),
  revenue: real('revenue').notNull().default(0),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Business Registrations 테이블 (파트너스와 공유 - sellerId 조회용)
export const businessRegistrations = pgTable('business_registrations', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('businessName').notNull(),
  representativeName: text('representativeName').notNull(),
  businessNumber: text('businessNumber').notNull().unique(),
  businessType: text('businessType'),
  businessCategory: text('businessCategory'),
  businessAddress: text('businessAddress'),
  phoneNumber: text('phoneNumber'),
  email: text('email'),
  bankName: text('bankName'),
  accountNumber: text('accountNumber'),
  accountHolder: text('accountHolder'),
  sellerId: text('sellerId').unique(),
  tossStatus: text('tossStatus').default('pending'),
  tossSubMerchantId: text('tossSubMerchantId'),
  tossRegisteredAt: timestamp('tossRegisteredAt', { mode: 'date' }),
  status: text('status').default('pending'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Payment Methods (빌링키 저장용)
export const paymentMethods = pgTable('payment_methods', {
  id: text('id').primaryKey().notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  billingKey: text('billingKey').notNull().unique(),
  customerKey: text('customerKey').notNull(),
  cardCompany: text('cardCompany'),       // 카드사 이름 (예: "신한", "삼성")
  cardNumber: text('cardNumber'),          // 마스킹된 카드번호 (예: "****1234")
  cardType: text('cardType'),              // 신용, 체크, 기프트
  ownerType: text('ownerType'),            // 개인, 법인
  issuerCode: text('issuerCode'),          // 카드 발급사 코드
  acquirerCode: text('acquirerCode'),      // 카드 매입사 코드
  isDefault: boolean('isDefault').default(false),
  authenticatedAt: timestamp('authenticatedAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Product Reviews
export const productReviews = pgTable('product_reviews', {
  id: text('id').primaryKey().notNull(),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: real('rating').notNull(),
  comment: text('comment').notNull(),
  images: text('images').array(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(productReviews),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(productReviews),
  options: many(productOptions),
  variants: many(productVariants),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));
