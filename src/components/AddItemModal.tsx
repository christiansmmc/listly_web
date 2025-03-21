import { useEffect, useState } from "react";
import { AddItemDTO, ListCategoryResponse } from "../types/global.ts";
import CloseIcon from '../assets/close.png'
import { useAddRoomItemMutate } from "../api/item/query.ts";
import { useGetCategoriesQuery } from "../api/category/query.ts";

interface AddItemModalProps {
    roomCode: string;
    handleCloseAddItemOpen: () => void;
}

const AddItemModal = ({
    roomCode,
    handleCloseAddItemOpen
}: AddItemModalProps) => {
    const [categories, setCategories] = useState<ListCategoryResponse[]>([])
    const [item, setItem] = useState<AddItemDTO>({})

    const { data } = useGetCategoriesQuery();
    const { mutate } = useAddRoomItemMutate();

    const handleAddItem = () => {
        const defaultCategory = categories.filter(it => it.name == "Outros")[0]

        if (item.category_id === undefined) {
            setItem((prevItem) => ({
                ...prevItem,
                category_id: defaultCategory.id,
            }));
        }

        if (item.category_name === undefined) {
            setItem((prevItem) => ({
                ...prevItem,
                category_name: defaultCategory.name,
            }));
        }

        mutate({ item, roomCode });
        handleCloseAddItemOpen()
    };

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
            category_name: categories.filter(it => it.id === categoryId)[0].name || "Outros",
        }));
    }

    useEffect(() => {
        if (data) {
            setCategories(data.sort((a, b) => {
                if (a.name === "Outros") return 1;
                if (b.name === "Outros") return -1;
                return a.name.localeCompare(b.name);
            }))
        }
    }, [data])

    return (
        <div className='absolute top-0 w-full h-full bg-[#FDF7EB] bg-opacity-85'>
            <div className='flex justify-between items-center w-full h-full'>
                <div
                    className='relative flex flex-col mx-auto bg-[#FDF7EB] border-2 border-[#F4976C] rounded h-1/2 w-[95%]'>
                    <div className='absolute -top-1 -right-1' onClick={handleCloseAddItemOpen}>
                        <img
                            src={CloseIcon}
                            alt="icone"
                            className="h-12 w-12"
                            onClick={handleCloseAddItemOpen}
                        />
                    </div>
                    <div className='flex flex-col h-full w-[90%] mx-auto'>
                        <div
                            className='w-[100%] mx-auto flex items-center justify-center mt-10 border-b border-[#F4976C]'>
                            <p className='text-2xl text-[#F4976C] font-extrabold'>Adicione um Item a sua lista</p>
                        </div>
                        <div className='relative flex flex-col items-center justify-center h-full pb-20 gap-7'>
                            <div className='w-full flex flex-col justify-center items-center gap-2'>
                                <div className='text-xl'>Nome do Produto</div>
                                <input
                                    placeholder={'Nome do Produto'}
                                    className='w-3/4 h-10 p-2 border border-[#F4976C] rounded-lg'
                                    onChange={(e) => handleAddItemName(e.target.value)}
                                    value={item?.name || ""} />
                            </div>
                            <div className='w-full flex flex-col justify-center items-center gap-2'>
                                <div className='text-xl'>Categoria do Produto</div>
                                <select
                                    className='w-3/4 h-10 p-2 bg-white rounded-lg text-center overflow-y-auto'
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
                            <div className='absolute bottom-5 py-2 px-10 rounded border bg-[#F4976C]'>
                                <div className='text-xl' onClick={handleAddItem}>Adicionar</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className='absolute top-0 w-full h-full bg-[#FDF7EB] bg-opacity-85'>
        //     <div className='flex justify-between items-center w-full h-full'>
        //         <div
        //             className='relative flex flex-col mx-auto bg-[#FDF7EB] border-2 border-[#F4976C] rounded h-1/2 w-[95%]'>
        //             <div className='absolute -top-1 -right-1'
        //                  onClick={handleCloseAddItemOpen}>
        //                 <img src={CloseIcon} alt="icone" className="h-12 w-12" onClick={handleCloseAddItemOpen}/>
        //             </div>
        //             <div
        //                 className='w-[90%] mx-auto flex items-center justify-center mt-7 border-b border-[#F4976C]'>
        //                 <p className='text-2xl text-[#F4976C] font-extrabold'>Adicione um Item a sua lista</p>
        //             </div>
        //             <div className='relative flex flex-col items-center justify-center h-full pb-20 gap-10'>
        //                 <div className='w-full flex flex-col justify-center items-center gap-2'>
        //                     <div className='text-2xl'>Nome do Produto</div>
        //                     <input
        //                         placeholder={'Nome do Produto'}
        //                         className='w-3/4 h-8 pl-1 text-center'
        //                         onChange={(e) => handleAddItemName(e.target.value)}
        //                         value={item?.name || ""}/>
        //                 </div>
        //                 <div className='w-full flex flex-col justify-center items-center gap-2'>
        //                     <div className='text-2xl'>Categoria do Produto</div>
        //                     <select
        //                         className='w-3/4 h-8 pl-1 text-center overflow-y-auto'
        //                         onChange={(e) => handleAddItemCategory(Number(e.target.value))}
        //                         value={item?.category_id || ""}
        //                     >
        //                         <option value="" disabled>Selecione uma categoria</option>
        //                         {categories.map((category) => (
        //                             <option key={category.id} value={category.id}>
        //                                 {category.name}
        //                             </option>
        //                         ))}
        //                     </select>
        //                 </div>
        //                 <div className='absolute bottom-5 py-2 px-10 rounded border bg-[#F4976C]'>
        //                     <div className='text-xl' onClick={handleAddItem}>Adicionar</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default AddItemModal;