import NextAuth, { type NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/Discord";

export const authConfig = {
  providers: [Discord],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig);
