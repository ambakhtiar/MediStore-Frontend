"use server";

import { OrderParams, orderService } from "@/services/order.service";
import { CreateOrderPayload } from "@/types/order.type";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Fetch all orders (Admin/Seller/Customer)
 */
export const getAllOrders = async (params: OrderParams = {}) => {
    return await orderService.getOrders(params);
};

export const getOrders = getAllOrders;

export const updateOrderStatusByAdmin = async (id: string, status: string) => {
    const res = await orderService.updateOrderStatusByAdmin(id, status);
    if (res.ok) {
        revalidatePath("/admin/orders");
    }
    return res;
};

/**
 * Create Order Action
 * - Creates order from cart items
 * - Revalidates cart (will be empty after order)
 * - Revalidates orders list
 */
export const createOrder = async (payload: CreateOrderPayload) => {
    const result = await orderService.createOrder(payload);

    if (result.ok) {
        // Cart will be cleared by backend, so revalidate cart
        revalidateTag("CartAdd", "max");

        // Revalidate orders list page
        revalidatePath("/orders");
    }

    return result;
};

/**
 * Get Single Order Action
 * Fetches a single order by ID
 */
export const getOrder = async (orderId: string) => {
    return await orderService.getOrder(orderId);
};

export const cancelOrder = async (orderId: string) => {
    const result = await orderService.cancelOrder(orderId);

    if (result.ok) {
        // Revalidate orders list
        revalidatePath("/orders");
        revalidatePath(`/orders/${orderId}`);
    }

    return result;
};

/* Returns:
* [
* { status: "PLACED", changedAt: "2026-02-20 10:30 AM" },
* { status: "CONFIRMS", changedAt: "2026-02-21 2:15 PM" }
* ]
*/
export const getOrderStatusHistory = async (orderId: string) => {
    return await orderService.getOrderStatusHistory(orderId);
};