"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    LogOut,
    Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const sellerLinks = [
    { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/seller/medicines", label: "My Medicines", icon: Package },
    { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
];

const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/orders", label: "All Orders", icon: ShoppingCart },
];

export default function Sidebar({ role }: { role: "seller" | "admin" }) {
    const pathname = usePathname();
    const links = role === "seller" ? sellerLinks : adminLinks;
    const router = useRouter();

    const handleLogOut = async () => {
        const toastId = toast.loading("Signing out...");
        try {
            await authClient.signOut();
            toast.success("Successfully logged out", { id: toastId });

            router.replace("/");
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Logout failed", { id: toastId });
        }
    };

    return (
        <aside className="w-64 border-r bg-card flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                    {role === "seller" ? "Seller" : "Admin"} Panel
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    MediStore
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "hover:bg-muted"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t space-y-2">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                        <Home className="h-5 w-5 mr-3" />
                        Back to Store
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogOut}
                >
                    <LogOut
                        className="h-5 w-5 mr-3" />
                    Sign Out
                </Button>
            </div>
        </aside >
    );
}
