import { NextRequest, NextResponse } from "next/server";
import { db, users, orders } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentKey, amount, userEmail } = await request.json();

    if (!orderId || !paymentKey || !amount || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: orderId, paymentKey, amount, userEmail",
        },
        { status: 400 }
      );
    }

    // Verify payment with Toss API
    const clientKey = process.env.TOSS_CLIENT_KEY;
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!clientKey || !secretKey) {
      console.error("Toss API keys not configured:", {
        clientKey: !!clientKey,
        secretKey: !!secretKey,
      });
      return NextResponse.json(
        { success: false, error: "Toss API keys not configured" },
        { status: 500 }
      );
    }

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error("Toss payment verification failed:", errorData);
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paymentData = await tossResponse.json();

    // Find or create user
    let userResult = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    let user = userResult[0];

    if (!user) {
      const newUser = await db.insert(users).values({
        id: generateId(),
        email: userEmail,
        name: paymentData.customerName || "Guest Customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      user = newUser[0];
    }

    // Check if order exists
    const existingOrder = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);

    let order;
    if (existingOrder.length > 0) {
      // Update existing order
      const updated = await db
        .update(orders)
        .set({
          paymentStatus: PAYMENT_STATUSES.PAID,
          status: ORDER_STATUSES.CONFIRMED,
          paymentMethod: PAYMENT_METHODS.TOSS,
          updatedAt: new Date(),
        })
        .where(eq(orders.orderId, orderId))
        .returning();
      order = updated[0];
    } else {
      // Create new order
      const created = await db.insert(orders).values({
        id: generateId(),
        orderId,
        userId: user.id,
        userEmail,
        status: ORDER_STATUSES.CONFIRMED,
        paymentStatus: PAYMENT_STATUSES.PAID,
        paymentMethod: PAYMENT_METHODS.TOSS,
        totalAmount: amount / 100, // Toss sends amount in cents
        shippingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      order = created[0];
    }

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully",
      order: {
        id: order.orderId,
        amount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Toss confirm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}