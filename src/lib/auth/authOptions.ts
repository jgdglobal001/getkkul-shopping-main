import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "./providers/kakao";
import Naver from "./providers/naver";
import { prisma } from "../prisma";
import { findUserByEmail, createUser } from "../prisma/userService";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hl: "ko", // 한국어 설정
        },
      },
    }),
    // Kakao는 회사 핸드폰 인증 후 활성화 예정
    // Kakao({
    //   clientId: process.env.KAKAO_CLIENT_ID!,
    //   clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    // }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, Kakao, Naver)
      if (account?.provider === "google" || account?.provider === "kakao" || account?.provider === "naver") {
        try {
          // Check if user already exists in Prisma
          let existingUser = await findUserByEmail(user.email!);

          // If user doesn't exist, create them
          if (!existingUser && user.email) {
            existingUser = await createUser({
              name: user.name || "",
              email: user.email,
              image: user.image || "",
              provider: account.provider,
              emailVerified: true, // OAuth emails are verified by the provider
            });
          }

          // Store the user ID for later use
          if (existingUser) {
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error("Error handling OAuth user:", error);
          // Don't prevent sign-in, just log the error
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // On first sign in, user object is available
      if (user) {
        token.id = user.id || token.sub || `user_${Date.now()}`;
        token.role = "user"; // Default role for OAuth users
        token.email = user.email;
        if (user.image) {
          token.picture = user.image;
        }
      }

      // Ensure we always have an ID for the token
      if (!token.id) {
        if (token.sub) {
          token.id = token.sub;
        } else if (token.email) {
          token.id = `temp_${token.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
      }

      // Ensure we always have a role
      if (!token.role) {
        token.role = "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.email = token.email as string;

        // Fetch the latest user data from Prisma to get the correct role
        try {
          const user = await findUserByEmail(session.user.email!);
          if (user) {
            session.user.role = user.role || "user";
            session.user.name = user.name || session.user.name;
            session.user.image = user.image || (token.picture as string);
          } else {
            session.user.role = (token.role as string) || "user";
          }
        } catch (error) {
          console.error("Error fetching user data from Prisma:", error);
          session.user.role = (token.role as string) || "user";
        }

        // Ensure image is properly passed through if not from Firestore
        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }

      return session;
    },
  },
};
