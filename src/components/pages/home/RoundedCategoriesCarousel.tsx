"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";

interface Category {
  slug: string;
  name: string;
  url: string;
  image: string;
  itemCount: number;
  description: string;
}

interface RoundedCategoriesCarouselProps {
  categories: Category[];
}

// Direct Korean category names mapping (as fallback)
const koreanCategoryNames: { [key: string]: string } = {
  beauty: "뷰티",
  fragrances: "향수",
  furniture: "가구",
  groceries: "식품",
  "home-decoration": "홈 데코",
  "kitchen-accessories": "주방용품",
  laptops: "노트북",
  "mens-shirts": "남성 셔츠",
  "mens-shoes": "남성 신발",
  "mens-watches": "남성 시계",
  "mobile-accessories": "휴대폰 액세서리",
  motorcycle: "오토바이",
  "skin-care": "스킨케어",
  smartphones: "스마트폰",
  "sports-accessories": "스포츠 액세서리",
  sunglasses: "선글라스",
  tablets: "태블릿",
  tops: "상의",
  vehicle: "자동차",
  "womens-bags": "여성 가방",
  "womens-dresses": "여성 드레스",
  "womens-jewellery": "여성 주얼리",
  "womens-shoes": "여성 신발",
  "womens-watches": "여성 시계",
};

// Direct Korean category descriptions mapping (as fallback)
const koreanCategoryDescriptions: { [key: string]: string } = {
  beauty: "프리미엄 뷰티 제품 및 화장품",
  fragrances: "고급 향수 및 향료",
  furniture: "집을 위한 스타일리시한 가구",
  groceries: "신선한 식품 및 필수품",
  "home-decoration": "아름다운 홈 데코 아이템",
  "kitchen-accessories": "필수 주방 도구",
  laptops: "고성능 노트북",
  "mens-shirts": "남성용 스타일리시한 셔츠",
  "mens-shoes": "편안하고 유행스러운 신발",
  "mens-watches": "남성용 우아한 타임피스",
  "mobile-accessories": "모바일 기기 액세서리",
  motorcycle: "오토바이 기어 및 액세서리",
  "skin-care": "프리미엄 스킨케어 제품",
  smartphones: "최신 스마트폰 및 기기",
  "sports-accessories": "스포츠 용품 및 장비",
  sunglasses: "스타일리시한 안경 및 선글라스",
  tablets: "태블릿 및 디지털 액세서리",
  tops: "트렌디한 상의 및 캐주얼 의류",
  vehicle: "자동차 액세서리 및 부품",
  "womens-bags": "패셔너블한 가방 및 핸드백",
  "womens-dresses": "모든 경우에 적합한 우아한 드레스",
  "womens-jewellery": "아름다운 주얼리 및 액세서리",
  "womens-shoes": "여성용 스타일리시한 신발",
  "womens-watches": "여성용 우아한 시계",
};

const RoundedCategoriesCarousel: React.FC<RoundedCategoriesCarouselProps> = ({
  categories,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 6; // xl
      if (window.innerWidth >= 1024) return 5; // lg
      if (window.innerWidth >= 768) return 4; // md
      if (window.innerWidth >= 640) return 3; // sm
      return 2; // xs
    }
    return 6;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);

      // Reset currentIndex if it goes out of bounds after resize
      const newMaxIndex = Math.max(0, categories.length - newItemsPerView);
      setCurrentIndex((prev) => Math.min(prev, newMaxIndex));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories.length]);

  const maxIndex = Math.max(0, categories.length - itemsPerView);
  const needsScrolling = categories.length > itemsPerView;

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch/Mouse drag handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentIndex);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const x = clientX;
    const walk = (startX - x) / 100;
    const newIndex = Math.round(scrollLeft + walk);

    // Constrain the index to valid boundaries
    const constrainedIndex = Math.max(0, Math.min(maxIndex, newIndex));
    setCurrentIndex(constrainedIndex);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  if (!categories.length) {
    return null;
  }

  // Helper function to get translated category name
  const getCategoryName = (slug: string, originalName: string) => {
    // First, try to use the direct mapping (primary source of truth)
    if (koreanCategoryNames[slug]) {
      return koreanCategoryNames[slug];
    }
    
    // Then, try i18n translation
    try {
      const translationKey = `categories.${slug.replace(/-/g, '_')}_name`;
      const translated = t(translationKey);
      // If translation doesn't exist, it returns the key itself
      if (translated && translated !== translationKey) {
        return translated;
      }
    } catch (error) {
      console.error(`Error translating category name for slug: ${slug}`, error);
    }
    
    // Fallback to original name
    return originalName;
  };

  // Helper function to get translated category description
  const getCategoryDescription = (slug: string, originalDesc: string) => {
    // First, try to use the direct mapping (primary source of truth)
    if (koreanCategoryDescriptions[slug]) {
      return koreanCategoryDescriptions[slug];
    }
    
    // Then, try i18n translation
    try {
      const translationKey = `categories.${slug.replace(/-/g, '_')}_desc`;
      const translated = t(translationKey);
      if (translated && translated !== translationKey) {
        return translated;
      }
    } catch (error) {
      console.error(`Error translating category description for slug: ${slug}`, error);
    }
    
    // Fallback to original description
    return originalDesc;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <Container className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("home.shop_by_category")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("home.discover_diverse_range")}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-4 md:mx-0">
          {/* Navigation Buttons */}
          {needsScrolling && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-[30%] -translate-y-1/2 z-10 border border-gray-200 rounded-full p-3 transition-all duration-300 group -ml-6 ${
                  currentIndex === 0
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 cursor-pointer"
                }`}
                aria-label="Previous categories"
              >
                <FaArrowLeft
                  className={`transition-colors duration-300 ${
                    currentIndex === 0
                      ? "text-gray-400"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`}
                />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex === maxIndex}
                className={`absolute right-0 top-[30%] -translate-y-1/2 z-10 border border-gray-200 rounded-full p-3 transition-all duration-300 group -mr-6 ${
                  currentIndex === maxIndex
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 cursor-pointer"
                }`}
                aria-label="Next categories"
              >
                <FaArrowRight
                  className={`transition-colors duration-300 ${
                    currentIndex === maxIndex
                      ? "text-gray-400"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`}
                />
              </button>
            </>
          )}

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseLeave={handleEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentIndex / categories.length) * 100
                }%)`,
                width: `${(categories.length / itemsPerView) * 100}%`,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / categories.length}%` }}
                >
                  <Link href={`/products?category=${category.slug}`}>
                    <div className="group cursor-pointer">
                      {/* Image Container with Enhanced Shadow */}
                      <div className="relative mb-4 rounded-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform">
                        {/* Multiple layered shadows for depth */}
                        <div className="absolute inset-0 rounded-full shadow-inner"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 via-transparent to-white/20"></div>

                        <div className="overflow-hidden w-full h-full rounded-full relative">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>

                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Item count badge */}
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                          {category.itemCount}
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="text-center space-y-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-sm lg:text-base">
                          {getCategoryName(category.slug, category.name)}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 px-1">
                          {getCategoryDescription(category.slug, category.description)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {needsScrolling && maxIndex > 0 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            {t("common.view_all_categories")}
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default RoundedCategoriesCarousel;
