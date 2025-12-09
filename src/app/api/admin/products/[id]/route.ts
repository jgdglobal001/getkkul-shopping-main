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
        { error: "?곹뭹??李얠쓣 ???놁뒿?덈떎" },
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
    console.error("?곹뭹 議고쉶 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?곹뭹 議고쉶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
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

    // ?곹뭹 議댁옱 ?뺤씤
    const existingResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
    const existingProduct = existingResult[0];

    if (!existingProduct) {
      return NextResponse.json(
        { error: "?곹뭹??李얠쓣 ???놁뒿?덈떎" },
        { status: 404 }
      );
    }

    // SKU 以묐났 ?뺤씤 (?먯떊 ?쒖쇅)
    if (body.sku && body.sku !== existingProduct.sku) {
      const duplicateResult = await db.select().from(products).where(eq(products.sku, body.sku)).limit(1);
      if (duplicateResult[0]) {
        return NextResponse.json(
          { error: "?대? 議댁옱?섎뒗 SKU?낅땲?? },
          { status: 400 }
        );
      }
    }

    // 湲곗〈 ?듭뀡怨?variants ??젣 (hasOptions媛 蹂寃쎈릺?덇굅???듭뀡???덈뒗 寃쎌슦)
    if (body.hasOptions !== undefined) {
      await db.delete(productOptions).where(eq(productOptions.productId, id));
      await db.delete(productVariants).where(eq(productVariants.productId, id));
    }

    // ?곹뭹 ?낅뜲?댄듃
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
      tags: body.tags || existingProduct.tags,
      sku: body.sku || existingProduct.sku,
      isActive: body.isActive !== undefined ? body.isActive : existingProduct.isActive,
      hasOptions: body.hasOptions !== undefined ? body.hasOptions : existingProduct.hasOptions,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    // ???듭뀡 ?앹꽦
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

    // ??variants ?앹꽦
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

    // ?낅뜲?댄듃???곹뭹 議고쉶 (?듭뀡 ?ы븿)
    const updatedProduct = await db.select().from(products).where(eq(products.id, id)).limit(1);
    const options = await db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.order));
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));

    return NextResponse.json({
      ...updatedProduct[0],
      options,
      variants: variants.filter(v => v.isActive),
    });

  } catch (error) {
    console.error("?곹뭹 ?섏젙 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?곹뭹 ?섏젙 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: "?곹뭹????젣?섏뿀?듬땲?? });
  } catch (error) {
    console.error("?곹뭹 ??젣 ?ㅻ쪟:", error);
    return NextResponse.json(
      { error: "?곹뭹 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎" },
      { status: 500 }
    );
  }
}
