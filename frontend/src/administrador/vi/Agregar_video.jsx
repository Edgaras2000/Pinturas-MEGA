import { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Agregar_video = () => {
    const navigate = useNavigate();
    const [video, setVideo] = useState(false);
    const fileInputRef = useRef(null); // Referencia al input de archivo

    const subir = async (e) => {
        e.preventDefault();

        const file = fileInputRef.current.files[0];

        const formData = new FormData();
        formData.append('video', file);
        formData.append('nombre', nombre);

        Swal.fire({
            title: 'Uploading video...',
            text: 'Please wait while your video is being uploaded.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            await axios.post("http://localhost:8000/pintura/video/subir/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            Swal.fire({
                icon: 'success',
                title: 'Upload Complete',
                text: 'Your video has been successfully uploaded!',
                timer: 3000,
            }).then(() => {
                navigate('/crud_videos'); // Redirige a la página deseada
            });

           



        } catch (error) {

        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };


    const [nombre, setnombre] = useState('')




    return (
        <div className="w-full h-screen bg-slate-700 flex justify-center items-center flex-col">
            <div className="bg-slate-100 w-6/12 h-auto min-w-[14rem] min-h-[24rem] rounded-md shadow-4xl p-6">
                <form onSubmit={subir} encType="multipart/form-data" className="w-full h-full flex flex-col justify-center items-center gap-8">
                    {/* Input de archivo oculto */}
                    <input
                        type="file"
                        name="video"
                        accept="video/*"
                        ref={fileInputRef}
                        onChange={() => setVideo(true)}
                        className="hidden"
                        required
                    />


                    {video ? (
                        <div className="h-4/6 w-4/6 hover:shadow-inner-xl shadow-4xl rounded-md flex justify-center items-center gap-2 bg-white">
                            <lord-icon
                                src="https://cdn.lordicon.com/qfwgmyhc.json"
                                trigger="loop"
                                style={{ width: '80%', height: '80%' }}
                            ></lord-icon>
                            <div className="flex flex-row justify-center items-center h-auto w-full gap-4">
                                <h1>Video seleccionado</h1>
                                <i className="fa-solid fa-check text-emerald-400 text-6xl"></i>
                            </div>

                        </div>
                    ) : (
                        <div
                            onClick={handleDivClick}
                            className="h-4/6 w-4/6 hover:shadow-inner-xl shadow-4xl hover:ring-2 hover:ring-cyan-400 rounded-md flex justify-center items-center gap-2 bg-white cursor-pointer"
                        >
                            <lord-icon
                                src="https://cdn.lordicon.com/qfwgmyhc.json"
                                trigger="loop"
                                style={{ width: '80%', height: '80%' }}
                            ></lord-icon>

                            <div className="flex flex-row justify-center items-center h-auto w-full">
                                <h1>Presiona el área para subir un video</h1>
                            </div>
                        </div>
                    )}


                    {video ? (

                        <div className='flex flex-col justify-center items-center gap-4'>

                            <input
                                type="text"
                                required
                                maxLength={40}
                                placeholder="Nombre del video"
                                value={nombre}
                                onChange={(e) => setnombre(e.target.value)}
                                className="w-full h-auto p-2 outline-none shadow-4xl rounded-md text-center 
             focus:ring-4 focus:ring-offset-2 focus:ring-transparent
             focus:bg-gradient-to-r focus:from-teal-100 focus:to-blue-100 
             focus:bg-[length:400%_400%] focus:animate-gradient-x text-black"
                            />

                            <button
                                type="submit"
                                className="w-5/6 p-2 shadow-4xl bg-gradient-to-r from-teal-300 to-blue-400 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x rounded-md"
                            >
                                Subir
                            </button>
                        </div>
                    ) : (


                        <div>


                        </div>

                    )}



                </form>
            </div>
        </div>
    );
};

export default Agregar_video;
