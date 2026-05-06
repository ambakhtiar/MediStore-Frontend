"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import PaginationControls from "@/components/ui/Pagination-Controls";

interface DataTableProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearch: (value: string) => void;
    limitValue: number;
    onLimitChange: (value: number) => void;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    children: React.ReactNode;
    filters?: React.ReactNode;
    /** Pass true while background-fetching to dim the table instead of wiping it */
    isFetching?: boolean;
}

export function DataTable({
    searchPlaceholder = "Search...",
    searchValue,
    onSearch,
    limitValue,
    onLimitChange,
    pagination,
    onPageChange,
    children,
    filters,
    isFetching = false,
}: DataTableProps) {
    const [localSearch, setLocalSearch] = React.useState(searchValue);

    // Sync when external searchValue resets (e.g. clear button)
    React.useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    // Debounce: wait 500 ms after typing stops
    // Trigger only if ≥ 3 chars typed OR field was cleared (empty)
    React.useEffect(() => {
        if (localSearch === searchValue) return;

        // Only search if user typed ≥ 3 chars or completely cleared the field
        const shouldSearch = localSearch.length === 0 || localSearch.length >= 3;
        if (!shouldSearch) return;

        const timer = setTimeout(() => {
            onSearch(localSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, onSearch, searchValue]);

    return (
        <div className="space-y-4">
            {/* ── Controls ── */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                {/* Search + extra filters */}
                <div className="flex flex-1 flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search input */}
                    <div className="relative flex-1 min-w-[180px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {filters}
                </div>

                {/* Rows-per-page + fetching indicator */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {isFetching && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
                    <Select
                        value={limitValue.toString()}
                        onValueChange={(v) => onLimitChange(parseInt(v))}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder={limitValue} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ── Table Content ── */}
            {/* isFetching dims existing data instead of wiping it */}
            <div
                className={`rounded-md border bg-card overflow-hidden transition-opacity duration-200 ${
                    isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
            >
                {children}
            </div>

            {/* ── Pagination ── */}
            <PaginationControls meta={pagination} onPageChange={onPageChange} />
        </div>
    );
}
