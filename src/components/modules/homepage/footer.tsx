"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Github,
    Linkedin,
    Instagram,
    ArrowRight,
    ShieldCheck,
    Truck,
    Clock,
    Heart
} from "lucide-react";

const FOOTER_LINKS = [
    {
        title: "Platform",
        links: [
            { label: "Find Medicine", href: "/shop" },
            { label: "Categories", href: "/shop" },
            { label: "New Arrivals", href: "/shop?sort=newest" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
            { label: "Our Story", href: "/about" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "FAQ & Help", href: "/faq" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
];

const SOCIAL_LINKS = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
];


export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            toast.success("Successfully subscribed to newsletter!");
            setEmail("");
            setLoading(false);
        }, 1200);
    };

    return (
        <footer className="mt-20 border-t border-border/50 bg-background/50 backdrop-blur-md">
            {/* ─── Newsletter Section ─── */}
            <div className="border-b border-border/40">
                <div className="container-app py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-md text-center md:text-left">
                            <h2 className="text-xl font-bold text-foreground mb-1">Subscribe to our newsletter</h2>
                            <p className="text-muted-foreground text-sm">Stay updated with latest medicine arrivals and health tips.</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 bg-background/50"
                                disabled={loading}
                            />
                            <Button type="submit" size="sm" disabled={loading} className="h-10 px-4 group">
                                {loading ? "..." : "Join"}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ─── Links Grid ─── */}
            <div className="container-app py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="inline-block transition-opacity hover:opacity-80">
                            <img src="/medistore-logo.svg" className="h-8 object-contain" alt="MediStore" />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Most trusted online pharmacy in Bangladesh. Providing genuine healthcare products with professional doorstep delivery.
                        </p>
                        <div className="flex items-center gap-3">
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    {FOOTER_LINKS.map(({ title, links }) => (
                        <div key={title}>
                            <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wider">{title}</h3>
                            <ul className="space-y-3">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact column */}
                    <div className="lg:col-span-1 space-y-5">
                        <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wider">Contact</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary/70" />
                                <span>support@medistore.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary/70" />
                                <span>+880 1700-000000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary/70" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ─── Bottom Bar ─── */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span suppressHydrationWarning>&copy; {new Date().getFullYear()} MediStore Bangladesh.</span>
                        <span className="hidden sm:inline">All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>Built with</span>
                        <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span>for a healthier nation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}