import { AdminOrdersClient } from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">All Orders</h1>
                <p className="text-muted-foreground">View and manage all orders</p>
            </div>
            <AdminOrdersClient />
        </div>
    );
}