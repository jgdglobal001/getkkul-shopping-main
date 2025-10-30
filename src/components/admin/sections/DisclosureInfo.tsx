"use client";

import { ProductFormData, TemplateData } from "../utils/product-types";
import { CATEGORY_TEMPLATES } from "../utils/templates";
import { FiInfo } from "react-icons/fi";

interface DisclosureInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: any) => void;
  selectedTemplate: string;
  onTemplateSelect: (templateName: string) => void;
  onApplyTemplate: (templateName: string) => void;
}

export const DisclosureInfo = ({
  formData,
  onInputChange,
  selectedTemplate,
  onTemplateSelect,
  onApplyTemplate,
}: DisclosureInfoProps) => {
  const templates = CATEGORY_TEMPLATES[formData.category] || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-6">
        <FiInfo className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">필수 표기 정보</h2>
      </div>

      {/* 템플릿 선택 */}
      {templates.length > 0 && (
        <div className="mb-6 pb-6 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            템플릿 선택 (카테고리: {formData.category})
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            {templates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => {
                  onTemplateSelect(template.name);
                  onApplyTemplate(template.name);
                }}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedTemplate === template.name
                    ? "bg-theme-color text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 상품명 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => onInputChange("productName", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="상품의 공식 명칭"
          />
        </div>

        {/* 모델번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            모델번호
          </label>
          <input
            type="text"
            value={formData.modelNumber}
            onChange={(e) => onInputChange("modelNumber", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: SM-XXXX"
          />
        </div>

        {/* 사이즈 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사이즈
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(e) => onInputChange("size", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: XL, 15인치"
          />
        </div>

        {/* 재질 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            재질
          </label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => onInputChange("material", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 면 100%"
          />
        </div>

        {/* 색상 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            색상
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => onInputChange("color", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 검정색, 화이트"
          />
        </div>

        {/* 제품 구성 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제품 구성
          </label>
          <input
            type="text"
            value={formData.productComposition}
            onChange={(e) => onInputChange("productComposition", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 본체, 충전기, 케이블, 설명서"
          />
        </div>

        {/* 출시년월 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            출시년월
          </label>
          <input
            type="text"
            value={formData.releaseDate}
            onChange={(e) => onInputChange("releaseDate", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 2024년 1월"
          />
        </div>

        {/* 제조자(수입자) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제조자(수입자)
          </label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => onInputChange("manufacturer", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 삼성전자"
          />
        </div>

        {/* 제조국 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제조국
          </label>
          <input
            type="text"
            value={formData.madeInCountry}
            onChange={(e) => onInputChange("madeInCountry", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 대한민국"
          />
        </div>

        {/* 품질보증기준 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            품질보증기준
          </label>
          <textarea
            value={formData.warrantyStandard}
            onChange={(e) => onInputChange("warrantyStandard", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 1년 무상 보증"
          />
        </div>

        {/* A/S 책임자와 전화번호 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            A/S 책임자와 전화번호
          </label>
          <textarea
            value={formData.asResponsible}
            onChange={(e) => onInputChange("asResponsible", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: 삼성전자 고객센터 1588-3366"
          />
        </div>

        {/* KC 인증정보 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            KC 인증정보
          </label>
          <textarea
            value={formData.kcCertification}
            onChange={(e) => onInputChange("kcCertification", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: KC 인증번호, 인증 정보"
          />
        </div>

        {/* 상품별 세부 사양 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품별 세부 사양
          </label>
          <textarea
            value={formData.detailedSpecs}
            onChange={(e) => onInputChange("detailedSpecs", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
            placeholder="예: CPU, RAM, 저장공간, 카메라 사양 등"
          />
        </div>
      </div>
    </div>
  );
};