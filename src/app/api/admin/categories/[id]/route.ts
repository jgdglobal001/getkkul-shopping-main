export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "移댄뀒怨좊━瑜?李얠쓣 ???놁뒿?덈떎" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("移댄뀒怨좊━ 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜?議고쉶?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
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
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image, icon, order, isActive } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase() }),
        ...(description !== undefined && { description: description || null }),
        ...(image !== undefined && { image: image || null }),
        ...(icon !== undefined && { icon: icon || null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("移댄뀒怨좊━ ?섏젙 ?ㅻ쪟:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "移댄뀒怨좊━瑜?李얠쓣 ???놁뒿?덈떎" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "?대? 議댁옱?섎뒗 移댄뀒怨좊━?낅땲?? },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜??섏젙?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
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
        { error: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲?? },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "移댄뀒怨좊━媛 ??젣?섏뿀?듬땲?? });
  } catch (error: any) {
    console.error("移댄뀒怨좊━ ??젣 ?ㅻ쪟:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "移댄뀒怨좊━瑜?李얠쓣 ???놁뒿?덈떎" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "移댄뀒怨좊━瑜???젣?섎뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

