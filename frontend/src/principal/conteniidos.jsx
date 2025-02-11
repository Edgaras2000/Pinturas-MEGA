import axios from 'axios';
import { useState, useEffect } from 'react';


const Contenidos = () => {
    


    return (
        <div>
            <div id="contenido" className="w-full h-auto  grid grid-rows-4 grid-cols-1 xl:grid-rows-2 xl:grid-cols-2">
                <div className="bg-white row-span-1 xl:col-span-1 flex justify-center items-center gap-2 mt-2 ">

                    <div className='w-11/12 h-full  '>

                        <div className='w-full h-auto overflow-hidden flex flex-col justify-center gap-3 ring-4 mb-4 shadow-4xl'>
                            <img className='w-full h-5/6 bg-blue-300' src="/img/naranja.png" alt="caca" />

                            <div className=' w-full h-auto min-h-28 flex flex-col justify-center items-center'>
                                <div className='w-full'>
                                    <h1 className='p-4 text-left text-blue-300 font-bold text-2xl'>Blog y muestrario de colores</h1>
                                    <p className='p-4 text-left text-lg'>Lo que buscas es inspirarte? este apartado es para ti</p>

                                    <div className='w-full bg-blue-300 '>



                                        <h1
                                            className="text-center p-2 text-3xl text-white hover:text-black outline-none cursor-pointer"
                                            onClick={() => window.location.href = "https://www.shutterstock.com/es/search/muestrario-de-colores"}
                                        >
                                            Ingresar
                                        </h1>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>


                </div>


                <div className="bg-white row-span-1 xl:col-span-1 flex justify-center items-center gap-2 mt-2 ">

                    <div className='w-11/12 h-full  '>

                        <div className='w-full h-auto overflow-hidden flex flex-col justify-center gap-3 ring-4 ring-orange-400 mb-4 shadow-4xl'>
                            <img className='w-full h-5/6 bg-orange-400' src="/img/sala.png" alt="caca" />

                            <div className=' w-full h-auto min-h-28 flex flex-col justify-center items-center'>
                                <div className='w-full'>
                                    <h1 className='p-4 text-left text-orange-400 font-bold text-2xl'>Salas y ejemplos</h1>
                                    <p className='p-4 text-left text-lg'>no sabes coomo diseñar interiores? ven aqui</p>

                                    <div className='w-full bg-orange-400 '>
                                    <h1
                                            className="text-center p-2 text-3xl text-white hover:text-black outline-none cursor-pointer"
                                            onClick={() => window.location.href = "https://ar.pinterest.com/sandrabernachea/decoracion-de-salas/    "}
                                        >
                                            Ingresar
                                        </h1>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>


                </div>

                <div className="bg-white row-span-1 xl:col-span-1 flex justify-center items-center gap-2 mt-2 ">

                    <div className='w-11/12 h-full  '>

                        <div className='w-full h-auto overflow-hidden flex flex-col justify-center gap-3 ring-4 ring-emerald-800 mb-4 shadow-4xl'>
                            <img className='w-full h-5/6 bg-emerald-800' src="/img/pintor2.png" alt="caca" />

                            <div className=' w-full h-auto min-h-28 flex flex-col justify-center items-center'>
                                <div className='w-full'>
                                    <h1 className='p-4 text-left text-emerald-800 font-bold text-2xl'>Tutoriales </h1>
                                    <p className='p-4 text-left text-lg'>buscas una guia rapida para la aplicacion de productos? Ven aqui</p>

                                    <div className='w-full bg-emerald-800 '>
                                    <h1
                                            className="text-center p-2 text-3xl text-white hover:text-black outline-none cursor-pointer"
                                            onClick={() => window.location.href = "http://localhost:3000/video"}
                                        >
                                            Ingresar
                                        </h1>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>


                </div>



                <div className="bg-white row-span-1 xl:col-span-1 flex justify-center items-center gap-2 mt-2 ">

                    <div className='w-11/12 h-full  '>

                        <div className='w-full h-auto overflow-hidden flex flex-col justify-center gap-3 ring-4 mb-4 ring-red-600 shadow-4xl'>
                            <img className='w-full h-5/6 bg-red-600' src="/img/calculadora.png" alt="caca" />

                            <div className=' w-full h-auto min-h-28 flex flex-col justify-center items-center'>
                                <div className='w-full'>
                                    <h1 className='p-4 text-left text-red-600 font-bold text-2xl'>Blog y muestrario de colores</h1>
                                    <p className='p-4 text-left text-lg'>Lo que buscas es inspirarte? este apartado es para ti</p>

                                    <div className='w-full bg-red-600 '>
                                    <h1
                                            className="text-center p-2 text-3xl text-white hover:text-black outline-none cursor-pointer"
                                            onClick={() => window.location.href = "http://localhost:3000/calculadora"}
                                        >
                                            Ingresar
                                        </h1>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>


                </div>

            </div>
        </div>
    );
}

export default Contenidos;
