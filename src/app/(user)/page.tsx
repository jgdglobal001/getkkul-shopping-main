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

// ?™ì  ?Œë”ë§??¤ì • (DB ì¿¼ë¦¬ ?Œë¬¸??
export const dynamic = "force-dynamic";

export default async function Home() {
  // DB?ì„œ ?¤ì œ ?í’ˆ ì¡°íšŒ
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  // ?”ë? ì°¸ê³ ???í’ˆ (ëª¨ë°”??ì¹´í…Œê³ ë¦¬ë§?
  const dummyEndpoint = `https://dummyjson.com/products/category/smartphones?limit=0`;
  const dummyData = await getData(dummyEndpoint);
  const dummyProducts = dummyData?.products || [];

  // DB ?í’ˆ ê¸°ë°˜ ì¹´í…Œê³ ë¦¬??
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
        title="ë² ìŠ¤?¸ì???
        subtitle="ê³ ê°?¤ì´ ê°€???¬ë‘?˜ëŠ” ?¸ê¸° ?í’ˆ??
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="? ìƒ??
        subtitle="?ˆë¡­ê²?ì¶”ê???ìµœì‹  ?í’ˆ??
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="?¹ê? ?í’ˆ"
        subtitle="?“ì¹˜ë©??„íšŒ???¹ë³„??? ì¸ ?œíƒ"
        products={offers}
        viewMoreLink="/offers"
      />

      {/* Reference Products Section (Dummy - Mobile Category) */}
      {dummyProducts.length > 0 && (
        <>
          <SectionDivider />
          <ProductSection
            title="?“± ì°¸ê³  ?í’ˆ (ëª¨ë°”??"
            subtitle="?¤ì–‘??ëª¨ë°”??ê¸°ê¸°?¤ì„ ì°¸ê³ ?˜ì„¸??
            products={dummyProducts.slice(0, 8)}
            viewMoreLink="/products?category=smartphones"
          />
        </>
      )}
    </main>
  );
}
