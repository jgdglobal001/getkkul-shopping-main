import React from "react";
import RoundedCategoriesCarousel from "./RoundedCategoriesCarousel";
import { db, categories, products } from "@/lib/db";
import { eq, asc, sql } from "drizzle-orm";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center";

interface EnhancedCategory {
  slug: string;
  name: string;
  url: string;
  image: string;
  itemCount: number;
  description: string;
}

const DynamicFeaturedCategories: React.FC = async () => {
  try {
    // DB에서 카테고리 조회
    const dbCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.order));

    // DB에서 카테고리별 상품 수 조회
    const productCounts = await db
      .select({
        category: products.category,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .groupBy(products.category);

    const countMap = new Map(
      productCounts.map((pc) => [pc.category.toLowerCase(), pc.count])
    );

    // 카테고리 데이터 구성
    const enhancedCategories: EnhancedCategory[] = dbCategories
      .slice(0, 12)
      .map((cat) => ({
        slug: cat.slug,
        name: cat.name,
        url: `/products?category=${cat.slug}`,
        image: cat.image || DEFAULT_IMAGE,
        itemCount: countMap.get(cat.name.toLowerCase()) || 0,
        description: cat.description || `${cat.name} 카테고리의 상품들`,
      }));

    return <RoundedCategoriesCarousel categories={enhancedCategories} />;
  } catch (error) {
    console.error("카테고리 로딩 실패:", error);
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            카테고리별 쇼핑
          </h2>
          <p className="text-gray-600">
            카테고리를 불러오는 데 실패했습니다.
          </p>
        </div>
      </section>
    );
  }
};

export default DynamicFeaturedCategories;
