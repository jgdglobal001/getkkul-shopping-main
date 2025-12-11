import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/authOptions";

// Note: DrizzleAdapter temporarily disabled for Cloudflare Edge Runtime compatibility
// User data is handled in authOptions callbacks instead

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
});
