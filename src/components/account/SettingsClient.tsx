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
                  {t("account.two_factor_auth")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("account.two_factor_auth_desc")}
                </div>
              </div>
              <button className="px-4 py-2 text-theme-color border border-theme-color rounded-lg hover:bg-theme-color hover:text-white transition-colors">
                {t("common.open")}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">{t("account.login_activity")}</div>
                <div className="text-sm text-gray-500">
                  {t("account.login_activity_desc")}
                </div>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t("common.view")}
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">{t("account.export_data")}</div>
                <div className="text-sm text-gray-500">
                  {t("account.export_data_desc")}
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
            {t("account.account_actions")}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">{t("auth.logout")}</div>
                <div className="text-sm text-gray-500">
                  {t("account.logout_desc")}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("auth.logout")}
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <div className="font-medium text-red-600">{t("account.delete_account")}</div>
                <div className="text-sm text-gray-500">
                  {t("account.delete_account_desc")}
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
            <div>{t("account.last_updated")}: {new Date().toLocaleDateString('ko-KR')}</div>
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
