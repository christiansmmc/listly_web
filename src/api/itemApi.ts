import {AddItemRequest, AuthHeader} from "../types/global.ts";
import api from "./axiosConfig.ts";

export const createItem = async (item: AddItemRequest, roomCode: string, roomPasscode: string) => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': roomPasscode}
    }

    await api.post(`/rooms/${roomCode}/items`, item, header);
};
