import {useQuery} from "@tanstack/react-query";
import {ListCategoryResponse} from "../../types/global.ts";
import {AxiosError} from "axios";
import {RequestError} from "../interfaces/requests.ts";
import {getCategoriesRequest} from "./api.ts";

export const useGetCategoriesQuery = () => {
    return useQuery<ListCategoryResponse[], AxiosError<RequestError>>({
        queryKey: ["GetCategories"],
        queryFn: () => getCategoriesRequest(),
    });
};
