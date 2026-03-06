import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const encodedRefresh = cookieStore.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  // 🟢 Public home page
  if (pathname === "/") {
    if (!encodedRefresh) {
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(encodedRefresh, secret);
      console.log(payload.role);
      return payload.role === "ADMIN"
        ? NextResponse.redirect(new URL("/admin", request.url))
        : NextResponse.redirect(new URL("/vendor/shop", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  // 🔒 Protected routes require auth
  if (!encodedRefresh) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(encodedRefresh, secret);
    // ❌ Non-admin blocked
    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ❌ Non-vendor blocked
    if (pathname.startsWith("/vendor") && payload.role !== "SHOP_OWNER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ✅ IMPORTANT: allow request
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/admin/:path*", "/vendor/:path*"],
};
