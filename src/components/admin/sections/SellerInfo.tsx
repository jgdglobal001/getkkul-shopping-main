"use client";

import { ProductFormData } from "../utils/product-types";
import { FiUser } from "react-icons/fi";

interface SellerInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
}

export const SellerInfo = ({
  formData,
  onInputChange,
}: SellerInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiUser className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">판매자 정보</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 판매자명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            판매자명
          </label>
          <input
            type="text"
            value={formData.sellerName}
            onChange={(e) => onInputChange("sellerName", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 겟꿀쇼핑"
          />
        </div>

        {/* 판매자 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            판매자 전화번호
          </label>
          <input
            type="tel"
            value={formData.sellerPhone}
            onChange={(e) => onInputChange("sellerPhone", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 1577-7011"
          />
        </div>

        {/* 법적 고지사항 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            법적 고지사항
          </label>
          <textarea
            value={formData.sellerLegalNotice}
            onChange={(e) => onInputChange("sellerLegalNotice", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 미성년자가 체결한 계약은 법정대리인이 동의하지 않는 경우 본인 또는 법정대리인이 취소할 수 있습니다."
          />
        </div>

        {/* 활성 상태 */}
        <div className="lg:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => onInputChange("isActive", e.target.checked)}
              className="w-4 h-4 text-theme-color border-gray-300 rounded focus:ring-theme-color"
            />
            <span className="text-sm font-medium text-gray-700">
              상품 활성화 (체크 해제 시 고객에게 표시되지 않습니다)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};