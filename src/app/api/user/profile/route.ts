import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json(
        {
          error: "Unauthorized",
          profile: {
            firstName: "",
            lastName: "",
            phone: "",
            addresses: [],
          },
          preferences: {
            newsletter: false,
            notifications: true,
          },
          cart: [],
          wishlist: [],
          orders: [],
        },
        { status: 200 }
      );
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
      console.log("User not found for email:", email);
      return NextResponse.json(
        {
          error: "User not found",
          profile: {
            firstName: "",
            lastName: "",
            phone: "",
            addresses: [],
          },
          preferences: {
            newsletter: false,
            notifications: true,
          },
          cart: [],
          wishlist: [],
          orders: [],
        },
        { status: 200 }
      );
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
    const { name, phone, firstName, lastName, image, newsletter, notifications, addAddress, updateAddress, email } = body;

    // Use provided email or session email
    const userEmail = email || session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle address update
    if (updateAddress) {
      const { id, ...updateData } = updateAddress;

      await prisma.address.update({
        where: { id },
        data: {
          recipientName: updateData.recipientName,
          phone: updateData.phone,
          zipCode: updateData.zipCode,
          address: updateData.address,
          detailAddress: updateData.detailAddress,
          deliveryRequest: updateData.deliveryRequest || "문 앞",
          entranceCode: updateData.entranceCode || null,
          isDefault: updateData.isDefault || false,
        },
      });

      // Fetch all addresses for this user
      const allAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });

      return NextResponse.json({
        success: true,
        addresses: allAddresses,
      });
    }

    // Handle address addition
    if (addAddress) {
      // If this is the first address, make it default
      let isDefault = addAddress.isDefault || false;
      const existingAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });
      if (existingAddresses.length === 0) {
        isDefault = true;
      }

      // Create the address
      await prisma.address.create({
        data: {
          recipientName: addAddress.recipientName,
          phone: addAddress.phone,
          zipCode: addAddress.zipCode,
          address: addAddress.address,
          detailAddress: addAddress.detailAddress,
          deliveryRequest: addAddress.deliveryRequest || "문 앞",
          entranceCode: addAddress.entranceCode || null,
          isDefault: isDefault,
          userId: user.id,
        },
      });

      // Fetch all addresses for this user
      const allAddresses = await prisma.address.findMany({
        where: { userId: user.id },
      });

      return NextResponse.json({
        success: true,
        addresses: allAddresses,
      });
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
