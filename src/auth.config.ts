import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/projects") || nextUrl.pathname.startsWith("/superadmin");
      // Only redirect away from login/signup — NOT from the public landing page
      const isAuthOnlyRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

      if (isProtectedRoute) {
        if (isLoggedIn) {
          // If super admin tries to access normal protected route, kick to /superadmin
          if (auth.user?.role === "SUPER_ADMIN" && nextUrl.pathname.startsWith("/dashboard")) {
            return Response.redirect(new URL("/superadmin", nextUrl));
          }
          // Normal users shouldn't access /superadmin
          if (auth.user?.role !== "SUPER_ADMIN" && nextUrl.pathname.startsWith("/superadmin")) {
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isAuthOnlyRoute) {
        if (auth.user?.role === "SUPER_ADMIN") {
          return Response.redirect(new URL("/superadmin", nextUrl));
        }
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
      async session({ session, token }) {
        if (session.user) {
          session.user.role = token.role as "SUPER_ADMIN" | "ADMIN" | "MEMBER";
          session.user.id = token.id as string;
        }
      return session;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;
