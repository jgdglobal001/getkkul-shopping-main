import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "@/redux/shofySlice";
import type { RootState } from "@/redux/store";

export function useUserSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.shopy.userInfo);

  useEffect(() => {
    const syncUserData = async () => {
      if (status === "loading") return;

      if (session?.user?.id) {
        // If we don't have user data in store or the session ID doesn't match
        if (!userInfo || userInfo.id !== session.user.id) {
          try {
            // API 라우트를 통해 사용자 데이터 가져오기
            const response = await fetch(`/api/user/${session.user.id}`);
            const prismaUser = response.ok ? await response.json() : null;
            if (prismaUser) {
              dispatch(addUser(prismaUser));
            } else {
              // If no Prisma data, create minimal user from session
              const sessionUser = {
                id: session.user.id,
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
                role: session.user.role || "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                emailVerified: true,
                profile: {
                  firstName: session.user.name?.split(" ")[0] || "",
                  lastName:
                    session.user.name?.split(" ").slice(1).join(" ") || "",
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
              };
              dispatch(addUser(sessionUser));
            }
          } catch (error) {
            console.error("Error syncing user data:", error);
          }
        }
      } else if (status === "unauthenticated") {
        // Clear user data when logged out
        if (userInfo) {
          dispatch(removeUser());
        }
      }
    };

    syncUserData();
  }, [session, status, dispatch, userInfo]);

  return {
    user: userInfo,
    session,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  };
}
