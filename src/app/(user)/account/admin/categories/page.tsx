export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import CategoriesManagementClient from "@/components/admin/CategoriesManagementClient";

export default function CategoriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="移댄뀒怨좊━ 愿由?沅뚰븳???뺤씤?섎뒗 以?..">
      <CategoriesManagementClient />
    </AdminProtectedRoute>
  );
}

