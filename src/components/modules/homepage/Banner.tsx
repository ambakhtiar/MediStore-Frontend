import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function HeroBanner() {
    return (
        /* Full-width section: background stretches edge-to-edge, content is constrained */
        <section className="relative overflow-hidden border-b border-border min-h-[70vh] lg:h-[70vh] flex flex-col justify-center">
            {/* ── Full-width background ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-emerald/5 dark:from-primary/15 dark:via-background dark:to-emerald/10" />
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald/10 blur-3xl dark:bg-emerald/15" />

            {/* ── Constrained content ── */}
            <div className="container-app relative z-10 pt-4 pb-10 lg:pt-6 lg:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* LEFT: Text content */}
                <div className="space-y-4">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                        <ShieldCheck className="w-4 h-4" />
                        Bangladesh&apos;s Trusted Online Pharmacy
                    </span>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-foreground">
                        Medicine, <span className="text-primary">Delivered</span>
                        <br />
                        to Your Door
                    </h1>

                    <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                        Genuine medicines from verified sellers, delivered to your doorstep.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/25"
                        >
                            Shop
                            <span aria-hidden>→</span>
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted active:scale-[0.97] transition-all"
                        >
                            Learn More
                        </Link>
                    </div>



                    {/* Social proof */}
                    <p className="text-sm text-muted-foreground">
                        Trusted by{" "}
                        <strong className="text-foreground font-semibold">1,000+</strong>{" "}
                        satisfied customers across Bangladesh
                    </p>
                </div>

                {/* RIGHT: Hero image */}
                <div className="relative w-full h-52 sm:h-64 lg:h-[320px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                    <Image
                        src="https://images.unsplash.com/photo-1576602975754-efdf313b9342?auto=format&fit=crop&w=900&q=80"
                        alt="Pharmacist dispensing verified medicines at MediStore"
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute left-4 bottom-4 glass-card rounded-xl px-4 py-3 shadow-xl">
                        <p className="text-xs font-medium text-muted-foreground">All medicines</p>
                        <p className="text-sm font-bold text-foreground">100% Verified ✓</p>
                    </div>

                    {/* Stats bubble */}
                    <div className="absolute top-4 right-4 glass-card rounded-xl px-3 py-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">Orders today</p>
                        <p className="text-lg font-bold text-primary">240+</p>
                    </div>
                </div>
            </div>
        </section>
    );
}