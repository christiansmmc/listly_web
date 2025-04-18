import { FormatedCategoryDataType, FormatedRoomDataType, ItemGetCartDataResponse } from "../types/global.ts";
import { useEffect, useState } from "react";
import BackgroundImage from "../assets/background.jpeg";
import FruitIcon from "../assets/fruitIcon.png";
import VegetableIcon from "../assets/vegetableIcon.png";
import ProteinIcon from "../assets/proteinIcon.png";
import DrinkIcon from "../assets/drinkIcon.png";
import BreadIcon from "../assets/breadIcon.png";
import SeasoningIcon from "../assets/seasoningIcon.png";
import HygieneIcon from "../assets/hygieneIcon.png";
import TrashIcon from "../assets/trashIcon.png";
import CleanIcon from "../assets/cleanIcon.png";
import LeftArrowIcon from "../assets/leftArrowIcon.png";
import ConfigIcon from "../assets/configIcon.png";
import DairyIcon from "../assets/dairyIcon.png";
import FrozenFoodIcon from "../assets/frozenFoodIcon.png";
import SnackIcon from "../assets/snackIcon.png";
import CerealIcon from "../assets/cerealIcon.png";
import SweetIcon from "../assets/sweetIcon.png";
import OtherIcon from "../assets/otherIcon.png";
import AddItemModal from "../components/AddItemModal.tsx";
import { capitalize } from "../utils/stringUtils.ts";
import EditRoomModal from "../components/EditRoomModal.tsx";
import { useAuthData } from "../context/AuthContext.tsx";
import { useLocation } from "wouter";
import { useRoomData } from "../context/RoomContext.tsx";
import { useGetRoomDataQuery, useValidateRoomAccessCodeMutate } from "../api/room/query.ts";
import { useCheckItemMutate, useRemoveItemMutate } from "../api/item/query.ts";
import { useCooldown } from "../hooks/useDebounce.ts";
import { getRoomFromAccessToken } from "../utils/securityUtils.ts";

const categoryIcons: Record<string, string> = {
    "Frutas": FruitIcon,
    "Legumes e Verduras": VegetableIcon,
    "Proteínas": ProteinIcon,
    "Bebidas": DrinkIcon,
    "Laticínios": DairyIcon,
    "Pães e Massas": BreadIcon,
    "Temperos e Especiarias": SeasoningIcon,
    "Higiene Pessoal": HygieneIcon,
    "Produtos de Limpeza": CleanIcon,
    "Congelados": FrozenFoodIcon,
    "Snacks": SnackIcon,
    "Grãos e Cereais": CerealIcon,
    "Doces e Sobremesas": SweetIcon,
    "Outros": OtherIcon
};

