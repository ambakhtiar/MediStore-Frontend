"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicineFilters, Order } from "@/types";

interface SellerChartsProps {
    medicines: MedicineFilters[];
    orders: Order[];
}

const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#0ea5e9"];

export default function SellerCharts({ medicines, orders }: SellerChartsProps) {
    const activeProducts = medicines.filter(m => m.isActive).length;
    const inactiveProducts = medicines.filter(m => !m.isActive).length;
    
    const productStatusData = [
        { name: "Active", value: activeProducts },
        { name: "Inactive", value: inactiveProducts },
    ];

    const orderStatusMap: Record<string, number> = {};
    orders.forEach(o => {
        orderStatusMap[o.status] = (orderStatusMap[o.status] || 0) + 1;
    });
    
    const orderStatusData = Object.entries(orderStatusMap).map(([name, value]) => ({ name, value }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Products Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={productStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {productStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % 2]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Orders Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {orderStatusData.map((entry, index) => (
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
