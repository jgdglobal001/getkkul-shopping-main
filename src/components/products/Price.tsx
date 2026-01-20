"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PriceProps {
  allProducts?: any[];
}

const Price = ({ allProducts = [] }: PriceProps) => {
  const { t } = useTranslation();
  const { selectedCurrency, convertPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMinPrice = searchParams.get("min_price");
  const currentMaxPrice = searchParams.get("max_price");

  const handlePriceClick = (minPrice: number, maxPrice: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("min_price", minPrice.toString());
    current.set("max_price", maxPrice.toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`);
  };

  // Format price helper (similar to SearchInput)
  const formatPriceLabel = (amount: number) => {
    // Round for currencies that don't use decimals (KRW, CNY)
    const noDecimalCurrencies = ["KRW", "JPY", "CNY"];
    const useDecimals = !noDecimalCurrencies.includes(selectedCurrency);
    const locale = selectedCurrency === "KRW" ? "ko-KR" : "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: useDecimals ? 2 : 0,
      maximumFractionDigits: useDecimals ? 2 : 0,
    }).format(Math.round(amount));
  };

  // Generate dynamic price ranges based on product data or standard KRW scales
  const generatePriceRanges = () => {
    // Standard KRW ranges since DB products are in KRW
    const ranges = [
      { min: 0, max: 5000 },
      { min: 5000, max: 10000 },
      { min: 10000, max: 20000 },
      { min: 20000, max: 30000 },
      { min: 30000, max: 50000 },
    ];

    if (allProducts.length > 0) {
      const prices = allProducts
        .map((product: any) => product.price)
        .sort((a: number, b: number) => a - b);
      const maxPrice = Math.ceil(prices[prices.length - 1] || 50000);

      // Add the final range up to the actual max price if it's higher
      if (maxPrice > 50000) {
        ranges.push({ min: 50000, max: maxPrice });
      } else {
        // Ensure we cover up to the max price found in the current set
        ranges.push({ min: 50000, max: Math.max(maxPrice, 100000) });
      }
    }

    return ranges;
  };

  const priceRanges = generatePriceRanges();

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {t("filters.shop_by_price")}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4">
              <div className="space-y-2">
                {priceRanges.map((range, index) => {
                  const isActive =
                    currentMinPrice === range.min.toString() &&
                    currentMaxPrice === range.max.toString();
                  const priceRangeId = `price-${range.min}-${range.max}`;

                  // Convert internal KRW ranges to selected currency for display
                  const displayMin = convertPrice(range.min, "KRW");
                  const displayMax = convertPrice(range.max, "KRW");

                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={priceRangeId}
                        name="priceRange"
                        checked={isActive}
                        onChange={() => handlePriceClick(range.min, range.max)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                      <button
                        onClick={() => handlePriceClick(range.min, range.max)}
                        className={`ml-2 text-sm font-medium transition-colors flex-1 text-left ${isActive ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
                          }`}
                      >
                        {formatPriceLabel(displayMin)} - {formatPriceLabel(displayMax)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Price;
