"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelOrder } from "@/action/order.action";
import { toast } from "sonner";

interface CancelOrderButtonProps {
    orderId: string;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Cancelling order...");

        try {
            const result = await cancelOrder(orderId);

            if (!result.ok) {
                toast.error(result.error?.message || "Failed to cancel order", { id: toastId });
                return;
            }

            toast.success("Order cancelled successfully", { id: toastId });

            // Close dialog and refresh page
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Cancel order error:", error);
            toast.error("Something went wrong", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                    Cancel Order
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to cancel this order? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>No, keep it</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? "Cancelling..." : "Yes, cancel order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}