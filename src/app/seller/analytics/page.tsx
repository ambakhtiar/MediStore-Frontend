import { getSellerMedicines, getSellerOrders } from "@/action/dashboard.action";
import SellerCharts from "@/components/dashboard/SellerCharts";
import { MedicineType, Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function SellerAnalyticsPage() {
    // Fetch seller data
    const [medicinesRes, ordersRes] = await Promise.all([
        getSellerMedicines(),
        getSellerOrders(),
    ]);

    // Helper to safely get items array
    const extractItems = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.items && Array.isArray(data.items)) return data.items;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
    };

    const medicines = extractItems(medicinesRes?.data?.data);
    const orders = extractItems(ordersRes?.data?.data);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed performance metrics and charts for your products.
                </p>
            </div>
            
            <SellerCharts medicines={medicines} orders={orders} />
        </div>
    );
}
