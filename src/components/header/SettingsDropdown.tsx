"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoChevronDownSharp } from "react-icons/io5";
import {
  FiUser,
  FiSettings,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiCreditCard,
  FiMapPin,
  FiBell,
  FiHelpCircle,
  FiStar,
} from "react-icons/fi";

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  // Don't show settings if user is not logged in
  if (!session?.user) {
    return null;
  }

  const menuItems = [
    {
      icon: FiUser,
      label: t("settings.myProfile"),
      path: "/account",
      description: t("settings.myProfileDesc"),
    },
    {
      icon: FiShoppingBag,
      label: t("settings.myOrders"),
      path: "/account/orders",
      description: t("settings.myOrdersDesc"),
    },
    {
      icon: FiHeart,
      label: t("settings.wishlist"),
      path: "/favorite",
      description: t("settings.wishlistDesc"),
    },
    {
      icon: FiMapPin,
      label: t("settings.addresses"),
      path: "/account/addresses",
      description: t("settings.addressesDesc"),
    },
    {
      icon: FiCreditCard,
      label: t("settings.paymentMethods"),
      path: "/account/payment",
      description: t("settings.paymentMethodsDesc"),
    },
    {
      icon: FiBell,
      label: t("settings.notifications"),
      path: "/account/notifications",
      description: t("settings.notificationsDesc"),
    },
    {
      icon: FiStar,
      label: t("settings.reviews"),
      path: "/account/reviews",
      description: t("settings.reviewsDesc"),
    },
    {
      icon: FiHelpCircle,
      label: t("settings.helpSupport"),
      path: "/help",
      description: t("settings.helpSupportDesc"),
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <FiSettings className="text-sm" />
        <span className="hidden md:inline">{t("settings.title")}</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2 max-h-96 overflow-y-auto"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session?.user?.name || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-theme-color/10 flex items-center justify-center">
                  <FiUser className="text-theme-color text-sm" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <item.icon className="text-gray-400 text-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <FiLogOut className="text-red-500 text-sm flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">{t("auth.sign_out")}</div>
                <div className="text-xs text-red-400">
                  {t("auth.sign_out_of_account")}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
