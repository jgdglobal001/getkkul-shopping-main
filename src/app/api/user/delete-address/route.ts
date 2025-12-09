export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { email, addressIndex } = await request.json();

    if (!email || addressIndex === undefined) {
      return NextResponse.json(
        { error: "Email and address index are required" },
        { status: 400 }
      );
    }

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse addresses from JSON string if it exists
    let addresses: any[] = [];
    if (user.addresses) {
      try {
        addresses = JSON.parse(user.addresses as string);
      } catch (e) {
        addresses = [];
      }
    }

    // Remove address at specified index
    if (addressIndex >= 0 && addressIndex < addresses.length) {
      addresses.splice(addressIndex, 1);
    } else {
      return NextResponse.json(
        { error: "Invalid address index" },
        { status: 400 }
      );
    }

    // Update user with new addresses
    await db.update(users).set({
      addresses: JSON.stringify(addresses),
      updatedAt: new Date(),
    }).where(eq(users.email, email));

    return NextResponse.json({ success: true, addresses });
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
