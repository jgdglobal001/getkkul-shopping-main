export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db, users, addresses, cartItems, wishlistItems, orders, orderItems, products } from "@/lib/db";
import { eq } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

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

    // Get user
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

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

    // Get related data
    const [userAddresses, userCartItems, userWishlist, userOrders] = await Promise.all([
      db.select().from(addresses).where(eq(addresses.userId, user.id)),
      db.select().from(cartItems).where(eq(cartItems.userId, user.id)),
      db.select().from(wishlistItems).where(eq(wishlistItems.userId, user.id)),
      db.select().from(orders).where(eq(orders.userId, user.id)),
    ]);

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        return { ...order, orderItems: items };
      })
    );

    // Transform data to match expected format
    const transformedOrders = ordersWithItems.map((order) => ({
      id: order.id,
      orderId: order.orderId,
      amount: order.totalAmount?.toString() || "0",
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
      customerEmail: user.email,
      customerName: user.name,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      items: (order.orderItems || []).map((item: any) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        images: item.image ? [item.image] : [],
      })),
    }));

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      profile: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        addresses: userAddresses || [],
      },
      preferences: {
        newsletter: user.newsletter,
        notifications: user.notifications,
      },
      cart: userCartItems || [],
      wishlist: userWishlist || [],
      orders: transformedOrders,
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

    const userResult = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle address update
    if (updateAddress) {
      const { id, ...updateData } = updateAddress;

      await db
        .update(addresses)
        .set({
          recipientName: updateData.recipientName,
          phone: updateData.phone,
          zipCode: updateData.zipCode,
          address: updateData.address,
          detailAddress: updateData.detailAddress,
          deliveryRequest: updateData.deliveryRequest || "문 앞",
          entranceCode: updateData.entranceCode || null,
          isDefault: updateData.isDefault || false,
          updatedAt: new Date(),
        })
        .where(eq(addresses.id, id));

      // Fetch all addresses for this user
      const allAddresses = await db.select().from(addresses).where(eq(addresses.userId, user.id));

      return NextResponse.json({
        success: true,
        addresses: allAddresses,
      });
    }

    // Handle address addition
    if (addAddress) {
      // If this is the first address, make it default
      let isDefault = addAddress.isDefault || false;
      const existingAddresses = await db.select().from(addresses).where(eq(addresses.userId, user.id));
      if (existingAddresses.length === 0) {
        isDefault = true;
      }

      // Create the address
      await db.insert(addresses).values({
        id: generateId(),
        recipientName: addAddress.recipientName,
        phone: addAddress.phone,
        zipCode: addAddress.zipCode,
        address: addAddress.address,
        detailAddress: addAddress.detailAddress,
        deliveryRequest: addAddress.deliveryRequest || "문 앞",
        entranceCode: addAddress.entranceCode || null,
        isDefault: isDefault,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Fetch all addresses for this user
      const allAddresses = await db.select().from(addresses).where(eq(addresses.userId, user.id));

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

    await db.update(users).set(updateData).where(eq(users.id, user.id));

    // Fetch updated user and addresses
    const updatedUserResult = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const updatedUser = updatedUserResult[0];
    const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, user.id));

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
          addresses: userAddresses,
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
