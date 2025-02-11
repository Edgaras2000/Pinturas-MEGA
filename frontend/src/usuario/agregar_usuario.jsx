import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const url = 'http://localhost:8000/pintura/';

const AgregarUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const estado = true;

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const agregar = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, {
        nombre,
        correo,
        telefono,
        usuario,
        contraseña,
        estado
      });

      Swal.fire({
        icon: 'success',
        title: '¡Usuario creado!',
        text: 'El usuario ha sido creado con éxito',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario duplicado',
          text: error.response.data.message || 'El usuario ya está registrado.',
          confirmButtonText: 'Cerrar',
        });
      } else {

        setError(error.message || 'Ha ocurrido un error');

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el usuario. Inténtalo de nuevo.',
          confirmButtonText: 'Cerrar',
        });
      }
      }
    };

    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/img/color.jpg')" }}>
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-3xl ring-2 ring-white">
          <h1 className="text-2xl text-white mb-6 text-center">Crear nuevo usuario</h1>

          <form onSubmit={agregar} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="nombre" className="text-white mb-1 text-left">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full p-3 border text-black border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400  duration-200 transition-all"
                placeholder="Ingresa el nombre"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="correo" className="text-white mb-1 text-left">Correo electrónico:</label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-cyan-500 focus:bg-cyan-100 focus:ring-2 focus:ring-cyan-500  duration-200 transition-all"
                placeholder="Ingresa el correo"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="usuario" className="text-white mb-1 text-left">Nombre de usuario:</label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400  duration-200 transition-all"
                placeholder="Ingresa el nombre de usuario"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="telefono" className="text-white mb-1 text-left">Teléfono:</label>
              <input
                type="text"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-cyan-500 focus:bg-cyan-100 focus:ring-2 focus:ring-cyan-500  duration-200 transition-all"
                placeholder="Ingresa el teléfono"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="contraseña" className="text-white mb-1 text-left">Contraseña:</label>
              <input
                type="password"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400  duration-200 transition-all"
                placeholder="Ingresa la contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-red-500 duration-200 transition-all font-semibold shadow-xl"
            >
              Crear usuario
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="text-center mt-4">
              <Link to="/login" className="text-red-600 hover:underline">
                ¿Ya tienes una cuenta ? Inicia sesion
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AgregarUsuario;
