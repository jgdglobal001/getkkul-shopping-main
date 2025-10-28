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
    <div className="bg-light-bg py-10 lg:py-20">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col items-start gap-y-5">
          <Link href={"/"}>
            <Image src={logo} alt="겟꿀쇼핑 로고" width={224} height={80} unoptimized />
          </Link>
          <p>
            {t("footer.about_us")}
          </p>
          <SocialLink />
        </div>
        <div>
          <Title>{t("footer.my_account")}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            {navigation?.map((item) => (
              <Link
                key={item?.title}
                href={item?.href}
                className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium"
              >
                <GoDotFill size={10} />
                {item?.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Title>{t("footer.information")}</Title>
          <div className="mt-3 flex flex-col gap-y-2">
            {InfoNavigation?.map((item) => (
              <Link
                key={item?.title}
                href={item?.href}
                className="flex items-center gap-x-2 text-gray-700 hover:text-theme-color duration-200 font-medium"
              >
                <GoDotFill size={10} />
                {item?.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Title>{t("footer.talk_to_us")}</Title>
          <div className="mt-3">
            <div>
              <p className="text-sm">{t("footer.got_questions")} {t("footer.call_us")}</p>
              <Title>+670 413 90 762</Title>
            </div>
            <div className="mt-3">
              <p className="text-base flex items-center gap-x-3 text-gray-600">
                <BsEnvelopeAt /> shofy@suppert.com
              </p>
              <p className="text-base flex items-center gap-x-3 text-gray-600">
                <GrLocation /> Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
