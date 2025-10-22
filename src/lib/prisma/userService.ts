import { prisma } from "../prisma";

export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  provider?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  newsletter: boolean;
  notifications: boolean;
  addresses: Array<{
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  cartItems: any[];
  wishlist: any[];
  orders: any[];
}

export async function fetchUserFromPrisma(
  userId: string
): Promise<PrismaUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        cartItems: true,
        wishlist: true,
        orders: {
          include: {
            orderItems: true
          }
        }
      }
    });

    if (user) {
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
        addresses: user.addresses,
        cartItems: user.cartItems,
        wishlist: user.wishlist,
        orders: user.orders
      } as PrismaUser;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user from Prisma:", error);
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
  password?: string;
  image?: string;
  provider?: string;
  emailVerified?: boolean;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        provider: userData.provider,
        emailVerified: userData.emailVerified || false,
        firstName: userData.name.split(" ")[0] || "",
        lastName: userData.name.split(" ").slice(1).join(" ") || "",
      }
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(userId: string, updateData: any) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}
