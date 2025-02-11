import axios from 'axios';
import {  useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Editar_producto = () => {
    const { id } = useParams();
    const [nombre, setnombre] = useState('');
    const [precio, setprecio] = useState('');
    const [descripcion, setdescripcion] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        cargarProducto();
    }, [id]);

    const cargarProducto = async () => {
        try {
            const url = `http://localhost:8000/pintura/producto/editar/${id}`;
            const { data } = await axios.get(url);
            setnombre(data.nombre);
            setprecio(data.precio);
            setdescripcion(data.descripcion);
        } catch (error) {
            console.error('Error al cargar el producto:', error);
            Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        }
    };

    const enviar_actualizacion = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:8000/pintura/producto/editar/${id}`;
            await axios.post(url, { nombre:nombre, precio:precio, descripcion:descripcion });
            Swal.fire('Actualizado', 'El producto se ha actualizado correctamente', 'success');
            navigate("/crud_producto");
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        }
    };

    return (
        <div className="w-full h-screen bg-slate-500 flex justify-center items-center flex-col">
            {id != null ? (
                <div className='w-10/12 flex justify-center items-center'>
                    <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-3xl ring-2 ring-white">
                        <h1 className="text-2xl text-white mb-6 text-center">Editar Producto</h1>

                        <form onSubmit={enviar_actualizacion} className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="nombre" className="text-white mb-1 text-left">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setnombre(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400 duration-200 transition-all"
                                    placeholder="Ingresa el nombre del producto"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="precio" className="text-white mb-1 text-left">Precio:</label>
                                <input
                                    type="number"
                                    id="precio"
                                    min={1}
                                    value={precio}
                                    onChange={(e) => setprecio(e.target.value)}
                                    required
                                    className="w-full text-center p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-cyan-500 focus:bg-cyan-100 focus:ring-2 focus:ring-cyan-500 duration-200 transition-all"
                                    placeholder="Ingresa el precio"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="descripcion" className="text-white mb-1 text-left">Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setdescripcion(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400 duration-200 transition-all"
                                    placeholder="Ingresa una descripción del producto"
                                    rows={4}
                                    maxLength={70}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-red-500 duration-200 transition-all font-semibold shadow-xl"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="bg-gray-200 w-96 h-96 rounded-full ring-4 ring-black shadow-4xl flex items-center justify-center">
                        <lord-icon
                            src="https://cdn.lordicon.com/wjyqkiew.json"
                            trigger="loop"
                            style={{ width: '80%', height: '80%' }}
                        ></lord-icon>
                    </div>
                    <h2 className="font-semibold text-3xl text-white">No se encontraron los datos deseados</h2>
                </div>
            )}
        </div>
    );
};

export default Editar_producto;
