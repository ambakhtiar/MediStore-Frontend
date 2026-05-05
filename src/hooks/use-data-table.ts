"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type DataTableParams = {
    search?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    [key: string]: any;
};

export function useDataTable(defaultSortBy = "createdAt", defaultLimit = 10) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchParamsString = searchParams.toString();

    // Get current params from URL
    const params = useMemo(() => {
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || defaultLimit.toString());
        const sortBy = searchParams.get("sortBy") || defaultSortBy;
        const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

        // Extract other filters
        const filters: Record<string, string> = {};
        const currentParams = new URLSearchParams(searchParamsString);
        currentParams.forEach((value, key) => {
            if (!["search", "page", "limit", "sortBy", "sortOrder"].includes(key)) {
                filters[key] = value;
            }
        });

        return { search, page, limit, sortBy, sortOrder, ...filters } as DataTableParams;
    }, [searchParamsString, defaultSortBy, defaultLimit]);

    // Update URL helper
    const updateUrl = useCallback((newParams: Partial<DataTableParams>) => {
        const query = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                query.delete(key);
            } else {
                query.set(key, value.toString());
            }
        });

        // Always reset to page 1 if search or filters change, unless page is explicitly set
        if (newParams.page === undefined && (newParams.search !== undefined || Object.keys(newParams).some(k => !["page", "limit", "sortBy", "sortOrder"].includes(k)))) {
            query.set("page", "1");
        }

        router.push(`${pathname}?${query.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const onSearch = useCallback((value: string) => {
        updateUrl({ search: value, page: 1 });
    }, [updateUrl]);

    const onPageChange = useCallback((page: number) => {
        updateUrl({ page });
    }, [updateUrl]);

    const onLimitChange = useCallback((limit: number) => {
        updateUrl({ limit, page: 1 });
    }, [updateUrl]);

    const onSort = useCallback((field: string) => {
        const order = params.sortBy === field && params.sortOrder === "desc" ? "asc" : "desc";
        updateUrl({ sortBy: field, sortOrder: order });
    }, [params.sortBy, params.sortOrder, updateUrl]);

    const onFilterChange = useCallback((name: string, value: string) => {
        updateUrl({ [name]: value, page: 1 });
    }, [updateUrl]);

    const onFiltersChange = useCallback((filters: Record<string, string>) => {
        updateUrl({ ...filters, page: 1 });
    }, [updateUrl]);

    return {
        params,
        onSearch,
        onPageChange,
        onLimitChange,
        onSort,
        onFilterChange,
        onFiltersChange,
    };
}
