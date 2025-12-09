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
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order));

    return NextResponse.json(result);
  } catch (error) {
    console.error("移댄뀒怨좊━ 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜?議고쉶?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image, icon, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "移댄뀒怨좊━ ?대쫫怨??щ윭洹몃뒗 ?꾩닔?낅땲?? },
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
    console.error("移댄뀒怨좊━ ?앹꽦 ?ㅻ쪟:", error);

    // Check for unique constraint violation
    if (error.message?.includes("unique") || error.code === "23505") {
      return NextResponse.json(
        { error: "?대? 議댁옱?섎뒗 移댄뀒怨좊━?낅땲?? },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜??앹꽦?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

