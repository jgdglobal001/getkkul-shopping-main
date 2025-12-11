"use client";

export const runtime = 'edge';

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { resetCart } from "@/redux/shofySlice";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const verifyAndCreateOrder = useCallback(async () => {
    try {
      // Get pending order data from sessionStorage
      const pendingOrderStr = sessionStorage.getItem('pendingOrder');

      if (!pendingOrderStr) {
        console.error("No pending order found in sessionStorage");
        setLoading(false);
        return;
      }

      const pendingOrder = JSON.parse(pendingOrderStr);

      // 1. Verify payment with Toss
      const verifyResponse = await fetch("/api/orders/toss-confirm", {
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

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        console.error("Payment verification failed:", errorData);
        throw new Error(errorData.error || "Payment verification failed");
      }

      // 2. Create order in database
      const orderResponse = await fetch("/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pendingOrder,
          orderId: orderId,
          status: "confirmed",
          paymentStatus: "paid",
          paymentKey: paymentKey,
        }),
      });

      if (!orderResponse.ok) {
        console.error("Failed to create order in database");
      } else {
        setOrderCreated(true);
        // Clear pending order from sessionStorage
        sessionStorage.removeItem('pendingOrder');
        // Clear cart
        dispatch(resetCart());
      }

      setLoading(false);
    } catch (error) {
      console.error("Payment verification error:", error);
      setLoading(false);
    }
  }, [orderId, paymentKey, amount, session?.user?.email, dispatch]);

  useEffect(() => {
    if (paymentKey && orderId && amount && session?.user?.email) {
      verifyAndCreateOrder();
    }
  }, [paymentKey, orderId, amount, session?.user?.email, verifyAndCreateOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 확인 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료</h1>
        <p className="text-gray-600 mb-4">주문이 성공적으로 완료되었습니다.</p>
        
        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">주문번호:</span> {orderId}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">결제금액:</span> ₩{parseInt(amount || "0").toLocaleString("ko-KR")}
          </p>
        </div>

        <div className="space-y-2">
          <Link
            href="/account/orders"
            className="block w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-primary-dark transition"
          >
            주문 확인
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-300 transition"
          >
            계속 쇼핑
          </Link>
        </div>
      </div>
    </div>
  );
}