export const runtime = 'edge';

import ReviewsClient from "@/components/account/ReviewsClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ReviewsPage() {
  return (
    <ProtectedRoute loadingMessage="由щ럭瑜?遺덈윭?ㅻ뒗 以?..">
      <ReviewsClient />
    </ProtectedRoute>
  );
}
