import { env } from "@/env";

const API_URL = env.API_URL;

interface ServiceOption {
    cache?: RequestCache,
    revalidate?: number
}
interface getMEdicineParams {
    search?: string,
    page?: string,
    limit?: string
}

export const medicineService = {
    getAllMedicine: async function (params?: getMEdicineParams, option?: ServiceOption) {
        try {
            const url = new URL(`${API_URL}/medicines`);
            if (params) {
                Object.entries(params).forEach(([keyof, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        url.searchParams.append(keyof, value)
                    }
                })
            }

            const config: RequestInit = {};
            if (option?.cache) {
                config.cache = option.cache;
            }
            if (option?.revalidate) {
                config.next = { revalidate: option.revalidate };
            }

            config.next = { ...config.next, tags: ["medicines"] };

            const res = await fetch(url.toString(), config);
            const data = await res.json();

            return { data, error: null }
        } catch (err) {
            return { data: null, error: "Something Went Wrong !" }
        }
    },
}