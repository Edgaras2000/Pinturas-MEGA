import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../sidebar/sidebar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Crud_sugerencias = () => {
    const [buscador, setBuscador] = useState("");
    const [tamaño, settamaño] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sugerencias, setsugerencias] = useState([]);
    const [filter, setFilter] = useState("todos"); // Cambiar el estado del filtro
    const dropdownRef = useRef(null);
    const tableRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const limpiar = () => setBuscador("");

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
        const url = "http://localhost:8000/pintura/sugerencias/todoo/";
        try {
            const response = await axios.get(url);
            setsugerencias(response.data); // Asume que la respuesta tiene la estructura correcta
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    useEffect(() => {
        tabla_usuario();
    }, []);

    const filtrar_sugerencias = () => {
        return sugerencias.filter(usuario => {
            // Filtrar por prioridad
            if (filter === "baja") return usuario.motivo.prioridad === "baja";
            if (filter === "media") return usuario.motivo.prioridad === "media";
            if (filter === "alta") return usuario.motivo.prioridad === "alta";
            return true;
        }).filter(usuario =>
            usuario.motivo.motivo.toLowerCase().includes(buscador.toLowerCase())
        );
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

    const url = 'http://localhost:8000/pintura/sugerencias/cambiar/';

    const eliminar_sugerencia = async (id) => {

        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {

            await axios.post(`${url}${id}`);
            Swal.fire({
                icon: 'success',
                title: '¡Sugerencia finalizada!',
                text: '',
                confirmButtonText: 'OK',
            }).then(() => {
                tabla_usuario();
            });
        } else {

            Swal.fire({
                icon: 'info',
                title: 'Operación cancelada',
                text: 'No se ha eliminado la sugerencia.',
                confirmButtonText: 'OK',
            });
        }
    };


    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h1 className=' text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl'>Sugerencias</h1>


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
                            <div className="w-2/4 flex gap-3 items-start flex-col">

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="baja"
                                        checked={filter === "baja"}
                                        onChange={() => setFilter("baja")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "baja" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "baja" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "baja" ? 'cyan-400' : 'gray-400'}`}>Baja</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="media"
                                        checked={filter === "media"}
                                        onChange={() => setFilter("media")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "media" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "media" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "media" ? 'cyan-400' : 'gray-400'}`}>Media</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value="alta"
                                        checked={filter === "alta"}
                                        onChange={() => setFilter("alta")}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === "alta" ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                                        {filter === "alta" && (
                                            <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>
                                        )}
                                    </div>
                                    <span className={`text-${filter === "alta" ? 'cyan-400' : 'gray-400'}`}>Alta</span>
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

                            <button onClick={generatePDF} className='bg-cyan-500 text-black w-auto h-auto p-2 rounded-md shadow-sm shadow-cyan-500 hover:bg-magenta_caca'>
                                <i className="fa-solid fa-print text-xl"></i> Imprimir
                            </button>
                        </div>
                    </div>

                    <div ref={tableRef} className='h-5/6 rounded-e-md bg-slate-500 overflow-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 relative'>
                        {sugerencias.length > 0 ? (
                            <table id='tablachida' className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-center">Motivo</th>
                                        <th className="px-4 py-2 text-center">Contenido</th>
                                        <th className="px-4 py-2 text-center">Fecha</th>
                                        <th className="px-4 py-2 text-center">Prioridad</th>

                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrar_sugerencias().map((sugerencia) => (
                                        <tr key={sugerencia._id} className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400">
                                            <td className="px-4 py-2 text-center">{sugerencia.motivo.motivo}</td>
                                            <td className="px-4 py-2 text-center break-words max-w-xs">{sugerencia.contenido}</td>                                            <td className="px-4 py-2 text-center">{new Date(sugerencia.fecha).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-center">
                                                {sugerencia.motivo.prioridad === "bajo" ? (
                                                    <div className="w-auto h-auto p-2 bg-emerald-200 rounded-lg">
                                                        <span className="text-green-500 font-bold">Baja prioridad</span>
                                                    </div>
                                                ) : sugerencia.motivo.prioridad === "media" ? (
                                                    <div className="w-auto h-auto p-2 bg-yellow-200 rounded-lg">
                                                        <span className="text-yellow-500 font-bold">Prioridad media</span>
                                                    </div>
                                                ) : sugerencia.motivo.prioridad === "alta" ? (
                                                    <div className="w-auto h-auto p-2 bg-red-200 rounded-lg">
                                                        <span className="text-red-500 font-bold">Alta prioridad</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-auto h-auto p-2 bg-gray-200 rounded-lg">
                                                        <span className="text-gray-500 font-bold">Sin prioridad</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-2 text-center flex justify-center">


                                                <div
                                                    onClick={() => eliminar_sugerencia(sugerencia._id)}
                                                    className='w-28 h-28 rounded-full ring-2 ring-emerald-500 flex justify-center items-center 
             hover:bg-emerald-500 hover:ring-emerald-700 hover:text-white transition-all duration-300'>
                                                    <i className="fa-solid fa-check text-emerald-500 text-5xl hover:text-white"></i>
                                                </div>



                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-white">Cargando sugerencias...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Crud_sugerencias;
