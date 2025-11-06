import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@/lib/prisma";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";

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
    // Use API individual integration keys (not widget keys)
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
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: paymentData.customerName || "Guest Customer",
        },
      });
    }

    // Update or create order
    const order = await prisma.order.upsert({
      where: { orderId },
      update: {
        paymentStatus: PAYMENT_STATUSES.PAID,
        status: ORDER_STATUSES.CONFIRMED,
        paymentMethod: PAYMENT_METHODS.TOSS,
      },
      create: {
        orderId,
        userId: user.id,
        userEmail,
        status: ORDER_STATUSES.CONFIRMED,
        paymentStatus: PAYMENT_STATUSES.PAID,
        paymentMethod: PAYMENT_METHODS.TOSS,
        totalAmount: amount / 100, // Toss sends amount in cents
        shippingAddress: Prisma.JsonNull,
      },
    });

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