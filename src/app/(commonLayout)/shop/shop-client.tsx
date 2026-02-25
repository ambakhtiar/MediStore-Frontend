"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MedicineCard from "@/components/modules/homepage/MedicineCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MedicineType } from "@/types/medicine.type";
import type { Category } from "@/types";
import { getAllMedicine } from "@/action/medicine.action";
import PaginationControls from "@/components/ui/Pagination-Controls";

interface ShopPageClientProps {
    categories: Category[];
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function ShopPageClient({ categories, searchParams }: ShopPageClientProps) {
    const router = useRouter();

    const [medicines, setMedicines] = useState<MedicineType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const getParam = (key: string): string => {
        const value = searchParams[key];
        return Array.isArray(value) ? value[0] || "" : value || "";
    };

    const [search, setSearch] = useState(getParam("search"));
    const [selectedCategory, setSelectedCategory] = useState(getParam("category"));
    const [minPrice, setMinPrice] = useState(getParam("minPrice"));
    const [maxPrice, setMaxPrice] = useState(getParam("maxPrice"));
    const [manufacturer, setManufacturer] = useState(getParam("manufacturer"));
    const [sortBy, setSortBy] = useState(getParam("sortBy") || "createdAt");
    const [sortOrder, setSortOrder] = useState(getParam("sortOrder") || "desc");
    const [inStock, setInStock] = useState<boolean | undefined>(() => {
        const val = getParam("inStock");
        return val === "true" ? true : val === "false" ? false : undefined;
    });

    useEffect(() => {
        const loadMedicines = async () => {
            setLoading(true);

            const page = parseInt(getParam("page") || "1");
            setCurrentPage(page);

            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", "12");

            const mappings: [string, string][] = [
                ["search", getParam("search")],
                ["category", getParam("category")],
                ["minPrice", getParam("minPrice")],
                ["maxPrice", getParam("maxPrice")],
                ["manufacturer", getParam("manufacturer")],
                ["inStock", getParam("inStock")],
                ["sortBy", getParam("sortBy")],
                ["sortOrder", getParam("sortOrder")],
            ];

            mappings.forEach(([key, val]) => {
                if (val) params.set(key, val);
            });

            try {
                const data = await getAllMedicine();

                const items = data?.data?.data?.data ?? [];
                console.log(items);
                const pagination = data?.data?.data?.pagination;

                setMedicines(items);

                if (pagination) {
                    setTotalPages(pagination.totalPages || 1);
                    setTotalItems(pagination.total || 0);
                }
            } catch (error) {
                console.error("Failed to fetch medicines:", error);
                setMedicines([]);
            } finally {
                setLoading(false);
            }
        };

        loadMedicines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const applyFilters = (page = 1) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory) params.set("category", selectedCategory);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (manufacturer) params.set("manufacturer", manufacturer);
        if (inStock !== undefined) params.set("inStock", String(inStock));
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        if (page > 1) params.set("page", page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");
        setManufacturer("");
        setInStock(undefined);
        setSortBy("createdAt");
        setSortOrder("desc");
        router.push("/shop");
    };

    const hasActiveFilters = !!(search || selectedCategory || minPrice || maxPrice || manufacturer || inStock !== undefined);

    return (
        <section className="py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Shop</h1>
                <p className="text-muted-foreground text-sm">Browse our collection of medicines</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-4 flex gap-2 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search medicines..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters(1)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={() => applyFilters(1)}>Search</Button>

                {/* ✅ Filter Sheet with scroll */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </SheetTrigger>

                    {/* ✅ SheetContent — flex column so header stays fixed, body scrolls */}
                    <SheetContent className="flex flex-col p-0">
                        {/* Fixed header */}
                        <SheetHeader className="px-6 py-4 border-b shrink-0">
                            <SheetTitle>Filter Medicines</SheetTitle>
                            <SheetDescription>Narrow down your search</SheetDescription>
                        </SheetHeader>

                        {/* ✅ Scrollable filter body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                            {/* Category */}
                            <div className="space-y-1.5">
                                <Label>Category</Label>
                                <Select
                                    value={selectedCategory || "all"}
                                    onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-1.5">
                                <Label>Price Range (৳)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Manufacturer */}
                            <div className="space-y-1.5">
                                <Label>Manufacturer</Label>
                                <Input
                                    placeholder="e.g., Square Pharmaceuticals"
                                    value={manufacturer}
                                    onChange={(e) => setManufacturer(e.target.value)}
                                />
                            </div>

                            {/* Availability */}
                            <div className="space-y-1.5">
                                <Label>Availability</Label>
                                <Select
                                    value={inStock === undefined ? "all" : inStock ? "in-stock" : "out-of-stock"}
                                    onValueChange={(val) =>
                                        setInStock(val === "all" ? undefined : val === "in-stock")
                                    }
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="in-stock">In Stock</SelectItem>
                                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-1.5">
                                <Label>Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="createdAt">Date Added</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="price">Price</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-1.5">
                                <Label>Order</Label>
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Newest First</SelectItem>
                                        <SelectItem value="asc">Oldest First</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Fixed footer buttons */}
                        <div className="flex gap-2 px-6 py-4 border-t shrink-0">
                            <Button onClick={() => applyFilters(1)} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button onClick={resetFilters} variant="outline" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active:</span>
                    {search && (
                        <Button variant="secondary" size="sm" onClick={() => { setSearch(""); applyFilters(1); }}>
                            `{search}` <X className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                    {selectedCategory && (
                        <Button variant="secondary" size="sm" onClick={() => { setSelectedCategory(""); applyFilters(1); }}>
                            {categories.find(c => c.id === selectedCategory)?.name ?? "Category"} <X className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                    {manufacturer && (
                        <Button variant="secondary" size="sm" onClick={() => { setManufacturer(""); applyFilters(1); }}>
                            {manufacturer} <X className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                    {(minPrice || maxPrice) && (
                        <Button variant="secondary" size="sm" onClick={() => { setMinPrice(""); setMaxPrice(""); applyFilters(1); }}>
                            ৳{minPrice || "0"} – {maxPrice || "∞"} <X className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                        Clear all
                    </Button>
                </div>
            )}

            {/* Results Count */}
            {!loading && (
                <p className="text-sm text-muted-foreground mb-4">
                    {totalItems > 0
                        ? `Showing ${medicines.length} of ${totalItems} medicines`
                        : "No medicines found"}
                    {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : medicines.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No medicines found.</p>
                    <Button onClick={resetFilters} variant="outline">Clear Filters</Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {medicines.map((item) => (
                            <MedicineCard key={item.id} {...item} />
                        ))}
                    </div>

                    {/* ✅ Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <Button
                                variant="outline" size="sm"
                                onClick={() => applyFilters(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((page, idx, arr) => (
                                        <div key={page} className="flex items-center gap-1">
                                            {arr[idx - 1] && page - arr[idx - 1] > 1 && (
                                                <span className="px-2 text-muted-foreground text-sm">…</span>
                                            )}
                                            <Button
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => applyFilters(page)}
                                                className="w-9"
                                            >
                                                {page}
                                            </Button>
                                        </div>
                                    ))}
                            </div>

                            <Button
                                variant="outline" size="sm"
                                onClick={() => applyFilters(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}