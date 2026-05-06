import { UserPlus, Search, ShoppingCart, Truck } from "lucide-react";

const STEPS = [
    {
        step: "01",
        icon: UserPlus,
        title: "Create Your Account",
        description: "Sign up in seconds with your email or Google account. No complicated forms.",
    },
    {
        step: "02",
        icon: Search,
        title: "Find Your Medicine",
        description: "Search by name, generic name, or browse by category. Filter by price and availability.",
    },
    {
        step: "03",
        icon: ShoppingCart,
        title: "Add to Cart & Checkout",
        description: "Add items to your cart, enter your address, and confirm your order in just a few clicks.",
    },
    {
        step: "04",
        icon: Truck,
        title: "Receive at Your Door",
        description: "Your medicines are packed securely and delivered straight to your doorstep.",
    },
];

export default function HowItWorks() {
    return (
        <section className="section-padding section-screen">
            <div className="container-app">
            {/* Header */}
            <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                    Simple Process
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    How MediStore Works
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                    Ordering medicines online has never been easier. Follow these 4 simple steps.
                </p>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {STEPS.map(({ step, icon: Icon, title, description }, i) => (
                    <div key={step} className="relative flex flex-col items-center text-center gap-4 group flex-1">
                        {/* Step circle */}
                        <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/10 flex flex-col items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
                            <Icon className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                            <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                                {step}
                            </span>
                        </div>

                        {/* Arrow connector */}
                        {i < STEPS.length - 1 && (
                            <div className="hidden lg:flex absolute top-10 left-[65%] w-[70%] items-center justify-center pointer-events-none z-0 text-primary/30">
                                <div className="h-[2px] w-full border-t-2 border-dashed border-primary/30 mr-1" />
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-primary/40">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        )}

                        <div className="mt-2">
                            <h3 className="font-bold text-foreground text-base">{title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    );
}
