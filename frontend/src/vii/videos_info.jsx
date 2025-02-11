import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Videos_info = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  // Cargar los detalles del video al cargar el componente
  useEffect(() => {
    traer_video();
    

  }, [id]);

 
  const traer_video = async () => {
    const url = `http://localhost:8000/pintura/video/traer/singular/${id}`;
    try {
      const datos = await axios.get(url);
      setVideo(datos.data);
      setHasLiked(datos.data.userHasLiked); // Suponiendo que el backend indica si el usuario ya ha dado like
    } catch (error) {
      console.error(error);
    }
  };


  const like = async () => {
    const url = hasLiked
      ? "http://localhost:8000/pintura/video/likes/restar/"
      : "http://localhost:8000/pintura/video/likes/sumar/";

    try {
      await axios.post(url, { id: video._id });
      setVideo((prevVideo) => ({
        ...prevVideo,
        me_gusta: hasLiked ? prevVideo.me_gusta - 1 : prevVideo.me_gusta + 1,
      }));
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error(error);
    }



   





  };

  useEffect(() => {
    let yaSumoVisita = false;
  
    if (!yaSumoVisita) {
      visitas();
      yaSumoVisita = true;
    }
  }, [id]);
  

  const visitas = async () => {
    const url = `http://localhost:8000/pintura/video/sumar/`;
    try {
      const datos = await axios.post(url,{id:id}
      );

    } catch (error) {
      console.error(error);
    }
  };


  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!video) return <div>Cargando...</div>;
  return (
    <div>
      <div className="w-full h-screen bg-gradient-radial from-cyan-500 via-emerald-500 to-white animate-gradient flex justify-center items-center">
        <div className="w-8/12 h-auto min-w-[14rem] min-h-[50rem] bg-white bg-opacity-60 backdrop-blur-lg shadow-4xl overflow-hidden flex flex-col items-center">
          <h1 className="p-4 text-left text-3xl w-full">
            {video.titulo}
          </h1>
          <p className="text-right p-2 w-full text-sm font-inter">
            Fecha de subida: {formatearFecha(video.fecha)}
          </p>

          <div className="w-full h-auto p-4">
            {video.url ? (
              <video className="shadow-4xl" width="100%" height="auto" controls>
                <source src={video.url} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <p className="text-center text-gray-500">
                Video no disponible.
              </p>
            )}
          </div>

          <div className="w-full h-auto flex flex-row gap-4 items-center p-4">
            <p className="font-inter text-xl">
              {video.vistas} Vistas
            </p>

            <button
              onClick={like}
              className={`w-auto p-2 flex items-center gap-2 rounded-md hover:text-white bg-white shadow-md hover:ring-2 transition duration-300 ${hasLiked ? 'hover:ring-red-500' : 'hover:ring-blue-500'
                }`}
            >
              <i
                className={`fas ${hasLiked ? 'fa-thumbs-down' : 'fa-thumbs-up'
                  } text-gray-500 transition duration-300`}
              ></i>
              <span className="text-gray-700 transition duration-300">
                {video.me_gusta}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos_info;
