"use client";

import { useState } from "react";
import { ProductType } from "@/type";
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
              <div className="w-full max-w-2xl space-y-4">
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

        {/* 더보기 버튼 */}
        {!expandedDetail && (
          <button
            onClick={() => setExpandedDetail(true)}
            className="w-full py-3 text-center text-theme-color font-semibold hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            상품정보 더보기
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        {/* 전체 상세 내용 */}
        {expandedDetail && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{product?.description}</p>
          </div>
        )}
      </div>

      {/* 배송정보 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">배송정보</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">배송방법</h4>
            <p className="text-gray-600">{product?.shippingMethod || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">배송비</h4>
            <p className="text-gray-600">{product?.shippingCost || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">묶음배송 여부</h4>
            <p className="text-gray-600">{product?.bundleShipping || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">배송기간</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{product?.shippingPeriod || "정보 없음"}</p>
          </div>
        </div>
      </div>

      {/* 교환/반품 안내 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">교환/반품 안내</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">교환/반품 비용</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{product?.exchangeReturnCost || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">교환/반품 신청 기준일</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{product?.exchangeReturnDeadline || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">교환/반품 제한사항</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{product?.exchangeReturnLimitations || "정보 없음"}</p>
          </div>
          {product?.clothingLimitations && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">의류/잡화 제한사항</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{product.clothingLimitations}</p>
            </div>
          )}
          {product?.foodLimitations && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">식품/화장품 제한사항</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{product.foodLimitations}</p>
            </div>
          )}
          {product?.electronicsLimitations && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">전자/가전 제한사항</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{product.electronicsLimitations}</p>
            </div>
          )}
        </div>
      </div>

      {/* 판매자 정보 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">판매자 정보</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">판매자</h4>
            <p className="text-gray-600">{product?.sellerName || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">판매자 전화번호</h4>
            <p className="text-gray-600">{product?.sellerPhone || "정보 없음"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">법적 고지사항</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{product?.sellerLegalNotice || "정보 없음"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTabs;

