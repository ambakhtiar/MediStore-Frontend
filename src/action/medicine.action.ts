"use server";

import { medicineService } from "@/services/medicine.service";
import { ServiceOption } from "@/types";

export const getAllMedicine = async () => {
    const res = await medicineService.getAllMedicine();
    return res;
}

export const getMedicineById = async (id: string, option?: ServiceOption) => {
    const { data, status } = await medicineService.getMedicineById(id, option);
    return { data, status };
}