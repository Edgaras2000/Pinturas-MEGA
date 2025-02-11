import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corregido importación de jwtDecode
import Navbar from '../login/navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Deseados = () => {
    const navigate = useNavigate();
    const [cosas, setCosas] = useState([]);
    const [idUsuario, setIdUsuario] = useState(null);

    const url = `http://localhost:8000/pintura/deseados/todo/${idUsuario}`;
    const url2 = `http://localhost:8000/pintura/deseados/eliminar/`;

    const corazon_btn = () => {
        navigate('/producto/herramienta');
    };


    const fetchCosas = async () => {
        try {
            const response = await axios.get(url);
            setCosas(response.data);


           
        } catch (error) {
            console.error("Error fetching cosas:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }


        fetchCosas();


        return () => {
            setCosas([]);
        };
    }, [idUsuario]);


    const llevar = (cosaId) => {
        navigate(`/producto/info/${cosaId}`);
    };


    const eliminar_deseados = async (idProducto) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "El producto será eliminado",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(url2, {
                        id_producto: idProducto
                    });
    
                    // Update the 'cosas' state by removing the deleted product
                    setCosas((prevCosas) => prevCosas.filter(item => item._id !== idProducto));
    
                    Swal.fire({
                        title: "Eliminado",
                        text: "El producto ha sido eliminado de la lista de deseados",
                        icon: "success"
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el producto",
                        icon: "error"
                    });
                }
            }
        });
    };
    

    return (
        <div>
            <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-10">
                <Navbar />
            </div>

            <div className='w-full min-h-screen bg-gray-200 flex flex-col items-center'>
                <div className='w-8/12 h-176 bg-white overflow-y-auto mt-16 rounded-md scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 shadow-2.5xl'>
                    {cosas.length > 0 ? (
                        cosas.map((item, index) => (
                            <div key={index} className='bg-white h-60 flex justify-center items-center hover:bg-gray-100'>
                                <div className='bg-white w-10/12 h-52 rounded-md grid grid-cols-3 grid-rows-1 shadow-4xl ring-2 ring-black hover:ring-emerald-500'>
                                    <div className='col-span-1 flex justify-center items-center border-r-4 border-gray-300'>
                                        {item.tipo === 'pintura' ? (
                                            <div className='w-10/12 h-5/6 flex justify-center items-center shadow-2xl'>
                                                <div onClick={() => llevar(item._id)} style={{ backgroundColor: item.color }} className='w-full h-full flex justify-center items-center overflow-hidden'>
                                                    <img className='w-fill h-full object-cover cursor-pointer' src="/img/chifo sin fondo jeje.png" alt="" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='w-10/12 h-5/6 flex justify-center items-center cursor-pointer'>
                                             
                                                <img onClick={() => llevar(item._id)} src={item.url} alt={item.nombre} className='w-fill h-full object-cover rounded overflow-hidden' />
                                             
                                            </div>
                                        )}
                                    </div>

                                    <div className='col-span-2'>
                                        <h2 className='text-right p-2'>
                                            Añadido en: {new Date(item.fecha).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </h2>
                                        <h1 className='text-left p-2 text-xl font-semibold'>{item.nombre}</h1>
                                        <h2 className='text-left p-2'>$ {item.precio}</h2>

                                    
                                        {item.stock > 1 ? (
                                            <h1 className="text-left p-2 text-green-500 font-semibold">Disponible</h1>
                                        ) : (
                                            <h1 className="text-left p-2 text-red-500 font-semibold">No disponible</h1>
                                        )}

                                        <button className='' onClick={() => eliminar_deseados(item._id)}>
                                            <i className="fa-solid fa-heart-crack text-4xl transition-colors duration-300 hover:text-blue-400"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='w-full h-full flex flex-col justify-center items-center gap-8'>
                            <button onClick={corazon_btn} className='ring-8 ring-gray-300 rounded-full p-20 shadow-xl hover:ring-magenta_caca'>
                                <lord-icon
                                    src="https://cdn.lordicon.com/xyboiuok.json"
                                    trigger="loop"
                                    style={{ width: '120px', height: '120px', duration: '3000' }}>
                                </lord-icon>
                            </button>

                            <h1 className='text-2xl font-semibold'>Aún no tienes productos favoritos</h1>
                            <h2 className='text-lg'>Agregalos haciendo click en el corazón de la parte superior derecha del producto</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Deseados;
