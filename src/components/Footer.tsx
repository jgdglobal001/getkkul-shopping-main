"use client";

import Container from "./Container";
import { logo } from "@/assets";
import SocialLink from "./SocialLink";
import Title from "./Title";
import { FaFacebook } from "react-icons/fa";
import { InfoNavigation, navigation } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { BsEnvelopeAt } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-light-bg pt-8 pb-10 lg:py-20">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col items-start gap-y-5">
          <Link href={"/"}>
            <Image src={logo} alt="겟꿀쇼핑 로고" width={224} height={80} unoptimized />
          </Link>
          <p className="text-sm text-gray-700">
            {t("footer.about_us")}
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-bold">{t("footer.company_name")}</span></p>
            <p><span className="font-semibold">{t("footer.business_registration")}:</span> {t("footer.business_number")}</p>
            <p><span className="font-semibold">{t("footer.telecom_sales")}:</span> {t("footer.telecom_number")}</p>
            <p><span className="font-semibold">{t("footer.representative")}:</span> {t("footer.representative_name")}</p>
            <p><span className="font-semibold">{t("footer.privacy_officer")}:</span> {t("footer.privacy_officer_name")}</p>
          </div>
          <SocialLink />
        </div>
        <div>
          <Title className="text-sm md:text-xl">{t("footer.information")}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            <Link
              href="/about"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.about_us_page")}
            </Link>
            <Link
              href="/inquiry"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.inquiry")}
            </Link>
            <Link
              href="/customer-service"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.customer_service")}
            </Link>
            <Link
              href="/faqs"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.faq")}
            </Link>
          </div>
        </div>
        <div>
          <Title className="text-sm md:text-xl">{t("footer.legal_info")}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            <Link
              href="/terms-of-service"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.terms_of_service")}
            </Link>
            <Link
              href="/privacy-policy"
              className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium text-xs md:text-base"
            >
              <GoDotFill size={10} />
              {t("footer.privacy_policy")}
            </Link>
          </div>
        </div>
        <div>
          <Title className="text-sm md:text-xl">{t("footer.talk_to_us")}</Title>
          <div className="mt-3">
            <div>
              <p className="text-[10px] md:text-sm">{t("footer.got_questions")} {t("footer.call_us")}</p>
              <Title className="text-base md:text-xl">{t("footer.phone")}</Title>
            </div>
            <div className="mt-3">
              <p className="text-xs md:text-base flex items-center gap-x-3 text-gray-600">
                <BsEnvelopeAt /> {t("footer.email")}
              </p>
              <p className="text-xs md:text-base flex items-center gap-x-3 text-gray-600">
                <GrLocation /> {t("footer.address")}
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Copyright Section */}
      <div className="border-t border-gray-300 mt-10 pt-6">
        <Container>
          <p className="text-center text-xs text-gray-500">
            {t("footer.copyright")}
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
