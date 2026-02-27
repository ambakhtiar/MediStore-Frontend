import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { MedicineType } from "@/types/medicine.type";
import { getMedicineById } from "@/action/medicine.action";
import { getReviewsByMedicine } from "@/action/review.action";
import AddToCartSection from "@/components/modules/cart/addToCardSection";
import ReviewList from "@/components/modules/review/ReviewList";
import { getSession } from "@/action/user.action";

type Props = { params: { id: string } };

export default async function MedicinePage({ params }: Props) {
    const { id } = await params;

    // Parallel Fetch medicine and reviews  
    const [medicineRes, reviewsRes] = await Promise.all([
        getMedicineById(id, { revalidate: 60 }),
        getReviewsByMedicine(id),
    ]);

    const session = await getSession();
    const user = session?.data?.user ?? null;
    const userRole =
        (user && (user.role ?? (user.rolle as string | undefined))) ?? "CUSTOMER";



    const payload: MedicineType = medicineRes?.data?.data ?? medicineRes?.data ?? null;
    const medicine: MedicineType | null = payload ?? null;

    // Reviews data
    const reviewsData = reviewsRes?.data?.data;
    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.meta?.averageRating;
    const reviewCount = reviewsData?.meta?.reviewCount;

    if (!medicine) {
        if (medicineRes.status === 404) return notFound();
        return (
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center text-red-600">
                    Failed to load medicine details. Please try again later.
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/shop" className="text-blue-600 hover:underline">Shop</Link>
                <span className="mx-2">/</span>
                <span>{medicine.name}</span>
            </nav>

            {/* Medicine Details Section */}
            <div className="flex flex-col md:flex-row justify-baseline gap-8 mb-12">
                {/* Image column */}
                <div className="w-full sm:w-9/12 md:w-1/2 flex flex-col shrink-0">
                    <div className="w-auto rounded-md overflow-hidden mb-2">
                        {medicine.imageUrl ? (
                            <div className="relative w-full aspect-square shrink-0 overflow-hidden rounded-md">
                                <Image
                                    src={encodeURI(medicine.imageUrl)}
                                    alt={medicine.name ?? "Medicine Image"}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-36 flex items-center justify-center text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <div><strong>Manufacturer:</strong> {medicine.manufacturer ?? "—"}</div>
                        <div><strong>Category:</strong> {medicine.category?.name ?? "—"}</div>
                        <div><strong>Stock:</strong> {typeof medicine.stock === "number" ? medicine.stock : "—"}</div>
                    </div>
                </div>

                {/* Details column */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold">{medicine.name}</h1>
                    <p className="text-sm text-gray-600">{medicine.genericName}</p>

                    <div className="">
                        <span className="text-2xl font-extrabold text-gray-900">
                            ৳{Number(medicine.price ?? 0).toFixed(2)}
                        </span>
                        {medicine.price && medicine.price > 0 && (
                            <span className="ml-3 text-sm text-gray-500">incl. VAT (if applicable)</span>
                        )}
                    </div>

                    <div className="prose max-w-none text-gray-700 dark:text-gray-300 mb-3">
                        {
                            medicine.description ? <p>{medicine.description}</p>
                                : <p>No descripption available.</p>
                        }
                    </div>

                    <div className="space-y-2">
                        {medicine.category?.id && (
                            <p className="">
                                <span className="font-semibold">Category: </span>
                                {medicine.category?.name}
                            </p>
                        )}
                    </div>

                    {/* Add to cart section */}
                    <div className="my-3">
                        <AddToCartSection
                            medicineId={medicine.id}
                            maxStock={medicine.stock ?? undefined}
                            initialQty={1}
                            role={userRole}
                        />
                    </div>

                    <div className="text-xs text-gray-500">
                        <div>Seller Name: {String(medicine.seller?.name).toUpperCase()}</div>
                        <div>Last updated: {medicine.updatedAt ? new Date(medicine.updatedAt).toLocaleString() : "—"}</div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Customer Review</h2>
                <ReviewList
                    reviews={reviews}
                    averageRating={averageRating}
                    reviewCount={reviewCount}
                    showMedicine={false}
                    title=""
                />
            </div>
        </main >
    );
}