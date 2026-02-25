"use client";

/**
 * Medicine Form Component
 * 
 * Comprehensive form for adding/editing medicines
 * Used by sellers in /seller/medicines/add and /seller/medicines/edit/[id]
 */

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addMedicine, updateMedicine } from "@/action/dashboard.action";
import { Category, CreateMedicineType, Medicine } from "@/types";

const medicineSchema = z.object({
    name: z.string().min(2).max(200),
    genericName: z.string().or(z.literal("")),
    description: z.string().or(z.literal("")),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    manufacturer: z.string().or(z.literal("")),
    categoryId: z.string().min(1),
    imageUrl: z.string().url().or(z.literal("")),
    isActive: z.boolean(),
});

interface MedicineFormProps {
    categories: Category[];
    initialData: Partial<Medicine>;
    isEdit?: boolean;
}

export default function MedicineForm({
    categories,
    initialData,
    isEdit = false
}: MedicineFormProps) {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            name: initialData?.name || "",
            genericName: initialData?.genericName || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            manufacturer: initialData?.manufacturer || "",
            categoryId: initialData?.categoryId || "",
            imageUrl: initialData?.imageUrl || "",
            isActive: initialData?.isActive ?? true,
        },
        validators: {
            onSubmit: medicineSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading(isEdit ? "Updating medicine..." : "Adding medicine...");

            try {
                const result = isEdit
                    ? await updateMedicine(initialData.id!, value)
                    : await addMedicine(value as CreateMedicineType);

                if (!result.ok) {
                    toast.error(result.error?.message || "Operation failed", { id: toastId });
                    return;
                }

                toast.success(
                    isEdit ? "Medicine updated successfully!" : "Medicine added successfully!",
                    { id: toastId }
                );

                router.push("/seller/medicines");
                router.refresh();
            } catch (error) {
                console.error("Form submission error:", error);
                toast.error("Something went wrong", { id: toastId });
            }
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEdit ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
                <CardDescription>
                    {isEdit ? "Update medicine details" : "Enter medicine details to add to your inventory"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="medicine-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        {/* Medicine Name */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Medicine Name <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            type="text"
                                            name={field.name}
                                            id={field.name}
                                            placeholder="e.g., Paracetamol"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Generic Name */}
                        <form.Field name="genericName">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Generic Name</FieldLabel>
                                        <Input
                                            type="text"
                                            name={field.name}
                                            id={field.name}
                                            placeholder="e.g., Acetaminophen"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Description */}
                        <form.Field name="description">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                        <Textarea
                                            name={field.name}
                                            id={field.name}
                                            placeholder="Medicine description and usage information"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            rows={4}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field name="price">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Price (৳) <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                name={field.name}
                                                id={field.name}
                                                placeholder="0.00"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                                                onBlur={field.handleBlur}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="stock">
                                {(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Stock Quantity <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                type="number"
                                                name={field.name}
                                                id={field.name}
                                                placeholder="0"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                                                onBlur={field.handleBlur}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>

                        {/* Manufacturer */}
                        <form.Field name="manufacturer">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Manufacturer</FieldLabel>
                                        <Input
                                            type="text"
                                            name={field.name}
                                            id={field.name}
                                            placeholder="e.g., Square Pharmaceuticals"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Category */}
                        <form.Field name="categoryId">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Category <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Select
                                            value={field.state.value}
                                            onValueChange={(val) => field.handleChange(val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Image URL */}
                        <form.Field name="imageUrl">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Image URL
                                        </FieldLabel>
                                        <Input
                                            type="url"
                                            name={field.name}
                                            id={field.name}
                                            placeholder="https://example.com/image.jpg"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Recommended: Use image hosting services like Imgur, Cloudinary
                                        </p>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Is Active */}
                        <form.Field name="isActive">
                            {(field) => (
                                <Field>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={field.name}
                                            checked={field.state.value}
                                            onCheckedChange={(checked) => field.handleChange(!!checked)}
                                        />
                                        <FieldLabel htmlFor={field.name} className="cursor-pointer">
                                            Active (visible in store)
                                        </FieldLabel>
                                    </div>
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="medicine-form"
                            className="flex-1"
                        >
                            {isEdit ? "Update Medicine" : "Add Medicine"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}