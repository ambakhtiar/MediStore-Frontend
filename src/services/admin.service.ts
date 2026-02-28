import { env } from "@/env";
import { Medicine, Order, User } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

/**
 * Get all users
 * GET /api/admin/users
 */
const getAllUsers = async () => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/admin/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store",
        });

        const body = await res.json().catch(() => null);
        return res.ok ? { ok: true, data: body, error: null } :
            { ok: false, data: null, error: { message: body?.message } };
    } catch (err) {
        return { ok: false, data: null, error: { message: "Network error" } };
    }
};

/**
 * Update user status (BAN/UNBAN)
 * PATCH /api/admin/users/:id
 */
const updateUserStatus = async (userId: string, status: "BAN" | "UNBAN") => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({ status }),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);
        return res.ok ? { ok: true, data: body, error: null } :
            { ok: false, data: null, error: { message: body?.message } };
    } catch (err) {
        return { ok: false, data: null, error: { message: "Network error" } };
    }
};

/**
 * Update medicine featured status (Admin only)
 * PATCH /api/admin/medicines/:id/featured
 */
const toggleFeatured = async (medicineId: string, isFeatured: boolean) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/admin/medicines/${medicineId}/featured`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({ isFeatured }),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);
        return res.ok ? { ok: true, data: body, error: null } :
            { ok: false, data: null, error: { message: body?.message } };
    } catch (err) {
        return { ok: false, data: null, error: { message: "Network error" } };
    }
};

// ============= STATISTICS =============

/**
 * Get dashboard statistics
 * This will be calculated from existing data
 */
const getDashboardStats = async () => {
    const cookieStore = await cookies();

    try {
        // Fetch all necessary data
        const [usersRes, ordersRes, medicinesRes] = await Promise.all([
            fetch(`${API_URL}/admin/users`, {
                headers: { Cookie: cookieStore.toString() },
                credentials: "include",
            }),
            fetch(`${API_URL}/orders`, {
                headers: { Cookie: cookieStore.toString() },
                credentials: "include",
            }),
            fetch(`${API_URL}/medicines`, {
                headers: { Cookie: cookieStore.toString() },
                credentials: "include",
            }),
        ]);

        const users = await usersRes.json().catch(() => ({ data: [] }));
        const orders = await ordersRes.json().catch(() => ({ data: [] }));
        const medicines = await medicinesRes.json().catch(() => ({ data: [] }));


        // Calculate statistics
        const userData = users?.data || [];
        const orderData = orders?.data || [];
        const medicineData = medicines?.data?.data || [];

        // console.log(userData, orderData, medicineData);

        const stats = {
            totalUsers: userData.length,
            totalCustomers: userData.filter((u: User) => u.role === "CUSTOMER").length,
            totalSellers: userData.filter((u: User) => u.role === "SELLER").length,
            bannedUsers: userData.filter((u: User) => u.status === "BAN").length,

            totalOrders: orderData.length,
            pendingOrders: orderData.filter((o: Order) => o.status === "PLACED").length,
            deliveredOrders: orderData.filter((o: Order) => o.status === "DELIVERED").length,
            cancelledOrders: orderData.filter((o: Order) => o.status === "CANCELLED").length,

            totalRevenue: orderData
                .filter((o: Order) => o.status !== "CANCELLED")
                .reduce((sum: number, o: Order) => sum + (o.total || 0), 0),

            totalMedicines: medicineData.length,
            activeMedicines: medicineData.filter((m: Medicine) => m.isActive).length,
            featuredMedicines: medicineData.filter((m: Medicine) => m.isFeatured).length,
        };

        return {
            ok: true,
            status: 200,
            data: { data: stats },
            error: null,
        };
    } catch (err) {
        console.error("admin.service.getDashboardStats error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Failed to fetch statistics" }
        };
    }
};



const updateOrderStatus = async (orderId: string, status: string) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/admin/order/${orderId}/status`, {
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
                error: { message: body?.message ?? "Failed to update status" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.updateStatus error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Get order status history
 * GET /api/orders/:id/status-history
 */
const getStatusHistory = async (orderId: string) => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/orders/${orderId}/status-history`, {
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
                error: { message: body?.message ?? "Failed to fetch history" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("order.service.getStatusHistory error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    toggleFeatured,
    getDashboardStats,
    updateOrderStatus,
    getStatusHistory
};