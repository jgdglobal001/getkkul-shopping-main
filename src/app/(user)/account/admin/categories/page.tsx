export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CategoriesManagementClient from "@/components/admin/CategoriesManagementClient";

export default function CategoriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="카테고리 관리 권한을 확인하는 중...">
      <CategoriesManagementClient />
    </AdminProtectedRoute>
  );
}

