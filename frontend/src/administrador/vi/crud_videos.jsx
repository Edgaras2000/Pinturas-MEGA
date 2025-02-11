import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../sidebar/sidebar';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useNavigate } from 'react-router-dom';


const Crud_videos = () => {

    const navigate = useNavigate();
    const [buscador, setBuscador] = useState("");
    const [filter, setFilter] = useState("todos");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const tableRef = useRef(null);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    const [videos, setvideos] = useState([]);


    const limpiar = () => {
        setBuscador("");
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



    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };



    const filtrarvideos = () => {
        return videos.filter(video => {
            if (filter === "activos") return video.estado;
            if (filter === "no_activos") return !video.estado;
            return true;
        }).filter(video =>
            video.titulo.toLowerCase().includes(buscador.toLowerCase())
        );
    };


    const tabla_video = async () => {


        const datos = await axios.get("http://localhost:8000/pintura/video/todo2/");
        setvideos(datos.data)

    }





    const cambiarEstado = async (id, nuevoEstado) => {
        const url2 = "http://localhost:8000/pintura/video/cambiar_estado/";

        console.log("el id es:"+id);
        console.log("el estado es:"+nuevoEstado);
        
        await axios.post(url2, {
            id_video: id,
            estado: nuevoEstado
        });

        tabla_video();
        filtrarvideos();
    };


    const eliminar_video = async (id, urls) => {
      
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás deshacer esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
    
    
        if (isConfirmed) {
            try {
                const url2 = "http://localhost:8000/pintura/video/eliminar/";
    
        
                await axios.post(url2, {
                    id_video: id,
                    url: urls
                });
    
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El video se ha eliminado correctamente.',
                    confirmButtonText: 'Aceptar'
                });
    
            
                tabla_video();
            } catch (error) {
          
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el video. Intenta nuevamente.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };
    

const agregar_video = ()=> {

    navigate("/agregar_video");

}




    useEffect(() => {
        tabla_video();
    }, [])


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

            <h1 className=' text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl'>Videos:</h1>

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
                                    Limpiar contenido
                                </button>
                            </span>
                        </div>

                        <div className='flex justify-center items-center gap-3'>
                            <div className="w-2/4 flex gap-2 items-start flex-col">
                                <label className="flex items-center gap-2 cursor-pointer">
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

                            <button onClick={agregar_video} className='bg-cyan-500 text-black w-32 h-10 rounded-md shadow-sm shadow-cyan-500 hover:bg-magenta_caca'>
                                 Agregar+
                            </button>

                            <button onClick={generatePDF} className='bg-cyan-500 text-black w-32 h-10 rounded-md shadow-sm shadow-cyan-500 hover:bg-magenta_caca'>
                                <i className="fa-solid fa-print text-xl"></i> Imprimir
                            </button>
                        </div>
                    </div>

                    <div ref={tableRef} className='h-5/6 rounded-e-md bg-slate-500 overflow-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 relative'>

                        {videos.length > 0 ? (


                            <table id='tablachida' className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-center">Miniatura</th>
                                        <th className="px-4 py-2 text-center">Nombre</th>

                                        <th className="px-4 py-2 text-center">Estado</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrarvideos().map((video) => (
                                        <tr key={video._id} className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400">
                                            <td className="px-4 py-2 text-center flex justify-center items-center">



                                                <div className='w-full h-full rounded-full flex justify-center items-center'>

                                                    <video
                                                        className="w-48 h-28 object-cover rounded-md"
                                                        src={video.url}
                                                        muted
                                                        playsInline
                                                        loop={false}
                                                        controls={false}
                                                        style={{ objectFit: "cover" }}
                                                    ></video>

                                                </div>

                                            </td>
                                            <td className="px-4 py-2 text-center">{video.titulo}</td>

                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => toggleDropdown(video._id)} className="text-white rounded-lg">
                                                    {video.estado ? (
                                                        <div className='bg-emerald-200 px-2 py-1 text-emerald-800 rounded-md w-full hover:bg-emerald-500'>Activo</div>
                                                    ) : (
                                                        <div className='bg-red-500 px-2 py-1  w-full min-w-20 rounded-md'>Inactivo</div>
                                                    )}
                                                </button>

                                                {openDropdownId === video._id && (
                                                    <div ref={dropdownRef} className="absolute bg-white rounded-lg shadow-lg mt-2 z-10">
                                                        <ul className="py-2 text-sm text-gray-700">
                                                            {!video.estado ? (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(video._id, true)} className="block px-4 py-2 hover:bg-gray-100 w-full">Activar <i className="fa-solid fa-arrow-up"></i></button>
                                                                </li>
                                                            ) : (
                                                                <li>
                                                                    <button onClick={() => cambiarEstado(video._id, false)} className="block px-4 py-2 hover:bg-gray-100 w-full">Desactivar <i className="fa-solid fa-arrow-down"></i></button>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <i onClick={() => eliminar_video(video._id, video.url)} className="fa-solid fa-trash-can text-red-500 text-5xl  hover:text-cyan-400"></i>
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

                                <h2 className='font-semibold text-3xl'>No se encontraron videos</h2>

                            </div>
                        )}


                    </div>
                </div>
            </div>






        </div>



    )




}


export default Crud_videos;