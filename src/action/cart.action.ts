"use server";

import { cartService } from "@/services/cart.service";
import { AddToCartPayload } from "@/types/cart.type";
import { revalidateTag } from "next/cache";


export const getCart = async () => {
    return await cartService.getCart();
};

export const addToCart = async (payload: AddToCartPayload) => {
    const res = await cartService.addToCart(payload);
    revalidateTag("CartAdd", "path");
    return res;
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
    const res = await cartService.updateCartItem({ id: cartItemId, quantity });
    revalidateTag("CartAdd", "path");
    return res;
};

export const deleteCartItem = async (cartItemId: string) => {
    const res = await cartService.removeCartItem(cartItemId);
    revalidateTag("CartAdd", "path");
    return res;
};