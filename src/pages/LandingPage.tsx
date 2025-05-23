import EmptyCartIcon from '../assets/compras_vazio.png';
import FullCartIcon from '../assets/compras_cheio.png';
import BackgroundImage from '../assets/background.jpeg';
import { useLocation } from "wouter";

const LandingPage = () => {
    const [, setLocation] = useLocation();

    return (
        <div className='h-full' style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <div className="fixed top-0 left-0 w-full h-20 flex items-center justify-center bg-[#FDF7EB] bg-opacity-80">
                <p className='text-4xl font-extrabold text-[#F4976C]'>Listly</p>
            </div>
            <div className='pt-28 px-4 bg-[#FDF7EB] bg-opacity-75'>
                <p className='text-3xl font-extrabold text-[#F4976C]
                sm:text-4xl'>
                    Crie e compartilhe sua lista de compras de formasimples e prática!
                </p>
            </div>
            <div className='w-full px-3 flex gap-5 mt-16'>
                <div
                    onClick={() => setLocation("/create-room")}
                    className="shadow-md w-1/2 h-32 px-8 flex flex-col justify-center items-center bg-[#fdfaf2] rounded-lg border border-[#B48768] cursor-pointer
                                transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm">
                    <img src={EmptyCartIcon} alt="icone" className="h-10 w-10" />
                    <p className="text-sm sm:text-lg text-center">Criar lista de compras</p>
                </div>
                <div
                    onClick={() => setLocation("/login-room")}
                    className="shadow-md w-1/2 h-32 px-8 flex flex-col justify-center items-center bg-[#fdfaf2] rounded-lg border border-[#B48768] cursor-pointer
                            transition transform hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:shadow-sm">
                    <img src={FullCartIcon} alt="icone" className="h-10 w-10" />
                    <p className='text-sm sm:text-lg text-center'>Acessar lista de compras</p>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-5 mt-8 mb-5 bg-[#FDF7EB] bg-opacity-80">
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
