export const runtime = 'edge';

import { NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { eq, asc } from "drizzle-orm";

export const revalidate = 0; // Disable caching for this route

export async function GET() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        icon: categories.icon,
        order: categories.order,
        isActive: categories.isActive,
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.order));

    const response = NextResponse.json(result);
    // Explicitly prevent caching at all levels
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error("移댄뀒怨좊━ 議고쉶 ?ㅻ쪟:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜?議고쉶?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎", details: errorMessage },
      { status: 500 }
    );
  }
}