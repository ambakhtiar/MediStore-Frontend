import { CategoriesClient } from "./CategoriesClient";

export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store"; // optional

export default function AdminCategoriesPage() {
    return <CategoriesClient />;
}