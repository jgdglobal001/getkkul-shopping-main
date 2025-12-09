export const runtime = 'edge';

import ReviewsClient from "@/components/account/ReviewsClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ReviewsPage() {
  return (
    <ProtectedRoute loadingMessage="ë¦¬ë·°ë¥?ë¶ˆëŸ¬?¤ëŠ” ì¤?..">
      <ReviewsClient />
    </ProtectedRoute>
  );
}
