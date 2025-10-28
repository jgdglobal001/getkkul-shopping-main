"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface OffersPageHeaderProps {
  maxDiscount: number;
}

const OffersPageHeader: React.FC<OffersPageHeaderProps> = ({ maxDiscount }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        🔥 {t("offers.title")}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
        {t("offers.description", {
          discount: Math.round(maxDiscount),
        })}
      </p>

      {/* Breadcrumb */}
      <nav className="text-sm">
        <ol className="flex items-center justify-center space-x-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              {t("navigation.home")}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">
            {t("offers.breadcrumb_offers")}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default OffersPageHeader;