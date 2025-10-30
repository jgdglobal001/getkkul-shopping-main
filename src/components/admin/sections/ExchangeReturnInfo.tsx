"use client";

import { ProductFormData } from "../utils/product-types";
import { FiSettings } from "react-icons/fi";

interface ExchangeReturnInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
}

export const ExchangeReturnInfo = ({
  formData,
  onInputChange,
}: ExchangeReturnInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiSettings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">교환/반품 정보</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 교환/반품 비용 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            교환/반품 비용
          </label>
          <textarea
            value={formData.exchangeReturnCost}
            onChange={(e) => onInputChange("exchangeReturnCost", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 무료 반품/교환 가능"
          />
        </div>

        {/* 교환/반품 신청 기준일 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            교환/반품 신청 기준일
          </label>
          <textarea
            value={formData.exchangeReturnDeadline}
            onChange={(e) => onInputChange("exchangeReturnDeadline", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 제품 수령 후 30일 이내"
          />
        </div>

        {/* 교환/반품 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            교환/반품 제한사항
          </label>
          <textarea
            value={formData.exchangeReturnLimitations}
            onChange={(e) => onInputChange("exchangeReturnLimitations", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 개봉 후 사용한 상품은 반품 불가"
          />
        </div>

        {/* 의류/잡화 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            의류/잡화 제한사항
          </label>
          <textarea
            value={formData.clothingLimitations}
            onChange={(e) => onInputChange("clothingLimitations", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 태그 제거 시 반품 불가"
          />
        </div>

        {/* 식품/화장품 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            식품/화장품 제한사항
          </label>
          <textarea
            value={formData.foodLimitations}
            onChange={(e) => onInputChange("foodLimitations", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 신선/냉장/냉동 상품은 단순변심 반품 불가"
          />
        </div>

        {/* 전자/가전 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전자/가전 제한사항
          </label>
          <textarea
            value={formData.electronicsLimitations}
            onChange={(e) => onInputChange("electronicsLimitations", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 설치 후 반품 불가"
          />
        </div>

        {/* 자동차용품 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            자동차용품 제한사항
          </label>
          <textarea
            value={formData.autoLimitations}
            onChange={(e) => onInputChange("autoLimitations", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 장착 후 반품 불가"
          />
        </div>

        {/* CD/DVD/GAME/BOOK 제한사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CD/DVD/GAME/BOOK 제한사항
          </label>
          <textarea
            value={formData.mediaLimitations}
            onChange={(e) => onInputChange("mediaLimitations", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 포장 개봉 시 반품 불가"
          />
        </div>
      </div>
    </div>
  );
};