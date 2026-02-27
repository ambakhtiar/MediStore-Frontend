import { getMedicineById } from "@/action/medicine.action";
import { getCategories } from "@/action/category.action";
import MedicineForm from "@/components/dashboard/MedicineForm";
import { notFound } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";


export default async function EditMedicinePage({
    params
}: {
    params: { id: string }
}) {
    const { id } = await params;

    const [medicineRes, categoriesRes] = await Promise.all([
        getMedicineById(id),
        getCategories(),
    ]);

    const medicine = medicineRes?.data?.data || medicineRes?.data;
    const categories = categoriesRes?.data?.data || [];

    if (!medicine) {
        return notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Medicine</h1>
                <p className="text-muted-foreground">
                    Update medicine details
                </p>
            </div>
            <Link href="/seller/medicines" className="text-sm text-blue-600 hover:underline">
                ← My Medicines
            </Link>

            <MedicineForm
                categories={categories}
                initialData={medicine}
                isEdit
            />
        </div>
    );
}