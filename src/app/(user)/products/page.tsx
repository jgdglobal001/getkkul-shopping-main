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
import { db, products } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import koTranslations from "@/locales/ko.json";
import koExtendedTranslations from "@/locales/ko-extended.json";

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

const ProductsPage = async ({ searchParams }: Props) => {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const t = getT();

  // DB에서 실제 상품 조회
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  // 더미 참고용 상품 (모바일 카테고리만)
  const dummyData = await getData(`https://dummyjson.com/products/category/smartphones?limit=0`);
  const dummyProducts = dummyData?.products || [];

  let products = [...dbProducts]; // DB 상품을 메인으로
  const allProducts = [...products]; // Keep original for filters

  // Extract unique brands from DB products only
  const uniqueBrands = [
    ...new Set(allProducts.map((product: any) => product.brand).filter(Boolean)),
  ].sort();

  // 카테고리 필터링 - smartphones는 더미에서 가져오기
  if (params.category === "smartphones") {
    products = dummyProducts;
  } else if (params.category) {
    // 다른 카테고리는 DB에서만
    switch (params.category) {
      case "bestsellers":
        products = getBestSellers(dbProducts);
        break;
      case "new":
        products = getNewArrivals(dbProducts);
        break;
      case "offers":
        products = getOffers(dbProducts);
        break;
      default:
        products = getProductsByCategory(dbProducts, params.category);
    }
  }

  // Filter by search term (DB에서만 검색)
  if (params.search) {
    products = searchProducts(products, params.search);
  }

  // Filter by brand
  if (params.brand) {
    products = products.filter(
      (product: any) =>
        product.brand &&
        product.brand.toLowerCase().includes(params.brand!.toLowerCase())
    );
  }

  // Filter by price range
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) : 0;
    const maxPrice = params.max_price ? parseFloat(params.max_price) : Infinity;
    products = products.filter(
      (product: any) => product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Filter by color
  if (params.color) {
    products = products.filter((product: any) => {
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

  // Get the page title based on category
  const getPageTitle = () => {
    if (params.category) {
      switch (params.category) {
        case "bestsellers":
          return t("categories.bestsellers", "베스트셀러");
        case "new":
          return t("categories.new_arrivals", "신상품");
        case "offers":
          return t("categories.special_offers", "특별 할인");
        default:
          return `${
            params.category.charAt(0).toUpperCase() + params.category.slice(1)
          } ${t("products.product_header", "상품")}`;
      }
    }
    if (params.search) {
      const template = t("products.search_results_for", `"{{query}}" 검색 결과`);
      return template.replace("{{query}}", params.search);
    }
    return t("products.all_products", "모든 상품");
  };

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
                const template = t("products.found_products", "{{count}}개 상품 찾음");
                return template.replace("{{count}}", String(products.length));
              })()
            : (() => {
                const template = t("products.discover_collection", "{{count}}개 상품의 전체 컬렉션 발견");
                return template.replace("{{count}}", String(products.length));
              })()}
        </p>

        {/* Breadcrumb */}
        <nav className="mt-4 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                {t("products.breadcrumb_home", "홈")}
              </Link>
            </li>
            <li>{t("products.breadcrumb_separator", "/")}</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                {t("products.breadcrumb_products", "상품")}
              </Link>
            </li>
            {params.category && (
              <>
                <li>{t("products.breadcrumb_separator", "/")}</li>
                <li className="text-gray-900 font-medium">{getPageTitle()}</li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/5">
          <EnhancedProductsSideNav
            categories={[
              ...new Set(dbProducts.map((p: any) => p.category).filter(Boolean)),
              "smartphones", // 더미 참고용 카테고리
            ]}
            brands={uniqueBrands}
            allProducts={allProducts}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1 min-w-0">
          <InfiniteProductList
            products={products}
            currentSort={params.sort || "default"}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
