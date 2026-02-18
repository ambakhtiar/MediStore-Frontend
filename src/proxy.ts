import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Roles } from "./constants/roles";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    let isAuthenticated = false;
    let role;

    const { data } = await userService.getSession();

    if (data) {
        isAuthenticated = true;
        role = data?.user?.role;
    }

    //* User in not authenticated at all
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based guards
    // Admin routes
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        if (role !== Roles.admin) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Seller routes
    if (pathname === "/seller" || pathname.startsWith("/seller/")) {
        if (role !== Roles.seller) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Customer-only routes (optional)
    // Example: if you want /dashboard to be customer-only uncomment:
    // if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    //   if (role !== Roles.customer) {
    //     return NextResponse.redirect(new URL("/", request.url));
    //   }
    //   return NextResponse.next();
    // }

    // All other matched routes are allowed for any authenticated user
    return NextResponse.next();

}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/seller",
        "/seller/:path*",
        "/cart",
        "/orders",
        "/orders/:path*",
        "/profile",
        "/checkout",
        "/track"
    ],
};
