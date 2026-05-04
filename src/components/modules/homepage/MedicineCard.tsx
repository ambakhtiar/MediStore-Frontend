import Image from "next/image";
import Link from "next/link";
import { Star, Package } from "lucide-react";
import type { MedicineType } from "@/types/medicine.type";

// ─── Skeleton ─────────────────────────────────────────────
export function MedicineCardSkeleton() {
    return (
        <div className="flex flex-col h-[340px] rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
            <div className="h-44 w-full bg-muted" />
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded mt-auto" />
                <div className="h-9 w-full bg-muted rounded-lg" />
            </div>
        </div>
    );
}

// ─── Card ──────────────────────────────────────────────────
export default function MedicineCard({
    id,
    name,
    genericName,
    price,
    stock,
    imageUrl,
    category,
    isFeatured,
}: MedicineType) {
    const safeUrl = imageUrl ? imageUrl : null;
    const inStock = (stock ?? 0) > 0;

    return (
        <article className="group flex flex-col h-full min-h-[360px] rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300">
            {/* Image */}
            <div className="relative h-48 w-full bg-muted overflow-hidden flex-shrink-0 border-b border-border/40">
                {safeUrl ? (
                    <Image
                        src={safeUrl}
                        alt={name ?? "Medicine image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Package className="w-8 h-8 opacity-40" />
                        <span className="text-xs">No image</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {isFeatured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-sm tracking-wide uppercase">
                            Featured
                        </span>
                    )}
                    {!inStock && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-destructive text-white shadow-sm tracking-wide uppercase">
                            Out of stock
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Category */}
                {category?.name && (
                    <span className="text-[11px] font-medium text-primary uppercase tracking-wide">
                        {category.name}
                    </span>
                )}

                <h3 className="text-sm font-semibold text-card-foreground leading-snug line-clamp-1">
                    {name}
                </h3>

                {genericName && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{genericName}</p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-base font-bold text-primary">
                        ৳{Number(price ?? 0).toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.5
                    </span>
                </div>

                {/* CTA */}
                <Link
                    href={`/shop/${id}`}
                    className={`mt-1 w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors
                        ${inStock
                            ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                            : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                        }`}
                >
                    View Details
                </Link>
            </div>
        </article>
    );
}