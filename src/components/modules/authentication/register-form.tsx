"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["CUSTOMER", "SELLER"], { message: "Please select a role" }),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                router.replace("/");
            }
        });
    }, [router]);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000",
        });
    };

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "CUSTOMER" as "CUSTOMER" | "SELLER",
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating your account...");
            try {
                const { data, error } = await authClient.signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,

                    // @ts-expect-error — custom field
                    role: value.role,
                });

                if (error) {
                    toast.error(error.message ?? "Unable to create account", { id: toastId });
                    return;
                }

                toast.success("Account created! Welcome to MediStore 🎉", { id: toastId });
                router.push("/");
                router.refresh();
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong. Please try again.", { id: toastId });
            }
        },
    });

    return (
        <Card className="w-full max-w-sm" {...props}>
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="register-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                        <Input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="John Doe"
                                            autoComplete="name"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="email">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            type="email"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="password">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <Input
                                            type="password"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="role">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>I am a</FieldLabel>
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value as "CUSTOMER" | "SELLER")
                                            }
                                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="CUSTOMER">Customer — I want to buy medicines</option>
                                            <option value="SELLER">Seller — I want to sell medicines</option>
                                        </select>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                <Button type="submit" form="register-form" className="w-full">
                    Create Account
                </Button>
                <Button onClick={handleGoogleLogin} variant="outline" type="button" className="w-full">
                    Continue with Google
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

