"use client";

import { Menu, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./Modeoggle";
import { SessionWithUser } from "@/types";
import { toast } from "sonner";
import { adminNavbarRoutes, customerNavbarRoutes, sellerNavbarRoutes } from "@/routes/navbar.routes";
import { Roles } from "@/constants/roles";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/providers/cart-context";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    className?: string;
    logo?: { url: string; src: string; alt: string; title: string };
    menu?: MenuItem[];
    auth?: {
        login: { title: string; url: string };
        signup: { title: string; url: string };
    };
    session?: { data?: SessionWithUser | null; error: unknown } | null;
}

// ✅ FIX: Defined OUTSIDE Navbar component — no "created during render" error
const UserAvatar = ({ image, name }: { image?: string | null; name?: string | null }) => (
    <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/15 dark:bg-primary/25 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
        {image ? (
            <Image src={image} alt={name ?? "User"} width={28} height={28} className="object-cover" />
        ) : (
            <span className="text-xs font-semibold text-primary">
                {(name ?? "U").slice(0, 2).toUpperCase()}
            </span>
        )}
    </div>
);

const ProfileDropdown = ({
    name,
    role,
    onClose,
    onLogOut,
}: {
    name?: string | null;
    role?: string | null;
    onClose: () => void;
    onLogOut: () => void;
}) => (
    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role?.toLowerCase()}</p>
        </div>
        <div className="py-1">
            <Link
                href="/profile"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                Profile
            </Link>
            <button
                onClick={onLogOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                Sign out
            </button>
        </div>
    </div>
);

