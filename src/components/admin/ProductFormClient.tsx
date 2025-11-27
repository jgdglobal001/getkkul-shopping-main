"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiPackage } from "react-icons/fi";
import Container from "@/components/Container";

// Utils & Types
import { ProductFormData, ProductFormClientProps } from "./utils/product-types";
import { CATEGORY_TEMPLATES } from "./utils/templates";

// Section Components
import { BasicInfo } from "./sections/BasicInfo";
import { ImagesManager } from "./sections/ImagesManager";
import { TagsManager } from "./sections/TagsManager";
import { DisclosureInfo } from "./sections/DisclosureInfo";
import { ShippingInfo } from "./sections/ShippingInfo";
import { ExchangeReturnInfo } from "./sections/ExchangeReturnInfo";
import { SellerInfo } from "./sections/SellerInfo";

const ProductFormClient = ({ mode, productId }: ProductFormClientProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newDetailImage, setNewDetailImage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

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
    availabilityStatus: "In Stock",
    minimumOrderQuantity: "1",
    productName: "",
    modelNumber: "",
    size: "상세페이지 참조",
    material: "상세페이지 참조",
    releaseDate: "상세페이지 참조",
    manufacturer: "중국 OEM 협력사",
    madeInCountry: "중국OEM",
    warrantyStandard: "상세페이지 참조",
    asResponsible: "010-7218-2858",
    kcCertification: "상세페이지 참조",
    color: "상세페이지 참조",
    productComposition: "상세페이지 참조",
    detailedSpecs: "상세페이지 참조",
    shippingMethod: "일반배송",
    shippingCost: "3000원",
    bundleShipping: "가능",
    shippingPeriod: "주문 후 1-2일 이내 배송",
    exchangeReturnCost: "초도배송비(편도) 3000원\n반품배송비(편도) 3,000원\n*고객사유로 인한 반품 시, 왕복 반품/배송비는 초도배송비 + 반품배송비의 합계인 6,000 원 이 청구됩니다*",
    exchangeReturnDeadline: "제품 수령 후 7일 이내",
    exchangeReturnLimitations: "포장 개봉시 상품은 반품 불가",
    clothingLimitations: "테그 제거 시 반품 불가",
    foodLimitations: "신선/냉장/냉동 상품은 단순변심 반품 불가",
    electronicsLimitations: "설치 후 반품 불가",
    autoLimitations: "장착 후 반품 불가",
    mediaLimitations: "포장 개봉시 상품은 반품 불가",
    sellerName: "겟꿀쇼핑",
    sellerPhone: "010-7218-2858",
    sellerLegalNotice: "미성년자가 체결한 계약은 법정 대리인이 동의하지 않는 경우 본인 또는 법정대리인이 취소할 수 있습니다.",
  });

  // ⭐ 기존 데이터 로드 (수정 모드)
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
        availabilityStatus: product.availabilityStatus || "In Stock",
        minimumOrderQuantity: product.minimumOrderQuantity?.toString() || "1",
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
        shippingMethod: product.shippingMethod || "",
        shippingCost: product.shippingCost || "",
        bundleShipping: product.bundleShipping || "",
        shippingPeriod: product.shippingPeriod || "",
        exchangeReturnCost: product.exchangeReturnCost || "",
        exchangeReturnDeadline: product.exchangeReturnDeadline || "",
        exchangeReturnLimitations: product.exchangeReturnLimitations || "",
        clothingLimitations: product.clothingLimitations || "",
        foodLimitations: product.foodLimitations || "",
        electronicsLimitations: product.electronicsLimitations || "",
        autoLimitations: product.autoLimitations || "",
        mediaLimitations: product.mediaLimitations || "",
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

  // ⭐ 카테고리 변경 핸들러
  const handleCategoryChange = (categoryValue: string) => {
    handleInputChange("category", categoryValue);
    setSelectedTemplate("");
  };

  // ⭐ 템플릿 적용 함수
  const applyTemplate = (templateName: string) => {
    const templates = CATEGORY_TEMPLATES[formData.category];
    if (!templates) return;

    const selectedTemplateData = templates.find(t => t.name === templateName);
    if (!selectedTemplateData) return;

    setFormData(prev => ({
      ...prev,
      productName: selectedTemplateData.productName || prev.productName,
      modelNumber: selectedTemplateData.modelNumber || prev.modelNumber,
      size: selectedTemplateData.size || prev.size,
      material: selectedTemplateData.material || prev.material,
      releaseDate: selectedTemplateData.releaseDate || prev.releaseDate,
      manufacturer: selectedTemplateData.manufacturer || prev.manufacturer,
      madeInCountry: selectedTemplateData.madeInCountry || prev.madeInCountry,
      warrantyStandard: selectedTemplateData.warrantyStandard || prev.warrantyStandard,
      asResponsible: selectedTemplateData.asResponsible || prev.asResponsible,
      kcCertification: selectedTemplateData.kcCertification || prev.kcCertification,
      color: selectedTemplateData.color || prev.color,
      productComposition: selectedTemplateData.productComposition || prev.productComposition,
      detailedSpecs: selectedTemplateData.detailedSpecs || prev.detailedSpecs,
      shippingMethod: selectedTemplateData.shippingMethod,
      shippingCost: selectedTemplateData.shippingCost,
      bundleShipping: selectedTemplateData.bundleShipping,
      shippingPeriod: selectedTemplateData.shippingPeriod,
      exchangeReturnCost: selectedTemplateData.exchangeReturnCost,
      exchangeReturnDeadline: selectedTemplateData.exchangeReturnDeadline,
      exchangeReturnLimitations: selectedTemplateData.exchangeReturnLimitations,
      clothingLimitations: selectedTemplateData.clothingLimitations || prev.clothingLimitations,
      foodLimitations: selectedTemplateData.foodLimitations || prev.foodLimitations,
      electronicsLimitations: selectedTemplateData.electronicsLimitations || prev.electronicsLimitations,
      autoLimitations: selectedTemplateData.autoLimitations || prev.autoLimitations,
      mediaLimitations: selectedTemplateData.mediaLimitations || prev.mediaLimitations,
      sellerName: selectedTemplateData.sellerName,
      sellerPhone: selectedTemplateData.sellerPhone,
      sellerLegalNotice: selectedTemplateData.sellerLegalNotice,
    }));
    setSelectedTemplate(templateName);
  };

  // ⭐ 폼 데이터 변경 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ⭐ 태그 추가 (# 기준으로 자동 분리)
  const addTag = () => {
    if (!newTag.trim()) return;
    const tags = newTag
      .split('#')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter(tag => !formData.tags.includes(tag));

    if (tags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...tags],
      }));
      setNewTag("");
    }
  };

  // ⭐ 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // ⭐ 이미지 추가
  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");

      if (!formData.thumbnail && formData.images.length === 0) {
        setFormData(prev => ({
          ...prev,
          thumbnail: newImage.trim(),
        }));
      }
    }
  };

  // ⭐ 이미지 제거
  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove),
      thumbnail: prev.thumbnail === imageToRemove
        ? prev.images.filter(img => img !== imageToRemove)[0] || ""
        : prev.thumbnail,
    }));
  };

  // ⭐ 상세 이미지 추가
  const addDetailImage = () => {
    if (newDetailImage.trim() && !formData.detailImages.includes(newDetailImage.trim())) {
      setFormData(prev => ({
        ...prev,
        detailImages: [...prev.detailImages, newDetailImage.trim()],
      }));
      setNewDetailImage("");
    }
  };

  // ⭐ 상세 이미지 제거
  const removeDetailImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter(img => img !== imageToRemove),
    }));
  };

  // ⭐ SKU 자동 생성
  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const sku = `${prefix}-${timestamp}-${randomNum}`;
    handleInputChange("sku", sku);
  };

  // ⭐ 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.sku) {
      setError("필수 필드를 모두 입력해주세요");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage),
        rating: parseFloat(formData.rating),
        stock: parseInt(formData.stock),
        weight: null,
        dimensions: null,
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
        <BasicInfo
          formData={formData}
          onInputChange={handleInputChange}
          onCategoryChange={handleCategoryChange}
          onGenerateSKU={generateSKU}
        />

        {/* 이미지 관리 */}
        <ImagesManager
          formData={formData}
          onInputChange={handleInputChange}
          newImage={newImage}
          onNewImageChange={setNewImage}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          newDetailImage={newDetailImage}
          onNewDetailImageChange={setNewDetailImage}
          onAddDetailImage={addDetailImage}
          onRemoveDetailImage={removeDetailImage}
        />

        {/* 태그 관리 */}
        <TagsManager
          formData={formData}
          newTag={newTag}
          onNewTagChange={setNewTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

        {/* 필수 표기 정보 */}
        <DisclosureInfo
          formData={formData}
          onInputChange={handleInputChange}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
          onApplyTemplate={applyTemplate}
        />

        {/* 배송 정보 */}
        <ShippingInfo
          formData={formData}
          onInputChange={handleInputChange}
        />

        {/* 교환/반품 정보 */}
        <ExchangeReturnInfo
          formData={formData}
          onInputChange={handleInputChange}
        />

        {/* 판매자 정보 */}
        <SellerInfo
          formData={formData}
          onInputChange={handleInputChange}
        />

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