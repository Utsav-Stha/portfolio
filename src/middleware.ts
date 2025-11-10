import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      });
    }

    try {
      const [scheme, encoded] = auth.split(" ");
      if (scheme !== "Basic" || !encoded) throw new Error("Invalid auth header");

      const decoded = atob(encoded);
      const index = decoded.indexOf(":");
      if (index === -1) throw new Error("Invalid basic payload");

      const username = decoded.slice(0, index);
      const password = decoded.slice(index + 1);

      const ADMIN_USER = process.env.ADMIN_USER;
      const ADMIN_PASS = process.env.ADMIN_PASS;

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        return NextResponse.next();
      }
    } catch {
      // fall-through to unauthorized response
    }

    return new NextResponse("Not Found - You are not authorized to access this page.", {
      status: 404,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

