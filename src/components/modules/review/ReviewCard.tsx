import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./StarRating";
import { Review } from "@/types/review.type";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

interface ReviewCardProps {
    review: Review;
    showMedicine?: boolean;
}

export default function ReviewCard({ review, showMedicine = false }: ReviewCardProps) {
    // Get user initials for avatar fallback
    const initials = review.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    return (
        <Card>
            <CardContent className="p-6">
                {/* Medicine Info (if showMedicine is true) */}
                {showMedicine && review.medicine && (
                    <Link href={`/shop/${review.medicine.id}`}>
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
                                        locale: bn,
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

                    {/* Verified Purchase Badge (future feature) */}
                    {/* <div className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified Purchase</span>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    );
}