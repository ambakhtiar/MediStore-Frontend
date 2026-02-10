import { env } from "@/env";
import { ServiceOption } from "@/types";
import { AddToCartPayload, ClientApiResult, UpdateItemPayload } from "@/types/cart.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

const addToCart = async (payload: AddToCartPayload): Promise<ClientApiResult> => {
    const cookieStore = await cookies();
    try {
        const res = await fetch(`${API_URL}/cart/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(payload),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Request failed" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body?.data ?? body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("cart.client.addToCart error:", err);
        return { ok: false, status: 0, data: null, error: { message: "Network error" } };
    }
}

const getCart = async (options?: ServiceOption) => {
    try {
        const config: RequestInit = {};
        if (options?.cache) {
            config.cache = options.cache;
        }
        if (options?.revalidate) {
            config.next = { revalidate: options.revalidate };
        }
        config.next = { ...config.next, tags: ["CartAdd"] };

        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/cart`, {
            ...config,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
        })

        const data = await res.json();
        if (!data) {
            return { data: null, error: { message: "Cart not found" }, };
        }

        // console.log(data);
        return { data, error: null };
    } catch (err) {
        console.log(err);
        return {
            data: null, error: { message: "Cart not found" },
        };
    }
}


async function updateCartItem(payload: UpdateItemPayload) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/cart/items/${payload.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            body: JSON.stringify({ quantity: payload.quantity }),
        });
        // console.log((await res.json()));

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return { ok: false, status: res.status, error: body?.message ?? "Failed to update item" };
        }

        return { ok: true, status: res.status, data: body };
    } catch (err) {
        console.error("updateCartItem error:", err);
        return { ok: false, status: 500, error: "Network error" };
    }
}

async function removeCartItem(id: string) {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/cart/items/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString(),
            },
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return { ok: false, status: res.status, error: body?.message ?? "Failed to remove item" };
        }

        return { ok: true, status: res.status, data: body };
    } catch (err) {
        console.error("removeCartItem error:", err);
        return { ok: false, status: 500, error: "Network error" };
    }
}


export const cartService = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
}