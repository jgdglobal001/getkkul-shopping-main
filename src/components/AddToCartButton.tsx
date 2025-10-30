"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/shofySlice";
import { useDispatch, useSelector } from "react-redux";
import { ProductType, StateType } from "../../type";
import toast from "react-hot-toast";
import { FaPlus, FaCheck } from "react-icons/fa6";
import { FaMinus, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

interface PropsType {
  product?: ProductType;
  className?: string;
  variant?: "default" | "primary" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  showQuantity?: boolean;
}

const AddToCartButton = ({
  product,
  className,
  variant = "default",
  size = "md",
  showQuantity = true,
}: PropsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cart } = useSelector((state: StateType) => state?.shopy);
  const [existingProduct, setExistingProduct] = useState<ProductType | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const availableProduct = cart?.find((item) => item?.id === product?.id);
    if (availableProduct) {
      setExistingProduct(availableProduct);
    } else {
      setExistingProduct(null);
    }
  }, [cart, product]);

  const handleAddToCart = async () => {
    if (product && product.stock > 0) {
      setIsAdding(true);
      // Serialize product to ensure createdAt/updatedAt are ISO strings, not Date objects
      const serializedProduct = {
        ...product,
        createdAt: product.createdAt ? (typeof product.createdAt === 'string' ? product.createdAt : new Date(product.createdAt).toISOString()) : undefined,
        updatedAt: product.updatedAt ? (typeof product.updatedAt === 'string' ? product.updatedAt : new Date(product.updatedAt).toISOString()) : undefined,
      };
      dispatch(addToCart(serializedProduct));

      // Simulate async operation
      setTimeout(() => {
        setIsAdding(false);
        setJustAdded(true);
        toast.success(`${product?.title.substring(0, 15)}... ${t('cart.add_success', '장바구니에 추가되었습니다!')}`, {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "white",
          },
        });

        // Reset the "just added" state
        setTimeout(() => setJustAdded(false), 2000);
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

  const handleIncrease = () => {
    // 재고 수량을 초과하지 않도록 체크
    if (existingProduct?.quantity! < (product?.stock || 0)) {
      dispatch(increaseQuantity(product?.id));
      toast.success(t('cart.quantity_increased', '수량이 증가되었습니다!'), {
        duration: 1500,
        style: {
          background: "#10B981",
          color: "white",
        },
      });
    } else {
      toast.error(t('product.max_stock_reached', '재고 수량을 초과할 수 없습니다!'), {
        duration: 1500,
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    }
  };

  const handleDecrease = () => {
    if (existingProduct?.quantity! > 1) {
      // 수량이 2 이상일 때 - 정상 감소
      dispatch(decreaseQuantity(product?.id));
      toast.success(t('cart.quantity_decreased', '수량이 감소되었습니다!'), {
        duration: 1500,
        style: {
          background: "#F59E0B",
          color: "white",
        },
      });
    } else if (existingProduct?.quantity === 1) {
      // 수량이 정확히 1일 때 - 담기 취소 모드 진입
      setIsCanceling(true);
    }
  };

  const handleCancelAdding = () => {
    dispatch(removeFromCart(product?.id));
    setIsCanceling(false);
    toast.success(t('cart.cancel_adding', '담기 취소'), {
      duration: 1500,
      style: {
        background: "#F59E0B",
        color: "white",
      },
    });
  };

  // Base styles for different variants
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700";
      case "outline":
        return "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
      case "minimal":
        return "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300";
      default:
        return "bg-transparent border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white";
    }
  };

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

  return (
    <>
      {existingProduct && showQuantity ? (
        isCanceling ? (
          // Cancel mode - show cancel button
          <button
            onClick={handleCancelAdding}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-200 text-sm font-medium"
          >
            <span>{t("cart.cancel_adding", "담기 취소")}</span>
          </button>
        ) : (
          // Normal quantity controls
          <div className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button
              onClick={handleDecrease}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-md border transition-all duration-200"
            >
              <FaMinus className="w-3 h-3" />
            </button>

            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-sm font-semibold text-gray-800">
                {existingProduct?.quantity}
              </span>
              <span className="text-xs text-gray-500">{t("common.in_cart")}</span>
            </div>

            <button
              onClick={handleIncrease}
              disabled={existingProduct?.quantity! >= (product?.stock || 0)}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        )
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={twMerge(
            "relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden",
            getVariantStyles(),
            getSizeStyles(),
            isOutOfStock &&
              "bg-gray-300 border-gray-300 text-gray-500 hover:bg-gray-300 hover:text-gray-500",
            justAdded &&
              "bg-green-500 border-green-500 text-white hover:bg-green-500 animate-pulse",
            isAdding && "cursor-not-allowed",
            className
          )}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t("common.adding")}</span>
            </>
          ) : justAdded ? (
            <>
              <FaCheck className="w-4 h-4" />
              <span>{t("common.added")}</span>
            </>
          ) : isOutOfStock ? (
            <span>{t("common.out_of_stock")}</span>
          ) : (
            <>
              <FaShoppingCart className="w-4 h-4" />
              <span>{t("common.add_to_cart")}</span>
            </>
          )}

          {/* Ripple effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default AddToCartButton;
