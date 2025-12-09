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

// ?숈쟻 ?뚮뜑留??ㅼ젙 (DB 荑쇰━ ?뚮Ц??
export const dynamic = "force-dynamic";

export default async function Home() {
  // DB?먯꽌 ?ㅼ젣 ?곹뭹 議고쉶
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  // ?붾? 李멸퀬???곹뭹 (紐⑤컮??移댄뀒怨좊━留?
  const dummyEndpoint = `https://dummyjson.com/products/category/smartphones?limit=0`;
  const dummyData = await getData(dummyEndpoint);
  const dummyProducts = dummyData?.products || [];

  // DB ?곹뭹 湲곕컲 移댄뀒怨좊━??
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
        title="踰좎뒪?몄???
        subtitle="怨좉컼?ㅼ씠 媛???щ옉?섎뒗 ?멸린 ?곹뭹??
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="?좎긽??
        subtitle="?덈∼寃?異붽???理쒖떊 ?곹뭹??
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="?밴? ?곹뭹"
        subtitle="?볦튂硫??꾪쉶???밸퀎???좎씤 ?쒗깮"
        products={offers}
        viewMoreLink="/offers"
      />

      {/* Reference Products Section (Dummy - Mobile Category) */}
      {dummyProducts.length > 0 && (
        <>
          <SectionDivider />
          <ProductSection
            title="?벑 李멸퀬 ?곹뭹 (紐⑤컮??"
            subtitle="?ㅼ뼇??紐⑤컮??湲곌린?ㅼ쓣 李멸퀬?섏꽭??
            products={dummyProducts.slice(0, 8)}
            viewMoreLink="/products?category=smartphones"
          />
        </>
      )}
    </main>
  );
}
