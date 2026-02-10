"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCartItem, updateCartItem } from "@/action/cart.action";
import { CartItemType } from "@/types/cart.type";

export default function CartItemControls({ item }: { item: CartItemType }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const broadcast = () => {
        try {
            const bc = new BroadcastChannel("cart");
            bc.postMessage({ type: "cart-updated" });
            bc.close();
        } catch { }
    };

    const changeQty = async (newQty: number) => {
        if (newQty < 1) return;
        setLoading(true);
        const res = await updateCartItem(item.id, newQty);
        setLoading(false);
        if (!res.ok) {
            toast.error(res.error?.message ?? "Update failed");
            return;
        }
        toast.success("Quantity updated");
        broadcast();
        router.refresh();
    };

    const removeItem = async () => {
        if (!confirm("Remove this item from cart?")) return;
        setLoading(true);
        const res = await deleteCartItem(item.id);
        setLoading(false);
        if (!res.ok) {
            toast.error(res.error?.message ?? "Remove failed");
            return;
        }
        toast.success("Item removed");
        broadcast();
        router.refresh();
    };

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => changeQty(item.quantity - 1)} disabled={loading}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => changeQty(item.quantity + 1)} disabled={loading}>+</button>
            <button onClick={removeItem} disabled={loading} className="text-red-600">DELETE</button>
        </div>
    );
}