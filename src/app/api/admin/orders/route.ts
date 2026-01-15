export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db, users, orders, orderItems, partnerLinks } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { calculatePartnerCommission } from "@/lib/partnerCommission";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // For now, assume admin access

    // Fetch all users
    const usersResult = await db.select().from(users).orderBy(desc(users.createdAt));

    // Fetch all orders with user info
    const ordersResult = await db
      .select({
        order: orders,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    // Group orders by user
    const userOrdersMap = new Map<string, any[]>();
    for (const { order, userName, userEmail } of ordersResult) {
      if (order.userId) {
        if (!userOrdersMap.has(order.userId)) {
          userOrdersMap.set(order.userId, []);
        }
        userOrdersMap.get(order.userId)!.push(order);
      }
    }

    const transformedUsers = usersResult.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email || "",
      role: user.role || "user",
      createdAt: user.createdAt?.toISOString(),
      orders: userOrdersMap.get(user.id) || [],
    }));

    const transformedStandaloneOrders = ordersResult.map(({ order, userName, userEmail }) => ({
      id: order.id,
      ...order,
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
      customerName: userName || "Unknown User",
      customerEmail: userEmail || "",
    }));

    return NextResponse.json(
      {
        users: transformedUsers,
        standaloneOrders: transformedStandaloneOrders,
        totalUsers: transformedUsers.length,
        totalOrders: ordersResult.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const body = await request.json();
    const { orderId, userId, updates, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Build updates object from individual fields or use provided updates
    const updateFields = updates || {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    // 🔄 환불/취소 시 파트너 커미션 회수 처리
    const isRefundOrCancel =
      status === ORDER_STATUSES.CANCELLED ||
      paymentStatus === PAYMENT_STATUSES.REFUNDED;

    // 기존 주문 정보 조회 (커미션 회수 필요 여부 확인)
    let existingOrder = null;
    if (isRefundOrCancel) {
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      existingOrder = orderResult[0];
    }

    // Try to update order
    try {
      const updatedOrders = await db.update(orders).set({
        ...updateFields,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId)).returning();

      if (updatedOrders.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 🎯 환불/취소 시 파트너 커미션 회수
      if (isRefundOrCancel && existingOrder?.partnerLinkId) {
        try {
          // 이미 취소/환불된 주문인지 확인
          const wasAlreadyCancelledOrRefunded =
            existingOrder.status === ORDER_STATUSES.CANCELLED ||
            existingOrder.paymentStatus === PAYMENT_STATUSES.REFUNDED;

          if (!wasAlreadyCancelledOrRefunded) {
            console.log(`[CommissionRefund] Processing refund for partnerLinkId: ${existingOrder.partnerLinkId}`);

            // 주문 아이템에서 총 상품 가격 계산
            const items = await db
              .select({ price: orderItems.price, quantity: orderItems.quantity })
              .from(orderItems)
              .where(eq(orderItems.orderId, existingOrder.id));

            const totalProductPrice = items.reduce(
              (sum, item) => sum + (item.price * item.quantity),
              0
            );

            // 커미션 계산 (상품가격의 15%)
            const commission = calculatePartnerCommission(totalProductPrice);

            console.log(`[CommissionRefund] Deducting commission: ₩${commission}`);

            // partner_links 테이블 업데이트: conversionCount -1, revenue -커미션
            await db
              .update(partnerLinks)
              .set({
                conversionCount: sql`GREATEST(${partnerLinks.conversionCount} - 1, 0)`,
                revenue: sql`GREATEST(${partnerLinks.revenue} - ${commission}, 0)`,
                updatedAt: new Date(),
              })
              .where(eq(partnerLinks.id, existingOrder.partnerLinkId));

            console.log(`[CommissionRefund] Successfully deducted commission for linkId: ${existingOrder.partnerLinkId}`);
          }
        } catch (refundError) {
          // 커미션 회수 실패해도 주문 업데이트는 성공 처리
          console.error("[CommissionRefund] Failed to deduct commission:", refundError);
        }
      }

      return NextResponse.json({
        success: true,
        updated: "orders_table",
        order: updatedOrders[0]
      });
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to delete from orders table
    try {
      const deleted = await db.delete(orders).where(eq(orders.id, orderId)).returning();

      if (deleted.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        deleted: "orders_table",
      });
    } catch (orderError) {
      console.log("Order not found in orders table:", orderError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
