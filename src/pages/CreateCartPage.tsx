import {CreateCartFirstStepResponse, LoggedInDataType} from "../types/global.ts";
import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';
import BackgroundImage from '../assets/background.jpeg';
import {createRoomLastStepRequest} from "../api/roomApi.ts";
import {encrypt} from "../utils/securityUtils.ts";


interface CreateCartPageProps {
    newCartCode: number[];
    newCartPasscode: number[];
    setNewCartPasscode: (passcode: number[]) => void;
    setIsNewCartProccess: (isProcess: boolean) => void;
    setLoggedInData: (data: LoggedInDataType) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const CreateCartPage = ({
                            newCartCode,
                            newCartPasscode,
                            setNewCartPasscode,
                            setIsNewCartProccess,
                            setLoggedInData,
                            setIsLoggedIn
                        }: CreateCartPageProps) => {
    const createCartLastStep = () => {
        const cartCode = newCartCode.join("");
        const cartPasscode = newCartPasscode.join("");

        const requestBody: CreateCartFirstStepResponse = {
            code: cartCode,
            passcode: cartPasscode,
        }

        createRoomLastStepRequest(requestBody)
            .then(() => {
                const loggedInData: LoggedInDataType = {
                    roomCode: cartCode,
                    roomPasscode: encrypt(cartPasscode),
                }

                setIsLoggedIn(true)
                setLoggedInData(loggedInData)
                localStorage.setItem('data', JSON.stringify(loggedInData));
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const handleInputChange = (value: number, index: number) => {
        const newPasscode = [...newCartPasscode];
        newPasscode[index] = value;
        setNewCartPasscode(newPasscode);

        if (value && index < newCartPasscode.length - 1) {
            document.getElementById(`input-${index + 1}`)?.focus();
        }
    };

    return (
        <div className='h-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            <div className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-95">
                <p className='text-4xl font-extrabold text-[#F4976C]'>Listly</p>
            </div>
            <div className='h-full flex flex-col items-center justify-center gap-2'>
                <div
                    className='w-[90%] mt-10 flex flex-col items-center gap-5 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded '>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>Código da sua nova lista de
                        compras</p>
                    <div className='flex gap-2'>
                        {newCartCode.map(num => {
                            return <p
                                className='flex items-center justify-center text-3xl rounded bg-white w-10 h-14'>{num}</p>
                        })}
                    </div>
                </div>
                <div
                    className='w-[90%] flex flex-col items-center gap-5 bg-[#fdfaf2] bg-opacity-95 py-12 border border-[#B48768] rounded '>
                    <p className='text-2xl text-center font-semibold text-[#F4976C]'>Digite a senha para acessar sua
                        lista de compras</p>
                    <div className='flex gap-2'>
                        {newCartPasscode.map((num, index) => (
                            <input
                                key={index}
                                id={`input-${index}`}
                                type="number"
                                maxLength={1}
                                placeholder={num.toString()}
                                onChange={(e) => handleInputChange(Number(e.target.value), index)}
                                className='flex items-center justify-center text-3xl text-center rounded bg-white w-10 h-14 border border-gray-300 focus:outline-none focus:ring-2 focus:[#A9DEF9]'
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='absolute bottom-10 h-16 w-full flex items-center justify-center px-2 gap-2'>
                <div className='h-full w-1/5 flex items-center justify-between'>
                    <div
                        onClick={() => setIsNewCartProccess(false)}
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
