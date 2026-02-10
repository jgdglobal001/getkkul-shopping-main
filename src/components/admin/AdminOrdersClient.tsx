"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { AdminTableSkeleton } from "./AdminSkeletons";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FiPackage,
  FiX,
  FiEdit2,
  FiRefreshCw,
  FiTrash2,
  FiSave,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import {
  getStatusDisplayInfo,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/orderStatus";
import PriceFormat from "@/components/PriceFormat";

interface OrderItem {
  id: string;
  title: string;
  name?: string;
  quantity: number;
  price: number;
  image?: string;
  images?: string[];
  total?: number;
}

interface Order {
  id: string;
  orderId?: string;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  userEmail: string;
  customerEmail?: string;
  userName?: string;
  customerName?: string;
  userId?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
    detailAddress?: string; // Added optional property
  };
  createdAt: string;
  updatedAt: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    userRole: string;
    notes: string;
  }>;
  deliveryNotes?: Array<{
    note: string;
    timestamp: string;
    addedBy: string;
    userRole: string;
  }>;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  confirmed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
};

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  partial: "bg-orange-100 text-orange-800",
};

export default function AdminOrdersClient() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { user, isAdmin } = useCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingPayment, setEditingPayment] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [userRole, setUserRole] = useState<string>("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);

  // Modal states
  const [viewOrderModal, setViewOrderModal] = useState<Order | null>(null);
  const [deleteOrderModal, setDeleteOrderModal] = useState<Order | null>(null);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [deleteSelectedModal, setDeleteSelectedModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selected orders state
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchUserRole = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        const role = data.role || "user";
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }, [session?.user?.email]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      // Use admin-specific endpoint if user is admin
      const endpoint =
        userRole === "admin" ? "/api/admin/orders" : "/api/orders";
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch orders");
        return;
      }

      const data = await response.json();

      // Handle different response formats
      if (data.orders) {
        setOrders(data.orders);
      } else if (data.users) {
        // Extract orders from users for admin endpoint
        const allOrders: Order[] = [];
        data.users.forEach((user: any) => {
          if (user.orders && Array.isArray(user.orders)) {
            user.orders.forEach((order: any) => {
              allOrders.push({
                ...order,
                userEmail: user.email,
                userName: user.name,
              });
            });
          }
        });
        setOrders(allOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserRole();
    }
  }, [session, fetchUserRole]);

  // Separate effect to fetch orders after role is set
  useEffect(() => {
    if (userRole && userRole !== "" && session?.user?.email) {
      fetchOrders();
    }
  }, [userRole, session?.user?.email, fetchOrders]);
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const updateData: any = { orderId, status: newStatus };

      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      if (deliveryNote.trim()) {
        updateData.deliveryNotes = deliveryNote.trim();
      }

      // Use admin-specific endpoint for updates if user is admin
      const endpoint =
        userRole === "admin" ? "/api/admin/orders" : "/api/orders";
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const statusInfo = getStatusDisplayInfo(newStatus);
        toast.success(
          t('admin.messages.update_status_success', { status: t('admin.status.' + newStatus.toLowerCase()) })
        );
        await fetchOrders();
        setDeliveryNote("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    newPaymentStatus: PaymentStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: newPaymentStatus,
          deliveryNotes:
            deliveryNote.trim() || `Payment marked as ${newPaymentStatus}`,
        }),
      });

      if (response.ok) {
        toast.success(t('admin.messages.update_payment_success', { status: t('admin.payment_status.' + newPaymentStatus.toLowerCase()) }));
        await fetchOrders();
        setDeliveryNote("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          (order.orderId || order.id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.customerName || order.userName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (order.customerEmail || order.userEmail || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter
      );
    }

    // Payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus.toLowerCase() === paymentFilter
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change

    // Clear selections when filters change
    setSelectedOrders([]);
    setSelectAll(false);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // Calculate pagination - moved up to use in effects
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Update selectAll state based on selected orders
  useEffect(() => {
    if (currentOrders.length > 0) {
      const allCurrentOrdersSelected = currentOrders.every((order) =>
        selectedOrders.includes(order.id)
      );
      setSelectAll(allCurrentOrdersSelected && selectedOrders.length > 0);
    } else {
      setSelectAll(false);
    }
  }, [selectedOrders, currentOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        await fetchOrders();
        setEditingOrder(null);
        setNewStatus("");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: string
  ) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        setEditingPayment(null);
        setNewPaymentStatus("");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    setDeleteOrderModal(order);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteOrderModal) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/orders/${deleteOrderModal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(t('admin.messages.delete_success'));
        await fetchOrders();
        setDeleteOrderModal(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/orders/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(t('admin.messages.delete_all_success'));
        await fetchOrders();
        setDeleteAllModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete all orders");
      }
    } catch (error) {
      console.error("Error deleting all orders:", error);
      toast.error("Error deleting all orders");
    } finally {
      setIsDeleting(false);
    }
  };

  // Selection handlers
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map((order) => order.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error(t('admin.messages.select_to_delete'));
      return;
    }
    setDeleteSelectedModal(true);
  };

  const confirmDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/orders/bulk-delete-selected", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      if (response.ok) {
        toast.success(t('admin.messages.delete_selected_success', { count: selectedOrders.length }));
        setSelectedOrders([]);
        setSelectAll(false);
        await fetchOrders();
        setDeleteSelectedModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete selected orders");
      }
    } catch (error) {
      console.error("Error deleting selected orders:", error);
      toast.error("Error deleting selected orders");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <AdminTableSkeleton rows={5} />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('admin.orders_management')} ({filteredOrders.length})
          </h2>
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteSelected}
                className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                disabled={selectedOrders.length === 0}
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                {t('admin.delete_selected')} ({selectedOrders.length})
              </button>
              <button
                onClick={() => setDeleteAllModal(true)}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                disabled={orders.length === 0}
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                {t('admin.delete_all')}
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                {t('admin.refresh')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('admin.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">{t('admin.all_status')}</option>
              <option value="pending">{t('admin.status.pending')}</option>
              <option value="processing">{t('admin.status.processing')}</option>
              <option value="shipped">{t('admin.status.shipped')}</option>
              <option value="delivered">{t('admin.status.delivered')}</option>
              <option value="completed">{t('admin.status.completed')}</option>
              <option value="cancelled">{t('admin.status.cancelled')}</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="sm:w-48">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">{t('admin.all_payments')}</option>
              <option value="paid">{t('admin.payment_status.paid')}</option>
              <option value="pending">{t('admin.payment_status.pending')}</option>
              <option value="failed">{t('admin.payment_status.failed')}</option>
              <option value="refunded">{t('admin.payment_status.refunded')}</option>
              <option value="partial">{t('admin.payment_status.partial')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selectAll && currentOrders.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.order')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.customer')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.status')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.payment')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.amount')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t('admin.table.date')}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                {t('admin.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiPackage className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        #{order.orderId || order.id.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items?.length || 0} {t('admin.table.items')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {order.customerName || t('admin.table.no_name')}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {editingOrder?.id === order.id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    >
                      <option value="">{t('admin.status.select')}</option>
                      <option value="pending">{t('admin.status.pending')}</option>
                      <option value="processing">{t('admin.status.processing')}</option>
                      <option value="shipped">{t('admin.status.shipped')}</option>
                      <option value="delivered">{t('admin.status.delivered')}</option>
                      <option value="completed">{t('admin.status.completed')}</option>
                      <option value="cancelled">{t('admin.status.cancelled')}</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[
                        order.status as keyof typeof statusColors
                      ] || "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {t('admin.status.' + order.status.toLowerCase())}
                    </span>
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {editingPayment?.id === order.id ? (
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    >
                      <option value="">{t('admin.payment_status.select')}</option>
                      <option value="paid">{t('admin.payment_status.paid')}</option>
                      <option value="pending">{t('admin.payment_status.pending')}</option>
                      <option value="failed">{t('admin.payment_status.failed')}</option>
                      <option value="refunded">{t('admin.payment_status.refunded')}</option>
                      <option value="partial">{t('admin.payment_status.partial')}</option>
                    </select>
                  ) : (
                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[
                          order.paymentStatus as keyof typeof paymentStatusColors
                        ] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {order.paymentStatus ? t('admin.payment_status.' + order.paymentStatus.toLowerCase()) : t('admin.common.unknown')}
                      </span>
                      {order.paymentMethod && (
                        <div className="text-xs text-gray-500 capitalize mt-1 truncate">
                          {t('admin.payment_method.' + order.paymentMethod.toLowerCase())}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <PriceFormat amount={order.amount || 0} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  {editingOrder?.id === order.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUpdateStatus(order.id, newStatus)}
                        disabled={!newStatus}
                        className="p-1 text-green-600 hover:text-green-900 disabled:text-gray-400 transition-colors"
                        title={t('admin.buttons.save')}
                      >
                        <FiSave size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(null);
                          setNewStatus("");
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title={t('admin.buttons.cancel')}
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : editingPayment?.id === order.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          handleUpdatePaymentStatus(order.id, newPaymentStatus)
                        }
                        disabled={!newPaymentStatus}
                        className="p-1 text-green-600 hover:text-green-900 disabled:text-gray-400 transition-colors"
                        title={t('admin.buttons.save')}
                      >
                        <FiSave size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPayment(null);
                          setNewPaymentStatus("");
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Cancel"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setViewOrderModal(order)}
                        className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                        title={t('admin.buttons.view_details')}
                      >
                        <FiEye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setNewStatus(order.status);
                        }}
                        className="p-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                        title={t('admin.buttons.edit_status')}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPayment(order);
                          setNewPaymentStatus(order.paymentStatus);
                        }}
                        className="p-1 text-green-600 hover:text-green-900 transition-colors"
                        title={t('admin.buttons.edit_status')}
                      >
                        💳
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="p-1 text-red-600 hover:text-red-900 transition-colors"
                          title={t('admin.buttons.delete_order')}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <div className="px-6 py-12 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('admin.empty.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
              ? t('admin.empty.search')
              : t('admin.empty.no_orders')}
          </p>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('admin.modal.order_details')}
                </h3>
                <button
                  onClick={() => setViewOrderModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{t('admin.modal.order_info')}</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.order')} ID
                    </dt>
                    <dd className="text-sm text-gray-900">
                      #{viewOrderModal.orderId || viewOrderModal.id.slice(-8)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.status')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[
                          viewOrderModal.status as keyof typeof statusColors
                        ] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {t('admin.status.' + viewOrderModal.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.customer')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.customerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('admin.table.email')}</dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.customerEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.amount')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <PriceFormat amount={viewOrderModal.amount || 0} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('admin.table.date')}</dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.createdAt
                        ? new Date(viewOrderModal.createdAt).toLocaleString()
                        : "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.payment')} {t('admin.table.status')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[
                          viewOrderModal.paymentStatus as keyof typeof paymentStatusColors
                        ] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {viewOrderModal.paymentStatus ? t('admin.payment_status.' + viewOrderModal.paymentStatus) : t('admin.common.unknown')}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {t('admin.table.payment')}
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {viewOrderModal.paymentMethod ? t('admin.payment_method.' + viewOrderModal.paymentMethod) : t('admin.common.not_specified')}
                    </dd>
                  </div>
                </dl>
              </div>

              {viewOrderModal.items && viewOrderModal.items.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900">{t('admin.table.items')}</h4>
                  <div className="mt-2 space-y-2">
                    {viewOrderModal.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {(item.image || (item.images && item.images[0])) && (
                            <Image
                              src={item.image || item.images?.[0] || ""}
                              alt={item.title || item.name || "Product Image"}
                              width={48}
                              height={48}
                              className="object-cover rounded"
                              unoptimized
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.title || item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('admin.table.quantity')}: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          <PriceFormat
                            amount={item.total || item.price * item.quantity}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewOrderModal.shippingAddress && (
                <div>
                  <h4 className="font-medium text-gray-900">
                    {t('admin.modal.shipping_address')}
                  </h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {viewOrderModal.shippingAddress.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {viewOrderModal.shippingAddress.zipCode}) {viewOrderModal.shippingAddress.city} {viewOrderModal.shippingAddress.state} {viewOrderModal.shippingAddress.address} {viewOrderModal.shippingAddress.detailAddress || ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewOrderModal.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setViewOrderModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {t('admin.buttons.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiTrash2 className="mr-2 h-5 w-5 text-red-600" />
                {t('admin.modal.delete_order_title')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('admin.modal.delete_order_confirm')}{" "}
                <strong>
                  #{deleteOrderModal.orderId || deleteOrderModal.id.slice(-8)}
                </strong>
                ?
              </p>
              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-700">
                  <div>
                    <strong>{t('admin.table.customer')}:</strong> {deleteOrderModal.userEmail}
                  </div>
                  <div>
                    <strong>{t('admin.table.amount')}:</strong>{" "}
                    <PriceFormat amount={deleteOrderModal.amount} />
                  </div>
                  <div>
                    <strong>{t('admin.table.items')}:</strong> {deleteOrderModal.items.length}{" "}
                    {t('admin.table.items')}
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>{t('admin.modal.warning')}:</strong> {t('admin.modal.delete_warning')}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteOrderModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                {t('admin.buttons.cancel')}
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('admin.buttons.deleting')}
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    {t('admin.buttons.delete_order')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Orders Modal */}
      {deleteAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('admin.modal.delete_all_title')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('admin.modal.delete_all_confirm')}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteAllModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                {t('admin.buttons.cancel')}
              </button>
              <button
                onClick={handleDeleteAllOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? t('admin.buttons.deleting') : t('admin.buttons.delete_all')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Selected Orders Modal */}
      {deleteSelectedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiTrash2 className="mr-2 h-5 w-5 text-red-600" />
                {t('admin.modal.delete_selected_title')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('admin.modal.delete_selected_confirm', { count: selectedOrders.length })}
              </p>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>{t('admin.modal.warning')}:</strong> {t('admin.modal.delete_warning')}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteSelectedModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                {t('admin.buttons.cancel')}
              </button>
              <button
                onClick={confirmDeleteSelected}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('admin.buttons.deleting')}
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    {t('admin.buttons.delete_count_orders', { count: selectedOrders.length })}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t('admin.pagination.showing', { start: indexOfFirstOrder + 1, end: Math.min(indexOfLastOrder, filteredOrders.length), total: filteredOrders.length })}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('admin.pagination.previous')}
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                {t('admin.pagination.page_of', { current: currentPage, total: totalPages })}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('admin.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
