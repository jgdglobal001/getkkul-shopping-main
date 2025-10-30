"use client";

import { addToCart } from "@/redux/shofySlice";
import { useDispatch, useSelector } from "react-redux";
import { ProductType, StateType } from "../../type";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  product?: ProductType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BuyNowButton = ({
  product,
  className,
  size = "md",
}: BuyNowButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart } = useSelector((state: StateType) => state?.shopy);
  const [isProcessing, setIsProcessing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  // Check if product is out of stock
  const isOutOfStock = !product?.stock || product.stock <= 0;

  const handleBuyNow = async () => {
    if (product && product.stock > 0) {
      setIsProcessing(true);
      
      // Serialize product to ensure createdAt/updatedAt are ISO strings, not Date objects
      const serializedProduct = {
        ...product,
        createdAt: product.createdAt ? (typeof product.createdAt === 'string' ? product.createdAt : new Date(product.createdAt).toISOString()) : undefined,
        updatedAt: product.updatedAt ? (typeof product.updatedAt === 'string' ? product.updatedAt : new Date(product.updatedAt).toISOString()) : undefined,
      };
      dispatch(addToCart(serializedProduct));

      // Simulate async operation
      setTimeout(() => {
        setIsProcessing(false);
        setJustCompleted(true);
        toast.success(`${product?.title.substring(0, 15)}... ${t('cart.add_success', '장바구니에 추가되었습니다!')}`, {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "white",
          },
        });

        // Navigate to cart page
        setTimeout(() => {
          setJustCompleted(false);
          router.push("/cart");
        }, 500);
      }, 300);
    } else {
      toast.error(t('product.out_of_stock', '품절된 상품입니다!'), {
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={isOutOfStock || isProcessing}
      className={twMerge(
        "relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden",
        "bg-pink-400 hover:bg-pink-500 text-white border border-pink-400 hover:border-pink-500",
        getSizeStyles(),
        isOutOfStock &&
          "bg-gray-300 border-gray-300 text-gray-500 hover:bg-gray-300 hover:text-gray-500",
        justCompleted &&
          "bg-green-500 border-green-500 text-white hover:bg-green-500 animate-pulse",
        isProcessing && "cursor-not-allowed",
        className
      )}
    >
      {isProcessing ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{t("common.adding", "추가 중...")}</span>
        </>
      ) : justCompleted ? (
        <>
          <FaCheck className="w-4 h-4" />
          <span>{t("common.added", "추가됨")}</span>
        </>
      ) : isOutOfStock ? (
        <span>{t("common.out_of_stock", "품절")}</span>
      ) : (
        <span>{t("product.buy_now", "바로 구매")}</span>
      )}

      {/* Ripple effect */}
      {!isOutOfStock && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
        </div>
      )}
    </button>
  );
};

export default BuyNowButton;