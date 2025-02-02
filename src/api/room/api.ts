import {
    AddItemRequest,
    FormatedCategoryDataType,
    FormatedRoomDataType,
    GetRoomDataResponseType,
    ItemGetCartDataResponse
} from "../../types/global.ts";
import {getAuthHeader} from "../../utils/securityUtils.ts";
import api from "../axiosConfig.ts";

export const getRoomDataRequest = async (
    roomCode: string | undefined,
    roomPasscode: string | undefined
): Promise<FormatedRoomDataType> => {
    const {data} = await api.get<GetRoomDataResponseType>(`/rooms/${roomCode}`, getAuthHeader(roomPasscode));

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

export const addRoomItemRequest = async (
    item: AddItemRequest,
    roomCode: string | undefined,
    roomPasscode: string | undefined
) => {
    await api.post(`/rooms/${roomCode}/items`, item, getAuthHeader(roomPasscode));
};
