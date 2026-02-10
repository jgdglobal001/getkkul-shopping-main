export const runtime = 'edge';

import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminOrdersPage() {
    return (
        <AdminProtectedRoute loadingMessage="관리자 권한을 확인하는 중...">
            <AdminOrdersClient />
        </AdminProtectedRoute>
    );
}
