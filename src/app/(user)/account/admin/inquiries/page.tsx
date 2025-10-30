import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import InquiriesManagement from "@/components/admin/InquiriesManagement";

export default function InquiriesManagementPage() {
  return (
    <AdminProtectedRoute loadingMessage="상담 관리 권한을 확인하는 중...">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">고객 상담 관리</h1>
          <p className="text-gray-600 mt-2">고객이 제출한 제품 관련 질문을 확인하고 답변할 수 있습니다.</p>
        </div>
        <InquiriesManagement />
      </div>
    </AdminProtectedRoute>
  );
}