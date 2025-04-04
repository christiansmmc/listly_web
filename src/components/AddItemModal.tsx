import { useEffect, useState, useRef } from "react";
import { AddItemDTO, ListCategoryResponse, ProductSuggestion } from "../types/global.ts";
import CloseIcon from '../assets/close.png'
import { useAddRoomItemMutate, useGetProductSuggestionsQuery } from "../api/item/query.ts";
import { useGetCategoriesQuery } from "../api/category/query.ts";
import { useDebounce } from "../hooks/useDebounce.ts";

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
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounce(searchQuery, 300)

    const { data } = useGetCategoriesQuery();
    const { mutate } = useAddRoomItemMutate();
    const { data: suggestions = [] } = useGetProductSuggestionsQuery(debouncedQuery, debouncedQuery.length > 2);

    const handleAddItem = () => {
        if (!item.name || item.name.trim() === "") {
            setErrorMessage("Por favor, insira o nome do produto!");
            return;
        }

        setErrorMessage("");
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
        setErrorMessage("");
        setSearchQuery(name);
        setItem((prevItem) => ({
            ...prevItem,
            name,
        }));
        setShowSuggestions(true);
    }

    const handleSelectSuggestion = (suggestion: string) => {
        setSearchQuery(suggestion);
        setItem((prevItem) => ({
            ...prevItem,
            name: suggestion,
        }));
        setShowSuggestions(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    <div className='absolute -top-1 -right-1 cursor-pointer' onClick={handleCloseAddItemOpen}>
                        <img
                            src={CloseIcon}
                            alt="icone"
                            className="h-10 w-10 sm:h-12 sm:w-12"
                            onClick={handleCloseAddItemOpen}
                        />
                    </div>
                    <div className='flex flex-col h-full w-[90%] mx-auto'>
                        <div
                            className='w-[100%] mx-auto flex items-center justify-center mt-10 border-b border-[#F4976C]'>
                            <p className='text-xl text-[#F4976C] font-extrabold
                            sm:text-2xl'>
                                Adicione um Item a sua lista
                            </p>
                        </div>
                        <div className='relative flex flex-col items-center justify-center h-full pb-20 gap-7'>
                            <div className='w-full flex flex-col justify-center items-center gap-2'>
                                <div className='text-lg sm:text-xl'>Nome do Produto</div>
                                <div className='relative w-[90%] sm:w-3/4'>
                                    <input
                                        placeholder={'Nome do Produto'}
                                        className='w-full h-10 p-2 border border-[#F4976C] rounded-lg text-sm 
                                        sm:text-base'
                                        onChange={(e) => handleAddItemName(e.target.value)}
                                        value={searchQuery}
                                        onFocus={() => setShowSuggestions(true)} />

                                    {showSuggestions && suggestions.length > 0 && (
                                        <div
                                            ref={suggestionsRef}
                                            className='absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-white border border-[#F4976C] rounded-lg shadow-lg'
                                        >
                                            {(suggestions as ProductSuggestion[]).map((suggestion: ProductSuggestion, index: number) => (
                                                <div
                                                    key={index}
                                                    className='p-2 hover:bg-[#F9E0C2] cursor-pointer text-sm sm:text-base'
                                                    onClick={() => handleSelectSuggestion(suggestion.name)}
                                                >
                                                    {suggestion.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errorMessage && (
                                    <div className='text-red-500 text-sm'>{errorMessage}</div>
                                )}
                            </div>
                            <div className='w-full flex flex-col justify-center items-center gap-2'>
                                <div className='text-lg sm:text-xl'>Categoria do Produto</div>
                                <select
                                    className='w-[90%] h-10 p-2 bg-white rounded-lg text-center overflow-y-auto text-sm 
                                    sm:text-base sm:w-3/4'
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
                            <div className='absolute bottom-5 flex items-center justify-center py-2 px-10 rounded-lg border border-[#F4976C] bg-[#FDF7EB] text-[#F4976C] font-extrabold cursor-pointer transition duration-200 hover:bg-[#F9E0C2] active:bg-[#F4976C] active:text-[#FDF7EB]' onClick={handleAddItem}>
                                <div className='text-lg sm:text-xl'>Adicionar</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddItemModal;