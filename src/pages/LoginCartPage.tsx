import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';
import BackgroundImage from '../assets/background.jpeg';
import {useState} from "react";
import {useAuthData} from "../context/AuthContext.tsx";
import {useLocation} from "wouter";
import {useRoomData} from "../context/RoomContext.tsx";
import OTPInput from "react-otp-input";
import {LoggedInDataType, ValidateRoomRequest} from "../types/global.ts";
import {validateRoomRequest} from "../api/roomApi.ts";
import {encrypt} from "../utils/securityUtils.ts";

const LoginCartPage = () => {
    const [loginRoomCode, setLoginRoomCode] = useState('');
    const [loginRoomPasscode, setLoginRoomPasscode] = useState('');

    const [, setLocation] = useLocation();

    const {setRoomCode, setRoomPasscode} = useRoomData();
    const {setIsLoggedIn} = useAuthData();

    const handleLoginRoom = () => {
        const requestBody: ValidateRoomRequest = {
            code: loginRoomCode,
            passcode: loginRoomPasscode,
        }

        validateRoomRequest(requestBody)
            .then(() => {
                const localStorageData: LoggedInDataType = {
                    roomCode: loginRoomCode,
                    roomPasscode: encrypt(loginRoomPasscode),
                }

                setIsLoggedIn(true)
                setRoomCode(loginRoomCode)
                setRoomPasscode(encrypt(loginRoomPasscode))

                localStorage.setItem('data', JSON.stringify(localStorageData))

                setLocation(`/room/${loginRoomCode}`)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    return (
        <div className='h-full w-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            <div className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-95">
                <p className='text-4xl font-extrabold text-[#F4976C]'>Listly</p>
            </div>
            <div className='h-full flex flex-col items-center justify-center gap-2'>
                <div
                    className='w-[90%] flex flex-col items-center gap-10 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded'>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>
                        Digite o código da sua lista de compras
                    </p>
                    <OTPInput
                        placeholder={'0000'}
                        value={loginRoomCode}
                        onChange={setLoginRoomCode}
                        numInputs={4}
                        shouldAutoFocus
                        renderSeparator={<span className="mx-1"> </span>}
                        inputStyle={{'width': '40px'}}
                        renderInput={(props) => (
                            <input
                                {...props}
                                className='text-3xl text-center rounded bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:[#A9DEF9]'
                            />
                        )}
                    />
                </div>
                <div
                    className='w-[90%] flex flex-col items-center gap-10 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded'>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>
                        Digite a senha da sua lista de compras
                    </p>
                    <OTPInput
                        placeholder={'0000'}
                        value={loginRoomPasscode}
                        onChange={setLoginRoomPasscode}
                        numInputs={4}
                        renderSeparator={<span className="mx-1"></span>}
                        inputStyle={{'width': '40px'}}
                        renderInput={(props) => (
                            <input
                                {...props}
                                className='text-3xl text-center rounded bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:[#A9DEF9]'
                            />
                        )}
                    />
                </div>
            </div>
            <div className='absolute bottom-10 h-16 w-full flex items-center justify-center px-2 gap-2'>
                <div className='h-full w-1/5 flex items-center justify-between'>
                    <div
                        onClick={() => setLocation("/")}
                        className='w-full h-16 shadow bg-[#fdfaf2] border border-[#B48768] flex items-center justify-center rounded-lg cursor-pointer gap-3
                        transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm'>
                        <img src={LeftArrowIcon} alt="icone" className="h-9 w-9 cursor-pointer"/>
                    </div>
                </div>
                <div className='h-full w-3/4 flex items-center justify-between'>
                    <div
                        onClick={handleLoginRoom}
                        className='w-full h-16 shadow bg-[#fdfaf2] border border-[#B48768] flex items-center justify-center rounded-lg cursor-pointer gap-3
                        transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm'>
                        <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                        <p className='text-lg'>Entrar na lista de compras</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginCartPage
