/**
 * Medicines API Route
 * Path: src/app/api/medicines/route.ts
 * 
 * Server-side API route to fetch medicines
 * This keeps environment variables secure
 */

import { medicineService } from "@/services/medicine.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Build params object
        const params: Record<string, string> = {};

        // Extract all query parameters
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        // Call medicine service (this uses env variables safely on server)
        const { data, error } = await medicineService.getAllMedicine(params);

        if (error) {
            return NextResponse.json(
                { message: error, data: null },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Medicines fetched successfully",
            data,
        });
    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json(
            { message: "Failed to fetch medicines", data: null },
            { status: 500 }
        );
    }
}