const CartPage = ({ urlRoomCode }: { urlRoomCode: string }) => {
    const [, setLocation] = useLocation();

    const { roomCode, setRoomCode } = useRoomData();
    const { isLoggedIn, setIsLoggedIn } = useAuthData();

    const [formatedRoomData, setFormatedRoomData] = useState<FormatedRoomDataType>();
    const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
    const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false);

    const { data, isError } = useGetRoomDataQuery(roomCode);
    const { mutate } = useValidateRoomAccessCodeMutate()
    const { mutate: checkItemMutate } = useCheckItemMutate()
    const { mutate: removeItemMutate } = useRemoveItemMutate()

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

    const debouncedCheckItem = useCooldown((itemId: number) => {
        checkItemMutate({ roomCode, itemId });
    }, 300);

    const debouncedRemoveItem = useCooldown((itemId: number) => {
        removeItemMutate({ roomCode, itemId });
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
            mutate({ roomCode: urlRoomCode, roomAccessCode: urlRoomAccessCode })
            return;
        }

        // Try to get login info on localStorage
        if (!isLoggedIn) {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
                setRoomCode(getRoomFromAccessToken(accessToken));
                setIsLoggedIn(true)
            } else {
                handleLogout();
            }
        }
    }, [roomCode, isLoggedIn]);

    useEffect(() => {
        if (isError) {
            handleLogout()
        }

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

            categoryMap.forEach((category) => {
                category.items.sort((a, b) => a.id - b.id);
            });

            setFormatedRoomData({
                name: data.name,
                categories: Array.from(categoryMap.values()).sort((a, b) => {
                    if (a.name === "Outros") return 1;
                    if (b.name === "Outros") return -1;
                    return a.name.localeCompare(b.name);
                }),
            });
        }
    }, [data, isError]);

    return (
        <div className='h-full' style={{ backgroundImage: `url(${BackgroundImage})` }}>
            {formatedRoomData ?
                (
                    <div
                        className="fixed top-0 left-0 w-full h-20 flex items-center justify-center bg-[#FDF7EB]">
                        <div className='relative flex items-center justify-center border-b border-[#F4976C] w-[90%]'>
                            <p className='text-2xl font-extrabold text-[#F4976C]
                            sm:text-3xl'>
                                {formatedRoomData.name}
                            </p>
                        </div>
                    </div>
                ) : <div
                    className="fixed top-0 left-0 w-full h-20 flex items-center justify-center bg-[#FDF7EB] bg-opacity-85">
                </div>
            }
            <div className="flex flex-col gap-2 pt-24 h-[calc(100dvh-80px)] overflow-y-auto">
                {formatedRoomData != null && formatedRoomData.categories.length <= 0 && (
                    <div className='flex flex-col justify-center items-center p-6 bg-[#FDF7EB] bg-opacity-90 w-[90%] mx-auto rounded-lg shadow-md border-2 border-[#F3E0C2]'>
                        <p className='text-xl font-extrabold text-[#F4976C] text-center mb-3
                        sm:text-2xl'>
                            Seu carrinho está vazio!
                        </p>
                        <p className='text-base text-gray-600 text-center mb-5'>
                            Adicione itens à sua lista de compras para começar a organizá-los.
                        </p>
                        <button
                            className='text-sm flex items-center justify-center px-6 py-3 rounded-lg border border-[#F4976C] bg-[#F4976C] text-white font-bold cursor-pointer 
                            sm:text-base
                            transition duration-200 
                            hover:bg-[#f3865c] 
                            active:scale-95'
                            onClick={() => setIsAddItemOpen(true)}>
                            Adicionar primeiro item
                        </button>
                    </div>
                )}
                {formatedRoomData?.categories.map(category => {
                    return (
                        <div
                            key={category.id}
                            className="bg-[#FDF7EB] bg-opacity-95 w-[98%] rounded mx-auto py-2 border-2 border-[#F3E0C2]">
                            <div className='flex items-center gap-6 p-5 pl-7'>
                                <img src={getCategoryIcon(category.name)} alt="icone" className="h-8 w-8" />
                                <div
                                    className='text-xl font-extrabold text-[#F4976C] border-b border-[#F4976C] w-[80%]'>{category.name}</div>
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
                                                <div className='text-lg'>{capitalize(item.name)}</div>
                                            </div>
                                            <img src={TrashIcon} alt="icone" className="flex items-center h-6 w-6 cursor-pointer"
                                                onClick={() => removeItem(item.id)} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div
                className='absolute w-full h-14 bottom-0 border-t border-[#F4976C] flex justify-between items-center bg-[#FDF7EB]
                sm:h-16'>
                <div
                    onClick={handleLogout}
                    className='flex justify-center items-center w-32 h-16 cursor-pointer transition duration-200 hover:bg-[#F9E0C2] active:bg-[#F4976C]
                    sm:w-36'>
                    <img src={LeftArrowIcon} alt="icone" className="h-8 w-8 transition duration-200 active:scale-90
                    sm:h-9 sm:w-9" />
                </div>
                <div className='flex justify-center items-center w-full h-12 sm:h-16'>
                    <div
                        className='flex items-center justify-center text-sm px-6 py-3 rounded-lg border border-[#F4976C] bg-[#FDF7EB] text-[#F4976C] font-extrabold cursor-pointer 
                        sm:text-base
                        transition duration-200 
                        hover:bg-[#F9E0C2] 
                        active:bg-[#F4976C] active:text-[#FDF7EB]'
                        onClick={() => setIsAddItemOpen(true)}>
                        Adicionar item a lista
                    </div>
                </div>
                <div
                    onClick={() => setIsEditRoomOpen(true)}
                    className='flex justify-center items-center w-32 h-16 cursor-pointer transition duration-200 hover:bg-[#F9E0C2] active:bg-[#F4976C]
                    sm:w-36'>
                    <img src={ConfigIcon} alt="icone" className="h-8 w-8 transition duration-200 active:scale-90
                    sm:h-9 sm:w-9" />
                </div>
            </div>
            {isAddItemOpen &&
                <AddItemModal roomCode={roomCode || ""}
                    handleCloseAddItemOpen={handleCloseAddItemOpen} />}
            {isEditRoomOpen &&
                <EditRoomModal roomCode={roomCode || ""}
                    handleCloseEditRoomOpen={handleCloseEditRoomOpen} />}
        </div>
    )
}

export default CartPage
