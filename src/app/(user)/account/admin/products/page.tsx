export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductsManagementClient from "@/components/admin/ProductsManagementClient";

export default function ProductsManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="?í’ˆ ê´€ë¦?ê¶Œí•œ???•ì¸?˜ëŠ” ì¤?..">
      <ProductsManagementClient />
    </AdminProtectedRoute>
  );
}
