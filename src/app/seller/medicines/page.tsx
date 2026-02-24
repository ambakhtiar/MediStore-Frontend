"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { getSellerMedicines, deleteMedicine } from "@/action/dashboard.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Medicine, MedicineType } from "@/types";

export default function SellerMedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const router = useRouter();

    // fetchMedicines declared before useEffect and memoized
    const fetchMedicines = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSellerMedicines();

            const data = res?.data?.data?.data ?? [];
            setMedicines(data);
        } catch (err) {
            console.error("Failed to fetch medicines:", err);
            setMedicines([]);
            toast.error("Failed to load medicines");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    const handleDelete = async () => {
        if (!deleteId) return;

        const toastId = toast.loading("Deleting medicine...");
        try {
            const result = await deleteMedicine(deleteId);

            if (result?.ok) {
                toast.success("Medicine deleted successfully", { id: toastId });
                setDeleteId(null);
                // refresh list
                await fetchMedicines();
            } else {
                toast.error(result?.error?.message || "Failed to delete", { id: toastId });
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Network error", { id: toastId });
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Medicines</h1>
                        <p className="text-muted-foreground">Manage your medicine inventory</p>
                    </div>
                </div>

                <Link href="/seller/medicines/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                    </Button>
                </Link>
            </div>

            {/* Medicines Table */}
            {medicines.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        No medicines yet. Add your first medicine to get started!
                    </p>
                    <Link href="/seller/medicines/add">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Medicine
                        </Button>
                    </Link>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicines.map((medicine) => (
                                <TableRow key={medicine.id}>
                                    <TableCell>
                                        <Link href={`/shop/${medicine.id}`}>
                                            {medicine.imageUrl ? (
                                                <div className="w-10 h-10 relative rounded overflow-hidden">
                                                    <Image
                                                        src={encodeURI(medicine.imageUrl)}
                                                        alt={medicine.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </Link>
                                    </TableCell>

                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{medicine.name}</p>
                                            {medicine.genericName && (
                                                <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>{medicine.category?.name || "—"}</TableCell>

                                    <TableCell className="font-medium">
                                        ৳{Number(medicine.price ?? 0).toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                typeof medicine.stock === "number"
                                                    ? medicine.stock === 0
                                                        ? "destructive"
                                                        : medicine.stock < 10
                                                            ? "secondary"
                                                            : "default"
                                                    : "secondary"
                                            }
                                        >
                                            {typeof medicine.stock === "number" ? medicine.stock : "—"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={medicine.isActive ? "default" : "secondary"}>
                                            {medicine.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/seller/medicines/edit/${medicine.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(medicine.id)}
                                                disabled={deleteId === medicine.id}
                                                aria-label={`Delete ${medicine.name}`}
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the medicine from your inventory.
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