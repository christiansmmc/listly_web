import axios from 'axios';
import {CategoryGroup, GetCartDataResponse, ItemGetCartDataResponse, LoggedInDataType} from "../types/global.ts";
import {useEffect, useState} from "react";
import BackgroundImage from "../assets/background.jpeg";
import FruitIcon from "../assets/maca.png";
import VegetableIcon from "../assets/brocolis.png";
import ProteinIcon from "../assets/jerk-chicken.png";
import DrinkIcon from "../assets/soda.png";
import BreadIcon from "../assets/pao.png";
import SaltIcon from "../assets/sal.png";
import ToiletIcon from "../assets/papel-higienico.png";
import CleanIcon from "../assets/sabao-para-louca.png";
import LeftArrowIcon from "../assets/costas.png";
import ConfigIcon from "../assets/definicoes.png";


interface CartPageProps {
    cartCode: string;
    cartPasscode: string;
    setLoggedInData: (data: LoggedInDataType) => void;
}

const CartPage = ({cartCode, cartPasscode, setLoggedInData}: CartPageProps,) => {
    const [cartData, setCartData] = useState<GetCartDataResponse>()
    const [categoryGroup, setCategoryGroup] = useState<CategoryGroup[]>()

    const getCartData = () => {
        const authHeader = {
            headers: {'X-Room-Passcode': cartPasscode}
        }

        axios.get<GetCartDataResponse>(`http://127.0.0.1:5000/api/v1/rooms/${cartCode}`, authHeader)
            .then(res => {
                const groupedItems = Object.values(res.data.items.reduce((acc: Record<number, CategoryGroup>, item: ItemGetCartDataResponse) => {
                    const {id: categoryId, name: categoryName} = item.category;
                    if (!acc[categoryId]) {
                        acc[categoryId] = {
                            categoryId,
                            categoryName,
                            items: []
                        };
                    }

                    acc[categoryId].items.push({
                        id: item.id,
                        name: item.name,
                        checked: item.checked
                    });

                    return acc;
                }, {}));

                setCartData(res.data);
                setCategoryGroup(groupedItems)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    useEffect(() => {
        getCartData()
    }, [])

    const categoryIcons: Record<string, string> = {
        "Frutas": FruitIcon,
        "Legumes e Verduras": VegetableIcon,
        "Proteínas": ProteinIcon,
        "Bebidas": DrinkIcon,
        "Pães e Massas": BreadIcon,
        "Temperos e Especiarias": SaltIcon,
        "Higiene Pessoal": ToiletIcon,
        "Produtos de Limpeza": CleanIcon
    };

    const getCategoryIcon = (categoryName: string): string => {
        return categoryIcons[categoryName] || FruitIcon;
    };

    const handleLogout = () => {
        const loggedInData: LoggedInDataType = {
            "isLoggedIn": false,
            "cartCode": undefined,
            "cartPasscode": undefined,
        }

        setLoggedInData(loggedInData)
        localStorage.setItem('data', JSON.stringify(loggedInData));
    }

    return (
        <div className='h-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            {cartData ?
                (
                    <div
                        className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-85">
                        <div className='relative flex items-center justify-center border-b border-[#F4976C] w-[90%]'>
                            <p className='text-4xl font-extrabold text-[#F4976C]'>{cartData?.name}</p>
                        </div>
                    </div>
                ) : <div
                    className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-85">
                </div>
            }
            <div className="flex flex-col gap-2 pt-28 h-[calc(100vh-96px)] overflow-y-auto">
                {cartData != null && cartData.items.length <= 0 && (
                    <div className='flex justify-center items-center p-4 bg-[#FDF7EB] bg-opacity-75 w-[95%] rounded'>
                        <p className='text-2xl font-extrabold text-[#F4976C]'>
                            Adicione itens no seu carrinho para aparecerem aqui!
                        </p>
                    </div>
                )}
                {categoryGroup?.map(category => {
                    return (
                        <div
                            className="bg-[#FDF7EB] bg-opacity-85 w-[98%] rounded mx-auto py-3 border-2 border-[#F3E0C2]">
                            <div className='flex items-center gap-6 p-5 pl-7 '>
                                <img src={getCategoryIcon(category.categoryName)} alt="icone" className="h-9 w-9"/>
                                <div
                                    className='text-2xl font-extrabold text-[#F4976C] border-b border-[#F4976C] w-[80%]'>{category.categoryName}</div>
                            </div>
                            <div className=''>
                                {category.items.map(item => {
                                    return (
                                        <div className='flex items-center gap-6 pl-7 py-2'>
                                            <input
                                                className='w-5 h-5 accent-[#F4976C] focus:ring-1 focus:ring-[#F4976C]'
                                                type="checkbox"
                                                checked={item.checked}
                                                // TODO ON CHANGE HANDLER THAT SET CHECKED AND MAKE REQUEST
                                            />
                                            <div className='text-xl'>{item.name}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div
                className='absolute w-full h-20 bottom-0 border-t border-[#F4976C] flex justify-between items-center bg-[#FDF7EB] bg-opacity-85'>
                <div className='flex justify-center items-center w-36 h-20 cursor-pointer'>
                    <img src={LeftArrowIcon} alt="icone" className="h-9 w-9" onClick={handleLogout}/>
                </div>
                <div className='flex justify-center items-center w-full h-20'>
                    <p className='px-5 py-3 border border-[#F4976C] rounded text-[#F4976C] bg-[#FDF7EB] font-extrabold'>Adicionar item a lista</p>
                </div>
                <div className='flex justify-center items-center w-36 h-20 cursor-pointer'>
                    <img src={ConfigIcon} alt="icone" className="h-9 w-9"/>
                </div>
            </div>
        </div>
    )
}

export default CartPage
