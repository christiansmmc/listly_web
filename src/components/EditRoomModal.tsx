import {GetCartDataResponse} from "../types/global.ts";
import CloseIcon from '../assets/erro.png'
import {useState} from "react";
import CopyIcon from "../assets/copia-de.png";
import CleanIcon from "../assets/vassoura.png";
import DeleteIcon from "../assets/lixo.png";

interface EditRoomModal {
    roomCode: string | undefined;
    roomPasscode: string | undefined;
    cartData: GetCartDataResponse | undefined;
    updateCart: VoidFunction;
    handleCloseEditRoomOpen: VoidFunction;
}

const EditRoomModal = ({
                           roomCode,
                           roomPasscode,
                           cartData,
                           updateCart,
                           handleCloseEditRoomOpen
                       }: EditRoomModal) => {
    const [roomName, setRoomName] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const handleRoomName = (name: string) => {
        setRoomName(name);
    }

    const handleCopyRoom = () => {
        const url = `${window.location.origin}/room/${roomCode}?roomPasscode=${roomPasscode}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className='absolute top-0 w-full h-full bg-[#FDF7EB] bg-opacity-85'>
            <div className='flex justify-between items-center w-full h-full'>
                <div
                    className='relative flex flex-col mx-auto bg-[#FDF7EB] border-2 border-[#F4976C] rounded h-1/2 w-[95%]'>
                    <div className='absolute -top-3 -left-3' onClick={handleCloseEditRoomOpen}>
                        <img src={CloseIcon} alt="icone" className="h-11 w-11"/>
                    </div>
                    <div className='relative flex flex-col items-center justify-center h-full pb-20 gap-10'>
                        <div className='relative w-full flex flex-col justify-center items-center gap-2'>
                            <div className='text-2xl'>Nome da lista de compras</div>
                            <input
                                placeholder={cartData?.name || "Lista de compras"}
                                className='w-3/4 h-8 pl-1 text-center'
                                onChange={(e) => handleRoomName(e.target.value)}
                                value={roomName}/>
                        </div>
                        <div className='w-full flex justify-center items-center gap-10'>
                            <div className='relative p-3 border border-[#F4976C] rounded-lg cursor-pointer'
                                 onClick={handleCopyRoom}>
                                <img src={CopyIcon} alt="icone" className="h-12 w-12"/>
                                {copied && (
                                    <div
                                        className='absolute w-52 -bottom-20 left-0 bg-[#F4976C] text-white p-2 rounded shadow-lg z-50  cursor-default'>
                                        Link copiado para a área de transferência!
                                    </div>
                                )}
                            </div>
                            <div className='p-3 border border-[#F4976C] rounded-lg'>
                                <img src={CleanIcon} alt="icone" className="h-12 w-12"/>
                            </div>
                            <div className='p-3 border border-[#F4976C] rounded-lg'>
                                <img src={DeleteIcon} alt="icone" className="h-12 w-12"/>
                            </div>
                        </div>
                        <div className='absolute bottom-5 py-2 px-10 border bg-[#F4976C]'>
                            <div className='text-2xl'
                                // onClick={addItem}
                            >
                                Adicionar
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditRoomModal;