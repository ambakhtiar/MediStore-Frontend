import { RegisterForm } from "@/components/modules/authentication/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Register | MediStore" };

export default function RegisterPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 md:p-10">
            <RegisterForm />
        </div>
    );
}