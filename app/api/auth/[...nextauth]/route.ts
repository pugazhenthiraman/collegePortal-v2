/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions : any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // ✅ Query user from all possible roles
        const user: any = await prisma.$transaction(async (tx) => {
          return (
            await tx.superAdmin.findUnique({ where: { email: credentials.email } }) ||
            await tx.college.findUnique({ where: { email: credentials.email } }) ||
            await tx.department.findUnique({ where: { email: credentials.email } }) ||
            await tx.hOD.findUnique({ where: { email: credentials.email } }) ||
            await tx.faculty.findUnique({ where: { email: credentials.email } }) ||
            await tx.student.findUnique({ where: { email: credentials.email } })
          );
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user } : any) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token } : any) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ baseUrl } : any) {
      return getRedirectPath(baseUrl);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
};

// ✅ Pass authOptions directly into NextAuth() and only export handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// 🔥 Helper Function to Define Redirect Paths Based on Role
function getRedirectPath(role: string | undefined): string | null {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "COLLEGE":
      return "/college/dashboard";
    case "DEPARTMENT":
      return "/department/dashboard";
    case "HOD":
      return "/hod/dashboard";
    case "FACULTY":
      return "/faculty/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return null;
  }
}
