import axios from 'axios';
import {GetCartDataResponse} from "../types/global.ts";
import {useEffect, useState} from "react";
import FullCartIcon from '../assets/compras_cheio.png';


interface CartPageProps {
    cartCode: string;
    cartPasscode: string;
}

const CartPage = ({cartCode, cartPasscode}: CartPageProps) => {
    const [cartData, setCartData] = useState<GetCartDataResponse>()

    const getCartData = () => {
        const authHeader = {
            headers: {'X-Room-Passcode': cartPasscode}
        }

        axios.get<GetCartDataResponse>(`http://127.0.0.1:5000/api/v1/rooms/${cartCode}`, authHeader)
            .then(res => {
                setCartData(res.data);
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    useEffect(() => {
        getCartData()
    }, [])

    return (
        <div className='h-full'>
            {cartData ?
                (<div>
                        <div className='h-full w-full flex items-center justify-center pt-8'>
                            <div className='flex items-center justify-center border-b border-black w-[90%] gap-3'>
                                <img src={FullCartIcon} alt="icone" className="h-10 w-10 cursor-pointer"/>
                                <p className='text-3xl'>{cartData?.name}</p>
                            </div>
                        </div>
                    </div>
                ) : <div></div>
            }
        </div>
    )
}

export default CartPage
