export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, products, productOptions, productVariants, cartItems, wishlistItems, orderItems } from "@/lib/db";
import { eq, asc } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const productResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
    const product = productResult[0];

    if (!product) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // Get related data
    const [options, variants, cart, wishlist, orderItemsList] = await Promise.all([
      db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.order)),
      db.select().from(productVariants).where(eq(productVariants.productId, id)).orderBy(asc(productVariants.createdAt)),
      db.select({ id: cartItems.id, quantity: cartItems.quantity, userId: cartItems.userId }).from(cartItems).where(eq(cartItems.productId, id)),
      db.select({ id: wishlistItems.id, userId: wishlistItems.userId }).from(wishlistItems).where(eq(wishlistItems.productId, id)),
      db.select({ id: orderItems.id, quantity: orderItems.quantity, orderId: orderItems.orderId }).from(orderItems).where(eq(orderItems.productId, id)),
    ]);

    return NextResponse.json({
      ...product,
      options,
      variants: variants.filter(v => v.isActive),
      cartItems: cart,
      wishlistItems: wishlist,
      orderItems: orderItemsList,
    });

  } catch (error) {
    console.error("상품 조회 오류:", error);
    return NextResponse.json(
      { error: "상품 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 상품 존재 확인
    const existingResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
    const existingProduct = existingResult[0];

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // SKU 중복 확인 (자신 제외)
    if (body.sku && body.sku !== existingProduct.sku) {
      const duplicateResult = await db.select().from(products).where(eq(products.sku, body.sku)).limit(1);
      if (duplicateResult[0]) {
        return NextResponse.json(
          { error: "이미 존재하는 SKU입니다" },
          { status: 400 }
        );
      }
    }

    // 기존 옵션과 variants 삭제 (hasOptions가 변경되었거나 옵션이 있는 경우)
    if (body.hasOptions !== undefined) {
      await db.delete(productOptions).where(eq(productOptions.productId, id));
      await db.delete(productVariants).where(eq(productVariants.productId, id));
    }

    // 상품 업데이트
    await db.update(products).set({
      title: body.title || existingProduct.title,
      description: body.description || existingProduct.description,
      price: body.price !== undefined ? parseFloat(body.price) : existingProduct.price,
      discountPercentage: body.discountPercentage !== undefined ? parseFloat(body.discountPercentage) : existingProduct.discountPercentage,
      rating: body.rating !== undefined ? parseFloat(body.rating) : existingProduct.rating,
      stock: body.stock !== undefined ? parseInt(body.stock) : existingProduct.stock,
      brand: body.brand !== undefined ? body.brand : existingProduct.brand,
      category: body.category || existingProduct.category,
      thumbnail: body.thumbnail || existingProduct.thumbnail,
      images: body.images || existingProduct.images,
      detailImages: body.detailImages || existingProduct.detailImages,
      tags: body.tags || existingProduct.tags,
      sku: body.sku || existingProduct.sku,
      isActive: body.isActive !== undefined ? body.isActive : existingProduct.isActive,
      hasOptions: body.hasOptions !== undefined ? body.hasOptions : existingProduct.hasOptions,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    // 새 옵션 생성
    if (body.hasOptions && body.options?.length > 0) {
      for (let i = 0; i < body.options.length; i++) {
        const opt = body.options[i];
        await db.insert(productOptions).values({
          id: generateId(),
          productId: id,
          name: opt.name,
          values: opt.values || [],
          order: i,
        });
      }
    }

    // 새 variants 생성
    if (body.hasOptions && body.variants?.length > 0) {
      for (const v of body.variants) {
        await db.insert(productVariants).values({
          id: generateId(),
          productId: id,
          optionCombination: v.optionCombination,
          sku: v.sku || null,
          price: parseFloat(v.price),
          originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : null,
          stock: parseInt(v.stock) || 0,
          isActive: v.isActive !== undefined ? v.isActive : true,
          image: v.image || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 업데이트된 상품 조회 (옵션 포함)
    const updatedProduct = await db.select().from(products).where(eq(products.id, id)).limit(1);
    const options = await db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.order));
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));

    return NextResponse.json({
      ...updatedProduct[0],
      options,
      variants: variants.filter(v => v.isActive),
    });

  } catch (error) {
    console.error("상품 수정 오류:", error);
    return NextResponse.json(
      { error: "상품 수정 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: "상품이 삭제되었습니다" });
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    return NextResponse.json(
      { error: "상품 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
