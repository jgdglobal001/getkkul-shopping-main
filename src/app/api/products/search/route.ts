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
      // 검?�어 ?�으�?최신 ?�품 반환
      const productList = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.createdAt))
        .limit(limit);
      return NextResponse.json({ products: productList });
    }

    // DB?�서 검??(?�목, ?�명, 브랜?? 카테고리, SKU)
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
    console.error("검???�류:", error);
    return NextResponse.json(
      { error: "검??�??�류가 발생?�습?�다" },
      { status: 500 }
    );
  }
}

