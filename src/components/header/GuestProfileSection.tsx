"use client";

import Link from "next/link";
import { LiaUser } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { usePathname, useSearchParams } from "next/navigation";

const GuestProfileSection = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 URL을 callbackUrl로 사용 (쿼리 파라미터 포함)
  const search = searchParams.toString();
  const currentUrl = search ? `${pathname}?${search}` : pathname;

  // auth 페이지가 아닌 경우에만 callbackUrl 추가
  const isAuthPage = pathname.startsWith("/auth");
  const signInUrl = isAuthPage
    ? "/auth/signin"
    : `/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`;
  const registerUrl = isAuthPage
    ? "/auth/register"
    : `/auth/register?callbackUrl=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
        <LiaUser />
      </div>
      <div>
        <Link href={signInUrl}>
          <p className="text-xs hover:text-sky-color ease-in-out duration-300 cursor-pointer">
            {t("common.hello")}, {t("auth.guests")}
          </p>
        </Link>

        <div className="text-sm">
          <Link
            href={signInUrl}
            className="hover:text-sky-color ease-in-out duration-300 cursor-pointer"
          >
            {t("auth.login")}{" "}
          </Link>
          /{" "}
          <Link
            href={registerUrl}
            className="hover:text-sky-color ease-in-out duration-300 cursor-pointer"
          >
            {t("auth.register")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestProfileSection;