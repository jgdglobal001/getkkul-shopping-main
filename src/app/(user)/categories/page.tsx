import Container from "@/components/Container";
import InfiniteCategoryGrid from "@/components/pages/categories/InfiniteCategoryGrid";
import { getData } from "../helpers";
import { getCategoriesWithCounts } from "../helpers/productHelpers";
import { Metadata } from "next";
import Link from "next/link";
import koTranslations from "@/locales/ko.json";
import koExtendedTranslations from "@/locales/ko-extended.json";

export const metadata: Metadata = {
  title: "상품 카테고리 | Getkkul-shopping",
  description:
    "전자제품, 패션, 홈데코, 뷰티 등 다양한 상품 카테고리를 둘러보세요. 원하는 상품을 쉽게 찾을 수 있습니다.",
  keywords: [
    "상품 카테고리",
    "전자제품",
    "패션",
    "홈데코",
    "뷰티 제품",
    "의류",
    "액세서리",
    "카테고리별 쇼핑",
  ],
  openGraph: {
    title: "상품 카테고리 | Getkkul-shopping",
    description:
      "다양한 상품 카테고리를 둘러보세요. 원하는 상품을 쉽게 찾을 수 있습니다.",
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
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";
  
  let categoriesData = [];
  
  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`, { 
      next: { revalidate: 60 }, // Cache for 60 seconds
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
