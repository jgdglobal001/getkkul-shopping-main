import { db, users, addresses, cartItems, wishlistItems, orders, orderItems } from "../db";
import { eq } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export interface PrismaUser {
  id: string;
  name: string | null;
  email: string;
  image?: string;
  role: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  emailVerified: Date | null;
  provider?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  newsletter: boolean | null;
  notifications: boolean | null;
  addresses: any[];
  cartItems: any[];
  wishlist: any[];
  orders: any[];
}

export async function fetchUserFromPrisma(
  userId: string
): Promise<PrismaUser | null> {
  try {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user) return null;

    // Get related data
    const [userAddresses, userCartItems, userWishlist, userOrders] = await Promise.all([
      db.select().from(addresses).where(eq(addresses.userId, userId)),
      db.select().from(cartItems).where(eq(cartItems.userId, userId)),
      db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId)),
      db.select().from(orders).where(eq(orders.userId, userId)),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image || undefined,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      provider: user.provider || undefined,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      phone: user.phone || undefined,
      newsletter: user.newsletter,
      notifications: user.notifications,
      addresses: userAddresses,
      cartItems: userCartItems,
      wishlist: userWishlist,
      orders: userOrders,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getCurrentUserData(
  session: any
): Promise<PrismaUser | null> {
  if (!session?.user?.id) {
    return null;
  }

  return await fetchUserFromPrisma(session.user.id);
}

export async function createUser(userData: {
  name: string;
  email: string;
  password?: string | null;
  image?: string;
  provider?: string;
  emailVerified?: boolean;
}) {
  try {
    const newUser = await db
      .insert(users)
      .values({
        id: generateId(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        provider: userData.provider,
        emailVerified: userData.emailVerified ? new Date() : null,
        firstName: userData.name.split(" ")[0] || "",
        lastName: userData.name.split(" ").slice(1).join(" ") || "",
        role: "user",
        newsletter: false,
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newUser[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(userId: string, updateData: any) {
  try {
    const updated = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return updated[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}
