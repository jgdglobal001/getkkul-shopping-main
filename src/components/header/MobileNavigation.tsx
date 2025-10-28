"use client";
import React, { useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "offers", href: "/offers" },
  { key: "cart", href: "/cart" },
  { key: "orders", href: "/account/orders" },
];

const MobileNavigation = () => {
  const { t } = useTranslation();
  let [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="text-2xl md:hidden text-gray-500 hover:text-theme-color duration-200 cursor-pointer">
        <RiMenu3Fill onClick={toggleMenu} />
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 md:hidden text-white/80"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/90">
          <DialogPanel className="w-[94%] space-y-4 bg-primary p-6 border border-light-text rounded-md absolute top-10 m-5 bg-black">
            <div className="flex items-center justify-between gap-5">
              <h3 className="font-semibold text-xl">{t("navigation.menu")}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 text-2xl hover:text-red-600 duration-300 border border-white/20 rounded-xs hover:border-white/40"
              >
                <MdClose />
              </button>
            </div>
            <div className="flex flex-col gap-5 pt-5 cursor-pointer">
              {navigationItems?.map((item) => (
                <Link
                  onClick={() => setIsOpen(false)}
                  key={item?.key}
                  href={item?.href}
                  className="hover:text-sky-color relative group flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-white/80 inline-flex group-hover:border-sky-color" />{" "}
                  {t(`navigation.${item.key}`)}
                  <span className="absolute w-full h-px bg-white/20 left-0 -bottom-1 group-hover:bg-sky-color duration-300" />
                </Link>
              ))}
            </div>
            <SocialLinks />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileNavigation;
