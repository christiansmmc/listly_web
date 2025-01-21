import {AuthHeader, ListCategoryResponse} from "../types/global.ts";
import api from "./axiosConfig.ts";

export const getCategories = async (roomPasscode: string): Promise<ListCategoryResponse[]> => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': roomPasscode}
    }

    const response = await api
        .get('/categories', header);

    return response.data
};
