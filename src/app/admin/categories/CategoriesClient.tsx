"use client";

import { useCallback, useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/action/category.action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/dashboard/DataTable";

export function CategoriesClient() {
    const { params, onSearch, onPageChange, onLimitChange, onSort, onFilterChange } = useDataTable("name");
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        isPrescriptionRequired: false,
    });

    const fetchCategories = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await getCategories({
                search: params.search,
                isPrescriptionRequired: params.isPrescriptionRequired,
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
            });

            if (res.ok && res.data) {
                const bodyData = res.data.data;

                let items: Category[] = [];
                let total = 0;
                let totalPages = 1;

                if (bodyData && typeof bodyData === "object" && bodyData !== null && "items" in bodyData) {
                    items = (bodyData.items as Category[]) || [];
                    const pag = (bodyData as any).pagination;
                    total = pag?.total || items.length;
                    totalPages = pag?.totalPages || 1;
                } else if (Array.isArray(bodyData)) {
                    items = bodyData;
                    total = bodyData.length;
                }

                setCategories(items);
                setPagination({
                    total,
                    page: params.page,
                    limit: params.limit,
                    totalPages,
                });
            } else {
                toast.error(res.error?.message || "Failed to fetch categories");
            }
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            toast.error("Failed to load categories");
        } finally {
            setIsFetching(false);
            setInitialLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);


    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setIsEditMode(true);
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug || "",
                description: category.description || "",
                isPrescriptionRequired: category.isPrescriptionRequired || false,
            });
        } else {
            setIsEditMode(false);
            setEditingCategory(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                isPrescriptionRequired: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEditMode(false);
        setEditingCategory(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            isPrescriptionRequired: false,
        });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        const toastId = toast.loading(
            isEditMode ? "Updating category..." : "Creating category..."
        );

        try {
            const result = isEditMode && editingCategory
                ? await updateCategory(editingCategory.id, formData)
                : await createCategory(formData);

            if (result.ok) {
                toast.success(
                    isEditMode ? "Category updated successfully" : "Category created successfully",
                    { id: toastId }
                );
                handleCloseDialog();
                fetchCategories();
            } else {
                toast.error(result.error?.message || "Operation failed", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred", { id: toastId });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const toastId = toast.loading("Deleting category...");
        const result = await deleteCategory(deleteId);

        if (result.ok) {
            toast.success("Category deleted successfully", { id: toastId });
            setDeleteId(null);
            fetchCategories();
        } else {
            toast.error(result.error?.message || "Failed to delete", { id: toastId });
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage medicine categories
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Categories Table */}
            <DataTable
                searchValue={params.search || ""}
                onSearch={onSearch}
                limitValue={params.limit}
                onLimitChange={onLimitChange}
                pagination={pagination}
                onPageChange={onPageChange}
                isFetching={isFetching}
                filters={
                    <Select
                        value={params.isPrescriptionRequired || "all"}
                        onValueChange={(v) => onFilterChange("isPrescriptionRequired", v === "all" ? "" : v)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Prescription Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="true">Prescription Required</SelectItem>
                            <SelectItem value="false">No Prescription</SelectItem>
                        </SelectContent>
                    </Select>
                }
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("name")}>
                                Name {params.sortBy === "name" && (params.sortOrder === "asc" ? "↑" : "↓")}
                            </TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Prescription Required</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("createdAt")}>
                                Created {params.sortBy === "createdAt" && (params.sortOrder === "asc" ? "↑" : "↓")}
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {category.slug || "—"}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {category.description || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                category.isPrescriptionRequired ? "destructive" : "secondary"
                                            }
                                        >
                                            {category.isPrescriptionRequired ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDialog(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(category.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </DataTable>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Category" : "Create Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Update category details"
                                : "Add a new medicine category"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Category Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Pain Relief"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                placeholder="e.g., pain-relief (auto-generated if empty)"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly version. Leave empty to auto-generate.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Category description..."
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Prescription Required */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="prescription"
                                checked={formData.isPrescriptionRequired}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isPrescriptionRequired: !!checked })
                                }
                            />
                            <Label htmlFor="prescription" className="cursor-pointer">
                                Prescription Required
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {isEditMode ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
