"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Session } from "next-auth";
import SignOutButton from "./SignOutButton";

interface BottomNavigationProps {
  session: Session | null;
}

const navigationItems = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "categories", href: "/categories" },
  { key: "offers", href: "/offers" },
];

const BottomNavigation = ({ session }: BottomNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-xs md:text-sm font-medium flex items-center gap-5">
      {navigationItems?.map((item) => (
        <Link key={item.key} href={item.href}>
          {t(`navigation.${item.key}`)}
        </Link>
      ))}
      <SignOutButton session={session} />
    </div>
  );
};

export default BottomNavigation;