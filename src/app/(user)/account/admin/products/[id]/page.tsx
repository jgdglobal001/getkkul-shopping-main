export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductDetailClient from "@/components/admin/ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <AdminProtectedRoute loadingMessage="상품 정보를 확인하는 중...">
      <ProductDetailClient productId={id} />
    </AdminProtectedRoute>
  );
}
