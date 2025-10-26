import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import InquiriesManagement from "@/components/admin/InquiriesManagement";

const AdminInquiriesPage = async () => {
  const session = await getServerSession(authOptions);

  // 관리자 권한 확인
  if (!session?.user?.email || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <Container>
      <div className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고객 문의 관리</h1>
          <p className="text-gray-600">고객의 상품 문의에 답변하고 관리합니다</p>
        </div>

        <InquiriesManagement />
      </div>
    </Container>
  );
};

export default AdminInquiriesPage;

