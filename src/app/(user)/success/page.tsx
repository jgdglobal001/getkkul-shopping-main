export const runtime = 'edge';

"use client";

import Container from "@/components/Container";
import OrderSummarySkeleton from "@/components/OrderSummarySkeleton";
import PriceFormat from "@/components/PriceFormat";
import ProtectedRoute from "@/components/ProtectedRoute";
import { resetCart } from "@/redux/shofySlice";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  !sessionId && redirect("/");

  const processOrder = useCallback(async () => {
    try {
      // If we have an order ID, update the payment status
      if (orderId) {
        const updateResponse = await fetch("/api/orders/update-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            email: session?.user?.email,
            paymentStatus: "paid",
          }),
        });

        if (updateResponse.ok) {
          toast.success("Payment completed successfully!");
          setOrderProcessed(true);
          return;
        }
      }

      // Fallback to the original order processing for legacy orders
      const response = await fetch("/api/orders/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          email: session?.user?.email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.order);
        setOrderProcessed(true);
        dispatch(resetCart());
        toast.success("Order processed successfully!");
      } else {
        toast.error("Failed to process order");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Error processing order");
    }
  }, [sessionId, orderId, session?.user?.email, dispatch]);

  useEffect(() => {
    if (sessionId && session?.user?.email && !orderProcessed) {
      // Process the order and save to user's orders
      processOrder();
    }
  }, [sessionId, session?.user?.email, orderProcessed, processOrder]);

  return (
    <ProtectedRoute loadingMessage="Processing your order...">
      <Container className="py-10">
        <div className="min-h-[500px] flex flex-col items-center justify-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎉 결제 완료!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              <span className="font-semibold text-theme-color">겟꿀쇼핑</span>에서 구매해주셔서 감사합니다
            </p>
            <p className="text-gray-500">
              주문이 확인되었으며 곧 처리될 예정입니다.
            </p>
          </div>

          {/* Order Details Card */}
          {!orderProcessed ? (
            <OrderSummarySkeleton />
          ) : orderDetails ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-md w-full shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    <PriceFormat amount={orderDetails.amount} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    확인됨
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/account/orders">
              <button className="bg-theme-color text-white px-8 py-3 rounded-md font-medium hover:bg-theme-color/90 transition-colors duration-200 w-52">
                내 주문 보기
              </button>
            </Link>
            <Link href="/">
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200 w-52">
                쇼핑 계속하기
              </button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center max-w-md">
            <p className="text-sm text-gray-500">
              You will receive an email confirmation shortly with your order
              details and tracking information.
            </p>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default SuccessPage;
