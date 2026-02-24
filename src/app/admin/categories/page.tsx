import { getCategories } from "@/action/category.action";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";

export default async function AdminCategoriesPage() {
    const categoriesRes = await getCategories();
    const categories: Category[] = categoriesRes?.data?.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Categories</h1>
                <p className="text-muted-foreground">
                    View all medicine categories
                </p>
            </div>

            {categories.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No categories found</p>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Prescription Required</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {category.slug || "—"}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {category.description || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                category.isPrescriptionRequired ? "destructive" : "secondary"
                                            }
                                        >
                                            {category.isPrescriptionRequired ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
