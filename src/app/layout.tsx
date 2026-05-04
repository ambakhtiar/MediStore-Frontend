import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";
import { CartProvider } from "@/providers/cart-context";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: "%s | MediStore",
        default: "MediStore — Your Trusted Online Medicine Shop",
    },
    description:
        "Order genuine medicines online with fast delivery. MediStore connects you with verified pharmacists and trusted sellers across Bangladesh.",
    keywords: ["medicine", "pharmacy", "online pharmacy", "buy medicine", "MediStore"],
    authors: [{ name: "MediStore Team" }],
    openGraph: {
        siteName: "MediStore",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen`}
            >
                <CartProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange={false}
                    >
                        {children}
                        <Toaster
                            richColors
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                            }}
                        />
                    </ThemeProvider>
                </CartProvider>
            </body>
        </html>
    );
}
