import Link from "next/link";
import { ArrowRight, Pill } from "lucide-react";

export default function NewsletterCta() {
    return (
        /* Full-width section: background stretches edge-to-edge */
        <section className="relative overflow-hidden">
            {/* ── Full-width gradient background ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-emerald/5 dark:from-primary/15 dark:via-background dark:to-emerald/10 border-y border-primary/10" />
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-60 h-60 rounded-full bg-emerald/10 blur-3xl" />

            {/* ── Constrained content ── */}
            <div className="container-app relative z-10 py-14 md:py-16">
                <div className="max-w-2xl mx-auto space-y-6 text-center">
                    {/* Icon */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Your Health, Our Priority
                        </h2>
                        <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                            Join thousands of customers who trust MediStore for their daily medicine needs.
                            Sign up today and get{" "}
                            <span className="text-primary font-semibold">10% off</span> your first order.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/25"
                        >
                            Get Started Free
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted active:scale-[0.97] transition-all"
                        >
                            Browse Medicines
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        No credit card required • Free delivery on first order • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}
