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
import { Search } from "lucide-react";
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
}: DataTableProps) {
    const [localSearch, setLocalSearch] = React.useState(searchValue);

    // Update local state when searchValue prop changes (e.g. on clear)
    React.useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    // Debounce the search action
    React.useEffect(() => {
        // Don't trigger search on initial mount if value matches prop
        if (localSearch === searchValue) return;

        const timer = setTimeout(() => {
            onSearch(localSearch);
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, onSearch, searchValue]);

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-sm">
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
                
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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

            {/* Table Content */}
            <div className="rounded-md border bg-card overflow-hidden">
                {children}
            </div>

            {/* Pagination */}
            <PaginationControls meta={pagination} />
        </div>
    );
}
