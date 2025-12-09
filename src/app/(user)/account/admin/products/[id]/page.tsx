export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductDetailClient from "@/components/admin/ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <AdminProtectedRoute loadingMessage="?곹뭹 ?뺣낫瑜??뺤씤?섎뒗 以?..">
      <ProductDetailClient productId={id} />
    </AdminProtectedRoute>
  );
}
