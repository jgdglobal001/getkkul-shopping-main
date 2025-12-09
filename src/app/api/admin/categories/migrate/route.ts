export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { count } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// ?붾? 移댄뀒怨좊━ ?곗씠??(湲곗〈 援ъ“ ?좎?)
const dummyCategories = [
  {
    name: "Beauty",
    slug: "beauty",
    description: "Explore premium beauty products and cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    icon: "?뭵",
    order: 1,
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    description: "Discover luxurious fragrances and perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    icon: "?뙵",
    order: 2,
  },
  {
    name: "Furniture",
    slug: "furniture",
    description: "Transform your space with stylish furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    icon: "?첄",
    order: 3,
  },
  {
    name: "Groceries",
    slug: "groceries",
    description: "Fresh groceries and everyday essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    icon: "?썟",
    order: 4,
  },
  {
    name: "Home Decoration",
    slug: "home-decoration",
    description: "Beautiful decor items for your home",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    icon: "?룧",
    order: 5,
  },
  {
    name: "Kitchen Accessories",
    slug: "kitchen-accessories",
    description: "Essential tools for your kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    icon: "?뜵",
    order: 6,
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops and computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    icon: "?뮲",
    order: 7,
  },
  {
    name: "Men's Shirts",
    slug: "mens-shirts",
    description: "Stylish shirts for the modern man",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop",
    icon: "?몦",
    order: 8,
  },
  {
    name: "Men's Shoes",
    slug: "mens-shoes",
    description: "Comfortable and fashionable footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    icon: "?몶",
    order: 9,
  },
  {
    name: "Men's Watches",
    slug: "mens-watches",
    description: "Elegant timepieces for men",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    icon: "??,
    order: 10,
  },
  {
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Accessories for your mobile devices",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    icon: "?벑",
    order: 11,
  },
  {
    name: "Motorcycle",
    slug: "motorcycle",
    description: "Motorcycle gear and accessories",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    icon: "?룏截?,
    order: 12,
  },
  {
    name: "Skin Care",
    slug: "skin-care",
    description: "Premium skincare products",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
    icon: "?㎢",
    order: 13,
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones and devices",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    icon: "?벒",
    order: 14,
  },
  {
    name: "Sports Accessories",
    slug: "sports-accessories",
    description: "Sports gear and equipment",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    icon: "??,
    order: 15,
  },
  {
    name: "Sunglasses",
    slug: "sunglasses",
    description: "Stylish eyewear and sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    icon: "?삇",
    order: 16,
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Tablets and digital accessories",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    icon: "?벑",
    order: 17,
  },
  {
    name: "Tops",
    slug: "tops",
    description: "Trendy tops and casual wear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    icon: "?몧",
    order: 18,
  },
  {
    name: "Vehicle",
    slug: "vehicle",
    description: "Automotive accessories and parts",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
    icon: "?슅",
    order: 19,
  },
  {
    name: "Women's Bags",
    slug: "womens-bags",
    description: "Fashionable bags and handbags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    icon: "?몴",
    order: 20,
  },
  {
    name: "Women's Dresses",
    slug: "womens-dresses",
    description: "Elegant dresses for every occasion",
    image: "https://images.unsplash.com/photo-1595777707802-221b42c0bbb2?w=400&h=300&fit=crop",
    icon: "?몭",
    order: 21,
  },
  {
    name: "Women's Jewellery",
    slug: "womens-jewellery",
    description: "Beautiful jewelry and accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
    icon: "?뭿",
    order: 22,
  },
  {
    name: "Women's Shoes",
    slug: "womens-shoes",
    description: "Stylish footwear for women",
    image: "https://images.unsplash.com/photo-1543163521-9efcc06b9cb5?w=400&h=300&fit=crop",
    icon: "?몺",
    order: 23,
  },
  {
    name: "Women's Watches",
    slug: "womens-watches",
    description: "Elegant watches for women",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    icon: "??,
    order: 24,
  },
];

export async function POST(request: NextRequest) {
  try {
    // 留덉씠洹몃젅?댁뀡? 愿由ъ옄 沅뚰븳 ?놁씠 ?ㅽ뻾 媛??(??踰덈쭔 ?ㅽ뻾?섎룄濡?蹂댄샇??

    // 湲곗〈 移댄뀒怨좊━ ?뺤씤
    const existingCountResult = await db.select({ count: count() }).from(categories);
    const existingCount = existingCountResult[0]?.count || 0;

    if (existingCount > 0) {
      return NextResponse.json(
        { error: "?대? 移댄뀒怨좊━媛 議댁옱?⑸땲?? 留덉씠洹몃젅?댁뀡???ㅼ떆 ?ㅽ뻾?????놁뒿?덈떎." },
        { status: 400 }
      );
    }

    // ?붾? 移댄뀒怨좊━瑜?DB?????
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
        message: `${createdCategories.length}媛쒖쓽 移댄뀒怨좊━媛 留덉씠洹몃젅?댁뀡?섏뿀?듬땲??,
        count: createdCategories.length,
        categories: createdCategories.map(c => c[0]),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("移댄뀒怨좊━ 留덉씠洹몃젅?댁뀡 ?ㅻ쪟:", error);
    const errorMessage = error instanceof Error ? error.message : "?????녿뒗 ?ㅻ쪟";
    return NextResponse.json(
      { error: `移댄뀒怨좊━ 留덉씠洹몃젅?댁뀡 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎: ${errorMessage}` },
      { status: 500 }
    );
  }
}

