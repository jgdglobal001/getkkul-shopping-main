"use client";

import Container from "@/components/Container";
import ProductImages from "@/components/ProductImages";
import ProductPrice from "@/components/ProductPrice";
import ProductQA from "@/components/ProductQA";
import RelatedProducts from "@/components/RelatedProducts";
import ProductRequiredInfo from "@/components/ProductRequiredInfo";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import ProductDetailsInfo from "@/components/ProductDetailsInfo";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";
import ProductStickyNav from "@/components/ProductStickyNav";
import ProductShippingInfo from "@/components/ProductShippingInfo";
import ProductActionButtons from "@/components/ProductActionButtons";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { FaRegEye } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { ProductType, ProductVariant } from "../../type";
import { useState } from "react";

const ProductDetailClient = ({
    product,
    allProducts,
    questions
}: {
    product: any,
    allProducts: ProductType[],
    questions: any[]
}) => {
    const regularPrice = product?.price;
    const discountedPrice = product?.price - (product?.price * product?.discountPercentage) / 100;

    // 옵션 및 수량 상태 관리 (리프팅)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleVariantChange = (variant: ProductVariant | null, qty: number) => {
        setSelectedVariant(variant);
        setQuantity(qty);
    };

    const hasOptions = product.hasOptions && (product.options?.length > 0 || product.variants?.length > 0);
    const isDisabled = hasOptions && !selectedVariant;

    // 구매용 상품 데이터 구성
    const getProductForCart = () => {
        if (hasOptions && selectedVariant) {
            return {
                ...product,
                price: selectedVariant.price,
                stock: selectedVariant.stock,
                quantity: quantity,
                selectedVariant: selectedVariant,
                selectedOptions: selectedVariant.optionCombination,
            };
        }
        return product;
    };

    return (
        <div className="bg-white min-h-screen pb-0 md:pb-10 font-sans">
            <Container className="px-0 md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-14 py-0 md:py-10">
                    <div className="relative w-full bg-white z-10 pt-1 px-4 pb-0 md:p-0">
                        <ProductImages thumbnail={product?.thumbnail} images={product?.images} />
                    </div>

                    <div className="flex flex-col gap-6 px-4 pt-3 pb-2 md:px-0 md:py-0 bg-white relative z-0">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    {product?.title}
                                </h1>
                                <div className="flex-shrink-0">
                                    <ProductActionButtons product={product} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <ProductPrice
                                    regularPrice={regularPrice}
                                    discountedPrice={discountedPrice}
                                    product={product}
                                />
                                <div className="flex items-center gap-1">
                                    <div className="flex text-[#fa8900]">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <MdStar key={index} className={index < Math.floor(product?.rating || 0) ? "text-[#fa8900]" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600">({product?.rating?.toFixed(1)})</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <FaRegEye className="mr-1.5" />
                            <span>지금 <span className="font-bold text-gray-900">250+</span>명이 이 상품을 보고 있습니다</span>
                        </div>

                        <hr className="border-gray-100" />

                        <ProductDetailsInfo product={product} />

                        <div className="mt-2">
                            <ProductPurchaseSection
                                product={product}
                                options={product.options || []}
                                variants={product.variants || []}
                                selectedVariant={selectedVariant}
                                quantity={quantity}
                                onVariantChange={handleVariantChange}
                                showButtons={true}
                            />
                        </div>
                    </div>
                </div>
            </Container>

            {/* 쿠팡 스타일 스티키 네비게이션 */}
            <ProductStickyNav reviewCount={product?.reviews?.length || 0} />

            <Container className="px-0 md:px-4">
                {/* 하단 상세 정보 섹션: 네비게이션과 연동되는 4가지 주요 섹션 */}
                <div className="mt-8 px-4 md:px-0 space-y-20">
                    {/* 1. 상품상세 (필수 표기 정보 + 상세 설명) */}
                    <div id="details" className="scroll-mt-20">
                        <section id="required-info" className="mb-12">
                            <ProductRequiredInfo product={product} />
                        </section>
                        <section id="product-tabs">
                            <ProductDetailTabs product={product} />
                        </section>
                    </div>

                    {/* 2. 상품평 (리뷰) */}
                    <div id="reviews" className="scroll-mt-20">
                        <section className="space-y-6">
                            <h3 className="text-base font-semibold text-gray-900">구매 후기</h3>
                            <div className="p-6 md:p-12 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {product?.reviews?.map((item: any, index: number) => (
                                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 font-sans hover:shadow-md transition-shadow">
                                            <p className="font-medium text-gray-800 leading-relaxed min-h-[60px]">{item?.comment}</p>
                                            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                                                <span className="font-bold text-gray-700">{item?.reviewerName}</span>
                                                <div className="flex text-yellow-400">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <MdStar key={i} className={i < item.rating ? "text-yellow-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!product?.reviews || product?.reviews?.length === 0) && (
                                        <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-xl">
                                            등록된 구매 후기가 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 3. 상품문의 (Q&A) */}
                    <div id="qa" className="scroll-mt-20">
                        <ProductQA product={product} questions={questions} />
                    </div>

                    {/* 4. 배송/교환/반품 안내 */}
                    <div id="shipping" className="scroll-mt-20">
                        <ProductShippingInfo product={product} />
                    </div>
                </div>
            </Container>

            {/* 하단 구분선 및 관련 상품: 다른 섹션과 너비 정렬 및 여백 복구 */}
            <div className="mt-12 px-4 md:px-0">
                <Container className="border-t border-gray-100 pt-10 px-0">
                    <RelatedProducts
                        products={allProducts}
                        currentProductId={product?.id}
                        category={product?.category}
                    />
                </Container>
            </div>

            {/* 쿠팡 스타일 하단 고정 액션 바 (모바일 전용) */}
            {/* 기존 버튼의 스타일(색상, 폰트)을 그대로 유지 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3 w-full">
                    <div className="flex-1">
                        <AddToCartButton
                            product={getProductForCart()}
                            className="w-full h-12 bg-white border border-sky-500 text-sky-600 font-bold rounded-lg text-base"
                            showQuantity={false}
                            disabled={isDisabled}
                            selectedVariant={selectedVariant}
                        />
                    </div>
                    <div className="flex-1">
                        <BuyNowButton
                            product={getProductForCart()}
                            className="w-full h-12 bg-pink-400 border border-pink-400 text-white font-bold rounded-lg text-base shadow-md"
                            disabled={isDisabled}
                            variant={selectedVariant}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;
