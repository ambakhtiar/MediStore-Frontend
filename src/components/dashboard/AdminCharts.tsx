"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
    revenueByMonth: { month: string; revenue: number }[];
    ordersByStatus: { status: string; count: number }[];
}

const COLORS = ["#0ea5e9", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#64748b"];

export default function AdminCharts({ revenueByMonth, ordersByStatus }: ChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Revenue Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} />
                            <YAxis 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `৳${value}`}
                            />
                            <RechartsTooltip 
                                formatter={(value: any) => [`৳${value}`, "Revenue"]}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Orders By Status Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders By Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ordersByStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="status"
                                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                                {ordersByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
