import './App.css'
import LandingPage from "./pages/LandingPage.tsx";
import {Route, useLocation} from "wouter";
import CartPage from "./pages/CartPage.tsx";
import CreateCartPage from "./pages/CreateCartPage.tsx";
import LoginCartPage from "./pages/LoginCartPage.tsx";
import {getRoomFromAccessToken} from "./utils/securityUtils.ts";
import {useRoomData} from "./context/RoomContext.tsx";
import {useAuthData} from "./context/AuthContext.tsx";
import {useEffect} from "react";

function App() {
    const [, setLocation] = useLocation();

    const {setRoomCode} = useRoomData();
    const {setIsLoggedIn} = useAuthData();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const roomCode: string = getRoomFromAccessToken(accessToken)

            setIsLoggedIn(true)
            setRoomCode(roomCode);
            setLocation(`/room/${roomCode}`)
        }
    }, []);

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
