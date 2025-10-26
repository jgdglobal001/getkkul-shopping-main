import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from query params or session
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const email = emailParam || session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        addresses: true,
        cartItems: {
          include: {
            product: true,
          },
        },
        wishlist: {
          include: {
            product: true,
          },
        },
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform data to match expected format
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        addresses: user.addresses || [],
      },
      preferences: {
        newsletter: user.newsletter,
        notifications: user.notifications,
      },
      cart: user.cartItems || [],
      wishlist: user.wishlist || [],
      orders: user.orders || [],
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, firstName, lastName, image, newsletter, notifications } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data, only include defined fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (typeof name !== "undefined") {
      updateData.name = name;
    }
    if (typeof firstName !== "undefined") {
      updateData.firstName = firstName;
    }
    if (typeof lastName !== "undefined") {
      updateData.lastName = lastName;
    }
    if (typeof phone !== "undefined") {
      updateData.phone = phone;
    }
    if (typeof image !== "undefined") {
      updateData.image = image;
    }
    if (typeof newsletter !== "undefined") {
      updateData.newsletter = newsletter;
    }
    if (typeof notifications !== "undefined") {
      updateData.notifications = notifications;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        addresses: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        profile: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          addresses: updatedUser.addresses,
        },
        preferences: {
          newsletter: updatedUser.newsletter,
          notifications: updatedUser.notifications,
        },
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
