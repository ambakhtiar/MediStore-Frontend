import { MedicineType } from "./medicine.type";

export type AddToCartPayload = {
    medicineId: string;
    quantity: number;
};

export type ClientApiResult<T = unknown> = {
    ok: boolean;
    status: number;
    data?: T | null;
    error?: { message: string } | null;
};

export type CartItemType = {
    id: string;
    quantity: number,
    unitPrice: number,
    medicine: MedicineType
}

export type UpdateItemPayload = {
    id: string;
    quantity: number;
};