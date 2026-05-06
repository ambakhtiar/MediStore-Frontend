import { Star, Quote } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
    {
        name: "Fatima Akter",
        role: "Regular Customer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
        rating: 5,
        comment:
            "MediStore has been a lifesaver! I can order my mother's monthly medicines without stepping outside. Delivery is always on time and the packaging is excellent.",
    },
    {
        name: "Md. Rafiqul Islam",
        role: "Verified Buyer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul",
        rating: 5,
        comment:
            "Genuine medicines at affordable prices. The pharmacist support team helped me verify my prescription instantly. Highly recommended for everyone!",
    },
    {
        name: "Sharmin Nahar",
        role: "Healthcare Professional",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sharmin",
        rating: 5,
        comment:
            "As a nurse, I trust MediStore for sourcing authentic medicines. Their product range covers almost everything I recommend to patients.",
    },
    {
        name: "Arif Hossain",
        role: "Business Owner",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arif",
        rating: 4,
        comment:
            "Ordered for my family during an emergency at midnight. Got the delivery within 6 hours. The customer support was incredibly responsive!",
    },
];

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < count ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                />
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="section-padding section-screen">
            <div className="container-app">
            {/* Header */}
            <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                    What Customers Say
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Trusted by Thousands
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                    Real stories from real customers who rely on MediStore for their healthcare needs.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {TESTIMONIALS.map((t) => (
                    <div
                        key={t.name}
                        className="relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {/* Quote icon */}
                        <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />

                        {/* Stars */}
                        <StarRating count={t.rating} />

                        {/* Comment */}
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                            &ldquo;{t.comment}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                                <Image
                                    src={t.avatar}
                                    alt={t.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    );
}
