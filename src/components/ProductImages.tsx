"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  return (
    <div className="flex flex-start">
      <div>
        {images?.map((item, index) => (
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
