/**
 * 최근 주문 조회 스크립트 (결제 완료된 주문만)
 */
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  // 결제 완료/환불된 주문만 조회
  const orders = await sql`
    SELECT
      "id",
      "orderId",
      "totalAmount",
      "paymentStatus",
      "status",
      "tossPaymentKey",
      "tossOrderId",
      "createdAt"
    FROM orders
    WHERE "paymentStatus" IN ('paid', 'refunded')
    ORDER BY "createdAt" DESC
  `;

  console.log('\n💰 결제 완료/환불된 주문 목록:');
  console.log('='.repeat(100));
  if (orders.length === 0) {
    console.log('결제 완료된 주문이 없습니다.');
  } else {
    orders.forEach((o, i) => {
      const hasTossKey = o.tossPaymentKey ? '✅ 있음' : '❌ 없음';
      console.log(`${i+1}. ${o.orderId}`);
      console.log(`   ID: ${o.id}`);
      console.log(`   금액: ₩${o.totalAmount?.toLocaleString()} | 상태: ${o.status} | 결제: ${o.paymentStatus}`);
      console.log(`   tossPaymentKey: ${hasTossKey}`);
      if (o.tossPaymentKey) console.log(`   -> ${o.tossPaymentKey}`);
      console.log('-'.repeat(100));
    });
  }
}

main().catch(console.error);

