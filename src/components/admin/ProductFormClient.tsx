"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiPlus,
  FiImage,
  FiPackage,
  FiDollarSign,
  FiInfo,
  FiSettings,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import Container from "@/components/Container";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  discountPercentage: string;
  rating: string;
  stock: string;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  detailImages: string[];
  tags: string[];
  sku: string;
  isActive: boolean;
  // ⭐ 필수 표기 정보
  productName: string;
  modelNumber: string;
  size: string;
  material: string;
  releaseDate: string;
  manufacturer: string;
  madeInCountry: string;
  warrantyStandard: string;
  asResponsible: string;
  kcCertification: string;
  color: string;
  productComposition: string;
  detailedSpecs: string;
  // ⭐ 배송 정보
  shippingMethod: string;
  shippingCost: string;
  bundleShipping: string;
  shippingPeriod: string;
  // ⭐ 교환/반품 정보
  exchangeReturnCost: string;
  exchangeReturnDeadline: string;
  exchangeReturnLimitations: string;
  clothingLimitations: string;
  foodLimitations: string;
  electronicsLimitations: string;
  autoLimitations: string;
  mediaLimitations: string;
  // ⭐ 판매자 정보
  sellerName: string;
  sellerPhone: string;
  sellerLegalNotice: string;
}

interface ProductFormClientProps {
  mode: "create" | "edit";
  productId?: string;
}

