export const runtime = 'edge';

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import InquiriesManagement from "@/components/admin/InquiriesManagement";

export default function InquiriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="?ë‹´ ê´€ë¦?ê¶Œí•œ???•ì¸?˜ëŠ” ì¤?..">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ê³ ê° ?ë‹´ ê´€ë¦?/h1>
          <p className="text-gray-600 mt-2">ê³ ê°???œì¶œ???œí’ˆ ê´€??ì§ˆë¬¸???•ì¸?˜ê³  ?µë??????ˆìŠµ?ˆë‹¤.</p>
        </div>
        <InquiriesManagement />
      </div>
    </AdminProtectedRoute>
  );
}