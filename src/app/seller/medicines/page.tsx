import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicinesClient } from "./MedicinesClient";

export const dynamic = "force-dynamic";

export default function SellerMedicinesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">My Medicines</h1>
                        <p className="text-muted-foreground">Manage your medicine inventory</p>
                    </div>
                </div>

                <Link href="/seller/medicines/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                    </Button>
                </Link>
            </div>

            {/* Controls and Table Wrapper */}
            <MedicinesClient />
        </div>
    );
}