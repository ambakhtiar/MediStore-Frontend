// "use client";

// /**
//  * Reviews Hub Component
//  * Path: src/components/modules/review/ReviewsHub.tsx
//  *
//  * - Accepts optional userId (provided from server page)
//  * - Fetches pending delivered medicines (for review) and user's reviews (if userId provided)
//  * - Uses defensive response normalization and proper effect dependencies
//  */

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { getDeliveredMedicinesForReview, getReviewsByUser } from "@/action/review.action";
// import type { DeliveredMedicine, Review } from "@/types/review.type";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import ReviewList from "@/components/modules/review/ReviewList";
// import Image from "next/image";
// import { toast } from "sonner";

// type Props = {
//     userId?: string;
// };

// export default function ReviewsHub({ userId }: Props) {
//     const searchParams = useSearchParams();
//     const defaultTab = searchParams?.get("tab") ?? "pending";

//     const [pendingMedicines, setPendingMedicines] = useState<DeliveredMedicine[]>([]);
//     const [myReviews, setMyReviews] = useState<Review[]>([]);
//     const [loading, setLoading] = useState(true);

//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             // Always fetch pending delivered medicines
//             const pendingPromise = getDeliveredMedicinesForReview();

//             // Only fetch user reviews if we have a userId
//             const reviewsPromise = userId ? getReviewsByUser(userId) : Promise.resolve({ data: { data: { reviews: [] } }, ok: false });

//             const [pendingRes, reviewsRes] = await Promise.all([pendingPromise, reviewsPromise]);
//             console.log(pendingRes, reviewsRes);
//             // Normalize pending medicines response
//             const pendingRaw = pendingRes?.data?.data ?? pendingRes?.data ?? null;
//             const pendingList: DeliveredMedicine[] = Array.isArray(pendingRaw)
//                 ? pendingRaw : [];

//             setPendingMedicines(pendingList);

//             // If userId was not provided, show a friendly toast and skip setting reviews
//             if (!userId) {
//                 toast.error("You must be signed in to view your reviews.");
//                 setMyReviews([]);
//             } else {
//                 // Normalize reviews response
//                 const reviewsRaw = reviewsRes?.data?.data ?? null;
//                 const reviewsList: Review[] = Array.isArray(reviewsRaw?.reviews)
//                     ? reviewsRaw.reviews
//                     : Array.isArray(reviewsRaw)
//                         ? reviewsRaw
//                         : [];
//                 setMyReviews(reviewsList);
//             }
//         } catch (err) {
//             console.error("Failed to fetch review data:", err);
//             toast.error("Failed to load review data");
//             setPendingMedicines([]);
//             setMyReviews([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [userId]);

//     useEffect(() => {
//         let mounted = true;
//         (async () => {
//             if (!mounted) return;
//             await fetchData();
//         })();
//         return () => {
//             mounted = false;
//         };
//     }, [fetchData]);

//     const pendingCount = useMemo(() => pendingMedicines.length, [pendingMedicines]);
//     const reviewsCount = useMemo(() => myReviews.length, [myReviews]);

//     if (loading) {
//         return (
//             <main className="max-w-4xl mx-auto p-6">
//                 <div className="text-center py-12">
//                     <p>Loading...</p>
//                 </div>
//             </main>
//         );
//     }

//     return (
//         <main className="max-w-4xl mx-auto p-6">
//             {/* Header */}
//             <div className="mb-6">
//                 <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
//                 <p className="text-muted-foreground">Write and manage your product reviews</p>
//             </div>

//             {/* Tabs */}
//             <Tabs defaultValue={defaultTab} className="w-full">
//                 <div className="mb-4 flex items-center justify-between">
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="pending">Pending Reviews ({pendingCount})</TabsTrigger>
//                         <TabsTrigger value="my-reviews">My Reviews ({reviewsCount})</TabsTrigger>
//                     </TabsList>

//                     <div>
//                         <Link href="/shop">
//                             <Button variant="outline" size="sm">
//                                 Browse Shop
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Tab 1: Pending Reviews */}
//                 <TabsContent value="pending" className="mt-6">
//                     {pendingMedicines.length === 0 ? (
//                         <Card>
//                             <CardContent className="py-12 text-center">
//                                 <p className="text-muted-foreground">No products to review</p>
//                                 <Link href="/shop" className="mt-4 inline-block">
//                                     <Button variant="outline">Shop Now</Button>
//                                 </Link>
//                             </CardContent>
//                         </Card>
//                     ) : (
//                         <div className="space-y-4">
//                             {pendingMedicines.map((medicine) => (
//                                 <Card key={medicine.medicineId}>
//                                     <CardContent className="p-4 flex items-center gap-4">
//                                         {/* Medicine Image */}
//                                         <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border">
//                                             {medicine.medicineImage ? (
//                                                 <Image
//                                                     src={encodeURI(medicine.medicineImage)}
//                                                     alt={medicine.medicineName}
//                                                     width={64}
//                                                     height={64}
//                                                     className="h-full w-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <div className="flex h-full w-full items-center justify-center bg-gray-100">
//                                                     <span className="text-xs text-gray-400">No Image</span>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Medicine Info */}
//                                         <div className="flex-1">
//                                             <h3 className="font-semibold">{medicine.medicineName}</h3>
//                                             {medicine.genericName && (
//                                                 <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
//                                             )}
//                                             <p className="text-xs text-muted-foreground mt-1">
//                                                 Delivered from Order #{String(medicine.orderId).slice(0, 8)}
//                                             </p>
//                                         </div>

