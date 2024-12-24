import EmptyCartIcon from '../assets/compras_vazio.png';
import FullCartIcon from '../assets/compras_cheio.png';
import axios from 'axios';
import {CreateCartFirstStepResponse} from "../types/global.ts";

interface LandingPageProps {
    setNewCartCode: (code: number[]) => void;
    setIsNewCartProccess: (isProcess: boolean) => void;
}

const LandingPage = ({
                         setNewCartCode,
                         setIsNewCartProccess
                     }: LandingPageProps) => {

    const createCartFirstStep = () => {
        axios.post<CreateCartFirstStepResponse>('http://127.0.0.1:5000/api/v1/rooms/initial-step')
            .then(res => {
                const code: number[] = res.data.code.split("").map(Number);

                setNewCartCode(code);
                setIsNewCartProccess(true)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    return (
        <div className='h-full'>
            <div className='h-1/2 flex items-center justify-center'>
                <p className='text-5xl'>Listly</p>
            </div>
            <div className='h-1/2 flex items-end justify-center pb-16'>
                <div className='w-full flex flex-col items-center justify-center gap-3'>
                    <div
                        onClick={createCartFirstStep}
                        className='relative shadow w-5/6 h-16 bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3'>
                        <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                        <p className='text-lg '>Criar lista de compras</p>
                    </div>
                    <div
                        className='relative shadow w-5/6 h-16 bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3
                        transform transition duration-200 hover:scale-105 hover:bg-[#e0875a]'>
                        <img src={FullCartIcon} alt="icone" className="h-10 w-10"/>
                        <p className='text-lg '>Acessar lista de compras</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
