"use client";

import { useTranslation } from "react-i18next";
import { ProductType } from "@/type";

interface ProductDetailsInfoProps {
  product: ProductType;
}

export default function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <p>
        {t("product.you_are_saving")}{" "}
        <span className="text-base font-semibold text-green-500">
          ₩{Math.round(product?.price * (product?.discountPercentage / 100))}
        </span>{" "}
        {t("product.upon_purchase")}
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
      <p>
        {t("product.tags")}:{" "}
        {product?.tags?.map((item, index) => (
          <span key={index.toString()} className="font-medium capitalize">
            {item}
            {index < product?.tags?.length - 1 && ", "}
          </span>
        ))}
      </p>
    </div>
  );
}