import type { Metadata } from "next";
import HeroBanner          from "@/components/modules/homepage/Banner";
import BenefitsStrip       from "@/components/modules/homepage/BenefitsStrip";
import CategoriesSection   from "@/components/modules/homepage/CategoriesSection";
import FeaturedMedicines   from "@/components/modules/homepage/FeaturedMedicines";
import HowItWorks          from "@/components/modules/homepage/HowItWorks";
import StatsSection        from "@/components/modules/homepage/StatsSection";
import WhyUs               from "@/components/modules/homepage/WhyUs";
import Testimonials        from "@/components/modules/homepage/Testimonials";
import FaqSection          from "@/components/modules/homepage/FaqSection";
import NewsletterCta       from "@/components/modules/homepage/NewsletterCta";
import { Footer }          from "@/components/modules/homepage/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "MediStore — Your Trusted Online Medicine Shop",
    description:
        "Order genuine medicines online with fast delivery across Bangladesh. Verified sellers, 5000+ products, cash on delivery.",
};

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* 1. Hero Banner */}
            <HeroBanner />

            {/* 2. Benefits Strip */}
            <BenefitsStrip />

            {/* 3. Shop by Category */}
            <CategoriesSection />

            {/* 4. Featured Medicines (4 cols × 2 rows = 8 cards) */}
            <FeaturedMedicines limit={8} />

            {/* 5. How It Works */}
            <HowItWorks />

            {/* 6. Statistics / Social Proof */}
            <StatsSection />

            {/* 7. Why Choose Us */}
            <WhyUs />

            {/* 8. Customer Testimonials */}
            <Testimonials />

            {/* 9. FAQ */}
            <FaqSection />

            {/* 10. CTA / Newsletter */}
            <NewsletterCta />

            {/* 11. Footer */}
            <Footer />
        </div>
    );
}
