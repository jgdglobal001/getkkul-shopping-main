"use client";

export const runtime = 'edge';

import React from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { StateType } from "../../../../type";
import { addToFavorite, addToCart, resetFavorite } from "@/redux/shofySlice";
import Container from "@/components/Container";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaEye, FaTrash } from "react-icons/fa";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import toast from "react-hot-toast";
import PriceFormat from "@/components/PriceFormat";
import { useTranslation } from "react-i18next";

const FavoritePage = () => {
  const { t } = useTranslation();
  const { favorite } = useSelector((state: StateType) => state?.shopy);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const handleRemoveFromFavorite = (productId: string | number) => {
    const product = favorite.find((item) => item.id === productId);
    if (product) {
      dispatch(addToFavorite(product)); // This will remove it due to toggle logic
      toast.success(t("wishlist.removed_success"));
    }
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    toast.success(t("wishlist.added_to_cart_success"));
  };

  const handleClearAllFavorites = () => {
    if (window.confirm(t("wishlist.clear_all_confirm"))) {
      dispatch(resetFavorite());
      toast.success(t("wishlist.cleared_success"));
    }
  };

  // Redirect if not logged in
  if (!session?.user) {
    return (
      <Container className="py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <MdFavoriteBorder className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("wishlist.sign_in_required")}
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              {t("wishlist.sign_in_desc")}
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-theme-color hover:bg-theme-color/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-color transition-colors duration-200"
            >
              {t("wishlist.sign_in_button")}
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("wishlist.title")}</h1>
            <p className="text-gray-600 mt-2">
              {t("wishlist.items_count", { count: favorite?.length || 0 })}
            </p>
          </div>
          {favorite?.length > 0 && (
            <button
              onClick={handleClearAllFavorites}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors duration-200"
            >
              <FaTrash className="h-4 w-4" />
              {t("wishlist.clear_all")}
            </button>
          )}
        </div>

        {/* Empty State */}
        {!favorite || favorite.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <MdFavoriteBorder className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("wishlist.empty_title")}
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto break-keep">
              {t("wishlist.empty_desc")}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-theme-color hover:bg-theme-color/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-color transition-colors duration-200"
            >
              {t("wishlist.browse_products")}
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorite.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={product.images?.[0] || "/placeholder-product.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </Link>

                  {/* Discount Badge */}
                  {product.discountPercentage &&
                    product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleRemoveFromFavorite(product.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                      title={t("wishlist.remove_tooltip")}
                    >
                      <MdFavorite className="h-4 w-4 text-red-500" />
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors duration-200"
                      title={t("wishlist.view_details_tooltip")}
                    >
                      <FaEye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 capitalize">
                    {product.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <PriceFormat
                        amount={product.price}
                        className="font-bold text-lg"
                      />
                      {product.discountPercentage &&
                        product.discountPercentage > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            <PriceFormat
                              amount={
                                product.price /
                                (1 - product.discountPercentage / 100)
                              }
                            />
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${product.stock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-theme-color text-white hover:bg-theme-color/90"
                        }`}
                    >
                      <FaShoppingCart className="h-4 w-4" />
                      {product.stock === 0 ? t("common.out_of_stock") : t("common.add_to_cart")}
                    </button>
                    {/* Remove from Favorite Button */}
                    <button
                      onClick={() => handleRemoveFromFavorite(product.id)}
                      className="px-3 py-2 rounded-md border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      title={t("wishlist.remove_tooltip")}
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {favorite && favorite.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-color transition-colors duration-200"
            >
              {t("wishlist.continue_shopping")}
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FavoritePage;
