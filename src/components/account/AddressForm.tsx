"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DaumPostcode from "react-daum-postcode";
import { Address } from "../../../type";
import { FiMapPin, FiX } from "react-icons/fi";

interface AddressFormProps {
  address?: Address;
  onSubmit: (address: Address) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
  showSetDefault?: boolean;
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  showSetDefault = true,
}: AddressFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Address>({
    recipientName: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    deliveryRequest: "문 앞",
    entranceCode: "",
    isDefault: false,
    ...address,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, "");

    // 010-1234-5678 형식으로 포맷
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    let finalValue = value;

    // 전화번호 자동 포맷팅
    if (name === "phone") {
      finalValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : finalValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 카카오맵 주소 검색 완료 핸들러
  const handlePostcodeComplete = (data: any) => {
    // 도로명 주소 우선, 없으면 지번 주소
    // buildingName이 있으면 포함
    let address = data.roadAddress || data.jibunAddress || data.address;

    // 건물명(아파트명) 추가
    if (data.buildingName) {
      address = `${address} (${data.buildingName})`;
    }

    const zipCode = data.zonecode;

    setFormData((prev) => ({
      ...prev,
      zipCode: zipCode,
      address: address, // 도로명 또는 지번 주소 + 아파트명
      detailAddress: "", // 상세주소는 사용자가 입력
    }));

    setShowPostcodeModal(false);

    // 에러 초기화
    if (errors.zipCode || errors.address) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "",
        address: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "받는사람은 필수입니다";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호는 필수입니다";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "우편번호는 필수입니다";
    }
    if (!formData.address.trim()) {
      newErrors.address = "주소는 필수입니다";
    }
    if (!formData.detailAddress.trim()) {
      newErrors.detailAddress = "상세주소는 필수입니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 받는사람 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            받는사람 *
          </label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
              errors.recipientName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="받는사람 이름"
          />
          {errors.recipientName && (
            <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전화번호 *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="010-0000-0000"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* 주소 검색 버튼 */}
        <div>
          <button
            type="button"
            onClick={() => setShowPostcodeModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-theme-color hover:bg-theme-color/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FiMapPin className="text-lg" />
            주소 검색
          </button>
        </div>

        {/* 우편번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            우편번호 *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder="주소 검색 후 자동 입력"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주소 *
          </label>
          <input
            type="text"
            value={formData.address}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder="주소 검색 후 자동 입력"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* 상세주소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세주소 *
          </label>
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${
              errors.detailAddress ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="예: 101호, 아파트 이름 등"
          />
          {errors.detailAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.detailAddress}</p>
          )}
        </div>

        {/* 배송 요청사항 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            배송 요청사항
          </label>
          <button
            type="button"
            onClick={() => setShowDeliveryModal(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 transition-colors"
          >
            {formData.deliveryRequest}
          </button>
        </div>

        {/* 공동현관 출입번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공동현관 출입번호 (선택사항)
          </label>
          <input
            type="text"
            name="entranceCode"
            value={formData.entranceCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color"
            placeholder="예: 1234"
          />
          <p className="text-xs text-gray-500 mt-1">
            입력된 공동현관 출입번호는 배송을 위해 필요한 기간 동안 보관합니다.
          </p>
        </div>

        {/* 기본 배송지 설정 */}
        {!isEdit && showSetDefault && (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-theme-color focus:ring-theme-color border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                기본 배송지로 설정
              </span>
            </label>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-theme-color text-white rounded-md hover:bg-theme-color/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  ></circle>
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEdit ? "수정 중..." : "추가 중..."}
              </span>
            ) : isEdit ? (
              "주소 수정"
            ) : (
              "주소 추가"
            )}
          </button>
        </div>
      </form>

      {/* 카카오맵 주소 검색 모달 */}
      {showPostcodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">주소 검색</h3>
              <button
                onClick={() => setShowPostcodeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
              <DaumPostcode
                onComplete={handlePostcodeComplete}
                autoClose={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* 배송 요청사항 모달 */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">배송 요청사항</h3>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                사회적 거리두기를 위해, 모든 배송을 비대면으로 진행합니다.
              </p>

              {[
                { value: "문 앞", label: "문 앞" },
                { value: "직접 받고 부재 시 문 앞", label: "직접 받고 부재 시 문 앞" },
                { value: "경비실", label: "경비실" },
                { value: "택배함", label: "택배함" },
                { value: "기타사항", label: "기타사항" },
              ].map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryRequest"
                    value={option.value}
                    checked={formData.deliveryRequest === option.value}
                    onChange={handleInputChange}
                    className="mr-3 h-4 w-4 text-theme-color"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}

              <button
                onClick={() => setShowDeliveryModal(false)}
                className="w-full mt-4 px-4 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
