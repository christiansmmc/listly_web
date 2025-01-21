import './App.css'
import {useEffect, useState} from "react";
import {LoggedInDataType, ValidateRoomRequest} from "./types/global.ts";
import LandingPage from "./pages/LandingPage.tsx";
import CreateCartPage from "./pages/CreateCartPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import {validateRoomRequest} from "./api/roomApi.ts";

function App() {
    const [newCartCode, setNewCartCode] = useState<number[]>([0, 0, 0, 0]);
    const [newCartPasscode, setNewCartPasscode] = useState<number[]>([0, 0, 0, 0]);
    const [isNewCartProcess, setIsNewCartProcess] = useState(false);
    const [loggedInData, setLoggedInData] = useState<LoggedInDataType>({
        roomCode: undefined,
        roomPasscode: undefined,
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const validateSavedRoom = (data: string) => {
        const localStorageData: LoggedInDataType = JSON.parse(data);
        const requestBody: ValidateRoomRequest = {
            code: localStorageData.roomCode || "",
            passcode: localStorageData.roomPasscode || ""
        };

        validateRoomRequest(requestBody)
            .then(() => {
                setLoggedInData(localStorageData)
                setIsLoggedIn(true)
            });
    }

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) validateSavedRoom(data);
    }, [])

    return (
        <div className='h-full'>
            {isLoggedIn && loggedInData.roomCode !== undefined && loggedInData.roomPasscode !== undefined
                ? <CartPage roomCode={loggedInData.roomCode} roomPasscode={loggedInData.roomPasscode}
                            setLoggedInData={setLoggedInData} setIsLoggedIn={setIsLoggedIn}/>
                : isNewCartProcess
                    ? (
                        <CreateCartPage newCartCode={newCartCode} newCartPasscode={newCartPasscode}
                                        setNewCartPasscode={setNewCartPasscode}
                                        setIsNewCartProccess={setIsNewCartProcess} setLoggedInData={setLoggedInData}
                                        setIsLoggedIn={setIsLoggedIn}/>
                    )
                    : <LandingPage setNewCartCode={setNewCartCode} setIsNewCartProccess={setIsNewCartProcess}/>
            }
        </div>
    )
}

export default App
