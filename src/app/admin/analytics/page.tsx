import { getAdminDashboardStats } from "@/action/dashboard.action";
import { AdminStats } from "@/types";
import AdminCharts from "@/components/dashboard/AdminCharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const statsRes = await getAdminDashboardStats();
    const stats: AdminStats = statsRes?.data?.data || {};

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Analytics Overview</h1>
                <p className="text-muted-foreground">
                    Detailed insights and performance metrics
                </p>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`৳${(stats.totalRevenue || 0).toLocaleString()}`}
                    description="Gross lifetime earnings"
                    icon={DollarSign}
                />
                <StatsCard
                    title="Order Volume"
                    value={stats.totalOrders || 0}
                    description="Total orders processed"
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="User Growth"
                    value={stats.totalUsers || 0}
                    description="Total registered users"
                    icon={Users}
                />
                <StatsCard
                    title="Inventory"
                    value={stats.totalMedicines || 0}
                    description="Total products in catalog"
                    icon={Package}
                />
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
                {stats.charts && (
                    <AdminCharts
                        revenueByMonth={stats.charts.revenueByMonth}
                        ordersByStatus={stats.charts.ordersByStatus}
                    />
                )}
            </div>

            {/* Additional Analytics Insights (Placeholder/Example) */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue growth and projections</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t">
                         <div className="text-center space-y-2">
                            <TrendingUp className="w-12 h-12 text-primary mx-auto opacity-20" />
                            <p className="text-muted-foreground">Revenue trend analysis is active</p>
                         </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Demographics</CardTitle>
                        <CardDescription>Customer vs Seller distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t">
                         <div className="text-center space-y-2">
                            <Users className="w-12 h-12 text-primary mx-auto opacity-20" />
                            <p className="text-muted-foreground">User distribution data visualized above</p>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
