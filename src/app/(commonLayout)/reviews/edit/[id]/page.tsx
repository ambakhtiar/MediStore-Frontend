/**
 * Edit Review Page
 * Path: src/app/reviews/edit/[id]/page.tsx
 */

import { notFound, redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import EditReviewForm from "@/components/modules/review/EditReviewForm";

// Get review by ID (you'll need to add this to review service)
async function getReview(reviewId: string) {
    // This should be added to review.service.ts
    try {
        const res = await fetch(`${process.env.API_URL}/reviews/${reviewId}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data;
    } catch {
        return null;
    }
}

export default async function EditReviewPage({
    params
}: {
    params: { id: string }
}) {
    const { id } = await params;

    // Get current user
    const sessionRes = await userService.getSession();
    const currentUser = sessionRes.data?.user;

    if (!currentUser) {
        redirect("/login");
    }

    // Get review
    const review = await getReview(id);

    if (!review) {
        return notFound();
    }

    // Check if user owns this review
    if (review.userId !== currentUser.id) {
        redirect("/reviews");
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Review</h1>
                <p className="text-muted-foreground">
                    Update your review for {review.medicine?.name}
                </p>
            </div>

            <EditReviewForm review={review} />
        </main>
    );
}