import Container from "@/components/Container";
import { getData } from "../helpers";
import OffersHero from "@/components/pages/offers/OffersHero";
import { ProductType } from "../../../../type";
import OffersList from "@/components/pages/offers/OffersList";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// 동적 렌더링 설정 (DB 쿼리 때문에)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "특가 상품 - Getkkul-shopping",
  description:
    "최고의 상품들을 특가로 만나보세요! 전자제품, 패션, 뷰티 등 다양한 카테고리에서 큰 할인 혜택을 누리세요!",
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

  // DB에서 할인 상품 조회
  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      discountPercentage: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
  });

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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🔥 Special Offers
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Don&apos;t miss out on these incredible deals! Save big on your
          favorite products with discounts up to {Math.round(maxDiscount)}% off.
        </p>

        {/* Breadcrumb */}
        <nav className="text-sm">
          <ol className="flex items-center justify-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Special Offers</li>
          </ol>
        </nav>
      </div>

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
