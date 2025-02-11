import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../sidebar/sidebar";
import Calificacion2 from './estrellas';

const CrudReseña = () => {
    const [buscador, setBuscador] = useState("");
    const [tamaño, settamaño] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [reseñas, setreseñas] = useState([]); // Inicializado como array

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Manejar cambio de tamaño de pantalla
    useEffect(() => {
        const obtenerTamaño = () => {
            settamaño(window.innerWidth <= 640);
        };

        obtenerTamaño();
        window.addEventListener("resize", obtenerTamaño);

        return () => {
            window.removeEventListener("resize", obtenerTamaño);
        };
    }, []);

    // Limpiar campo de búsqueda y resultados
    const limpiar = () => {
        setBuscador("");
        setreseñas([]);
    };

    // Función para llenar la tabla de reseñas con los datos filtrados
    const llenar_tabla = async () => {
        try {
            const datos = await axios.post("http://localhost:8000/pintura/resena/crud/mostrar/nose/", {
                contenido: buscador,
            });

            setreseñas(datos.data);
        } catch (error) {
            console.error("Error al obtener las reseñas:", error);
        }
    };

    // Filtrar reseñas cuando se detecte un cambio en el buscador
    useEffect(() => {
        if (buscador.trim()) {
            llenar_tabla();
        } else {
            setreseñas([]);
        }
    }, [buscador]);


    const manejarEnter = (e) => {
        if (e.key === "Enter") {
            llenar_tabla();
        }
    };
    const url5 = "http://localhost:8000/pintura/res/eliminar/";

    const eliminar_reseña = async (id_de_la_reseña) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "La reseña será eliminada",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(url5, {
                        id_reseña: id_de_la_reseña
                    });


                    Swal.fire({
                        title: "¡Se eliminó la reseña!",
                        icon: "success"
                    }).then(() => {
                        llenar_tabla();
                    });

                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar la reseña",
                        icon: "error"
                    });
                }
            }
        });
    };

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <h1 className="text-cyan-400 inline-block p-2 bg-slate-700 rounded-full shadow-2.5xl text-xl">
                reseñas
            </h1>

            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-11/12 h-5/6 bg-slate-700 rounded-lg shadow-4xl">
                    {/* Barra de búsqueda */}
                    <div className="w-full h-1/6 bg-fondo_crud rounded-t-lg flex justify-around items-center">
                        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
                            <input
                                id="buscador"
                                type="text"
                                value={buscador}
                                onChange={(e) => setBuscador(e.target.value)} // Actualizar buscador
                                onKeyDown={manejarEnter} // Detectar cuando se presiona Enter
                                placeholder="buscar reseña por contenido:"
                                className="w-full bg-gray-800 text-white rounded-full pl-10 pr-10 py-2 outline-none ring-2 ring-cyan-400 hover:ring-red-400"
                            />
                            <span className="absolute left-3 top-2 text-gray-400">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <span className="absolute right-3 top-2 text-gray-400">
                                <button onClick={limpiar}>
                                    {tamaño ? <i className="fa-solid fa-trash"></i> : "Limpiar contenido"}
                                </button>
                            </span>
                        </div>
                    </div>

                    {/* Tabla de reseñas */}
                    <div className="h-5/6 rounded-e-md bg-slate-500 overflow-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500 relative">
                        {reseñas.length > 0 ? (
                            <table id="tablachida" className="table-auto w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">

                                        <th className="px-4 py-2 text-center">Contenido</th>
                                        <th className="px-4 py-2 text-center">calificacion</th>

                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reseñas.map((sugerencia) => (
                                        <tr
                                            key={sugerencia._id}
                                            className="bg-gray-600 hover:bg-gray-500 border-t-2 border-b-2 border-gray-400"
                                        >

                                            <td className="px-4 py-2 text-center break-words max-w-xs">
                                                {sugerencia.contenido}
                                            </td>

                                            <td className="px-4 py-2 text-center  h-16 flex justify-center items-center">
                                                <Calificacion2 rating={sugerencia.calificacion} />
                                            </td>

                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => eliminar_reseña(sugerencia._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
                                                    <i className="fa-solid fa-check"></i> Eliminar
                                                </button>
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
                                <h3 className='font-semibold text-xl'>usa otro contenido de reseña</h3>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrudReseña;
