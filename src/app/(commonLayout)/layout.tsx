import { Navbar1 } from "@/components/layout/navbar1";
import { ReactNode } from "react";

const CommonLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-11/12 md:max-w-3xl lg:max-w-6xl mx-auto">
            <Navbar1 />
            {children}
        </div>
    );
};

export default CommonLayout;