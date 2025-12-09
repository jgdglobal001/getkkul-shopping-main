export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, users, productAnswers, productQuestions } from "@/lib/db";
import { eq } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

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
    const adminUserResult = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    const adminUser = adminUserResult[0];

    if (!adminUser) {
      return NextResponse.json(
        { error: "관리자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 답변 생성
    const newAnswerResult = await db
      .insert(productAnswers)
      .values({
        id: generateId(),
        questionId,
        userId: adminUser.id,
        answer,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const newAnswer = newAnswerResult[0];

    // 질문의 isAnswered 상태 업데이트
    await db
      .update(productQuestions)
      .set({ isAnswered: true, updatedAt: new Date() })
      .where(eq(productQuestions.id, questionId));

    return NextResponse.json({
      ...newAnswer,
      user: { id: adminUser.id, name: adminUser.name, email: adminUser.email }
    }, { status: 201 });
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
    await db
      .delete(productAnswers)
      .where(eq(productAnswers.id, answerId));

    return NextResponse.json({ message: "답변이 삭제되었습니다" });
  } catch (error) {
    console.error("답변 삭제 오류:", error);
    return NextResponse.json(
      { error: "답변 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

