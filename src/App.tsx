import './App.css'
import {useEffect, useState} from "react";
import {LoggedInDataType} from "./types/global.ts";
import LandingPage from "./pages/LandingPage.tsx";
import CreateCartPage from "./pages/CreateCartPage.tsx";

function App() {
    const [newCartCode, setNewCartCode] = useState<number[]>([0, 0, 0, 0]);
    const [newCartPasscode, setNewCartPasscode] = useState<number[]>([0, 0, 0, 0]);
    const [isNewCartProccess, setIsNewCartProccess] = useState(false);


    // TODO
    //  salvar no localStorage tudo menos o isLoggedIn, esse estado sera apenas no codigo ao iniciar sera feito um login na API
    //      sucesso -> isLoggedIn: true
    //      falha -> isLoggedIn: false
    const [loggedInData, setLoggedInData] = useState<LoggedInDataType>({
        "isLoggedIn": false,
        "cartCode": undefined,
        "cartPasscode": undefined,
    });

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) setLoggedInData(JSON.parse(data));
    }, [])

    return (
        <div className='h-full'>
            {loggedInData.isLoggedIn
                ? (<div></div>)
                : isNewCartProccess
                    ? (
                        <CreateCartPage newCartCode={newCartCode} newCartPasscode={newCartPasscode}
                                        setNewCartPasscode={setNewCartPasscode}
                                        setIsNewCartProccess={setIsNewCartProccess} setLoggedInData={setLoggedInData}/>
                    )
                    : <LandingPage setNewCartCode={setNewCartCode} setIsNewCartProccess={setIsNewCartProccess}/>
            }
        </div>
    )
}

export default App
