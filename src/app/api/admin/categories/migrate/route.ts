import { NextRequest, NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { count } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// 더미 카테고리 데이터 (기존 구조 유지)
const dummyCategories = [
  {
    name: "Beauty",
    slug: "beauty",
    description: "Explore premium beauty products and cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    icon: "💄",
    order: 1,
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    description: "Discover luxurious fragrances and perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    icon: "🌸",
    order: 2,
  },
  {
    name: "Furniture",
    slug: "furniture",
    description: "Transform your space with stylish furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    icon: "🪑",
    order: 3,
  },
  {
    name: "Groceries",
    slug: "groceries",
    description: "Fresh groceries and everyday essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    icon: "🛒",
    order: 4,
  },
  {
    name: "Home Decoration",
    slug: "home-decoration",
    description: "Beautiful decor items for your home",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    icon: "🏠",
    order: 5,
  },
  {
    name: "Kitchen Accessories",
    slug: "kitchen-accessories",
    description: "Essential tools for your kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    icon: "🍳",
    order: 6,
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops and computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    icon: "💻",
    order: 7,
  },
  {
    name: "Men's Shirts",
    slug: "mens-shirts",
    description: "Stylish shirts for the modern man",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop",
    icon: "👔",
    order: 8,
  },
  {
    name: "Men's Shoes",
    slug: "mens-shoes",
    description: "Comfortable and fashionable footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    icon: "👞",
    order: 9,
  },
  {
    name: "Men's Watches",
    slug: "mens-watches",
    description: "Elegant timepieces for men",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    icon: "⌚",
    order: 10,
  },
  {
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Accessories for your mobile devices",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    icon: "📱",
    order: 11,
  },
  {
    name: "Motorcycle",
    slug: "motorcycle",
    description: "Motorcycle gear and accessories",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    icon: "🏍️",
    order: 12,
  },
  {
    name: "Skin Care",
    slug: "skin-care",
    description: "Premium skincare products",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
    icon: "🧴",
    order: 13,
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones and devices",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    icon: "📲",
    order: 14,
  },
  {
    name: "Sports Accessories",
    slug: "sports-accessories",
    description: "Sports gear and equipment",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    icon: "⚽",
    order: 15,
  },
  {
    name: "Sunglasses",
    slug: "sunglasses",
    description: "Stylish eyewear and sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    icon: "😎",
    order: 16,
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Tablets and digital accessories",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    icon: "📱",
    order: 17,
  },
  {
    name: "Tops",
    slug: "tops",
    description: "Trendy tops and casual wear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    icon: "👕",
    order: 18,
  },
  {
    name: "Vehicle",
    slug: "vehicle",
    description: "Automotive accessories and parts",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
    icon: "🚗",
    order: 19,
  },
  {
    name: "Women's Bags",
    slug: "womens-bags",
    description: "Fashionable bags and handbags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    icon: "👜",
    order: 20,
  },
  {
    name: "Women's Dresses",
    slug: "womens-dresses",
    description: "Elegant dresses for every occasion",
    image: "https://images.unsplash.com/photo-1595777707802-221b42c0bbb2?w=400&h=300&fit=crop",
    icon: "👗",
    order: 21,
  },
  {
    name: "Women's Jewellery",
    slug: "womens-jewellery",
    description: "Beautiful jewelry and accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
    icon: "💎",
    order: 22,
  },
  {
    name: "Women's Shoes",
    slug: "womens-shoes",
    description: "Stylish footwear for women",
    image: "https://images.unsplash.com/photo-1543163521-9efcc06b9cb5?w=400&h=300&fit=crop",
    icon: "👠",
    order: 23,
  },
  {
    name: "Women's Watches",
    slug: "womens-watches",
    description: "Elegant watches for women",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    icon: "⌚",
    order: 24,
  },
];

export async function POST(request: NextRequest) {
  try {
    // 마이그레이션은 관리자 권한 없이 실행 가능 (한 번만 실행되도록 보호됨)

    // 기존 카테고리 확인
    const existingCountResult = await db.select({ count: count() }).from(categories);
    const existingCount = existingCountResult[0]?.count || 0;

    if (existingCount > 0) {
      return NextResponse.json(
        { error: "이미 카테고리가 존재합니다. 마이그레이션을 다시 실행할 수 없습니다." },
        { status: 400 }
      );
    }

    // 더미 카테고리를 DB에 저장
    const createdCategories = await Promise.all(
      dummyCategories.map((category) =>
        db.insert(categories).values({
          id: generateId(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          icon: category.icon,
          order: category.order,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning()
      )
    );

    return NextResponse.json(
      {
        message: `${createdCategories.length}개의 카테고리가 마이그레이션되었습니다`,
        count: createdCategories.length,
        categories: createdCategories.map(c => c[0]),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("카테고리 마이그레이션 오류:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `카테고리 마이그레이션 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}

