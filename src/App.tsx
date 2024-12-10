import './index.css'
import FullCartIcon from './assets/compras_cheio.png';
import EmptyCartIcon from './assets/compras_vazio.png';
import axios from 'axios';
import {useState} from "react";

function App() {
    const [newCartCode, setNewCartCode] = useState('');
    const [newCartPasscode, setNewCartPasscode] = useState('----');
    const [isNewCartProccess, setIsNewCartProccess] = useState(false);

    interface CreateCartFirstStepResponse {
        code: string
    }

    const createCartFirstStep = () => {
        axios.post<CreateCartFirstStepResponse>('http://127.0.0.1:5000/api/v1/rooms/initial-step')
            .then(res => {
                setNewCartCode(res.data.code);
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
            {!isNewCartProccess
                ?
                <div className='h-1/2 flex items-center justify-center'>
                    <div className='w-full flex flex-col items-center justify-center gap-3'>
                        <div
                            onClick={createCartFirstStep}
                            className='relative shadow w-5/6 h-16 bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3
                        transform transition duration-200 hover:scale-105 hover:bg-[#e0875a]'>
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
                :
                <div
                    className='absolute rounded-lg w-[95%] h-3/5 bg-[#D3E4CD] border border-[#FFB5A7] left-1/2 bottom-16 transform -translate-x-1/2 '>
                    <div className='pt-10 flex flex-col items-center gap-5'>
                        <p className='text-2xl text-center'>Código da lista de compras</p>
                        <div className='flex gap-2'>
                            {newCartCode.split('').map(num => {
                                return <p
                                    className='flex items-center justify-center text-3xl rounded bg-white w-10 h-14'>{num}</p>
                            })}
                        </div>
                    </div>
                    <div className='pt-16 flex flex-col items-center gap-5'>
                        <p className='text-2xl text-center'>Digite a senha para a lista de compras</p>
                        <div className='flex gap-2'>
                            {newCartPasscode.split('').map(num => {
                                return <p
                                    className='flex items-center justify-center text-3xl rounded bg-white w-10 h-14'>{num}</p>
                            })}
                        </div>
                    </div>
                    <div className='absolute bottom-10 w-full flex items-center justify-center'>
                        <div
                            onClick={createCartFirstStep}
                            className='shadow w-5/6 h-16 bg-[#F4976C] flex items-center justify-center rounded-lg cursor-pointer gap-3'>
                            <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                            <p className='text-lg '>Entrar na lista de compras</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default App
