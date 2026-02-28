/**
 * Seller Service
 * 
 * Handles all seller-related API calls:
 * - Medicine CRUD operations
 * - Seller orders
 * - Dashboard statistics
 */

import { env } from "@/env";
import { CreateMedicineType, MedicineType } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

// ============= MEDICINE OPERATIONS =============

/**
 * Get seller's medicines
 * GET /api/seller/medicines
 */
const getMedicines = async () => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/medicines/seller`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to fetch medicines" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.getMedicines error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Add medicine
 * POST /api/seller/medicines
 */
const addMedicine = async (payload: CreateMedicineType) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/medicines`, {
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
                error: { message: body?.message ?? "Failed to add medicine" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.addMedicine error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Update medicine
 * PUT /api/seller/medicines/:id
 */
const updateMedicine = async (id: string, payload: Partial<MedicineType>) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/medicines/${id}`, {
            method: "PUT",
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
                error: { message: body?.message ?? "Failed to update medicine" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.updateMedicine error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Delete medicine
 * DELETE /api/seller/medicines/:id
 */
const deleteMedicine = async (id: string) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/medicines/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to delete medicine" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.deleteMedicine error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

// ============= ORDER OPERATIONS =============

/**
 * Get seller's orders
 * GET /api/seller/orders
 */
const getOrders = async () => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to fetch orders" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.getOrders error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Update order item status
 * PATCH /api/seller/order-item/:id/status
 */
const updateOrderItemStatus = async (orderItemId: string, status: string) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/seller/order-item/${orderItemId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({ status }),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res) {
            return {
                ok: false,
                // status: res?.status,
                data: null,
                error: { message: body?.message ?? "Failed to update status" },
            };
        }
        // console.log(body);
        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("seller.service.updateOrderItemStatus error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export const sellerService = {
    // Medicines
    getMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,

    // Orders
    getOrders,
    updateOrderItemStatus,
};