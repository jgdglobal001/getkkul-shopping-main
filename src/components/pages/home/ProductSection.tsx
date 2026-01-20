"use client";

import Link from "next/link";
import Container from "../../Container";
import { ProductType } from "../../../../type";
import EnhancedProductCard from "../../EnhancedProductCard";
import Button from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";

interface Props {
  title: string;
  products: ProductType[];
  viewMoreLink: string;
  subtitle?: string;
  titleKey?: string;
  subtitleKey?: string;
}

const ProductSection = ({ title, products, viewMoreLink, subtitle, titleKey, subtitleKey }: Props) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Limit to 8 products for homepage display
  const displayProducts = products?.slice(0, 8) || [];

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {titleKey ? t(titleKey) : title}
          </h2>
          {(subtitleKey || subtitle) && (
            <p className="text-gray-600 text-sm md:text-base">
              {subtitleKey ? t(subtitleKey) : subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid"
                  ? "bg-theme-color text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list"
                  ? "bg-theme-color text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              title="List View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
          <Link href={viewMoreLink}>
            <Button
              variant="outline"
              size="md"
              className="transition-all duration-300"
            >
              {t("common.view_more")}
            </Button>
          </Link>
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div
          className={`${viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              : "space-y-4"
            }`}
        >
          {displayProducts.map((product: ProductType) => (
            <EnhancedProductCard key={product.id} product={product} view={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {t("common.no_products_available")}
          </p>
        </div>
      )}
    </Container>
  );
};

export default ProductSection;
