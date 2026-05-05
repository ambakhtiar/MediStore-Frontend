"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
    children: ReactNode;
    role: "seller" | "admin";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-full">
                <Sidebar role={role} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
                    <div className="font-bold text-lg">{role === "seller" ? "Seller" : "Admin"} Panel</div>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r-0">
                            <Sidebar role={role} isMobile onMobileClose={() => setMobileOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}