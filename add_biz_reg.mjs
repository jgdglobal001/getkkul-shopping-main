import fs from 'fs';

const schemaPath = './src/lib/db/schema.ts';
let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

if (!schemaContent.includes('businessRegistrations')) {
  const businessRegTable = `

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
`;
  schemaContent += businessRegTable;
  fs.writeFileSync(schemaPath, schemaContent, 'utf-8');
  console.log('businessRegistrations table added!');
} else {
  console.log('businessRegistrations already exists');
}
