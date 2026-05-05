"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { Order, OrderItem, OrderStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatusByAdmin } from "@/action/order.action";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/dashboard/DataTable";

type StatusVariant = "secondary" | "default" | "outline" | "destructive";
const ORDER_STATUSES: OrderStatus[] = ["PLACED", "CONFIRMS", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_VARIANTS: Record<OrderStatus, StatusVariant> = {
    PLACED: "secondary",
    CONFIRMS: "default",
    PROCESSING: "default",
    SHIPPED: "outline",
    DELIVERED: "default",
    CANCELLED: "destructive",
};

export function getStatusVariant(status: string): StatusVariant {
    if ((STATUS_VARIANTS as Record<string, StatusVariant>)[status]) {
        return (STATUS_VARIANTS as Record<string, StatusVariant>)[status];
    }
    return "secondary";
}

export function AdminOrdersClient() {
    const { params, onSearch, onPageChange, onLimitChange, onSort, onFilterChange, onFiltersChange } = useDataTable("createdAt");
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await getAllOrders({
                search: params.search,
                status: params.status,
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                minTotal: params.minTotal ? Number(params.minTotal) : undefined,
                maxTotal: params.maxTotal ? Number(params.maxTotal) : undefined,
            });

            if (res.ok && res.data) {
                const bodyData = res.data.data;

                let items: Order[] = [];
                let total = 0;
                let totalPages = 1;

                if (bodyData && typeof bodyData === "object" && bodyData !== null && "items" in bodyData) {
                    items = (bodyData.items as Order[]) || [];
                    const pag = (bodyData as any).pagination;
                    total = pag?.total || items.length;
                    totalPages = pag?.totalPages || 1;
                } else if (Array.isArray(bodyData)) {
                    items = bodyData as Order[];
                    total = (bodyData as any[]).length;
                }

                setOrders(items);
                setPagination({
                    total,
                    page: params.page,
                    limit: params.limit,
                    totalPages,
                });
            } else {
                toast.error(res.error?.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            toast.error("Failed to load orders");
        } finally {
            setIsFetching(false);
            setInitialLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        const toastId = toast.loading("Updating order status...");
        const result = await updateOrderStatusByAdmin(orderId, newStatus);
        if (result.ok) {
            toast.success("Order status updated successfully", { id: toastId });
            fetchOrders();
        } else {
            toast.error(result.error?.message || "Failed to update status", { id: toastId });
        }
    };

    return (
        <DataTable
            searchPlaceholder="Search by ID, user, or product name..."
            searchValue={params.search || ""}
            onSearch={onSearch}
            limitValue={params.limit}
            onLimitChange={onLimitChange}
            pagination={pagination}
            onPageChange={onPageChange}
            isFetching={isFetching}
            filters={
                <div className="flex flex-wrap gap-2">
                    <Select
                        value={params.status || "all"}
                        onValueChange={(v) => onFilterChange("status", v === "all" ? "" : v)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {ORDER_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={params.amountRange || "all"}
                        onValueChange={(v) => {
                            if (v === "all") {
                                onFiltersChange({ amountRange: "", minTotal: "", maxTotal: "" });
                            } else if (v === "under500") {
                                onFiltersChange({ amountRange: v, minTotal: "", maxTotal: "500" });
                            } else if (v === "500-1000") {
                                onFiltersChange({ amountRange: v, minTotal: "500", maxTotal: "1000" });
                            } else if (v === "over1000") {
                                onFiltersChange({ amountRange: v, minTotal: "1000", maxTotal: "" });
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Amount Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Amounts</SelectItem>
                            <SelectItem value="under500">Under ৳500</SelectItem>
                            <SelectItem value="500-1000">৳500 - ৳1000</SelectItem>
                            <SelectItem value="over1000">Above ৳1000</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            }
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("total")}>
                            Total {params.sortBy === "total" && (params.sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("createdAt")}>
                            Date {params.sortBy === "createdAt" && (params.sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Update Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order: Order) => (
                            <React.Fragment key={order.id}>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.user?.name || order.shippingName || "—"}</p>
                                            <p className="text-xs text-muted-foreground">{order.shippingPhone || "—"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.items?.length || 0} items</TableCell>
                                    <TableCell className="font-semibold">৳{order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(order.createdAt), "PP")}</TableCell>
                                    <TableCell>
                                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
                                            <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ORDER_STATUSES.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">{order.status === "DELIVERED" ? "Completed" : "Cancelled"}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                                                {expandedOrder === order.id ? "Hide" : "Items"}
                                            </Button>
                                            <Link href={`/orders/${order.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedOrder === order.id && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="bg-muted/30 p-0">
                                            <div className="p-4 space-y-2">
                                                <h4 className="text-sm font-semibold mb-2 px-2">Order Items Details</h4>
                                                {order.items.map((item: OrderItem) => (
                                                    <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border shadow-sm">
                                                        <div className="flex flex-col">
                                                            <Link href={`/shop/${item.medicine.id}`} className="font-medium text-primary hover:underline">
                                                                {item.medicine.name}
                                                            </Link>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Seller: <span className="font-medium text-foreground">{item.medicine?.seller?.name || "System"}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Qty: {item.quantity} × ৳{item.unitPrice.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-sm">৳{(item.quantity * item.unitPrice).toFixed(2)}</p>
                                                            <Badge variant="outline" className="mt-1 text-[10px] h-5">{item.orderItemStatus}</Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </DataTable>
    );
}
