export const runtime = 'edge';

import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute loadingMessage="愿由ъ옄 沅뚰븳???뺤씤?섎뒗 以?..">
      <AdminDashboardClient />
    </AdminProtectedRoute>
  );
}
