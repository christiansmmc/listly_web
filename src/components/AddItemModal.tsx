import {useEffect, useState} from "react";
import {AddItemRequest, ListCategoryResponse} from "../types/global.ts";
import CloseIcon from '../assets/erro.png'
import {getCategories} from "../api/categoryApi.ts";
import {createItemRequest} from "../api/itemApi.ts";

interface AddItemModalProps {
    roomCode: string | undefined;
    roomPasscode: string | undefined;
    updateCart: () => void;
    handleCloseAddItemOpen: () => void;
}

const AddItemModal = ({
                          roomCode,
                          roomPasscode,
                          updateCart,
                          handleCloseAddItemOpen
                      }: AddItemModalProps) => {
    const [categories, setCategories] = useState<ListCategoryResponse[]>([])
    const [item, setItem] = useState<AddItemRequest>({})

    const listCategories = () => {
        getCategories(roomPasscode)
            .then(res => {
                setCategories(res);
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const addItem = () => {
        createItemRequest(item, roomCode, roomPasscode)
            .then(() => {
                updateCart()
                handleCloseAddItemOpen()
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const handleAddItemName = (name: string) => {
        setItem((prevItem) => ({
            ...prevItem,
            name,
        }));
    }

    const handleAddItemCategory = (categoryId: number) => {
        setItem((prevItem) => ({
            ...prevItem,
            category_id: categoryId,
        }));
    }

    useEffect(() => {
        listCategories()
    }, [])

    return (

        <div className='absolute top-0 w-full h-full bg-[#FDF7EB] bg-opacity-85'>
            <div className='flex justify-between items-center w-full h-full'>
                <div
                    className='relative flex flex-col mx-auto bg-[#FDF7EB] border-2 border-[#F4976C] rounded h-1/2 w-[95%]'>
                    <div className='absolute -top-3 -left-3'
                         onClick={handleCloseAddItemOpen}>
                        <img src={CloseIcon} alt="icone" className="h-11 w-11" onClick={handleCloseAddItemOpen}/>
                    </div>
                    <div
                        className='w-[90%] mx-auto flex items-center justify-center pt-7 border-b border-[#F4976C]'>
                        <p className='text-2xl text-[#F4976C] font-extrabold'>Adicione um Item a sua lista</p>
                    </div>
                    <div className='relative flex flex-col items-center justify-center h-full pb-20 gap-10'>
                        <div className='w-full flex flex-col justify-center items-center gap-2'>
                            <div className='text-2xl'>Nome do Produto</div>
                            <input
                                placeholder={'Nome do Produto'}
                                className='w-3/4 h-8 pl-1 text-center'
                                onChange={(e) => handleAddItemName(e.target.value)}
                                value={item?.name || ""}/>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center gap-2'>
                            <div className='text-2xl'>Categoria do Produto</div>
                            <select
                                className='w-3/4 h-8 pl-1 text-center overflow-y-auto'
                                onChange={(e) => handleAddItemCategory(Number(e.target.value))}
                                value={item?.category_id || ""}
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='absolute bottom-5 py-2 px-10 border bg-[#F4976C]'>
                            <div className='text-2xl' onClick={addItem}>Adicionar</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddItemModal;