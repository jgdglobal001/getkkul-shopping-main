import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 상품의 모든 질문 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId가 필요합니다" },
        { status: 400 }
      );
    }

    const questions = await prisma.productQuestion.findMany({
      where: { productId },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("질문 조회 오류:", error);
    return NextResponse.json(
      { error: "질문 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// POST: 새로운 질문 작성
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, question } = body;

    if (!productId || !question) {
      return NextResponse.json(
        { error: "productId와 question이 필요합니다" },
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 질문 생성
    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId,
        userId: user.id,
        question
      },
      include: {
        user: { select: { name: true } },
        answers: {
          include: { user: { select: { name: true } } }
        }
      }
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("질문 작성 오류:", error);
    return NextResponse.json(
      { error: "질문 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

