import {AuthHeader, CreateCartFirstStepResponse, GetCartDataResponse, ValidateRoomRequest} from "../types/global.ts";
import api from "./axiosConfig.ts";

export const createRoomFirstStepRequest = async (): Promise<CreateCartFirstStepResponse> => {
    const response = await api
        .post<CreateCartFirstStepResponse>('/rooms/initial-step');

    return response.data;
};

export const createRoomLastStepRequest = async (requestBody: CreateCartFirstStepResponse) => {
    await api.post('/rooms/last-step', requestBody);
};

export const validateRoomRequest = async (requestBody: ValidateRoomRequest) => {
    await api.post(`/rooms/validate`, requestBody);
}

export const getRoomData = async (roomCode: string, roomPasscode: string): Promise<GetCartDataResponse> => {
    const header: AuthHeader = {
        headers: {'X-Room-Passcode': roomPasscode}
    }

    const response = await api
        .get(`/rooms/${roomCode}`, header);

    return response.data
}