//                                         {/* Review Button */}
//                                         <div>
//                                             <Link href={`/reviews/create/${medicine.medicineId}`}>
//                                                 <Button size="sm">Write Review</Button>
//                                             </Link>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                         </div>
//                     )}
//                 </TabsContent>

//                 {/* Tab 2: My Reviews */}
//                 <TabsContent value="my-reviews" className="mt-6">
//                     <Card>
//                         <CardContent>
//                             {myReviews.length === 0 ? (
//                                 <div className="text-muted-foreground">You havent written any reviews yet.</div>
//                             ) : (
//                                 <ReviewList reviews={myReviews} showMedicine={true} title="My Reviews" />
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </main>
//     );
// }


"use client";

/**
 * Reviews Hub Page (Refactored)
 * Now accepts optional userId from server
 * Clean + Safe + Proper normalization
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDeliveredMedicinesForReview, getReviewsByUser } from "@/action/review.action";
import type { DeliveredMedicine, Review } from "@/types/review.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReviewCard from "@/components/modules/review/ReviewCard";
import Image from "next/image";
import { toast } from "sonner";

type Props = {
    userId?: string;
};

export default function ReviewsHubPage({ userId }: Props) {
    const searchParams = useSearchParams();
    const defaultTab = searchParams?.get("tab") ?? "pending";

    const [pendingMedicines, setPendingMedicines] = useState<DeliveredMedicine[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const pendingPromise = getDeliveredMedicinesForReview();

            const reviewsPromise = userId
                ? getReviewsByUser(userId)
                : Promise.resolve({ data: { data: { reviews: [] } }, ok: false });

            const [pendingRes, reviewsRes] = await Promise.all([
                pendingPromise,
                reviewsPromise,
            ]);

            // Normalize pending
            const pendingRaw = pendingRes?.data?.data ?? pendingRes?.data ?? null;
            const pendingList: DeliveredMedicine[] = Array.isArray(pendingRaw)
                ? pendingRaw
                : [];

            setPendingMedicines(pendingList);

            if (!userId) {
                toast.error("You must be signed in to view your reviews.");
                setMyReviews([]);
            } else {
                const reviewsRaw = reviewsRes?.data?.data ?? null;

                const reviewsList: Review[] = Array.isArray(reviewsRaw?.reviews)
                    ? reviewsRaw.reviews
                    : Array.isArray(reviewsRaw)
                        ? reviewsRaw
                        : [];

                setMyReviews(reviewsList);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            toast.error("Failed to load review data");
            setPendingMedicines([]);
            setMyReviews([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRemoveReview = async (id: string) => {
        // Remove from My Reviews instantly
        setMyReviews((prev) => prev.filter((review) => review.id !== id));

        // Re-fetch pending medicines
        const pendingRes = await getDeliveredMedicinesForReview();

        const pendingRaw = pendingRes?.data?.data ?? pendingRes?.data ?? null;

        const pendingList: DeliveredMedicine[] = Array.isArray(pendingRaw)
            ? pendingRaw
            : [];

        setPendingMedicines(pendingList);

    };

    const pendingCount = useMemo(
        () => pendingMedicines.length,
        [pendingMedicines]
    );

    const reviewsCount = useMemo(
        () => myReviews.length,
        [myReviews]
    );

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
                <p className="text-muted-foreground">
                    Manage your product reviews
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={defaultTab} className="w-full">
                <div className="mb-4 flex items-center justify-between">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pending">
                            Pending Reviews ({pendingCount})
                        </TabsTrigger>
                        <TabsTrigger value="my-reviews">
                            My Reviews ({reviewsCount})
                        </TabsTrigger>
                    </TabsList>

                    <Link href="/shop">
                        <Button variant="outline" size="sm">
                            Browse Shop
                        </Button>
                    </Link>
                </div>

                {/* Pending Reviews */}
                <TabsContent value="pending" className="mt-6">
                    {pendingMedicines.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No pending reviews
                                </p>
                                <Link href="/shop" className="mt-4 inline-block">
                                    <Button variant="outline">Browse Products</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pendingMedicines.map((medicine) => (
                                <Card key={medicine.medicineId}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                                            {medicine.medicineImage ? (
                                                <Image
                                                    src={encodeURI(medicine.medicineImage)}
                                                    alt={medicine.medicineName}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                    <span className="text-xs text-gray-400">
                                                        No Image
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {medicine.medicineName}
                                            </h3>
                                            {medicine.genericName && (
                                                <p className="text-sm text-muted-foreground">
                                                    {medicine.genericName}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Delivered from Order #
                                                {String(medicine.orderId).slice(0, 8)}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/reviews/create/${medicine.medicineId}`}
                                        >
                                            <Button size="sm">Write Review</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* My Reviews */}
                <TabsContent value="my-reviews" className="mt-6">
                    {myReviews.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    You haven’t reviewed any products yet
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    showMedicine={true}
                                    showActions={true}
                                    currentUserId={userId}
                                    onDeleteSuccess={handleRemoveReview}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}