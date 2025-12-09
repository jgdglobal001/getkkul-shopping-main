export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductFormClient from "@/components/admin/ProductFormClient";

export default function NewProductPage() {
  return (
    <AdminProtectedRoute loadingMessage="상품 추가 권한을 확인하는 중...">
      <ProductFormClient mode="create" />
    </AdminProtectedRoute>
  );
}
