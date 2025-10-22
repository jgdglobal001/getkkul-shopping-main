import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      email,
      paymentStatus = "paid",
      status,
    } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order by orderId
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderId: orderId }
        ]
      },
      include: {
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If email is provided, verify it matches the order's user email
    if (email && order.userEmail !== email) {
      return NextResponse.json({ error: "Order not found for this email" }, { status: 404 });
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentStatus,
        ...(status && { status }),
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      message: "Order updated successfully",
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
