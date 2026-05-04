import { notFound } from "next/navigation";
import type { MedicineType } from "@/types/medicine.type";
import { getMedicineById } from "@/action/medicine.action";
import { getReviewsByMedicine } from "@/action/review.action";
import MedicinePageClient from "./medicine-client";

type Props = { params: Promise<{ id: string }> };

export default async function MedicinePage(props: Props) {
    const params = await props.params;
    const { id } = params;

    // Parallel Fetch medicine and reviews  
    const [medicineRes, reviewsRes] = await Promise.all([
        getMedicineById(id, { revalidate: 60 }),
        getReviewsByMedicine(id),
    ]);

    const payload: MedicineType = medicineRes?.data?.data ?? medicineRes?.data ?? null;
    const medicine: MedicineType | null = payload ?? null;

    // Reviews data
    const reviewsData = reviewsRes?.data?.data;
    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.meta?.averageRating;
    const reviewCount = reviewsData?.meta?.reviewCount;

    if (!medicine && medicineRes?.status === 404) {
        return notFound();
    }

    return (
        <MedicinePageClient
            medicineId={id}
            initialMedicine={medicine}
            initialReviews={reviews}
            averageRating={averageRating}
            reviewCount={reviewCount}
        />
    );
}