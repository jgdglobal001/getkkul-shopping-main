import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query.trim()) {
      // 검색어 없으면 최신 상품 반환
      const products = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return NextResponse.json({ products });
    }

    // DB에서 검색 (제목, 설명, 브랜드, 카테고리, 태그)
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("검색 오류:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

