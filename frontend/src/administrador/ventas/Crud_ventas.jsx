import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../sidebar/sidebar';
import Modal from './Modal.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Crud_ventas = () => {
    const [buscador, setBuscador] = useState("");
    const [tamaño, settamaño] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [filter, setFilter] = useState("todos");
    const dropdownRef = useRef(null);
    const tableRef = useRef(null);


    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const manejarFilaClick = (venta) => {
        setVentaSeleccionada(venta);
        setModalAbierto(true); // Abrir el modal cuando se hace clic en una fila
    };

    const cerrarModal = () => {
        setModalAbierto(false); // Cerrar el modal
    };




    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const limpiar = () => setBuscador("");

    useEffect(() => {
        const obtenerTamaño = () => {
            settamaño(window.innerWidth <= 640);
        };

        obtenerTamaño();
        window.addEventListener('resize', obtenerTamaño);

        return () => window.removeEventListener('resize', obtenerTamaño);
    }, []);

    const tabla_ventas = async () => {
        const url = "http://localhost:8000/pintura/estadistica/venta/esta/fil/";
        try {
            const response = await axios.get(url);
            setVentas(response.data);
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
        }
    };

    useEffect(() => {
        tabla_ventas();
    }, []);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const cambiarEstado = async (id) => {
        const url2 = "http://localhost:8000/pintura/venta/cambiar/";

        console.log(id);
        
        try {
            await axios.post(url2, { id_venta: id });
            
            // Muestra una alerta de éxito si se completa la venta
            Swal.fire({
                title: '¡Éxito!',
                text: 'El estado de la venta ha sido cambiado a completado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
    
            // Actualiza la tabla después de cambiar el estado
            tabla_ventas();
        } catch (error) {
            console.error('Error al cambiar el estado:', error.response ? error.response.data : error.message);
    
            // Muestra una alerta de error si ocurre algún problema
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al cambiar el estado de la venta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    const Cancelar = async (id,correos) => {
        console.log("el correo es:"+correos)
        try {
            const response = await axios.post("http://localhost:8000/pintura/venta/cancelar/", {
                id_venta: id,
                t_correo:correos,
            });
    
      
            Swal.fire({
                icon: 'success',
                title: 'Cancelación exitosa',
                text: 'La venta ha sido cancelada correctamente.',
                confirmButtonText: 'Aceptar',
            });
    
       
            tabla_ventas();
        } catch (error) {
         
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cancelar la venta. Por favor, intenta de nuevo.',
                confirmButtonText: 'Aceptar',
            });
        }
    };



    const filtrarVentas = () => {
        return ventas.filter(venta => {
            if (filter === "pendientes") return venta.estado === "pendiente";
            if (filter === "completadas") return venta.estado === "completada";
            if (filter === "cancelado") return venta.estado === "cancelado";
            return true;
        }).filter(venta => venta.usuarioNombre.toLowerCase().includes(buscador.toLowerCase()));
    };

    const generatePDF = async () => {
        const input = document.getElementById('tablaVentas');
        html2canvas(input, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            const imgWidth = 270;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save("ventas.pdf");
        });
    };




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

    return (
        
        <div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h1 className=' text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl'>Ventas</h1>


            <div className='w-full h-screen flex justify-center items-center'>
                <div className='w-11/12 h-5/6 bg-slate-700 rounded-lg shadow-4xl'>
                    <div className='w-full h-1/6 bg-fondo_crud rounded-t-lg flex justify-around items-center'>
                        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
                            <input
                                id='buscador'
                                type="text"
                                value={buscador}
                                onChange={(e) => setBuscador(e.target.value)}
                                placeholder="¿Filtrar por Nombre de usuario?"
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

                        <div className='flex justify-center items-center gap-14'>
                            <div className="w-2/4 flex flex-col gap-3 items-start ">

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="pendientes"
                                        checked={filter === "pendientes"}
                                        onChange={() => setFilter("pendientes")}
                                        className="hidden"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "pendientes" ? 'border-cyan-400' : 'border-gray-400'
                                            } transition-all duration-200`}
                                    >
                                        {filter === "pendientes" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span
                                        className={`${filter === "pendientes" ? 'text-cyan-400' : 'text-gray-400'
                                            } transition-colors duration-200`}
                                    >
                                        Pendientes
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="completadas"
                                        checked={filter === "completadas"}
                                        onChange={() => setFilter("completadas")}
                                        className="hidden"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "completadas" ? 'border-cyan-400' : 'border-gray-400'
                                            } transition-all duration-200`}
                                    >
                                        {filter === "completadas" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span
                                        className={`${filter === "completadas" ? 'text-cyan-400' : 'text-gray-400'
                                            } transition-colors duration-200`}
                                    >
                                        Completadas
                                    </span>
                                </label>




                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="cancelado"
                                        checked={filter === "cancelado"}
                                        onChange={() => setFilter("cancelado")}
                                        className="hidden"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "cancelado" ? 'border-cyan-400' : 'border-gray-400'
                                            } transition-all duration-200`}
                                    >
                                        {filter === "cancelado" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span
                                        className={`${filter === "cancelado" ? 'text-cyan-400' : 'text-gray-400'
                                            } transition-colors duration-200`}
                                    >
                                        Cancelado
                                    </span>
                                </label>



                                


                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="todos"
                                        value="todos"
                                        checked={filter === "todos"}
                                        onChange={() => setFilter("todos")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "todos" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "todos" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "todos" ? 'cyan-400' : 'gray-400'}`}>Todo</span>
                                </label>

                            <button onClick={generatePDF} className='bg-cyan-500 text-black w-32 h-10 rounded-md shadow-sm shadow-cyan-500 hover:bg-magenta_caca'>
                                <i className="fa-solid fa-print text-xl"></i> Imprimir
                            </button>
                        </div>
                    </div>

                    <div ref={tableRef} className='h-5/6 rounded-e-md bg-slate-500 overflow-auto relative'>
                        {ventas.length > 0 ? (
                            <table id='tablaVentas' className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">

                                        <th className="px-4 py-2 text-center">Usuario</th>

                                        <th className="px-4 py-2 text-center">Dirección</th>
                                        <th className="px-4 py-2 text-center">Total</th>
                                        <th className="px-4 py-2 text-center">Detalle</th>
                                        <th className="px-4 py-2 text-center">Fecha</th>
                                        <th className="px-4 py-2 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarVentas().map((venta) => (
                                        <tr key={venta._id} className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400" >

                                            <td className="px-4 py-2 text-center">{venta.usuarioNombre}</td>

                                            <td className="px-4 py-2 text-center">{venta.direccion.direccion}</td>
                                            <td className="px-4 py-2 text-center"><label htmlFor="" className='text-emerald-300 m-1'>$</label>{venta.total}</td>
                                            <td className="px-4 py-2 text-center">{new Date(venta.fecha).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => manejarFilaClick(venta)} className="bg-gray-700 ring-2 ring-cyan-400 w-5/6 h-auto px-2 py-1 rounded-sm text-white text-sm font-semibold overflow-hidden whitespace-nowrap">
                                                    Productos
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => toggleDropdown(venta._id)} className="text-white rounded-lg">
                                                    {venta.estado === "pendiente" ? (
                                                        <div className="bg-orange-200 px-2 py-1 text-orange-800 rounded-md w-full  hover:bg-orange-500">
                                                            Pendiente
                                                        </div>
                                                    ) : venta.estado === "completada" ? (
                                                        <div className="bg-emerald-200 px-2 py-1 text-emerald-800 rounded-md w-full hover:bg-emerald-500">
                                                            Completada
                                                        </div>
                                                    ) : venta.estado === "cancelado" ? (
                                                        <div className="bg-red-200 px-2 py-1 text-red-800 rounded-md w-full hover:bg-red-500">
                                                            Cancelado
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </button>
                                                {openDropdownId === venta._id && (
                                                    <div ref={dropdownRef} className="absolute bg-white rounded-lg shadow-lg mt-2 z-10">
                                                        <ul className="py-2 text-sm text-gray-700">
                                                            {venta.estado === "pendiente" ? (
                                                                <div>
                                                                    <li>
                                                                        <button onClick={() => cambiarEstado(venta._id)} className="block px-4 py-2 hover:bg-gray-100 w-full">Completar</button>
                                                                    </li>
                                                                    <li>
                                                                        <button onClick={() => Cancelar(venta._id,venta.usuarioCorreo)} className="block px-4 py-2 hover:bg-gray-100 w-full">Cancelar</button>
                                                                    </li>
                                                                </div>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>



                        ) : (
                            <div>No hay ventas disponibles</div>
                        )}


                        {modalAbierto && (
                            <Modal venta={ventaSeleccionada} cerrarModal={cerrarModal} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Crud_ventas;
