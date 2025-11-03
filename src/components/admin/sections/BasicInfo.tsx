"use client";

import { useState, useEffect } from "react";
import { ProductFormData } from "../utils/product-types";
import { FiInfo, FiDollarSign, FiPackage } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BasicInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
  onCategoryChange: (category: string) => void;
  onGenerateSKU: () => void;
}

export const BasicInfo = ({
  formData,
  onInputChange,
  onCategoryChange,
  onGenerateSKU,
}: BasicInfoProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoryError(null);
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("카테고리 로드 실패");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setCategoryError(error instanceof Error ? error.message : "오류 발생");
        console.error("카테고리 로드 오류:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiInfo className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 상품명 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="상품명을 입력하세요"
            required
          />
        </div>

        {/* 설명 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="상품에 대한 자세한 설명을 입력하세요"
            required
          />
        </div>

        {/* 가격 */}
        <div>
          <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
            <FiDollarSign className="w-4 h-4" />
            가격 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="가격을 입력하세요"
            required
          />
        </div>

        {/* 할인율 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인율 (%)
          </label>
          <input
            type="number"
            value={formData.discountPercentage}
            onChange={(e) => onInputChange("discountPercentage", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="0"
          />
        </div>

        {/* 평점 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            평점
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => onInputChange("rating", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="0 ~ 5"
          />
        </div>

        {/* 재고 */}
        <div>
          <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
            <FiPackage className="w-4 h-4" />
            재고
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => onInputChange("stock", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="0"
          />
        </div>

        {/* 브랜드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            브랜드
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => onInputChange("brand", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="브랜드명"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 <span className="text-red-500">*</span>
          </label>
          {categoryError && (
            <p className="mb-2 text-sm text-red-600">
              ⚠️ 카테고리 로드 실패: {categoryError}
            </p>
          )}
          <select
            value={formData.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoadingCategories || categoryError !== null}
          >
            <option value="">
              {isLoadingCategories ? "카테고리 로드 중..." : "카테고리 선택"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {isLoadingCategories && (
            <p className="mt-1 text-xs text-gray-500">
              데이터베이스에서 카테고리를 로드하고 있습니다...
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            총 {categories.length}개 카테고리 (데이터베이스 연동)
          </p>
        </div>

        {/* SKU */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => onInputChange("sku", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              placeholder="SKU를 입력하거나 자동 생성"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={onGenerateSKU}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              자동생성
            </button>
          </div>
        </div>

        {/* 가용성 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            가용성 상태
          </label>
          <select
            value={formData.availabilityStatus}
            onChange={(e) => onInputChange("availabilityStatus", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
          >
            <option value="In Stock">재고 있음</option>
            <option value="Out of Stock">재고 없음</option>
            <option value="Pre-order">사전 예약</option>
          </select>
        </div>

        {/* 최소 주문 수량 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최소 주문 수량
          </label>
          <input
            type="number"
            min="1"
            value={formData.minimumOrderQuantity}
            onChange={(e) => onInputChange("minimumOrderQuantity", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );
};