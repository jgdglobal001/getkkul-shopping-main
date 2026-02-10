export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db, users, orders, orderItems } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";

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
      .limit(1000); // Increased limit for better analytics

    const ordersData = ordersResult.map(r => ({
      ...r.order,
      user: { name: r.userName, email: r.userEmail }
    }));

    // Fetch all users for user stats
    const allUsers = await db.select({ createdAt: users.createdAt }).from(users);
    const totalUsers = allUsers.length;

    // Fetch top products
    const topProductsResult = await db
      .select({
        name: orderItems.title,
        quantity: sql<number>`sum(${orderItems.quantity})`,
        revenue: sql<number>`sum(${orderItems.total})`
      })
      .from(orderItems)
      .groupBy(orderItems.title)
      .orderBy(desc(sql`sum(${orderItems.total})`))
      .limit(5);

    const topProducts = topProductsResult.map(item => ({
      name: item.name,
      sales: Number(item.quantity) || 0,
      revenue: Number(item.revenue) || 0
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
        month: date.toISOString(),
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

    // Calculate totals
    const totalRevenue = ordersData.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    );
    const totalOrders = ordersData.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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

    // Last month's data
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthOrders = ordersData.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
      );
    });
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    );

    // Growth calculations
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const ordersGrowth =
      lastMonthOrders.length > 0
        ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0;

    // User growth
    const thisMonthUsers = allUsers.filter(u => {
      return u.createdAt && u.createdAt.getMonth() === currentMonth && u.createdAt.getFullYear() === currentYear;
    }).length;

    const lastMonthUsers = allUsers.filter(u => {
      return u.createdAt && u.createdAt.getMonth() === lastMonth && u.createdAt.getFullYear() === lastMonthYear;
    }).length;

    const usersGrowth = lastMonthUsers > 0
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : 0;

    const ordersByStatus = Object.entries(statusDistribution).map(
      ([status, count]) => ({
        status,
        count: count as number,
        percentage: totalOrders > 0 ? ((count as number) / totalOrders) * 100 : 0,
      })
    );

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      averageOrderValue,
      revenueGrowth,
      ordersGrowth,
      usersGrowth,
      monthlyRevenue,
      topProducts,
      ordersByStatus
    });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
