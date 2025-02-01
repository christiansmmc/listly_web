import {
    CategoryGroup,
    GetCartDataResponse,
    ItemGetCartDataResponse,
    LoggedInDataType,
    ValidateRoomRequest
} from "../types/global.ts";
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
import {getRoomData, validateRoomRequest} from "../api/roomApi.ts";
import {checkItemRequest, removeItemRequest} from "../api/itemApi.ts";
import EditRoomModal from "../components/EditRoomModal.tsx";
import {useAuthData} from "../context/AuthContext.tsx";
import {useLocation} from "wouter";
import {decrypt} from "../utils/securityUtils.ts";
import {useRoomData} from "../context/RoomContext.tsx";

const CartPage = ({urlRoomCode}: { urlRoomCode: string }) => {
    const [, setLocation] = useLocation();

    const {roomCode, roomPasscode, setRoomPasscode, setRoomCode} = useRoomData();
    const {isLoggedIn, setIsLoggedIn} = useAuthData();

    const [cartData, setCartData] = useState<GetCartDataResponse>()
    const [categoryGroup, setCategoryGroup] = useState<CategoryGroup[]>()
    const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
    const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false);

    const getCartData = () => {
        getRoomData(roomCode, roomPasscode)
            .then(res => {
                const groupedItems: CategoryGroup[] = Object.values(res.items.reduce((acc: Record<number, CategoryGroup>, item: ItemGetCartDataResponse) => {
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

                setCartData(res);
                setCategoryGroup(groupedItems)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const checkItem = (itemId: number) => {
        const cartDataBackup = structuredClone(cartData);
        const categoryGroupBackup = structuredClone(categoryGroup);

        setCartData((prevCartData) => {
            if (!prevCartData) return prevCartData;

            const updatedItems = prevCartData.items.map((item) =>
                item.id === itemId ? {...item, checked: !item.checked} : item
            );

            return {...prevCartData, items: updatedItems};
        });

        setCategoryGroup((prevCategoryGroup) => {
            if (!prevCategoryGroup) return prevCategoryGroup;

            return prevCategoryGroup.map((category) => {
                const updatedItems = category.items.map((item) =>
                    item.id === itemId ? {...item, checked: !item.checked} : item
                );

                return {...category, items: updatedItems};
            });
        });

        checkItemRequest(roomCode, roomPasscode, itemId)
            .catch(error => {
                setCartData(cartDataBackup)
                setCategoryGroup(categoryGroupBackup)
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const removeItem = (itemId: number) => {
        removeItemRequest(roomCode, roomPasscode, itemId)
            .then(() => {
                setCartData((prevCartData) => {
                    if (!prevCartData) return prevCartData;

                    const updatedItems = prevCartData.items.filter((item) => item.id !== itemId);

                    return {...prevCartData, items: updatedItems};
                });

                setCategoryGroup((prevCategoryGroup) => {
                    if (!prevCategoryGroup) return prevCategoryGroup;

                    return prevCategoryGroup
                        .map((category) => {
                            const updatedItems = category.items.filter((item) => item.id !== itemId);
                            return {...category, items: updatedItems};
                        })
                        .filter((category) => category.items.length > 0); // Remove categorias vazias
                });
            })
            .catch((error) => {
                console.error('Erro ao fazer a requisição:', error);
            });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlRoomPasscode = params.get("roomPasscode");

        if (params.size > 0 && urlRoomPasscode) {
            try {
                validateRoom(urlRoomCode, urlRoomPasscode);
                setLocation(`/room/${urlRoomCode}`)
                return;
            } catch {
                handleLogout()
                return;
            }
        }

        if (isLoggedIn && roomCode && roomPasscode) {
            if (roomCode !== urlRoomCode) {
                handleLogout();
            } else {
                validateRoom(roomCode, roomPasscode);
                getCartData();
            }
        } else if (!isLoggedIn) {
            const data = localStorage.getItem("data");
            if (data) {
                const localStorageData: LoggedInDataType = JSON.parse(data);
                validateRoom(
                    localStorageData.roomCode || "",
                    localStorageData.roomPasscode || ""
                );
            }
        } else {
            console.log("AQUI 3");
            handleLogout()
        }
    }, [isLoggedIn, roomCode, roomPasscode]);

    const validateRoom = (roomCode: string, roomPasscode: string) => {
        const requestBody: ValidateRoomRequest = {
            code: roomCode,
            passcode: decrypt(roomPasscode),
        };

        try {
            validateRoomRequest(requestBody)
                .then(() => {
                    setRoomCode(roomCode);
                    setRoomPasscode(roomPasscode);
                    setIsLoggedIn(true);

                    const loggedInData: LoggedInDataType = {
                        roomCode: roomCode,
                        roomPasscode: roomPasscode,
                    };
                    localStorage.setItem("data", JSON.stringify(loggedInData));
                });
        } catch (error) {
            console.error("Erro na validação da sala:", error);
            setLocation("/");
        }
    };

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
        setRoomCode(undefined)
        setRoomPasscode(undefined)
        setIsLoggedIn(false)
        localStorage.clear();

        setLocation("/")
    }

    const updateCart = () => {
        getCartData()
    }

    const handleCloseAddItemOpen = () => {
        setIsAddItemOpen(false);
    }

    const handleCloseEditRoomOpen = () => {
        setIsEditRoomOpen(false);
    }

    return (
        <div className='h-full' style={{backgroundImage: `url(${BackgroundImage})`}}>
            {cartData ?
                (
                    <div
                        className="fixed top-0 left-0 w-full h-24 flex items-center justify-center bg-[#FDF7EB]">
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
                            key={category.categoryId}
                            className="bg-[#FDF7EB] bg-opacity-95 w-[98%] rounded mx-auto py-3 border-2 border-[#F3E0C2]">
                            <div className='flex items-center gap-6 p-5 pl-7 '>
                                <img src={getCategoryIcon(category.categoryName)} alt="icone" className="h-9 w-9"/>
                                <div
                                    className='text-2xl font-extrabold text-[#F4976C] border-b border-[#F4976C] w-[80%]'>{category.categoryName}</div>
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
                <AddItemModal roomCode={roomCode}
                              roomPasscode={roomPasscode}
                              updateCart={updateCart}
                              handleCloseAddItemOpen={handleCloseAddItemOpen}/>}
            {isEditRoomOpen &&
                <EditRoomModal roomCode={roomCode}
                               roomPasscode={roomPasscode}
                               cartData={cartData}
                               updateCart={updateCart}
                               handleCloseEditRoomOpen={handleCloseEditRoomOpen}/>}
        </div>
    )
}

export default CartPage
