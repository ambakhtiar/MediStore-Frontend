/**
 * Category Service
 * Handles category-related API calls
 */

import { env } from "@/env";
import { ApiResponse, Category } from "@/types/dashboard.type";

const API_URL = env.API_URL;

/**
 * Get all categories
 * GET /api/categories
 */
const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to fetch categories" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("category.service.getAllCategories error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Get category by ID
 * GET /api/categories/:id
 */
const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to fetch category" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("category.service.getCategoryById error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export const categoryService = {
    getAllCategories,
    getCategoryById,
};