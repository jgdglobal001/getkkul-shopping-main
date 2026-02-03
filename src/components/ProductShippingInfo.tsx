"use client";

import React from "react";
import { ProductType } from "../../type";
import { useTranslation } from "react-i18next";

interface ProductShippingInfoProps {
    product: ProductType;
}

const ProductShippingInfo: React.FC<ProductShippingInfoProps> = ({ product }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-12 bg-white">
            {/* 배송정보 섹션 */}
            <div className="py-6 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t("shipping.info")}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-gray-200">
                    {[
                        { label: t("shipping.method"), value: product?.shippingMethod || t("shipping.standard") },
                        { label: t("shipping.cost"), value: product?.shippingCost || t("shipping.free_threshold_desc") },
                        { label: t("shipping.bundle"), value: product?.bundleShipping || t("shipping.available") },
                        { label: t("shipping.period"), value: product?.shippingPeriod || t("shipping.delivery_window") },
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t("shipping.exchange_return_info")}</h3>

                <div className="grid grid-cols-1 border-t border-l border-gray-200">
                    {[
                        { label: t("shipping.exchange_return_cost"), value: product?.exchangeReturnCost || t("shipping.exchange_cost_desc") },
                        { label: t("shipping.exchange_return_deadline"), value: product?.exchangeReturnDeadline || t("shipping.deadline_desc") },
                        { label: t("shipping.exchange_return_limitations"), value: product?.exchangeReturnLimitations || t("shipping.packing_unopened") },
                        ...(product?.clothingLimitations ? [{ label: t("shipping.clothing_limitations"), value: product.clothingLimitations }] : [{ label: t("shipping.clothing_limitations"), value: t("shipping.tag_removed") }]),
                        ...(product?.foodLimitations ? [{ label: t("shipping.food_limitations"), value: product.foodLimitations }] : [{ label: t("shipping.food_limitations"), value: t("shipping.fresh_food_notice") }]),
                        ...(product?.electronicsLimitations ? [{ label: t("shipping.electronics_limitations"), value: product.electronicsLimitations }] : [{ label: t("shipping.electronics_limitations"), value: t("shipping.installed_notice") }]),
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t("shipping.seller_info")}</h3>

                <div className="grid grid-cols-1 border-t border-l border-gray-200">
                    {[
                        { label: t("shipping.seller"), value: product?.sellerName || "겟꿀쇼핑" },
                        { label: t("shipping.seller_phone"), value: product?.sellerPhone || "010-7218-2858" },
                        { label: t("shipping.legal_notice"), value: product?.sellerLegalNotice || t("shipping.minor_contract_notice") },
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

export default ProductShippingInfo;
