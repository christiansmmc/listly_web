import {AxiosRequestConfig} from "axios";

export interface CreateCartFirstStepResponse {
    code: string
}

export interface CreateCartFirstStepResponse {
    code: string
    passcode: string
}

export interface LoggedInDataType {
    roomCode: string | undefined
    roomPasscode: string | undefined
}

export interface CategoryResponse {
    id: number,
    name: string,
}

export interface ItemGetCartDataResponse {
    id: number,
    name: string,
    checked: boolean,
    category: CategoryResponse
}

export interface GetCartDataResponse {
    name: string,
    code: string,
    items: ItemGetCartDataResponse[],
}

export interface ListCategoryResponse {
    id: number,
    name: string,
}

export interface AddItemRequest {
    name?: string,
    category_id?: number,
}

export interface ValidateRoomRequest {
    code: string
    passcode: string
}

export interface AuthHeader extends AxiosRequestConfig {
    headers: {
        'X-Room-Passcode': string;
    };
}

export interface FormatedItemDataType {
    id: number,
    name: string,
    checked: boolean,
}

export interface FormatedCategoryDataType {
    id: number,
    name: string,
    items: FormatedItemDataType[]
}

export interface FormatedRoomDataType {
    name: string
    categories: FormatedCategoryDataType[]
}
