export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, productQuestions, productAnswers, users } from "@/lib/db";
import { eq, desc, asc } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

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

    // Get questions with user info
    const questions = await db
      .select({
        id: productQuestions.id,
        productId: productQuestions.productId,
        userId: productQuestions.userId,
        question: productQuestions.question,
        isAnswered: productQuestions.isAnswered,
        createdAt: productQuestions.createdAt,
        updatedAt: productQuestions.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(productQuestions)
      .leftJoin(users, eq(productQuestions.userId, users.id))
      .where(eq(productQuestions.productId, productId))
      .orderBy(desc(productQuestions.createdAt));

    // Get answers for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answers = await db
          .select({
            id: productAnswers.id,
            answer: productAnswers.answer,
            createdAt: productAnswers.createdAt,
            userName: users.name,
            userEmail: users.email,
          })
          .from(productAnswers)
          .leftJoin(users, eq(productAnswers.userId, users.id))
          .where(eq(productAnswers.questionId, q.id))
          .orderBy(asc(productAnswers.createdAt));

        return {
          ...q,
          user: { name: q.userName, email: q.userEmail },
          answers: answers.map((a) => ({
            ...a,
            user: { name: a.userName, email: a.userEmail },
          })),
        };
      })
    );

    return NextResponse.json(questionsWithAnswers);
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
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 질문 생성
    const newQuestion = await db
      .insert(productQuestions)
      .values({
        id: generateId(),
        productId,
        userId: user.id,
        question,
        isAnswered: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        ...newQuestion[0],
        user: { name: user.name },
        answers: [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("질문 작성 오류:", error);
    return NextResponse.json(
      { error: "질문 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

