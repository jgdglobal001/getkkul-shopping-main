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

      {/* 배송정보 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">배송정보</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-gray-200">
          {[
            { label: "배송방법", value: product?.shippingMethod || "일반배송" },
            { label: "배송비", value: product?.shippingCost || "3,000원" },
            { label: "묶음배송 여부", value: product?.bundleShipping || "가능" },
            { label: "배송기간", value: product?.shippingPeriod || "주문 후 1-2일 이내 배송" },
          ].map((item, index) => (
            <div key={index} className="flex border-b border-r border-gray-200 min-h-[48px]">
              <div className="w-[140px] bg-gray-50 flex items-center px-3 py-2 border-r border-gray-200">
                <p className="text-[11px] md:text-xs font-medium text-gray-600 leading-tight whitespace-pre-wrap">
                  {item.label}
                </p>
              </div>
              <div className="flex-1 bg-white flex items-center px-3 py-2 overflow-hidden">
                <p className="text-[12px] md:text-sm text-gray-800 leading-snug break-words">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 교환/반품 안내 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">교환/반품 안내</h3>

        <div className="grid grid-cols-1 border-t border-l border-gray-200">
          {[
            { label: "교환/반품 비용", value: product?.exchangeReturnCost || "초도배송비(편도) 3000원\n반품배송비(편도) 3,000원\n*고객사유로 인한 반품 시, 왕복 반품/배송비는 초도배송비 + 반품배송비의 합계인 6,000 원 이 청구됩니다*" },
            { label: "교환/반품 신청 기준일", value: product?.exchangeReturnDeadline || "제품 수령 후 7일 이내" },
            { label: "교환/반품 제한사항", value: product?.exchangeReturnLimitations || "포장 개봉시 상품은 반품 불가" },
            ...(product?.clothingLimitations ? [{ label: "의류/잡화 제한사항", value: product.clothingLimitations }] : [{ label: "의류/잡화 제한사항", value: "테그 제거 시 반품 불가" }]),
            ...(product?.foodLimitations ? [{ label: "식품/화장품 제한사항", value: product.foodLimitations }] : [{ label: "식품/화장품 제한사항", value: "신성/냉장/냉동 상품은 단순변심 반품 불가" }]),
            ...(product?.electronicsLimitations ? [{ label: "전자/가전 제한사항", value: product.electronicsLimitations }] : [{ label: "전자/가전 제한사항", value: "설치 후 반품 불가" }]),
          ].map((item, index) => (
            <div key={index} className="flex border-b border-r border-gray-200 min-h-[48px]">
              <div className="w-[140px] bg-gray-50 flex items-center px-3 py-2 border-r border-gray-200">
                <p className="text-[11px] md:text-xs font-medium text-gray-600 leading-tight whitespace-pre-wrap">
                  {item.label}
                </p>
              </div>
              <div className="flex-1 bg-white flex items-center px-3 py-2 overflow-hidden">
                <p className="text-[12px] md:text-sm text-gray-800 leading-snug break-words whitespace-pre-wrap">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 판매자 정보 섹션 */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">판매자 정보</h3>

        <div className="grid grid-cols-1 border-t border-l border-gray-200">
          {[
            { label: "판매자", value: product?.sellerName || "겟꿀쇼핑" },
            { label: "판매자 전화번호", value: product?.sellerPhone || "010-7218-2858" },
            { label: "법적 고지사항", value: product?.sellerLegalNotice || "미성년자가 체결한 계약은 법정 대리인이 동의하지 않는 경우 본은 또는 법정대리인이 취소할 수 있습니다." },
          ].map((item, index) => (
            <div key={index} className="flex border-b border-r border-gray-200 min-h-[48px]">
              <div className="w-[140px] bg-gray-50 flex items-center px-3 py-2 border-r border-gray-200">
                <p className="text-[11px] md:text-xs font-medium text-gray-600 leading-tight whitespace-pre-wrap">
                  {item.label}
                </p>
              </div>
              <div className="flex-1 bg-white flex items-center px-3 py-2 overflow-hidden">
                <p className="text-[12px] md:text-sm text-gray-800 leading-snug break-words whitespace-pre-wrap">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTabs;

