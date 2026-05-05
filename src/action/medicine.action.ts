"use server";

import { medicineService, getMEdicineParams } from "@/services/medicine.service";
import { ServiceOption } from "@/types";

export const getAllMedicine = async (params?: getMEdicineParams) => {
    const res = await medicineService.getAllMedicine(params);
    return res;
}

export const getMedicineById = async (id: string, option?: ServiceOption) => {
    const { data, status } = await medicineService.getMedicineById(id, option);
    return { data, status };
}