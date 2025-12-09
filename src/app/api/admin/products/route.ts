import { NextRequest, NextResponse } from "next/server";
import { db, products, productOptions, productVariants } from "@/lib/db";
import { eq, desc, ilike, and, or, count } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [eq(products.isActive, true)];

    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.brand, `%${search}%`)
        )!
      );
    }

    if (category) {
      conditions.push(ilike(products.category, `%${category}%`));
    }

    // 상품 목록 조회
    const [productList, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(products)
        .where(and(...conditions)),
    ]);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products: productList,
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
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.sku, body.sku))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: "이미 존재하는 SKU입니다" },
        { status: 400 }
      );
    }

    const productId = generateId();

    // 상품 생성
    const newProduct = await db
      .insert(products)
      .values({
        id: productId,
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
        detailImages: body.detailImages || [],
        tags: body.tags || [],
        sku: body.sku,
        meta: body.meta || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        minimumOrderQuantity: body.minimumOrderQuantity ? parseInt(body.minimumOrderQuantity) : 1,
        availabilityStatus: body.availabilityStatus || "In Stock",
        hasOptions: body.hasOptions || false,
        productName: body.productName || null,
        modelNumber: body.modelNumber || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 옵션 생성
    if (body.hasOptions && body.options?.length > 0) {
      await db.insert(productOptions).values(
        body.options.map((opt: any, index: number) => ({
          id: generateId(),
          productId,
          name: opt.name,
          values: opt.values || [],
          order: index,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }

    // variants 생성
    if (body.hasOptions && body.variants?.length > 0) {
      await db.insert(productVariants).values(
        body.variants.map((v: any) => ({
          id: generateId(),
          productId,
          optionCombination: v.optionCombination,
          sku: v.sku || null,
          price: parseFloat(v.price),
          originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : null,
          stock: parseInt(v.stock) || 0,
          isActive: v.isActive !== undefined ? v.isActive : true,
          image: v.image || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }

    return NextResponse.json(newProduct[0], { status: 201 });

  } catch (error) {
    console.error("상품 생성 오류:", error);
    return NextResponse.json(
      { error: "상품 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
