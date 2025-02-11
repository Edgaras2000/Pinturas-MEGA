import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Videos_buscar = () => {
  const [cosas, setcosas] = useState([]);
  const [buscador, setBuscador] = useState("");
  const navigate = useNavigate();

  // Función para obtener todos los videos
  const todo_video = async () => {
    const url = "http://localhost:8000/pintura/video/todo/";
    const dataos = await axios.get(url);
    setcosas(dataos.data);
  };

  useEffect(() => {
    todo_video();
  }, []);

  const limpiar = () => {
    setBuscador('');
  };

  // Filtrar los datos según el buscador
  const datos_filtro = () => {
    if (buscador !== "") {
      return cosas.filter((cosa) =>
        cosa.titulo.toLowerCase().includes(buscador.toLowerCase())
      );
    } else {
      return cosas;
    }
  };

  const ir = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div>
      <div className='w-full h-screen bg-gradient-radial from-slate-300 via-slate-300 to-white animate-gradient overflow-hidden flex flex-col items-center justify-center gap-4 relative'>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <lord-icon
            src="https://cdn.lordicon.com/qfwgmyhc.json"
            trigger="loop"
            style={{ width: '80%', height: '80%' }}
          ></lord-icon>
        </div>

        <div className="w-3/6 relative sm:w-2/6 md:w-2/6 lg:w-3/6">
          <input
            type="text"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            placeholder="¿Qué contenido estás buscando?"
            className="w-full shadow-4xl bg-white text-black rounded-full pl-10 pr-10 py-2 outline-none ring-2 ring-black hover:ring-emerald-400 placeholder-cyan-500"
          />
          <span className="absolute left-3 top-2 text-black">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <span className="absolute right-3 top-2 text-black">
            <button onClick={limpiar}>Limpiar contenido</button>
          </span>
        </div>

        
        <div className='w-10/12 h-5/6 gap-4 shadow-4xl overflow-y-auto p-4 justify-center grid grid-cols-3 auto-rows-auto bg-opacity-60 backdrop-blur-lg scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500'>
          {datos_filtro().length > 0 ? (
            datos_filtro().map((video, index) => (
              <div
                key={index}
                className="w-full bg-gray-200 rounded-lg p-2 flex flex-col gap-2 shadow-4xl hover:scale-105 transition-transform duration-300 ease-in-out hover:ring-2 hover:ring-cyan-400"
                onClick={() => ir(video._id)}
              >
                <video
                  className="w-full h-60 object-cover rounded-md"
                  src={video.url}
                  muted
                  playsInline
                  loop={false}
                  controls={false}
                  style={{ objectFit: "cover" }}
                ></video>
                <h2 className=" text-md font-bold text-gray-700 text-center">
                  {video.titulo}
                </h2>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No se encontraron resultados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos_buscar;
