import Image from "next/image";
import { Package, ShieldCheck, Leaf, Clock } from "lucide-react";

const FEATURES = [
    {
        icon: Package,
        title: "Wide Product Range",
        description:
            "From everyday OTC medicines to specialty drugs — we have over 5,000 verified products across all major categories.",
    },
    {
        icon: ShieldCheck,
        title: "Quality Assurance",
        description:
            "Every medicine on MediStore is sourced directly from licensed manufacturers and verified pharmacists.",
    },
    {
        icon: Leaf,
        title: "Eco-Friendly Packaging",
        description:
            "We use 100% recyclable packaging to minimize environmental impact while keeping your medicines safe.",
    },
    {
        icon: Clock,
        title: "On-Time Delivery",
        description:
            "Our logistics network ensures your order reaches you on time, every time — tracked end-to-end.",
    },
];

export default function WhyUs() {
    return (
        <section className="section-padding section-screen">
            <div className="container-app">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* LEFT */}
                <div className="space-y-8">
                    <div>
                        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">
                            Why Choose Us
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                            Our Commitment to Your Health
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
                            We believe healthcare should be accessible, affordable, and reliable.
                            Here&apos;s what sets MediStore apart.
                        </p>
                    </div>

                    <ul className="space-y-5">
                        {FEATURES.map(({ icon: Icon, title, description }) => (
                            <li key={title} className="flex items-start gap-4 group">
                                <div className="flex-none w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{title}</h3>
                                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT: Image */}
                <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl border border-border">
                    <Image
                        src="https://images.unsplash.com/photo-1604145942179-63cd583fcf64?auto=format&fit=crop&w=800&q=80"
                        alt="MediStore quality assurance — pharmacist checking medicines"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />

                    {/* Stat card */}
                    <div className="absolute bottom-6 left-6 glass-card rounded-xl px-5 py-4 shadow-lg max-w-[180px]">
                        <p className="text-3xl font-extrabold text-primary">98%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Customer Satisfaction Rate</p>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}