import {AddItemRequest, AuthHeader} from "../types/global.ts";
import api from "./axiosConfig.ts";
import {decrypt} from "../utils/securityUtils.ts";

export const createItemRequest = async (item: AddItemRequest, roomCode: string, roomPasscode: string) => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': decrypt(roomPasscode)}
    }

    await api.post(`/rooms/${roomCode}/items`, item, header);
};

export const checkItemRequest = async (roomCode: string, roomPasscode: string, itemId: number) => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': decrypt(roomPasscode)}
    }

    await api.patch(`/rooms/${roomCode}/items/${itemId}`, null, header);
}

export const removeItemRequest = async (roomCode: string, roomPasscode: string, itemId: number) => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': decrypt(roomPasscode)}
    }

    await api.delete(`/rooms/${roomCode}/items/${itemId}`, header);
}
