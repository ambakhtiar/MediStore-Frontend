/**
 * Dashboard Types
 * Complete TypeScript definitions for seller and admin dashboards
 */

// ============= MEDICINE TYPES =============

export interface Medicine {
    id: string;
    name: string;
    genericName?: string | null;
    description?: string | null;
    price: number;
    stock: number;
    manufacturer?: string | null;
    imageUrl?: string | null;
    isFeatured: boolean;
    isActive: boolean;
    categoryId?: string | null;
    sellerId?: string | null;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    seller?: {
        id: string;
        name: string;
        email: string;
    };
}

export type CreateMedicineType = Omit<Medicine, "id">;

export interface MedicineFormData {
    name: string;
    genericName?: string;
    description?: string;
    price: number;
    stock: number;
    manufacturer?: string;
    categoryId: string;
    imageUrl?: string;
    isActive: boolean;
}

// ============= CATEGORY TYPES =============

export interface Category {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    isPrescriptionRequired?: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============= USER TYPES =============

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";
export type UserStatus = "UNBAN" | "BAN";

// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified: boolean;
//     image?: string | null;
//     phone?: string | null;
//     role: UserRole;
//     status: UserStatus;
//     createdAt: string;
//     updatedAt: string;
// }

// ============= ORDER TYPES =============

// export type OrderStatus =
//     | "PLACED"
//     | "CONFIRMS"
//     | "PROCESSING"
//     | "SHIPPED"
//     | "DELIVERED"
//     | "CANCELLED";

// export interface OrderItem {
//     id: string;
//     orderId: string;
//     medicineId: string;
//     quantity: number;
//     unitPrice: number;
//     orderItemStatus: OrderStatus;
//     createdAt: string;
//     updatedAt: string;
//     medicine: Medicine;
// }

// export interface Order {
//     id: string;
//     userId: string;
//     total: number;
//     status: OrderStatus;
//     shippingName?: string | null;
//     shippingPhone: string;
//     shippingAddress: string;
//     createdAt: string;
//     updatedAt: string;
//     items: OrderItem[];
//     user?: User;
// }

// ============= DASHBOARD STATS TYPES =============

export interface SellerStats {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
    lowStockItems: number;
}

export interface AdminStats {
    totalUsers?: number;
    totalCustomers?: number;
    totalSellers?: number;
    bannedUsers?: number;
    totalOrders?: number;
    pendingOrders?: number;
    deliveredOrders?: number;
    cancelledOrders?: number;
    totalRevenue?: number;
    totalMedicines?: number;
    activeMedicines?: number;
    featuredMedicines?: number;
}

// ============= API RESPONSE TYPES =============

export interface ApiResponse<T = unknown> {
    ok: boolean;
    status: number;
    data?: {
        message?: string;
        data?: T;
    } | null;
    error?: {
        message: string;
    } | null;
}

// ============= FILTER/SEARCH TYPES =============

export interface MedicineFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    manufacturer?: string;
    stock?: number;
    isActive?: boolean;
    prescriptionRequired?: boolean;
    sortBy?: "price" | "name" | "createdAt";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}