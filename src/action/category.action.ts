"use server";

/**
 * Category Actions
 * Server actions for category operations
 */

import { categoryService } from "@/services/category.service";

/**
 * Get all categories
 */
export const getCategories = async () => {
    return await categoryService.getAllCategories();
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string) => {
    return await categoryService.getCategoryById(id);
};