export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductFormClient from "@/components/admin/ProductFormClient";

export default function NewProductPage() {
  return (
    <AdminProtectedRoute loadingMessage="?í’ˆ ì¶”ê? ê¶Œí•œ???•ì¸?˜ëŠ” ì¤?..">
      <ProductFormClient mode="create" />
    </AdminProtectedRoute>
  );
}
