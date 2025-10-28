import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 모든 고객 문의 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const isAnswered = searchParams.get("isAnswered");

    const where: any = {};
    if (productId) where.productId = productId;
    if (isAnswered !== null) where.isAnswered = isAnswered === "true";

    const inquiries = await prisma.productQuestion.findMany({
      where,
      include: {
        product: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
        answers: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("문의 조회 오류:", error);
    return NextResponse.json(
      { error: "문의 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

