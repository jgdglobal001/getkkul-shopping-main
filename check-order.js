require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderId: 'ORD-1762145855893-WTEU3X66X' },
    select: {
      id: true,
      orderId: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      totalAmount: true,
    },
  });
  console.log('Order:', order);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });