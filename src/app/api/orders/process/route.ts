import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email } = await request.json();

    if (!sessionId || !email) {
      return NextResponse.json(
        { success: false, error: "Session ID and email are required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find user in Firestore first
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if order already exists to prevent duplicates
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        orderId: sessionId
      }
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already processed",
        order: {
          id: existingOrder.orderId,
          amount: existingOrder.totalAmount,
          status: existingOrder.status,
          items: 0, // Will be updated with actual count if needed
        },
      });
    }

    // Extract order information with enhanced details
    let shippingAddress = null;
    if (session.metadata?.shippingAddress) {
      try {
        shippingAddress = JSON.parse(session.metadata.shippingAddress);
      } catch (e) {
        console.warn("Failed to parse shipping address from metadata:", e);
      }
    } else {
      console.warn("No shipping address found in session metadata");
    }

    const orderData = {
      id: sessionId,
      orderId: `ORD-${Date.now()}`,
      amount: session.amount_total
        ? (session.amount_total / 100).toFixed(2)
        : "0.00",
      currency: session.currency || "usd",
      status: "confirmed",
      paymentStatus: session.payment_status,
      paymentMethod: "card",
      customerEmail: session.customer_details?.email || email,
      customerName: session.customer_details?.name || "",
      shippingAddress: shippingAddress,
      billingAddress: session.customer_details?.address || null,
      items:
        session.line_items?.data?.map((item: any) => ({
          id:
            item.price?.product?.metadata?.productId ||
            item.price?.product?.id ||
            "",
          name: item.price?.product?.name || "",
          description: item.price?.product?.description || "",
          images: item.price?.product?.images || [],
          quantity: item.quantity,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total: item.amount_total ? item.amount_total / 100 : 0,
          category: item.price?.product?.metadata?.category || "",
          originalPrice: item.price?.product?.metadata?.originalPrice || "",
          discountPercentage:
            item.price?.product?.metadata?.discountPercentage || "0",
        })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create order in Prisma
    const order = await prisma.order.create({
      data: {
        orderId: orderData.orderId,
        userId: user.id,
        userEmail: email,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        paymentMethod: orderData.paymentMethod,
        totalAmount: parseFloat(orderData.amount),
        shippingAddress: orderData.shippingAddress ? JSON.stringify(orderData.shippingAddress) : null,
        orderItems: {
          create: orderData.items.map((item: any) => ({
            productId: item.id || "",
            title: item.name || "",
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.images?.[0] || "",
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      order: {
        id: order.orderId,
        amount: order.totalAmount,
        status: order.status,
        items: order.orderItems.length,
      },
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
