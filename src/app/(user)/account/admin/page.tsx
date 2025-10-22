import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute loadingMessage="관리자 권한을 확인하는 중...">
      <AdminDashboardClient />
    </AdminProtectedRoute>
  );
}
