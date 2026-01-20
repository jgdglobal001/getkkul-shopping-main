"use client";
import React, { useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FaUser,
  FaBox,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { BiShoppingBag } from "react-icons/bi";
import { StateType } from "../../../type";

interface MobileNavigationProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
}

const MobileNavigation = ({ user }: MobileNavigationProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { cart, favorite } = useSelector((state: StateType) => state?.shopy);
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

  const fallbackImage =
    "https://res.cloudinary.com/dlbqw7atu/image/upload/v1747734054/userImage_dhytay.png";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    { href: "/account", icon: FaUser, label: t("settings.myProfile") },
    { href: "/account/orders", icon: FaBox, label: t("settings.myOrders") },
    { href: "/favorite", icon: FaHeart, label: t("settings.wishlist") },
    { href: "/account/settings", icon: FaCog, label: t("settings.title") },
  ];

  const adminMenuItems =
    user?.role === "admin"
      ? [
        {
          href: "/account/admin",
          icon: FaShieldAlt,
          label: t("common.admin_dashboard") || "Admin Dashboard",
        },
      ]
      : [];

  const allMenuItems = [...menuItems, ...adminMenuItems];

  return (
    <>
      {/* Header Icons for Mobile */}
      <div className="flex items-center gap-3 md:hidden">
        <Link href="/favorite" className="text-xl relative">
          <MdFavoriteBorder />
          <span className="absolute -top-1 -right-1 text-[8px] font-medium w-3.5 h-3.5 bg-theme-color text-white rounded-full flex items-center justify-center">
            {favorite?.length > 0 ? favorite?.length : "0"}
          </span>
        </Link>
        <Link href="/cart" className="text-xl relative">
          <BiShoppingBag />
          <span className="absolute -top-1 -right-1 text-[8px] font-medium w-3.5 h-3.5 bg-theme-color text-white rounded-full flex items-center justify-center">
            {cart?.length > 0 ? cart?.length : "0"}
          </span>
        </Link>
        <div className="text-2xl text-gray-500 hover:text-theme-color duration-200 cursor-pointer">
          <RiMenu3Fill onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 md:hidden"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <DialogPanel className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-lg text-gray-900">
              {t("navigation.menu")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* User Profile Section */}
          {user ? (
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200 relative">
                  <Image
                    src={user.image || fallbackImage}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-100">
              <Link
                href={signInUrl}
                onClick={() => setIsOpen(false)}
                className="block w-full py-2.5 px-4 bg-orange-500 text-white text-center rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                로그인
              </Link>
              <Link
                href={registerUrl}
                onClick={() => setIsOpen(false)}
                className="block w-full mt-2 py-2.5 px-4 border border-orange-500 text-orange-500 text-center rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                회원가입
              </Link>
            </div>
          )}

          {/* Menu Items */}
          {user && (
            <div className="py-2">
              {allMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${item.label === (t("common.admin_dashboard") || "Admin Dashboard")
                      ? "text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                      : "text-gray-700 hover:bg-gray-50 hover:text-sky-color"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Sign Out Button */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                {t("auth.sign_out")}
              </button>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default MobileNavigation;
