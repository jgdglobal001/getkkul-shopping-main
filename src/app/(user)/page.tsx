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

export default async function Home() {
  const endpoint = `https://dummyjson.com/products?limit=0`; // Fetch all products
  const productData = await getData(endpoint);
  const allProducts = productData?.products || [];

  // Categorize products
  const bestSellers = getBestSellers(allProducts);
  const newArrivals = getNewArrivals(allProducts);
  const offers = getOffers(allProducts);

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
    </main>
  );
}
