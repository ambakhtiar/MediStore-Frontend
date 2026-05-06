import FaqSection from "@/components/modules/homepage/FaqSection";

export const metadata = {
    title: "FAQ | MediStore",
    description: "Frequently asked questions about MediStore.",
};

export default function FAQPage() {
    return (
        <div className="py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <FaqSection />
        </div>
    );
}
