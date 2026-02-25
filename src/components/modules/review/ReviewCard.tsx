"use client";

/**
 * Review Card Component - With Edit/Delete
 * Single review display with edit and delete options
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StarRating from "./StarRating";
import { Review } from "@/types/review.type";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { deleteReview } from "@/action/review.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewCardProps {
    review: Review;
    showMedicine?: boolean;
    showActions?: boolean; // Show edit/delete buttons
    currentUserId?: string; // To check if user can edit/delete 
    onDeleteSuccess?: (id: string) => void;
}

export default function ReviewCard({
    review,
    showMedicine = false,
    showActions = false,
    currentUserId,
    onDeleteSuccess
}: ReviewCardProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Check if current user owns this review
    const canModify = showActions && currentUserId && review.userId === currentUserId;

    // Get user initials for avatar fallback
    const initials = review.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting review...");

        const result = await deleteReview(review.id);

        if (result.ok) {
            toast.success("Review deleted successfully", { id: toastId });
            setDeleteDialogOpen(false);

            onDeleteSuccess?.(review.id);
            router.push("/reviews?tab=pending");
            router.refresh();
        } else {
            toast.error(result.error?.message || "Failed to delete review", { id: toastId });
        }
    };

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    {/* Medicine Info (if showMedicine is true) */}
                    {showMedicine && review.medicine && (
                        <Link href={`/medicine/${review.medicine.id}`}>
                            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                                {/* Medicine Image */}
                                {review.medicine.imageUrl ? (
                                    <Image
                                        src={review.medicine.imageUrl}
                                        alt={review.medicine.name}
                                        width={48}
                                        height={48}
                                        className="rounded object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-background rounded flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">No Image</span>
                                    </div>
                                )}

                                {/* Medicine Name */}
                                <div>
                                    <p className="font-medium">{review.medicine.name}</p>
                                    {review.medicine.genericName && (
                                        <p className="text-sm text-muted-foreground">
                                            {review.medicine.genericName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Review Content */}
                    <div className="space-y-4">
                        {/* User Info & Rating */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {/* User Avatar */}
                                <Avatar>
                                    <AvatarImage src={review.user?.image || undefined} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>

                                {/* User Name & Date */}
                                <div>
                                    <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(review.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <StarRating rating={review.rating} readonly />
                        </div>

                        {/* Review Comment */}
                        {review.comment && (
                            <p className="text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}

                        {/* Edit/Delete Actions */}
                        {canModify && (
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/reviews/edit/${review.id}`)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}