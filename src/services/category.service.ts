/**
 * Category Service - Complete CRUD
 * All category-related API calls
 */

import { env } from "@/env";
import { ApiResponse, Category } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

/**
 * Get all categories
 * GET /api/categories
 */
const getAll = async (): Promise<ApiResponse<Category[]>> => {
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
        console.error("category.service.getAll error:", err);
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
const getById = async (id: string): Promise<ApiResponse<Category>> => {
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
        console.error("category.service.getById error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Create category (Admin only)
 * POST /api/categories
 */
const create = async (data: {
    name: string;
    slug?: string;
    description?: string;
    isPrescriptionRequired?: boolean;
}): Promise<ApiResponse<Category>> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to create category" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("category.service.create error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
const update = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        isPrescriptionRequired?: boolean;
    }
): Promise<ApiResponse<Category>> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                error: { message: body?.message ?? "Failed to update category" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("category.service.update error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
const deleteCat = async (id: string): Promise<ApiResponse<Category>> => {
    const cookieStore = await cookies();

    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
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
                error: { message: body?.message ?? "Failed to delete category" },
            };
        }

        return {
            ok: true,
            status: res.status,
            data: body ?? null,
            error: null,
        };
    } catch (err) {
        console.error("category.service.delete error:", err);
        return {
            ok: false,
            status: 0,
            data: null,
            error: { message: "Network error" }
        };
    }
};

export const categoryService = {
    getAll,
    getById,
    create,
    update,
    delete: deleteCat,
};