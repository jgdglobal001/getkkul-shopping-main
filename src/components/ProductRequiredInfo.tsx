"use client";

import { ProductType } from "../../type";

interface ProductRequiredInfoProps {
  product: ProductType;
}

const ProductRequiredInfo = ({ product }: ProductRequiredInfoProps) => {
  const requiredInfo = [
    { label: "품명 및 모델명", value: product?.productName || "상품 상세페이지 참조" },
    { label: "크기, 중량", value: product?.size || "상품 상세페이지 참조" },
    { label: "재질", value: product?.material || "상품 상세페이지 참조" },
    { label: "출시년월", value: product?.releaseDate || "상품 상세페이지 참조" },
    { label: "제조국", value: product?.madeInCountry || "상품 상세페이지 참조" },
    { label: "품질보증기준", value: product?.warrantyStandard || "상품 상세페이지 참조" },
    { label: "KC 인증정보", value: product?.kcCertification || "상품 상세페이지 참조" },
    { label: "색상", value: product?.color || "상품 상세페이지 참조" },
    { label: "제품 구성", value: product?.productComposition || "상품 상세페이지 참조" },
    { label: "제조자(수입자)", value: product?.manufacturer || "상품 상세페이지 참조" },
    { label: "상품별 세부 사양", value: product?.detailedSpecs || "상품 상세페이지 참조" },
    { label: "A/S 책임자와 전화번호", value: product?.asResponsible || "상품 상세페이지 참조" },
  ];

  return (
    <div className="bg-white">
      <h3 className="text-base font-semibold text-gray-900 mb-4">필수 표기 정보</h3>

      {/* 필수 표기 정보 그리드: 모바일 1열, 데스크톱 2열 */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-gray-200">
        {requiredInfo.map((info, index) => (
          <div key={index} className="flex border-b border-r border-gray-200 min-h-[48px]">
            {/* 항목 이름: 연한 회색 배경, 고정 너비 */}
            <div className="w-[140px] bg-gray-50 flex items-center px-3 py-2 border-r border-gray-200">
              <p className="text-[11px] md:text-xs font-medium text-gray-600 leading-tight">
                {info.label}
              </p>
            </div>
            {/* 항목 내용: 흰색 배경 */}
            <div className="flex-1 bg-white flex items-center px-3 py-2 overflow-hidden">
              <p className="text-[12px] md:text-sm text-gray-800 leading-snug break-words">
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRequiredInfo;

