"use client";

import Link from "next/link";
import { LiaUser } from "react-icons/lia";
import { useTranslation } from "react-i18next";

const GuestProfileSection = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="border-2 border-gray-700 p-1.5 rounded-full text-xl">
        <LiaUser />
      </div>
      <div>
        <Link href={"/auth/signin"}>
          <p className="text-xs hover:text-sky-color ease-in-out duration-300 cursor-pointer">
            {t("common.hello")}, {t("auth.guests")}
          </p>
        </Link>

        <div className="text-sm">
          <Link
            href={"/auth/signin"}
            className="hover:text-sky-color ease-in-out duration-300 cursor-pointer"
          >
            {t("auth.login")}{" "}
          </Link>
          /{" "}
          <Link
            href={"/auth/register"}
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