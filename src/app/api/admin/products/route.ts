import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const where: any = {
      isActive: true, // 활성 상품만
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    // 상품 목록 조회
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalCount,
    });

  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "상품 목록을 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    const body = await request.json();
    
    // 필수 필드 검증
    const requiredFields = ["title", "description", "price", "category", "sku"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} 필드는 필수입니다` },
          { status: 400 }
        );
      }
    }

    // SKU 중복 확인
    const existingProduct = await prisma.product.findUnique({
      where: { sku: body.sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "이미 존재하는 SKU입니다" },
        { status: 400 }
      );
    }

    // 상품 생성
    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        discountPercentage: parseFloat(body.discountPercentage || "0"),
        rating: parseFloat(body.rating || "0"),
        stock: parseInt(body.stock || "0"),
        brand: body.brand || null,
        category: body.category,
        thumbnail: body.thumbnail || "",
        images: body.images || [],
        tags: body.tags || [],
        sku: body.sku,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions || null,
        warrantyInformation: body.warrantyInformation || null,
        shippingInformation: body.shippingInformation || null,
        returnPolicy: body.returnPolicy || null,
        minimumOrderQuantity: parseInt(body.minimumOrderQuantity || "1"),
        availabilityStatus: body.availabilityStatus || "In Stock",
        meta: body.meta || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error("상품 생성 오류:", error);
    return NextResponse.json(
      { error: "상품 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
