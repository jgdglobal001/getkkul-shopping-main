export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: 吏덈Ц???듬? ?묒꽦
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const questionId = await Promise.resolve(params.id);
    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return NextResponse.json(
        { error: "?듬? ?댁슜???꾩슂?⑸땲?? },
        { status: 400 }
      );
    }

    // 愿由ъ옄 ?ъ슜??議고쉶
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "愿由ъ옄瑜?李얠쓣 ???놁뒿?덈떎" },
        { status: 404 }
      );
    }

    // ?듬? ?앹꽦
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

    // 吏덈Ц??isAnswered ?곹깭 ?낅뜲?댄듃
    await prisma.productQuestion.update({
      where: { id: questionId },
      data: { isAnswered: true }
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error("?듬? ?묒꽦 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?듬? ?묒꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

// DELETE: ?듬? ??젣
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const answerId = await Promise.resolve(params.id);

    // ?듬? ??젣
    await prisma.productAnswer.delete({
      where: { id: answerId }
    });

    return NextResponse.json({ message: "?듬?????젣?섏뿀?듬땲?? });
  } catch (error) {
    console.error("?듬? ??젣 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?듬? ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

