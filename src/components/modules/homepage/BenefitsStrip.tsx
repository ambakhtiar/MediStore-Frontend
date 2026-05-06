import { Truck, CreditCard, MapPin, HeadphonesIcon, ShieldCheck, Zap } from "lucide-react";

const BENEFITS = [
    {
        icon: Truck,
        title: "Free Shipping",
        subtitle: "On orders over ৳600",
        color: "text-primary bg-primary/10",
    },
    {
        icon: CreditCard,
        title: "Cash on Delivery",
        subtitle: "100% secure payments",
        color: "text-emerald bg-emerald/10",
    },
    {
        icon: MapPin,
        title: "Home Delivery",
        subtitle: "64 districts covered",
        color: "text-primary bg-primary/10",
    },
    {
        icon: HeadphonesIcon,
        title: "24/7 Support",
        subtitle: "Always here for you",
        color: "text-emerald bg-emerald/10",
    },
    {
        icon: ShieldCheck,
        title: "Verified Medicines",
        subtitle: "100% authentic products",
        color: "text-primary bg-primary/10",
    },
    {
        icon: Zap,
        title: "Express Delivery",
        subtitle: "Same-day in Dhaka",
        color: "text-emerald bg-emerald/10",
    },
];

export default function BenefitsStrip() {
    return (
        <section aria-label="Benefits of MediStore" className="section-padding section-screen">
            <div className="container-app">
            {/* Section header */}
            <div className="text-center mb-10">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                    Why MediStore?
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Everything You Need, All in One Place
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {BENEFITS.map(({ icon: Icon, title, subtitle, color }) => (
                    <div
                        key={title}
                        className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    );
}