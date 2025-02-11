import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const url = 'http://localhost:8000/pintura/'; // Asegúrate de que la URL sea correcta

const Tabla_usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(url);
      setUsuarios(response.data);
      console.log('Los datos son:', response.data); // Verifica lo que se recibe
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const eliminar_usuario = async (id) => {
    await axios.delete(`${url}${id}`);

    Swal.fire({
      icon: 'success',
      title: '¡Usuario eliminado!',
      text: 'El usuario ha sido eliminado con éxito',
      confirmButtonText: 'OK',
    }).then(() => {
      fetchUsuarios();
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Usuarios</h1>

      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Correo</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="text-center border-b">
                <td className="py-2 px-4 border">{usuario.id_usuario}</td>
                <td className="py-2 px-4 border">{usuario.usuario}</td>
                <td className="py-2 px-4 border">{usuario.contraseña}</td>
                <td className="py-2 px-4 border flex justify-center space-x-4">
                  <Link
                    to={`/actualizar_usuario/${usuario._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminar_usuario(usuario._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={fetchUsuarios}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Actualizar
        </button>
        <Link
          to="/crear_usuario"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Agregar
        </Link>
      </div>
    </div>
  );
};

export default Tabla_usuarios;
