"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSettings } from "react-icons/fi";
import { ProductFormData, OptionDefinition, VariantData } from "../utils/product-types";

// 미리 정의된 옵션명 목록
const PRESET_OPTION_NAMES = [
  "색상",
  "사이즈",
  "신발사이즈",
  "적용모델",
  "용량",
  "수량",
  "옵션명 직접입력",
];

interface OptionsManagerProps {
  formData: ProductFormData;
  onFormDataChange: (data: Partial<ProductFormData>) => void;
}

const OptionsManager: React.FC<OptionsManagerProps> = ({
  formData,
  onFormDataChange,
}) => {
  // 각 옵션의 raw 입력값을 관리 (쉼표 입력을 위해)
  const [optionValuesInputs, setOptionValuesInputs] = useState<string[]>([]);

  // formData.options가 변경되면 입력값 동기화
  // eslint-disable-next-line react-hooks/exhaustive-deps -- options 개수 변경시에만 동기화 (무한 루프 방지)
  useEffect(() => {
    const inputs = formData.options.map((opt) => opt.values.join(", "));
    setOptionValuesInputs(inputs);
  }, [formData.options.length]);

  // 상품 유형 변경
  const handleProductTypeChange = (hasOptions: boolean) => {
    onFormDataChange({
      hasOptions,
      options: hasOptions ? [{ name: "색상", values: [] }] : [],
      variants: [],
      optionCount: hasOptions ? 1 : 0,
    });
  };

  // 옵션 개수 변경
  const handleOptionCountChange = (count: number) => {
    const newOptions: OptionDefinition[] = [];
    for (let i = 0; i < count; i++) {
      newOptions.push(
        formData.options[i] || { name: PRESET_OPTION_NAMES[i] || "색상", values: [] }
      );
    }
    onFormDataChange({
      optionCount: count,
      options: newOptions,
      variants: [], // 옵션 개수 변경시 조합 초기화
    });
  };

  // 옵션명 변경
  const handleOptionNameChange = (index: number, name: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], name };
    onFormDataChange({ options: newOptions, variants: [] });
  };

  // 옵션값 입력 중 (raw 값 유지)
  const handleOptionValuesInputChange = (index: number, valuesStr: string) => {
    const newInputs = [...optionValuesInputs];
    newInputs[index] = valuesStr;
    setOptionValuesInputs(newInputs);
  };

  // 옵션값 입력 완료 (blur 또는 Enter 시)
  const handleOptionValuesBlur = (index: number) => {
    const valuesStr = optionValuesInputs[index] || "";
    const values = valuesStr.split(",").map((v) => v.trim()).filter((v) => v);
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], values };
    onFormDataChange({ options: newOptions, variants: [] });
  };

  // 옵션 조합 생성
  const generateVariants = () => {
    const validOptions = formData.options.filter((opt) => opt.values.length > 0);
    if (validOptions.length === 0) {
      alert("옵션값을 입력해주세요.");
      return;
    }

    // 카테시안 곱으로 모든 조합 생성
    const combinations = cartesianProduct(validOptions);
    const newVariants: VariantData[] = combinations.map((combo) => ({
      optionCombination: combo,
      sku: "",
      originalPrice: formData.price || "0",
      price: formData.price || "0",
      stock: "0",
      isActive: true,
    }));

    onFormDataChange({ variants: newVariants });
  };

  // 카테시안 곱 헬퍼 함수
  const cartesianProduct = (options: OptionDefinition[]): Record<string, string>[] => {
    if (options.length === 0) return [{}];
    
    const [first, ...rest] = options;
    const restProducts = cartesianProduct(rest);
    
    const result: Record<string, string>[] = [];
    for (const value of first.values) {
      for (const restProduct of restProducts) {
        result.push({ [first.name]: value, ...restProduct });
      }
    }
    return result;
  };

  // Variant 데이터 변경
  const handleVariantChange = (
    index: number,
    field: keyof VariantData,
    value: string | boolean
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onFormDataChange({ variants: newVariants });
  };

  // Variant 삭제
  const handleVariantDelete = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    onFormDataChange({ variants: newVariants });
  };

  // 일괄 입력
  const handleBulkEdit = (field: "price" | "stock", value: string) => {
    const newVariants = formData.variants.map((v) => ({ ...v, [field]: value }));
    onFormDataChange({ variants: newVariants });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        <FiSettings className="w-6 h-6 text-theme-color" />
        옵션
      </div>

      {/* 상품 유형 선택 탭 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleProductTypeChange(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            formData.hasOptions
              ? "bg-theme-color text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          옵션 상품등록
        </button>
        <button
          type="button"
          onClick={() => handleProductTypeChange(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !formData.hasOptions
              ? "bg-theme-color text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          단일 상품등록
        </button>
      </div>

      {/* 옵션 상품인 경우에만 옵션 입력 UI 표시 */}
      {formData.hasOptions && (
        <>
          {/* 옵션명 개수 선택 */}
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">옵션명 개수 *</label>
            <select
              value={formData.optionCount}
              onChange={(e) => handleOptionCountChange(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            >
              <option value={1}>1개</option>
              <option value={2}>2개</option>
              <option value={3}>3개</option>
            </select>
          </div>

          {/* 옵션 입력 */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700">옵션 입력 *</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-48">
                  <label className="text-sm text-gray-500">옵션명</label>
                  <select
                    value={PRESET_OPTION_NAMES.includes(option.name) ? option.name : "옵션명 직접입력"}
                    onChange={(e) => handleOptionNameChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color"
                  >
                    {PRESET_OPTION_NAMES.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  {!PRESET_OPTION_NAMES.includes(option.name) && (
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => handleOptionNameChange(index, e.target.value)}
                      placeholder="옵션명 입력"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500">옵션값</label>
                  <input
                    type="text"
                    value={optionValuesInputs[index] ?? option.values.join(", ")}
                    onChange={(e) => handleOptionValuesInputChange(index, e.target.value)}
                    onBlur={() => handleOptionValuesBlur(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleOptionValuesBlur(index);
                      }
                    }}
                    placeholder="쉼표(,)로 구분하여 입력 (예: 블랙, 화이트, 네이비)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 쉼표(,)로 구분하여 한번에 여러값을 입력할 수 있습니다.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 옵션목록으로 적용 버튼 */}
          <button
            type="button"
            onClick={generateVariants}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            옵션목록으로 적용
          </button>

          {/* 옵션 목록 테이블 */}
          {formData.variants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">
                  옵션 목록 (총 {formData.variants.length}개)
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const price = prompt("일괄 적용할 판매가를 입력하세요:");
                      if (price) handleBulkEdit("price", price);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    판매가 일괄입력
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const stock = prompt("일괄 적용할 재고수량을 입력하세요:");
                      if (stock) handleBulkEdit("stock", stock);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    재고수량 일괄입력
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">옵션</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">정상가(원)</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">판매가(원)*</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">재고수량*</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">판매자상품코드</th>
                      <th className="border border-gray-200 px-3 py-2 text-center text-sm w-16">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-sm">
                          {Object.entries(variant.optionCombination).map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </td>
                        <td className="border border-gray-200 px-1 py-1">
                          <input
                            type="number"
                            value={variant.originalPrice}
                            onChange={(e) => handleVariantChange(index, "originalPrice", e.target.value)}
                            className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-theme-color rounded"
                          />
                        </td>
                        <td className="border border-gray-200 px-1 py-1">
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-theme-color rounded"
                            required
                          />
                        </td>
                        <td className="border border-gray-200 px-1 py-1">
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-theme-color rounded"
                            required
                          />
                        </td>
                        <td className="border border-gray-200 px-1 py-1">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                            className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-theme-color rounded"
                            placeholder="SKU"
                          />
                        </td>
                        <td className="border border-gray-200 px-1 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleVariantDelete(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 단일 상품 안내 */}
      {!formData.hasOptions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">
            💡 단일 상품은 옵션 없이 하나의 가격과 재고로 판매됩니다.
            <br />
            상단의 <strong>기본 정보</strong>에서 가격과 재고를 입력해주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default OptionsManager;
