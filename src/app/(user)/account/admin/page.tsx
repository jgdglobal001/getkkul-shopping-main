export const runtime = 'edge';

import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute loadingMessage="관리자 권한???�인?�는 �?..">
      <AdminDashboardClient />
    </AdminProtectedRoute>
  );
}
