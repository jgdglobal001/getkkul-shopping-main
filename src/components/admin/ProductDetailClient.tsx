"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiDollarSign,
  FiStar,
  FiImage,
  FiTag,
  FiInfo,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity: number;
  availabilityStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cartItems?: Array<{ id: string; quantity: number; userId: string }>;
  wishlistItems?: Array<{ id: string; userId: string }>;
  orderItems?: Array<{ id: string; quantity: number; orderId: string }>;
}

interface ProductDetailClientProps {
  productId: string;
}

const ProductDetailClient = ({ productId }: ProductDetailClientProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error("상품 정보를 가져오는데 실패했습니다");
      }

      const productData = await response.json();
      setProduct(productData);
      // images 배열이 undefined일 수 있으므로 안전하게 처리
      const images = Array.isArray(productData.images) ? productData.images : [];
      setSelectedImage(productData.thumbnail || images[0] || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
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
      alert(err instanceof Error ? err.message : "상품 삭제 중 오류가 발생했습니다");
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <FiPackage className="animate-spin text-4xl text-theme-color mb-4" />
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">상품을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/account/admin/products"
            className="bg-theme-color text-white px-6 py-2 rounded hover:bg-theme-color/80"
          >
            상품 목록으로 돌아가기
          </Link>
        </div>
      </Container>
    );
  }

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Container className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/account/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            상품 관리로 돌아가기
          </Link>
          
          <div className="flex gap-2">
            <Link
              href={`/account/admin/products/${productId}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiEdit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleDeleteProduct}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          {!product.isActive && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <FiEyeOff className="w-4 h-4" />
              비활성
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>SKU: {product.sku}</span>
          <span>•</span>
          <span>카테고리: {product.category}</span>
          {product.brand && (
            <>
              <span>•</span>
              <span>브랜드: {product.brand}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 이미지 섹션 */}
        <div>
          {/* 메인 이미지 */}
          <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden relative">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* 이미지 썸네일 */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {[product.thumbnail, ...(product.images || [])].filter(Boolean).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors relative ${
                    selectedImage === image ? "border-theme-color" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 섹션 */}
        <div className="space-y-6">
          {/* 가격 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">가격 정보</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-theme-color">
                  ₩{discountedPrice.toLocaleString()}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₩{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                      -{product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
                <span>•</span>
                <span className={`font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  재고 {product.stock}개
                </span>
                <span>•</span>
                <span>{product.availabilityStatus}</span>
              </div>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">판매 통계</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FiShoppingCart className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">장바구니</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.cartItems?.length || 0}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FiHeart className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">위시리스트</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.wishlistItems?.length || 0}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FiPackage className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">주문</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.orderItems?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* 태그 */}
          {product.tags.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-4">
                <FiTag className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">태그</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 상품 설명 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <FiInfo className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">상품 설명</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {/* 상세 스펙 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <FiSettings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">상세 스펙</h2>
          </div>
          
          <div className="space-y-3">
            {product.weight && (
              <div className="flex justify-between">
                <span className="text-gray-600">무게:</span>
                <span className="font-medium">{product.weight}kg</span>
              </div>
            )}
            
            {product.dimensions && (
              <div className="flex justify-between">
                <span className="text-gray-600">치수:</span>
                <span className="font-medium">
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">최소 주문 수량:</span>
              <span className="font-medium">{product.minimumOrderQuantity}개</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">등록일:</span>
              <span className="font-medium">
                {new Date(product.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">수정일:</span>
              <span className="font-medium">
                {new Date(product.updatedAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>

        {/* 보증 정보 */}
        {product.warrantyInformation && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">보증 정보</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.warrantyInformation}
            </p>
          </div>
        )}

        {/* 배송 정보 */}
        {product.shippingInformation && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">배송 정보</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.shippingInformation}
            </p>
          </div>
        )}

        {/* 반품 정책 */}
        {product.returnPolicy && (
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">반품 정책</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.returnPolicy}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductDetailClient;
