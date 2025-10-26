import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다" },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
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

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase(),
        description: description || null,
        image: image || null,
        icon: icon || null,
        order: order || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("카테고리 생성 오류:", error);
    
    if (error.code === "P2002") {
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

