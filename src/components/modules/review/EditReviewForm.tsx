"use client";

/**
 * Edit Review Form Component
 * Form for updating existing review
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import StarRating from "./StarRating";
import { updateReview } from "@/action/review.action";
import { toast } from "sonner";
import { Review } from "@/types/review.type";
import Image from "next/image";
import * as z from "zod";


const reviewSchema = z.object({
    rating: z
        .number()
        .min(1, "Rating is required")
        .max(5, "Maximum rating is 5"),

    comment: z
        .string()
        .max(500, "Comment must be 500 characters or less"),
});

interface EditReviewFormProps {
    review: Review;
}

export default function EditReviewForm({ review }: EditReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(review.rating);

    const form = useForm({
        defaultValues: {
            rating: review.rating,
            comment: review.comment ?? "",
        },
        validators: {
            onSubmit: reviewSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Updating review...");

            try {
                const result = await updateReview(review.medicineId, {
                    rating: value.rating,
                    comment: value.comment || undefined,
                });

                if (!result.ok) {
                    toast.error(result.error?.message || "Failed to update review", {
                        id: toastId,
                    });
                    return;
                }

                toast.success("Review updated successfully!", { id: toastId });
                router.push("/reviews?tab=my-reviews");
                router.refresh();
            } catch (error) {
                console.error("Update review error:", error);
                toast.error("Something went wrong", { id: toastId });
            }
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Your Review</CardTitle>
                <CardDescription>
                    Update your rating and comments
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Medicine Info */}
                {review.medicine && (
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted">
                        {review.medicine.imageUrl && (
                            <Image
                                src={review.medicine.imageUrl}
                                alt={review.medicine.name}
                                width={48}
                                height={48}
                                className="rounded object-cover"
                            />
                        )}
                        <div>
                            <p className="font-medium">{review.medicine.name}</p>
                            {review.medicine.genericName && (
                                <p className="text-sm text-muted-foreground">
                                    {review.medicine.genericName}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <form
                    id="edit-review-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        {/* Rating */}
                        <form.Field name="rating">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Rating <span className="text-red-500">*</span>
                                        </FieldLabel>

                                        <div className="py-2">
                                            <StarRating
                                                rating={rating}
                                                onChange={(newRating) => {
                                                    setRating(newRating);
                                                    field.handleChange(newRating);
                                                }}
                                                size={24}
                                            />
                                        </div>

                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Comment */}
                        <form.Field name="comment">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Comment (Optional)
                                        </FieldLabel>

                                        <Textarea
                                            name={field.name}
                                            id={field.name}
                                            placeholder="Share your experience with this medicine..."
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            onBlur={field.handleBlur}
                                            rows={4}
                                            maxLength={500}
                                        />

                                        <div className="flex justify-between mt-1">
                                            <div>
                                                {isInvalid && (
                                                    <FieldError
                                                        errors={field.state.meta.errors}
                                                    />
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                {field.state.value.length}/500
                                            </p>
                                        </div>
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </FieldGroup>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="edit-review-form"
                            className="flex-1"
                        >
                            Update Review
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}