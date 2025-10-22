import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PrismaUser } from "@/lib/prisma/userService";

export function useCurrentUser(): {
  user: PrismaUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string;
} {
  const userInfo = useSelector((state: RootState) => state.shopy.userInfo);

  return {
    user: userInfo,
    isAdmin: userInfo?.role === "admin",
    isAuthenticated: !!userInfo,
    userId: userInfo?.id || null,
    userRole: userInfo?.role || "user",
  };
}
