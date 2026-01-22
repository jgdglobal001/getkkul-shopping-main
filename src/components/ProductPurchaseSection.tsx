"use client";

import React, { useState, useCallback } from "react";
import { ProductType, ProductOption, ProductVariant } from "../../type";
import ProductOptionSelector from "./ProductOptionSelector";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

interface ProductPurchaseSectionProps {
  product: ProductType;
  options?: ProductOption[];
  variants?: ProductVariant[];
  // 추가된 Props
  selectedVariant: ProductVariant | null;
  quantity: number;
  onVariantChange: (variant: ProductVariant | null, qty: number) => void;
  showButtons?: boolean;
}

const ProductPurchaseSection: React.FC<ProductPurchaseSectionProps> = ({
  product,
  options = [],
  variants = [],
  selectedVariant,
  quantity,
  onVariantChange,
  showButtons = true,
}) => {
  const hasOptions = product.hasOptions && options.length > 0;

  // 옵션 선택 핸들러
  const handleVariantSelect = useCallback((variant: ProductVariant | null, qty: number) => {
    onVariantChange(variant, qty);
  }, [onVariantChange]);

  // 장바구니/구매에 전달할 상품 데이터
  const getProductForCart = () => {
    if (hasOptions && selectedVariant) {
      return {
        ...product,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
        quantity: quantity,
        selectedVariant: selectedVariant,
        selectedOptions: selectedVariant.optionCombination,
      };
    }
    return product;
  };

  // 옵션 상품인데 옵션이 선택되지 않은 경우
  const isDisabled = hasOptions && !selectedVariant;

  return (
    <div className="flex flex-col gap-2">
      {/* 옵션 선택 UI */}
      {hasOptions && (
        <ProductOptionSelector
          options={options}
          variants={variants}
          onVariantSelect={handleVariantSelect}
          basePrice={product.price}
        />
      )}

      {/* 단일 상품 수량 선택 */}
      {!hasOptions && (
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">수량:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onVariantChange(null, Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50 transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
            <button
              type="button"
              onClick={() => onVariantChange(null, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 장바구니/구매 버튼 (조건부 노출) */}
      {showButtons && (
        <div className="hidden md:grid grid-cols-2 gap-3 mt-2">
          <AddToCartButton
            product={getProductForCart()}
            className="w-full h-12 uppercase font-bold rounded-lg"
            disabled={isDisabled || false}
            quantity={quantity}
            selectedVariant={selectedVariant}
          />
          <BuyNowButton
            product={getProductForCart()}
            className="w-full h-12 uppercase font-bold rounded-lg"
            disabled={isDisabled || false}
            quantity={quantity}
            variant={selectedVariant}
          />
        </div>
      )}

      {/* 옵션 미선택 시 안내 */}
      {isDisabled && (
        <p className="text-sm text-red-500 text-center">
          옵션을 선택해주세요
        </p>
      )}
    </div>
  );
};

export default ProductPurchaseSection;

