export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductFormClient from "@/components/admin/ProductFormClient";

export default function NewProductPage() {
  return (
    <AdminProtectedRoute loadingMessage="?곹뭹 異붽? 沅뚰븳???뺤씤?섎뒗 以?..">
      <ProductFormClient mode="create" />
    </AdminProtectedRoute>
  );
}
