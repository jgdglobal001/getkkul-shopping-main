"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface FeaturedCategory {
  nameKey: string;
  slug: string;
  image: string;
  itemCount: number;
  descriptionKey: string;
}

const featuredCategoriesData: FeaturedCategory[] = [
  {
    nameKey: "categories.electronics",
    slug: "smartphones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    itemCount: 25,
    descriptionKey: "categories.smartphones_gadgets",
  },
  {
    nameKey: "categories.fashion",
    slug: "mens-shirts",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop",
    itemCount: 40,
    descriptionKey: "categories.clothing_accessories",
  },
  {
    nameKey: "categories.beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    itemCount: 30,
    descriptionKey: "categories.premium_beauty",
  },
  {
    nameKey: "categories.home_living",
    slug: "furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    itemCount: 20,
    descriptionKey: "categories.furniture_decor",
  },
];

const FeaturedCategories: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("home.shop_by_category")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("home.discover_collections")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredCategoriesData.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
            >
              <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={t(category.nameKey)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {category.itemCount}{t("home.items")}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {t(category.nameKey)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {t(category.descriptionKey)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium text-sm">
                      {t("common.view")}
                    </span>
                    <FiArrowRight className="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {t("navigation.categories")}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
