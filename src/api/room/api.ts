import {
    FormatedCategoryDataType,
    FormatedRoomDataType,
    GetRoomDataResponseType,
    ItemGetCartDataResponse
} from "../../types/global.ts";
import api from "../axiosConfig.ts";
import {
    CreateCartFirstStepResponseType,
    CreateRoomLastStepRequestType,
    GenerateAccessCodeResponseType,
    ValidateRoomAccessCodeRequestType,
    ValidateRoomAccessCodeResponseType,
    ValidateRoomRequestType,
    ValidateRoomResponseType
} from "../interfaces/room.ts";

export const getRoomDataRequest = async (
    roomCode: string
): Promise<FormatedRoomDataType> => {
    const {data} = await api.get<GetRoomDataResponseType>(`/rooms/${roomCode}`);

    const categoryMap = new Map<number, FormatedCategoryDataType>();

    data.items.forEach((item: ItemGetCartDataResponse) => {
        if (!categoryMap.has(item.category.id)) {
            categoryMap.set(item.category.id, {
                id: item.category.id,
                name: item.category.name,
                items: [],
            });
        }
        categoryMap.get(item.category.id)!.items.push({
            id: item.id,
            name: item.name,
            checked: item.checked,
        });
    });

    return {
        name: data.name,
        categories: Array.from(categoryMap.values()),
    };
};

export const validateRoomRequest = async (requestBody: ValidateRoomRequestType): Promise<ValidateRoomResponseType> => {
    const {data} = await api.post(`/rooms/validate`, requestBody);
    return data;
};

export const validateRoomAccessCodeRequest = async (requestBody: ValidateRoomAccessCodeRequestType): Promise<ValidateRoomAccessCodeResponseType> => {
    const {data} = await api.post(`/rooms/validate/access-code`, requestBody);
    return data;
};

export const createRoomFirstStepRequest = async (): Promise<CreateCartFirstStepResponseType> => {
    const {data} = await api.post('/rooms/initial-step');
    return data;
};

export const createRoomLastStepRequest = async (requestBody: CreateRoomLastStepRequestType) => {
    const {data} = await api.post('/rooms/last-step', requestBody);
    return data;
};

export const generateRoomAccessCode = async (roomCode: string): Promise<GenerateAccessCodeResponseType> => {
    const {data} = await api.get(`/rooms/${roomCode}/generate-access-code`);
    return data;
}