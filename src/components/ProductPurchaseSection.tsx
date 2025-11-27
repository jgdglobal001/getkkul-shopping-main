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
}

const ProductPurchaseSection: React.FC<ProductPurchaseSectionProps> = ({
  product,
  options = [],
  variants = [],
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const hasOptions = product.hasOptions && options.length > 0;

  // 옵션 선택 핸들러
  const handleVariantSelect = useCallback((variant: ProductVariant | null, qty: number) => {
    setSelectedVariant(variant);
    setQuantity(qty);
  }, []);

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
    <div className="flex flex-col gap-4">
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
          <span className="text-gray-600">수량:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 장바구니/구매 버튼 */}
      <div className="flex flex-col gap-3">
        <AddToCartButton
          product={getProductForCart()}
          className="rounded-md uppercase font-semibold"
          disabled={isDisabled}
          quantity={quantity}
          variant={selectedVariant}
        />
        <BuyNowButton
          product={getProductForCart()}
          className="rounded-md uppercase font-semibold"
          disabled={isDisabled}
          quantity={quantity}
          variant={selectedVariant}
        />
      </div>

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

