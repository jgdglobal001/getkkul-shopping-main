"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import PriceFormat from "@/components/PriceFormat";
import {
  FiEye,
  FiX,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiTrash2,
} from "react-icons/fi";
import Link from "next/link";

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
}

interface OrdersListProps {
  showHeader?: boolean;
  onOrdersChange?: (orders: Order[]) => void;
}

export default function OrdersList({
  showHeader = false,
  onOrdersChange,
}: OrdersListProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();

      if (data.orders && Array.isArray(data.orders)) {
        const sortedOrders = data.orders.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        onOrdersChange?.(sortedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(t("account.error_loading_orders"));
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, onOrdersChange]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session?.user?.email, fetchOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length
        ? []
        : orders.map((order) => order.id)
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;

    setIsDeleting(true);
    setShowDeleteConfirm(false);
    try {
      // 실제 API 호출하여 주문 삭제
      const response = await fetch('/api/admin/orders/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      const result = await response.json();

      if (result.success) {
        // 삭제 성공 - 목록에서 제거
        const updatedOrders = orders.filter(
          (order) => !selectedOrders.includes(order.id)
        );
        setOrders(updatedOrders);
        setSelectedOrders([]);
        onOrdersChange?.(updatedOrders);
        alert(`${result.deletedCount}${t("orders.orders_deleted")}`);
      } else {
        alert(`${t("orders.delete_failed")}: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert(t("orders.order_delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  // 주문 취소 처리
  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    setShowCancelConfirm(null);

    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          cancelReason: t("orders.customer_request_cancel")
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 주문 목록 새로고침
        await fetchOrders();
        alert(t("orders.cancel_success"));
      } else {
        alert(`${t("orders.cancel_failed")}: ${result.error}`);
      }
    } catch (error) {
      console.error('Order cancel error:', error);
      alert(t("orders.order_cancel_error"));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder || !isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={closeOrderModal}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("account.order_details")} - {selectedOrder.orderId}
              </h3>
              <p className="text-sm text-gray-600">
                {t("account.placed_on", { date: formatDate(selectedOrder.createdAt) })}
              </p>
            </div>
            <button
              onClick={closeOrderModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("account.status_label")}</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {t(`orders.status_${selectedOrder.status.toLowerCase()}`)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("account.total_amount")}</p>
                  <p className="font-semibold text-gray-900">
                    <PriceFormat amount={parseFloat(selectedOrder.amount)} />
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("account.payment_status_label")}</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {t(`orders.payment_status_${selectedOrder.paymentStatus.toLowerCase()}`)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t("account.items")} ({(selectedOrder.items || []).length})
              </h4>
              <div className="space-y-4">
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
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
                      <h5 className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{t("common.quantity")}: {item.quantity}</span>
                        <span>
                          {t("common.unit_price")}: <PriceFormat amount={item.price} />
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

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeOrderModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t("common.close")}
              </button>
              {selectedOrder.status.toLowerCase() === "confirmed" &&
                selectedOrder.paymentStatus.toLowerCase() === "paid" && (
                  <Link
                    href={`/account/orders/${selectedOrder.id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-theme-color rounded-md hover:bg-theme-color/90 transition-colors"
                  >
                    {t("account.track_order")}
                  </Link>
                )}
              {selectedOrder.paymentStatus.toLowerCase() === "pending" && (
                <Link
                  href={`/checkout?orderId=${selectedOrder.id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  {t("account.pay_now")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("account.order_history")}</h2>
            <p className="text-gray-600">{t("account.track_manage_orders")}</p>
          </div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("account.error_loading_orders")}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
        >
          {t("common.try_again")}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("account.order_history")}</h2>
            <p className="text-gray-600">{t("account.track_manage_orders")}</p>
          </div>
        )}
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("account.no_orders_yet")}
        </h3>
        <p className="text-gray-600 mb-6">
          {t("account.no_orders_desc")}
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
        >
          {t("common.start_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("account.order_history")}</h2>
          <p className="text-gray-600">
            {orders.length} {t("account.orders_found")}
          </p>
        </div>
      )}

      {/* Delete Selected Button */}
      {selectedOrders.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} {t("account.orders_selected")}
            </span>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            {isDeleting
              ? t("common.deleting")
              : `${t("common.delete_selected")} (${selectedOrders.length})`}
          </button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block w-full max-w-7xl mx-auto">
        <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg w-full">
          <table className="w-full divide-y divide-gray-300 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === orders.length &&
                      orders.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("account.order")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("common.date")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("account.items_label")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("account.status_label")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("account.total")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? "bg-blue-50" : ""
                    }`}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        #{order.orderId}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1 overflow-hidden flex-shrink-0">
                        {(order.items || []).slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden flex-shrink-0"
                          >
                            {item.images && item.images[0] ? (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {item.name?.charAt(0)?.toUpperCase() || "P"}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 truncate">
                        {(order.items || []).length}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {t(`orders.status_${order.status.toLowerCase()}`)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {t(`orders.payment_status_${order.paymentStatus.toLowerCase()}`)}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <PriceFormat amount={parseFloat(order.amount)} />
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        title={t("account.order_history")}
                      >
                        {t("account.order_history")}
                      </button>
                      {order.status.toLowerCase() === "confirmed" &&
                        order.paymentStatus.toLowerCase() === "paid" && (
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            title={t("orders.track_order")}
                          >
                            {t("orders.track_order")}
                          </Link>
                        )}
                      {order.paymentStatus.toLowerCase() === "pending" && (
                        <Link
                          href={`/checkout?orderId=${order.id}`}
                          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                          title={t("orders.pay_now")}
                        >
                          {t("orders.pay_now")}
                        </Link>
                      )}
                      {/* 결제 완료된 주문 취소 버튼 */}
                      {order.status.toLowerCase() !== "cancelled" &&
                        order.paymentStatus.toLowerCase() === "paid" && (
                          <button
                            onClick={() => setShowCancelConfirm(order.id)}
                            disabled={cancellingOrderId === order.id}
                            className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                            title={t("orders.cancel_order")}
                          >
                            {cancellingOrderId === order.id ? t("orders.cancelling") : t("orders.cancel_order")}
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 w-full">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-white rounded-lg shadow border border-gray-200 p-4 ${selectedOrders.includes(order.id)
              ? "ring-2 ring-blue-500 bg-blue-50"
              : ""
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    #{order.orderId}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                  order.status
                )}`}
              >
                {t(`orders.status_${order.status.toLowerCase()}`)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1 overflow-hidden">
                  {(order.items || []).slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="inline-block h-6 w-6 rounded-full ring-1 ring-white overflow-hidden"
                    >
                      {item.images && item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {item.name?.charAt(0)?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {(order.items || []).length} {t("common.item_count", { count: (order.items || []).length })}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  <PriceFormat amount={parseFloat(order.amount)} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div className="text-xs text-gray-500">
                {t("cart.payment")}: {t(`orders.payment_status_${order.paymentStatus.toLowerCase()}`)}
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => openOrderModal(order)}
                  className="flex items-center justify-center px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {t("account.order_history")}
                </button>
                {order.status.toLowerCase() === "confirmed" &&
                  order.paymentStatus.toLowerCase() === "paid" && (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex items-center justify-center px-3 py-1 text-xs bg-theme-color text-white rounded hover:bg-theme-color/90 transition-colors whitespace-nowrap"
                    >
                      {t("account.track")}
                    </Link>
                  )}
                {order.paymentStatus.toLowerCase() === "pending" && (
                  <Link
                    href={`/checkout?orderId=${order.id}`}
                    className="flex items-center justify-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    {t("account.pay_now")}
                  </Link>
                )}
                {/* 결제 완료된 주문 취소 버튼 (모바일) */}
                {order.status.toLowerCase() !== "cancelled" &&
                  order.paymentStatus.toLowerCase() === "paid" && (
                    <button
                      onClick={() => setShowCancelConfirm(order.id)}
                      disabled={cancellingOrderId === order.id}
                      className="flex items-center justify-center px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {cancellingOrderId === order.id ? t("orders.cancelling") : t("orders.cancel_order")}
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />

      {/* Delete Confirmation Modal */}
      {
        showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDeleteConfirm(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                {t("account.delete_orders")}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                {t("account.delete_orders_confirm", { count: selectedOrders.length })}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? t("common.deleting") : t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Cancel Order Confirmation Modal */}
      {
        showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowCancelConfirm(null)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <FiX className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                {t("orders.cancel_confirm_title")}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                {t("orders.cancel_confirm_message")}<br />
                {t("orders.refund_info") || "결제가 취소되고 환불이 진행됩니다."}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {t("common.close")}
                </button>
                <button
                  onClick={() => handleCancelOrder(showCancelConfirm)}
                  disabled={cancellingOrderId !== null}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {cancellingOrderId ? t("orders.cancelling") : t("orders.cancel_order")}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
