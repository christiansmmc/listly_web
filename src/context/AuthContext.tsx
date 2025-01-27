import React, {createContext, useContext, useState} from "react";

type AuthDataType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthDataType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {
    },
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthData() {
    return useContext(AuthContext);
}
