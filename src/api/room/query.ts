import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AddItemRequest, FormatedRoomDataType} from "../../types/global.ts";
import {AxiosError} from "axios";
import {RequestError} from "../interfaces/requests.ts";
import {addRoomItemRequest, getRoomDataRequest} from "./api.ts";

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