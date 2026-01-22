"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface Props {
  thumbnail?: string;
  images?: string[];
}

const ProductImages = ({ thumbnail, images = [] }: Props) => {
  const allImages = Array.from(new Set(thumbnail ? [thumbnail, ...images] : images));
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [thumbnail, images]);

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-50 flex items-center justify-center rounded-xl min-h-[400px]">
        <p className="text-gray-400">이미지 없음</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* 1. 모바일 뷰: 메인 큰 이미지 영역 (상단 고정) */}
      <div className="block md:hidden relative w-full aspect-square bg-white border-b border-gray-100 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allImages.map((image, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center bg-white"
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`상품 이미지 ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        {/* 인디케이터 (모바일용) */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={twMerge(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm",
                  activeIndex === index ? "bg-blue-500 w-4" : "bg-gray-300 shadow-inner"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. 데스크톱 뷰: 썸네일과 메인 이미지 영역의 물리적 분리 */}
      <div className="hidden md:flex flex-row gap-4 w-full relative">
        {/* 썸네일 전용 컬럼: 고정폭 확보 */}
        <div className="flex flex-col gap-2 w-20 flex-shrink-0 relative">
          {allImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                "relative aspect-square cursor-pointer border-2 transition-all rounded-lg overflow-hidden bg-white z-20",
                activeIndex === index ? "border-amazonOrangeDark shadow-md" : "border-gray-100 hover:border-gray-200"
              )}
            >
              <Image
                src={image}
                alt={`썸네일 ${index + 1}`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* 메인 이미지 영역: 썸네일과 분리된 독립 컨테이너 */}
        <div className="relative flex-1 aspect-square bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm min-h-[500px]">
          <Image
            src={allImages[activeIndex]}
            alt="상품 메인 이미지"
            fill
            className="object-contain p-2"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
