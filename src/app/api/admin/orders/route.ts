import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // For now, assume admin access

    // Fetch all users with their orders
    const users = await prisma.user.findMany({
      include: {
        orders: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email || "",
      role: user.role || "user",
      createdAt: user.createdAt.toISOString(),
      orders: user.orders || [],
    }));

    // Also fetch standalone orders from the orders table
    const standaloneOrders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const transformedStandaloneOrders = standaloneOrders.map(order => ({
      id: order.id,
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customerName: order.user?.name || "Unknown User",
      customerEmail: order.user?.email || "",
    }));

    return NextResponse.json(
      {
        users: transformedUsers,
        standaloneOrders: transformedStandaloneOrders,
        totalUsers: transformedUsers.length,
        totalOrders: transformedUsers.reduce((sum, user) => sum + (user.orders?.length || 0), 0) + standaloneOrders.length,
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

    // Try to update order in Prisma orders table
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          ...updateFields,
          updatedAt: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        updated: "orders_table",
        order: updatedOrder
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

    // Try to delete from Prisma orders table
    try {
      await prisma.order.delete({
        where: { id: orderId }
      });

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
