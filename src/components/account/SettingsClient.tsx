"use client";

import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function SettingsClient() {
  const { t } = useTranslation();

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        t("account.delete_account_warning")
      )
    ) {
      // TODO: Implement account deletion
      console.log("Delete account requested");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("account.account_settings")}</h1>
        <p className="text-gray-600">
          {t("account.manage_security")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("account.privacy_security")}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">
                  2단계 인증
                </div>
                <div className="text-sm text-gray-500">
                  계정에 추가 보안 계층 추가
                </div>
              </div>
              <button className="px-4 py-2 text-theme-color border border-theme-color rounded-lg hover:bg-theme-color hover:text-white transition-colors">
                {t("common.open")}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">로그인 활동</div>
                <div className="text-sm text-gray-500">
                  최근 로그인 시도 및 활성 세션 보기
                </div>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t("common.view")}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">데이터 내보내기</div>
                <div className="text-sm text-gray-500">
                  계정 데이터 사본 다운로드
                </div>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t("common.download")}
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            계정 작업
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">로그아웃</div>
                <div className="text-sm text-gray-500">
                  이 기기에서 계정 로그아웃
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                로그아웃
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <div className="font-medium text-red-600">{t("account.delete_account")}</div>
                <div className="text-sm text-gray-500">
                  계정 및 모든 관련 데이터 영구 삭제
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                {t("account.delete_account")}
              </button>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t("common.about")}</h3>

          <div className="space-y-2 text-sm text-gray-500">
            <div>{t("common.version")}: 1.0.0</div>
            <div>마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</div>
            <div className="flex space-x-4">
              <a href="#" className="text-theme-color hover:underline">
                {t("common.terms")}
              </a>
              <a href="#" className="text-theme-color hover:underline">
                {t("common.privacy")}
              </a>
              <a href="#" className="text-theme-color hover:underline">
                {t("common.support")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
