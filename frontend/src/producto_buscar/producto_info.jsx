import { useState, useEffect, useMemo  } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../login/navbar';
import Calificacion from './estrellas';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';


import { Filter } from 'bad-words';



const Producto_info = () => {


  const location = useLocation();

  useEffect(() => {
    // Hacer scroll hacia la parte superior de la página
    window.scrollTo(0, 0);
  }, [location]); 

  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reseñas, setReseñas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [producto, setProducto] = useState({});
  const [reseñaUsuario, setReseñaUsuario] = useState({});

  const navigate = useNavigate(); // Hook para redirigir

  const [idUsuario, setIdUsuario] = useState(null);

  const url2 = `http://localhost:8000/pintura/res/producto/${id}`;
  const url1 = `http://localhost:8000/pintura/producto/singular/${id}`;
  const url3 = `http://localhost:8000/pintura/res/usuario/${idUsuario}/${id}`;
  
  const url4 = "http://localhost:8000/pintura/post/res/";

  const url5 = "http://localhost:8000/pintura/res/eliminar/";

  const url6 = "http://localhost:8000/pintura/res/editar/";

  const url7 = "http://localhost:8000/pintura/deseados/agregar/";

  const url8 = "http://localhost:8000/pintura/carrito/agregar/";






  const [contenido, setcontenido] = useState("");
  const [contenido2, setcontenido2] = useState("");
  const [calificacion, setcalificacion] = useState("");

  const [calificacion2, setcalificacion2] = useState("");

  const producto_reseñas = async () => {
    try {
      const response = await axios.get(url2);
      const reseñasData = response.data;
      setReseñas(reseñasData);

      const totalCalificaciones = reseñasData.reduce((acc, reseña) => acc + reseña.calificacion, 0);
      const promedioCalificaciones = reseñasData.length > 0 ? (totalCalificaciones / reseñasData.length) : 0;
      setPromedio(promedioCalificaciones.toFixed(1));
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const singular = async () => {
    try {
      const dato = await axios.get(url1);
      const productoData = dato.data;
      setProducto(productoData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const resUsuario = async () => {
    try {
      const dato1 = await axios.get(url3);
      const resenna = dato1.data;
      setReseñaUsuario(resenna);
      setcontenido2(resenna.contenido); // llebnado de inputs
      setcalificacion2(resenna.calificacion);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };



  const filter = new Filter();


  filter.addWords('maldición', 'pendejo', 'imbécil', 'idiota', 'estúpido');

  const filtrarTexto = (texto) => {

    return texto.split(' ').map(palabra => {
      if (filter.isProfane(palabra)) {
        return '***';
      }
      return palabra;
    }).join(' ');
  };

  const añadir_reseña = async (e) => {
    e.preventDefault();
  
    const contenidoFiltrado = filtrarTexto(contenido);
  
   
    const loadingSwal = Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera mientras procesamos tu reseña.',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); 
      }
    });
  
    try {
      await axios.post(url4, {
        id_producto: id,
        id_usuario: idUsuario,
        contenido: contenidoFiltrado,
        calificacion: calificacion,
        puntuacion: 0,
        estado: true
      });
  
      producto_reseñas();
      resUsuario();
      
      Swal.fire({
        icon: 'success',
        title: 'Reseña Realizada',
        text: '',
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al hacer la reseña', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar la reseña',
      });
    } finally {
      loadingSwal.close(); // Cierra el SweetAlert de carga
    }
  };
  




const eliminar_reseña = async (id_de_la_reseña) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "La reseña será eliminada",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.post(url5, {
          id_reseña: id_de_la_reseña
        });

        producto_reseñas();
        resUsuario();
        setReseñaUsuario("");

        Swal.fire({
          title: "¡Se eliminó la reseña!",
          icon: "success"
        }).then(() => {
          // Recarga la página después de que el usuario cierre la alerta
          window.location.reload();
        });

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la reseña",
          icon: "error"
        });
      }
    }
  });
};

  const editar_reseña = async (id_de_la_reseña) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La reseña será modificadp",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, modificar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(url6, {
            id_reseña: id_de_la_reseña,
            contenido: contenido2,
            calificacion: calificacion2

          });

          producto_reseñas();
          resUsuario();
          setReseñaUsuario("");


          Swal.fire({
            title: "¡Se modifico la reseña!",
            icon: "success"
          });

        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo modificar la reseña",
            icon: "error"
          });
        }
      }
    });
  };


  const Deseados = async (id_producto, id_usuario) => { 
    try {
      if (!id_usuario) {
        Swal.fire({
          icon: "question",
          title: "No tienes una sesión iniciada",
          footer: '<a href="/register">Debes crear una cuenta</a>',
        });
      } else {
        const deseo = await axios.post(url7, {
          id_producto: id_producto,
          id_usuario: id_usuario,
        });

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto agregado a la lista de deseados",
          showConfirmButton: false,
          timer: 1500
        });


      }
    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el producto a la lista de deseados.",
      });
    }
  };




  useEffect(() => {
    producto_reseñas();
    singular();
    llenar_prod();
    mayor_4();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIdUsuario(decodedToken._id);
    }
  }, [id]);

  useEffect(() => {
    if (idUsuario) {
      resUsuario();
    

    }
  }, [idUsuario]);


  useEffect(() => {
   

    
    comprobar_reseña_posible();
   
  
    
    
   
   
  }, [idUsuario,producto._id]) //SI JALA QUE PEDO
  


  const [mostrarTexto, setMostrarTexto] = useState(false);


  const mostrarr = () => {
    setMostrarTexto(!mostrarTexto);
  };


  const agregar_carrito = async (nose) => {
    try {

      if (idUsuario) {
        await axios.post(url8, {

          id_usuario: idUsuario,
          id_producto: nose
        })
      } else {


        navigate("/login");
      }



      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });



    } catch (error) {

    }

  };


  const [caso, setcaso] = useState(true)

  const sumar_puntuacion = async (id) => {


    try {



      if (caso) {

        const sumar = await axios.post("http://localhost:8000/pintura/resen/sum/", {

          id_reseña: id

        });
        setcaso(!caso)
        producto_reseñas();
      } else {


        const restar = await axios.post("http://localhost:8000/pintura/resen/ress/", {

          id_reseña: id

        });
        setcaso(!caso)
        producto_reseñas();

      }

    } catch (error) {

    }






  }


  const urlprod = "http://localhost:8000/pintura/producto/azar/";

  const [prod, setprod] = useState([])


  const llenar_prod = async () => {


    const cosaaaaa = await axios.get(urlprod)

    setprod(cosaaaaa.data)


  }



  const reducir = useMemo(() => {
    const pinturasAleatorias = [...prod].sort(() => Math.random() - 0.5);
    return pinturasAleatorias.slice(0, 4);
  }, [prod]);



  const redirigir = (id) => {
    navigate(`/producto/info/${id}`, { replace: true });  
    window.location.reload();  
  };
  



  const [mayo, setmayo] = useState([])

  const mayor_4 = async () => {

    try {

      const mayor = await axios.get("http://localhost:8000/pintura/producto/promedio/dos/")

      setmayo(mayor.data)

    } catch (error) {

    }



  }
  const reducir2 = () => {

    const pinturasFiltradas = mayo.filter(
      pintura => pintura.sumaCalificaciones / pintura.totalCalificaciones >= 4
    );


    const pinturasAleatorias = pinturasFiltradas.sort(() => Math.random() - 0.5);


    const pinturasSeleccionadas = pinturasAleatorias.slice(0, 4);

    return pinturasSeleccionadas;
  };



  const [reseña_comprobar, setreseña_comprobar] = useState(null)



  const comprobar_reseña_posible = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pintura/usuario/producto/saber/${idUsuario}/${producto._id}`);
      const datosVenta = response.data;
      
      
      const productoAdquirido = datosVenta.venta?.productos.some(p => p.id_producto === producto._id);
      
      setreseña_comprobar({
        adquirido: productoAdquirido,
        detalles: datosVenta.venta, // Puedes guardar detalles si los necesitas
      });
    } catch (error) {
      console.error('Error al comprobar la reseña:', error);
    }
  };
  
  

  return (
    <div>
      <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-10">
        <Navbar />
      </div>
 
      <div className="w-full h-auto bg-mercado flex flex-col justify-center items-center">
        <div className="bg-white w-8/12 h-5/6 overflow-hidden grid grid-cols-3 grid-rows-1 mt-10 mb-14 rounded-md shadow-4xl">
          <div className="col-span-2 flex justify-center items-center ">
            {producto && producto.color ? (
              <img
                className="w-5/6 h-5/6 cursor-pointer rounded-md ring-4 ring-black shadow-4xl"
                src="/img/chifo sin fondo jeje.png"
                alt="Producto"
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: producto.color }}
              />
            ) : (
              <img
                className="w-5/6 h-5/6 cursor-pointer shadow-4xl rounded-md ring-4 ring-black"
                src={producto.url}
                alt="Producto"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>

          <div className='col-span-1 gap-2 m-4 overflow-hidden rounded-lg shadow-2.5xl '>
            <div id='deseados' className='text-right' >
              <button className="text-boton_azul_letra hover:text-cyan-500" onClick={() => Deseados(id, idUsuario)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            <div id='datos' className='w-full h-auto'>
              <div className='w-full h-auto text-2xl text-left p-1'>
                <h1 className='ml-2 font-sans text-4xl '>{producto.nombre}</h1>

                <div id='calificacion' className='w-full h-auto flex mt-6'>
                  <h3 className='ml-2'>{promedio}</h3>
                  <Calificacion rating={parseFloat(promedio)} />
                  <h3>({reseñas.length})</h3>
                </div>

                <div id='precio' className='w-full h-auto min-h-80 space-y-4 space-x-2 mt-6'>
                  <h3 className='text-4xl font-sans'>  -${producto.precio}.00</h3>
                  <h3>stock: {producto.stock}</h3>
                  {producto && producto.stock > 1 ? (
                    <p className='text-emerald-500'>Disponible</p>
                  ) : (
                    <p className='text-red-500'>Agotado</p>
                  )}
                  {producto && producto.litros && <h3>litros: {producto.litros}</h3>}
                  <h3  className='text-lg text-wrap break-words'>{producto.descripcion}</h3>
                </div>

                <div className='mt-2 flex justify-center items-center'>
                  {producto && producto.stock > 1 ? (
                    <button className='w-11/12 h-10 bg-boton_azul rounded-md shadow-xl hover:bg-emerald-100 transition-all duration-200 mb-4'>
                      <p className='text-boton_azul_letra w-full h-full hover:text-emerald-500' onClick={() => agregar_carrito(producto._id)}>Agregar al carrito</p>
                    </button>
                  ) : (
                    <p className='text-black w-full h-full hover:text-red-500'>No disponible</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='reseñas' className='w-3/5'>

          { idUsuario && reseña_comprobar?.adquirido ? (
            <div className=''>
            <div className='text-left p-2 text-2xl'>
            <h2 className='font-sans'>Ya compraste este producto anteriormente </h2>
            <hr className='border-t-1 border-gray-400' />
          </div>
            <div className='bg-white flex flex-col w-full  rounded-md  ring-4 ring-black mb-8 shadow-4xl'>
              {reseñaUsuario && reseñaUsuario.contenido ? (





                <div className='text-white'>
                  <h2 className='text-sky-700'>Reseñas del usuario</h2>
                  <div className="col-span-4 grid grid-cols-3 gap-4 m-4 p-4    flex justify-around items-center rounded-md ">
                    <div className="flex justify-center items-center gap-2 overflow-hidden col-span-1">

                      <div className="mb-4">
                        <label className="block mb-2 text-black">Puntuación:</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fa-star cursor-pointer ${calificacion2 >= star ? 'fa-solid text-emerald-500' : 'fa-regular text-gray-300'
                                }`}
                              onClick={() => setcalificacion2(star)}
                            ></i>
                          ))}
                        </div>
                      </div>



                    </div>
                    <div className="p-3 text-left space-y-4  col-span-2">

                      <div className="relative">

                        <input
                          type="text"
                          name="contenido"
                          value={contenido2}
                          onChange={(e) => setcontenido2(e.target.value)}
                          className="w-full shadow-4xl p-2 pl-10 mb-4 border rounded  text-black outline-none focus:shadow-4xl ring-2 ring-emerald-800 hover:ring-emerald-500"
                          placeholder="Escribe tu experiencia"
                          required
                        />
                        <span className="absolute left-3 transform translate-y-1/3 text-black">
                          <i class="fa-solid fa-file-lines"></i>
                        </span>
                      </div>


                    </div>
                  </div>
                  <div className='w-full flex justify-around items-center'>



                    {reseñaUsuario.contenido !== contenido2 ? (

                      <button className='bg-cyan-700 rounded-md p-3 mb-2' onClick={() => editar_reseña(reseñaUsuario._id)}>Editar</button>


                    ) : (
                      <div></div>

                    )}

                    <button className='bg-red-700 rounded-md p-3 mb-2' onClick={() => eliminar_reseña(reseñaUsuario._id)}>Eliminar</button>
                  </div>
                </div>




              ) : (
                <div className=' flex flex-col h-auto'>
                  <h1>OOPS...</h1>
                  <h2>No has reseñado este producto.</h2>
                  <div>

                    <button
                    className='hover:bg-sky-200 rounded-lg text-center mb-1'
                     onClick={mostrarr}>
                      <lord-icon
                        src="https://cdn.lordicon.com/rwtswsap.json"
                        trigger="hover"
                        style={{ width: '3rem', height: '3rem' }}
                      ></lord-icon>
                    </button>
                  </div>

                  {mostrarTexto && (
                    <div className=' flex justify-center items-center '>

                      <div>


                        <form onSubmit={añadir_reseña} className='flex justify-around items-center gap-8'>
                          <div className="relative">
                            <label className="block mb-2 text-black">Danos tu opinion:</label>
                            <input
                              type="text"
                              name="contenido"
                              value={contenido}
                              onChange={(e) => setcontenido(e.target.value)}
                              className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                              placeholder="Escribe tu experiencia"
                              required
                            />
                            <span className="absolute left-3 transform translate-y-1/3 text-black">
                              <i class="fa-solid fa-file-lines"></i>
                            </span>
                          </div>

                          <div className="mb-4">
                            <label className="block mb-2 text-black">Puntuación:</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`fa-star cursor-pointer ${calificacion >= star ? 'fa-solid text-boton_azul_letra' : 'fa-regular text-gray-300'
                                    }`}
                                  onClick={() => setcalificacion(star)}
                                ></i>
                              ))}
                            </div>
                          </div>

                          {contenido && calificacion >= 1 ? (
                            <button
                              type="submit"
                              className="p-2 bg-emerald-700 text-white w-auto h-9 rounded-md 
                                       hover:bg-emerald-600 hover:shadow-[0_0_15px_4px_rgba(16,185,129,0.8)] 
                                       transition duration-300 ease-in-out 
                                       focus:outline-none focus:ring-4 focus:ring-emerald-500 
                                       animate-neon">
                              reseñar
                            </button>

                          ) : (
                            <div></div>
                          )}



                        </form>


                      </div>

                    </div>
                  )}



                </div>

              )}
            </div>
            </div>
          ) : (

            <div>

            </div>
          )}


          <div className="overflow-hidden rounded-md  mb-2 bg-white">
            <div className="w-full h-auto grid grid-cols-4 grid-rows-1">

              {reseñas.map((reseña, index) => (
                <div key={index} className="col-span-4 grid grid-cols-4 gap-4 m-4 p-4 shadow-2.5xl hover:bg-slate-100">
                  <div className="col-span-1 flex justify-center items-center gap-2 overflow-hidden">
                    <h2>({reseña.calificacion})</h2><Calificacion rating={reseña.calificacion} />
                  </div>
                  <div className="col-span-3 p-3 text-left space-y-4">
                    <p>{reseña.contenido}</p>
                    <div className='flex gap-5 hover:text-blue-600'>
                      {idUsuario ? (
                        idUsuario === reseña.id_usuario ? (
                          <div></div>
                        ) : (
                          <button
                            onClick={() => sumar_puntuacion(reseña._id)}
                            className='ring-2 hover:ring-blue-600 rounded-2xl p-1'>
                            <i className="fa-regular fa-thumbs-up mr-2"> {reseña.puntuacion} </i>
                          </button>
                        )
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>





        <div className='w-10/12 h-auto p-2 mt-6 mb-8'>
          <div className='text-left p-2 text-2xl'>
            <h2 className='font-sans'>Productos similares</h2>
            <hr className='border-t-1 border-gray-400' />
          </div>
          <div className='w-full h-auto p-2 flex flex-row justify-around flex-wrap mt-6 mb-8 gap-3'>
            {reducir.map((producto) => (
              <div
                onClick={() => redirigir(producto._id)}
                key={producto._id}
                className="w-60 h-96 hover:ring-blue-500 bg-white bg-opacity-80 backdrop-blur-lg rounded-lg shadow-lg flex flex-col items-center hover:scale-110 transform transition-transform duration-300 ease-out gap-4 p-4 overflow-hidden"
              >
                <div className="w-full h-2/5 rounded-lg overflow-hidden shadow-md">
                  {producto.tipo === 'herramienta' ? (
                    <img
                      src={producto.url}
                      alt={producto.nombre}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: producto.color }}
                    >
                      <img
                        src="/img/chifo sin fondo jeje.png"
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <hr className="w-full border-t-2 border-gray-300 my-2" />
                <div className="w-full text-left rounded-lg p-2 space-y-1 overflow-hidden">
                  <h2 className="text-sm font-semibold text-gray-700 break-words truncate">
                    {producto.nombre}
                  </h2>
                  <h2 className="text-lg font-bold text-emerald-800 animate-colorFade">
                    ${producto.precio}
                  </h2>
                  <h2 className="text-sm text-gray-600 truncate">
                    Disponibles: {producto.stock}
                  </h2>
                  {producto.litros && (
                    <p className="text-xs text-gray-500 truncate">
                      Litros: {producto.litros}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 truncate">
                    {producto.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>






        {mayor_4 ? (
          <div className='w-10/12 h-auto   p-2  mt-6 mb-8 '>

            <div className='text-left p-2  text-2xl '>

              <div className='flex flex-row gap-4'>
                <h2 className='font-sans'>Con 4 estrellas o mas</h2>
                <Calificacion rating={parseFloat(4)} />
              </div>

              <hr className='border-t-1 border-gray-400' />
            </div>
            <div className='w-full h-auto   p-2 flex flex-row justify-around mt-6 mb-8 '>
              {reducir2().map((producto) => (
                <div
                  onClick={() => redirigir(producto._id)}
                  key={producto._id}
                  className="h-128  hover:ring-blue-500 bg-white bg-opacity-80 backdrop-blur-lg   rounded-lg shadow-4xl flex flex-col items-center hover:scale-110 transform transition-transform duration-300 ease-out gap-4 p-4 overflow-hidden"
                >
                  <div>
                    {producto.tipo === 'herramienta' ? (
                      <div className="w-full h-56 rounded-lg overflow-hidden shadow-md">
                        <img src={producto.url} alt={producto.nombre} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-56 rounded-lg overflow-hidden shadow-md"
                        style={{ backgroundColor: producto.color }}
                      >
                        <img src="/img/chifo sin fondo jeje.png" alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                  <hr className="w-full border-t-2 border-gray-300 my-2" />
                  <div className=" w-full text-left rounded-lg p-4 space-y-2  overflow-hidden hover:text-blue-500">
                    <h2 className="text-xl font-semibold text-gray-700 break-words">{producto.nombre}</h2>
                    <h2 className="text-lg font-bold text-emerald-800 animate-colorFade">${producto.precio}</h2>
                    <Calificacion rating={parseFloat((producto.sumaCalificaciones) / (producto.totalCalificaciones))} />
                    <h2 className="text-sm text-gray-600">Disponibles: {producto.stock}</h2>
                    {producto.litros && <p className="text-sm text-gray-500">Litros: {producto.litros}</p>}
                    <p className="text-sm text-gray-500">{producto.descripcion}</p>
                  </div>
                </div>
              ))}

            </div>

          </div>
        ) : (

          <div>

          </div>

        )


        }





      </div>





      
    </div>
  );
};

export default Producto_info;