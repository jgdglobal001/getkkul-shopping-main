"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ProductStickyNavProps {
    reviewCount?: number;
}

const ProductStickyNav: React.FC<ProductStickyNavProps> = ({ reviewCount = 0 }) => {
    const [activeSection, setActiveSection] = useState<string>("details");

    const navItems = [
        { id: "details", label: "상품상세" },
        { id: "reviews", label: `상품평${reviewCount > 0 ? ` (${reviewCount})` : ""}` },
        { id: "qa", label: "상품문의" },
        { id: "shipping", label: "배송/교환/반품 안내" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 60; // Sticky nav height approx
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset for detection

            navItems.forEach((item) => {
                const element = document.getElementById(item.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(item.id);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    return (
        <div className="sticky top-0 z-40 bg-white w-full">
            <div className="max-w-[1140px] mx-auto px-4 lg:px-0">
                <div className="grid grid-cols-4 border-t border-b border-gray-200">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={twMerge(
                                "py-4 text-center text-[12px] md:text-sm font-bold border-r border-gray-200 last:border-r-0 transition-all relative",
                                activeSection === item.id
                                    ? "text-gray-900"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {activeSection === item.id && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-gray-900 z-10" />
                            )}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductStickyNav;
