import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch real data from Prisma
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.count({
        where: { status: "pending" }
      }),
      prisma.order.count({
        where: { status: "completed" }
      }),
      prisma.order.aggregate({
        where: { status: "completed" },
        _sum: { totalAmount: true }
      })
    ]);

    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      pendingOrders,
      completedOrders,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
