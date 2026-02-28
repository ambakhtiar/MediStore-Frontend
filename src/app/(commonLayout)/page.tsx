import HeroBanner from "@/components/modules/homepage/Banner";
import BenefitsStrip from "@/components/modules/homepage/BenefitsStrip";
import WhyUs from "@/components/modules/homepage/WhyUs";
import FeaturedMedicines from "@/components/modules/homepage/FeaturedMedicines";
import { Footer } from "@/components/modules/homepage/footer";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export default function HomePage() {

    return (
        <div className="items-center justify-center">
            <HeroBanner />
            <BenefitsStrip />
            <FeaturedMedicines />
            <WhyUs />
            <Footer />
        </div >
    );
}
