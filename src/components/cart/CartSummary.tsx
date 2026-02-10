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
import { getPartnerInfo } from "../PartnerRefTracker";

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

  const { data: session, status } = useSession();
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
        ((item?.price * (item?.discountPercentage || 0)) / 100) * item?.quantity!;
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
  const paymentMethodWidgetRef = useRef<any>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (!showPaymentWidget || !tossReady || widgetReady || initializingRef.current || status !== "authenticated") return;

    let isMounted = true;

    const initializeWidget = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!tossClientKey) {
          if (isMounted) setWidgetError(t("cart.widget_error_no_key"));
          initializingRef.current = false;
          return;
        }

        const TossPayments = (window as any).TossPayments;
        if (!TossPayments) {
          if (isMounted) setWidgetError(t("cart.widget_error_load_failed"));
          initializingRef.current = false;
          return;
        }

        if (!isMounted) {
          initializingRef.current = false;
          return;
        }

        const customerKey = `customer_${session?.user?.id || session?.user?.email?.replace(/[@.]/g, "_") || Date.now()}`;
        const amount = Math.round(totalAmt - discountAmt + shippingCost);

        const tossPayments = TossPayments(tossClientKey);
        const paymentWidget = tossPayments.widgets({ customerKey });

        // Cleanup existing widget if any
        if (paymentMethodWidgetRef.current) {
          try {
            await paymentMethodWidgetRef.current.destroy();
          } catch (e) {
            console.warn("Error destroying previous widget instance in CartSummary:", e);
          }
        }

        if (!isMounted) {
          initializingRef.current = false;
          return;
        }

        await paymentWidget.setAmount({ value: amount, currency: "KRW" });

        if (!isMounted) {
          initializingRef.current = false;
          return;
        }

        // Cleanup any existing widget instance before re-initializing
        if (paymentMethodWidgetRef.current) {
          try {
            const existingWidget = paymentMethodWidgetRef.current as any;
            if (typeof existingWidget.destroy === 'function') {
              await existingWidget.destroy();
            } else if (existingWidget.then) {
              await existingWidget.then((w: any) => w?.destroy?.());
            }
          } catch (e) {
            console.warn("Pre-cleanup failed in CartSummary:", e);
          }
          paymentMethodWidgetRef.current = null;
          paymentWidgetRef.current = null;
        }

        // Render payment methods UI and store promise for cleanup
        const renderPromise = paymentWidget.renderPaymentMethods({
          selector: "#payment-widget-cart",
          variantKey: process.env.NEXT_PUBLIC_TOSS_VARIANT_KEY || "DEFAULT",
        });

        // Save promise to handle cleanup if unmount happens during render
        (paymentMethodWidgetRef.current as any) = renderPromise;

        const paymentMethodsWidget = await renderPromise;

        // If unmounted during await, destroy immediately
        if (!isMounted) {
          paymentMethodsWidget.destroy().catch(() => { });
          initializingRef.current = false;
          return;
        }

        // Store resolved widget instance
        paymentWidgetRef.current = paymentWidget;
        paymentMethodWidgetRef.current = paymentMethodsWidget;

        setWidgetReady(true);
        setWidgetError(null);
      } catch (error) {
        console.error("CartSummary Widget Error:", error);
        if (isMounted) {
          setWidgetError(error instanceof Error ? error.message : "위젯 초기화 실패");
        }
        initializingRef.current = false;
      }
    };

    const timerId = setTimeout(() => {
      initializeWidget();
    }, 500);

    return () => {
      clearTimeout(timerId);
      isMounted = false;
      initializingRef.current = false;

      const widgetOrPromise = paymentMethodWidgetRef.current;
      if (widgetOrPromise) {
        // Handle both resolved widget and pending promise
        if (typeof widgetOrPromise.destroy === 'function') {
          widgetOrPromise.destroy().catch((e: any) => console.warn("Cleanup error in CartSummary:", e));
        } else if (widgetOrPromise.then) {
          widgetOrPromise.then((widget: any) => {
            widget?.destroy().catch((e: any) => console.warn("Cleanup error in CartSummary (promise):", e));
          }).catch(() => { });
        }
        paymentMethodWidgetRef.current = null;
        paymentWidgetRef.current = null;
      }
      setWidgetReady(false);
    };
  }, [showPaymentWidget, tossReady, widgetReady, session, totalAmt, discountAmt, shippingCost, t, status]);

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
      alert(t("cart.payment_system_preparing"));
      return;
    }

    try {
      setPlacing(true);
      const finalTotal = Math.round(totalAmt - discountAmt + shippingCost);

      // 파트너 정보 가져오기 (겟꿀 파트너스 연동)
      const { partnerRef, linkId: partnerLinkId } = getPartnerInfo();

      // Create order first
      const orderData = {
        items: cart.map((item: ProductType) => ({
          id: item.id,
          name: item.title,
          price: item.price * (1 - (item.discountPercentage || 0) / 100),
          quantity: item.quantity,
          image: item.thumbnail || item.images?.[0] || "",
          total: item.price * (1 - (item.discountPercentage || 0) / 100) * item.quantity!,
        })),
        totalAmount: finalTotal.toString(),
        currency: "KRW",
        status: "pending",
        paymentStatus: "pending",
        customerEmail: session?.user?.email,
        customerName: session?.user?.name,
        shippingAddress: selectedAddress,
        createdAt: new Date().toISOString(),
        // 파트너 정보 (지급대행용)
        partnerRef: partnerRef || undefined,
        partnerLinkId: partnerLinkId || undefined,
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
        throw new Error(t("cart.order_creation_failed"));
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
      const customerName = session?.user?.name || session?.user?.email?.split('@')[0] || t("common.customer");

      await paymentWidgetRef.current.requestPayment({
        orderId: pendingOrderId,
        orderName: cart.length > 1 ? t("cart.item_count_suffix", { title: cart[0].title, count: cart.length - 1 }) : cart[0].title,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: session?.user?.email || "",
        customerName: customerName,
      });

      // Note: Cart will be cleared in /payment/success page after payment verification
      // Don't clear here - redirect happens and Redux state resets anyway
    } catch (error: any) {
      if (!error?.message?.includes("취소")) {
        alert(`${t("cart.payment_fail_prefix")}${error?.message || t("cart.try_again_simple")}`);
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
                <h3 className="text-lg font-semibold">{t("cart.checkout_title")}</h3>
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
                    <span className="text-gray-600">{t("cart.total_order_amount")}</span>
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

                {/* Toss Payments Widget will be rendered here */}
                <div id="payment-widget-cart" className="mb-4 min-h-[200px]">
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
                      {t("cart.payment_processing")}
                    </>
                  ) : !widgetReady ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      {t("cart.payment_ready")}
                    </>
                  ) : (
                    t("cart.checkout_title")
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
            className={`mt-4 ${isCheckoutDisabled ? "opacity-50 cursor-not-allowed" : ""
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
                {t("cart.payment_ready")}
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
