import { Footer2 } from "@/components/footer2";
import HeroBanner from "@/components/layout/Banner";
import BenefitsStrip from "@/components/layout/BenefitsStrip";
import WhyUs from "@/components/layout/WhyUs";


export default function Home() {
    return (
        <div className="items-center justify-center">
            <HeroBanner />
            <BenefitsStrip />
            <WhyUs />
            <Footer2 />
        </div >
    );
}
