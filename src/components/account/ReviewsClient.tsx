"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiStar, FiEdit, FiTrash2, FiCalendar, FiPackage } from "react-icons/fi";

interface Review {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsClient() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReviews();
    }
  }, [session?.user?.id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // 현재는 더미 데이터를 사용합니다. 실제로는 API에서 사용자의 리뷰를 가져와야 합니다.
      // const response = await fetch(`/api/user/${session?.user?.id}/reviews`);
      // const data = await response.json();
      
      // 더미 데이터
      const dummyReviews: Review[] = [
        {
          id: "1",
          productId: "1",
          productTitle: "iPhone 9",
          productImage: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          rating: 5,
          comment: "정말 좋은 제품입니다! 배송도 빠르고 품질도 만족스럽습니다.",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          productId: "2",
          productTitle: "iPhone X",
          productImage: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
          rating: 4,
          comment: "가격 대비 성능이 좋습니다. 추천합니다.",
          createdAt: "2024-01-10T14:20:00Z",
          updatedAt: "2024-01-10T14:20:00Z",
        },
      ];
      
      setReviews(dummyReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("리뷰를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            className={`w-4 h-4 ${
              index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 리뷰</h1>
          <p className="text-gray-600 mt-1">
            작성한 리뷰를 확인하고 관리하세요
          </p>
        </div>
        <div className="text-sm text-gray-500">
          총 {reviews.length}개의 리뷰
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            작성한 리뷰가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            구매한 상품에 대한 리뷰를 작성해보세요
          </p>
          <button className="px-6 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors">
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={review.productImage}
                    alt={review.productTitle}
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {review.productTitle}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
