export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  getVisibleOrderStatuses,
  canUpdateOrderStatus,
  canUpdatePaymentStatus,
  isValidStatusTransition,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/orderStatus";
import { hasPermission } from "@/lib/rbac/permissions";
import { db, users, orders, orderItems, products } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";
import { auth } from "../../../../auth";

// GET - Fetch orders based on user role
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role from DB
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = user.role || "user";

    // Check if user has permission to view orders
    if (!hasPermission(userRole, "orders", "read")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const visibleStatuses = getVisibleOrderStatuses(userRole);
    if (visibleStatuses.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Build query based on role
    let ordersResult;

    if (userRole === "admin" || userRole === "account") {
      // Admin and accountant can see all orders
      ordersResult = await db
        .select({
          order: orders,
          userName: users.name,
          userEmail: users.email,
        })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .orderBy(desc(orders.createdAt));
    } else {
      // Role-based filtering
      ordersResult = await db
        .select({
          order: orders,
          userName: users.name,
          userEmail: users.email,
        })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .where(inArray(orders.status, visibleStatuses))
        .orderBy(desc(orders.createdAt));
    }

    // Get order items for each order
    const transformedOrders = await Promise.all(
      ordersResult.map(async (row) => {
        const items = await db
          .select({
            orderItem: orderItems,
            product: products,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, row.order.id));

        return {
          id: row.order.id,
          ...row.order,
          createdAt: row.order.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: row.order.updatedAt?.toISOString() || new Date().toISOString(),
          customerName: row.userName || "Unknown User",
          customerEmail: row.userEmail || "",
          orderItems: items.map((i) => ({
            ...i.orderItem,
            product: i.product,
          })),
        };
      })
    );

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, paymentStatus, deliveryNotes } =
      await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get user role
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (!userResult[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = userResult[0].role || "user";

    // Check if user has permission to update orders
    if (!hasPermission(userRole, "orders", "update")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get current order
    const orderResult = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!orderResult[0]) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentOrder = orderResult[0];
    const currentStatus = currentOrder.status as OrderStatus;
    const currentPaymentStatus = currentOrder.paymentStatus as PaymentStatus;
    const paymentMethodValue = currentOrder.paymentMethod as PaymentMethod;

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Handle order status update
    if (status && status !== currentStatus) {
      // Validate status transition
      if (!isValidStatusTransition(currentStatus, status)) {
        return NextResponse.json(
          {
            error: `Invalid status transition from ${currentStatus} to ${status}`,
          },
          { status: 400 }
        );
      }

      // Check role permissions for status update
      if (!canUpdateOrderStatus(userRole, currentStatus, status)) {
        return NextResponse.json(
          {
            error: `You don't have permission to change status from ${currentStatus} to ${status}`,
          },
          { status: 403 }
        );
      }

      updateData.status = status;
    }

    // Handle payment status update
    if (paymentStatus && paymentStatus !== currentPaymentStatus) {
      // Check role permissions for payment status update
      if (
        !canUpdatePaymentStatus(
          userRole,
          paymentMethodValue,
          currentPaymentStatus,
          paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            error: `You don't have permission to update payment status for ${paymentMethodValue} payments`,
          },
          { status: 403 }
        );
      }

      updateData.paymentStatus = paymentStatus;
    }

    // Update the order
    await db.update(orders).set(updateData).where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      orderId,
      updates: updateData,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// POST - Create new order (from checkout)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await request.json();

    // Get user
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newOrderId = generateId();
    const now = new Date();

    // Create order with initial status
    const createdOrder = await db.insert(orders).values({
      id: newOrderId,
      orderId: `ORD-${Date.now()}`,
      userId: user.id,
      userEmail: session.user.email,
      status: ORDER_STATUSES.PENDING,
      paymentStatus:
        orderData.paymentMethod === PAYMENT_METHODS.CASH
          ? PAYMENT_STATUSES.PENDING
          : PAYMENT_STATUSES.PAID,
      paymentMethod: orderData.paymentMethod || PAYMENT_METHODS.ONLINE,
      totalAmount: orderData.totalAmount || 0,
      shippingAddress: orderData.shippingAddress || null,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json({
      success: true,
      orderId: createdOrder[0].id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
