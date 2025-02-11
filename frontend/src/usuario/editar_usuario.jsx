import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';




const url = 'http://localhost:8000/pintura/';

const EditarUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const { id } = useParams();
  const navigate = useNavigate(); 

  const obtenerUsuario = async () => {
    try {
      const res = await axios.get(`${url}${id}`);
      const usuarioData = res.data;

      setNombre(usuarioData.nombre);
      setCorreo(usuarioData.correo);
      setUsuario(usuarioData.usuario);
      setContraseña(usuarioData.contraseña);
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const editar = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${url}${id}`, {
        nombre,
        correo,
        usuario,
        contraseña,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Usuario editado!',
        text: 'El usuario ha sido editado con éxito',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Error editando usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al editar el usuario. Inténtalo de nuevo.',
        confirmButtonText: 'Cerrar',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

      <form onSubmit={editar} className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
            Nombre de usuario:
          </label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
            Contraseña:
          </label>
          <input
            type="password"
            id="contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Editar 
        </button>
      </form>

     
    </div>
  );
};

export default EditarUsuario;
