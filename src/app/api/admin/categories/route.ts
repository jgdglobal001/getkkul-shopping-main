import { NextRequest, NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { asc } from "drizzle-orm";
import { auth } from "../../../../../auth";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order));

    return NextResponse.json(result);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    return NextResponse.json(
      { error: "카테고리를 조회하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image, icon, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "카테고리 이름과 슬러그는 필수입니다" },
        { status: 400 }
      );
    }

    const category = await db
      .insert(categories)
      .values({
        id: generateId(),
        name,
        slug: slug.toLowerCase(),
        description: description || null,
        image: image || null,
        icon: icon || null,
        order: order || 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(category[0], { status: 201 });
  } catch (error: any) {
    console.error("카테고리 생성 오류:", error);

    // Check for unique constraint violation
    if (error.message?.includes("unique") || error.code === "23505") {
      return NextResponse.json(
        { error: "이미 존재하는 카테고리입니다" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "카테고리를 생성하는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

