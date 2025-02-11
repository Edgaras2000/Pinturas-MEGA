import axios from 'axios';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../login/navbar';
import Swal from 'sweetalert2';

const Sugerencias = () => {
    const [token, setToken] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [motivos, setMotivos] = useState([]); // Array para los motivos
    const [usuario, setUsuario] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }
    }, []);

    useEffect(() => {
        if (idUsuario) {
            obtenerUsuario();
            obtener_Sugerencias();
        }
    }, [idUsuario]);

    const obtener_Sugerencias = async () => {
        try {
            const datos = await axios.get("http://localhost:8000/pintura/motivos/todo/");
            setMotivos(datos.data);  // Guardar los motivos en el estado
        } catch (error) {
            console.error('Error obteniendo los motivos:', error);
        }
    };

    const obtenerUsuario = async () => {
        try {
            const url = 'http://localhost:8000/pintura/';
            const res = await axios.get(`${url}${idUsuario}`);
            setUsuario(res.data);
        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };




    const [motiv, setmotiv] = useState('');
    const [contenido, setcontenido] = useState('');




    const subir_comentario = async (e) => {
        e.preventDefault();

        try {
            const url = "http://localhost:8000/pintura/sugerencias/subir/";
            await axios.post(url, {
                id_usuario: idUsuario,
                id_motivo: motiv,
                contenido: contenido,
                correo: usuario.correo,
            });

            // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Sugerencia enviada!',
                text: 'Gracias por tu opinión, la hemos recibido.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#10B981', // Color verde
            }).then(() => {
                // Recargar la página después de cerrar la alerta
                window.location.reload();
            });
        } catch (error) {
            console.error('Error al enviar la sugerencia:', error);

            // Mostrar SweetAlert de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar tu sugerencia. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#EF4444', // Color rojo
            });
        }
    };


    return (
        <div>
            {/* Navbar */}
            <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-100">
                <Navbar />
            </div>

            {/* Video de fondo */}
            <div className="relative w-full h-screen">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/img/Color Explosion on Black Background .mp4"
                    autoPlay
                    loop
                    muted
                />
                <div className="bg-black bg-opacity-10 backdrop-blur-lg relative z-10 flex items-center justify-center h-full">
                    <div className="w-full max-w-lg bg-gray-100 bg-opacity-60 backdrop-blur-lg rounded-lg  p-8 shadow-4xl shadow-gray-800">

                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Deja tu Sugerencia</h2>
                        <form onSubmit={subir_comentario}>

                            <div className="mb-4">
                                <label htmlFor="motivo" className="block text-gray-700 font-medium mb-2">Motivo:</label>
                                <select
                                    id="motivo"
                                    name="motivo"
                                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                    onChange={(e) => setmotiv(e.target.value)} 
                                >
                                    <option value="">--Selecciona un motivo</option>
                                    {motivos.map((motivo, index) => (
                                        <option key={index} value={motivo._id}>
                                            {motivo.motivo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Sugerencia u Opinión:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Escribe tu sugerencia aquí..."
                                    required
                                    maxLength={150}

                                    onChange={(e) => {
                                        setcontenido(e.target.value); // Actualizar el estado contenido
                                        setCantidad(e.target.value.length); // Actualizar la cantidad de caracteres
                                    }}
                                ></textarea>
                            </div>

                            <h3 className='text-left'>{cantidad} de 150</h3>

                            {/* Botón de envío */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sugerencias;
