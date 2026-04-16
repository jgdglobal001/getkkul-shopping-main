export const runtime = 'edge';

import Container from "@/components/Container";
import InfiniteCategoryGrid from "@/components/pages/categories/InfiniteCategoryGrid";
import { Metadata } from "next";
import Link from "next/link";
import { getT, getLanguageFromCookie } from "@/lib/i18nUtils";
import { cookies } from "next/headers";
import { db, products as productsTable } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);
  const t = getT(lang);

  return {
    title: `${t("categories.page_title")} | Getkkul-shopping`,
    description: t("categories.page_description"),
    keywords: [
      t("categories.page_title"),
      "전자제품",
      "패션",
      "홈데코",
      "뷰티 제품",
      "의류",
      "액세서리",
      "카테고리별 쇼핑",
    ],
    openGraph: {
      title: `${t("categories.page_title")} | Getkkul-shopping`,
      description: t("categories.page_description"),
      url: "/categories",
      siteName: "Getkkul-shopping",
      type: "website",
    },
    alternates: {
      canonical: "/categories",
    },
  };
}

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);
  const t = getT(lang);

  // Fetch categories from our database API
  let categoriesData = [];

  try {
    // Server Components require absolute URL
    const baseUrl = process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3002");

    const categoriesResponse = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 0 }, // No caching - always fetch fresh data
      headers: { 'Content-Type': 'application/json' }
    });

    if (!categoriesResponse.ok) {
      console.error(`카테고리 API 오류: ${categoriesResponse.status}`);
      categoriesData = [];
    } else {
      categoriesData = await categoriesResponse.json();
    }
  } catch (error) {
    console.error("카테고리 페칭 실패:", error);
    categoriesData = [];
  }

  // DB에서 카테고리별 상품 수 조회
  const productCounts = await db
    .select({
      category: productsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .where(eq(productsTable.isActive, true))
    .groupBy(productsTable.category);

  const countMap = new Map(
    productCounts.map((pc) => [pc.category.toLowerCase(), pc.count])
  );

  const totalProducts = productCounts.reduce((sum, pc) => sum + pc.count, 0);

  // Combine API categories with counts
  const enrichedCategories =
    categoriesData?.map((category: any) => ({
      ...category,
      count: countMap.get(category.name?.toLowerCase()) || countMap.get(category.slug?.toLowerCase()) || 0,
    })) || [];

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t("categories.page_title")}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("categories.page_description")}
        </p>

        {/* Breadcrumb */}
        <nav className="mt-6 text-sm">
          <ol className="flex items-center justify-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                {t("categories.breadcrumb_home")}
              </Link>
            </li>
            <li>{t("categories.breadcrumb_categories").substring(0, 1) === "/" ? "/" : " / "}</li>
            <li className="text-gray-900 font-medium">{t("categories.breadcrumb_categories")}</li>
          </ol>
        </nav>
      </div>

      {/* Categories Grid */}
      <InfiniteCategoryGrid
        initialCategories={enrichedCategories}
        totalProducts={totalProducts}
      />
    </Container>
  );
}
