"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiTag,
  FiTrendingDown,
  FiPercent,
  FiShoppingBag,
} from "react-icons/fi";

interface OffersHeroProps {
  totalOffers: number;
  averageDiscount: number;
  maxDiscount: number;
}

const OffersHero: React.FC<OffersHeroProps> = ({
  totalOffers,
  averageDiscount,
  maxDiscount,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-2xl p-8 mb-12 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Offers */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalOffers}</div>
          <div className="text-white/80 text-sm">{t("offers.products_on_sale")}</div>
        </div>

        {/* Average Discount */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiPercent className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.round(averageDiscount)}%
          </div>
          <div className="text-white/80 text-sm">{t("offers.average_discount")}</div>
        </div>

        {/* Max Discount */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiTrendingDown className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.round(maxDiscount)}%
          </div>
          <div className="text-white/80 text-sm">{t("offers.maximum_discount")}</div>
        </div>

        {/* Special Badge */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FiTag className="w-8 h-8" />
          </div>
          <div className="text-lg font-bold mb-1">{t("offers.limited_time")}</div>
          <div className="text-white/80 text-sm">{t("offers.exclusive_deals")}</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {t("offers.mega_sale_event")}
        </h2>
        <p className="text-white/90 text-lg">
          {t("offers.hurry_up_deals")}
        </p>
      </div>
    </div>
  );
};

export default OffersHero;
