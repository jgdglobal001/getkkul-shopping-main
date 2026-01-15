export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const { customerEmail, items, totalAmount, shippingAddress, status = "pending", partnerRef, partnerLinkId } = orderData;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, customerEmail))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate unique IDs
    const newOrderId = generateId();
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create the order in Drizzle
    const newOrder = await db
      .insert(orders)
      .values({
        id: newOrderId,
        orderId: orderId,
        userId: user.id,
        status: status,
        paymentStatus: "pending",
        paymentMethod: "online",
        totalAmount: parseFloat(totalAmount) || 0,
        shippingAddress: shippingAddress || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        // 파트너 정보 (겟꿀 파트너스 지급대행용)
        partnerRef: partnerRef || null,
        partnerLinkId: partnerLinkId || null,
      })
      .returning();

    // Create order items
    const orderItemsData = items?.map((item: any) => ({
      id: generateId(),
      orderId: newOrderId,
      productId: item.productId || item.id || "",
      title: item.title || item.name || "",
      quantity: item.quantity || 1,
      price: item.price || 0,
      total: (item.total || item.price * item.quantity) || 0,
      image: item.image || "",
    })) || [];

    if (orderItemsData.length > 0) {
      await db.insert(orderItems).values(orderItemsData);
    }

    return NextResponse.json({
      message: "Order placed successfully",
      success: true,
      orderId: orderId,
      order: newOrder[0],
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

