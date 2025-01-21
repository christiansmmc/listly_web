import EmptyCartIcon from '../assets/compras_vazio.png';
import FullCartIcon from '../assets/compras_cheio.png';
import BackgroundImage from '../assets/background.jpeg';
import {createRoomFirstStepRequest} from "../api/roomApi.ts";

interface LandingPageProps {
    setNewCartCode: (code: number[]) => void;
    setIsNewCartProccess: (isProcess: boolean) => void;
}

const LandingPage = ({
                         setNewCartCode,
                         setIsNewCartProccess
                     }: LandingPageProps) => {
    const createCartFirstStep = () => {
        createRoomFirstStepRequest()
            .then(res => {
                const code: number[] = res.code.split("").map(Number);

                setNewCartCode(code);
                setIsNewCartProccess(true)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    return (
        <div className='h-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            <div className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-80">
                <p className='text-4xl font-extrabold text-[#F4976C]'>Listly</p>
            </div>
            <div className='pt-40 px-4 bg-[#FDF7EB] bg-opacity-75'>
                <p className='text-4xl font-extrabold text-[#F4976C]'>Crie e compartilhe sua lista de compras de forma
                    simples e prática!</p>
            </div>
            <div className='w-full px-3 flex gap-5 mt-20'>
                <div
                    onClick={createCartFirstStep}
                    className="shadow-md w-1/2 h-32 px-8 flex flex-col justify-center items-center bg-[#fdfaf2] rounded-lg border border-[#B48768] cursor-pointer
                                transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm">
                    <img src={EmptyCartIcon} alt="icone" className="h-10 w-10"/>
                    <p className="text-lg text-center">Criar lista de compras</p>
                </div>
                <div className="shadow-md w-1/2 h-32 px-8 flex flex-col justify-center items-center bg-[#fdfaf2] rounded-lg border border-[#B48768] cursor-pointer
                            transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm">
                    <img src={FullCartIcon} alt="icone" className="h-10 w-10"/>
                    <p className='text-lg text-center'>Acessar lista de compras</p>
                </div>
            </div>
            <div className="w-full flex flex-col items-center pt-7 mt-24 bg-[#FDF7EB] bg-opacity-80">
                <p className="text-2xl font-semibold mb-4 text-[#F4976C]">Por que usar o Listly?</p>
                <ul className="space-y-4 text-center text-[#B48768]">
                    <li>📋 Crie listas de compras rapidamente.</li>
                    <li>🔗 Compartilhe com facilidade via link ou código.</li>
                    <li>💾 Salve suas listas para futuras referências.</li>
                </ul>
            </div>
        </div>
    )
}

export default LandingPage
