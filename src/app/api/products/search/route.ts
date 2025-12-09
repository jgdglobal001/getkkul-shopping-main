export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query.trim()) {
      // 寃?됱뼱 ?놁쑝硫?理쒖떊 ?곹뭹 諛섑솚
      const productList = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.createdAt))
        .limit(limit);
      return NextResponse.json({ products: productList });
    }

    // DB?먯꽌 寃??(?쒕ぉ, ?ㅻ챸, 釉뚮옖?? 移댄뀒怨좊━, SKU)
    const productList = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(
            ilike(products.title, `%${query}%`),
            ilike(products.description, `%${query}%`),
            ilike(products.brand, `%${query}%`),
            ilike(products.category, `%${query}%`),
            ilike(products.sku, `%${query}%`),
            sql`${query} = ANY(${products.tags})`
          )
        )
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return NextResponse.json({ products: productList });
  } catch (error) {
    console.error("寃???ㅻ쪟:", error);
    return NextResponse.json(
      { error: "寃??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

