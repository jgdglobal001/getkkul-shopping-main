import Banner from "@/components/pages/home/Banner";
import ProductSection from "@/components/pages/home/ProductSection";
import DynamicFeaturedCategories from "@/components/pages/home/DynamicFeaturedCategories";
import SpecialOffersBanner from "@/components/pages/home/SpecialOffersBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import { getData } from "./helpers";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
} from "./helpers/productHelpers";
import { db, products } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

// 동적 렌더링 설정 (DB 쿼리 때문에)
export const dynamic = "force-dynamic";

export default async function Home() {
  // DB에서 실제 상품 조회
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  // 더미 참고용 상품 (모바일 카테고리만)
  const dummyEndpoint = `https://dummyjson.com/products/category/smartphones?limit=0`;
  const dummyData = await getData(dummyEndpoint);
  const dummyProducts = dummyData?.products || [];

  // DB 상품 기반 카테고리화
  const bestSellers = getBestSellers(dbProducts);
  const newArrivals = getNewArrivals(dbProducts);
  const offers = getOffers(dbProducts);

  return (
    <main>
      <Banner />

      {/* Featured Categories Section */}
      <DynamicFeaturedCategories />

      {/* Special Offers Banner */}
      <SpecialOffersBanner />

      <SectionDivider />

      {/* Best Sellers Section */}
      <ProductSection
        title="베스트셀러"
        subtitle="고객들이 가장 사랑하는 인기 상품들"
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="신상품"
        subtitle="새롭게 추가된 최신 상품들"
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="특가 상품"
        subtitle="놓치면 후회할 특별한 할인 혜택"
        products={offers}
        viewMoreLink="/offers"
      />

      {/* Reference Products Section (Dummy - Mobile Category) */}
      {dummyProducts.length > 0 && (
        <>
          <SectionDivider />
          <ProductSection
            title="📱 참고 상품 (모바일)"
            subtitle="다양한 모바일 기기들을 참고하세요"
            products={dummyProducts.slice(0, 8)}
            viewMoreLink="/products?category=smartphones"
          />
        </>
      )}
    </main>
  );
}
