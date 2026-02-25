"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // initialize from URL
    const [search, setSearch] = useState<string>(searchParams.get("search") ?? "");
    const [category, setCategory] = useState<string>(searchParams.get("category") ?? "");
    const [manufacturer, setManufacturer] = useState<string>(searchParams.get("manufacturer") ?? "");
    const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") ?? "");
    const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") ?? "");
    const [inStock, setInStock] = useState<boolean>(searchParams.get("inStock") === "true");
    const [isFeatured, setIsFeatured] = useState<boolean>(searchParams.get("isFeatured") === "true");

    // keep local state in sync if user navigates with back/forward
    useEffect(() => {
        setSearch(searchParams.get("search") ?? "");
        setCategory(searchParams.get("category") ?? "");
        setManufacturer(searchParams.get("manufacturer") ?? "");
        setMinPrice(searchParams.get("minPrice") ?? "");
        setMaxPrice(searchParams.get("maxPrice") ?? "");
        setInStock(searchParams.get("inStock") === "true");
        setIsFeatured(searchParams.get("isFeatured") === "true");
    }, [searchParams]);

    const applyFilters = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault();

            const params = new URLSearchParams();

            if (search.trim()) params.set("search", search.trim());
            if (category.trim()) params.set("category", category.trim());
            if (manufacturer.trim()) params.set("manufacturer", manufacturer.trim());
            if (minPrice.trim()) params.set("minPrice", minPrice.trim());
            if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
            if (inStock) params.set("inStock", "true");
            if (isFeatured) params.set("isFeatured", "true");

            // reset to first page when filters change
            params.delete("page");

            const query = params.toString();
            const url = query ? `/shop?${query}` : "/shop";

            // navigate — server page will re-run and fetch with new params
            router.push(url);
        },
        [search, category, manufacturer, minPrice, maxPrice, inStock, isFeatured, router]
    );

    const clearFilters = useCallback(() => {
        setSearch("");
        setCategory("");
        setManufacturer("");
        setMinPrice("");
        setMaxPrice("");
        setInStock(false);
        setIsFeatured(false);
        router.push("/shop");
    }, [router]);

    return (
        <form onSubmit={applyFilters} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search medicines..."
                    className="input w-full"
                />
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="input w-full"
                />
                <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="Manufacturer"
                    className="input w-full"
                />
                <div className="flex gap-2">
                    <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min price"
                        className="input w-1/2"
                    />
                    <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max price"
                        className="input w-1/2"
                    />
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="checkbox"
                    />
                    <span className="text-sm">In stock only</span>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="checkbox"
                    />
                    <span className="text-sm">Featured</span>
                </label>
            </div>

            <div className="mt-3 flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={clearFilters}>
                    Clear
                </Button>
                <Button type="submit">Apply</Button>
            </div>
        </form>
    );
}