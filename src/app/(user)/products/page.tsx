export const runtime = 'edge';

import Container from "@/components/Container";
import EnhancedProductsSideNav from "@/components/products/EnhancedProductsSideNav";
import { getData } from "../helpers";
import InfiniteProductList from "@/components/products/InfiniteProductList";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
  searchProducts,
  getProductsByCategory,
} from "../helpers/productHelpers";
import Link from "next/link";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { cookies } from "next/headers";

import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

const translations = { ko, en, zh } as const;
type Locale = keyof typeof translations;

const Breadcrumb = ({ t, category, search }: { t: any; category?: string; search?: string }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
    <Link href="/" className="hover:text-blue-600 transition-colors">
      {t("products.breadcrumb_home", "Home")}
    </Link>
    <span>{t("products.breadcrumb_separator", "/")}</span>
    <Link
      href="/products"
      className={`${!category && !search ? "text-gray-900 font-medium" : "hover:text-blue-600 transition-colors"}`}
    >
      {t("products.breadcrumb_products", "Products")}
    </Link>
    {category && (
      <>
        <span>{t("products.breadcrumb_separator", "/")}</span>
        <span className="text-gray-900 font-medium capitalize">
          {category === "bestsellers" ? t("categories.bestsellers", "Bestsellers") :
            category === "new" ? t("categories.new_arrivals", "New Arrivals") :
              category === "offers" ? t("categories.special_offers", "Special Offers") :
                category}
        </span>
      </>
    )}
    {search && (
      <>
        <span>{t("products.breadcrumb_separator", "/")}</span>
        <span className="text-gray-900 font-medium italic">"{search}"</span>
      </>
    )}
  </nav>
);

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("i18next")?.value as Locale) || "ko";
  const dict = translations[lang] || translations.ko;

  const t = (key: string, defaultValue: string = ""): string => {
    const keys = key.split(".");
    let value: any = dict;
    for (const k of keys) value = value?.[k];
    return value || defaultValue;
  };

  let title = t("products.all_products", "모든 상품");
  if (params.category) {
    switch (params.category) {
      case "bestsellers": title = t("categories.bestsellers", "베스트셀러"); break;
      case "new": title = t("categories.new_arrivals", "신상품"); break;
      case "offers": title = t("categories.special_offers", "특별 할인"); break;
      default:
        title = `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} ${t("products.product_header", "상품")}`;
    }
  } else if (params.search) {
    title = t("products.search_results_for", "\"{{query}}\" 검색 결과").replace("{{query}}", params.search);
  }

  return {
    title: `${title} - Getkkul-shopping`,
  };
}

// 동적 렌더링 설정 (DB 쿼리 때문에)
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    min_price?: string;
    max_price?: string;
    color?: string;
    sort?: string;
    page?: string;
  }>;
}

// Helper function to get translations
const getT = async () => {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("i18next")?.value as Locale) || "ko";
  const dict = translations[lang] || translations.ko;

  return (key: string, defaultValue: string = ''): string => {
    const keys = key.split('.');
    let value: any = dict;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || defaultValue;
  };
};

