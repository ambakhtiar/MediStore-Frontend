/**
 * Shop Page - Server Component Wrapper
 * Path: src/app/shop/page.tsx
 * 
 * This is a server component that fetches initial data
 * and passes it to the client component
 */

import { getCategories } from "@/action/category.action";
import ShopPageClient from "./shop-client";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";


export default async function ShopPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Fetch categories on server
    const categoriesRes = await getCategories();
    const categories = categoriesRes?.data?.data || [];

    // Pass to client component
    return <ShopPageClient categories={categories} searchParams={searchParams} />;
}