import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';
import BackgroundImage from '../assets/background.jpeg';
import {useEffect, useState} from "react";
import {useAuthData} from "../context/AuthContext.tsx";
import {useLocation} from "wouter";
import {useRoomData} from "../context/RoomContext.tsx";
import {useCreateRoomFirstStepMutate, useCreateRoomLastStepMutate, useValidateRoomMutate} from "../api/room/query.ts";
import OTPInput from "react-otp-input";

const CreateCartPage = () => {
    const [newCartCode, setNewCartCode] = useState('');
    const [newCartPasscode, setNewCartPasscode] = useState('');

    const [, setLocation] = useLocation();

    const {setRoomCode} = useRoomData();
    const {setIsLoggedIn} = useAuthData();

    const {mutateAsync: validateRoomMutate} = useValidateRoomMutate();
    const {mutateAsync: createRoomFirstStepMutate} = useCreateRoomFirstStepMutate();
    const {mutateAsync: createRoomLastStepMutate} = useCreateRoomLastStepMutate();

    const createCartFirstStep = async () => {
        const createRoomFirstStepResponse = await createRoomFirstStepMutate()
        setNewCartCode(createRoomFirstStepResponse.code);
    }

    const createCartLastStep = async () => {
        await createRoomLastStepMutate({roomCode: newCartCode, roomPasscode: newCartPasscode});

        setRoomCode(newCartCode);
        setIsLoggedIn(true)

        await validateRoomMutate({roomCode: newCartCode, roomPasscode: newCartPasscode});
    }

    useEffect(() => {
        createCartFirstStep()
    }, [])

    return (
        <div className='h-full w-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            <div className="fixed top-0 left-0 w-full h-20 flex items-center justify-center bg-[#FDF7EB] bg-opacity-95">
                <p className='text-4xl font-extrabold text-[#F4976C]'>Listly</p>
            </div>
            <div className='h-full flex flex-col items-center justify-center gap-2'>
                <div
                    className='w-[90%] flex flex-col items-center gap-5 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded '>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>Código da sua nova lista de
                        compras</p>
                    <OTPInput
                        onChange={() => {
                        }}
                        value={newCartCode}
                        numInputs={4}
                        renderSeparator={<span className="mx-1"> </span>}
                        inputStyle={{width: '40px'}}
                        renderInput={(props) => (
                            <input
                                {...props}
                                disabled={true}
                                className='text-3xl text-center rounded disabled:bg-white h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:[#A9DEF9] disabled:cursor-not-allowed'
                            />
                        )}
                    />
                </div>
                <div
                    className='w-[90%] flex flex-col items-center gap-5 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded '>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>Digite a senha para acessar sua
                        lista de compras</p>
                    <OTPInput
                        inputType={'number'}
                        placeholder={'0000'}
                        value={newCartPasscode}
                        onChange={setNewCartPasscode}
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
                        onClick={createCartLastStep}
                        className='w-full h-16 shadow bg-[#fdfaf2] border border-[#B48768] flex items-center justify-center rounded-lg cursor-pointer gap-3
                        transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm'>
                        <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                        <p className='text-lg'>Criar lista de compras</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCartPage
