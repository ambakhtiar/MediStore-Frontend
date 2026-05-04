import Link from "next/link";
import { Pill, Mail, Phone, MapPin, Facebook, Github, Linkedin, Instagram } from "lucide-react";

const FOOTER_LINKS = [
    {
        title: "Company",
        links: [
            { label: "About Us",    href: "/about" },
            { label: "Blog",        href: "/blog" },
            { label: "Careers",     href: "#" },
            { label: "Contact",     href: "/contact" },
        ],
    },
    {
        title: "Products",
        links: [
            { label: "All Medicines", href: "/shop" },
            { label: "Categories",    href: "/shop" },
            { label: "New Arrivals",  href: "/shop?sort=newest" },
            { label: "Featured",      href: "/shop?featured=true" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center",   href: "/faq" },
            { label: "FAQ",           href: "/faq" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/privacy" },
        ],
    },
];

const SOCIAL_LINKS = [
    { icon: Facebook,  href: "https://facebook.com",  label: "Facebook" },
    { icon: Github,    href: "https://github.com",    label: "GitHub" },
    { icon: Linkedin,  href: "https://linkedin.com",  label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

const CONTACT_INFO = [
    { icon: Mail,    text: "support@medistore.com" },
    { icon: Phone,   text: "+880 1700-000000" },
    { icon: MapPin,  text: "Dhaka, Bangladesh" },
];

export function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-0">
            <div className="container-app py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <img src="/medistore-logo.svg" className="h-8 object-contain transition-transform group-hover:scale-105" alt="MediStore logo" />
                        </Link>

                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Bangladesh&apos;s most trusted online pharmacy. Genuine medicines, verified sellers, and doorstep delivery across 64 districts.
                        </p>

                        {/* Contact info */}
                        <ul className="space-y-2.5">
                            {CONTACT_INFO.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Social links */}
                        <div className="flex items-center gap-2 pt-1">
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {FOOTER_LINKS.map(({ title, links }) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
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
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} MediStore. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/faq"     className="hover:text-primary transition-colors">FAQ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}