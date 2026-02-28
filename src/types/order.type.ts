// Order Types (Updated with Status History)

import { User } from "./user.type";

export type OrderStatus =
    | "PLACED"
    | "PROCESSING"
    | "CONFIRMS"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export enum OrderStatusEnum {
    PLACED = "PLACED",
    PROCESSING = "PROCESSING",
    CONFIRMS = "CONFIRMS",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

// Status History Entry
export interface OrderStatusHistory {
    id: string;
    orderId: string;
    status: OrderStatus;
    changedAt: string;
    changedBy?: string | null;
    notes?: string | null;
    createdAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    medicineId: string;
    quantity: number;
    unitPrice: number;
    orderItemStatus: OrderStatus;
    createdAt: string;
    updatedAt: string;
    medicine: {
        id: string;
        name: string;
        imageUrl?: string | null;
        genericName?: string | null;
        manufacturer?: string | null;
    };
}

export interface Order {
    id: string;
    userId: string;
    total: number;
    status: OrderStatus;
    shippingName: string | null;
    shippingPhone: string;
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    statusHistory?: OrderStatusHistory[];
    user: User
}

// Create Order Request
export interface CreateOrderPayload {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
}

// API Response Types
export interface OrderApiResponse {
    ok: boolean;
    status: number;
    data?: {
        message?: string;
        data?: Order;
    } | null;
    error?: {
        message: string;
    } | null;
}

export interface OrdersListApiResponse {
    ok: boolean;
    status: number;
    data?: {
        message?: string;
        data?: Order[];
    } | null;
    error?: {
        message: string;
    } | null;
}

export interface StatusHistoryApiResponse {
    ok: boolean;
    status: number;
    data?: {
        message?: string;
        data?: OrderStatusHistory[];
    } | null;
    error?: {
        message: string;
    } | null;
}