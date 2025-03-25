import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';
import BackgroundImage from '../assets/background.jpeg';
import { useState } from "react";
import { useLocation } from "wouter";
import OTPInput from "react-otp-input";
import { useValidateRoomMutate } from "../api/room/query.ts";

const LoginCartPage = () => {
    const [loginRoomCode, setLoginRoomCode] = useState('');
    const [loginRoomPasscode, setLoginRoomPasscode] = useState('');

    const [, setLocation] = useLocation();

    const { mutate } = useValidateRoomMutate();

    const handleLoginRoom = () => {
        if (loginRoomCode.length < 4 || loginRoomPasscode.length < 4) return;
        mutate({ roomCode: loginRoomCode, roomPasscode: loginRoomPasscode })
    }

    return (
        <div className='h-full flex flex-col' style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <header className="w-full h-20 flex items-center justify-center bg-[#FDF7EB] bg-opacity-95 shadow-sm">
                <h1 className='text-4xl font-extrabold text-[#F4976C]'>Listly</h1>
            </header>

            <main className='flex-1 flex flex-col items-center justify-center px-4 relative'>
                <div className='w-full max-w-md bg-[#fdfaf2] bg-opacity-95 p-8 border border-[#B48768] rounded-lg shadow-md'>
                    <div className="mb-6">
                        <h2 className='text-xl text-center font-semibold text-[#F4976C] mb-4'>Código da lista</h2>
                        <div className="flex justify-center">
                            <OTPInput
                                inputType={'number'}
                                placeholder={'0000'}
                                value={loginRoomCode}
                                onChange={setLoginRoomCode}
                                numInputs={4}
                                renderSeparator={<span className="mx-1.5"></span>}
                                inputStyle={{ width: '45px' }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        className='text-3xl text-center rounded bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A9DEF9]'
                                    />
                                )}
                            />
                        </div>
                        <p className='text-sm text-center text-gray-600 mt-3'>Digite o código de acesso da sua lista</p>
                    </div>

                    <div>
                        <h2 className='text-xl text-center font-semibold text-[#F4976C] mb-4'>Senha da lista</h2>
                        <div className="flex justify-center">
                            <OTPInput
                                inputType={'number'}
                                placeholder={'0000'}
                                value={loginRoomPasscode}
                                onChange={setLoginRoomPasscode}
                                numInputs={4}
                                renderSeparator={<span className="mx-1.5"></span>}
                                inputStyle={{ width: '45px' }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        className='text-3xl text-center rounded bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A9DEF9]'
                                    />
                                )}
                            />
                        </div>
                        <p className='text-sm text-center text-gray-600 mt-3'>Digite a senha de acesso da sua lista</p>
                    </div>
                </div>

                <div className='absolute bottom-6 left-0 right-0 w-full px-4'>
                    <div className='mx-auto max-w-md flex items-center gap-3'>
                        <button
                            onClick={() => setLocation("/")}
                            className='w-14 h-14 flex-shrink-0 shadow-md bg-[#fdfaf2] border border-[#B48768] flex items-center justify-center rounded-lg cursor-pointer
                            transition transform hover:scale-[1.05] hover:shadow-lg active:scale-[0.98] active:shadow-sm'>
                            <img src={LeftArrowIcon} alt="Voltar" className="h-7 w-7 sm:h-8 sm:w-8" />
                        </button>

                        <button
                            onClick={handleLoginRoom}
                            disabled={loginRoomCode.length < 4 || loginRoomPasscode.length < 4}
                            className='flex-1 h-14 shadow-md bg-[#F4976C] text-white border border-[#B48768] flex items-center justify-center rounded-lg gap-3
                            transition transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:shadow-sm
                            disabled:bg-[#fdfaf2] disabled:text-[#B48768] disabled:cursor-not-allowed disabled:hover:scale-100'>
                            <img
                                src={EmptyCartIcon}
                                alt="Entrar na lista"
                                className={`h-9 w-9 ${loginRoomCode.length < 4 || loginRoomPasscode.length < 4 ? '' : 'filter brightness-0 invert'}`}
                            />
                            <span className='text-sm font-medium sm:text-lg'>Entrar na lista de compras</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginCartPage
