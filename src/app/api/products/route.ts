export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { eq, desc, ilike, and, count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";

    const offset = (page - 1) * limit;

    // 검??조건 구성
    const conditions = [eq(products.isActive, true)];

    if (category && category !== "smartphones") {
      conditions.push(ilike(products.category, `%${category}%`));
    }

    // ?�품 목록 조회
    const [productList, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(products)
        .where(and(...conditions)),
    ]);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products: productList,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error("?�품 목록 조회 ?�류:", error);
    return NextResponse.json(
      { error: "?�품 목록??가?�오??�??�류가 발생?�습?�다" },
      { status: 500 }
    );
  }
}

