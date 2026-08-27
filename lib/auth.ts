import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter both username/email and password.");
        }

        const identifier = credentials.username.trim();

        // 1. Check Super Admin via .env variables
        const adminUser = process.env.SUPER_ADMIN_USERNAME;
        const adminPass = process.env.SUPER_ADMIN_PASSWORD;

        if (
          adminUser && 
          adminPass && 
          identifier === adminUser && 
          credentials.password === adminPass
        ) {
          return {
            id: "superadmin-001",
            name: "System Administrator",
            email: "admin@verity.local",
            role: "ADMIN",
            isOnboarded: true,
            isVerified: true,
          } as any;
        }

        // 2. Check standard user in Database
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { name: identifier }],
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid username or password.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid username or password.");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isOnboarded: user.isOnboarded,
          isVerified: user.isVerified,
        } as any;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { scope: "openid profile email" } },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Allow client-side session.update() to push new values
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.isOnboarded !== undefined) token.isOnboarded = session.isOnboarded;
        if (session.isVerified !== undefined) token.isVerified = session.isVerified;
        return token;
      }

      if (user) {
        token.id = user.id;
      }

      // Always fetch fresh state from DB (except for static superadmin)
      if (token.email) {
        if (token.id === "superadmin-001") {
          token.role = "ADMIN";
          token.isOnboarded = true;
          token.isVerified = true;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { role: true, isOnboarded: true, isVerified: true },
          });
          token.role = dbUser?.role ?? "UNASSIGNED";
          token.isOnboarded = dbUser?.isOnboarded ?? false;
          token.isVerified = dbUser?.isVerified ?? false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? "UNASSIGNED";
        (session.user as any).isOnboarded = token.isOnboarded ?? false;
        (session.user as any).isVerified = token.isVerified ?? false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signup",
    error: "/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
