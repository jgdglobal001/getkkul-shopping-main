import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch recent orders for analytics
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Calculate analytics data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Monthly revenue data for the past 12 months
    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentYear, currentMonth - index, 1);
      const monthOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      const revenue = monthOrders.reduce(
        (sum: number, order: any) => sum + (order.amount || 0),
        0
      );

      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        revenue: Math.round(revenue),
        orders: monthOrders.length,
      };
    }).reverse();

    // Order status distribution
    const statusDistribution = orders.reduce(
      (acc: Record<string, number>, order: any) => {
        const status = order.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Recent activity (last 10 orders)
    const recentActivity = orders.slice(0, 10).map((order: any) => ({
      id: order.id,
      type: "order",
      description: `Order #${order.id.slice(0, 8)} - ${order.status}`,
      amount: order.amount || 0,
      timestamp: order.createdAt,
      status: order.status || "pending",
    }));

    // Calculate totals
    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + (order.amount || 0),
      0
    );
    const totalOrders = orders.length;

    // This month's data
    const thisMonthOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });
    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum: number, order: any) => sum + (order.amount || 0),
      0
    );

    // Growth calculations (comparing to last month)
    const lastMonthOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        orderDate.getMonth() === lastMonth && orderDate.getFullYear() === year
      );
    });
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum: number, order: any) => sum + (order.amount || 0),
      0
    );

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;
    const orderGrowth =
      lastMonthOrders.length > 0
        ? ((thisMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
          100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue: Math.round(totalRevenue),
          totalOrders,
          monthlyRevenue: Math.round(thisMonthRevenue),
          monthlyOrders: thisMonthOrders.length,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          orderGrowth: Math.round(orderGrowth * 100) / 100,
        },
        monthlyRevenue,
        statusDistribution: Object.entries(statusDistribution).map(
          ([status, count]) => ({
            status,
            count: count as number,
            percentage: Math.round(((count as number) / totalOrders) * 100),
          })
        ),
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
