import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("token")?.value;
  const publicRoutes = ["/login", "/signup", "/verification"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isPublicRoute) {
    return;
  }

  if (!currentUser && request.nextUrl.pathname === "/onboard") {
    return Response.redirect(new URL("/login", request.url));
  }

  if (currentUser) {
    if (request.nextUrl.pathname === "/onboard") {
      return;
    }
  }
  
  return Response.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
