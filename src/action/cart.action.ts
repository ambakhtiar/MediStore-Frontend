"use server";

import { cartService } from "@/services/cart.service";
import { AddToCartPayload, UpdateItemPayload } from "@/types/cart.type";
import { updateTag } from "next/cache";


export const getCart = async () => {
    return await cartService.getCart();
};

export const addToCart = async (payload: AddToCartPayload) => {
    const res = await cartService.addToCart(payload);
    updateTag("CartAdd");
    return res;
};

export const updateCartItem = async (payload: UpdateItemPayload) => {
    const res = await cartService.updateCartItem(payload);
    updateTag("CartAdd");
    return res;
};

export const removeCartItem = async (cartItemId: string) => {
    const res = await cartService.removeCartItem(cartItemId);
    updateTag("CartAdd");
    return res;
};