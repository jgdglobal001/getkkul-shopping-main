import React from "react";
import { ProductType } from "../../type";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./ProductPrice";
import { FaStar, FaHeart, FaEye } from "react-icons/fa";

interface Props {
  product: ProductType;
  view?: "grid" | "list";
}

const EnhancedProductCard = ({ product, view = "grid" }: Props) => {
  const regularPrice = product?.price;
  const discountedPrice =
    product?.price - (product?.price * product?.discountPercentage) / 100;

  if (view === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-48 h-40 md:h-48 flex-shrink-0 relative group/image">
            <Link
              href={{
                pathname: `/products/${product?.id}`,
                query: { id: product?.id },
              }}
            >
              <Image
                src={product?.images[0]}
                alt={product?.title}
                fill
                className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                unoptimized
              />
            </Link>

            {product?.discountPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{Math.round(product.discountPercentage)}% OFF
              </div>
            )}

            {product?.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-sm">
                  품절
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 hover:text-red-500">
                <FaHeart className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-blue-50 hover:text-blue-500">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:h-full gap-4 md:gap-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    {product?.category}
                  </p>
                  {product?.brand && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                      {product.brand}
                    </span>
                  )}
                </div>

                <Link
                  href={{
                    pathname: `/products/${product?.id}`,
                    query: { id: product?.id },
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                    {product?.title}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {product?.description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product?.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product?.rating}) • {product?.reviews?.length || 0}{" "}
                    reviews
                  </span>
                </div>

                <ProductPrice
                  regularPrice={regularPrice}
                  discountedPrice={discountedPrice}
                  product={product}
                />
              </div>

              <div className="flex flex-col justify-between items-start md:items-end md:ml-6 w-full md:w-auto md:min-w-[140px]">
                <div className="text-left md:text-right w-full md:w-auto">
                  <p className="text-sm text-gray-500 mb-1">재고 상태</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product?.stock > 10
                          ? "bg-green-500"
                          : product?.stock > 0
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p
                      className={`text-sm font-medium ${
                        product?.stock > 10
                          ? "text-green-600"
                          : product?.stock > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product?.stock > 0
                        ? `재고 ${product.stock}개`
                        : "품절"}
                    </p>
                  </div>
                </div>

                <AddToCartButton
                  product={product}
                  variant="primary"
                  size="md"
                  className="w-full md:w-auto md:min-w-[120px] shadow-md mt-4 md:mt-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link
          href={{
            pathname: `/products/${product?.id}`,
            query: { id: product?.id },
          }}
        >
          <Image
            src={product?.thumbnail || product?.images?.[0] || ""}
            alt={product?.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        </Link>

        {product?.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
            -{Math.round(product.discountPercentage)}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {product?.stock <= 5 && product?.stock > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            {product.stock}개 남음!
          </div>
        )}

        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              품절
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transform hover:scale-110 transition-all duration-200">
            <FaHeart className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transform hover:scale-110 transition-all duration-200">
            <FaEye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {product?.category}
          </p>
          {product?.brand && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
              {product.brand}
            </span>
          )}
        </div>

        <Link
          href={{
            pathname: `/products/${product?.id}`,
            query: { id: product?.id },
          }}
        >
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate mb-3 leading-tight text-sm">
            {product?.title}
          </h3>
        </Link>

        {/* Rating and Stock in flex-col */}
        <div className="flex flex-col gap-2 mb-3">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product?.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product?.rating})
            </span>
          </div>

          {/* Stock Status */}
          {product?.stock > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium w-fit">
              재고 {product.stock}개
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <ProductPrice
            regularPrice={regularPrice}
            discountedPrice={discountedPrice}
            product={product}
          />
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          variant="outline"
          size="sm"
          className="w-full group-hover:variant-primary transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default EnhancedProductCard;
