const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log("====== 데이터베이스에서 카테고리 조회 ======");
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    console.log("\n총 카테고리 수:", categories.length);
    console.log("\n카테고리 목록:");
    categories.forEach((cat, idx) => {
      console.log(`[${idx + 1}] ID: ${cat.id}`);
      console.log(`    이름: "${cat.name}"`);
      console.log(`    슬러그: ${cat.slug}`);
      console.log(`    설명: ${cat.description || "(없음)"}`);
      console.log("---");
    });

    // 특히 향수 관련 카테고리 찾기
    const fragranceCategory = categories.find(
      (cat) => cat.slug === "fragrances"
    );
    if (fragranceCategory) {
      console.log("\n🔍 향수(fragrances) 카테고리 정보:");
      console.log(JSON.stringify(fragranceCategory, null, 2));
    }
  } catch (error) {
    console.error("오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();