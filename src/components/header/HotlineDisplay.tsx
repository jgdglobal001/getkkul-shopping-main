"use client";

import { useTranslation } from "react-i18next";

export default function HotlineDisplay() {
  const { t } = useTranslation();
  return (
    <p className="text-xs text-gray-400 font-medium hidden md:inline-flex">
      {t("footer.hotline")}: <span className="text-black ml-1">{t("footer.phone")}</span>
    </p>
  );
}

