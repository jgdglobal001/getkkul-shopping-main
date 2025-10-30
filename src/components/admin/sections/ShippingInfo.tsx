"use client";

import { ProductFormData } from "../utils/product-types";
import { FiTruck } from "react-icons/fi";

interface ShippingInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
}

export const ShippingInfo = ({
  formData,
  onInputChange,
}: ShippingInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiTruck className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">배송 정보</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 배송방법 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            배송방법
          </label>
          <select
            value={formData.shippingMethod}
            onChange={(e) => onInputChange("shippingMethod", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
          >
            <option value="">선택하세요</option>
            <option value="일반배송">일반배송</option>
            <option value="신선배송">신선배송</option>
            <option value="냉장배송">냉장배송</option>
            <option value="냉동배송">냉동배송</option>
          </select>
        </div>

        {/* 배송비 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            배송비
          </label>
          <input
            type="text"
            value={formData.shippingCost}
            onChange={(e) => onInputChange("shippingCost", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 무료배송, 3,000원"
          />
        </div>

        {/* 묶음배송 여부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            묶음배송 여부
          </label>
          <select
            value={formData.bundleShipping}
            onChange={(e) => onInputChange("bundleShipping", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
          >
            <option value="">선택하세요</option>
            <option value="가능">가능</option>
            <option value="불가능">불가능</option>
          </select>
        </div>

        {/* 배송기간 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            배송기간
          </label>
          <textarea
            value={formData.shippingPeriod}
            onChange={(e) => onInputChange("shippingPeriod", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 주문 후 1-2일 이내 배송"
          />
        </div>
      </div>
    </div>
  );
};