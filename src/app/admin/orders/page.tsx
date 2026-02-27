// "use client";

// /**
//  * Admin Orders Page - Complete with Status Update
//  * View all orders and update order status
//  */

// import { useCallback, useEffect, useState } from "react";
// import { getOrders } from "@/action/order.action";
// import { Card } from "@/components/ui/card";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { format } from "date-fns";
// import Link from "next/link";
// import { Eye } from "lucide-react";
// import { toast } from "sonner";
// import { updateOrderStatus } from "@/action/dashboard.action";
// import { Order, OrderStatus } from "@/types";

// // All possible order statuses
// const ORDER_STATUSES: OrderStatus[] = [
//     "PLACED",
//     "CONFIRMS",
//     "PROCESSING",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED"
// ];

// const getStatusVariant = (status: string) => {
//     switch (status) {
//         case "PLACED":
//             return "secondary";
//         case "CONFIRMS":
//             return "default";
//         case "PROCESSING":
//             return "default";
//         case "SHIPPED":
//             return "outline";
//         case "DELIVERED":
//             return "default";
//         case "CANCELLED":
//             return "destructive";
//         default:
//             return "secondary";
//     }
// };

// export default function AdminOrdersPage() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [updatingId, setUpdatingId] = useState<string | null>(null);

//     // fetchOrders declared before useEffect and memoized with useCallback
//     const fetchOrders = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await getOrders();
//             // Defensive normalization of response shapes
//             const data = res?.data?.data ?? [];

//             setOrders(data);
//         } catch (err) {
//             console.error("Failed to fetch orders:", err);
//             toast.error("Failed to load orders");
//             setOrders([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         let mounted = true;
//         (async () => {
//             if (!mounted) return;
//             await fetchOrders();
//         })();
//         return () => {
//             mounted = false;
//         };
//     }, [fetchOrders]);

//     const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
//         setUpdatingId(orderId);
//         const toastId = toast.loading("Updating order status...");
//         try {
//             const result = await updateOrderStatus(orderId, newStatus);
//             console.log(result);
//             if (result?.ok) {
//                 toast.success("Order status updated successfully", { id: toastId });
//                 await fetchOrders();
//             } else {
//                 toast.error(result?.error?.message || "Failed to update status", { id: toastId });
//             }
//         } catch (err: unknown) {
//             console.error("Update order status error:", err);
//             toast.error("Network error", { id: toastId });
//         } finally {
//             setUpdatingId(null);
//         }
//     };

//     if (loading) {
//         return <div className="text-center py-12">Loading...</div>;
//     }


//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-3xl font-bold">All Orders</h1>
//                 <p className="text-muted-foreground">
//                     View and manage all orders in the system
//                 </p>
//             </div>

//             {orders.length === 0 ? (
//                 <Card className="p-12 text-center">
//                     <p className="text-muted-foreground">No orders yet</p>
//                 </Card>
//             ) : (
//                 <Card>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Order ID</TableHead>
//                                 <TableHead>Customer</TableHead>
//                                 <TableHead>Items</TableHead>
//                                 <TableHead>Total</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Date</TableHead>
//                                 <TableHead>Update Status</TableHead>
//                                 <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {orders.map((order) => (
//                                 <TableRow key={order.id}>
//                                     <TableCell className="font-medium">
//                                         #{order.id.slice(0, 8).toUpperCase()}
//                                     </TableCell>
//                                     <TableCell>
//                                         <div>
//                                             <p className="font-medium">
//                                                 {order.shippingName || "—"}
//                                             </p>
//                                             <p className="text-sm text-muted-foreground">
//                                                 {order.shippingPhone}
//                                             </p>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>{order.items?.length || 0} items</TableCell>
//                                     <TableCell className="font-semibold">
//                                         ৳{order.total.toFixed(2)}
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={getStatusVariant(order.status)}>
//                                             {order.status}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                         {format(new Date(order.createdAt), "PP")}
//                                     </TableCell>
//                                     <TableCell>
//                                         {/* Status Update Dropdown */}
//                                         {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
//                                             <Select
//                                                 value={order.status}
//                                                 onValueChange={(value) =>
//                                                     handleStatusChange(order.id, value as OrderStatus)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="w-36">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {ORDER_STATUSES.map((status) => (
//                                                         <SelectItem key={status} value={status}>
//                                                             {status}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         ) : (
//                                             <span className="text-sm text-muted-foreground">
//                                                 {order.status === "DELIVERED" ? "Completed" : "Cancelled"}
//                                             </span>
//                                         )}
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         <Link href={`/orders/${order.id}`}>
//                                             <Button size="sm" variant="outline">
//                                                 <Eye className="h-4 w-4 mr-2" />
//                                                 View
//                                             </Button>
//                                         </Link>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </Card>
//             )}
//         </div>
//     );
// }

"use client";

/**
 * Admin Orders Page - Complete with Items & Pagination
 */

import React, { useCallback, useEffect, useState } from "react";
import { getOrders } from "@/action/order.action";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Order, OrderItem, OrderStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { updateOrderStatus } from "@/action/dashboard.action";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store"; // optional


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

export default function AdminOrdersPageComplete() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Declare and memoize before useEffect
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            const list = res?.data?.data ?? [];
            setOrders(list);

            console.log(list);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Call the memoized function inside useEffect
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
        const toastId = toast.loading("Updating order status...");
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.ok) {
            toast.success("Order status updated successfully", { id: toastId });
            fetchOrders();
        } else {
            toast.error(result.error?.message || "Failed to update status", { id: toastId });
        }
    };

    // Pagination
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">All Orders</h1>
                <p className="text-muted-foreground">View and manage all orders ({orders.length} total)</p>
            </div>

            {orders.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No orders yet</p>
                </Card>
            ) : (
                <>
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
                                {paginatedOrders.map((order: Order) => (
                                    <React.Fragment key={order.id}>
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{order.user?.name || order.shippingName || "—"}</p>
                                                    <p className="text-sm text-muted-foreground">{order.user?.email || order.shippingPhone}</p>
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
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ORDER_STATUSES.map((status) => (
                                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">{order.status === "DELIVERED" ? "Completed" : "Cancelled"}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                                                        {expandedOrder === order.id ? "Hide" : "Items"}
                                                    </Button>
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4 mr-2" />View
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {/* Expanded Items */}
                                        {expandedOrder === order.id && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="bg-muted/50">
                                                    <CardContent className="pt-4">
                                                        <h4 className="font-semibold mb-3">Order Items:</h4>
                                                        <div className="space-y-2">
                                                            {order.items.map((item: OrderItem) => (
                                                                <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded border">
                                                                    <div>
                                                                        <p className="font-medium">{item.medicine.name}</p>
                                                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ৳{item.unitPrice.toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-semibold">৳{(item.quantity * item.unitPrice).toFixed(2)}</p>
                                                                        <Badge variant={getStatusVariant(item.orderItemStatus)} className="mt-1">{item.orderItemStatus}</Badge>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                    Next<ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}