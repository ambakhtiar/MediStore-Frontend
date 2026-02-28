import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    let isAuthenticated = false;
    let role;

    const { data } = await userService.getSession();

    if (data) {
        isAuthenticated = true;
        role = data?.user?.role;
    }
    console.log(pathname, data);
    //* User in not authenticated at all
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based guards
    // Admin routes 
    if (pathname === "/admin" || pathname.startsWith("/admin")) {
        if (role !== Roles.admin) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Seller routes
    if (pathname === "/seller" || pathname.startsWith("/seller")) {
        if (role !== Roles.seller) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Customer-only routes (optional)
    if (
        pathname === "/cart" ||
        pathname.startsWith("/cart") ||
        pathname === "/orders" ||
        pathname.startsWith("/orders") ||
        pathname === "/review" ||
        pathname.startsWith("/reviews") ||
        pathname === "/checkout"
    ) {
        if (role !== Roles.customer) {
            // যদি role customer না হয়, হোমপেজে রিডাইরেক্ট করবে
            return NextResponse.redirect(new URL("/", request.url));
        }
        // customer হলে এগুলোতে যেতে পারবে
        return NextResponse.next();
    }


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
        "/reviews",
        "/reviews/:path*",
        "/profile",
        "/checkout",
        "/track"
    ],
};
