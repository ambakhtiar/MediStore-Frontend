"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MedicineType } from "@/types/medicine.type";
import AddToCartSection from "@/components/modules/cart/addToCardSection";
import ReviewList from "@/components/modules/review/ReviewList";
import { ShieldCheck, Truck, RotateCcw, Activity } from "lucide-react";
import { getMedicineById } from "@/action/medicine.action";
import { getReviewsByMedicine } from "@/action/review.action";
import { authClient } from "@/lib/auth-client";

export default function MedicinePageClient({
    medicineId,
    initialMedicine,
    initialReviews,
    averageRating,
    reviewCount,
}: {
    medicineId: string;
    initialMedicine: MedicineType | null;
    initialReviews: any[];
    averageRating?: number | null;
    reviewCount?: number | null;
}) {
    const { data: session } = authClient.useSession();
    const userRole = (session?.user as any)?.role ?? "CUSTOMER";

    const [mainImage, setMainImage] = useState<string>("");
    
    // Fallback if multiple images were supported via comma-separated string, otherwise just use single image
    const images = initialMedicine?.imageUrl 
        ? initialMedicine.imageUrl.split(",").map(i => i.trim()) 
        : ["/placeholder.svg"];

    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0]);
        }
    }, [initialMedicine]);

    if (!initialMedicine) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center text-red-600">
                    Failed to load medicine details. Please try again later.
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-8">
                <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{initialMedicine.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 mb-16">
                {/* Image Gallery Column */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border bg-white shadow-sm">
                        {mainImage !== "/placeholder.svg" ? (
                            <Image
                                src={encodeURI(mainImage)}
                                alt={initialMedicine.name ?? "Medicine Image"}
                                fill
                                className="object-contain p-8"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                                No image available
                            </div>
                        )}
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {initialMedicine.isFeatured && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full shadow-sm">
                                    Featured
                                </span>
                            )}
                            {(initialMedicine.stock ?? 0) === 0 && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full shadow-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Gallery (Mocked if only 1 image) */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                        mainImage === img ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground"
                                    }`}
                                >
                                    <Image src={encodeURI(img)} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                            {initialMedicine.name}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-4">
                            {initialMedicine.genericName}
                        </p>
                        
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-4xl font-extrabold text-primary">
                                ৳{Number(initialMedicine.price ?? 0).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-6">
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                <Activity className="w-4 h-4" />
                                <span className="font-semibold">{initialMedicine.category?.name ?? "Uncategorized"}</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">Mfg: <span className="font-medium text-foreground">{initialMedicine.manufacturer ?? "Unknown"}</span></span>
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-8 border-b pb-8">
                        {initialMedicine.description || "No description provided for this medicine."}
                    </p>

                    {/* Add to Cart logic */}
                    <div className="bg-muted/30 p-6 rounded-xl border mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-medium">Availability:</span>
                            {(initialMedicine.stock ?? 0) > 0 ? (
                                <span className="text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                                    In Stock ({initialMedicine.stock})
                                </span>
                            ) : (
                                <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                        
                        <AddToCartSection
                            medicineId={initialMedicine.id}
                            maxStock={initialMedicine.stock ?? undefined}
                            initialQty={1}
                            role={userRole}
                        />
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <span className="text-xs font-medium">100% Genuine<br/>Products</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Truck className="w-8 h-8 text-primary" />
                            <span className="text-xs font-medium">Fast<br/>Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <RotateCcw className="w-8 h-8 text-primary" />
                            <span className="text-xs font-medium">Easy<br/>Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 pt-12 border-t">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
                <ReviewList
                    reviews={initialReviews}
                    averageRating={averageRating ?? undefined}
                    reviewCount={reviewCount ?? undefined}
                    showMedicine={false}
                    title=""
                />
            </div>
        </main>
    );
}
