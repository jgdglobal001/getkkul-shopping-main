"use client";

import { ProductType } from "@/type";

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
    <div className="py-6 bg-white border-t border-gray-200">
      <h3 className="text-base font-semibold text-gray-900 mb-4">필수 표기 정보</h3>

      {/* 필수 표기 정보 2열 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {requiredInfo.map((info, index) => (
          <div key={index} className="border border-gray-200 p-3 rounded flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">{info.label}</p>
            <p className="text-sm text-gray-800">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRequiredInfo;

