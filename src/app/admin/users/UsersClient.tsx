"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import type { User } from "@/types";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/dashboard/DataTable";
import { getAllUsers, updateUserStatus } from "@/action/user.action";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function UsersClient() {
    const { params, onSearch, onPageChange, onLimitChange, onSort, onFilterChange } = useDataTable("createdAt");
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await getAllUsers({
                search: params.search,
                role: params.role,
                status: params.status,
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
            });

            if (res.ok && res.data) {
                const bodyData = res.data.data;

                let items: User[] = [];
                let total = 0;
                let totalPages = 1;

                if (bodyData && typeof bodyData === "object" && bodyData !== null && "items" in bodyData) {
                    items = (bodyData.items as User[]) || [];
                    const pag = (bodyData as any).pagination;
                    total = pag?.total || items.length;
                    totalPages = pag?.totalPages || 1;
                } else if (Array.isArray(bodyData)) {
                    items = bodyData;
                    total = bodyData.length;
                }

                setUsers(items);
                setPagination({
                    total,
                    page: params.page,
                    limit: params.limit,
                    totalPages,
                });
            } else {
                toast.error(res.error?.message || "Failed to fetch users");
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
            toast.error("Failed to load users");
        } finally {
            setIsFetching(false);
            setInitialLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleStatusChange = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "BAN" ? "UNBAN" : "BAN";
        const toastId = toast.loading(`${newStatus === "BAN" ? "Banning" : "Unbanning"} user...`);
        setUpdatingId(userId);

        try {
            const result = await updateUserStatus(userId, newStatus);

            if (result?.ok) {
                toast.success(`User ${newStatus === "BAN" ? "banned" : "unbanned"} successfully`, { id: toastId });
                fetchUsers();
            } else {
                toast.error(result?.error?.message || "Failed to update status", { id: toastId });
            }
        } catch (err) {
            console.error("Update status error:", err);
            toast.error("Network error", { id: toastId });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <DataTable
            searchValue={params.search || ""}
            onSearch={onSearch}
            limitValue={params.limit}
            onLimitChange={onLimitChange}
            pagination={pagination}
            onPageChange={onPageChange}
            isFetching={isFetching}
            filters={
                <div className="flex gap-2">
                    <Select
                        value={params.role || "all"}
                        onValueChange={(v) => onFilterChange("role", v === "all" ? "" : v)}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SELLER">Seller</SelectItem>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select
                        value={params.status || "all"}
                        onValueChange={(v) => onFilterChange("status", v === "all" ? "" : v)}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="UNBAN">Active</SelectItem>
                            <SelectItem value="BAN">Banned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            }
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("name")}>
                            Name {params.sortBy === "name" && (params.sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("email")}>
                            Email {params.sortBy === "email" && (params.sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("createdAt")}>
                            Joined {params.sortBy === "createdAt" && (params.sortOrder === "asc" ? "↑" : "↓")}
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
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.role === "ADMIN" ? "default" :
                                                user.role === "SELLER" ? "secondary" :
                                                    "outline"
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "UNBAN" ? "default" : "destructive"}>
                                        {user.status === "UNBAN" ? "Active" : "Banned"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.role !== "ADMIN" && (
                                        <Button
                                            size="sm"
                                            variant={user.status === "BAN" ? "outline" : "destructive"}
                                            onClick={() => handleStatusChange(user.id, user.status)}
                                            disabled={updatingId === user.id}
                                        >
                                            {updatingId === user.id ? (
                                                "Updating..."
                                            ) : user.status === "BAN" ? (
                                                <>
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Unban
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldOff className="h-4 w-4 mr-2" />
                                                    Ban
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </DataTable>
    );
}
