"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEdit, FiTrash2, FiArrowLeft, FiPackage, FiExternalLink } from "react-icons/fi";
import Container from "@/components/Container";
import ProductDetailClientPublic from "@/components/ProductDetailClient";
import { ProductType } from "../../../type";

interface AdminProductDetailClientProps {
    productId: string;
}

const ProductDetailClient = ({ productId }: AdminProductDetailClientProps) => {
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/products/${productId}`);
            if (!response.ok) {
                throw new Error("상품 정보를 가져오는데 실패했습니다");
            }
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleDelete = async () => {
        if (!confirm("정말로 이 상품을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("상품 삭제에 실패했습니다");
            }

            router.push("/account/admin/products");
        } catch (err) {
            alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다");
        }
    };

    if (loading) {
        return (
            <Container className="py-20">
                <div className="flex flex-col items-center justify-center">
                    <FiPackage className="animate-spin text-4xl text-theme-color mb-4" />
                    <p className="text-gray-600">상품 정보를 불러오는 중...</p>
                </div>
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container className="py-20">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">상품을 찾을 수 없습니다</h3>
                    <p className="text-gray-600 mb-6">{error || "해당 상품이 존재하지 않거나 접근 권한이 없습니다."}</p>
                    <Link
                        href="/account/admin/products"
                        className="bg-theme-color text-white px-6 py-2 rounded-lg hover:bg-theme-color/80 transition-colors"
                    >
                        목록으로 돌아가기
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 관리자 도구 모음 */}
            <div className="bg-white border-b sticky top-0 z-50 py-4 shadow-sm">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/account/admin/products"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {product.title}
                                    {!product.isActive && (
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">비활성</span>
                                    )}
                                </h1>
                                <p className="text-sm text-gray-500">ID: {productId} | SKU: {product.sku}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/products/${productId}`}
                                target="_blank"
                                className="bg-white border text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                            >
                                <FiExternalLink className="w-4 h-4" />
                                사용자 페이지 보기
                            </Link>
                            <Link
                                href={`/account/admin/products/${productId}/edit`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                            >
                                <FiEdit className="w-4 h-4" />
                                수정하기
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm"
                            >
                                <FiTrash2 className="w-4 h-4" />
                                삭제
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* 미리보기 (사용자 페이지 컴포넌트 재사용) */}
            <div className="mt-8">
                <div className="max-w-[1200px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden pointer-events-none opacity-90 select-none">
                    <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium">
                        사용자에게 보여지는 화면 미리보기입니다 (조작 불가)
                    </div>
                    <div className="transform scale-[0.98] origin-top">
                        <ProductDetailClientPublic
                            product={product}
                            allProducts={[]}
                            questions={[]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailClient;
