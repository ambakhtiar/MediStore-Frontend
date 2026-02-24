"use client";

/**
 * Admin Orders Page - Complete with Status Update
 * View all orders and update order status
 */

import { useCallback, useEffect, useState } from "react";
import { getOrders } from "@/action/order.action";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { updateOrderItemStatus, updateOrderStatus, updateUserStatus } from "@/action/dashboard.action";
import { Order, OrderStatus } from "@/types";

// All possible order statuses
const ORDER_STATUSES: OrderStatus[] = [
    "PLACED",
    "CONFIRMS",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "PLACED":
            return "secondary";
        case "CONFIRMS":
            return "default";
        case "PROCESSING":
            return "default";
        case "SHIPPED":
            return "outline";
        case "DELIVERED":
            return "success";
        case "CANCELLED":
            return "destructive";
        default:
            return "secondary";
    }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // fetchOrders declared before useEffect and memoized with useCallback
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            // Defensive normalization of response shapes
            const data = res?.data?.data ?? [];

            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await fetchOrders();
        })();
        return () => {
            mounted = false;
        };
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingId(orderId);
        const toastId = toast.loading("Updating order status...");
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            console.log(result);
            if (result?.ok) {
                toast.success("Order status updated successfully", { id: toastId });
                await fetchOrders();
            } else {
                toast.error(result?.error?.message || "Failed to update status", { id: toastId });
            }
        } catch (err) {
            console.error("Update order status error:", err);
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
                <h1 className="text-3xl font-bold">All Orders</h1>
                <p className="text-muted-foreground">
                    View and manage all orders in the system
                </p>
            </div>

            {orders.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No orders yet</p>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Update Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {order.shippingName || "—"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.shippingPhone}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.items?.length || 0} items</TableCell>
                                    <TableCell className="font-semibold">
                                        ৳{order.total.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status) as any}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(order.createdAt), "PP")}
                                    </TableCell>
                                    <TableCell>
                                        {/* Status Update Dropdown */}
                                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) =>
                                                    handleStatusChange(order.id, value as OrderStatus)
                                                }
                                            >
                                                <SelectTrigger className="w-36">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ORDER_STATUSES.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                {order.status === "DELIVERED" ? "Completed" : "Cancelled"}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </Link>
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