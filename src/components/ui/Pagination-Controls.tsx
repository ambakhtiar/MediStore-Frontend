"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button } from "./button";

interface PaginationControlsProps {
    meta: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
}

export default function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
    const { limit: pageSize, page: currentPage, total, totalPages } = meta;

    if (totalPages <= 0 || total === 0) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-4 border-t mt-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing <span className="font-medium">{start}</span> to{" "}
                <span className="font-medium">{end}</span> of{" "}
                <span className="font-medium">{total}</span> results
            </div>

            <div className="flex items-center space-x-1 order-1 sm:order-2">
                {/* First page */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Prev page */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page info */}
                <div className="flex items-center gap-1 px-2">
                    <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}