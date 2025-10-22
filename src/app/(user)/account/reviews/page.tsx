import ReviewsClient from "@/components/account/ReviewsClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ReviewsPage() {
  return (
    <ProtectedRoute loadingMessage="리뷰를 불러오는 중...">
      <ReviewsClient />
    </ProtectedRoute>
  );
}
