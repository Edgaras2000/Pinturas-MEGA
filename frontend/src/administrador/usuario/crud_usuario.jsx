import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../sidebar/sidebar';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Crud_usuario = () => {
    const [buscador, setBuscador] = useState("");
    const [tamaño, settamaño] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [filter, setFilter] = useState("todos");
    const dropdownRef = useRef(null);
    const tableRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
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

    const tabla_usuario = async () => {
        const url = "http://localhost:8000/pintura/usuario/crud_todo/";
        try {
            const response = await axios.get(url);
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    useEffect(() => {
        tabla_usuario();
    }, []);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        const url2 = "http://localhost:8000/pintura/usuario/crud_todo/cambiar_estado/";

        await axios.post(url2, {
            id_usuario: id,
            estado: nuevoEstado
        });

        tabla_usuario();
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


    const filtrarUsuarios = () => {
        return usuarios.filter(usuario => {
            if (filter === "activos") return usuario.estado;
            if (filter === "no_activos") return !usuario.estado;
            return true;
        }).filter(usuario =>
            usuario.nombre.toLowerCase().includes(buscador.toLowerCase())
        );
    };




    const generatePDF = async () => {
        const input = document.getElementById('tablachida');

        // Asegura que todas las imágenes tengan `crossOrigin` configurado
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

    const url = 'http://localhost:8000/pintura/';
    const eliminar_usuario = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al usuario permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${url}${id}`);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Usuario eliminado!',
                        text: 'El usuario ha sido eliminado con éxito',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        tabla_usuario(); // Refresca la tabla después de eliminar
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al eliminar el usuario. Intenta nuevamente.',
                    });
                }
            }
        });
    };



    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h1 className=' text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl'>Usuarios:</h1>
        

            <div className='w-full h-screen flex justify-center items-center'>
                <div className='w-11/12 h-5/6 bg-slate-700 rounded-lg shadow-4xl'>
                    <div className='w-full h-1/6 bg-fondo_crud rounded-t-lg flex justify-around items-center'>
                        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
                            <input
                                id='buscador'
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

                        <div className='flex justify-center items-center gap-14'>
                            <div className="w-2/4 flex gap-6 items-center">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="activos"
                                        checked={filter === "activos"}
                                        onChange={() => setFilter("activos")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "activos" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "activos" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "activos" ? 'cyan-400' : 'gray-400'}`}>Activos</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="no_activos"
                                        checked={filter === "no_activos"}
                                        onChange={() => setFilter("no_activos")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "no_activos" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "no_activos" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "no_activos" ? 'cyan-400' : 'gray-400'}`}>No Activos</span>
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

                    <div ref={tableRef} className='h-5/6 rounded-e-md bg-slate-500 overflow-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 relative'>

                        {usuarios.length > 0 ? (


                            <table id='tablachida' className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-center">Foto</th>
                                        <th className="px-4 py-2 text-center">Nombre</th>
                                        <th className="px-4 py-2 text-center">Correo</th>
                                        <th className="px-4 py-2 text-center">Teléfono</th>
                                        <th className="px-4 py-2 text-center">Usuario</th>
                                        <th className="px-4 py-2 text-center">Estado</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarUsuarios().map((usuario) => (
                                        <tr key={usuario._id} className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400">
                                            <td className="px-4 py-2 text-center flex justify-center items-center">



                                                <div className='w-full h-full rounded-full flex justify-center items-center'>
                                                    {usuario.tipo ? (

                                                        <img

                                                            src={usuario.url} alt={usuario.nombre} className=" w-16 h-16 bg-blue-400 ring-2 ring-white overflow-hidden rounded-full" />


                                                    ) : (

                                                        <img
                                                            className='w-16 rounded-full '
                                                            src={usuario.url || 'https://via.placeholder.com/100'}
                                                            alt="Imagen de usuario"
                                                        />
                                                    )}

                                                </div>

                                            </td>
                                            <td className="px-4 py-2 text-center">{usuario.nombre}</td>
                                            <td className="px-4 py-2 text-center">{usuario.correo}</td>
                                            <td className="px-4 py-2 text-center">{usuario.telefono}</td>
                                            <td className="px-4 py-2 text-center">{usuario.usuario}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => toggleDropdown(usuario._id)} className="text-white rounded-lg">
                                                    {usuario.estado ? (
                                                        <div className='bg-emerald-200 px-2 py-1 text-emerald-800 rounded-md w-full hover:bg-emerald-500'>Activo</div>
                                                    ) : (
                                                        <div className='bg-red-500 px-2 py-1  w-full min-w-20 rounded-md'>Inactivo</div>
                                                    )}
                                                </button>

                                                {openDropdownId === usuario._id && (
                                                    <div ref={dropdownRef} className="absolute bg-white rounded-lg shadow-lg mt-2 z-10">
                                                        <ul className="py-2 text-sm text-gray-700">
                                                            {!usuario.estado ? (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(usuario._id, true)} className="block px-4 py-2 hover:bg-gray-100 w-full">Activar <i className="fa-solid fa-arrow-up"></i></button>
                                                                </li>
                                                            ) : (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(usuario._id, false)} className="block px-4 py-2 hover:bg-gray-100 w-full">Desactivar <i className="fa-solid fa-arrow-down"></i></button>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <i onClick={() => eliminar_usuario(usuario._id)} className="fa-solid fa-trash-can text-red-500 text-5xl  hover:text-cyan-400"></i>
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

export default Crud_usuario;
