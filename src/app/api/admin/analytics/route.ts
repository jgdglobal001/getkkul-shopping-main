import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db, users, orders } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    const user = userResult[0];

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
    const ordersResult = await db
      .select({
        order: orders,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    const ordersData = ordersResult.map(r => ({
      ...r.order,
      user: { name: r.userName, email: r.userEmail }
    }));

    // Calculate analytics data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Monthly revenue data for the past 12 months
    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentYear, currentMonth - index, 1);
      const monthOrders = ordersData.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      const revenue = monthOrders.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
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
    const statusDistribution = ordersData.reduce(
      (acc: Record<string, number>, order: any) => {
        const status = order.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Recent activity (last 10 orders)
    const recentActivity = ordersData.slice(0, 10).map((order: any) => ({
      id: order.id,
      type: "order",
      description: `Order #${order.id.slice(0, 8)} - ${order.status}`,
      amount: order.totalAmount || 0,
      timestamp: order.createdAt,
      status: order.status || "pending",
    }));

    // Calculate totals
    const totalRevenue = ordersData.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    );
    const totalOrders = ordersData.length;

    // This month's data
    const thisMonthOrders = ordersData.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });
    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    );

    // Growth calculations (comparing to last month)
    const lastMonthOrders = ordersData.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        orderDate.getMonth() === lastMonth && orderDate.getFullYear() === year
      );
    });
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
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
