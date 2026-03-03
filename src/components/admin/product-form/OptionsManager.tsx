"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSettings, FiImage, FiX } from "react-icons/fi";
import { ProductFormData, OptionDefinition, VariantData } from "../utils/product-types";
import Image from "next/image";

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

  // 인라인 이미지 입력을 위한 상태
  const [activeMainInput, setActiveMainInput] = useState<{ index: number; value: string } | null>(null);
  const [activeDetailInput, setActiveDetailInput] = useState<{ index: number; value: string } | null>(null);

  // formData.options가 변경되면 입력값 동기화
  const options = formData.options;
  useEffect(() => {
    const inputs = options.map((opt) => opt.values.join(", "));
    setOptionValuesInputs(inputs);
  }, [options]);

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

  // 같은 옵션명의 값들을 하나로 병합
  const mergeOptionsByName = (options: OptionDefinition[]): OptionDefinition[] => {
    const merged = new Map<string, Set<string>>();
    const order: string[] = [];

    for (const opt of options) {
      if (!merged.has(opt.name)) {
        merged.set(opt.name, new Set());
        order.push(opt.name);
      }
      for (const v of opt.values) {
        merged.get(opt.name)!.add(v);
      }
    }

    return order.map((name) => ({
      name,
      values: [...merged.get(name)!],
    }));
  };

  // 옵션 조합 생성 (기존 목록에 추가)
  const generateVariants = () => {
    const validOptions = formData.options.filter((opt) => opt.values.length > 0);
    if (validOptions.length === 0) {
      alert("옵션값을 입력해주세요.");
      return;
    }

    // 같은 옵션명이 있으면 값을 합쳐서 처리
    const mergedOptions = mergeOptionsByName(validOptions);

    // 카테시안 곱으로 모든 조합 생성
    const combinations = cartesianProduct(mergedOptions);

    // 기존에 이미 존재하는 조합인지 확인 (중복 방지)
    const existingSignatures = new Set(
      formData.variants.map((v) => JSON.stringify(v.optionCombination))
    );

    const newVariants: VariantData[] = [];

    combinations.forEach((combo) => {
      if (!existingSignatures.has(JSON.stringify(combo))) {
        newVariants.push({
          optionCombination: combo,
          sku: "",
          originalPrice: formData.price || "0",
          price: formData.price || "0",
          stock: "0",
          isActive: true,
        });
      }
    });

    if (newVariants.length === 0) {
      alert("선택한 옵션 조합이 이미 목록에 존재합니다.");
      return;
    }

    // 기존 목록 뒤에 추가
    onFormDataChange({ variants: [...formData.variants, ...newVariants] });
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

  // Variant 이미지 업데이트 (대표/추가 이미지 공용)
  const handleVariantImageUpdate = (
    variantIndex: number,
    field: "image" | "detailImages",
    value: string | string[]
  ) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex] = { ...newVariants[variantIndex], [field]: value };
    onFormDataChange({ variants: newVariants });
  };

  // 대표 이미지 URL 입력 완료
  const handleMainImageSubmit = (index: number) => {
    if (activeMainInput && activeMainInput.value) {
      handleVariantImageUpdate(index, "image", activeMainInput.value);
    }
    setActiveMainInput(null);
  };

  // 추가 이미지 URL 입력 완료
  const handleDetailImageSubmit = (index: number) => {
    if (activeDetailInput && activeDetailInput.value) {
      // @ts-ignore
      const currentDetails = formData.variants[index].detailImages || [];
      if (currentDetails.length >= 9) {
        alert("추가 이미지는 최대 9장까지 등록 가능합니다.");
      } else {
        handleVariantImageUpdate(index, "detailImages", [...currentDetails, activeDetailInput.value]);
      }
    }
    setActiveDetailInput(null);
  };

  // 추가 이미지 삭제
  const handleDetailImageDelete = (variantIndex: number, imageIndex: number) => {
    // @ts-ignore
    const currentDetails = formData.variants[variantIndex].detailImages || [];
    const newDetails = currentDetails.filter((_, i) => i !== imageIndex);
    handleVariantImageUpdate(variantIndex, "detailImages", newDetails);
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
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.hasOptions
            ? "bg-theme-color text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          옵션 상품등록
        </button>
        <button
          type="button"
          onClick={() => handleProductTypeChange(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${!formData.hasOptions
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
                  {formData.options.some((opt, i) => i !== index && opt.name === option.name && option.name !== "옵션명 직접입력") && (
                    <p className="text-xs text-blue-500 mt-1">💡 같은 옵션명의 값들은 자동으로 합쳐져 조합됩니다.</p>
                  )}
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
            옵션목록 추가
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

          {/* 옵션 이미지 관리 섹션 */}
          {formData.variants.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <FiImage className="w-5 h-5" />
                옵션 이미지 등록
                <span className="text-xs text-gray-400 font-normal ml-2">권장 크기: 1000x1000px</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm w-1/4">옵션명</th>
                      <th className="border border-gray-200 px-3 py-2 text-center text-sm w-40">대표이미지 <span className="text-red-500">*</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm">추가이미지 (최대 9장)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-sm">
                          {Object.entries(variant.optionCombination).map(([k, v]) => v).join(" ")}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center align-middle">
                          <div className="flex justify-center items-center h-20">
                            {variant.image ? (
                              <div className="relative w-20 h-20 bg-gray-100 rounded border border-gray-200 group">
                                <Image
                                  src={variant.image}
                                  alt="Main"
                                  fill
                                  className="object-contain"
                                  unoptimized={true}
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleVariantImageUpdate(index, "image", "")}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : activeMainInput?.index === index ? (
                              <input
                                type="text"
                                autoFocus
                                value={activeMainInput.value}
                                onChange={(e) => setActiveMainInput({ ...activeMainInput, value: e.target.value })}
                                onBlur={() => handleMainImageSubmit(index)}
                                onKeyDown={(e) => e.key === "Enter" && handleMainImageSubmit(index)}
                                placeholder="URL 입력"
                                className="w-full text-xs px-2 py-1 border border-blue-500 rounded"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveMainInput({ index, value: "" })}
                                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                              >
                                <FiPlus className="w-6 h-6" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-200 px-3 py-2 align-middle">
                          <div className="flex flex-wrap gap-2 items-center">
                            {/* 추가 이미지 리스트 */}
                            {(variant.detailImages || []).map((img, imgIdx) => (
                              <div key={imgIdx} className="relative w-20 h-20 bg-gray-100 rounded border border-gray-200 group">
                                <Image
                                  src={img}
                                  alt={`Detail ${imgIdx}`}
                                  fill
                                  className="object-contain"
                                  unoptimized={true}
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDetailImageDelete(index, imgIdx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* 추가 버튼 / 입력창 */}
                            {activeDetailInput?.index === index ? (
                              <div className="w-40">
                                <input
                                  type="text"
                                  autoFocus
                                  value={activeDetailInput.value}
                                  onChange={(e) => setActiveDetailInput({ ...activeDetailInput, value: e.target.value })}
                                  onBlur={() => handleDetailImageSubmit(index)}
                                  onKeyDown={(e) => e.key === "Enter" && handleDetailImageSubmit(index)}
                                  placeholder="URL 입력 후 엔터"
                                  className="w-full text-xs px-2 py-1 border border-blue-500 rounded"
                                />
                              </div>
                            ) : (
                              (variant.detailImages || []).length < 9 && (
                                <button
                                  type="button"
                                  onClick={() => setActiveDetailInput({ index, value: "" })}
                                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                >
                                  <FiPlus className="w-6 h-6" />
                                </button>
                              )
                            )}
                          </div>
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
