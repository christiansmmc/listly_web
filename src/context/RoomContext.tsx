import React, {createContext, useContext, useState} from 'react';

type RoomDataType = {
    roomCode: string | undefined;
    setRoomCode: (code: string | undefined) => void;
};

const RoomContext = createContext<RoomDataType | undefined>(undefined);

export function RoomProvider({children}: { children: React.ReactNode }) {
    const [roomCode, setRoomCode] = useState<string | undefined>(undefined);

    return (
        <RoomContext.Provider value={{roomCode, setRoomCode}}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoomData() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoomData must be used inside a RoomProvider');
    }
    return context;
}