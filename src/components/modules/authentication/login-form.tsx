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
                <Button onClick={handleGoogleLogin} variant="outline" type="button" className="w-full">
                    Continue with Google
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}