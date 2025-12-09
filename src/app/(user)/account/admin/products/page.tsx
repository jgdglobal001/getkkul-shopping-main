export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductsManagementClient from "@/components/admin/ProductsManagementClient";

export default function ProductsManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="상품 관리 권한을 확인하는 중...">
      <ProductsManagementClient />
    </AdminProtectedRoute>
  );
}
