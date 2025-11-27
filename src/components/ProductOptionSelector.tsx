"use client";

import React, { useState, useEffect } from "react";
import { FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import { ProductOption, ProductVariant } from "../../type";

interface ProductOptionSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant | null, quantity: number) => void;
  basePrice: number;
}

const ProductOptionSelector: React.FC<ProductOptionSelectorProps> = ({
  options,
  variants,
  onVariantSelect,
  basePrice,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 옵션 선택 시 variant 찾기
  useEffect(() => {
    if (Object.keys(selectedOptions).length === options.length) {
      // 모든 옵션이 선택되었을 때 해당 variant 찾기
      const variant = variants.find((v) => {
        const combo = v.optionCombination as Record<string, string>;
        return Object.entries(selectedOptions).every(
          ([key, value]) => combo[key] === value
        );
      });
      setSelectedVariant(variant || null);
      onVariantSelect(variant || null, quantity);
    } else {
      setSelectedVariant(null);
      onVariantSelect(null, quantity);
    }
  }, [selectedOptions, variants, options.length, quantity, onVariantSelect]);

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // 수량 변경
  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    const maxStock = selectedVariant?.stock || 99;
    setQuantity(Math.min(newQty, maxStock));
  };

  // 옵션값이 선택 가능한지 확인 (재고 체크)
  const isOptionValueAvailable = (optionName: string, value: string): boolean => {
    // 현재 선택된 다른 옵션들과 조합했을 때 재고가 있는 variant가 있는지 확인
    const testOptions = { ...selectedOptions, [optionName]: value };
    
    return variants.some((v) => {
      const combo = v.optionCombination as Record<string, string>;
      const matches = Object.entries(testOptions).every(
        ([key, val]) => combo[key] === val
      );
      return matches && v.stock > 0 && v.isActive;
    });
  };

  // 색상 옵션인지 확인 (이미지 버튼으로 표시)
  const isColorOption = (name: string): boolean => {
    return ["색상", "컬러", "color", "Color"].includes(name);
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name} className="space-y-2">
          <label className="font-medium text-gray-700">
            {option.name}: <span className="text-theme-color">{selectedOptions[option.name] || "선택해주세요"}</span>
          </label>

          {isColorOption(option.name) ? (
            // 색상 옵션: 이미지/텍스트 버튼
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const isAvailable = isOptionValueAvailable(option.name, value);
                
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => isAvailable && handleOptionSelect(option.name, value)}
                    disabled={!isAvailable}
                    className={`
                      relative px-4 py-2 border-2 rounded-lg transition-all
                      ${isSelected 
                        ? "border-theme-color bg-theme-color/10" 
                        : "border-gray-200 hover:border-gray-400"}
                      ${!isAvailable && "opacity-40 cursor-not-allowed line-through"}
                    `}
                  >
                    {value}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 bg-theme-color text-white rounded-full p-0.5">
                        <FiCheck className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // 사이즈 등 기타 옵션: 드롭다운
            <select
              value={selectedOptions[option.name] || ""}
              onChange={(e) => handleOptionSelect(option.name, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              {option.values.map((value) => {
                const isAvailable = isOptionValueAvailable(option.name, value);
                return (
                  <option key={value} value={value} disabled={!isAvailable}>
                    {value} {!isAvailable && "(품절)"}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      ))}

      {/* 선택된 옵션 정보 */}
      {selectedVariant && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">선택한 옵션</span>
            <span className="font-medium">
              {Object.entries(selectedVariant.optionCombination as Record<string, string>)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}
            </span>
          </div>
          
          {/* 수량 선택 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">수량</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 가격 */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-gray-600">총 상품금액</span>
            <span className="text-xl font-bold text-theme-color">
              {(selectedVariant.price * quantity).toLocaleString()}원
            </span>
          </div>

          {/* 재고 정보 */}
          <div className="text-sm text-gray-500">
            {selectedVariant.stock > 0 ? (
              <span>재고: {selectedVariant.stock}개</span>
            ) : (
              <span className="text-red-500">품절</span>
            )}
          </div>
        </div>
      )}

      {/* 옵션 미선택 안내 */}
      {!selectedVariant && options.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          💡 옵션을 모두 선택해주세요
        </div>
      )}
    </div>
  );
};

export default ProductOptionSelector;

