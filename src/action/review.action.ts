"use server";

/**
 * Review Actions - Complete with Update/Delete
 */

import { reviewService } from "@/services/review.service";
import { revalidatePath } from "next/cache";

/**
 * Create review
 */
export const createReview = async (medicineId: string, payload: { rating: number; comment?: string }) => {
    const result = await reviewService.createReview(medicineId, payload);

    if (result.ok) {
        revalidatePath("/reviews");
        revalidatePath(`/medicine/${medicineId}`);
    }

    return result;
};

/**
 * Update review
 */
export const updateReview = async (reviewId: string, payload: { rating: number; comment?: string }) => {
    const result = await reviewService.updateReview(reviewId, payload);

    if (result.ok) {
        revalidatePath("/reviews");
        // We don't know medicineId here, so revalidate all medicine pages
        revalidatePath("/medicine/[id]", "page");
    }

    return result;
};

/**
 * Delete review
 */
export const deleteReview = async (reviewId: string) => {
    const result = await reviewService.deleteReview(reviewId);

    if (result.ok) {
        revalidatePath("/reviews");
        revalidatePath("/medicine/[id]", "page");
    }

    return result;
};

/**
 * Get reviews by medicine
 */
export const getReviewsByMedicine = async (medicineId: string) => {
    return await reviewService.getReviewsByMedicine(medicineId);
};

/**
 * Get reviews by user
 */
export const getReviewsByUser = async (userId: string) => {
    return await reviewService.getReviewsByUser(userId);
};

/**
 * Get delivered medicines for review
 */
export const getDeliveredMedicinesForReview = async () => {
    return await reviewService.getDeliveredMedicinesForReview();
};