import axios from 'axios';
import {CreateCartFirstStepResponse, LoggedInDataType} from "../types/global.ts";
import EmptyCartIcon from '../assets/compras_vazio.png';
import LeftArrowIcon from '../assets/seta_esquerda_4.png';


interface CreateCartPageProps {
    newCartCode: number[];
    newCartPasscode: number[];
    setNewCartPasscode: (passcode: number[]) => void;
    setIsNewCartProccess: (isProcess: boolean) => void;
    setLoggedInData: (data: LoggedInDataType) => void;
}

const CreateCartPage = ({
                            newCartCode,
                            newCartPasscode,
                            setNewCartPasscode,
                            setIsNewCartProccess,
                            setLoggedInData,
                        }: CreateCartPageProps) => {
    const createCartLastStep = () => {
        const cartCode = newCartCode.join("");
        const cartPasscode = newCartPasscode.join("");

        const requestBody: CreateCartFirstStepResponse = {
            code: cartCode,
            passcode: cartPasscode,
        }

        axios.post<CreateCartFirstStepResponse>('http://127.0.0.1:5000/api/v1/rooms/last-step', requestBody)
            .then(() => {
                const loggedInData: LoggedInDataType = {
                    "isLoggedIn": true,
                    "cartCode": cartCode,
                    "cartPasscode": cartPasscode,
                }

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
        <div className='h-full'>
            <div className='absolute bottom-10 h-16 w-full flex items-center justify-center px-2 gap-2'>
                <div className='h-full w-1/5 flex items-center justify-between'>
                    <div
                        onClick={() => setIsNewCartProccess(false)}
                        className='w-full h-16 shadow bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3'>
                        <img src={LeftArrowIcon} alt="icone" className="h-9 w-9 cursor-pointer"/>
                    </div>
                </div>
                <div className='h-full w-3/4 flex items-center justify-between'>
                    <div
                        onClick={createCartLastStep}
                        className='w-full h-16 shadow bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3'>
                        <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                        <p className='text-lg '>Criar lista de compras</p>
                    </div>
                </div>
            </div>
            <div className='h-full flex flex-col items-center justify-center'>
                <div className='pt-10 flex flex-col items-center gap-5'>
                    <p className='text-2xl text-center'>Código da lista de compras</p>
                    <div className='flex gap-2'>
                        {newCartCode.map(num => {
                            return <p
                                className='flex items-center justify-center text-3xl rounded bg-white w-10 h-14'>{num}</p>
                        })}
                    </div>
                </div>
                <div className='pt-16 flex flex-col items-center gap-5'>
                    <p className='text-2xl text-center'>Digite a senha para a lista de compras</p>
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
        </div>
    )
}

export default CreateCartPage
