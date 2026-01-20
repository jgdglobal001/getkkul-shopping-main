"use client";

import React, { useEffect, useState } from "react";
import { ProductType, StateType } from "../../type";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { addToFavorite } from "@/redux/shofySlice";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";

interface Props {
  product: ProductType;
}

const ProductActionButtons = ({ product }: Props) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { favorite } = useSelector((state: StateType) => state?.shopy);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if product is in favorites
  useEffect(() => {
    if (session?.user) {
      const isInFavorites = favorite?.some((item) => item.id === product.id);
      setIsFavorite(!!isInFavorites);
    }
  }, [favorite, product.id, session?.user]);

  const handleFavoriteClick = () => {
    if (session?.user) {
      // Redux에 저장하기 전에 직렬화 불가능한 값(Date, Timestamp 등)을 문자열로 변환
      const serializableProduct = {
        ...product,
        createdAt: product.createdAt
          ? typeof product.createdAt === "string"
            ? product.createdAt
            : product.createdAt instanceof Date
              ? product.createdAt.toISOString()
              : (product.createdAt as any)?.toDate?.()?.toISOString() || null
          : null,
        updatedAt: product.updatedAt
          ? typeof product.updatedAt === "string"
            ? product.updatedAt
            : product.updatedAt instanceof Date
              ? product.updatedAt.toISOString()
              : (product.updatedAt as any)?.toDate?.()?.toISOString() || null
          : null,
        meta: product.meta
          ? {
              ...product.meta,
              createdAt: product.meta.createdAt
                ? typeof product.meta.createdAt === "string"
                  ? product.meta.createdAt
                  : (product.meta.createdAt as any)?.toDate?.()?.toISOString() || null
                : null,
              updatedAt: product.meta.updatedAt
                ? typeof product.meta.updatedAt === "string"
                  ? product.meta.updatedAt
                  : (product.meta.updatedAt as any)?.toDate?.()?.toISOString() || null
                : null,
            }
          : null,
      };
      dispatch(addToFavorite(serializableProduct));
      if (isFavorite) {
        toast.success("관심 상품에서 제거되었습니다");
      } else {
        toast.success("관심 상품에 추가되었습니다");
      }
    } else {
      toast.error("로그인이 필요합니다");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/products/${product.id}`;
    const shareData = {
      title: product.title,
      text: product.description || product.title,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("공유되었습니다");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("링크가 복사되었습니다");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("링크가 복사되었습니다");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200"
        title={isFavorite ? "관심 상품에서 제거" : "관심 상품에 추가"}
      >
        {isFavorite ? (
          <MdFavorite className="w-5 h-5 text-red-500" />
        ) : (
          <MdFavoriteBorder className="w-5 h-5 text-gray-500 hover:text-red-500" />
        )}
      </button>
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
        title="공유하기"
      >
        <FaShareAlt className="w-4 h-4 text-gray-500 hover:text-blue-500" />
      </button>
    </div>
  );
};

export default ProductActionButtons;

