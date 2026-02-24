"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
    role: "seller" | "admin";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar role={role} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}