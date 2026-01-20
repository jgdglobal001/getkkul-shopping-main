export const runtime = 'edge';

import Container from "@/components/Container";
import { getData } from "../helpers";
import OffersHero from "@/components/pages/offers/OffersHero";
import OffersPageHeader from "@/components/pages/offers/OffersPageHeader";
import { ProductType } from "../../../../type";
import OffersList from "@/components/pages/offers/OffersList";
import Link from "next/link";
import { db, products as productsTable } from "@/lib/db";
import { eq, gt, desc, and } from "drizzle-orm";
import { cookies } from "next/headers";

import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

const translations = { ko, en, zh } as const;
type Locale = keyof typeof translations;

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("i18next")?.value as Locale) || "ko";
  const dict = translations[lang] || translations.ko;

  return {
    title: `${dict.offers.title} - Getkkul-shopping`,
    description: dict.offers.description.replace("{{discount}}", "50"),
  };
}

// 동적 렌더링 설정 (DB 쿼리 때문에)
export const dynamic = "force-dynamic";

interface OffersPageProps {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    min_discount?: string;
  }>;
}

const OffersPage = async ({ searchParams }: OffersPageProps) => {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;

  // DB에서 할인 상품 조회
  const dbProducts = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.isActive, true), gt(productsTable.discountPercentage, 0)))
    .orderBy(desc(productsTable.createdAt));

  let filteredProducts = [...dbProducts];
  const offersProducts = filteredProducts;

  // Apply additional filters
  if (params.category) {
    filteredProducts = offersProducts.filter(
      (product: ProductType) =>
        product.category.toLowerCase() === params.category!.toLowerCase()
    );
  } else {
    filteredProducts = offersProducts;
  }

  // Filter by minimum discount percentage
  if (params.min_discount) {
    const minDiscount = parseFloat(params.min_discount);
    filteredProducts = filteredProducts.filter(
      (product: ProductType) => product.discountPercentage >= minDiscount
    );
  }

  // Sort products
  if (params.sort) {
    switch (params.sort) {
      case "discount-high":
        filteredProducts.sort(
          (a: ProductType, b: ProductType) =>
            b.discountPercentage - a.discountPercentage
        );
        break;
      case "discount-low":
        filteredProducts.sort(
          (a: ProductType, b: ProductType) =>
            a.discountPercentage - b.discountPercentage
        );
        break;
      case "price-low":
        filteredProducts.sort((a: ProductType, b: ProductType) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a: ProductType, b: ProductType) => b.price - a.price);
        break;
      case "name-asc":
        filteredProducts.sort((a: ProductType, b: ProductType) =>
          a.title.localeCompare(b.title)
        );
        break;
      case "rating":
        filteredProducts.sort(
          (a: ProductType, b: ProductType) => (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        // Default: highest discount first
        filteredProducts.sort(
          (a: ProductType, b: ProductType) =>
            b.discountPercentage - a.discountPercentage
        );
        break;
    }
  } else {
    // Default sorting by highest discount
    filteredProducts.sort(
      (a: ProductType, b: ProductType) =>
        b.discountPercentage - a.discountPercentage
    );
  }

  // Get categories for filtering
  const categories = [
    ...new Set(offersProducts.map((p: ProductType) => p.category)),
  ] as string[];

  // Calculate savings statistics
  const totalProducts = offersProducts.length;
  const averageDiscount = totalProducts > 0
    ? offersProducts.reduce(
      (sum: number, product: ProductType) => sum + (product.discountPercentage || 0),
      0
    ) / totalProducts
    : 0;

  const maxDiscount = totalProducts > 0
    ? Math.max(...offersProducts.map((p: ProductType) => p.discountPercentage || 0))
    : 0;

  return (
    <Container className="py-10">
      {/* Page Header */}
      <OffersPageHeader maxDiscount={maxDiscount} />

      {/* Hero Section with Stats */}
      <OffersHero
        totalOffers={totalProducts}
        averageDiscount={averageDiscount}
        maxDiscount={maxDiscount}
      />

      {/* Offers List */}
      <OffersList
        products={filteredProducts}
        categories={categories}
        currentSort={params.sort || "discount-high"}
        currentCategory={params.category}
        currentMinDiscount={params.min_discount}
      />
    </Container>
  );
};

export default OffersPage;
