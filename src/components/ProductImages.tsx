"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  thumbnail?: string;
  images?: string[];
}

const ProductImages = ({ thumbnail, images = [] }: Props) => {
  // 썸네일을 첫 번째로, 그 다음 추가 이미지들을 배열로 구성
  const allImages = thumbnail
    ? [thumbnail, ...images.filter(img => img !== thumbnail)]
    : images;

  const [currentImage, setCurrentImage] = useState("");

  // allImages가 변경될 때마다 currentImage를 첫 번째 이미지로 설정
  useEffect(() => {
    if (allImages.length > 0) {
      setCurrentImage(allImages[0]);
    }
  }, [allImages]);

  if (!currentImage) {
    return (
      <div className="flex flex-start">
        <div className="bg-gray-100 rounded-md w-full max-h-[550px] relative flex items-center justify-center">
          <p className="text-gray-400">이미지 없음</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-start">
      <div>
        {allImages?.map((item, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 cursor-pointer opacity-80 hover:opacity-100 duration-300 border border-gray-200 mb-1 ${
              currentImage === item && "border-gray-500 rounded-xs opacity-100"
            }`}
            onClick={() => setCurrentImage(item)}
          >
            <Image
              src={item}
              alt="productImage"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
      <div className="bg-gray-100 rounded-md ml-5 w-full max-h-[550px] relative">
        {currentImage && (
          <Image
            src={currentImage}
            alt="mainImage"
            fill
            className="object-contain"
            unoptimized
          />
        )}
      </div>
    </div>
  );
};

export default ProductImages;
