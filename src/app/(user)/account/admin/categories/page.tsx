export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CategoriesManagementClient from "@/components/admin/CategoriesManagementClient";

export default function CategoriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="카테고리 관�?권한???�인?�는 �?..">
      <CategoriesManagementClient />
    </AdminProtectedRoute>
  );
}

