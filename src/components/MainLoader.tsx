"use client";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const MainLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen absolute top-0 left-0 bg-white flex flex-col gap-2 items-center justify-center z-50">
      <div className="w-96 p-8 rounded-lg bg-amazonBlue flex items-center justify-center relative">
        <Image
          src={"/getkkul-logo-Up-down.png"}
          alt="Getkkul Shopping Logo"
          width={576}
          height={576}
          className="object-contain"
          unoptimized
        />
      </div>

      <span className="w-14 h-14 inline-flex border-8 border-border-color rounded-full relative">
        <span className="w-14 h-14 border-8 border-r-sky-color border-b-border-color border-t-border-color border-l-border-color rounded-full absolute -top-2 -left-2 animate-spin" />
      </span>
      <p className="text-lg text-center font-semibold tracking-wide text-theme-color tracking-wide">
        {t("common.loading", { defaultValue: "로딩 중..." })}
      </p>
    </div>
  );
};

export default MainLoader;
