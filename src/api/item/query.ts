import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addRoomItemRequest, checkItemRequest, removeItemRequest} from "./api.ts";
import {AddItemRequest} from "../../types/global.ts";

export const useAddRoomItemMutate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({item, roomCode}: {
            item: AddItemRequest
            roomCode: string
        }) =>
            addRoomItemRequest(item, roomCode),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["GetRoomData"]});
        },
    });
};

export const useCheckItemMutate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({roomCode, itemId}: { roomCode?: string; itemId: number }) => {
            return checkItemRequest(roomCode || "", itemId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['GetRoomData']})
        }
    });
};

export const useRemoveItemMutate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({roomCode, itemId}: { roomCode?: string; itemId: number }) => {
            return removeItemRequest(roomCode || "", itemId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['GetRoomData']})
        }
    });
};
