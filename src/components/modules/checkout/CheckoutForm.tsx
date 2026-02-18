"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { createOrder } from "@/action/order.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCart } from "@/providers/cart-context";

interface CheckoutFormProps {
    subtotal: number;
    itemCount: number;
}

// Validation Schema
const checkoutFormSchema = z.object({
    shippingName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    shippingPhone: z
        .string()
        .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number (e.g., 01712345678)"),

    shippingAddress: z
        .string()
        .min(20, "Address must be at least 100 characters (please provide details)")
        .max(500, "Address cannot exceed 500 characters"),
});

export default function CheckoutForm({ subtotal, itemCount }: CheckoutFormProps) {
    const router = useRouter();
    const { refreshCart } = useCart();

    const form = useForm({
        defaultValues: {
            shippingName: "",
            shippingPhone: "",
            shippingAddress: "",
        },
        validators: {
            onSubmit: checkoutFormSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Processing order...");

            try {
                const result = await createOrder(value);

                if (!result.ok) {
                    toast.error(result.error?.message || "Order could not be placed", { id: toastId });
                    return;
                }

                toast.success("Order placed successfully!", { id: toastId });

                // Redirect to orders page
                router.push("/orders");

                // Refresh cart (will be empty now)
                await refreshCart();

                router.refresh();
            } catch (error) {
                console.error("Order submission error:", error);
                toast.error("Something went wrong", { id: toastId });
            }
        },
    });

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Information</CardTitle>
                        <CardDescription>Please provide your delivery details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="checkout-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                        >
                            <FieldGroup>
                                {/* Shipping Name */}
                                <form.Field name="shippingName">
                                    {(field) => (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Name <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                type="text"
                                                name={field.name}
                                                id={field.name}
                                                placeholder="Enter your full name"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )}
                                </form.Field>

                                {/* Shipping Phone */}
                                <form.Field name="shippingPhone">
                                    {(field) => (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Mobile Number <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                type="tel"
                                                name={field.name}
                                                id={field.name}
                                                placeholder="01712345678"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                inputMode="numeric"
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )}
                                </form.Field>

                                {/* Shipping Address */}
                                <form.Field name="shippingAddress">
                                    {(field) => (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Full Address <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Textarea
                                                name={field.name}
                                                id={field.name}
                                                placeholder="Enter your complete address (House no, Road no, Area, Thana, District)"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                rows={5}
                                                className="resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {field.state.value.length}/500 characters (minimum 100 characters)
                                            </p>
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )}
                                </form.Field>
                            </FieldGroup>

                            {/* Submit Button */}
                            <Button type="submit" form="checkout-form" className="w-full mt-6">
                                Confirm Order
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Item Count</span>
                        <span className="font-medium">{itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Charge</span>
                        <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>৳{subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Info */}
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <h4 className="font-semibold mb-2">Payment Method</h4>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                ৳
                            </div>
                            <div>
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-xs text-muted-foreground">
                                    Pay when you receive the product
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}