import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        q: "Are all medicines on MediStore genuine and safe?",
        a: "Yes. Every medicine listed on MediStore is sourced directly from licensed manufacturers and verified distributors. We perform quality checks before listing any product.",
    },
    {
        q: "Do I need a prescription to order medicines?",
        a: "Some medicines (marked with 'Rx') require a valid prescription. You will be asked to upload a scanned copy during checkout. OTC medicines can be ordered freely.",
    },
    {
        q: "How long does delivery take?",
        a: "Delivery within Dhaka typically takes 4–8 hours (same-day). For other districts, it takes 1–3 business days depending on your location.",
    },
    {
        q: "Can I return medicines if I receive the wrong product?",
        a: "Absolutely. If you receive the wrong product or it is damaged, contact our support team within 24 hours of delivery and we will arrange a free replacement or refund.",
    },
    {
        q: "What payment methods are accepted?",
        a: "We currently accept Cash on Delivery (COD). Online payment methods (bKash, Nagad, card) are coming soon.",
    },
    {
        q: "How do I track my order?",
        a: "Once your order is confirmed, you can track its status in real-time from your account dashboard under 'My Orders'.",
    },
];

export default function FaqSection() {
    return (
        <section className="section-padding">
            <div className="container-app">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                        Got Questions?
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                        Can&apos;t find an answer?{" "}
                        <a href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                            Contact our support team
                        </a>
                        .
                    </p>
                </div>

                {/* FAQ list — using native <details> for zero JS, accessible accordion */}
                <div className="space-y-3">
                    {FAQS.map(({ q, a }, i) => (
                        <details
                            key={i}
                            className="group rounded-2xl border border-border bg-card overflow-hidden"
                        >
                            <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 text-sm font-semibold text-card-foreground list-none hover:bg-muted/40 transition-colors">
                                <span>{q}</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                            </summary>
                            <div className="px-5 pb-5 pt-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
            </div>
        </section>
    );
}
