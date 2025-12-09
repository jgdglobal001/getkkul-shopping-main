export const runtime = 'edge';

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const verifyPayment = useCallback(async () => {
    try {
      const response = await fetch("/api/orders/toss-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentKey,
          amount: parseInt(amount || "0"),
          userEmail: session?.user?.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        throw new Error(errorData.error || "Payment verification failed");
      }

      setLoading(false);
    } catch (error) {
      console.error("Payment verification error:", error);
      console.error("Full error details:", {
        paymentKey,
        orderId,
        amount,
        userEmail: session?.user?.email,
      });
      setLoading(false);
    }
  }, [orderId, paymentKey, amount, session?.user?.email]);

  useEffect(() => {
    // Verify payment on the backend
    if (paymentKey && orderId && amount && session?.user?.email) {
      verifyPayment();
    }
  }, [paymentKey, orderId, amount, session?.user?.email, verifyPayment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">결제�??�인 중입?�다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 ?�료</h1>
        <p className="text-gray-600 mb-4">주문???�공?�으�??�료?�었?�니??</p>
        
        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">주문번호:</span> {orderId}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">결제금액:</span> ??parseInt(amount || "0").toLocaleString("ko-KR")}
          </p>
        </div>

        <div className="space-y-2">
          <Link
            href="/account/orders"
            className="block w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-primary-dark transition"
          >
            주문 ?�인
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-300 transition"
          >
            계속 ?�핑
          </Link>
        </div>
      </div>
    </div>
  );
}