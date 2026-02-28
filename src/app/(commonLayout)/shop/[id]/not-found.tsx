import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Home, Search, AlertTriangle } from "lucide-react";

export default function MedicineNotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-500/10 p-4 rounded-full">
                            <div className="relative">
                                <Pill className="h-16 w-16 text-amber-500" />
                                <AlertTriangle className="h-8 w-8 text-amber-500 absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <h2 className="text-2xl font-bold mb-3">
                        Medicine Not Available
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        This medicine is currently unavailable or has been discontinued.
                        It may have been removed from our catalog.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                        <Link href="/shop">
                            <Button className="w-full sm:w-auto">
                                <Search className="mr-2 h-4 w-4" />
                                Browse All Medicines
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-muted-foreground">
                        Need help finding a specific medicine?{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            Contact our pharmacy team
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}