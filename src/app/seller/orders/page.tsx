"use client";

/**
 * Seller Orders Page
 * Displays orders containing seller's products with status update capability
 */

import { useEffect, useState } from "react";
import { getSellerOrders, updateOrderItemStatus } from "@/action/dashboard.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";

const STATUS_OPTIONS = [
    { value: "PLACED", label: "Placed" },
    { value: "CONFIRMS", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "PLACED": return "secondary";
        case "CONFIRMS": return "default";
        case "PROCESSING": return "default";
        case "SHIPPED": return "outline";
        case "DELIVERED": return "success";
        case "CANCELLED": return "destructive";
        default: return "secondary";
    }
};

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await getSellerOrders();
        if (res.ok && res.data?.data) {
            setOrders(res.data.data);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (orderItemId: string, newStatus: string) => {
        const toastId = toast.loading("Updating status...");

        const result = await updateOrderItemStatus(orderItemId, newStatus);

        if (result.ok) {
            toast.success("Status updated successfully", { id: toastId });
            fetchOrders();
        } else {
            toast.error(result.error?.message || "Failed to update", { id: toastId });
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">Manage orders containing your products</p>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No orders yet</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">
                    Manage orders containing your products ({orders.length} orders)
                </p>
            </div>

            <div className="space-y-4">
                {orders.map((order: any) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        Order #{order.id.slice(0, 8).toUpperCase()}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(order.createdAt), "PPP 'at' p")}
                                    </p>
                                </div>
                                <Badge variant={getStatusColor(order.status) as any}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Customer Info */}
                            <div className="mb-4 p-3 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm">Customer Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {order.shippingName && (
                                        <div>
                                            <span className="text-muted-foreground">Name: </span>
                                            <span className="font-medium">{order.shippingName}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground">Phone: </span>
                                        <span className="font-medium">{order.shippingPhone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3 border rounded-lg"
                                    >
                                        {/* Medicine Image */}
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                            {item.medicine.imageUrl ? (
                                                <Image
                                                    src={item.medicine.imageUrl}
                                                    alt={item.medicine.name}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-muted flex items-center justify-center text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Medicine Details */}
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{item.medicine.name}</h4>
                                            <div className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} × ৳{item.unitPrice.toFixed(2)}
                                            </div>
                                            <div className="text-sm font-medium">
                                                Total: ৳{(item.quantity * item.unitPrice).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Status Update */}
                                        <div className="flex flex-col gap-2 items-end">
                                            <Badge variant={getStatusColor(item.orderItemStatus) as any}>
                                                {item.orderItemStatus}
                                            </Badge>
                                            <Select
                                                value={item.orderItemStatus}
                                                onValueChange={(val) => handleStatusUpdate(item.id, val)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}