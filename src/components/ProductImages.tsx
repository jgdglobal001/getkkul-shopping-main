"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  thumbnail?: string;
  images?: string[];
}

const ProductImages = ({ thumbnail, images = [] }: Props) => {
  // 썸네일을 첫 번째로, 그 다음 추가 이미지들을 배열로 구성
  // 소비자는 썸네일을 클릭하거나 추가 이미지를 클릭해서 선택 가능
  const allImages = thumbnail
    ? [thumbnail, ...images.filter(img => img !== thumbnail)]
    : images;

  // 현재 표시되는 이미지 (초기값: 썸네일)
  const [currentImage, setCurrentImage] = useState(thumbnail || "");

  // 페이지 로드 시 또는 상품이 변경될 때 썸네일로 리셋
  // 자동으로 이미지가 변경되지 않음 - 소비자가 클릭할 때만 변경됨
  useEffect(() => {
    if (thumbnail) {
      setCurrentImage(thumbnail);
    } else if (images && images.length > 0) {
      setCurrentImage(images[0]);
    }
  }, [thumbnail]);

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
