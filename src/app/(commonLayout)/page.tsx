import { Footer2 } from "@/components/layout/footer2";
import HeroBanner from "@/components/layout/Banner";
import BenefitsStrip from "@/components/layout/BenefitsStrip";
import WhyUs from "@/components/layout/WhyUs";
import FeaturedMedicines from "@/components/layout/FeaturedMedicines";


export default function Home() {

    return (
        <div className="items-center justify-center">
            <HeroBanner />
            <BenefitsStrip />
            <FeaturedMedicines />
            <WhyUs />
            <Footer2 />
        </div >
    );
}
