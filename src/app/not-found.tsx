import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Home,
    Search,
    ShoppingCart,
    AlertCircle,
    Pill
} from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-muted">
            <Card className="w-full max-w-2xl">
                <CardContent className="p-8 md:p-12">
                    {/* Icon Section */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Animated Pills */}
                            <div className="absolute -top-4 -left-4 animate-bounce">
                                <Pill className="h-8 w-8 text-primary opacity-60" />
                            </div>
                            <div className="absolute -top-2 -right-6 animate-bounce delay-200">
                                <Pill className="h-6 w-6 text-primary/40 rotate-45" />
                            </div>

                            {/* Main Icon */}
                            <div className="bg-destructive/10 p-6 rounded-full">
                                <AlertCircle className="h-24 w-24 text-destructive" />
                            </div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="text-center mb-4">
                        <h1 className="text-8xl md:text-9xl font-bold text-primary/20">
                            404
                        </h1>
                    </div>

                    {/* Title & Description */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Medicine Not Found
                        </h2>
                        <p className="text-lg text-muted-foreground mb-2">
                            Oops! This prescription seems to have expired.
                        </p>
                        <p className="text-muted-foreground">
                            The page you are looking for doesnt exist or has been moved.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto">
                                <Home className="mr-2 h-5 w-5" />
                                Back to Home
                            </Button>
                        </Link>

                        <Link href="/shop">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Browse Medicines
                            </Button>
                        </Link>
                    </div>

                    {/* Search Suggestion */}
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <p className="font-medium">Cant find what you need?</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Try searching our catalog of medicines or contact our support team
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Link href="/shop">
                                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                                    Search Medicines
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 pt-6 border-t">
                        <p className="text-center text-sm text-muted-foreground mb-3">
                            Popular Pages
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link href="/">
                                <Button variant="link" size="sm">
                                    Home
                                </Button>
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href="/orders">
                                <Button variant="link" size="sm">
                                    My Orders
                                </Button>
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <Link href="/reviews">
                                <Button variant="link" size="sm">
                                    Reviews
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Metadata for SEO
export const metadata = {
    title: "404 - Page Not Found | MediStore",
    description: "The page you're looking for doesn't exist.",
};