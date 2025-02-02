import {createContext, useContext, useState} from "react";
import {FormatedRoomDataType} from "../types/global.ts";

interface RoomItemsContextType {
    formatedRoomData: FormatedRoomDataType | null;
    setFormatedRoomData: (data: FormatedRoomDataType | null) => void;
}

const RoomItemsContext = createContext<RoomItemsContextType | undefined>(undefined);

export const RoomItemsProvider = ({children}: { children: React.ReactNode }) => {
    const [formatedRoomData, setFormatedRoomData] = useState<FormatedRoomDataType | null>(null);

    return (
        <RoomItemsContext.Provider value={{formatedRoomData, setFormatedRoomData}}>
            {children}
        </RoomItemsContext.Provider>
    );
};

export const useRoomItemsContext = () => {
    const context = useContext(RoomItemsContext);
    if (!context) {
        throw new Error("useRoomItemsContext deve ser usado dentro de um RoomItemsProvider");
    }
    return context;
}

