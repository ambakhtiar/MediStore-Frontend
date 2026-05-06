"use server";

import { UserParams, userService } from "@/services/user.service";

export const getSession = async () => {
    return await userService.getSession();
};

export const getAllUsers = async (params: UserParams = {}) => {
    return await userService.getAllUsers(params);
};

export const updateUserStatus = async (id: string, status: string) => {
    return await userService.updateUserStatus(id, status);
};