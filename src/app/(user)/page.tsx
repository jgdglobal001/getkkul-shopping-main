export const runtime = 'edge';

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

  // 더미 참고용 상품 (모바일 카테고리만) - 최적화: limit를 8로 제한
  const dummyEndpoint = `https://dummyjson.com/products/category/smartphones?limit=8`;
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
        title="Best Sellers"
        subtitle="Our most popular products loved by customers"
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
        titleKey="home.best_sellers"
        subtitleKey="home.best_sellers_sub"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={newArrivals}
        viewMoreLink="/products?category=new"
        titleKey="home.new_arrivals"
        subtitleKey="home.new_arrivals_sub"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="Special Offers"
        subtitle="Don't miss out on these exclusive deals"
        products={offers}
        viewMoreLink="/offers"
        titleKey="home.special_offers"
        subtitleKey="home.special_offers_sub"
      />

      {/* Reference Products Section (Dummy - Mobile Category) */}
      {dummyProducts.length > 0 && (
        <>
          <SectionDivider />
          <ProductSection
            title="📱 Reference Products"
            subtitle="Explore various mobile devices"
            products={dummyProducts.slice(0, 8)}
            viewMoreLink="/products?category=smartphones"
            titleKey="home.ref_products"
            subtitleKey="home.ref_products_sub"
          />
        </>
      )}
    </main>
  );
}
