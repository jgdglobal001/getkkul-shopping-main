export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: 질문에 답변 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const questionId = await Promise.resolve(params.id);
    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return NextResponse.json(
        { error: "답변 내용이 필요합니다" },
        { status: 400 }
      );
    }

    // 관리자 사용자 조회
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "관리자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 답변 생성
    const newAnswer = await prisma.productAnswer.create({
      data: {
        questionId,
        userId: adminUser.id,
        answer
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    // 질문의 isAnswered 상태 업데이트
    await prisma.productQuestion.update({
      where: { id: questionId },
      data: { isAnswered: true }
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error("답변 작성 오류:", error);
    return NextResponse.json(
      { error: "답변 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 답변 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const answerId = await Promise.resolve(params.id);

    // 답변 삭제
    await prisma.productAnswer.delete({
      where: { id: answerId }
    });

    return NextResponse.json({ message: "답변이 삭제되었습니다" });
  } catch (error) {
    console.error("답변 삭제 오류:", error);
    return NextResponse.json(
      { error: "답변 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

