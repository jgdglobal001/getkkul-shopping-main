export const runtime = 'edge';

import Container from "@/components/Container";
import { getData } from "../helpers";
import OffersHero from "@/components/pages/offers/OffersHero";
import OffersPageHeader from "@/components/pages/offers/OffersPageHeader";
import { ProductType } from "../../../../type";
import OffersList from "@/components/pages/offers/OffersList";
import Link from "next/link";
import { db, products } from "@/lib/db";
import { eq, gt, desc, and } from "drizzle-orm";

// ?™ì  ?Œë”ë§??¤ì • (DB ì¿¼ë¦¬ ?Œë¬¸??
export const dynamic = "force-dynamic";

export const metadata = {
  title: "?¹ê? ?í’ˆ - Getkkul-shopping",
  description:
    "ìµœê³ ???í’ˆ?¤ì„ ?¹ê?ë¡?ë§Œë‚˜ë³´ì„¸?? ?„ì?œí’ˆ, ?¨ì…˜, ë·°í‹° ???¤ì–‘??ì¹´í…Œê³ ë¦¬?ì„œ ??? ì¸ ?œíƒ???„ë¦¬?¸ìš”!",
};

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

  // DB?ì„œ ? ì¸ ?í’ˆ ì¡°íšŒ
  const dbProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), gt(products.discountPercentage, 0)))
    .orderBy(desc(products.createdAt));

  let products = [...dbProducts];
  const offersProducts = products;

  // Apply additional filters
  if (params.category) {
    products = offersProducts.filter(
      (product: ProductType) =>
        product.category.toLowerCase() === params.category!.toLowerCase()
    );
  } else {
    products = offersProducts;
  }

  // Filter by minimum discount percentage
  if (params.min_discount) {
    const minDiscount = parseFloat(params.min_discount);
    products = products.filter(
      (product: ProductType) => product.discountPercentage >= minDiscount
    );
  }

  // Sort products
  if (params.sort) {
    switch (params.sort) {
      case "discount-high":
        products.sort(
          (a: ProductType, b: ProductType) =>
            b.discountPercentage - a.discountPercentage
        );
        break;
      case "discount-low":
        products.sort(
          (a: ProductType, b: ProductType) =>
            a.discountPercentage - b.discountPercentage
        );
        break;
      case "price-low":
        products.sort((a: ProductType, b: ProductType) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a: ProductType, b: ProductType) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a: ProductType, b: ProductType) =>
          a.title.localeCompare(b.title)
        );
        break;
      case "rating":
        products.sort(
          (a: ProductType, b: ProductType) => (b.rating || 0) - (a.rating || 0)
        );
        break;
      default:
        // Default: highest discount first
        products.sort(
          (a: ProductType, b: ProductType) =>
            b.discountPercentage - a.discountPercentage
        );
        break;
    }
  } else {
    // Default sorting by highest discount
    products.sort(
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
  const averageDiscount =
    offersProducts.reduce(
      (sum: number, product: ProductType) => sum + product.discountPercentage,
      0
    ) / totalProducts;

  const maxDiscount = Math.max(
    ...offersProducts.map((p: ProductType) => p.discountPercentage)
  );

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
        products={products}
        categories={categories}
        currentSort={params.sort || "discount-high"}
        currentCategory={params.category}
        currentMinDiscount={params.min_discount}
      />
    </Container>
  );
};

export default OffersPage;
