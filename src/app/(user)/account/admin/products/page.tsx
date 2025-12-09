export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductsManagementClient from "@/components/admin/ProductsManagementClient";

export default function ProductsManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="?곹뭹 愿由?沅뚰븳???뺤씤?섎뒗 以?..">
      <ProductsManagementClient />
    </AdminProtectedRoute>
  );
}
