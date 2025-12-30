import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Title from "../Title";
import Button from "../ui/Button";
import PriceFormat from "../PriceFormat";
import ShippingAddressSelector from "./ShippingAddressSelector";
import { ProductType, Address } from "../../../type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiDeliveryTruck } from "react-icons/ci";
import { FiAlertCircle, FiLoader, FiX } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import Script from "next/script";

interface Props {
  cart: ProductType[];
}

const CartSummary = ({ cart }: Props) => {
  const { t } = useTranslation();
  const [totalAmt, setTotalAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [placing, setPlacing] = useState(false);

  // Toss Widget states
  const [showPaymentWidget, setShowPaymentWidget] = useState(false);
  const [tossReady, setTossReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const paymentWidgetRef = useRef<any>(null);

  const { data: session } = useSession();
  const router = useRouter();

  // Get free shipping threshold from environment
  const freeShippingThreshold =
    Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 29000;
  const standardShippingCost = 3000; // Standard shipping cost (₩3,000)

  useEffect(() => {
    let amt = 0;
    let discount = 0;
    cart?.map((item) => {
      amt += item?.price * item?.quantity!;
      discount +=
        ((item?.price * item?.discountPercentage) / 100) * item?.quantity!;
    });

    setTotalAmt(amt);
    setDiscountAmt(discount);

    // Calculate shipping cost based on order total
    const orderTotal = amt - discount;
    if (orderTotal >= freeShippingThreshold) {
      setIsFreeShipping(true);
      setShippingCost(0);
    } else {
      setIsFreeShipping(false);
      setShippingCost(standardShippingCost);
    }
  }, [cart, freeShippingThreshold]);

  // Initialize Toss Widget when showPaymentWidget becomes true
  useEffect(() => {
    if (!showPaymentWidget || !tossReady || widgetReady) return;

    const initializeWidget = async () => {
      try {
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!tossClientKey) {
          setWidgetError("결제 설정 오류: 클라이언트 키가 없습니다.");
          return;
        }

        const TossPayments = (window as any).TossPayments;
        if (!TossPayments) {
          setWidgetError("결제 시스템 로드 실패. 페이지를 새로고침 해주세요.");
          return;
        }

        const customerKey = `customer_${session?.user?.id || session?.user?.email?.replace(/[@.]/g, "_") || Date.now()}`;
        const amount = Math.round(totalAmt - discountAmt + shippingCost);

        const tossPayments = TossPayments(tossClientKey);
        const paymentWidget = tossPayments.widgets({ customerKey });

        await paymentWidget.setAmount({ value: amount, currency: "KRW" });
        await paymentWidget.renderPaymentMethods({
          selector: "#cart-payment-widget",
          variantKey: "getkkul-toss-widget",
        });

        paymentWidgetRef.current = paymentWidget;
        setWidgetReady(true);
        setWidgetError(null);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "위젯 초기화 실패";
        setWidgetError(errorMsg);
      }
    };

    initializeWidget();
  }, [showPaymentWidget, tossReady, widgetReady, session, totalAmt, discountAmt, shippingCost]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    if (!selectedAddress) {
      alert(t("cart.please_select_address"));
      return;
    }

    if (!tossReady) {
      alert("결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      setPlacing(true);
      const finalTotal = Math.round(totalAmt - discountAmt + shippingCost);

      // Create order first
      const orderData = {
        items: cart.map((item: ProductType) => ({
          id: item.id,
          name: item.title,
          price: item.price * (1 - item.discountPercentage / 100),
          quantity: item.quantity,
          image: item.thumbnail || item.images?.[0] || "",
          total: item.price * (1 - item.discountPercentage / 100) * item.quantity!,
        })),
        totalAmount: finalTotal.toString(),
        currency: "KRW",
        status: "pending",
        paymentStatus: "pending",
        customerEmail: session?.user?.email,
        customerName: session?.user?.name,
        shippingAddress: selectedAddress,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setPendingOrderId(result.orderId);
        setShowPaymentWidget(true);
      } else {
        throw new Error("주문 생성 실패");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(t("common.error_occurred"));
    } finally {
      setPlacing(false);
    }
  };

  const handleTossPayment = async () => {
    if (!paymentWidgetRef.current || !pendingOrderId) return;

    try {
      setPaymentProcessing(true);
      const customerName = session?.user?.name || session?.user?.email?.split('@')[0] || "고객";

      await paymentWidgetRef.current.requestPayment({
        orderId: pendingOrderId,
        orderName: cart.length > 1 ? `${cart[0].title} 외 ${cart.length - 1}건` : cart[0].title,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: session?.user?.email || "",
        customerName: customerName,
      });

      // Note: Cart will be cleared in /payment/success page after payment verification
      // Don't clear here - redirect happens and Redux state resets anyway
    } catch (error: any) {
      if (!error?.message?.includes("취소")) {
        alert(`결제 실패: ${error?.message || "다시 시도해주세요."}`);
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentWidget(false);
    setWidgetReady(false);
    setPendingOrderId(null);
    paymentWidgetRef.current = null;
  };

  const isCheckoutDisabled = session?.user && (!selectedAddress || placing || !tossReady);

  return (
    <>
      {/* Load Toss Payments SDK v2 */}
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onLoad={() => setTossReady(true)}
        strategy="afterInteractive"
      />

      <section className="rounded-lg bg-gray-100 px-4 py-6 sm:p-10 lg:col-span-5 mt-16 lg:mt-0">
        <Title>{t("cart.cart_summary")}</Title>

        {/* Toss Payment Widget Modal */}
        {showPaymentWidget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">결제하기</h3>
                <button
                  onClick={handleCancelPayment}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {/* Order Summary */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">총 결제금액</span>
                    <PriceFormat
                      amount={totalAmt - discountAmt + shippingCost}
                      className="text-lg font-bold text-theme-color"
                    />
                  </div>
                </div>

                {/* Widget Error */}
                {widgetError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {widgetError}
                  </div>
                )}

                {/* Toss Payment Widget Container */}
                <div id="cart-payment-widget" className="min-h-[200px]">
                  {!widgetReady && !widgetError && (
                    <div className="flex items-center justify-center h-[200px]">
                      <FiLoader className="animate-spin text-blue-600 text-3xl" />
                    </div>
                  )}
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleTossPayment}
                  disabled={paymentProcessing || !widgetReady}
                  className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg"
                >
                  {paymentProcessing ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      결제 진행 중...
                    </>
                  ) : !widgetReady ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      결제 준비 중...
                    </>
                  ) : (
                    "결제하기"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show different content based on authentication status */}
        {session?.user ? (
          <>
            {/* Shipping Address Selector */}
            <ShippingAddressSelector
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
            />

            {/* Address Required Warning */}
            {!selectedAddress && (
              <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center text-orange-800">
                  <FiAlertCircle className="text-orange-600 text-lg mr-2" />
                  <span className="text-sm font-medium">
                    {t("cart.please_select_address")}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Login Required Message */
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <FaSignInAlt className="text-blue-600 text-lg mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-blue-800 font-medium mb-2">
                  {t("cart.login_required_to_place_order")}
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  {t("cart.you_can_browse_and_add")}
                </p>
                <Link
                  href="/auth/signin?callbackUrl=/cart"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  <FaSignInAlt className="w-3 h-3" />
                  {t("cart.sign_in_to_continue")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Free Shipping Banner */}
        {isFreeShipping ? (
          <div className="mt-4 mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <CiDeliveryTruck className="text-green-600 text-xl mr-2" />
              <span className="text-sm font-medium">
                {t("cart.congratulations_free_shipping")}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-blue-800">
              <CiDeliveryTruck className="text-blue-600 text-xl mr-2" />
              <div className="text-sm">
                <div className="font-medium">
                  {t("cart.add_more_for_free_shipping")}
                  <PriceFormat
                    amount={freeShippingThreshold - (totalAmt - discountAmt)}
                    className="font-bold"
                  />
                  {" "}{t("cart.add_more_for_free_shipping_suffix")}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  <PriceFormat amount={freeShippingThreshold} />
                  {" "}{t("cart.free_shipping_on_orders_over")}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Title className="text-lg font-medium">{t("cart.sub_total")}</Title>
            <PriceFormat amount={totalAmt} />
          </div>
          <div className="flex items-center justify-between">
            <Title className="text-lg font-medium">{t("cart.discount")}</Title>
            <PriceFormat amount={discountAmt} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Title className="text-lg font-medium">{t("cart.shipping")}</Title>
              {isFreeShipping && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {t("cart.free_shipping")}
                </span>
              )}
            </div>
            {isFreeShipping ? (
              <span className="text-green-600 font-medium">{t("cart.free")}</span>
            ) : (
              <PriceFormat amount={shippingCost} />
            )}
          </div>
          <div className="border-t border-gray-300 pt-3 flex items-center justify-between">
            <Title className="text-lg font-bold">{t("cart.total_payment")}</Title>
            <PriceFormat
              amount={totalAmt - discountAmt + shippingCost}
              className="text-lg font-bold text-theme-color"
            />
          </div>
          <Button
            onClick={handleCheckout}
            className={`mt-4 ${
              isCheckoutDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isCheckoutDisabled}
          >
            {!session?.user ? (
              t("cart.login_to_order")
            ) : placing ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                {t("cart.placing_order")}
              </>
            ) : !selectedAddress ? (
              t("cart.select_address_to_checkout")
            ) : !tossReady ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                결제 준비 중...
              </>
            ) : (
              t("cart.place_order")
            )}
          </Button>
        </div>
      </section>
    </>
  );
};

export default CartSummary;
