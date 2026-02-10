"use client";

import { useTranslation } from "react-i18next";
import { ProductType } from "../../type";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: ProductType[];
  currentProductId: number;
  category: string;
}

const RelatedProducts = ({
  products,
  currentProductId,
  category,
}: RelatedProductsProps) => {
  const { t } = useTranslation();

  // Filter products by same category and exclude current product
  const relatedProducts = products
    .filter(
      (product) =>
        product.category === category && product.id !== currentProductId
    )
    .slice(0, 4); // Show only 4 related products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="pt-6 pb-12 bg-gray-50">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t("product.related_products")}
        </h3>
        <p className="text-gray-600">{t("product.you_might_also_like")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
