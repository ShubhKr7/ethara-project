import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
  }
}
