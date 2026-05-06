import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import type { MedicineType } from "@/types/medicine.type";
import MedicineCard, { MedicineCardSkeleton } from "./MedicineCard";
import { Suspense } from "react";

async function MedicineList({ limit }: { limit: number }) {
    const { data } = await medicineService.getAllMedicine(
        { limit: String(limit), isFeatured: true, page: "1" },
        { revalidate: 60 }
    );
    const medicines: MedicineType[] = data?.data?.data ?? [];

    if (!medicines.length) {
        return (
            <div className="col-span-4 py-12 text-center text-muted-foreground">
                No featured medicines right now.
            </div>
        );
    }

    return (
        <>
            {medicines.map((m) => (
                <MedicineCard key={m.id} {...m} />
            ))}
        </>
    );
}

export default function FeaturedMedicines({ limit = 8 }: { limit?: number }) {
    return (
        <section className="section-padding section-screen">
            <div className="container-app">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 gap-4">
                <div>
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">
                        Top Picks
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Featured Medicines
                    </h2>
                </div>
                <Link
                    href="/shop"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                    View All
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <Suspense
                    fallback={Array.from({ length: limit }, (_, i) => (
                        <MedicineCardSkeleton key={i} />
                    ))}
                >
                    <MedicineList limit={limit} />
                </Suspense>
            </div>
            </div>
        </section>
    );
}