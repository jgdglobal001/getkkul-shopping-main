export const runtime = 'edge';

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import PriceFormat from "@/components/PriceFormat";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiArrowLeft,
  FiDownload,
  FiPhone,
  FiMail,
} from "react-icons/fi";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  total: number;
}

interface Order {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  customerEmail: string;
  customerName: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrderTrackingPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      // Find the specific order from the user's orders
      if (data.orders && Array.isArray(data.orders)) {
        const foundOrder = data.orders.find(
          (order: Order) => order.id === orderId
        );
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          throw new Error("Order not found");
        }
      } else {
        throw new Error("No orders found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, orderId]);

  useEffect(() => {
    if (session?.user?.email && orderId) {
      fetchOrderDetails();
    }
  }, [session?.user?.email, orderId, fetchOrderDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "processing":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "delivered":
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTrackingSteps = () => {
    const steps = [
      { id: "confirmed", label: t('account.status.confirmed'), icon: FiCheckCircle },
      { id: "processing", label: t('account.processing'), icon: FiClock },
      { id: "shipped", label: t('account.shipped'), icon: FiTruck },
      { id: "delivered", label: t('account.delivered'), icon: FiPackage },
    ];

    const currentStatus = order?.status.toLowerCase();
    const statusOrder = ["confirmed", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus || "");

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <ProtectedRoute loadingMessage={t('loading_order_details')}>
        <Container className="py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded h-8 w-64 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded h-6 w-48"></div>
                <div className="bg-gray-200 rounded h-4 w-full"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              </div>
            </div>
          </div>
        </Container>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute loadingMessage={t('account.loading_order_details')}>
        <Container className="py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">?벀</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('account.order_not_found')}
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Link
              href="/account"
              className="inline-flex items-center px-4 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              {t('account.back_to_account')}
            </Link>
          </div>
        </Container>
      </ProtectedRoute>
    );
  }

  const trackingSteps = getTrackingSteps();

  return (
    <ProtectedRoute loadingMessage={t('account.loading_order_details')}>
      <Container className="py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('account.order_tracking')}</h1>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/account"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('account.order_number')} {order.orderId}
              </h1>
              <p className="text-gray-600">
                {t('account.placed_on', { date: formatDate(order.createdAt) })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4 mr-2" />
              {t('account.download_receipt')}
            </button>
            <span
              className={`px-4 py-2 text-sm font-medium rounded-lg border capitalize ${getStatusColor(
                order.status
              )}`}
            >
              {t('account.status.' + order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {t('account.order_tracking')}
              </h3>

              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="relative flex items-center mb-8 last:mb-0"
                    >
                      {/* Connector Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-16 ${
                            step.completed ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Step Icon */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          step.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : step.active
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Step Content */}
                      <div className="ml-4 flex-1">
                        <h4
                          className={`font-medium ${
                            step.completed || step.active
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {t(step.label)}
                        </h4>
                        {step.active && (
                          <p className="text-sm text-gray-600 mt-1">
                            {t('account.your_order_is_currently_being')}{" "}
                            {t(step.label)}
                          </p>
                        )}
                        {step.completed && index === 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {t('account.tracking_number')}
                  </h4>
                  <p className="text-blue-700 font-mono text-sm">
                    {order.trackingNumber}
                  </p>
                </div>
              )}

              {order.estimatedDelivery && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    {t('account.estimated_delivery')}
                  </h4>
                  <p className="text-green-700 text-sm">
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('account.items', { count: order.items.length })}
              </h3>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {item.name?.charAt(0)?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{t('account.qty')}: {item.quantity}</span>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('account.order_summary')}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiCreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('account.total_amount')}</p>
                    <p className="font-semibold">
                      <PriceFormat amount={parseFloat(order.amount)} />
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('account.payment_status_label')}</p>
                    <p className="font-medium capitalize text-green-600">
                      {t('account.payment_status.' + order.paymentStatus)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{t('account.order_date')}</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('account.shipping_address')}
                </h3>

                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('account.need_help')}
              </h3>

              <div className="space-y-3">
                <button className="flex items-center space-x-3 w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t('account.call_support')}</p>
                    <p className="text-sm text-gray-600">1-800-SHOFY-HELP</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiMail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t('account.email_support')}</p>
                    <p className="text-sm text-gray-600">support@shofy.com</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default OrderTrackingPage;
