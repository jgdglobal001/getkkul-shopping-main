export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import InquiriesManagement from "@/components/admin/InquiriesManagement";

export default function InquiriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="?곷떞 愿由?沅뚰븳???뺤씤?섎뒗 以?..">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">怨좉컼 ?곷떞 愿由?/h1>
          <p className="text-gray-600 mt-2">怨좉컼???쒖텧???쒗뭹 愿??吏덈Ц???뺤씤?섍퀬 ?듬??????덉뒿?덈떎.</p>
        </div>
        <InquiriesManagement />
      </div>
    </AdminProtectedRoute>
  );
}