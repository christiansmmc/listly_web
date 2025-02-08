import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addRoomItemRequest, checkItemRequest, removeItemRequest} from "./api.ts";
import {AddItemDTO, GetRoomDataResponseType} from "../../types/global.ts";

export const useAddRoomItemMutate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({item, roomCode}: { item: AddItemDTO; roomCode: string }) =>
            addRoomItemRequest({name: item.name || "", category_id: item.category_id || 0}, roomCode),

        onMutate: async ({item, roomCode}) => {
            await queryClient.cancelQueries({queryKey: ["GetRoomData", roomCode]});

            const previousRoomData = queryClient.getQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode]);

            queryClient.setQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    items: [
                        ...oldData.items,
                        {
                            id: Math.random(),
                            name: item.name || "",
                            checked: false,
                            category: {id: item.category_id || Math.random(), name: item.category_name || ""},
                        },
                    ],
                };
            });

            return {previousRoomData};
        },

        onError: (_err, _variables, context) => {
            if (context?.previousRoomData) {
                queryClient.setQueryData(["GetRoomData", _variables.roomCode], context.previousRoomData);
            }
        },

        onSettled: (_data, _error, {roomCode}) => {
            queryClient.invalidateQueries({queryKey: ["GetRoomData", roomCode]});
        },
    });
};


export const useCheckItemMutate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({roomCode, itemId}: { roomCode?: string; itemId: number }) => {
            return checkItemRequest(roomCode || "", itemId);
        },

        onMutate: async ({roomCode, itemId}) => {
            await queryClient.cancelQueries({queryKey: ["GetRoomData", roomCode]});

            const previousRoomData = queryClient.getQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode]);

            queryClient.setQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    items: oldData.items.map((item) =>
                        item.id === itemId ? {...item, checked: !item.checked} : item
                    ),
                };
            });

            return {previousRoomData};
        },

        onError: (_err, _variables, context) => {
            if (context?.previousRoomData) {
                queryClient.setQueryData(["GetRoomData", _variables.roomCode], context.previousRoomData);
            }
        },

        onSettled: (_data, _error, {roomCode}) => {
            queryClient.invalidateQueries({queryKey: ["GetRoomData", roomCode]});
        },
    });
};

export const useRemoveItemMutate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({roomCode, itemId}: { roomCode?: string; itemId: number }) => {
            return removeItemRequest(roomCode || "", itemId);
        },

        onMutate: async ({roomCode, itemId}) => {
            await queryClient.cancelQueries({queryKey: ["GetRoomData", roomCode]});

            const previousRoomData = queryClient.getQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode]);

            queryClient.setQueryData<GetRoomDataResponseType>(["GetRoomData", roomCode], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    items: oldData.items.filter((item) => item.id !== itemId),
                };
            });

            return {previousRoomData};
        },

        onError: (_err, _variables, context) => {
            if (context?.previousRoomData) {
                queryClient.setQueryData(["GetRoomData", _variables.roomCode], context.previousRoomData);
            }
        },

        onSettled: (_data, _error, {roomCode}) => {
            queryClient.invalidateQueries({queryKey: ["GetRoomData", roomCode]});
        },
    });
};
