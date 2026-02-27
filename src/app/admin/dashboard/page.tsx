// import { getAdminDashboardStats } from "@/action/dashboard.action";
// import StatsCard from "@/components/dashboard/StatsCard";
// import { Users, ShoppingCart, Package, DollarSign, UserCheck, UserX } from "lucide-react";

// export default async function AdminDashboardPage() {
//     const statsRes = await getAdminDashboardStats();
//     const stats = statsRes?.data?.data || {};

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//                 <p className="text-muted-foreground">System overview and statistics</p>
//             </div>

//             {/* User Stats */}
//             <div>
//                 <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatsCard title="Total Users" value={stats.totalUsers || 0} icon={Users} />
//                     <StatsCard title="Customers" value={stats.totalCustomers || 0} icon={UserCheck} />
//                     <StatsCard title="Sellers" value={stats.totalSellers || 0} icon={UserCheck} />
//                     <StatsCard title="Banned Users" value={stats.bannedUsers || 0} icon={UserX} />
//                 </div>
//             </div>

//             {/* Order Stats */}
//             <div>
//                 <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} />
//                     <StatsCard title="Pending" value={stats.pendingOrders || 0} icon={ShoppingCart} description="Awaiting confirmation" />
//                     <StatsCard title="Delivered" value={stats.deliveredOrders || 0} icon={ShoppingCart} description="Successfully completed" />
//                     <StatsCard title="Cancelled" value={stats.cancelledOrders || 0} icon={ShoppingCart} />
//                 </div>
//             </div>

//             {/* Medicine & Revenue Stats */}
//             <div>
//                 <h2 className="text-xl font-semibold mb-4">Medicine & Revenue</h2>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatsCard title="Total Medicines" value={stats.totalMedicines || 0} icon={Package} />
//                     <StatsCard title="Active Medicines" value={stats.activeMedicines || 0} icon={Package} />
//                     <StatsCard title="Featured" value={stats.featuredMedicines || 0} icon={Package} />
//                     <StatsCard title="Total Revenue" value={`৳${(stats.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} />
//                 </div>
//             </div>
//         </div>
//     );
// }


import { getAdminDashboardStats } from "@/action/dashboard.action";
import StatsCard from "@/components/dashboard/StatsCard";
import {
    Users,
    ShoppingCart,
    Package,
    DollarSign,
    UserCheck,
    UserX,
    TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStats } from "@/types";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store"; // optional

export default async function AdminDashboardPage() {
    const statsRes = await getAdminDashboardStats();
    const stats: AdminStats = statsRes?.data?.data || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    System overview and statistics
                </p>
            </div>

            {/* User Statistics */}
            <div>
                <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Users"
                        value={stats.totalUsers || 0}
                        description="All registered users"
                        icon={Users}
                    />
                    <StatsCard
                        title="Customers"
                        value={stats.totalCustomers || 0}
                        description="Registered customers"
                        icon={UserCheck}
                    />
                    <StatsCard
                        title="Sellers"
                        value={stats.totalSellers || 0}
                        description="Active sellers"
                        icon={UserCheck}
                    />
                    <StatsCard
                        title="Banned Users"
                        value={stats.bannedUsers || 0}
                        description="Suspended accounts"
                        icon={UserX}
                    />
                </div>
            </div>

            {/* Order Statistics */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders || 0}
                        description="All time orders"
                        icon={ShoppingCart}
                    />
                    <StatsCard
                        title="Pending Orders"
                        value={stats.pendingOrders || 0}
                        description="Awaiting confirmation"
                        icon={ShoppingCart}
                    />
                    <StatsCard
                        title="Delivered Orders"
                        value={stats.deliveredOrders || 0}
                        description="Successfully completed"
                        icon={ShoppingCart}
                    />
                    <StatsCard
                        title="Cancelled Orders"
                        value={stats.cancelledOrders || 0}
                        description="Cancelled by users"
                        icon={ShoppingCart}
                    />
                </div>
            </div>

            {/* Medicine & Revenue Statistics */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Medicine & Revenue</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Medicines"
                        value={stats.totalMedicines || 0}
                        description="In the system"
                        icon={Package}
                    />
                    <StatsCard
                        title="Active Medicines"
                        value={stats.activeMedicines || 0}
                        description="Currently available"
                        icon={Package}
                    />
                    <StatsCard
                        title="Featured Medicines"
                        value={stats.featuredMedicines || 0}
                        description="Promoted products"
                        icon={TrendingUp}
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`৳${(stats.totalRevenue || 0).toFixed(2)}`}
                        description="All time earnings"
                        icon={DollarSign}
                    />
                </div>
            </div>

            {/* Quick Stats Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {stats.activeMedicines || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Active Products
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.pendingOrders || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Pending Orders
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.totalSellers || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Active Sellers
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                                {stats.totalCustomers || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Total Customers
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}