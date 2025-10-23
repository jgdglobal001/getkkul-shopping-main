import { logo } from "@/assets";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        src={logo}
        alt="겟꿀쇼핑 로고"
        width={210}
        height={84}
        className="w-80 h-auto"
        unoptimized
      />
    </Link>
  );
};

export default Logo;