const Navbar = ({
    logo = {
        url: "/",
        src: "/medistore-logo.svg",
        alt: "logo",
        title: "MediStore",
    },
    menu = [
        { title: "Home", url: "/" },
        { title: "Shop", url: "/shop" },
        { title: "About", url: "/about" },
        { title: "Contact", url: "/contact" },
    ],
    auth = {
        login: { title: "Login", url: "/auth/login" },
        signup: { title: "Sign up", url: "/auth/register" },
    },
    className,
    session = null,
}: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const cbUrlRef = useRef("/");
    const [cbUrl, setCbUrl] = useState("/");
    const { cartCount } = useCart();

    useEffect(() => {
        setMounted(true);
        cbUrlRef.current = window.location.href;
        setCbUrl(window.location.href);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let bc: BroadcastChannel | null = null;
        try {
            bc = new BroadcastChannel("auth");
            bc.onmessage = (ev) => {
                if (ev.data?.type === "signed-out" || ev.data?.type === "signed-in") {
                    router.refresh();
                }
            };
        } catch {
            bc = null;
        }
        return () => bc?.close();
    }, [router]);

    const handleLogOut = async () => {
        const toastId = toast.loading("Signing out...");
        try {
            await authClient.signOut();
            toast.success("Successfully logged out", { id: toastId });
            setOpen(false);
            try {
                const bc = new BroadcastChannel("auth");
                bc.postMessage({ type: "signed-out" });
                bc.close();
            } catch { }
            router.refresh();
            router.replace("/");
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Logout failed", { id: toastId });
        }
    };

    const role = session?.data?.user?.role ?? null;
    const roleRoutes = useMemo(
        () =>
            role === Roles.admin ? adminNavbarRoutes
                : role === Roles.seller ? sellerNavbarRoutes
                    : role === Roles.customer ? customerNavbarRoutes
                        : [],
        [role]
    );
    const mergedMenu = useMemo(() => [...menu, ...roleRoutes], [menu, roleRoutes]);

    const isLoggedIn = !!session?.data?.user;
    const user = session?.data?.user;
    const loginHref = `${auth.login.url}${cbUrl !== "/" ? `?callbackUrl=${encodeURIComponent(cbUrl)}` : ""}`;

    return (
        <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60", className)}>
            <div className="container-app py-2">

                {/* ── Desktop ── */}
                <nav className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        <Link href={logo.url} className="flex items-center gap-2 mr-2 group">
                            <img src={logo.src} className="h-8 object-contain transition-transform group-hover:scale-105" alt={logo.alt} />
                        </Link>
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                {mergedMenu.map((item) => renderMenuItem(item, pathname))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        {!isLoggedIn ? (
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <a href={loginHref}>{auth.login.title}</a>
                                </Button>
                                <Button asChild size="sm">
                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {user?.role === Roles.customer && (
                                    <Button variant="ghost" size="icon" className="relative" asChild>
                                        <a href="/cart">
                                            <ShoppingCart className="size-5" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                    {cartCount > 99 ? "99+" : cartCount}
                                                </span>
                                            )}
                                        </a>
                                    </Button>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpen((s) => !s)}
                                        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        type="button"
                                    >
                                        <UserAvatar image={user?.image} name={user?.name} />
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                {user?.name ?? "User"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Profile</span>
                                        </div>
                                    </button>
                                    {open && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                                            <ProfileDropdown
                                                name={user?.name}
                                                role={user?.role}
                                                onClose={() => setOpen(false)}
                                                onLogOut={handleLogOut}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* ── Mobile ── */}
                <div className="flex items-center justify-between lg:hidden">
                    <Link href={logo.url} className="flex items-center gap-2">
                        <img src={logo.src} className="h-8 object-contain" alt={logo.alt} />
                    </Link>

                    <div className="flex items-center gap-2">
                        {isLoggedIn && user?.role === Roles.customer && (
                            <Button variant="ghost" size="icon" className="relative" asChild>
                                <a href="/cart">
                                    <ShoppingCart className="size-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </a>
                            </Button>
                        )}
                        {mounted && (
                            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto w-full max-w-[300px] sm:max-w-sm">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <Link href={logo.url} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                                                <img src={logo.src} className="h-8 object-contain" alt={logo.alt} />
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-6 p-4">
                                        <div className="flex flex-col gap-3">
                                            {mergedMenu.map((item) => {
                                                const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url));
                                                return (
                                                    <Link
                                                        key={item.title}
                                                        href={item.url}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={cn(
                                                            "text-sm font-medium px-3 py-2 rounded-lg transition-colors break-words",
                                                            isActive
                                                                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                                                                : "text-foreground hover:bg-muted"
                                                        )}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <ModeToggle />
                                            {!isLoggedIn ? (
                                                <div className="flex gap-2">
                                                    <Button asChild variant="outline" className="flex-1" onClick={() => setMobileOpen(false)}>
                                                        <a href={loginHref}>{auth.login.title}</a>
                                                    </Button>
                                                    <Button asChild className="flex-1" onClick={() => setMobileOpen(false)}>
                                                        <a href={auth.signup.url}>{auth.signup.title}</a>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2 border-t pt-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <UserAvatar image={user?.image} name={user?.name} />
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-medium truncate">{user?.name}</p>
                                                            <p className="text-xs text-muted-foreground capitalize">
                                                                {user?.role?.toLowerCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 dark:text-gray-200 hover:text-primary">
                                                        Profile
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setMobileOpen(false);
                                                            handleLogOut();
                                                        }}
                                                        className="text-left text-sm text-red-600 dark:text-red-400 hover:text-red-700"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};

const renderMenuItem = (item: MenuItem, pathname: string) => {
    const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url));

    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className={cn(
                    "h-8 px-4 rounded-full transition-all text-sm",
                    isActive ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "bg-transparent"
                )}>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink asChild key={subItem.title} className="w-80">
                            <SubMenuLink item={subItem} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }
    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                href={item.url}
                className={cn(
                    "group inline-flex h-8 w-max items-center justify-center rounded-full px-4 py-2 text-sm transition-all duration-300",
                    isActive
                        ? "bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20"
                        : "bg-transparent text-foreground font-medium hover:bg-primary/5 hover:text-primary"
                )}
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => (
    <a
        className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
        href={item.url}
    >
        <div className="text-foreground">{item.icon}</div>
        <div>
            <div className="text-sm font-semibold">{item.title}</div>
            {item.description && (
                <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
            )}
        </div>
    </a>
);

export { Navbar };