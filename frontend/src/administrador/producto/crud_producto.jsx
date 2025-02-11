import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../sidebar/sidebar';
import Calificacion2 from './estrellas';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Crud_producto = () => {
    const navigate = useNavigate();

    const [buscador, setBuscador] = useState("");
    const [tamaño, settamaño] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [producto, setproducto] = useState([]);
    const [filter, setFilter] = useState({
        estado: "todos",
        tipo: "todos"
    });
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const tableRef = useRef(null);



    const limpiar = () => {
        setBuscador("");
    };

    useEffect(() => {
        const obtenerTamaño = () => {
            settamaño(window.innerWidth <= 640);
        };

        obtenerTamaño();
        window.addEventListener('resize', obtenerTamaño);

        return () => {
            window.removeEventListener('resize', obtenerTamaño);
        };
    }, []);

    useEffect(() => {
        tabla_producto();
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setOpenDropdownId(null);
        };

        const tableElement = tableRef.current;

        if (tableElement) {
            tableElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (tableElement) {
                tableElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    const tabla_producto = async () => {
        const url = "http://localhost:8000/pintura/producto/crud_todo/caca/";
        try {
            const pro = await axios.get(url);
            setproducto(pro.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
        }
    };

    const filtrarProductos = () => {
        return producto.filter(item => {
            const tipoMatch = filter.tipo === "todos" ||
                (filter.tipo === "pintura" && item.tipo === "pintura") ||
                (filter.tipo === "herramienta" && item.tipo === "herramienta");

            const estadoMatch = filter.estado === "todos" ||
                (filter.estado === "activos" && item.estado === true) ||
                (filter.estado === "no_activos" && item.estado === false);

            return tipoMatch && estadoMatch && item.nombre.toLowerCase().includes(buscador.toLowerCase());
        });
    };



    const agregar_producto = () => {
        navigate('/insertar_Producto'); // Agrega una barra al inicio de la ruta si es necesario
    };



    const handleQuantityChange = async (index, value) => {

        const newQuantity = Math.max(1, value);
        const newCarrito = [...producto];
        newCarrito[index].cantidad_carrito = newQuantity;

        const url2 = `http://localhost:8000/pintura/producto/crud_todo/stock/`;
        try {
            // Enviar la actualización del stock al servidor
            await axios.post(url2, {
                id_producto: newCarrito[index]._id,
                stock: newQuantity,
            });





            tabla_producto();
        } catch (error) {
            console.error("Error al actualizar el stock", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Hubo un problema al actualizar el stock!',
            });
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        const url3 = "http://localhost:8000/pintura/producto/crud_todo/cambiar_estado/";

        await axios.post(url3, {
            id_producto: id,
            estado: nuevoEstado
        });

        tabla_producto();
    };

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };





    const generatePDF = async () => {
        const input = document.getElementById('tablachida');


        input.querySelectorAll('img').forEach((img) => {
            img.crossOrigin = 'anonymous';
        });

        html2canvas(input, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            const imgWidth = 270;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save("tabla.pdf");
        });
    };


    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <link rel="stylesheet" href="/style/crud_producto/estilo.css" />
            <link rel="stylesheet" href="/style/carrito/style.css" />


    <h1 className=' text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl'>Productos</h1>


            <div className='w-full h-screen flex justify-center items-center'>
                <div className='w-11/12 h-5/6 bg-slate-700 rounded-lg shadow-4xl'>
                    <div className='w-full h-1/6 bg-fondo_crud rounded-t-lg flex justify-around items-center'>
                        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
                            <input
                                type="text"
                                value={buscador}
                                onChange={(e) => setBuscador(e.target.value)}
                                placeholder="¿Filtrar Contenido?"
                                className="w-full bg-gray-800 text-white rounded-full pl-10 pr-10 py-2 outline-none ring-2 ring-cyan-400 hover:ring-red-400"
                            />
                            <span className="absolute left-3 top-2 text-gray-400">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <span className="absolute right-3 top-2 text-gray-400">
                                <button onClick={limpiar}>
                                    {tamaño ? <i className="fa-solid fa-trash"></i> : 'Limpiar contenido'}
                                </button>
                            </span>
                        </div>

                        <div className='gap-3 flex justify-center items-center'>
                            <div className="w-1/4 flex gap-6  flex-col items-start">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filterEstado"
                                        value="activos"
                                        checked={filter.estado === "activos"}
                                        onChange={() => setFilter({ ...filter, estado: "activos" })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter.estado === "activos" ? 'border-emerald-500' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter.estado === "activos" && <div className="w-3 h-3 bg-emerald-500 rounded-full transition-all duration-200"></div>}
                                    </div>
                                    <span className={`text-${filter.estado === "activos" ? 'emerald-500' : 'gray-400'}`}>Activo</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filterEstado"
                                        value="no_activos"
                                        checked={filter.estado === "no_activos"}
                                        onChange={() => setFilter({ ...filter, estado: "no_activos" })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter.estado === "no_activos" ? 'border-red-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter.estado === "no_activos" && <div className="w-3 h-3 bg-red-400 rounded-full transition-all duration-200"></div>}
                                    </div>
                                    <span className={`text-${filter.estado === "no_activos" ? 'red-400' : 'gray-400'}`}>No Activo</span>
                                </label>
                            </div>

                            <div className="w-2/4 flex flex-col justify-start  gap-6 items-center ">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filterTipo"
                                        value="pintura"
                                        checked={filter.tipo === "pintura"}
                                        onChange={() => setFilter({ ...filter, tipo: "pintura" })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter.tipo === "pintura" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter.tipo === "pintura" && <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>}
                                    </div>
                                    <span className={`text-${filter.tipo === "pintura" ? 'cyan-400' : 'gray-400'}`}>Pintura</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filterTipo"
                                        value="herramienta"
                                        checked={filter.tipo === "herramienta"}
                                        onChange={() => setFilter({ ...filter, tipo: "herramienta" })}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter.tipo === "herramienta" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter.tipo === "herramienta" && <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>}
                                    </div>
                                    <span className={`text-${filter.tipo === "herramienta" ? 'cyan-400' : 'gray-400'}`}>Herramienta</span>
                                </label>
                            </div>


                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="filterEstado"
                                    value="todos"
                                    checked={filter.estado === "todos"}
                                    onChange={() => setFilter({ estado: "todos", tipo: "todos" })}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter.estado === "todos" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                    {filter.estado === "todos" && <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>}
                                </div>
                                <span className={`text-${filter.estado === "todos" ? 'red-400' : 'gray-400'}`}>Todo</span>
                            </label>

                            <button onClick={agregar_producto} className='bg-cyan-500 text-black w-32 h-10 rounded-md shadow-sm shadow-cyan-500 hover:bg-red-400'>
                                <i className="fa-solid fa-plus text-xl"></i> Agregar
                            </button>
                            <button onClick={generatePDF} className='bg-cyan-500 text-black w-32 h-10 rounded-md shadow-sm shadow-cyan-500 hover:bg-red-400'>
                                <i className="fa-solid fa-print text-xl"></i> Imprimir
                            </button>
                        </div>

                    </div>

                    <div ref={tableRef} className='h-5/6 rounded-e-md bg-gray-800 overflow-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 relative'>

                        {producto.length > 0 ? (
                            <table id='tablachida' className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-center">Imagen</th>
                                        <th className="px-4 py-2 text-center">Nombre</th>
                                        <th className="px-4 py-2 text-center">Stock</th>
                                        <th className="px-4 py-2 text-center">Precio</th>
                                        <th className="px-4 py-2 text-center">Calificación</th>
                                        <th className="px-4 py-2 text-center">Estado</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarProductos().map((producto, index) => (
                                        <tr key={producto._id} className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400">
                                            <td className="px-4 py-2 text-center   overflow-hidden ">
                                                <div className='w-full h-full rounded-full flex justify-center items-center'>
                                                    {producto.tipo === "pintura" ? (

                                                        <img
                                                            style={{ backgroundColor: producto.color }}
                                                            src="/img/chifo sin fondo jeje.png" alt={producto.nombre} className=" w-16 h-16 bg-blue-400 ring-2 ring-white overflow-hidden rounded-full" />


                                                    ) : (

                                                        <img src={producto.url} alt={producto.nombre} className=" w-16 h-16 ring-2 ring-white overflow-hidden rounded-full" />

                                                    )}

                                                </div>
                                            </td>
                                            <td className="px-2 py-2 text-center">{producto.nombre}</td>
                                            <td className=" py-8 text-center  flex justify-center items-center gap-4 ">


                                                {
                                                    producto.stock > 20 ? (
                                                        <div className="bg-emerald-400 h-6 w-6 rounded-full ring-2 ring-white"></div>
                                                    ) : producto.stock > 10 && producto.stock <= 20 ? (
                                                        <div className="bg-amarillo_caca h-6 w-6 rounded-full ring-2 ring-white"></div>
                                                    ) : (
                                                        <div className="bg-magenta_caca h-6 w-6 rounded-full ring-2 ring-white"></div>
                                                    )
                                                }


                                                <div className="flex w-2/4 items-center justify-center rounded-md ring-2 ring-cyan-500">
                                                    <button
                                                        disabled={producto.stock === 1}
                                                        onClick={() => handleQuantityChange(index, Math.max(1, producto.stock - 1))}
                                                        className="bg-cyan-400 rounded-l-md py-1 px-2 hover:bg-gray-300">
                                                        <i className="fa-solid fa-minus text-black"></i>
                                                    </button>

                                                    <input
                                                        className="w-full h-8 text-center border-0 outline-none appearance-none bg-gray-800"
                                                        type="number"

                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value, 10);
                                                            handleQuantityChange(index, isNaN(value) ? 1 : value);
                                                        }}
                                                        value={producto.stock}
                                                    />

                                                    <button
                                                        onClick={() => handleQuantityChange(index, Math.max(2, producto.stock + 1))}
                                                        className="bg-cyan-300 rounded-r-md py-1 px-2 hover:bg-gray-400">
                                                        <i className="fa-solid fa-plus text-black"></i>
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-4 py-2 text-center">${producto.precio}.00</td>
                                            <td className="px-4 py-2 text-center  h-16 flex justify-center items-center">

                                                <Calificacion2
                                                    rating={
                                                        producto.totalCalificaciones > 0
                                                            ? parseFloat((producto.sumaCalificaciones / producto.totalCalificaciones).toFixed(2))
                                                            : 0
                                                    }
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => toggleDropdown(producto._id)} className="text-white rounded-lg">
                                                    {producto.estado ? (
                                                        <div className='bg-emerald-200 px-2 py-1 text-emerald-800 rounded-md w-full min-w-20 hover:bg-emerald-500'>Activo</div>
                                                    ) : (
                                                        <div className='bg-red-500 px-2 py-1 w-full min-w-20 rounded-md '>Inactivo</div>
                                                    )}
                                                </button>

                                                {openDropdownId === producto._id && (
                                                    <div ref={dropdownRef} className="absolute bg-white rounded-lg shadow-lg mt-2 z-10">
                                                        <ul className="py-2 text-sm text-gray-700">
                                                            {!producto.estado ? (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(producto._id, true)} className="block px-4 py-2 hover:bg-gray-100 w-full">Activar <i className="fa-solid fa-arrow-up"></i></button>
                                                                </li>
                                                            ) : (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(producto._id, false)} className="block px-4 py-2 hover:bg-gray-100 w-full">Desactivar <i className="fa-solid fa-arrow-down"></i></button>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}




                                            </td>
                                            <td className="px-4 py-2 text-center flex justify-center items-center gap-4">
                                                <Link to={`/editar_producto/${producto._id}`} className="text-yellow-500 text-4xl hover:text-amarillo_caca"><i class="fa-solid fa-pen-to-square"></i></Link>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='w-full h-full bg-gray-200 flex flex-col justify-center items-center gap-4'>

                                <div className='w-72  h-72 bg-slate-300  rounded-full  ring-4  ring-black  shadow-4xl flex justify-center items-center' >
                                    <lord-icon
                                        src="https://cdn.lordicon.com/wjyqkiew.json"
                                        trigger="loop"
                                        style={{ width: '80%', height: '80%' }}
                                    ></lord-icon>
                                </div>

                                <h2 className='font-semibold text-3xl'>No se encontraron los datos deseados</h2>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Crud_producto;
