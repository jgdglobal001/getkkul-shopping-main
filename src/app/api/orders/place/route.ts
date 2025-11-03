import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const { customerEmail, items, totalAmount, shippingAddress, status = "pending" } = orderData;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create the order in Prisma
    const order = await prisma.order.create({
      data: {
        orderId: orderId,
        userId: user.id,
        status: status,
        paymentStatus: "pending",
        paymentMethod: "online",
        totalAmount: parseFloat(totalAmount) || 0,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        orderItems: {
          create: items?.map((item: any) => ({
            productId: item.productId || item.id || "",
            title: item.title || item.name || "",
            quantity: item.quantity || 1,
            price: item.price || 0,
            total: (item.total || item.price * item.quantity) || 0,
            image: item.image || "",
          })) || []
        }
      },
      include: {
        orderItems: true
      }
    });

    return NextResponse.json({
      message: "Order placed successfully",
      success: true,
      orderId: orderId,
      order: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
