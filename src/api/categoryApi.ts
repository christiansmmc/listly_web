import {AuthHeader, ListCategoryResponse} from "../types/global.ts";
import api from "./axiosConfig.ts";
import {decrypt} from "../utils/securityUtils.ts";

export const getCategories = async (roomPasscode: string): Promise<ListCategoryResponse[]> => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': decrypt(roomPasscode)}
    }

    const response = await api
        .get('/categories', header);

    return response.data
};
