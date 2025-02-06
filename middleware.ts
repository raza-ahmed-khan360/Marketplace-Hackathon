// middleware.ts
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"; // 👈 Import KindeUser type

// 🛠 Custom user type with roles
interface CustomKindeUser extends KindeUser {
  user_roles?: string[]; // 👈 Explicitly define user_roles
}

export async function middleware(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = (await getUser()) as CustomKindeUser; // 👈 Typecast user

  // 🛠 Redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔹 Ensure user_roles exists
  const roles = user.user_roles || [];

  // 🛠 Redirect based on role
  if (roles.includes("admin")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.redirect(new URL("/user", req.url));
}

export const config = {
  matcher: "/dashboard/:path*", // Middleware applies to /dashboard routes
};
