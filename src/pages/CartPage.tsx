import {FormatedCategoryDataType, FormatedRoomDataType, ItemGetCartDataResponse} from "../types/global.ts";
import {useEffect, useState} from "react";
import BackgroundImage from "../assets/background.jpeg";
import FruitIcon from "../assets/maca.png";
import VegetableIcon from "../assets/brocolis.png";
import ProteinIcon from "../assets/jerk-chicken.png";
import DrinkIcon from "../assets/soda.png";
import BreadIcon from "../assets/pao.png";
import SaltIcon from "../assets/sal.png";
import ToiletIcon from "../assets/papel-higienico.png";
import TrashIcon from "../assets/remover.png";
import CleanIcon from "../assets/sabao-para-louca.png";
import LeftArrowIcon from "../assets/resposta.png";
import ConfigIcon from "../assets/definicoes.png";
import AddItemModal from "../components/AddItemModal.tsx";
import {capitalize} from "../utils/stringUtils.ts";
import EditRoomModal from "../components/EditRoomModal.tsx";
import {useAuthData} from "../context/AuthContext.tsx";
import {useLocation} from "wouter";
import {useRoomData} from "../context/RoomContext.tsx";
import {useGetRoomDataQuery, useValidateRoomAccessCodeMutate} from "../api/room/query.ts";
import {getRoomFromAccessToken} from "../utils/securityUtils.ts";
import {useCheckItemMutate, useRemoveItemMutate} from "../api/item/query.ts";
import {useDebounce} from "../hooks/useDebounce.ts";

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

