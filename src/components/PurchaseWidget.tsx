"use client";

import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";

export default function PurchaseWidget() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <Link
        href="/cart"
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip - Hidden on mobile */}
        <div
          className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg whitespace-nowrap transition-all duration-300 hidden sm:block ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          장바구니
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>

        {/* Button */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-125 active:scale-95">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Mobile text */}
          <div className="absolute -top-8 right-0 text-xs font-medium whitespace-nowrap sm:hidden bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            장바구니
          </div>
        </div>

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-30 animate-ping"></div>
      </Link>
    </div>
  );
}
