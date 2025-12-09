export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, productQuestions, productAnswers, products, users } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";

// GET: 紐⑤뱺 怨좉컼 臾몄쓽 議고쉶 (愿由ъ옄??
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    // Build query conditions
    const conditions = productId ? eq(productQuestions.productId, productId) : undefined;

    const questionsResult = await db
      .select({
        id: productQuestions.id,
        content: productQuestions.content,
        isSecret: productQuestions.isSecret,
        createdAt: productQuestions.createdAt,
        productId: productQuestions.productId,
        productTitle: products.title,
        userId: productQuestions.userId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(productQuestions)
      .leftJoin(products, eq(productQuestions.productId, products.id))
      .leftJoin(users, eq(productQuestions.userId, users.id))
      .where(conditions)
      .orderBy(desc(productQuestions.createdAt));

    // Get answers for each question
    const inquiries = await Promise.all(
      questionsResult.map(async (q) => {
        const answersResult = await db
          .select({
            id: productAnswers.id,
            content: productAnswers.content,
            createdAt: productAnswers.createdAt,
            userId: productAnswers.userId,
            userName: users.name,
            userEmail: users.email,
          })
          .from(productAnswers)
          .leftJoin(users, eq(productAnswers.userId, users.id))
          .where(eq(productAnswers.questionId, q.id))
          .orderBy(desc(productAnswers.createdAt));

        return {
          id: q.id,
          content: q.content,
          isSecret: q.isSecret,
          createdAt: q.createdAt,
          product: { id: q.productId, title: q.productTitle },
          user: { id: q.userId, name: q.userName, email: q.userEmail },
          answers: answersResult.map(a => ({
            id: a.id,
            content: a.content,
            createdAt: a.createdAt,
            user: { id: a.userId, name: a.userName, email: a.userEmail }
          }))
        };
      })
    );

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("臾몄쓽 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "臾몄쓽 議고쉶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

