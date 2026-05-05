import { LoginForm } from "@/components/modules/authentication/login-form";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";


export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10">
            {/* Suspense needed because LoginForm uses useSearchParams */}
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}