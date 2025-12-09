export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, orders, users } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // ìµœê·¼ ì£¼ë¬¸ 5ê°?ê°€?¸ì˜¤ê¸?(user ?•ë³´ ?¬í•¨)
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

    // ì£¼ë¬¸???†ëŠ” ê²½ìš° ?”ë? ?°ì´???œê³µ
    if (recentOrders.length === 0) {
      const dummyOrders = [
        {
          id: "dummy-1",
          orderId: "ORD-DEMO-001",
          customerName: "ê¹€ì² ìˆ˜ (?°ëª¨)",
          amount: 89000,
          status: "ë°°ì†¡ì¤?,
          createdAt: new Date().toISOString()
        },
        {
          id: "dummy-2",
          orderId: "ORD-DEMO-002",
          customerName: "?´ì˜??(?°ëª¨)",
          amount: 156000,
          status: "?„ë£Œ",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "dummy-3",
          orderId: "ORD-DEMO-003",
          customerName: "ë°•ë???(?°ëª¨)",
          amount: 234000,
          status: "ì²˜ë¦¬ì¤?,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      return NextResponse.json(dummyOrders);
    }

    // ?‘ë‹µ ?•ì‹??ë§ê²Œ ë³€??
    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      orderId: `ORD-${order.id.slice(-8).toUpperCase()}`,
      customerName: order.userName || order.userEmail || "?????†ìŒ",
      amount: order.totalAmount,
      status: getKoreanStatus(order.status || "pending"),
      createdAt: order.createdAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error("ìµœê·¼ ì£¼ë¬¸ ì¡°íšŒ ?¤ë¥˜:", error);
    return NextResponse.json(
      { error: "ìµœê·¼ ì£¼ë¬¸ ?°ì´?°ë? ê°€?¸ì˜¤??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤" },
      { status: 500 }
    );
  }
}

// ì£¼ë¬¸ ?íƒœë¥??œêµ­?´ë¡œ ë³€??
function getKoreanStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    pending: "ì²˜ë¦¬ì¤?,
    processing: "ì²˜ë¦¬ì¤?, 
    shipped: "ë°°ì†¡ì¤?,
    delivered: "?„ë£Œ",
    completed: "?„ë£Œ",
    cancelled: "ì·¨ì†Œ",
    refunded: "?˜ë¶ˆ"
  };
  
  return statusMap[status] || status;
}
