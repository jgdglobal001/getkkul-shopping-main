export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Cancel a pending order (before payment is completed)
 * This is used when user closes the payment modal without completing payment
 * FIX 3: Prevents accumulation of pending orders in the database
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "인증이 필요합니다" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "주문 ID가 필요합니다" },
        { status: 400 }
      );
    }

    console.log(`[CancelPending] Processing cancel for orderId: ${orderId}, user: ${session.user.email}`);

    // 1. Find user by email first
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json(
        { success: false, error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 2. Find the order and verify ownership
    const orderResult = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.orderId, orderId),
          eq(orders.userId, user.id)
        )
      )
      .limit(1);

    const order = orderResult[0];

    if (!order) {
      console.log(`[CancelPending] Order not found: ${orderId}`);
      return NextResponse.json(
        { success: false, error: "주문을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 3. Only allow cancellation of pending orders (not yet paid)
    if (order.paymentStatus !== "pending") {
      console.log(`[CancelPending] Order ${orderId} is not pending (status: ${order.paymentStatus})`);
      return NextResponse.json(
        { success: false, error: "대기 중인 주문만 취소할 수 있습니다" },
        { status: 400 }
      );
    }

    // 4. Delete order items first (foreign key constraint)
    await db
      .delete(orderItems)
      .where(eq(orderItems.orderId, order.id));

    console.log(`[CancelPending] Deleted order items for order: ${order.id}`);

    // 5. Delete the pending order
    await db
      .delete(orders)
      .where(eq(orders.id, order.id));

    console.log(`[CancelPending] Deleted pending order: ${orderId}`);

    return NextResponse.json({
      success: true,
      message: "대기 중인 주문이 취소되었습니다",
      orderId: orderId,
    });

  } catch (error) {
    console.error("[CancelPending] Error:", error);
    return NextResponse.json(
      { success: false, error: "주문 취소 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

