"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPackage,
  FiDollarSign,
  FiStar,
  FiImage,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
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
}

const ProductsManagementClient = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // 상품 데이터 가져오기
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        category: selectedCategory,
      });

      const response = await fetch(`/api/admin/products?${params}`);
      if (!response.ok) {
        throw new Error("상품 데이터를 가져오는데 실패했습니다");
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, fetchProducts]);

  // 상품 삭제
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("정말로 이 상품을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("상품 삭제에 실패했습니다");
      }

      await fetchProducts(); // 목록 새로고침
    } catch (err) {
      alert(err instanceof Error ? err.message : "상품 삭제 중 오류가 발생했습니다");
    }
  };

  // 카테고리 목록 (실제로는 API에서 가져와야 함)
  const categories = [
    "전체",
    "스마트폰",
    "노트북",
    "태블릿",
    "헤드폰",
    "스마트워치",
    "카메라",
    "게임",
    "홈&가든",
    "스포츠",
    "뷰티",
    "자동차",
  ];

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <FiPackage className="animate-spin text-4xl text-theme-color mb-4" />
          <p className="text-gray-600">상품 데이터를 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">데이터 로딩 오류</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-theme-color text-white px-6 py-2 rounded hover:bg-theme-color/80"
          >
            새로고침
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">상품 관리</h1>
            <p className="text-gray-600">상품을 추가, 수정, 삭제하고 재고를 관리하세요</p>
          </div>
          <Link
            href="/account/admin/products/new"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 mt-4 md:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            새 상품 추가
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="상품명, SKU, 브랜드로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                />
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category === "전체" ? "" : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 보기 모드 */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${viewMode === "grid"
                  ? "bg-theme-color text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${viewMode === "list"
                  ? "bg-theme-color text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">상품이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 상품을 추가해보세요!</p>
          <Link
            href="/account/admin/products/new"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/80 transition-colors inline-flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            상품 추가하기
          </Link>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductListCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${currentPage === page
                      ? "bg-theme-color text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

// 그리드 카드 컴포넌트
const ProductGridCard = ({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) => {
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* 이미지 */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
          referrerPolicy="no-referrer"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discountPercentage}%
          </div>
        )}
        {!product.isActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">비활성</span>
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
              {product.brand}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {product.title}
        </h3>

        {/* 가격 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-theme-color">
            ₩{discountedPrice.toLocaleString()}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-gray-500 line-through text-sm">
              ₩{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* 평점 및 재고 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0
            ? "text-green-600 bg-green-50"
            : "text-red-600 bg-red-50"
            }`}>
            재고 {product.stock}개
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <Link
            href={`/account/admin/products/${product.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <FiEye className="w-4 h-4" />
            보기
          </Link>
          <Link
            href={`/account/admin/products/${product.id}/edit`}
            className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <FiEdit className="w-4 h-4" />
            수정
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 리스트 카드 컴포넌트 (간단하게)
const ProductListCard = ({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) => {
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={64}
          height={64}
          className="object-cover rounded-lg"
          unoptimized
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-600">{product.category} • {product.brand}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="font-semibold text-theme-color">
              ₩{discountedPrice.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">재고 {product.stock}개</span>
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/account/admin/products/${product.id}`}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 text-sm"
          >
            <FiEye className="w-4 h-4" />
            보기
          </Link>
          <Link
            href={`/account/admin/products/${product.id}/edit`}
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm"
          >
            <FiEdit className="w-4 h-4" />
            수정
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagementClient;
