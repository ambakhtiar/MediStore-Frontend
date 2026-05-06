import { Navbar } from "@/components/layout/navbar";
import { ReactNode } from "react";
import { getSession } from "@/action/user.action";

export const dynamic = "force-dynamic";

const CommonLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getSession();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar session={session} />
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    );
};

export default CommonLayout;