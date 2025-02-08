import {useMutation, useQuery} from "@tanstack/react-query";
import {FormatedRoomDataType} from "../../types/global.ts";
import {AxiosError} from "axios";
import {RequestError} from "../interfaces/requests.ts";
import {
    createRoomFirstStepRequest,
    createRoomLastStepRequest,
    generateRoomAccessCode,
    getRoomDataRequest,
    validateRoomAccessCodeRequest,
    validateRoomRequest
} from "./api.ts";
import {ValidateRoomAccessCodeResponseType, ValidateRoomResponseType} from "../interfaces/room.ts";
import {useLocation} from "wouter";
import {useRoomData} from "../../context/RoomContext.tsx";
import {useAuthData} from "../../context/AuthContext.tsx";

export const useGetRoomDataQuery = (roomCode?: string) => {
    return useQuery<FormatedRoomDataType, AxiosError<RequestError>>({
        queryKey: ["GetRoomData", roomCode],
        queryFn: () => getRoomDataRequest(roomCode!),
        enabled: !!roomCode,
    });
};

export const useGenerateRoomAccessCodeQuery = () => {
    return useMutation({
        mutationFn: async ({roomCode}: { roomCode: string; }) =>
            generateRoomAccessCode(roomCode)
    });
};

export const useValidateRoomMutate = () => {
    const [, setLocation] = useLocation();

    return useMutation({
        mutationFn: async ({roomCode, roomPasscode}: { roomCode: string; roomPasscode: string }) => {
            return validateRoomRequest({code: roomCode, passcode: roomPasscode});
        },
        onSuccess: (data: ValidateRoomResponseType, variables) => {
            localStorage.setItem("accessToken", data.access_token);
            setLocation(`/room/${variables.roomCode}`);
        }
    });
};

export const useValidateRoomAccessCodeMutate = () => {
    const [, setLocation] = useLocation();
    const {setRoomCode} = useRoomData();
    const {setIsLoggedIn} = useAuthData();

    return useMutation({
        mutationFn: async ({roomCode, roomAccessCode}: { roomCode: string; roomAccessCode: string }) => {
            return validateRoomAccessCodeRequest({room_code: roomCode, access_code: roomAccessCode});
        },
        onSuccess: (data: ValidateRoomAccessCodeResponseType, variables) => {
            localStorage.setItem("accessToken", data.access_token);
            setRoomCode(variables.roomCode)
            setIsLoggedIn(true)

            setLocation(`/room/${variables.roomCode}`);
        }
    });
};

export const useCreateRoomFirstStepMutate = () => {
    return useMutation({
        mutationFn: async () => {
            return createRoomFirstStepRequest();
        },
    });
};

export const useCreateRoomLastStepMutate = () => {
    return useMutation({
        mutationFn: async ({roomCode, roomPasscode}: { roomCode: string; roomPasscode: string }) => {
            return createRoomLastStepRequest({code: roomCode, passcode: roomPasscode});
        },
    });
};
