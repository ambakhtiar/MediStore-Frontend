import { ShieldCheck, Truck, Clock, HeartPulse } from "lucide-react";

export const metadata = {
    title: "About Us | MediStore",
    description: "Learn more about MediStore, your trusted online medicine shop in Bangladesh.",
};

export default function AboutPage() {
    return (
        <div className="section-padding py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    About <span className="text-primary">MediStore</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    We are Bangladesh&apos;s leading digital healthcare platform, dedicated to making genuine medicines accessible, affordable, and convenient for everyone.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
                <div className="p-8 rounded-2xl glass-card border-l-4 border-l-primary shadow-sm hover:shadow-lg transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-primary" />
                        Our Mission
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        To simplify healthcare by providing a reliable platform where patients can seamlessly connect with verified pharmacies, ensuring authentic medications reach their doorsteps on time.
                    </p>
                </div>
                <div className="p-8 rounded-2xl glass-card border-l-4 border-l-emerald shadow-sm hover:shadow-lg transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-emerald" />
                        Our Vision
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        To become the most trusted and widespread healthcare partner in Bangladesh, fostering a healthier society through technology and unwavering commitment to quality.
                    </p>
                </div>
            </div>

            {/* Core Values */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
                <div className="grid sm:grid-cols-3 gap-8">
                    {[
                        { icon: ShieldCheck, title: "100% Genuine", desc: "All medicines are sourced directly from authorized manufacturers." },
                        { icon: Truck, title: "Fast Delivery", desc: "Get your medications delivered quickly across all 64 districts." },
                        { icon: Clock, title: "24/7 Support", desc: "Our team of pharmacists and support staff are always ready to help." }
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
