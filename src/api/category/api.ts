import api from "../axiosConfig.ts";
import {ListCategoryResponse} from "../../types/global.ts";

export const getCategoriesRequest = async (): Promise<ListCategoryResponse[]> => {
    const {data} = await api.get('/categories');
    return data
};