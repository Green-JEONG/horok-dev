import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, upsertOAuthUser } from "@/lib/db";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim()
            : null;

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user) return null;
        if (!user.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        const email = user.email;
        const providerId =
          account.provider === "github"
            ? String(profile?.id)
            : String(profile?.sub);

        if (!email || !providerId) return false;

        const dbUser = await upsertOAuthUser({
          email,
          name: user.name ?? null,
          provider: account.provider,
          providerId,
        });

        if (!dbUser) return false;

        // ⭐️ 핵심
        user.id = String(dbUser.id);
        user.role = dbUser.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // ⭐️ 표준
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
