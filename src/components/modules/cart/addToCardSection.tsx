// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { addToCart } from "@/action/cart.action";

// type Props = {
//     medicineId: string;
//     initialQty?: number;
//     maxStock?: number | undefined;
//     className?: string;
// };

// export default function AddToCartSection({
//     medicineId,
//     initialQty = 1,
//     maxStock,
//     className,
// }: Props) {
//     const [qty, setQty] = useState<number>(initialQty);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const currentAbsoluteUrl = () => {
//         try {
//             return window.location.href;
//         } catch {
//             return "/";
//         }
//     };

//     const handleAdd = async () => {
//         if (!Number.isInteger(qty) || qty < 1) {
//             toast.error("Quantity must be at least 1");
//             return;
//         }
//         if (typeof maxStock === "number" && qty > maxStock) {
//             toast.error(`Only ${maxStock} item(s) available`);
//             return;
//         }

//         setLoading(true);
//         const toastId = toast.loading?.("Adding to cart...");

//         try {
//             const res = await addToCart({ medicineId, quantity: qty });

//             if (!res.ok) {
//                 if (res.status === 403) {
//                     toast.dismiss?.(toastId);
//                     toast.error("Please sign in to add items to cart");
//                     const cb = encodeURIComponent(currentAbsoluteUrl());
//                     router.push(`/auth/login?callbackUrl=${cb}`);
//                     return;
//                 }
//                 toast.error(res.error?.message ?? "Failed to add to cart", { id: toastId });
//                 return;
//             }

//             const successMessage = (res.data as { message?: string })?.message ?? "Added to cart";

//             toast.success(successMessage, { id: toastId });
//             router.refresh();

//         } catch (err) {
//             console.error("Add to cart failed:", err);
//             toast.error("Network error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col md:flex-row items-start gap-2">
//             <div className="flex">
//                 <button
//                     type="button"
//                     onClick={() => setQty((s) => Math.max(1, s - 1))}
//                     aria-label="Decrease quantity"
//                     className="w-9 h-9 flex items-center justify-center rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50"
//                     disabled={qty <= 1}
//                 >
//                     −
//                 </button>

//                 <input
//                     type="number"
//                     min={1}
//                     value={qty}
//                     onChange={(e) => {
//                         const v = Number(e.target.value || 1);
//                         if (Number.isNaN(v)) return;
//                         const n = Math.floor(v);
//                         if (typeof maxStock === "number") setQty(Math.max(1, Math.min(maxStock, n)));
//                         else setQty(Math.max(1, n));
//                     }}
//                     className="w-20 text-center border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
//                     aria-label="Quantity"
//                     inputMode="numeric"
//                 />

//                 <button
//                     type="button"
//                     onClick={() => setQty((s) => (typeof maxStock === "number" ? Math.min(maxStock, s + 1) : s + 1))}
//                     aria-label="Increase quantity"
//                     className="w-9 h-9 flex items-center justify-center rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50"
//                     disabled={typeof maxStock === "number" && qty >= maxStock}
//                 >
//                     +
//                 </button>
//             </div>
//             <Button onClick={handleAdd} disabled={loading} variant="default">
//                 {loading ? "Adding..." : "Add to Cart"}
//             </Button>
//         </div>
//     );
// }


// src/components/modules/cart/AddToCartSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addToCart } from "@/action/cart.action";
import { Roles } from "@/constants/roles";

type Props = {
    medicineId: string;
    initialQty?: number;
    maxStock?: number | undefined;
    className?: string;
    role?: string;
};

export default function AddToCartSection({
    medicineId,
    initialQty = 1,
    maxStock,
    className,
    role = "CUSTOMER",
}: Props) {
    const [qty, setQty] = useState<number>(initialQty);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // const isRoleRestricted = role === Roles.seller || Roles.admin;
    const normalizedRole = String(role ?? "").toUpperCase();
    const isRoleRestricted = normalizedRole === Roles.seller || normalizedRole === Roles.admin;


    const currentAbsoluteUrl = () => {
        try {
            return window.location.href;
        } catch {
            return "/";
        }
    };

    const handleAdd = async () => {
        if (isRoleRestricted) {
            toast.error("Sellers and admins cannot add items to cart");
            return;
        }

        if (!Number.isInteger(qty) || qty < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }
        if (typeof maxStock === "number" && qty > maxStock) {
            toast.error(`Only ${maxStock} item(s) available`);
            return;
        }

        setLoading(true);
        const toastId = toast.loading?.("Adding to cart...");

        try {
            const res = await addToCart({ medicineId, quantity: qty });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.dismiss?.(toastId);
                    toast.error("Please sign in to add items to cart");
                    const cb = encodeURIComponent(currentAbsoluteUrl());
                    router.push(`/auth/login?callbackUrl=${cb}`);
                    return;
                }
                toast.error(res.error?.message ?? "Failed to add to cart", { id: toastId });
                return;
            }

            const successMessage = (res.data as { message?: string })?.message ?? "Added to cart";
            toast.success(successMessage, { id: toastId });
            router.refresh();
        } catch (err) {
            console.error("Add to cart failed:", err);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    // tooltip id for aria-describedby
    const tooltipId = `add-to-cart-tooltip-${medicineId}`;

    return (
        <div className={`flex flex-col md:flex-row items-start gap-2 ${className ?? ""}`}>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setQty((s) => Math.max(1, s - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={qty <= 1 || isRoleRestricted}
                    title={isRoleRestricted ? "Sellers and admins cannot change quantity" : "Decrease quantity"}
                >
                    −
                </button>

                <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => {
                        const v = Number(e.target.value || 1);
                        if (Number.isNaN(v)) return;
                        const n = Math.floor(v);
                        if (typeof maxStock === "number") setQty(Math.max(1, Math.min(maxStock, n)));
                        else setQty(Math.max(1, n));
                    }}
                    className="w-20 text-center border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    aria-label="Quantity"
                    inputMode="numeric"
                    disabled={isRoleRestricted}
                    title={isRoleRestricted ? "Sellers and admins cannot change quantity" : "Quantity"}
                />

                <button
                    type="button"
                    onClick={() => setQty((s) => (typeof maxStock === "number" ? Math.min(maxStock, s + 1) : s + 1))}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={(typeof maxStock === "number" && qty >= maxStock) || isRoleRestricted}
                    title={isRoleRestricted ? "Sellers and admins cannot change quantity" : "Increase quantity"}
                >
                    +
                </button>
            </div>

            {/* Wrapper provides hover/focus area for tooltip even when button is disabled */}
            <div className="relative group inline-block">
                <Button
                    onClick={handleAdd}
                    disabled={loading || isRoleRestricted}
                    variant="default"
                    aria-describedby={isRoleRestricted ? tooltipId : undefined}
                    className="flex items-center"
                >
                    {loading ? "Adding..." : isRoleRestricted ? "Not available" : "Add to Cart"}
                </Button>

                {/* Tooltip: visible on hover or focus within the wrapper */}
                {isRoleRestricted && (
                    <div
                        id={tooltipId}
                        role="status"
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50"
                    >
                        Sellers and admins cannot add items to cart
                    </div>
                )}
            </div>
        </div>
    );
}