export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProductFormClient from "@/components/admin/ProductFormClient";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <AdminProtectedRoute loadingMessage="?곹뭹 ?섏젙 沅뚰븳???뺤씤?섎뒗 以?..">
      <ProductFormClient mode="edit" productId={id} />
    </AdminProtectedRoute>
  );
}
