import api from "../axiosConfig.ts";
import { AddItemRequest } from "../../types/global.ts";

export const addRoomItemRequest = async (
    item: AddItemRequest,
    roomCode: string | undefined,
) => {
    await api.post(`/rooms/${roomCode}/items`, item);
};

export const checkItemRequest = async (
    roomCode: string,
    itemId: number
) => {
    await api.patch(`/rooms/${roomCode}/items/${itemId}`);
}

export const removeItemRequest = async (
    roomCode: string,
    itemId: number
) => {
    await api.delete(`/rooms/${roomCode}/items/${itemId}`);
}

export const getProductSuggestionsRequest = async (query: string) => {
    const { data } = await api.get('/product-suggestions', { params: { q: query } });
    return data;
};
