export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db, users, productReviews, products } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user
        const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        const user = userResult[0];

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user reviews with product details
        const userReviews = await db
            .select({
                id: productReviews.id,
                productId: productReviews.productId,
                productTitle: products.title,
                productImage: products.thumbnail,
                rating: productReviews.rating,
                comment: productReviews.comment,
                images: productReviews.images,
                createdAt: productReviews.createdAt,
                updatedAt: productReviews.updatedAt,
            })
            .from(productReviews)
            .innerJoin(products, eq(productReviews.productId, products.id))
            .where(eq(productReviews.userId, user.id))
            .orderBy(desc(productReviews.createdAt));

        return NextResponse.json(userReviews);
    } catch (error) {
        console.error("Reviews GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userResult = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        const user = userResult[0];

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await request.json();
        const { productId, rating, comment, images } = body;

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const id = `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;

        const newReview = await db.insert(productReviews).values({
            id,
            productId,
            userId: user.id,
            rating: parseFloat(rating),
            comment,
            images: images || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return NextResponse.json(newReview[0]);
    } catch (error) {
        console.error("Review POST error:", error);
        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}
