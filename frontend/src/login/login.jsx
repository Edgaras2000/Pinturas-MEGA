import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const url = 'http://localhost:8000/pintura/login';
const googleClientId = '795680348983-va7rs9m007c15nh1t6lo9b57jji14ks6.apps.googleusercontent.com';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, { usuario, contraseña });
      const { token, tipo } = response.data; 

      localStorage.setItem('token', token);
      Swal.fire('Login exitoso', 'Bienvenido', 'success');

     
      if (tipo === 'admin') {
        navigate('/estadisticas');
      } else {
        navigate('/principal');
      }
    } catch (error) {
      Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
    }
};

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const googleResponse = await axios.post(`${url}/google`, {
        tokenId: credentialResponse.credential,
      });
      const { token } = googleResponse.data;
      localStorage.setItem('token', token);
      Swal.fire('Login exitoso con Google', 'Bienvenido', 'success');
      navigate('/principal');
    } catch (error) {
      Swal.fire('Error', 'Error en el inicio de sesión con Google', 'error');
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="w-full h-screen flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/img/color.jpg')" }}>
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-3xl ring-2 ring-white">
          <h1 className="text-2xl text-white mb-6 text-center">Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="usuario" className="text-white mb-1 text-left">Nombre de usuario:</label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-yellow-400 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-400 duration-200 transition-all"
                placeholder="Ingresa tu usuario"
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
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 outline-none hover:ring-4 hover:ring-cyan-500 focus:bg-cyan-100 focus:ring-2 focus:ring-cyan-500 duration-200 transition-all"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-red-500 duration-200 transition-all font-semibold shadow-xl"
            >
              Iniciar sesión
            </button>

            <div className="text-center mt-4">
              <Link to="/register" className="text-indigo-600 hover:underline">
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => Swal.fire('Error', 'Error en el inicio de sesión con Google', 'error')}
              useOneTap
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
