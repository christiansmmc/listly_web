import CloseIcon from '../assets/close.png'
import {useState} from "react";
import CopyIcon from "../assets/copia-de.png";
import DeleteIcon from "../assets/lixo.png";
import {useGenerateRoomAccessCodeQuery} from "../api/room/query.ts";

interface EditRoomModalProps {
    roomCode: string;
    handleCloseEditRoomOpen: VoidFunction;
}

const EditRoomModal = ({
                           roomCode,
                           handleCloseEditRoomOpen
                       }: EditRoomModalProps) => {
    const [roomName, setRoomName] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const {mutateAsync} = useGenerateRoomAccessCodeQuery()

    const handleRoomName = (name: string) => {
        setRoomName(name);
    }

    const handleCopyRoom = async () => {
        const accessCodeResponse = await mutateAsync({roomCode})
        const url = `${window.location.origin}/room/${roomCode}?accessCode=${accessCodeResponse.access_code}`;

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
                    <div className='absolute -top-1 -right-1' onClick={handleCloseEditRoomOpen}>
                        <img
                            src={CloseIcon}
                            alt="icone"
                            className="h-12 w-12"
                            onClick={handleCloseEditRoomOpen}
                        />
                    </div>
                    <div className='flex flex-col h-full w-[90%] mx-auto'>
                        <div
                            className='mt-7 w-[75%] mx-auto border-b border-[#F4976C]'>
                            <p className='text-2xl text-center text-[#F4976C] font-extrabold'>Configurações</p>
                        </div>
                        <div className='flex flex-col justify-center items-center w-full h-full gap-7'>
                            <div className='mt-7 w-full flex flex-col gap-2'>
                                <div className='text-xl'>Editar nome da Lista</div>
                                <input
                                    placeholder={"Lista de compras"}
                                    className='w-full h-10 p-2 border border-[#F4976C] rounded-lg'
                                    onChange={(e) => handleRoomName(e.target.value)}
                                    value={roomName}/>
                                <div className='w-1/2 h-10 mx-auto flex justify-center items-center border rounded bg-[#F4976C]'>
                                    <div className='text-xl'>
                                        Salvar
                                    </div>
                                </div>
                            </div>
                            <div className='mt-7 w-full flex'>
                                <div className='relative w-1/2 flex flex-col items-center gap-2'>
                                    <div className='w-20 h-20 border border-[#F4976C] rounded-lg cursor-pointer flex justify-center items-center'
                                         onClick={handleCopyRoom}>
                                        <img src={CopyIcon} alt="icone" className="h-12 w-12"/>
                                        {copied && (
                                            <div
                                                className='absolute w-52 -bottom-20 left-0 bg-[#F4976C] text-white p-2 rounded shadow-lg z-50  cursor-default'>
                                                Link copiado para a área de transferência!
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div>
                                            Copiar Link da Lista
                                        </div>
                                    </div>
                                </div>

                                <div className='w-1/2 flex flex-col items-center gap-2'>
                                    <div className='w-20 h-20 border border-[#F4976C] rounded-lg cursor-pointer flex justify-center items-center'>
                                        <img src={DeleteIcon} alt="icone" className="h-12 w-12"/>
                                    </div>
                                    <div>
                                        <div>
                                            Deletar Lista
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditRoomModal;