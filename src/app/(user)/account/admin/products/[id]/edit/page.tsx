import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductFormClient from "@/components/admin/ProductFormClient";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <AdminProtectedRoute loadingMessage="상품 수정 권한을 확인하는 중...">
      <ProductFormClient mode="edit" productId={id} />
    </AdminProtectedRoute>
  );
}
