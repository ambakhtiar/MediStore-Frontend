import { getCategories } from "@/action/category.action";
import MedicineForm from "@/components/dashboard/MedicineForm";

export const dynamic = "force-dynamic";

export default async function AddMedicinePage() {
    const categoriesRes = await getCategories();
    const bodyData = categoriesRes?.data?.data || [];
    let categories = [];
    if (bodyData && typeof bodyData === "object" && bodyData !== null && "items" in bodyData) {
        categories = bodyData.items || [];
    } else if (Array.isArray(bodyData)) {
        categories = bodyData;
    }
    const initialData = {};

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add Medicine</h1>
                <p className="text-muted-foreground">
                    Add a new medicine to your inventory
                </p>
            </div>

            <MedicineForm categories={categories} initialData={initialData} />
        </div>
    );
}