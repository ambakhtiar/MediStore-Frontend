/**
 * Seller Orders Page
 * Displays orders containing seller's products with status update capability
 */

import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default function SellerOrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">
                    Manage orders containing your products
                </p>
            </div>
            <OrdersClient />
        </div>
    );
}