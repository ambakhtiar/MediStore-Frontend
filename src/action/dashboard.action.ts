"use server";

/**
 * Seller Actions
 */

import { sellerService } from "@/services/seller.service";
import { adminService } from "@/services/admin.service";
import { revalidatePath } from "next/cache";
import { MedicineType } from "@/types";

// ============= SELLER MEDICINE ACTIONS =============

export const getSellerMedicines = async () => {
    return await sellerService.getMedicines();
};

export const addMedicine = async (payload: MedicineType) => {
    const result = await sellerService.addMedicine(payload);

    if (result.ok) {
        revalidatePath("/seller/medicines");
        revalidatePath("/shop");
    }

    return result;
};

export const updateMedicine = async (id: string, payload: Partial<MedicineType>) => {
    const result = await sellerService.updateMedicine(id, payload);

    if (result.ok) {
        revalidatePath("/seller/medicines");
        revalidatePath(`/medicine/${id}`);
        revalidatePath("/shop");
    }

    return result;
};

export const deleteMedicine = async (id: string) => {
    const result = await sellerService.deleteMedicine(id);

    if (result.ok) {
        revalidatePath("/seller/medicines");
        revalidatePath("/shop");
    }

    return result;
};

// ============= SELLER ORDER ACTIONS =============

export const getSellerOrders = async () => {
    return await sellerService.getOrders();
};

export const updateOrderItemStatus = async (orderItemId: string, status: string) => {
    const result = await sellerService.updateOrderItemStatus(orderItemId, status);

    if (result.ok) {
        revalidatePath("/seller/orders");
        revalidatePath("/admin/orders");
    }

    return result;
};

// ============= ADMIN USER ACTIONS =============

export const getAllUsers = async () => {
    return await adminService.getAllUsers();
};

export const updateUserStatus = async (userId: string, status: "BAN" | "UNBAN") => {
    const result = await adminService.updateUserStatus(userId, status);

    if (result.ok) {
        revalidatePath("/admin/users");
    }

    return result;
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId: string, status: string) => {
    const result = await adminService.updateOrderStatus(orderId, status);

    if (result.ok) {
        revalidatePath("/admin/orders");
        revalidatePath("/orders");
        revalidatePath(`/orders/${orderId}`);
    }

    return result;
};

// Get order status history
export const getOrderStatusHistory = async (orderId: string) => {
    return await adminService.getStatusHistory(orderId);
};

// ============= ADMIN STATS ACTIONS =============

export const getAdminDashboardStats = async () => {
    return await adminService.getDashboardStats();
};