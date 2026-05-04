"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import { User } from "@/types";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    // Redirect if already logged in
    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                router.replace(callbackUrl);
            }
        });
    }, [callbackUrl, router]);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: callbackUrl,
        });
    };

    const form = useForm({
        defaultValues: { email: "", password: "" },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Logging in...");
            try {
                const { data, error } = await authClient.signIn.email(value);
                // console.log(data, error);

                if (error) {
                    toast.error(error.message ?? "Invalid email or password", { id: toastId });
                    return;
                }

                if (!data) {
                    toast.error("Unexpected response from server", { id: toastId });
                    return;
                }

                const authUser = data.user as unknown as Partial<User> | undefined;

                if (authUser?.status === "BAN") {
                    toast.error("Your account has been banned. Contact admin.", { id: toastId });
                    await authClient.signOut();
                    return;
                };


                toast.success("Logged in successfully!", { id: toastId });
                router.push(callbackUrl);
                router.refresh();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Something went wrong";
                toast.error(message, { id: toastId });
            }
        },
    });

    return (
        <Card className="w-full max-w-sm" {...props}>
            <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Enter your email and password to sign in to your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    id="login-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
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
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                <Button form="login-form" type="submit" className="w-full">
                    Login
                </Button>

                {/* Demo Logins */}
                <div className="w-full flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 text-xs"
                        onClick={() => {
                            form.setFieldValue("email", "admin@medistore.com");
                            form.setFieldValue("password", "admin123");
                            // Optional: auto-submit
                            // setTimeout(() => form.handleSubmit(), 100);
                        }}
                    >
                        Demo Admin
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 text-xs"
                        onClick={() => {
                            form.setFieldValue("email", "seller@gmail.com");
                            form.setFieldValue("password", "seller123");
                        }}
                    >
                        Demo Seller
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 text-xs"
                        onClick={() => {
                            form.setFieldValue("email", "customer@gmail.com");
                            form.setFieldValue("password", "customer123");
                        }}
                    >
                        Demo Customer
                    </Button>
                </div>

                <div className="relative w-full text-center">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button onClick={handleGoogleLogin} variant="outline" type="button" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-2">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}