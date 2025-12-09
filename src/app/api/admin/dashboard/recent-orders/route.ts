export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, users } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // 理쒓렐 二쇰Ц 5媛?媛?몄삤湲?(user ?뺣낫 ?ы븿)
    const recentOrders = await db
      .select({
        id: orders.id,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // 二쇰Ц???녿뒗 寃쎌슦 ?붾? ?곗씠???쒓났
    if (recentOrders.length === 0) {
      const dummyOrders = [
        {
          id: "dummy-1",
          orderId: "ORD-DEMO-001",
          customerName: "源泥좎닔 (?곕え)",
          amount: 89000,
          status: "諛곗넚以?,
          createdAt: new Date().toISOString()
        },
        {
          id: "dummy-2",
          orderId: "ORD-DEMO-002",
          customerName: "?댁쁺??(?곕え)",
          amount: 156000,
          status: "?꾨즺",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "dummy-3",
          orderId: "ORD-DEMO-003",
          customerName: "諛뺣???(?곕え)",
          amount: 234000,
          status: "泥섎━以?,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      return NextResponse.json(dummyOrders);
    }

    // ?묐떟 ?뺤떇??留욊쾶 蹂??
    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      orderId: `ORD-${order.id.slice(-8).toUpperCase()}`,
      customerName: order.userName || order.userEmail || "?????놁쓬",
      amount: order.totalAmount,
      status: getKoreanStatus(order.status || "pending"),
      createdAt: order.createdAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error("理쒓렐 二쇰Ц 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "理쒓렐 二쇰Ц ?곗씠?곕? 媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

// 二쇰Ц ?곹깭瑜??쒓뎅?대줈 蹂??
function getKoreanStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "泥섎━以?,
    processing: "泥섎━以?, 
    shipped: "諛곗넚以?,
    delivered: "?꾨즺",
    completed: "?꾨즺",
    cancelled: "痍⑥냼",
    refunded: "?섎텋"
  };
  
  return statusMap[status] || status;
}
