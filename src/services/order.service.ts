import { env } from "@/env";
import { CreateOrderPayload, OrderApiResponse, OrdersListApiResponse, StatusHistoryApiResponse } from "@/types/order.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

/**
 * Order Service
 * Handles all order-related API calls
 */

/**
 * Create a new order from cart items
 * POST /api/orders
 */
const createOrder = async (payload: CreateOrderPayload): Promise<OrderApiResponse> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders`, {
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
                error: { message: body?.message ?? "Failed to create order" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.createOrder error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export type OrderParams = {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    minTotal?: number;
    maxTotal?: number;
};

/**
 * Get all orders
 * GET /api/orders
 */
const getOrders = async (params: OrderParams = {}): Promise<OrdersListApiResponse> => {
    const cookieStore = await cookies();

    try {
        const url = new URL(`${API_URL}/orders`);
        if (params.search) url.searchParams.append("search", params.search);
        if (params.status) url.searchParams.append("status", params.status);
        if (params.startDate) url.searchParams.append("startDate", params.startDate);
        if (params.endDate) url.searchParams.append("endDate", params.endDate);
        if (params.page) url.searchParams.append("page", params.page.toString());
        if (params.limit) url.searchParams.append("limit", params.limit.toString());
        if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder) url.searchParams.append("sortOrder", params.sortOrder);
        if (params.minTotal !== undefined) url.searchParams.append("minTotal", params.minTotal.toString());
        if (params.maxTotal !== undefined) url.searchParams.append("maxTotal", params.maxTotal.toString());

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store", // Always fetch fresh data
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
        console.error("order.service.getOrders error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Update order status (Admin only)
 * PATCH /api/orders/:id/status
 */
const updateOrderStatusByAdmin = async (id: string, status: string): Promise<OrderApiResponse> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/admin/order/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({ status }),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to update order status" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.updateOrderStatusByAdmin error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Get a single order by ID
 * GET /api/orders/:id
 */
const getOrder = async (orderId: string): Promise<OrderApiResponse> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
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
                error: { message: body?.message ?? "Failed to fetch order" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.getOrder error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Cancel an order (customer)
 * PATCH /api/orders/:id/cancel
 */
const cancelOrder = async (orderId: string): Promise<OrderApiResponse> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
            method: "PATCH",
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
                error: { message: body?.message ?? "Failed to cancel order" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.cancelOrder error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};


const getOrderStatusHistory = async (orderId: string): Promise<StatusHistoryApiResponse> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/${orderId}/status-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store", // Always get fresh data
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Status history আনা যায়নি" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.getOrderStatusHistory error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export const orderService = {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    getOrderStatusHistory,
    updateOrderStatusByAdmin
};