export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users, addresses } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { email, addressId } = await request.json();

    if (!email || !addressId) {
      return NextResponse.json(
        { error: "Email and address ID are required" },
        { status: 400 }
      );
    }

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the address from addresses table (verify ownership)
    await db.delete(addresses).where(
      and(
        eq(addresses.id, addressId),
        eq(addresses.userId, user.id)
      )
    );

    // Return remaining addresses
    const remainingAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, user.id));

    return NextResponse.json({ success: true, addresses: remainingAddresses });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
