"use client";

import { getCart } from "@/action/cart.action";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

type CartContextType = {
    cartCount: number;
    setCartCount: (count: number) => void;
    refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Helper: fetch cart count from a client API route */
async function fetchCartCountFromApi(): Promise<number | undefined> {
    try {
        const res = await getCart();
        // console.log(res?.data?.data?.cartCount);
        if (!res || res.error) return undefined;
        const body = res?.data?.data ?? null;
        return typeof body?.cartCount === "number" ? body.cartCount : undefined;
    } catch (err) {
        console.error("fetchCartCountFromApi error:", err);
        return undefined;
    }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState<number>(0);

    // memoized refresh function — deps array provided (empty here)
    const refreshCart = useCallback(async () => {
        try {
            const count = await fetchCartCountFromApi();
            if (typeof count === "number") {
                setCartCount(count);
            }
        } catch (error) {
            console.error("Failed to refresh cart:", error);
        }
    }, []); // <-- dependency array required

    // initial load: call refreshCart inside an async function in effect
    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await refreshCart();
        })();
        return () => {
            mounted = false;
        };
    }, [refreshCart]);

    // cross-tab / cross-component updates: BroadcastChannel + localStorage fallback
    useEffect(() => {
        let bc: BroadcastChannel | null = null;

        const onStorage = (e: StorageEvent) => {
            if (e.key === "cart-sync") {
                // fallback: re-fetch authoritative count
                refreshCart();
            }
        };

        try {
            bc = new BroadcastChannel("cart");
            bc.onmessage = (ev) => {
                if (ev.data?.type === "cart-updated") {
                    if (typeof ev.data.count === "number") {
                        setCartCount(ev.data.count);
                    } else {
                        // no count provided — re-fetch authoritative value
                        refreshCart();
                    }
                }
            };
        } catch (err) {
            // BroadcastChannel not available — use storage fallback
            window.addEventListener("storage", onStorage);
        }

        return () => {
            bc?.close();
            window.removeEventListener("storage", onStorage);
        };
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};