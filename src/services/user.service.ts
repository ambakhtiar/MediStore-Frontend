import { env } from "@/env";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export type UserParams = {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
};

export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const session = await res.json();

            if (session === null) {
                return { data: null, error: { message: "Session is missing." } };
            }

            return { data: session, error: null };
        } catch (err) {
            console.error(err);
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    getAllUsers: async function (params: UserParams = {}): Promise<ApiResponse<any>> {
        const cookieStore = await cookies();
        try {
            const url = new URL(`${API_URL}/admin/users`);
            if (params.search) url.searchParams.append("search", params.search);
            if (params.role) url.searchParams.append("role", params.role);
            if (params.status) url.searchParams.append("status", params.status);
            if (params.page) url.searchParams.append("page", params.page.toString());
            if (params.limit) url.searchParams.append("limit", params.limit.toString());
            if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
            if (params.sortOrder) url.searchParams.append("sortOrder", params.sortOrder);

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const body = await res.json().catch(() => null);


            if (!res.ok) {
                return {
                    ok: false,
                    status: res.status,
                    data: null,
                    error: { message: body?.message ?? "Failed to fetch users" },
                };
            }

            return {
                ok: true,
                status: res.status,
                data: body ?? null,
                error: null,
            };
        } catch (err) {
            console.error("user.service.getAllUsers error:", err);
            return {
                ok: false,
                status: 0,
                data: null,
                error: { message: "Network error" }
            };
        }
    },

    updateUserStatus: async function (id: string, status: string): Promise<ApiResponse<any>> {
        const cookieStore = await cookies();
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify({ status }),
            });

            const body = await res.json().catch(() => null);

            if (!res.ok) {
                return {
                    ok: false,
                    status: res.status,
                    data: null,
                    error: { message: body?.message ?? "Failed to update user status" },
                };
            }

            return {
                ok: true,
                status: res.status,
                data: body ?? null,
                error: null,
            };
        } catch (err) {
            console.error("user.service.updateUserStatus error:", err);
            return {
                ok: false,
                status: 0,
                data: null,
                error: { message: "Network error" }
            };
        }
    },
};
