import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const where: any = {
      isActive: true,
    };

    if (category && category !== "smartphones") {
      where.category = { contains: category, mode: "insensitive" };
    }

    // 상품 목록 조회
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "상품 목록을 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

