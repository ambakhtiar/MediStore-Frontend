"use server";

/**
 * Category Actions - Complete CRUD
 */

import { categoryService } from "@/services/category.service";
import { revalidatePath } from "next/cache";

/**
 * Get all categories
 */
export const getCategories = async () => {
    return await categoryService.getAll();
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string) => {
    return await categoryService.getById(id);
};

/**
 * Create new category (Admin only)
 */
export const createCategory = async (data: {
    name: string;
    slug?: string;
    description?: string;
    isPrescriptionRequired?: boolean;
}) => {
    const result = await categoryService.create(data);

    if (result.ok) {
        revalidatePath("/admin/categories");
        revalidatePath("/shop");
    }

    return result;
};

/**
 * Update category (Admin only)
 */
export const updateCategory = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        isPrescriptionRequired?: boolean;
    }
) => {
    const result = await categoryService.update(id, data);

    if (result.ok) {
        revalidatePath("/admin/categories");
        revalidatePath("/shop");
    }

    return result;
};

/**
 * Delete category (Admin only)
 */
export const deleteCategory = async (id: string) => {
    const result = await categoryService.delete(id);

    if (result.ok) {
        revalidatePath("/admin/categories");
        revalidatePath("/shop");
    }

    return result;
};