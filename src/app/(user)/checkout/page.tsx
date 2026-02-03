"use client";

export const runtime = 'edge';

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Container from "@/components/Container";
import PriceFormat from "@/components/PriceFormat";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
  FiLoader,
  FiTruck,
} from "react-icons/fi";
import Link from "next/link";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const paymentWidgetRef = useRef<any>(null);
  const paymentMethodWidgetRef = useRef<any>(null);


  // Get order ID from URL params
  const existingOrderId = searchParams.get("orderId");
  const paymentCancelled = searchParams.get("cancelled");

  // Define fetchExistingOrder BEFORE the useEffect that uses it
  const fetchExistingOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();

      if (data.orders) {
        const order = data.orders.find((o: any) => o.id === existingOrderId || o.orderId === existingOrderId);
        if (order) {
          setExistingOrder(order);
        } else {
          // Order not found, redirect to orders page
          router.push("/account/orders");
        }
      } else {
        // No orders found, redirect to orders page
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      // On error, redirect to orders page
      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, existingOrderId, router]);

  useEffect(() => {
    // Always expect an order ID for this new flow
    if (existingOrderId) {
      fetchExistingOrder();
    } else {
      // Redirect to cart if no order ID
      router.push("/cart");
    }
  }, [existingOrderId, router, fetchExistingOrder]);

  // Initialize Toss Payment Widget when order is loaded
  useEffect(() => {
    if (!existingOrder || widgetReady) return;

    const initializeWidget = async () => {
      try {
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!tossClientKey) {
          const errorMsg = "Toss Client Key is not configured. Please set NEXT_PUBLIC_TOSS_CLIENT_KEY in your environment variables.";
          console.error(errorMsg);
          setWidgetError(errorMsg);
          return;
        }

        // Access global TossPayments from SDK V2
        const TossPayments = (window as any).TossPayments;
        if (!TossPayments) {
          const errorMsg = "Toss Payments SDK not loaded. Please check if the SDK script is properly loaded.";
          console.error(errorMsg);
          setWidgetError(errorMsg);
          return;
        }

        // Generate unique customer key
        const customerKey = `customer_${session?.user?.id || session?.user?.email?.replace(/[@.]/g, "_") || Date.now()}`;

        // Parse amount
        let amount: number;
        if (typeof existingOrder.amount === 'string') {
          amount = Math.round(parseFloat(existingOrder.amount));
        } else if (typeof existingOrder.amount === 'number') {
          amount = Math.round(existingOrder.amount);
        } else if (existingOrder.totalAmount) {
          amount = Math.round(parseFloat(existingOrder.totalAmount.toString()));
        } else {
          const errorMsg = "Order amount not found";
          console.error(errorMsg);
          setWidgetError(errorMsg);
          return;
        }

        if (isNaN(amount) || amount <= 0) {
          const errorMsg = `Invalid order amount: ${amount}`;
          console.error(errorMsg);
          setWidgetError(errorMsg);
          return;
        }

        console.log("Initializing Toss Payment Widget:", { amount, customerKey, clientKey: tossClientKey.substring(0, 10) + "..." });

        // Initialize Payment Widget (v2 API) - Correct SDK V2 way
        const tossPayments = TossPayments(tossClientKey);

        // Create payment widget with customer key
        const paymentWidget = tossPayments.widgets({
          customerKey: customerKey,
        });

        // Set amount BEFORE rendering
        await paymentWidget.setAmount({
          value: amount,
          currency: "KRW",
        });

        // Render payment methods UI with variantKey (환경변수에서 로드, 없으면 DEFAULT)
        await paymentWidget.renderPaymentMethods({
          selector: "#payment-widget",
          variantKey: process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY || "DEFAULT",
        });

        // Store widget reference for later use
        paymentWidgetRef.current = paymentWidget;
        setWidgetReady(true);
        setWidgetError(null);

        console.log("Toss Payment Widget initialized successfully");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to initialize Toss Payment Widget";
        console.error("Failed to initialize Toss Payment Widget:", error);
        setWidgetError(errorMsg);
      }
    };

    initializeWidget();
    return () => {
      try {
        paymentMethodWidgetRef.current?.destroy?.();
        paymentMethodWidgetRef.current = null;
      } catch (e) {
        console.warn("Failed to cleanup Toss Payment Widget:", e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- widgetReady is intentionally excluded to prevent infinite loop
  }, [existingOrder, session]);

  // Clean up cancelled parameter from URL after showing notification
  useEffect(() => {
    if (paymentCancelled) {
      const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("cancelled");
        const newUrl = `/checkout?orderId=${existingOrderId}`;
        router.replace(newUrl);
      }, 5000); // Remove after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentCancelled, existingOrderId, searchParams, router]);

  const handleCashOnDelivery = async () => {
    try {
      setPaymentProcessing(true);

      // Update order payment status to completed for COD
      const response = await fetch("/api/orders/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: existingOrder.id,
          paymentStatus: "cash_on_delivery",
          status: "confirmed",
        }),
      });

      if (response.ok) {
        // Redirect to order details page
        router.push(`/account/orders/${existingOrder.id}`);
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error processing COD:", error);
      alert("Failed to process Cash on Delivery. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setPaymentProcessing(true);
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: existingOrder.items,
          email: session?.user?.email,
          shippingAddress: existingOrder.shippingAddress,
          orderId: existingOrder.id,
          orderAmount: existingOrder.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout API error:", errorData);
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const checkoutSession = await response.json();

      if (!checkoutSession.id) {
        throw new Error("No session ID returned from checkout");
      }

      const result: any = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        `Payment processing failed: ${error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleTossPayment = async () => {
    try {
      setPaymentProcessing(true);

      // Check if widget is ready
      if (!paymentWidgetRef.current) {
        throw new Error("결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      }

      // Validate order data
      if (!existingOrder) {
        throw new Error("주문 정보를 찾을 수 없습니다.");
      }

      // Generate order ID
      const orderId = existingOrder.orderId || existingOrder.id || `ORD-${Date.now()}`;

      // Debug: Log session information
      console.log("Session User Info:", {
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        role: session?.user?.role,
      });

      console.log("Requesting Toss Payment:", {
        orderId,
        orderName: existingOrder?.items?.[0]?.name || `Order #${orderId.substring(0, 8)}`,
      });

      // Get customer name from session or email
      const customerName = session?.user?.name ||
        session?.user?.email?.split('@')[0] ||
        "고객";

      // Request payment using the already-rendered widget
      await paymentWidgetRef.current.requestPayment({
        orderId: orderId,
        orderName:
          existingOrder?.items?.[0]?.name ||
          `Order #${orderId.substring(0, 8)}`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: session?.user?.email || "",
        customerName: customerName,
      });
    } catch (error) {
      console.error("Toss payment error:", error);

      // Handle cancellation gracefully
      const errorMessage = error instanceof Error ? error.message : "다시 시도해주세요.";

      if (errorMessage.includes("취소")) {
        // User cancelled the payment - no alert needed
        console.log("Payment cancelled by user");
      } else {
        // Other errors - show alert
        alert(`결제 실패: ${errorMessage}`);
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="animate-spin text-4xl text-theme-color" />
          <span className="ml-4 text-lg">{t("checkout.loading_order_details")}</span>
        </div>
      </Container>
    );
  }

  if (!session?.user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("checkout.please_sign_in")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("checkout.sign_in_required_desc")}
          </p>
          <Link
            href="/auth/signin"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors"
          >
            {t("checkout.sign_in")}
          </Link>
        </div>
      </Container>
    );
  }

  if (!existingOrder) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("checkout.order_not_found")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("checkout.order_not_found_desc")}
          </p>
          <Link
            href="/account/orders"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors"
          >
            {t("checkout.view_orders")}
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <ProtectedRoute loadingMessage={t("checkout.loading_checkout")}>
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/account/orders"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("checkout.order_number_label")} #{existingOrder?.orderId || existingOrderId}
              </h1>
              <p className="text-gray-600">{t("checkout.choose_payment_method")}</p>
            </div>
          </div>
        </div>

        {/* Payment Cancelled Notification */}
        {paymentCancelled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {t("checkout.payment_cancelled")}
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    {t("checkout.payment_cancelled_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2" />
                {t("common.items")} ({existingOrder?.items?.length || 0})
              </h3>

              <div className="space-y-4">
                {existingOrder?.items?.map((item: any, index: number) => (
                  <div
                    key={`order-${item.id}-${index}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name || item.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {(item.name || item.title)
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.name || item.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{t("common.quantity")}: {item.quantity}</span>
                        <span>
                          <PriceFormat amount={item.price} />
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        <PriceFormat amount={item.total} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2" />
                {t("checkout.shipping_address")}
              </h3>

              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {existingOrder?.shippingAddress?.recipientName}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">
                      {existingOrder?.shippingAddress?.phone}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-900 font-medium">
                    {existingOrder?.shippingAddress?.address}
                  </p>
                  <p className="text-gray-700">
                    {existingOrder?.shippingAddress?.detailAddress}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-bold mr-2">
                      {existingOrder?.shippingAddress?.zipCode}
                    </span>
                  </p>
                </div>

                {existingOrder?.shippingAddress?.deliveryRequest && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                      {t("account.delivery_request")}
                    </p>
                    <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-100">
                      {existingOrder?.shippingAddress?.deliveryRequest}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Options & Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="w-5 h-5 mr-2" />
                {t("checkout.order_summary")}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.total_amount")}</span>
                  <PriceFormat
                    amount={parseFloat(existingOrder?.amount || "0")}
                    className="font-semibold text-theme-color"
                  />
                </div>
              </div>
            </div>

            {/* Payment Widget Container */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("checkout.payment_method")}
              </h3>

              {/* Error Display */}
              {widgetError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t("checkout.widget_load_failed")}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{t(widgetError)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Toss Payments Widget will be rendered here */}
              <div id="payment-widget" className="mb-4 min-h-[200px]">
                {!widgetReady && !widgetError && (
                  <div className="flex items-center justify-center h-[200px]">
                    <FiLoader className="animate-spin text-blue-600 text-3xl" />
                  </div>
                )}
              </div>

              <button
                onClick={handleTossPayment}
                disabled={paymentProcessing || !widgetReady}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg"
              >
                {paymentProcessing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    {t("checkout.processing")}
                  </>
                ) : !widgetReady ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    {t("checkout.preparing_payment")}
                  </>
                ) : (
                  t("checkout.pay_now")
                )}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default CheckoutPage;