const ProductsPage = async ({ searchParams }: Props) => {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const t = await getT();

  // DB에서 실제 상품 조회
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  // Fetch all categories for the sidebar
  const dbCategories = await db
    .select({
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.order));

  // 더미 참고용 상품 (모바일 카테고리만)
  const dummyData = await getData(`https://dummyjson.com/products/category/smartphones?limit=0`);
  const dummyProducts = dummyData?.products || [];

  let filteredProducts = [...dbProducts]; // DB 상품을 메인으로
  const allProducts = [...filteredProducts]; // Keep original for filters

  // Extract unique brands from DB products only
  const uniqueBrands = [
    ...new Set(allProducts.map((product: any) => product.brand).filter(Boolean)),
  ].sort();

  // 카테고리 필터링 - smartphones는 더미에서 가져오기
  if (params.category === "smartphones") {
    filteredProducts = dummyProducts;
  } else if (params.category) {
    // 다른 카테고리는 DB에서만
    switch (params.category) {
      case "bestsellers":
        filteredProducts = getBestSellers(dbProducts) as any;
        break;
      case "new":
        filteredProducts = getNewArrivals(dbProducts) as any;
        break;
      case "offers":
        filteredProducts = getOffers(dbProducts) as any;
        break;
      default:
        // Find the category name corresponding to the slug
        const targetCategory = dbCategories.find(c => c.slug === params.category);
        const filterValue = targetCategory ? targetCategory.name : params.category;
        filteredProducts = getProductsByCategory(dbProducts, filterValue) as any;
    }
  }

  // Filter by search term (DB에서만 검색)
  if (params.search) {
    filteredProducts = searchProducts(filteredProducts, params.search) as any;
  }

  // Filter by brand
  if (params.brand) {
    filteredProducts = filteredProducts.filter(
      (product: any) =>
        product.brand &&
        product.brand.toLowerCase().includes(params.brand!.toLowerCase())
    );
  }

  // Filter by price range
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) : 0;
    const maxPrice = params.max_price ? parseFloat(params.max_price) : Infinity;
    filteredProducts = filteredProducts.filter(
      (product: any) => product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Filter by color
  if (params.color) {
    filteredProducts = filteredProducts.filter((product: any) => {
      const colorLower = params.color!.toLowerCase();
      // Check in tags
      if (product.tags && Array.isArray(product.tags)) {
        const hasColorInTags = product.tags.some((tag: string) =>
          tag.toLowerCase().includes(colorLower)
        );
        if (hasColorInTags) return true;
      }
      // Check in title
      return product.title.toLowerCase().includes(colorLower);
    });
  }

  const getCategoryTitle = (categorySlug: string) => {
    if (categorySlug === "bestsellers") return t("categories.bestsellers", "Bestsellers");
    if (categorySlug === "new") return t("categories.new_arrivals", "New Arrivals");
    if (categorySlug === "offers") return t("categories.special_offers", "Special Offers");

    const translationKey = `categories.${categorySlug.replace(/-/g, "_")}_name`;
    const translatedName = t(translationKey);
    return translatedName === translationKey ?
      (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)) :
      translatedName;
  };

  // Get the page title based on category
  const getPageTitle = () => {
    if (params.category) {
      const categoryTitle = getCategoryTitle(params.category);
      if (["Bestsellers", "New Arrivals", "Special Offers"].includes(categoryTitle)) {
        return categoryTitle;
      }
      // Re-switch for special ones to match dict exactly if needed, 
      // but getCategoryTitle covers it.
      switch (params.category) {
        case "bestsellers": return t("categories.bestsellers", "베스트셀러");
        case "new": return t("categories.new_arrivals", "신상품");
        case "offers": return t("categories.special_offers", "특별 할인");
        default:
          return `${categoryTitle} ${t("products.product_header", "상품")}`;
      }
    }
    if (params.search) {
      const template = t("products.search_results_for", `"{{query}}" 검색 결과`);
      return template.replace("{{query}}", params.search);
    }
    return t("products.all_products", "모든 상품");
  };

  // Update Breadcrumb component or just use it with localized name
  const localizedCategoryName = params.category ? getCategoryTitle(params.category) : undefined;

  // Merge database categories with any categories found in products that aren't in the database
  const productCategories = [
    ...new Set(allProducts.map((p: any) => p.category).filter(Boolean)),
  ] as string[];

  const mergedCategories = [...dbCategories];
  productCategories.forEach((catName) => {
    // Check if this category name already exists in dbCategories
    const exists = dbCategories.some(
      (dbCat) => dbCat.name.toLowerCase() === catName.toLowerCase()
    );
    if (!exists) {
      mergedCategories.push({
        name: catName,
        slug: catName, // Use name as slug for synthetic categories
      });
    }
  });

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600 text-lg">
          {params.category || params.search
            ? (() => {
              const template = t("products.found_products", "{{count}} products found");
              return template.replace("{{count}}", String(filteredProducts.length));
            })()
            : (() => {
              const template = t("products.discover_collection", "Discover full collection of {{count}} products");
              return template.replace("{{count}}", String(filteredProducts.length));
            })()}
        </p>

        {/* Breadcrumb */}
        <Breadcrumb t={t} category={localizedCategoryName} search={params.search} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/5">
          <EnhancedProductsSideNav
            categories={[
              ...mergedCategories,
              { name: "스마트폰", slug: "smartphones" },
            ]}
            brands={uniqueBrands}
            allProducts={allProducts}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1 min-w-0">
          <InfiniteProductList
            products={filteredProducts}
            currentSort={params.sort || "default"}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
