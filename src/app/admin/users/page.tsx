"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import type { User } from "@/types";
import { getAllUsers, updateUserStatus } from "@/action/dashboard.action";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();

            console.log(res);
            const data = res?.data?.data ?? [];
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            toast.error("Failed to load users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await fetchUsers();
        })();
        return () => {
            mounted = false;
        };
    }, [fetchUsers]);

    const handleStatusChange = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "BAN" ? "UNBAN" : "BAN";
        const toastId = toast.loading(`${newStatus === "BAN" ? "Banning" : "Unbanning"} user...`);
        setUpdatingId(userId);

        try {
            const result = await updateUserStatus(userId, newStatus);

            if (result?.ok) {
                toast.success(`User ${newStatus === "BAN" ? "banned" : "unbanned"} successfully`, { id: toastId });
                await fetchUsers();
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

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage all users and their status</p>
            </div>

            {users.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No users found</p>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}