const ProductFormClient = ({ mode, productId }: ProductFormClientProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newDetailImage, setNewDetailImage] = useState("");

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    discountPercentage: "0",
    rating: "0",
    stock: "0",
    brand: "",
    category: "",
    thumbnail: "",
    images: [],
    detailImages: [],
    tags: [],
    sku: "",
    isActive: true,
    // ⭐ 필수 표기 정보
    productName: "",
    modelNumber: "",
    size: "",
    material: "",
    releaseDate: "",
    manufacturer: "",
    madeInCountry: "",
    warrantyStandard: "",
    asResponsible: "",
    kcCertification: "",
    color: "",
    productComposition: "",
    detailedSpecs: "",
    // ⭐ 배송 정보
    shippingMethod: "",
    shippingCost: "",
    bundleShipping: "",
    shippingPeriod: "",
    // ⭐ 교환/반품 정보
    exchangeReturnCost: "",
    exchangeReturnDeadline: "",
    exchangeReturnLimitations: "",
    clothingLimitations: "",
    foodLimitations: "",
    electronicsLimitations: "",
    autoLimitations: "",
    mediaLimitations: "",
    // ⭐ 판매자 정보
    sellerName: "",
    sellerPhone: "",
    sellerLegalNotice: "",
  });

  // 카테고리 목록
  const categories = [
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
    "의류",
    "신발",
    "가전제품",
    "도서",
    "음악",
    "영화",
    "완구",
    "반려동물",
    "기타",
  ];

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === "edit" && productId) {
      fetchProduct();
    }
  }, [mode, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error("상품 정보를 가져오는데 실패했습니다");
      }

      const product = await response.json();
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        discountPercentage: product.discountPercentage?.toString() || "0",
        rating: product.rating?.toString() || "0",
        stock: product.stock?.toString() || "0",
        brand: product.brand || "",
        category: product.category || "",
        thumbnail: product.thumbnail || "",
        images: Array.isArray(product.images) ? product.images : [],
        detailImages: Array.isArray(product.detailImages) ? product.detailImages : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        sku: product.sku || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        // ⭐ 필수 표기 정보
        productName: product.productName || "",
        modelNumber: product.modelNumber || "",
        size: product.size || "",
        material: product.material || "",
        releaseDate: product.releaseDate || "",
        manufacturer: product.manufacturer || "",
        madeInCountry: product.madeInCountry || "",
        warrantyStandard: product.warrantyStandard || "",
        asResponsible: product.asResponsible || "",
        kcCertification: product.kcCertification || "",
        color: product.color || "",
        productComposition: product.productComposition || "",
        detailedSpecs: product.detailedSpecs || "",
        // ⭐ 배송 정보
        shippingMethod: product.shippingMethod || "",
        shippingCost: product.shippingCost || "",
        bundleShipping: product.bundleShipping || "",
        shippingPeriod: product.shippingPeriod || "",
        // ⭐ 교환/반품 정보
        exchangeReturnCost: product.exchangeReturnCost || "",
        exchangeReturnDeadline: product.exchangeReturnDeadline || "",
        exchangeReturnLimitations: product.exchangeReturnLimitations || "",
        clothingLimitations: product.clothingLimitations || "",
        foodLimitations: product.foodLimitations || "",
        electronicsLimitations: product.electronicsLimitations || "",
        autoLimitations: product.autoLimitations || "",
        mediaLimitations: product.mediaLimitations || "",
        // ⭐ 판매자 정보
        sellerName: product.sellerName || "",
        sellerPhone: product.sellerPhone || "",
        sellerLegalNotice: product.sellerLegalNotice || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "상품 정보를 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 중첩 객체 변경 핸들러
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProductFormData] as any,
        [field]: value,
      },
    }));
  };

  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // 이미지 추가
  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");

      // 썸네일이 명시적으로 설정되지 않았을 때만 첫 번째 추가 이미지를 썸네일로 설정
      // 관리자가 이미 썸네일을 설정했다면 절대 덮어쓰지 않음
      if (!formData.thumbnail && formData.images.length === 0) {
        setFormData(prev => ({
          ...prev,
          thumbnail: newImage.trim(),
        }));
      }
    }
  };

  // 이미지 제거
  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove),
      // 썸네일이 제거된 이미지였다면 첫 번째 이미지로 변경
      thumbnail: prev.thumbnail === imageToRemove
        ? prev.images.filter(img => img !== imageToRemove)[0] || ""
        : prev.thumbnail,
    }));
  };

  // 상세 이미지 추가
  const addDetailImage = () => {
    if (newDetailImage.trim() && !formData.detailImages.includes(newDetailImage.trim())) {
      setFormData(prev => ({
        ...prev,
        detailImages: [...prev.detailImages, newDetailImage.trim()],
      }));
      setNewDetailImage("");
    }
  };



  // 상세 이미지 제거
  const removeDetailImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter(img => img !== imageToRemove),
    }));
  };

  // SKU 자동 생성
  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const sku = `${prefix}-${timestamp}-${randomNum}`;
    handleInputChange("sku", sku);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.sku) {
      setError("필수 필드를 모두 입력해주세요");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // 데이터 준비
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage),
        rating: parseFloat(formData.rating),
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions.width || formData.dimensions.height || formData.dimensions.depth
          ? {
              width: parseFloat(formData.dimensions.width) || 0,
              height: parseFloat(formData.dimensions.height) || 0,
              depth: parseFloat(formData.dimensions.depth) || 0,
            }
          : null,
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
      };

      const url = mode === "create" 
        ? "/api/admin/products"
        : `/api/admin/products/${productId}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "상품 저장에 실패했습니다");
      }

      // 성공 시 상품 관리 페이지로 이동
      router.push("/account/admin/products");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "상품 저장 중 오류가 발생했습니다");
    } finally {
      setSaving(false);
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

  return (
    <Container className="py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/account/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            상품 관리로 돌아가기
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "create" ? "새 상품 추가" : "상품 수정"}
        </h1>
        <p className="text-gray-600">
          {mode === "create" 
            ? "새로운 상품을 추가하여 고객에게 판매하세요" 
            : "상품 정보를 수정하여 최신 상태로 유지하세요"
          }
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="text-red-600">❌</div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <FiInfo className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 상품명 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="상품명을 입력하세요"
                required
              />
            </div>

            {/* 설명 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                required
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 브랜드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                브랜드
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="브랜드명을 입력하세요"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                  placeholder="SKU를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  자동생성
                </button>
              </div>
            </div>

            {/* 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품 상태
              </label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => handleInputChange("availabilityStatus", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              >
                <option value="In Stock">재고 있음</option>
                <option value="Low Stock">재고 부족</option>
                <option value="Out of Stock">품절</option>
                <option value="Discontinued">단종</option>
              </select>
            </div>
          </div>
        </div>

        {/* 가격 및 재고 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <FiDollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">가격 및 재고</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                판매가격 (₩) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="0"
                required
              />
            </div>

            {/* 할인율 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                할인율 (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* 재고 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                재고 수량
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* 최소 주문 수량 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 주문 수량
              </label>
              <input
                type="number"
                min="1"
                value={formData.minimumOrderQuantity}
                onChange={(e) => handleInputChange("minimumOrderQuantity", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          {/* 할인된 가격 미리보기 */}
          {formData.price && parseFloat(formData.discountPercentage) > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                할인된 가격: <span className="font-semibold">
                  ₩{(parseFloat(formData.price) * (1 - parseFloat(formData.discountPercentage) / 100)).toLocaleString()}
                </span>
                {" "}(원가: ₩{parseFloat(formData.price).toLocaleString()})
              </p>
            </div>
          )}
        </div>

        {/* 이미지 관리 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <FiImage className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">이미지 관리</h2>
          </div>



          {/* 썸네일 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 이미지 URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => handleInputChange("thumbnail", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <Image
                  src={formData.thumbnail}
                  alt="썸네일 미리보기"
                  width={128}
                  height={128}
                  className="object-cover rounded-lg border"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* 추가 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 이미지
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="이미지 URL을 입력하세요"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                추가
              </button>
            </div>

            {/* 이미지 목록 */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image}
                      alt={`상품 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg border"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    {formData.thumbnail === image && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        썸네일
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 상세페이지 이미지 */}
          <div className="mt-8 pt-8 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세페이지 이미지 (최대 5장)
            </label>
            <p className="text-xs text-gray-500 mb-4">
              상품 상세 페이지에 표시될 이미지들입니다. 최대 5장까지 추가할 수 있습니다.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newDetailImage}
                onChange={(e) => setNewDetailImage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="상세 이미지 URL을 입력하세요"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDetailImage())}
                disabled={formData.detailImages.length >= 5}
              />
              <button
                type="button"
                onClick={addDetailImage}
                disabled={formData.detailImages.length >= 5}
                className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="w-4 h-4" />
                추가
              </button>
            </div>

            {/* 상세 이미지 목록 */}
            {formData.detailImages.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  {formData.detailImages.length}/5 이미지 추가됨
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.detailImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <Image
                        src={image}
                        alt={`상세 이미지 ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeDetailImage(image)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 태그 관리 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <FiPackage className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">태그 관리</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              placeholder="태그를 입력하세요"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              추가
            </button>
          </div>

          {/* 태그 목록 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 상세 정보 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <FiSettings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">상세 정보</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 평점 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점 (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="0.0"
              />
            </div>

            {/* ⭐ 필수 표기 정보 섹션 */}
            <div className="lg:col-span-2 border-t-2 border-theme-color pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiInfo className="w-5 h-5 text-theme-color" />
                필수 표기 정보
              </h3>
            </div>

            {/* 품명 및 모델명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                품명 및 모델명
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 갤럭시 S24 Ultra"
              />
            </div>

            {/* 모델명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모델명
              </label>
              <input
                type="text"
                value={formData.modelNumber}
                onChange={(e) => handleInputChange("modelNumber", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: SM-S921B"
              />
            </div>

            {/* 크기 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                크기
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 162.8 x 77.6 x 8.6mm"
              />
            </div>

            {/* 색상 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                색상
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 블랙, 화이트, 실버"
              />
            </div>

            {/* 재질 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                재질
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 알루미늄, 강화유리"
              />
            </div>

            {/* 제품 구성 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제품 구성
              </label>
              <input
                type="text"
                value={formData.productComposition}
                onChange={(e) => handleInputChange("productComposition", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 본체, 충전기, 케이블, 설명서"
              />
            </div>

            {/* 출시년월 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                출시년월
              </label>
              <input
                type="text"
                value={formData.releaseDate}
                onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 2024년 1월"
              />
            </div>

            {/* 제조자(수입자) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제조자(수입자)
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 삼성전자"
              />
            </div>

            {/* 제조국 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제조국
              </label>
              <input
                type="text"
                value={formData.madeInCountry}
                onChange={(e) => handleInputChange("madeInCountry", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 대한민국"
              />
            </div>

            {/* 품질보증기준 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                품질보증기준
              </label>
              <textarea
                value={formData.warrantyStandard}
                onChange={(e) => handleInputChange("warrantyStandard", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 1년 무상 보증"
              />
            </div>

            {/* A/S 책임자와 전화번호 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                A/S 책임자와 전화번호
              </label>
              <textarea
                value={formData.asResponsible}
                onChange={(e) => handleInputChange("asResponsible", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 삼성전자 고객센터 1588-3366"
              />
            </div>

            {/* KC 인증정보 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KC 인증정보
              </label>
              <textarea
                value={formData.kcCertification}
                onChange={(e) => handleInputChange("kcCertification", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: KC 인증번호, 인증 정보"
              />
            </div>

            {/* 상품별 세부 사양 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상품별 세부 사양
              </label>
              <textarea
                value={formData.detailedSpecs}
                onChange={(e) => handleInputChange("detailedSpecs", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: CPU, RAM, 저장공간, 카메라 사양 등"
              />
            </div>

            {/* ⭐ 배송 정보 섹션 */}
            <div className="lg:col-span-2 border-t-2 border-theme-color pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-theme-color" />
                배송 정보
              </h3>
            </div>

            {/* 배송방법 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송방법
              </label>
              <select
                value={formData.shippingMethod}
                onChange={(e) => handleInputChange("shippingMethod", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="일반배송">일반배송</option>
                <option value="신선배송">신선배송</option>
                <option value="냉장배송">냉장배송</option>
                <option value="냉동배송">냉동배송</option>
              </select>
            </div>

            {/* 배송비 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송비
              </label>
              <input
                type="text"
                value={formData.shippingCost}
                onChange={(e) => handleInputChange("shippingCost", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 무료배송, 3,000원"
              />
            </div>

            {/* 묶음배송 여부 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                묶음배송 여부
              </label>
              <select
                value={formData.bundleShipping}
                onChange={(e) => handleInputChange("bundleShipping", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="가능">가능</option>
                <option value="불가능">불가능</option>
              </select>
            </div>

            {/* 배송기간 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송기간
              </label>
              <textarea
                value={formData.shippingPeriod}
                onChange={(e) => handleInputChange("shippingPeriod", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 주문 후 1-2일 이내 배송"
              />
            </div>

            {/* ⭐ 교환/반품 정보 섹션 */}
            <div className="lg:col-span-2 border-t-2 border-theme-color pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiSettings className="w-5 h-5 text-theme-color" />
                교환/반품 정보
              </h3>
            </div>

            {/* 교환/반품 비용 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교환/반품 비용
              </label>
              <textarea
                value={formData.exchangeReturnCost}
                onChange={(e) => handleInputChange("exchangeReturnCost", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 무료 반품/교환 가능"
              />
            </div>

            {/* 교환/반품 신청 기준일 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교환/반품 신청 기준일
              </label>
              <textarea
                value={formData.exchangeReturnDeadline}
                onChange={(e) => handleInputChange("exchangeReturnDeadline", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 제품 수령 후 30일 이내"
              />
            </div>

            {/* 교환/반품 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교환/반품 제한사항
              </label>
              <textarea
                value={formData.exchangeReturnLimitations}
                onChange={(e) => handleInputChange("exchangeReturnLimitations", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 개봉 후 사용한 상품은 반품 불가"
              />
            </div>

            {/* 의류/잡화 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                의류/잡화 제한사항
              </label>
              <textarea
                value={formData.clothingLimitations}
                onChange={(e) => handleInputChange("clothingLimitations", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 태그 제거 시 반품 불가"
              />
            </div>

            {/* 식품/화장품 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                식품/화장품 제한사항
              </label>
              <textarea
                value={formData.foodLimitations}
                onChange={(e) => handleInputChange("foodLimitations", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 신선/냉장/냉동 상품은 단순변심 반품 불가"
              />
            </div>

            {/* 전자/가전 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전자/가전 제한사항
              </label>
              <textarea
                value={formData.electronicsLimitations}
                onChange={(e) => handleInputChange("electronicsLimitations", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 설치 후 반품 불가"
              />
            </div>

            {/* 자동차용품 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자동차용품 제한사항
              </label>
              <textarea
                value={formData.autoLimitations}
                onChange={(e) => handleInputChange("autoLimitations", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 장착 후 반품 불가"
              />
            </div>

            {/* CD/DVD/GAME/BOOK 제한사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CD/DVD/GAME/BOOK 제한사항
              </label>
              <textarea
                value={formData.mediaLimitations}
                onChange={(e) => handleInputChange("mediaLimitations", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 포장 개봉 시 반품 불가"
              />
            </div>

            {/* ⭐ 판매자 정보 섹션 */}
            <div className="lg:col-span-2 border-t-2 border-theme-color pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-theme-color" />
                판매자 정보
              </h3>
            </div>

            {/* 판매자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                판매자명
              </label>
              <input
                type="text"
                value={formData.sellerName}
                onChange={(e) => handleInputChange("sellerName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 겟꿀쇼핑"
              />
            </div>

            {/* 판매자 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                판매자 전화번호
              </label>
              <input
                type="tel"
                value={formData.sellerPhone}
                onChange={(e) => handleInputChange("sellerPhone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 1577-7011"
              />
            </div>

            {/* 법적 고지사항 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                법적 고지사항
              </label>
              <textarea
                value={formData.sellerLegalNotice}
                onChange={(e) => handleInputChange("sellerLegalNotice", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent"
                placeholder="예: 미성년자가 체결한 계약은 법정대리인이 동의하지 않는 경우 본인 또는 법정대리인이 취소할 수 있습니다."
              />
            </div>

            {/* 활성 상태 */}
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-theme-color border-gray-300 rounded focus:ring-theme-color"
                />
                <span className="text-sm font-medium text-gray-700">
                  상품 활성화 (체크 해제 시 고객에게 표시되지 않습니다)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-4">
          <Link
            href="/account/admin/products"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FiPackage className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                {mode === "create" ? "상품 추가" : "변경사항 저장"}
              </>
            )}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default ProductFormClient;
