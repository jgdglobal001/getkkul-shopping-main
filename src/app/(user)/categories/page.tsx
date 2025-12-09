export const runtime = 'edge';

import Container from "@/components/Container";
import InfiniteCategoryGrid from "@/components/pages/categories/InfiniteCategoryGrid";
import { getData } from "../helpers";
import { getCategoriesWithCounts } from "../helpers/productHelpers";
import { Metadata } from "next";
import Link from "next/link";
import koTranslations from "@/locales/ko.json";
import koExtendedTranslations from "@/locales/ko-extended.json";

export const metadata: Metadata = {
  title: "?곹뭹 移댄뀒怨좊━ | Getkkul-shopping",
  description:
    "?꾩옄?쒗뭹, ?⑥뀡, ?덈뜲肄? 酉고떚 ???ㅼ뼇???곹뭹 移댄뀒怨좊━瑜??섎윭蹂댁꽭?? ?먰븯???곹뭹???쎄쾶 李얠쓣 ???덉뒿?덈떎.",
  keywords: [
    "?곹뭹 移댄뀒怨좊━",
    "?꾩옄?쒗뭹",
    "?⑥뀡",
    "?덈뜲肄?,
    "酉고떚 ?쒗뭹",
    "?섎쪟",
    "?≪꽭?쒕━",
    "移댄뀒怨좊━蹂??쇳븨",
  ],
  openGraph: {
    title: "?곹뭹 移댄뀒怨좊━ | Getkkul-shopping",
    description:
      "?ㅼ뼇???곹뭹 移댄뀒怨좊━瑜??섎윭蹂댁꽭?? ?먰븯???곹뭹???쎄쾶 李얠쓣 ???덉뒿?덈떎.",
    url: "/categories",
    siteName: "Getkkul-shopping",
    type: "website",
  },
  alternates: {
    canonical: "/categories",
  },
};

// Helper function to get translations
const getT = () => {
  const merged = { ...koTranslations };
  Object.keys(koExtendedTranslations).forEach(key => {
    merged[key as keyof typeof merged] = {
      ...(merged[key as keyof typeof merged] || {}),
      ...koExtendedTranslations[key as keyof typeof koExtendedTranslations]
    };
  });
  
  return (key: string, defaultValue: string = ''): string => {
    const keys = key.split('.');
    let value: any = merged;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || defaultValue;
  };
};

export default async function CategoriesPage() {
  const t = getT();

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
      console.error(`移댄뀒怨좊━ API ?ㅻ쪟: ${categoriesResponse.status}`);
      categoriesData = [];
    } else {
      categoriesData = await categoriesResponse.json();
    }
  } catch (error) {
    console.error("移댄뀒怨좊━ ?섏묶 ?ㅽ뙣:", error);
    categoriesData = [];
  }

  const allProductsData = await getData(`https://dummyjson.com/products?limit=0`); // Fetch all products

  // Get categories with product counts
  const categoriesWithCounts = getCategoriesWithCounts(
    allProductsData?.products || []
  );

  // Combine API categories with counts
  const enrichedCategories =
    categoriesData?.map((category: any) => ({
      ...category,
      count:
        categoriesWithCounts.find((c) => c.slug === category.slug)?.count || 0,
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
        totalProducts={allProductsData?.total || 0}
      />
    </Container>
  );
}
