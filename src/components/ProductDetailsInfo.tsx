"use client";

import { useTranslation } from "react-i18next";
import { ProductType } from "@/type";
import PriceFormat from "./PriceFormat";

interface ProductDetailsInfoProps {
  product: ProductType;
}

export default function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-green-600 font-semibold">
        <PriceFormat
          amount={Math.round(product?.price * (product?.discountPercentage / 100))}
          className="text-base text-green-500"
        />
        {t("product.discount_message")}
      </p>
      <div>
        <p className="text-sm tracking-wide">{product?.description}</p>
        <p className="text-base">{product?.warrantyInformation}</p>
      </div>
      <p>
        {t("common.brand")}: <span className="font-medium">{product?.brand}</span>
      </p>
      <p>
        {t("common.category")}:{" "}
        <span className="font-medium capitalize">{product?.category}</span>
      </p>
      {/*
        태그는 소비자에게 숨김 처리
        추후 파트너(판매자) 전용 페이지에서만 표시 예정
        TODO: 파트너스 시스템 구축 시 파트너 권한 체크 후 표시
      */}
    </div>
  );
}