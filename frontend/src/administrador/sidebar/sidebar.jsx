import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const cambiar1 = () => {
        navigate('/crud_producto');
    };

    const cambiar2 = () => {
        navigate('/crud_usuarios');
    };

    const cambiar3 = () => {
        navigate('/crud_ventas');
    };

    const cambiar4 = () => {
        navigate('/estadisticas');
    };

    const cambiar5 = () => {
        navigate('/crud_videos');
    };


    const cambiar6 = () => {
        navigate('/crud_sugerencias');
    };


    const cambiar7 = () => {
        navigate('/inicio');
    };

    const cambiar8 = () => {
        navigate('/crud_resenas');
    };

    return (
        <div className="flex">



            
            <button
                onClick={toggleSidebar}
                className="p-4 m-2 text-white hover:text-black bg-gray-800 rounded hover:bg-cyan-500 ring-2 ring-cyan-500"
            >
                {isOpen ? <i className="fa-solid fa-x"></i> : <i className="fa-solid fa-bars"></i>}
            </button>

            <div
                className={`fixed top-0 z-30 left-0 h-full bg-gray-800 ring-2 ring-cyan-500 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: '250px' }}
            >
                <button
                    onClick={toggleSidebar}
                    className="absolute top-2 right-2 p-2 text-white rounded-full hover:bg-cyan-500 hover:text-black text-3xl ring-4 ring-cyan-500 outline-none"
                >
                    ✕
                </button>
                <h2 className="p-4 text-xl font-bold">Admin</h2>
                <ul className="p-4 space-y-4">



                <div
                        onClick={cambiar7}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                       <i class="fa-solid fa-house"></i>
                        <h3>Inicio</h3>

                    </div>


                    <div
                        onClick={cambiar1}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h3>PRODUCTO</h3>

                    </div>


                    <div
                        onClick={cambiar2}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-solid fa-user"></i>
                        <h3>USUARIOS</h3>
                    </div>



                    <div
                        onClick={cambiar3}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-solid fa-money-bill"></i>  
                        <h3>VENTAS</h3>
                    </div>

                    <div
                        onClick={cambiar4}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-solid fa-chart-pie"></i>
                        <h3>Estadisticas</h3>
                    </div>



                    <div
                        onClick={cambiar5}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-solid fa-file-video"></i>
                        <h3>Videos</h3>
                    </div>
                    <div
                        onClick={cambiar6}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-solid fa-walkie-talkie"></i>
                        <h3>Sugerencias</h3>
                    </div>


                    <div
                        onClick={cambiar8}
                        className="min-h-12 hover:bg-cyan-500 rounded-md flex flex-row justify-center items-center gap-4 ring-2 ring-cyan-500 hover:text-black cursor-pointer"
                    >
                        <i class="fa-regular fa-comments"></i>
                        <h3>Reseñas</h3>
                    </div>



                </ul>
            </div>

           
            <div className="flex-grow p-4">
              
            </div>
        </div>
    );
};

export default Sidebar;
