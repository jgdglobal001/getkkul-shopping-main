export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../../auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    const category = result[0];

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    return NextResponse.json(
      { error: "카테고리를 조회하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image, icon, order, isActive } = body;

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase();
    if (description !== undefined) updateData.description = description || null;
    if (image !== undefined) updateData.image = image || null;
    if (icon !== undefined) updateData.icon = icon || null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    const category = result[0];

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("카테고리 수정 오류:", error);

    if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
      return NextResponse.json(
        { error: "이미 존재하는 카테고리입니다" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "카테고리를 수정하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "카테고리가 삭제되었습니다" });
  } catch (error: any) {
    console.error("카테고리 삭제 오류:", error);

    return NextResponse.json(
      { error: "카테고리를 삭제하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

