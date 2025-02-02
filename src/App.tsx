import './App.css'
import {useEffect} from "react";
import {LoggedInDataType, ValidateRoomRequest} from "./types/global.ts";
import LandingPage from "./pages/LandingPage.tsx";
import {validateRoomRequest} from "./api/roomApi.ts";
import {decrypt, encrypt} from "./utils/securityUtils.ts";
import {Route, useLocation} from "wouter";
import CartPage from "./pages/CartPage.tsx";
import CreateCartPage from "./pages/CreateCartPage.tsx";
import {useRoomData} from "./context/RoomContext.tsx";
import {useAuthData} from "./context/AuthContext.tsx";
import LoginCartPage from "./pages/LoginCartPage.tsx";

function App() {
    const {setRoomCode, setRoomPasscode} = useRoomData();
    const {setIsLoggedIn} = useAuthData();

    const [, setLocation] = useLocation();

    const validateSavedRoom = (data: string) => {
        const localStorageData: LoggedInDataType = JSON.parse(data);
        const requestBody: ValidateRoomRequest = {
            code: localStorageData.roomCode || "",
            passcode: decrypt(localStorageData.roomPasscode || "")
        };

        validateRoomRequest(requestBody)
            .then(() => {
                setRoomCode(requestBody.code)
                setRoomPasscode(encrypt(requestBody.passcode))
                setIsLoggedIn(true)

                setLocation(`/room/${requestBody.code}`)
            })
            .catch(() => localStorage.clear());
    }

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) validateSavedRoom(data);
    }, [])

    return (
        <>
            <Route path="/">
                {() => <LandingPage/>}
            </Route>
            <Route path="/create-room">
                {() => <CreateCartPage/>}
            </Route>
            <Route path="/login-room">
                {() => <LoginCartPage/>}
            </Route>
            <Route path="/room/:roomCode">
                {({roomCode}) => <CartPage urlRoomCode={roomCode}/>}
            </Route>
        </>
    );
}

export default App
