"use client";

/**
 * Admin Categories Page - Complete CRUD
 * Create, Read, Update, Delete categories
 */

import { useCallback, useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/action/category.action";
import { Card } from "@/components/ui/card";
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
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store"; // optional

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
            const res = await getCategories();
            const list = res?.data?.data ?? res?.data ?? [];
            if (Array.isArray(list)) {
                setCategories(list);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            toast.error("Failed to load categories");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await fetchCategories();
        })();
        return () => {
            mounted = false;
        };
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

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

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
            {categories.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        No categories yet. Create your first category!
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Prescription Required</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

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