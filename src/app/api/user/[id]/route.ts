export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { fetchUserFromPrisma } from "@/lib/prisma/userService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ?ъ슜?먮뒗 ?먯떊???곗씠?곕쭔 議고쉶?????덉쓬
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await fetchUserFromPrisma(id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
