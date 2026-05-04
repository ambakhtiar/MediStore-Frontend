import { Users, Package, ShoppingBag, Star } from "lucide-react";

const STATS = [
    { icon: Users,       value: "10,000+", label: "Happy Customers",    color: "text-white" },
    { icon: Package,     value: "5,000+",  label: "Verified Medicines", color: "text-white" },
    { icon: ShoppingBag, value: "25,000+", label: "Orders Delivered",   color: "text-white" },
    { icon: Star,        value: "4.9 / 5", label: "Average Rating",     color: "text-white" },
];

export default function StatsSection() {
    return (
        /* Full-width section: background stretches edge-to-edge */
        <section className="relative overflow-hidden">
            {/* ── Full-width gradient background ── */}
            <div className="absolute inset-0 gradient-brand" />
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-52 h-52 rounded-full bg-white/10 blur-3xl" />

            {/* ── Constrained content ── */}
            <div className="container-app relative z-10 py-14 md:py-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Trusted by Thousands Across Bangladesh
                    </h2>
                    <p className="mt-2 text-white/75 text-sm max-w-md mx-auto">
                        Our numbers speak for themselves. MediStore is growing every day with the trust of our customers.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {STATS.map(({ icon: Icon, value, label }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-extrabold text-white">{value}</p>
                                <p className="text-sm text-white/80 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
