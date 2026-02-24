import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SellerLayout({ children }: { children: React.ReactNode }) {

    return <DashboardLayout role="seller">
        {children}
    </DashboardLayout>;
}