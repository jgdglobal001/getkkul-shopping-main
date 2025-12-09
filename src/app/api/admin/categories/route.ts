export const runtime = 'edge';

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
        { error: "관리자 권한???�요?�니?? },
        { status: 403 }
      );
    }

    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order));

    return NextResponse.json(result);
  } catch (error) {
    console.error("카테고리 조회 ?�류:", error);
    return NextResponse.json(
      { error: "카테고리�?조회?�는 �??�류가 발생?�습?�다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한???�요?�니?? },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image, icon, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "카테고리 ?�름�??�러그는 ?�수?�니?? },
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
    console.error("카테고리 ?�성 ?�류:", error);

    // Check for unique constraint violation
    if (error.message?.includes("unique") || error.code === "23505") {
      return NextResponse.json(
        { error: "?��? 존재?�는 카테고리?�니?? },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "카테고리�??�성?�는 �??�류가 발생?�습?�다" },
      { status: 500 }
    );
  }
}

