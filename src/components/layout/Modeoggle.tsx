"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full" aria-label="Toggle theme">
                <span className="w-4 h-4 block rounded-full skeleton" />
            </Button>
        );
    }

    const isDark = resolvedTheme === "dark";

    const toggle = () => setTheme(isDark ? "light" : "dark");

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="w-9 h-9 rounded-full relative overflow-hidden hover:bg-primary/10 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Sun — visible in light */}
            <Sun
                className="h-[1.1rem] w-[1.1rem] absolute transition-all duration-300 text-amber-500
                    dark:opacity-0 dark:-rotate-90 dark:scale-50
                    opacity-100 rotate-0 scale-100"
            />
            {/* Moon — visible in dark */}
            <Moon
                className="h-[1.1rem] w-[1.1rem] absolute transition-all duration-300 text-primary
                    opacity-0 rotate-90 scale-50
                    dark:opacity-100 dark:rotate-0 dark:scale-100"
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
