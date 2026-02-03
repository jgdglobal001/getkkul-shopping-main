"use client";

import Image from "next/image";
import { ProductFormData } from "../utils/product-types";
import { FiImage, FiX } from "react-icons/fi";
import { useState } from "react";

interface ImagesManagerProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
  newImage: string;
  onNewImageChange: (value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (image: string) => void;
  newDetailImage: string;
  onNewDetailImageChange: (value: string) => void;
  onAddDetailImage: () => void;
  onRemoveDetailImage: (image: string) => void;
}

export const ImagesManager = ({
  formData,
  onInputChange,
  newImage,
  onNewImageChange,
  onAddImage,
  onRemoveImage,
  newDetailImage,
  onNewDetailImageChange,
  onAddDetailImage,
  onRemoveDetailImage,
}: ImagesManagerProps) => {
  const [showThumbnailPreview, setShowThumbnailPreview] = useState(true);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiImage className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">이미지 관리</h2>
      </div>

      <div className="space-y-6">
        {/* 썸네일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            썸네일 이미지 URL
          </label>
          <input
            type="text"
            value={formData.thumbnail}
            onChange={(e) => onInputChange("thumbnail", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && showThumbnailPreview && (
            <div className="mt-4 relative">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-contain"
                  onError={() => setShowThumbnailPreview(false)}
                  unoptimized={true}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 상품 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지 URL
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newImage}
              onChange={(e) => onNewImageChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onAddImage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              placeholder="이미지 URL을 입력하고 추가 버튼을 클릭하세요"
            />
            <button
              type="button"
              onClick={onAddImage}
              className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors"
            >
              추가
            </button>
          </div>

          {/* 이미지 목록 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-contain"
                    unoptimized={true}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 상세 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세 설명 이미지 URL
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newDetailImage}
              onChange={(e) => onNewDetailImageChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onAddDetailImage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              placeholder="상세 이미지 URL"
            />
            <button
              type="button"
              onClick={onAddDetailImage}
              className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors"
            >
              추가
            </button>
          </div>

          {/* 상세 이미지 목록 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.detailImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Detail image ${idx + 1}`}
                    fill
                    className="object-contain"
                    unoptimized={true}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveDetailImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};