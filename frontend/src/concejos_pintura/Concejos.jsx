import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';


const Concejos = () => {
    const [idUsuario, setIdUsuario] = useState(null);
    const [expandir, setExpandir] = useState(false);

    const [mensajes, setmensajes] = useState([]);


    const navigate = useNavigate();

    const [pregunta, setpregunta] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }
    }, []);


    useEffect(() => {


        if (idUsuario) {


            cargar_comversacion();


        }

    }, [idUsuario])



    const cargar_comversacion = async () => {
        const url = "http://localhost:8000/pintura/comversasion/usuario/";
        try {
            const response = await axios.get(`${url}${idUsuario}`);
            console.log(response.data);  // Revisa la estructura completa
            // Actualiza el estado con el array de mensajes
            setmensajes(response.data.contenido);  // Asumiendo que 'contenido' es el array de mensajes
        } catch (error) {
            console.error("Error al cargar los mensajes", error);
        }
    };





    const colocar = (cuerpo) => {


        setpregunta(cuerpo);


    }

    const deseadoss = () => {
        navigate("/deseados");
    };

    const opciones = () => {
        navigate("/opciones");
    };

    const carritoo = () => {
        navigate("/carrito");
    };

    const prin = () => {
        navigate("/principal");
    };


    const subir_conversasion = async (e) => {
        e.preventDefault();

        const url = "http://localhost:8000/pintura/gemini/respuesta/";

        // Mostrar el SweetAlert de carga
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras procesamos tu solicitud.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();

                // Cerrar automáticamente después de 4 segundos
                setTimeout(() => {
                    Swal.close();
                }, 3500);
            },
        });

        try {
            await axios.post(url, {
                pregunta: pregunta,
                id_usuario: idUsuario,
            });

            // Si es exitoso, cargar conversación
            cargar_comversacion();
        } catch (error) {
            // Mostrar SweetAlert en caso de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Es posible que llegaras al límite de preguntas. Debes esperar 15 minutos.',
            });
        }
    };


    const divRef = useRef(null);
    const scrollToBottom = () => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    };


    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);


    return (
        <div className="w-full h-screen">



            <div className="grid grid-cols-5 grid-rows-1 gap-6 w-full h-full mt-2">

                <div className="hidden sm:block col-span-1 bg-slate-700 shadow-lg p-6 lg:flex justify-center items-center flex-col">

                    <div className='size-[100%] h-[50%] flex  justify-start'>

                        <i onClick={prin} class="fa-solid fa-house text-4xl text-white p-2"></i>

                    </div>



                    <div className='size-[100%] h-[50%] flex flex-col justify-center items-center '>




                    </div>

                </div>

                <div className="col-span-5 sm:col-span-3 bg-slate-400 p-6 rounded-lg  flex flex-col h-full z-50 shadow-4xl">

                    <div
                        ref={divRef}
                        className='h-[80%] p-4 overflow-y-auto ring-2 ring-black bg-white flex flex-col gap-8'>
                        {mensajes.length > 0 ? (

                            mensajes.map((mensaje, idx) => {

                                const isLastMessage = idx === mensajes.length - 1;
                                const isLastMessage2 = idx === mensajes.length - 2;


                                const ringColor = isLastMessage2 && mensaje.tipo_mensaje === 'usuario' || isLastMessage && mensaje.tipo_mensaje === 'gemini'
                                    ? 'ring-cyan-500'
                                    : 'ring-slate-400';

                                return (
                                    <div
                                        key={idx}
                                        className={mensaje.tipo_mensaje === 'usuario'
                                            ? 'text-right h-auto flex justify-end rounded-lg'
                                            : 'text-left h-auto flex justify-start rounded-lg'}
                                    >
                                        <div className={`bg-emerald-300 w-2/4 h-auto grid grid-cols-7 shadow-4xl`}>
                                            {mensaje.tipo_mensaje === 'usuario' ? (
                                                <>
                                                    <div className={`col-span-6 bg-slate-700 p-2 ring-2 ${ringColor} rounded-sm text-white`}>
                                                        <p>{mensaje.mensaje}</p>
                                                    </div>
                                                    <div className="col-span-1 bg-slate-300 flex justify-center items-center p-2 ring-2 ring-slate-700 rounded-sm">
                                                        <div className='w-10 h-10 bg-slate-700 ring-2 ring-white rounded-full overflow-hidden flex justify-center items-center'>
                                                            <i className="fa-solid fa-user text-white"></i>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-span-1 bg-slate-300 flex justify-center items-center p-2 ring-2 ring-slate-700 rounded-sm">
                                                        <div className='w-10 h-10 bg-slate-700 ring-2 ring-white rounded-full overflow-hidden flex justify-center items-center'>
                                                            <img src={logo} className="App-logo" alt="logo" />
                                                        </div>
                                                    </div>
                                                    <div className={`col-span-6 bg-slate-700 p-2 ring-2 ${ringColor} rounded-sm text-white text-justify`}>
                                                        <p className='p-1 text-sm sm:text-md'>{mensaje.mensaje}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })


                        ) : (
                            <div className='w-full h-full flex flex-col justify-center items-center gap-3'>


                                <div className='w-36 h-36 rounded-full ring-2 ring-black flex flex-col justify-center items-center overflow-hidden shadow-4xl bg-slate-200'>


                                    <lord-icon
                                        src="https://cdn.lordicon.com/jdgfsfzr.json"
                                        trigger="loop"
                                        style={{ width: '80%', height: '80%' }}
                                    />

                                </div>

                                <h1 className='text-3xl font-bold'>No tienes una conversasion iniciada</h1>
                                <h2 className='text-2xl font-bold'>Intenta enviar un mensaje</h2>

                            </div>
                        )}
                    </div>


                    <div className={`flex justify-center items-center flex-col transition-all duration-500  ${expandir ? 'h-[30%]' : 'h-[20%]'}`}>

                        {expandir ? (
                            <div className={`bg-slate-100 shadow-4xl rounded-lg w-full grid grid-cols-5 grid-rows-1  transition-all duration-500 ${expandir ? 'h-[40%] opacity-100' : 'h-[20%] opacity-0'}`}>

                                <div className='col-span-1 flex justify-center items-center'>

                                    <button
                                        onClick={() => colocar("¿Cómo puedo preparar una pared antes de pintar?")}
                                        className='text-white text-sm rounded-md outline-none p-2 break-words w-4/5 h-auto bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x text-center whitespace-normal'>
                                        ¿Cómo preparar un muro?
                                    </button>


                                </div>


                                <div className='col-span-1 flex justify-center items-center'>

                                    <button
                                        onClick={() => colocar("¿Cuántas capas de pintura necesito aplicar para obtener un acabado duradero?")}
                                        className='text-white text-sm rounded-md outline-none p-2 break-words w-4/5 h-auto bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x text-center whitespace-normal'>
                                        Capas de pintura
                                    </button>



                                </div>


                                <div className='col-span-1 flex justify-center items-center'>

                                    <button
                                        onClick={() => colocar("¿Qué tipo de brocha o rodillo debo usar para pintar diferentes superficies?")}
                                        className='text-white text-sm rounded-md outline-none p-2 break-words w-4/5 h-auto bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x text-center whitespace-normal'>
                                        Tipo de herramienta
                                    </button>



                                </div>


                                <div className='col-span-1 flex justify-center items-center'>

                                    <button
                                        onClick={() => colocar("¿Cómo puedo evitar que la pintura se pele o agriete con el tiempo?")}
                                        className='text-white text-sm rounded-md outline-none p-2 break-words w-4/5 h-auto bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x text-center whitespace-normal'>
                                        Prevenir
                                    </button>



                                </div>


                                <div className='col-span-1 flex justify-center items-center'>

                                    <button
                                        onClick={() => colocar("¿Como puedo limpiar mis herramientas de pintura?")}
                                        className='text-white text-sm rounded-md outline-none p-2 break-words w-4/5 h-auto bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 bg-[length:400%_400%] animate-gradient-x text-center whitespace-normal'>
                                        Limpieza de herramientas
                                    </button>


                                </div>



                            </div>

                        ) : (
                            <div></div>

                        )}

                        <form onSubmit={subir_conversasion} className=' w-full h-3/6  flex justify-center gap-2 items-center '>



                            <input type="text"
                                className='w-9/12 h-3/6 rounded-md outline-none text-center hover:shadow-4xl font-sans  ring-2 ring-black'
                                placeholder='Ingresa la duda que tengas'
                                name='pregunta'
                                value={pregunta}
                                onChange={(e) => setpregunta(e.target.value)}
                                required
                                maxLength={50}

                            />





                            <button type='submit'

                                className=" bg-white hover:shadow-4xl p-2 rounded-md  ring-2 ring-black">

                                <i class="fa-solid fa-paper-plane text-2xl"></i>


                            </button>


                            <button
                                type="button"
                                onClick={() => setExpandir(!expandir)}

                                className=" bg-white hover:shadow-4xl p-2 rounded-md ring-2 ring-black">



                                <i class="fa-solid fa-bars text-2xl"></i>


                            </button>






                        </form>


                    </div>
                </div>

                <div className="hidden sm:block col-span-1 bg-slate-700 shadow-lg  p-6 lg:flex flex-col justify-center items-center gap-4">


                    <button onClick={opciones}>
                        <i className="fa-regular fa-user text-6xl text-white"></i>
                    </button>

                    <button onClick={deseadoss}>
                        <i className="fa-regular fa-heart text-6xl text-white"></i>
                    </button>


                    <button onClick={carritoo}>
                        <i className="fa-solid fa-cart-shopping text-6xl text-white"></i>
                    </button>

                </div>


            </div>
        </div>
    );
};

export default Concejos;
