/**
 * Shop Page - Server Component Wrapper
 * Path: src/app/(commonLayout)/shop/page.tsx
 */
import { getCategories } from "@/action/category.action";
import ShopPageClient from "./shop-client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ShopPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Next.js 16 awaits searchParams
    const searchParams = await props.searchParams;

    // Fetch categories on server
    const categoriesRes = await getCategories();
    const categoriesData = categoriesRes?.data?.data;
    const categories = Array.isArray(categoriesData) 
        ? categoriesData 
        : categoriesData?.items 
            ? categoriesData.items 
            : [];

    return (
        <Suspense fallback={<div className="section-padding text-center">Loading shop...</div>}>
            <ShopPageClient categories={categories} searchParams={searchParams ?? {}} />
        </Suspense>
    );
}