import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Ventas = ({ idUsuario, correoUsuario }) => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();


  const obtenerVentas = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:8000/pintura/ventas/esta/us/${idUsuario}`);
      setVentas(respuesta.data); // Asignar datos al estado
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };


  const Cancelar = async (id, correos) => {
    
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará la venta de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      reverseButtons: true,
    });
  
    if (confirmacion.isConfirmed) {
     
      console.log("El correo es: " + correos);
      try {
        const response = await axios.post("http://localhost:8000/pintura/venta/cancelar/", {
          id_venta: id,
          t_correo: correos,
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Cancelación exitosa',
          text: 'La venta ha sido cancelada correctamente.',
          confirmButtonText: 'Aceptar',
        });
  
        obtenerVentas();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cancelar la venta. Por favor, intenta de nuevo.',
          confirmButtonText: 'Aceptar',
        });
      }
    } else {
      // Si el usuario cancela, muestra un mensaje opcional (o no hacer nada)
      Swal.fire({
        icon: 'info',
        title: 'Cancelación abortada',
        text: 'No se realizaron cambios.',
        confirmButtonText: 'Aceptar',
      });
    }
  };
  




  useEffect(() => {
    if (idUsuario) {
      obtenerVentas();
    }
  }, [idUsuario]);


  const pdf = (id) => {

    navigate(`/ticket/${id}`);
  };

  return (
    <div className="bg-white w-10/12 min-h-64 h-10/12 rounded-md ring-2 ring-black mt-3 mb-3 flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500">


      {ventas.length > 0 ? (
        <div className="w-full flex flex-col items-center gap-8 mt-3">
          {ventas.map((venta, index) => (
            <div key={index} className="w-11/12 ring-2 ring-black h-32 rounded-md shadow-4xl grid grid-cols-3 grid-rows-1">

              {/* Estado de la venta */}
              <div className="col-span-1 flex flex-col justify-center items-center">
                {venta.estado === "completado" ? (
                  <div className="bg-green-500 text-white p-4 w-6/12 text-center rounded-md ring-2 ring-black">
                    Completada
                  </div>
                ) : venta.estado === "pendiente" ? (
                  <div className="bg-yellow-500 text-white p-4 w-6/12 text-center rounded-md ring-2 ring-black">
                    Pendiente
                  </div>
                ) : venta.estado === "cancelado" ? (
                  <div className="bg-red-500 text-white p-4 w-6/12 ring-2 ring-black text-center rounded-md">
                    Cancelada
                  </div>
                ) : (
                  <p className="text-gray-500">Estado desconocido</p>
                )}
              </div>


              <div className="col-span-1 flex flex-col justify-center items-center gap-2">
                <p className="text-gray-700">
                  {new Date(venta.fecha).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, // Para formato de 24 horas
                  })}
                </p>
                {venta.estado === "pendiente" ? (


                  <p onClick={()=> Cancelar(venta._id,correoUsuario)} className='cursor-pointer text-sm text-red-500 underline hover:text-red-400 hover:no-underline'>Cancelar pedido</p>


                ) : ( 

                  <div></div>

                )}

              </div>


              <div className="col-span-1 flex flex-col justify-center items-center">


                {venta.estado === "pendiente" || venta.estado === "completado" ? (

                  <button onClick={() => pdf(venta._id)} className="bg-emerald-800 text-white p-4 w-6/12 text-center rounded-md  shadow-4xl">
                    Imprimir Ticket
                  </button>

                ) : (
                  <div></div>
                )}


              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className=' h-full w-full flex flex-col justify-center items-center gap-4'>
          <div className='w-auto h-auto  rounded-full p-5 bg-gray-200 ring-8 ring-black'>


            <lord-icon
              src="https://cdn.lordicon.com/dkobpcrm.json"
              trigger="loop"
              style={{ width: '200px', height: '200px' }}
            />

          </div>
          <h1 className='text-2xl font-semibold'>Aun no haz realizado compras</h1>



        </div>
      )}
    </div>
  );
};

export default Ventas;