const CartPage = ({urlRoomCode}: { urlRoomCode: string }) => {
    const [, setLocation] = useLocation();

    const {roomCode, setRoomCode} = useRoomData();
    const {isLoggedIn, setIsLoggedIn} = useAuthData();

    const [formatedRoomData, setFormatedRoomData] = useState<FormatedRoomDataType>();
    const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
    const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false);

    const {data} = useGetRoomDataQuery(roomCode);
    const {mutate} = useValidateRoomAccessCodeMutate()
    const {mutate: checkItemMutate} = useCheckItemMutate()
    const {mutate: removeItemMutate} = useRemoveItemMutate()

    const getCategoryIcon = (categoryName: string): string => {
        return categoryIcons[categoryName] || FruitIcon;
    };

    const handleLogout = () => {
        localStorage.clear();

        setRoomCode(undefined)
        setIsLoggedIn(false)

        setLocation("/")
    }

    const handleCloseAddItemOpen = () => {
        setIsAddItemOpen(false);
    }

    const handleCloseEditRoomOpen = () => {
        setIsEditRoomOpen(false);
    }

    const debouncedCheckItem = useDebounce((itemId: number) => {
        checkItemMutate({roomCode, itemId});
    }, 300);

    const debouncedRemoveItem = useDebounce((itemId: number) => {
        removeItemMutate({roomCode, itemId});
    }, 300);

    const checkItem = (itemId: number) => {
        debouncedCheckItem(itemId);
    };

    const removeItem = (itemId: number) => {
        debouncedRemoveItem(itemId);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlRoomAccessCode = params.get("accessCode");

        // Login URL Params
        if (params.size > 0 && urlRoomAccessCode) {
            try {
                mutate({roomCode: urlRoomCode, roomAccessCode: urlRoomAccessCode})
            } catch {
                handleLogout();
            }
            return;
        }

        // Try to get login info on localStorage
        if (!isLoggedIn) {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    setRoomCode(getRoomFromAccessToken(accessToken));
                    setIsLoggedIn(true)
                } catch {
                    handleLogout();
                }
            } else {
                handleLogout();
            }
        }
    }, [roomCode, isLoggedIn]);

    useEffect(() => {
        if (data) {
            const categoryMap = new Map<number, FormatedCategoryDataType>();

            data.items.forEach((item: ItemGetCartDataResponse) => {
                if (!categoryMap.has(item.category.id)) {
                    categoryMap.set(item.category.id, {
                        id: item.category.id,
                        name: item.category.name,
                        items: [],
                    });
                }
                categoryMap.get(item.category.id)!.items.push({
                    id: item.id,
                    name: item.name,
                    checked: item.checked,
                });
            });

            setFormatedRoomData({
                name: data.name,
                categories: Array.from(categoryMap.values()),
            })
        }
    }, [data]);

    return (
        <div className='h-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            {formatedRoomData ?
                (
                    <div
                        className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB]">
                        <div className='relative flex items-center justify-center border-b border-[#F4976C] w-[90%]'>
                            <p className='text-4xl font-extrabold text-[#F4976C]'>{formatedRoomData.name}</p>
                        </div>
                    </div>
                ) : <div
                    className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB] bg-opacity-85">
                </div>
            }
            <div className="flex flex-col gap-2 pt-28 h-[calc(100dvh-96px)] overflow-y-auto scroll-touch">
                {formatedRoomData != null && formatedRoomData.categories.length <= 0 && (
                    <div className='flex justify-center items-center p-4 bg-[#FDF7EB] bg-opacity-75 w-[95%] rounded'>
                        <p className='text-2xl font-extrabold text-[#F4976C]'>
                            Adicione itens no seu carrinho para aparecerem aqui!
                        </p>
                    </div>
                )}
                {formatedRoomData?.categories.map(category => {
                    return (
                        <div
                            key={category.id}
                            className="bg-[#FDF7EB] bg-opacity-95 w-[98%] rounded mx-auto py-3 border-2 border-[#F3E0C2]">
                            <div className='flex items-center gap-6 p-5 pl-7 '>
                                <img src={getCategoryIcon(category.name)} alt="icone" className="h-9 w-9"/>
                                <div
                                    className='text-2xl font-extrabold text-[#F4976C] border-b border-[#F4976C] w-[80%]'>{category.name}</div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                {category.items.map(item => {
                                    return (
                                        <div key={item.id} className='flex items-center justify-between px-7 py-2'>
                                            <div className='flex items-center gap-6'>
                                                <input
                                                    className='w-5 h-5 accent-[#F4976C] focus:ring-1 focus:ring-[#F4976C]'
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={() => checkItem(item.id)}
                                                />
                                                <div className='text-xl'>{capitalize(item.name)}</div>
                                            </div>
                                            <img src={TrashIcon} alt="icone" className="flex items-center h-7 w-7"
                                                 onClick={() => removeItem(item.id)}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div
                className='absolute w-full h-20 bottom-0 border-t border-[#F4976C] flex justify-between items-center bg-[#FDF7EB]'>
                <div className='flex justify-center items-center w-36 h-20 cursor-pointer'>
                    <img src={LeftArrowIcon} alt="icone" className="h-10 w-10" onClick={handleLogout}/>
                </div>
                <div className='flex justify-center items-center w-full h-20'>
                    <p
                        className='px-5 py-3 border border-[#F4976C] rounded text-[#F4976C] bg-[#FDF7EB] font-extrabold'
                        onClick={() => setIsAddItemOpen(true)}>
                        Adicionar item a lista
                    </p>
                </div>
                <div className='flex justify-center items-center w-36 h-20 cursor-pointer'>
                    <img src={ConfigIcon} alt="icone" className="h-10 w-10" onClick={() => setIsEditRoomOpen(true)}/>
                </div>
            </div>
            {isAddItemOpen &&
                <AddItemModal roomCode={roomCode || ""}
                              handleCloseAddItemOpen={handleCloseAddItemOpen}/>}
            {isEditRoomOpen &&
                <EditRoomModal roomCode={roomCode || ""}
                               handleCloseEditRoomOpen={handleCloseEditRoomOpen}/>}
        </div>
    )
}

export default CartPage
