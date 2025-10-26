import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: {
          select: { id: true, quantity: true, userId: true },
        },
        wishlistItems: {
          select: { id: true, userId: true },
        },
        orderItems: {
          select: { id: true, quantity: true, orderId: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error("상품 조회 오류:", error);
    return NextResponse.json(
      { error: "상품 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    const { id } = await params;
    const body = await request.json();

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // SKU 중복 확인 (자신 제외)
    if (body.sku && body.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findUnique({
        where: { sku: body.sku },
      });

      if (duplicateSku) {
        return NextResponse.json(
          { error: "이미 존재하는 SKU입니다" },
          { status: 400 }
        );
      }
    }

    // 상품 업데이트
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
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
        meta: body.meta !== undefined ? body.meta : existingProduct.meta,
        isActive: body.isActive !== undefined ? body.isActive : existingProduct.isActive,
        // ⭐ 필수 표기 정보
        productName: body.productName !== undefined ? body.productName : existingProduct.productName,
        modelNumber: body.modelNumber !== undefined ? body.modelNumber : existingProduct.modelNumber,
        size: body.size !== undefined ? body.size : existingProduct.size,
        material: body.material !== undefined ? body.material : existingProduct.material,
        releaseDate: body.releaseDate !== undefined ? body.releaseDate : existingProduct.releaseDate,
        manufacturer: body.manufacturer !== undefined ? body.manufacturer : existingProduct.manufacturer,
        madeInCountry: body.madeInCountry !== undefined ? body.madeInCountry : existingProduct.madeInCountry,
        warrantyStandard: body.warrantyStandard !== undefined ? body.warrantyStandard : existingProduct.warrantyStandard,
        asResponsible: body.asResponsible !== undefined ? body.asResponsible : existingProduct.asResponsible,
        kcCertification: body.kcCertification !== undefined ? body.kcCertification : existingProduct.kcCertification,
        color: body.color !== undefined ? body.color : existingProduct.color,
        productComposition: body.productComposition !== undefined ? body.productComposition : existingProduct.productComposition,
        detailedSpecs: body.detailedSpecs !== undefined ? body.detailedSpecs : existingProduct.detailedSpecs,
        // ⭐ 배송 정보
        shippingMethod: body.shippingMethod !== undefined ? body.shippingMethod : existingProduct.shippingMethod,
        shippingCost: body.shippingCost !== undefined ? body.shippingCost : existingProduct.shippingCost,
        bundleShipping: body.bundleShipping !== undefined ? body.bundleShipping : existingProduct.bundleShipping,
        shippingPeriod: body.shippingPeriod !== undefined ? body.shippingPeriod : existingProduct.shippingPeriod,
        // ⭐ 교환/반품 정보
        exchangeReturnCost: body.exchangeReturnCost !== undefined ? body.exchangeReturnCost : existingProduct.exchangeReturnCost,
        exchangeReturnDeadline: body.exchangeReturnDeadline !== undefined ? body.exchangeReturnDeadline : existingProduct.exchangeReturnDeadline,
        exchangeReturnLimitations: body.exchangeReturnLimitations !== undefined ? body.exchangeReturnLimitations : existingProduct.exchangeReturnLimitations,
        clothingLimitations: body.clothingLimitations !== undefined ? body.clothingLimitations : existingProduct.clothingLimitations,
        foodLimitations: body.foodLimitations !== undefined ? body.foodLimitations : existingProduct.foodLimitations,
        electronicsLimitations: body.electronicsLimitations !== undefined ? body.electronicsLimitations : existingProduct.electronicsLimitations,
        autoLimitations: body.autoLimitations !== undefined ? body.autoLimitations : existingProduct.autoLimitations,
        mediaLimitations: body.mediaLimitations !== undefined ? body.mediaLimitations : existingProduct.mediaLimitations,
        // ⭐ 판매자 정보
        sellerName: body.sellerName !== undefined ? body.sellerName : existingProduct.sellerName,
        sellerPhone: body.sellerPhone !== undefined ? body.sellerPhone : existingProduct.sellerPhone,
        sellerLegalNotice: body.sellerLegalNotice !== undefined ? body.sellerLegalNotice : existingProduct.sellerLegalNotice,
      },
    });

    return NextResponse.json(updatedProduct);

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
    // 임시로 관리자 권한 확인 생략 - 실제 운영에서는 권한 확인 필요
    // TODO: NextAuth v5 auth 함수로 권한 확인 구현

    const { id } = await params;

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 관련 데이터 확인 (주문에 포함된 상품은 삭제하지 않고 비활성화)
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // 주문에 포함된 상품은 비활성화만
      const deactivatedProduct = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return NextResponse.json({
        message: "주문 기록이 있는 상품은 비활성화되었습니다",
        product: deactivatedProduct,
      });
    } else {
      // 주문 기록이 없는 상품은 완전 삭제
      await prisma.product.delete({
        where: { id },
      });

      return NextResponse.json({
        message: "상품이 성공적으로 삭제되었습니다",
      });
    }

  } catch (error) {
    console.error("상품 삭제 오류:", error);
    return NextResponse.json(
      { error: "상품 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
