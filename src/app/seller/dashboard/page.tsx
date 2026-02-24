import { getSellerMedicines, getSellerOrders } from "@/action/dashboard.action";
import StatsCard from "@/components/dashboard/StatsCard";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MedicineFilters, MedicineType } from "@/types";
import { Order, OrderItem } from "@/types/dashboard.type";

export default async function SellerDashboardPage() {
    // Fetch seller data
    const [medicinesRes, ordersRes] = await Promise.all([
        getSellerMedicines(),
        getSellerOrders(),
    ]);

    const medicines = medicinesRes?.data?.data?.data || [];
    const orders = ordersRes?.data?.data || [];

    // Calculate statistics
    const totalProducts = medicines.length;
    const activeProducts = medicines.filter((m: MedicineFilters) => m.isActive).length;
    const lowStockItems = medicines.filter((m: MedicineFilters) => m.stock && m.stock < 10).length;

    // Calculate seller's orders (orders containing their products)
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: Order) =>
        o.items.some((item: OrderItem) =>
            item.orderItemStatus === "PLACED" || item.orderItemStatus === "CONFIRMS"
        )
    ).length;

    // Calculate revenue from delivered orders
    const revenue = orders
        .filter((o: Order) => o.status !== "CANCELLED")
        .reduce((sum: number, o: Order) => {
            const sellerItems = o.items.filter((item: OrderItem) =>
                medicines.some((m: MedicineType) => m.id === item.medicineId)
            );
            const orderRevenue = sellerItems.reduce(
                (itemSum: number, item: OrderItem) => itemSum + (item.unitPrice * item.quantity),
                0
            );
            return sum + orderRevenue;
        }, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here is your business overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value={totalProducts}
                    description={`${activeProducts} active`}
                    icon={Package}
                />
                <StatsCard
                    title="Total Orders"
                    value={totalOrders}
                    description={`${pendingOrders} pending`}
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="Total Revenue"
                    value={`৳${revenue.toFixed(2)}`}
                    description="All time earnings"
                    icon={DollarSign}
                />
                <StatsCard
                    title="Low Stock Alert"
                    value={lowStockItems}
                    description="Items below 10 units"
                    icon={TrendingUp}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Products</CardTitle>
                        <Link
                            href="/seller/medicines"
                            className="text-sm text-primary hover:underline"
                        >
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {medicines.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No products yet. Add your first product!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {medicines.slice(0, 5).map((medicine: MedicineType) => (
                                    <div key={medicine.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{medicine.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Stock: {medicine.stock}
                                            </p>
                                        </div>
                                        <Badge variant={medicine.isActive ? "default" : "secondary"}>
                                            {medicine.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Link
                            href="/seller/orders"
                            className="text-sm text-primary hover:underline"
                        >
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No orders yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 5).map((order: Order) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                Order #{order.id.slice(0, 8)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.items.length} items
                                            </p>
                                        </div>
                                        <Badge variant={
                                            order.status === "DELIVERED" ? "default" :
                                                order.status === "CANCELLED" ? "destructive" :
                                                    "secondary"
                                        }>
                                            {order.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}