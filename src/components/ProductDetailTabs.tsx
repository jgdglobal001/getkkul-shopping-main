"use client";

import { useState } from "react";
import { ProductType } from "../../type";
import Image from "next/image";

interface ProductDetailTabsProps {
  product: ProductType;
}

const ProductDetailTabs = ({ product }: ProductDetailTabsProps) => {
  const [expandedDetail, setExpandedDetail] = useState(false);

  return (
    <div className="space-y-8 bg-white">
      {/* 상품상세 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">상품상세</h3>

        {/* 상세 이미지 */}
        {product?.detailImages && product.detailImages.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-center">
              <div className={`w-full max-w-2xl space-y-4 ${!expandedDetail ? 'max-h-96 overflow-hidden' : ''}`}>
                {product.detailImages.map((image, index) => (
                  <div key={index} className="relative w-full rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={image}
                      alt={`상품 이미지 ${index + 1}`}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 더보기 버튼: 쿠팡 스타일의 세련된 디자인으로 개편 */}
        {!expandedDetail && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setExpandedDetail(true)}
              className="w-full max-w-sm py-4 px-6 border border-theme-color text-theme-color font-bold rounded-lg hover:bg-theme-color/5 transition-all flex items-center justify-center gap-3 shadow-sm group"
            >
              <span className="text-lg">상품정보 더보기</span>
              <svg className="w-6 h-6 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* 전체 상세 내용 */}
        {expandedDetail && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{product?.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailTabs;

