import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';
import BackgroundImage from '../assets/background.jpeg';
import { useEffect, useState } from "react";
import { useAuthData } from "../context/AuthContext.tsx";
import { useLocation } from "wouter";
import { useRoomData } from "../context/RoomContext.tsx";
import { useCreateRoomFirstStepMutate, useCreateRoomLastStepMutate, useValidateRoomMutate } from "../api/room/query.ts";
import OTPInput from "react-otp-input";

const CreateCartPage = () => {
    const [newCartCode, setNewCartCode] = useState('');
    const [newCartPasscode, setNewCartPasscode] = useState('');
    const [, setLocation] = useLocation();

    const { setRoomCode } = useRoomData();
    const { setIsLoggedIn } = useAuthData();

    const { mutateAsync: validateRoomMutate } = useValidateRoomMutate();
    const { mutateAsync: createRoomFirstStepMutate } = useCreateRoomFirstStepMutate();
    const { mutateAsync: createRoomLastStepMutate } = useCreateRoomLastStepMutate();

    const createCartFirstStep = async () => {
        const createRoomFirstStepResponse = await createRoomFirstStepMutate()
        setNewCartCode(createRoomFirstStepResponse.code);
    }

    const createCartLastStep = async () => {
        if (newCartPasscode.length < 4) return;

        await createRoomLastStepMutate({ roomCode: newCartCode, roomPasscode: newCartPasscode });
        setRoomCode(newCartCode);
        setIsLoggedIn(true)
        await validateRoomMutate({ roomCode: newCartCode, roomPasscode: newCartPasscode });
    }

    useEffect(() => {
        createCartFirstStep()
    }, [])

    return (
        <div className='min-h-screen w-full flex flex-col' style={{ backgroundImage: `url(${BackgroundImage})` }}>
            {/* Header */}
            <header className="w-full h-20 flex items-center justify-center bg-[#FDF7EB] bg-opacity-95 shadow-sm">
                <h1 className='text-4xl font-extrabold text-[#F4976C]'>Listly</h1>
            </header>

            {/* Main Content */}
            <main className='flex-1 flex flex-col items-center justify-center py-8 px-4 relative'>
                <div className='w-full max-w-md bg-[#fdfaf2] bg-opacity-95 p-8 border border-[#B48768] rounded-lg shadow-md mb-6'>
                    <div className="mb-6">
                        <h2 className='text-xl text-center font-semibold text-[#F4976C] mb-4'>Código da sua lista</h2>
                        <div className="flex justify-center">
                            <OTPInput
                                onChange={() => { }}
                                value={newCartCode}
                                numInputs={4}
                                renderSeparator={<span className="mx-1.5"></span>}
                                inputStyle={{ width: '45px' }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        disabled={true}
                                        className='text-3xl text-center rounded disabled:bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A9DEF9] disabled:cursor-not-allowed'
                                    />
                                )}
                            />
                        </div>
                        <p className='text-sm text-center text-gray-600 mt-3'>Anote este código para acessar sua lista depois</p>
                    </div>

                    <div>
                        <h2 className='text-xl text-center font-semibold text-[#F4976C] mb-4'>Crie uma senha</h2>
                        <div className="flex justify-center">
                            <OTPInput
                                inputType={'number'}
                                placeholder={'0000'}
                                value={newCartPasscode}
                                onChange={setNewCartPasscode}
                                numInputs={4}
                                shouldAutoFocus
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
                        <p className='text-sm text-center text-gray-600 mt-3'>Esta senha será necessária para acessar sua lista</p>
                    </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className='fixed bottom-6 left-0 right-0 w-full px-4'>
                    <div className='mx-auto max-w-md flex items-center gap-3'>
                        <button
                            onClick={() => setLocation("/")}
                            className='w-14 h-14 flex-shrink-0 shadow-md bg-[#fdfaf2] border border-[#B48768] flex items-center justify-center rounded-lg cursor-pointer
                            transition transform hover:scale-[1.05] hover:shadow-lg active:scale-[0.98] active:shadow-sm'>
                            <img src={LeftArrowIcon} alt="Voltar" className="h-8 w-8" />
                        </button>

                        <button
                            onClick={createCartLastStep}
                            disabled={newCartPasscode.length < 4}
                            className='flex-1 h-14 shadow-md bg-[#F4976C] text-white border border-[#B48768] flex items-center justify-center rounded-lg gap-3
                            transition transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:shadow-sm
                            disabled:bg-[#fdfaf2] disabled:text-[#B48768] disabled:cursor-not-allowed disabled:hover:scale-100'>
                            <img
                                src={EmptyCartIcon}
                                alt="Criar lista"
                                className={`h-9 w-9 ${newCartPasscode.length < 4 ? '' : 'filter brightness-0 invert'}`}
                            />
                            <span className='text-lg font-medium'>Criar lista de compras</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CreateCartPage