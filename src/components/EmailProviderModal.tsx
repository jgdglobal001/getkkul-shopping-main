"use client";

import { useState } from "react";
import { FiX, FiMail } from "react-icons/fi";

const RECIPIENT_EMAIL = "jgdglobal@kakao.com";

const EMAIL_PROVIDERS = [
  {
    id: "naver",
    name: "네이버 메일",
    icon: "/images/naver-icon.svg",
    color: "#03C75A",
    getUrl: (to: string, subject: string) =>
      `https://mail.naver.com/write?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}`,
  },
  {
    id: "kakao",
    name: "카카오 메일",
    icon: "/images/kakao-icon.svg",
    color: "#FEE500",
    getUrl: (to: string, subject: string) =>
      `https://mail.kakao.com/write?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}`,
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: "/images/gmail-icon.svg",
    color: "#EA4335",
    getUrl: (to: string, subject: string) =>
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`,
  },
] as const;

interface EmailProviderModalProps {
  /** 이메일 제목에 들어갈 기본 문구 */
  subject?: string;
}

export default function EmailProviderModal({
  subject = "[겟꿀쇼핑] 문의드립니다",
}: EmailProviderModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (providerId: string) => {
    const provider = EMAIL_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) return;

    const url = provider.getUrl(RECIPIENT_EMAIL, subject);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
      >
        <FiMail className="w-4 h-4" />
        이메일 문의
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                이메일 서비스 선택
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* 설명 */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-sm text-gray-500">
                사용하시는 이메일 서비스를 선택하시면
                <br />
                받는 사람이 자동으로 입력됩니다.
              </p>
            </div>

            {/* 이메일 서비스 버튼들 */}
            <div className="p-5 space-y-3">
              {EMAIL_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSelect(provider.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.id === "naver"
                      ? "N"
                      : provider.id === "kakao"
                        ? "K"
                        : "G"}
                  </div>
                  <span className="text-base font-medium text-gray-800 group-hover:text-gray-900">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>

            {/* 하단 안내 */}
            <div className="px-5 pb-5">
              <p className="text-xs text-gray-400 text-center">
                받는 사람: {RECIPIENT_EMAIL}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
