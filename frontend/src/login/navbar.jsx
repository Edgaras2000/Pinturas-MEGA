import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Opciones from '../opciones/Opciones';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const url = 'http://localhost:8000/pintura/';

const Navbar = ({ constante }) => {
  const [cosa, setCosa] = useState([]);
  const [buscador, setBuscador] = useState("");
  const [tamaño, settamaño] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null); // Estado para el token

  const navigate = useNavigate();

  const [imagenPrevia, setImagenPrevia] = useState('');
  const formDatas = new FormData();

  const [idUsuario, setIdUsuario] = useState(null);
  const [usuario, setusuario] = useState([])




  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const obtenerTamaño = () => {
      settamaño(window.innerWidth <= 640);
    };

    obtenerTamaño();
    window.addEventListener('resize', obtenerTamaño);



    return () => {
      window.removeEventListener('resize', obtenerTamaño);
    };
  }, []);

  const limpiar = () => {
    setBuscador("");
  };

  const resultadosFiltrados = cosa.filter(c =>
    c.usuario && c.usuario.toLowerCase().includes(buscador.toLowerCase())
  );

  const cerrarSesion = () => {
    Swal.fire({
      title: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    });
  };


  const mostrar_img = (e) => {
    const file = e.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      setImagenPrevia(URL.createObjectURL(file));
      formDatas.append('imagen', file);
    }
  };




  const deseadoss = () => {
    navigate("/deseados");
  };

  const opciones = () => {
    navigate("/opciones");
  };

  const carritoo = () => {
    navigate("/carrito");
  };

  const prin = () => {
    navigate("/principal");
  };


  const concejos = () => {
    navigate("/concejos");
  };



  useEffect(() => {


    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIdUsuario(decodedToken._id);
    }
  }, []);


  const obtenerUsuario = async () => {
    try {
      const res = await axios.get(`${url}${idUsuario}`);
      const usuarioData = res.data;
      setusuario(usuarioData);
      setImagenPrevia(usuarioData.url)

    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
    }
  };



  useEffect(() => {
    if (idUsuario) {

      obtenerUsuario()

    }
  }, [idUsuario]);




  const cambiar_fotografia = async (e) => {
    e.preventDefault();

    const file = document.querySelector('input[type="file"]').files[0];

    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'No image selected',
        text: 'Please select an image before proceeding.',
      });
      return;
    }


    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('id_usuario', idUsuario);



    Swal.fire({
      title: 'Uploading image...',
      text: 'Please wait while your image is being uploaded.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post("http://localhost:8000/pintura/imagen/user/foto/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        'Authorization': `Bearer ${token}`,
        timeout: 30000,
      });

      setImagenPrevia('');
      obtenerUsuario();  // Re-fetch user data
      Swal.fire({
        icon: 'success',
        title: 'Image uploaded',
        text: 'Your profile image has been updated successfully.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: 'There was an issue uploading your image. Please try again.',
      });
    }
  };




  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
      <link rel="stylesheet" href="/style/navbar/estilo.css" />
      <h1>{constante}</h1>

      <div className="bg-gradient-to-b from-slate-800 to-slate-700 w-full h-14 flex items-center justify-evenly overflow-hidden">
        <div className="h-8 w-1/6 cursor-pointer">
          <h1
            className="h-full w-full text-4xl italic underline underline-offset-8 
               animation-color-change text-white"
            onClick={prin}
            style={{ animation: 'colorChange 8s infinite' }}
          >
            MEGA
          </h1>
        </div>

        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
          <input
            type="text"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (buscador !== "") {
                  navigate(`/producto/${buscador || "0"}`);
                }
              }
            }}
            placeholder="¿Qué estás buscando?"
            className="w-full bg-gray-800 text-white rounded-full pl-10 pr-10 py-2 outline-none ring-2 ring-white hover:ring-red-400 placeholder-white"
          />
          <span className="absolute left-3 top-2 text-white">
            <i
              onClick={() => {
                if (buscador !== "") {
                  navigate(`/producto/${buscador || "0"}`);
                }
              }}
              className="fa-solid fa-magnifying-glass cursor-pointer"
            ></i>
          </span>
          <span className="absolute right-3 top-2 text-gray-400">
            <button onClick={limpiar}>
              {tamaño ? <i className="fa-solid fa-trash"></i> : 'Limpiar contenido'}
            </button>
          </span>
        </div>

        <div className="flex items-center space-x-4 w-1/6">
          <div>
            <button onClick={opciones}>
              <i className="fa-regular fa-user text-3xl text-white"></i>
            </button>
          </div>
          <div>
            <button onClick={deseadoss}>
              <i className="fa-regular fa-heart text-3xl text-white"></i>
            </button>
          </div>


          <div>
            <button onClick={concejos}>
              <i class="fa-brands fa-react text-3xl text-white"></i>
            </button>
          </div>

          <div>
            <button onClick={carritoo}>
              <i className="fa-solid fa-cart-shopping text-3xl text-white"></i>
            </button>
          </div>

          <button
            className="rounded-full outline-none ring-2 ring-white"
            onClick={() => setModalOpen(true)} // Abre el modal al hacer clic
          >

            {usuario.url ? (
              <div >

                <img src={usuario.url} alt="Profile" className="h-8 w-8 rounded-full overflow-hidden" />

              </div>

            ) : (
              <div>


                <img src="/img/user.jpg" alt="Profile" className="h-8 w-8 rounded-full overflow-hidden" />

              </div>

            )}


          </button>
        </div>
      </div>


      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative flex flex-col bg-gradient-to-b from-slate-800 to-slate-700 p-12 rounded-lg shadow-3xl ring-2 ring-cyan-500 max-w-md mx-auto">
            {/* Botón de cerrar modal en la esquina superior derecha */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              Cerrar
            </button>

            <i className="fa-solid fa-user text-cyan-500 mb-4 text-4xl"></i>

            {token ? (
              <div className='flex justify-center items-center flex-col gap-4'>


                <div className='w-36 h-36 rounded-full flex justify-center items-center overflow-hidden ring-2 ring-white'>
                  <img
                    src={imagenPrevia}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>

                {imagenPrevia ? (
                  <div className='text-emerald-400 flex items-center gap-2'>
                    <label className="block mb-2">Imagen subida:</label>
                    <i className="fa-solid fa-check"></i>
                  </div>
                ) : (
                  <label className="block mb-2 text-white">Subir imagen:</label>
                )}

                <form onSubmit={cambiar_fotografia} encType="multipart/form-data" className='flex justify-center items-center gap-2 flex-col'>
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={mostrar_img}
                    className="w-full p-2 border border-cyan-400 rounded-lg shadow-md text-white bg-slate-800 hover:bg-slate-700 transition duration-200 cursor-pointer"
                    required
                  />

                  {imagenPrevia ? (
                    <button type='submit' className='bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition duration-200 flex items-center gap-2'>
                      <i className="fa-solid fa-image"></i>
                      Cambiar imagen
                    </button>
                  ) : (
                    <button className='bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-200 flex items-center gap-2'>
                      <i className="fa-solid fa-upload"></i>
                      No se ha subido una imagen
                    </button>
                  )}
                </form>


                <button
                  onClick={cerrarSesion}
                  className="absolute top-4 left-4 bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition-shadow duration-200 shadow-md"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-white">No has iniciado sesión</h1>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 bg-cyan-400 text-white px-4 py-2 rounded hover:bg-cyan-500 transition duration-200"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      <div className="bg-gradient-to-b from-slate-400 to-slate-200 w-full h-8 flex items-center justify-around overflow-hidden">
        <div className="flex items-center space-x-6 text-white">


        </div>
      </div>
    </div>
  );
};

export default Navbar;
