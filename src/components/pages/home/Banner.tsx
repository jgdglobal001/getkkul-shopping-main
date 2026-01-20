"use client";
import Container from "@/components/Container";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { banner } from "@/constants";
import { GoArrowRight } from "react-icons/go";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#115061] py-20 text-theme-white">
      <Container className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-base font-semibold">{t("banner.price_text", { defaultValue: banner?.priceText })}</p>
          <h2 className="text-5xl font-bold max-w-[500px]">{t("banner.title", { defaultValue: banner?.title })}</h2>
          <p className="text-lg font-bold">
            {t("banner.text_one", { defaultValue: banner?.textOne })}{" "}
            <span className="text-light-yellow mx-1">{t("banner.offer_price", { defaultValue: banner?.offerPrice })}</span>
            {t("banner.text_two", { defaultValue: banner?.textTwo })}
          </p>
          <Button
            href={banner?.buttonLink}
            className="flex items-center gap-1 bg-theme-white text-black rounded-md w-36 px-0 justify-center text-sm font-semibold hover:bg-transparent hover:text-theme-white py-3 border border-transparent hover:border-white/40 duration-200"
          >
            {t("banner.buy_now", { defaultValue: "지금 구매하기" })} <GoArrowRight className="text-lg" />
          </Button>
        </div>
        <div className="relative w-96 h-96">
          <Image
            src={banner?.image.src}
            alt="bannerImageOne"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
