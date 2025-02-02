import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AddItemRequest, FormatedRoomDataType, LocalStorageDataType} from "../../types/global.ts";
import {AxiosError} from "axios";
import {RequestError} from "../interfaces/requests.ts";
import {addRoomItemRequest, getRoomDataRequest, validateRoomRequest} from "./api.ts";
import {ValidateRoomResponseType} from "../interfaces/room.ts";
import {useLocation} from "wouter";

export const useGetRoomDataQuery = (roomCode?: string, roomPasscode?: string) => {
    return useQuery<FormatedRoomDataType, AxiosError<RequestError>>({
        queryKey: ["GetRoomData", roomCode, roomPasscode],
        queryFn: () => getRoomDataRequest(roomCode!, roomPasscode!),
        enabled: !!roomCode && !!roomPasscode,
    });
};

export const useAddRoomItemMutate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({item, roomCode, roomPasscode}: {
            item: AddItemRequest;
            roomCode: string;
            roomPasscode: string
        }) =>
            addRoomItemRequest(item, roomCode, roomPasscode),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["GetRoomData"]});
        },
    });
};

export const useValidateRoomMutate = () => {
    const [, setLocation] = useLocation();

    return useMutation({
        mutationFn: async ({roomCode, roomPasscode}: { roomCode: string; roomPasscode: string }) => {
            return validateRoomRequest({code: roomCode, passcode: roomPasscode});
        },
        onSuccess: (data: ValidateRoomResponseType, variables) => {
            const localStorageData: LocalStorageDataType = {
                accessToken: data.access_token,
            };
            localStorage.setItem("data", JSON.stringify(localStorageData));
            setLocation(`/room/${variables.roomCode}`);
        }
    });
};
