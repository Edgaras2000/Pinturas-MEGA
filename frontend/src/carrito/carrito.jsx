import { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../login/navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  initMercadoPago('TEST-dad5c5b4-481f-4866-a939-26989963611f');

  
  const [carrito, setCarrito] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState(null);
  const [pagos, setpagon] = useState(false);
  const [tarjeta, settarjeta] = useState('');
  const [direcciones, setdirecciones] = useState([]);

  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState('');
  const [direccionseleccionada, setdireccionseleccionada] = useState('');

  const [preciot, setpreciot] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setTarjetaSeleccionada(e.target.value);

  };


  const handleChange2 = (e) => {
    setdireccionseleccionada(e.target.value);

  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIdUsuario(decodedToken._id);
    }
  }, []);

  useEffect(() => {
    if (idUsuario) {
      llenar_carrito();
      todas_tarjetas();
      todas_direcciones();
    }
  }, [idUsuario]);

  useEffect(() => {
    if (carrito.length > 0) {
      handlePayments();
    }
  }, [JSON.stringify(carrito)]);





  const llenar_carrito = async () => {
    const url = `http://localhost:8000/pintura/carrito/todo/${idUsuario}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      if (response.status === 200 && response.data && response.data.length > 0) {
        setCarrito(response.data);
      } else {
        setCarrito([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("El carrito no fue encontrado para el usuario especificado.");
        setCarrito([]);
      } else {
        console.error("Error loading carrito:", error);
        Swal.fire("Error", "No se pudo cargar el carrito", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (index, value) => {
    const newQuantity = Math.max(1, Math.min(value, carrito[index].stock));
    const newCarrito = [...carrito];
    newCarrito[index].cantidad_carrito = newQuantity;
    setCarrito(newCarrito);


    const url2 = `http://localhost:8000/pintura/carrito/actualizar`;
    try {
      await axios.post(url2, {
        id_producto: newCarrito[index].id_producto,
        id_usuario: idUsuario,
        cantidad_carrito: newQuantity,
      });
    } catch (error) {
      console.error("Error updating carrito quantity:", error);
      await axios.post(url2, {
        id_producto: newCarrito[index].id_producto,
        id_usuario: idUsuario,
        cantidad_carrito: 1,
      });
      llenar_carrito();
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad_carrito, 0).toFixed(2);
  };

  const url7 = `http://localhost:8000/pintura/deseados/agregar/`;

  const Deseados = async (id_producto, id_usuario) => {
    try {
      if (!id_usuario) {
        Swal.fire({
          icon: "question",
          title: "No tienes una sesión iniciada",
          footer: '<a href="/register">Debes crear una cuenta</a>',
        });
      } else {
        await axios.post(url7, { id_producto, id_usuario });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto agregado a la lista de deseados",
          showConfirmButton: false,
          timer: 1500,
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

  const handlePayments = async () => {
    const totalActualizado = calcularTotal(); // Asegúrate de recalcular aquí.
    const url = 'http://localhost:8000/pago/mercado_pago';
    try {
      const response = await axios.post(url, {
        id_usuario: idUsuario,
        total: totalActualizado, // Usa el total actualizado aquí.
      });
      const { id } = response.data;
      setPaymentId(id);
      return id;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar el pago.",
      });
    }
  };
  




  const cambiar = () => {
    setpagon(!pagos)

  }

  const todas_tarjetas = async () => {
    const url4 = `http://localhost:8000/pintura/opciones/tarjeta/todo/${idUsuario}`;
    try {
      const todas_tarjetass = await axios.get(url4);
      settarjeta(todas_tarjetass.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {

        settarjeta([]);
      } else {
        console.error('Error fetching directions:', error);
      }
    }
  };




  const todas_direcciones = async () => {

    const url2 = `http://localhost:8000/pintura/opciones/direccion/todo/${idUsuario}`;
    try {
      const todo_direccion = await axios.get(url2);
      setdirecciones(todo_direccion.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {

        setdirecciones([]);
      } else {
        console.error('Error fetching directions:', error);
      }
    }
  };


  const realizar_compra = async () => {
    const url10 = "http://localhost:8000/pintura/venta/agregar/";
    try {
      setLoading(true);
      await axios.post(url10, {
        id_usuario: idUsuario,
        id_metodo_pago: tarjetaSeleccionada,
        id_direccion: direccionseleccionada,
        total: calcularTotal(),
      });
      Swal.fire({
        title: 'Compra realizada',
        text: 'La compra se ha realizado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/exito1');
      });
    } catch (error) {
      console.error("Error processing purchase:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al realizar la compra',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  const nose = ()=>{
    navigate('/opciones');
  }

  const eliminar_producto = async (id_producto, id_usuario) => {
    try {
      if (!id_usuario) {
        Swal.fire({
          icon: "question",
          title: "No tienes una sesión iniciada",
          footer: '<a href="/register">Debes crear una cuenta</a>',
        });
      } else {
        await axios.post("http://localhost:8000/pintura/carrito/usuario/eliminarr/singular/caca/", {

          id_producto: id_producto,
          id_usuario: id_usuario

        }





        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto eliminado del carrito",
          showConfirmButton: false,
          timer: 1500,
        });

        llenar_carrito();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el producto a la lista de deseados.",
      });
    }
  };

  const walletButton = useMemo(() => {
    if (!paymentId) return <p>Cargando botón de pago...</p>;
  
    return (
      <Wallet
        initialization={{ preferenceId: paymentId }}
        customization={{ texts: { valueProp: "smart_option" } }}
      />
    );
  }, [paymentId]);




  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 via-sky-300 to-emerald-700 bg-[length:400%_400%] animate-gradient-x">
      <link rel="stylesheet" href="/style/carrito/style.css" />
      <div id="navbar" className="w-full bg-transparent sticky top-0 z-10">
        <Navbar />
      </div>



      <div className="w-full flex justify-center mt-4">
        <div className="w-8/12 bg-slate-300 rounded-lg shadow-4xl p-6">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <p>Cargando carrit...</p>
            </div>
          ) : (
            carrito.length > 0 ? (
              <div className="grid grid-cols-12 gap-4">
                {/* Productos en el carrito */}
                <div className="col-span-8 bg-white rounded-md shadow-md p-4 space-y-4">
                  {carrito.map((producto, index) => (
                    <div key={producto.id} className="flex bg-white p-1 rounded-md shadow-4xl h-auto">
                      <div className="flex-1  bg-gray-50 border-r-4      flex justify-center items-center">



                        {producto.tipo === "pintura" ? (

                          <img
                            style={{ backgroundColor: producto.color }}
                            src="/img/chifo sin fondo jeje.png" alt={producto.nombre} className=" w-24 h-24 bg-blue-400 ring-2 ring-black overflow-hidden rounded-full" />


                        ) : (

                          <img src={producto.url} alt={producto.nombre} className=" w-16 h-16 ring-2 ring-white overflow-hidden rounded-full" />

                        )}


                      </div>

                      <div className="flex-1.5 flex flex-row justify-between p-2 bg-gray-50 bg">
                        <div className='h-full w-9/12 text-left'>
                          <h1 className='p-2 w-full min-h-8 text-xl font-extralight'>{producto.nombre}</h1>
                          <div className='w-full flex flex-row gap-5 items-center mt-4'>
                            <p
                              onClick={() => eliminar_producto(producto.id_producto, idUsuario)}
                              className="text-emerald-400 p-2 text-xl hover:text-red-500" style={{ WebkitTextStroke: '0.3px black' }}>
                              Eliminar
                            </p>
                            <p onClick={() => Deseados(producto.id_producto, idUsuario)} className="text-emerald-400 p-2 text-xl hover:text-blue-500" style={{ WebkitTextStroke: '0.3px black' }}>
                              Guardar
                            </p>
                          </div>
                        </div>

                        <div className='h-full w-3/12 flex flex-col justify-center items-center gap-3 '>
                          <div className='flex items-center bg-white rounded-md ring-2 ring-black'>
                            <button
                              className={`bg-gray-100 rounded-l-md py-1 px-2 ${producto.cantidad_carrito === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
                              onClick={() => handleQuantityChange(index, Math.max(1, producto.cantidad_carrito - 1))}
                              disabled={producto.cantidad_carrito === 1}
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>


                            <input
                              className='w-8F text-center border-0 outline-none appearance-none bg-white'
                              type="number"
                              min="1"
                              max={producto.stock}
                              value={producto.cantidad_carrito}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                handleQuantityChange(index, isNaN(value) ? 1 : value);
                              }}
                            />
                            <button
                              className='bg-gray-300 rounded-r-md py-1 px-2 hover:bg-gray-400'
                              onClick={() => handleQuantityChange(index, Math.min(producto.stock, producto.cantidad_carrito + 1))}
                              disabled={producto.cantidad_carrito === producto.stock }
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
                          <p className='text-xs text-clip'>{producto.stock} disponibles</p>
                        </div>
                      </div>

                      <div className="flex-1.7 flex items-center justify-center bg-gray-50">
                        <h2 className='p-3'>${(producto.precio * producto.cantidad_carrito).toFixed(2)}</h2>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen del carrito */}

                <div className="col-span-4 bg-gray-100 rounded-md  p-4 flex flex-col justify-between ring-2 ring-black shadow-4xl">


                  <p className="text-gray-600">
                    Total a pagar: ${calcularTotal()}
                  </p>


                  <button
                    onClick={cambiar}
                    className={`w-full mt-4 py-2 rounded-md transition duration-200 
        ${pagos ? 'bg-white ring-2 ring-black text-black hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {pagos ? <i className="fa-solid fa-angle-up"></i> : 'Pagar con tarjeta'}
                  </button>


                  {pagos ? (
                    <div className='w-full h-auto  mt-3 ring-2 ring-emerald-800 gap-2 shadow-2xl'>

                      <h3
                        style={{
                          color: tarjetaSeleccionada ? '#34d399' : '#374151',
                          fontWeight: tarjetaSeleccionada ? 'bold' : 'bold',

                        }}
                        htmlFor="tarjeta" className='text-left text-sm font-sans pl-2'>Selecciona una tarjeta:


                        {tarjetaSeleccionada ? (
                          <i class="fa-solid fa-check text-emerald-600 text-2xl text-center"></i>

                        ) :
                          (
                            <div></div>
                          )}


                      </h3>
                      <div className=' mt-2 mb-2'>

                        <div className='flex justify-center gap-1   '>
                          <select
                            id="tarjeta"
                            value={tarjetaSeleccionada}
                            onChange={handleChange}
                            className="w-9/12 shadow-md px-4 mr-1 py-2 border-2 border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="" className="text-gray-500 text-center">
                              -- tarjeta --
                            </option>
                            {tarjeta.map((tarjeta) => (
                              <option
                                key={tarjeta._id}
                                value={tarjeta._id}
                                className="text-emerald-700"
                              >
                                **** **** **** {tarjeta.numero.slice(-4)}
                              </option>
                            ))}
                          </select>
                          {tarjetaSeleccionada && (
                            <div className=' flex  justify-center mt-2 bg-white w-12 h-8 rounded-md ring-2 ring-emerald-400'>

                              <div className='w-auto h-auto'>



                                <h3 className='text-center'><i class="fa-regular fa-credit-card"></i></h3>
                              </div>





                            </div>
                          )}


                        </div>




                        {direcciones.length > 1 ? (

                          <div className='w-full overflow-hidden p-2'>
                            <h3
                              style={{
                                color: direccionseleccionada ? '#34d399' : '#374151',
                                fontWeight: direccionseleccionada ? 'bold' : 'bold',

                              }}
                              htmlFor="tarjeta" className='text-left text-sm font-sans pl-2 pb-1'>Selecciona una Direccion:


                              {direccionseleccionada ? (
                                <i class="fa-solid fa-check text-emerald-600 text-2xl text-center"></i>

                              ) :
                                (
                                  <div></div>
                                )}


                            </h3>
                            <select
                              className="overflow-hidden text-center w-11/12 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              id="direccion"
                              value={direccionseleccionada}
                              onChange={handleChange2}
                            >
                              <option value="" className="text-emerald-500-500">-- dirección --</option>
                              {direcciones.map((direccionn) => (
                                <option
                                  key={direccionn._id}
                                  value={direccionn._id}
                                  className="text-gray-700"
                                >
                                  {direccionn.direccion.slice(2)}
                                </option>
                              ))}
                            </select>






                            {direccionseleccionada && tarjetaSeleccionada ? (

                              <button className='w-11/12 ng-bg-yellow-400 mt-4 bg-green-500 p-3 rounded-md shadow-lg' onClick={realizar_compra}>realizar compra <i class="fa-solid fa-money-bill-1-wave"></i> </button>
                            ) : (
                              <div></div>

                            )}



                          </div>



                        ) : (
                          <div>
                            <h3 onClick={nose}>no tienes direcciones</h3>
                            <a  className='text-lg' href="/opciones">crear direccion</a>

                          </div>
                        )}






                      </div>
                    </div>


                  ) : (
                    <div></div>

                  )}



                  <div>
              
                    {walletButton}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80">
                <lord-icon
                  src="https://cdn.lordicon.com/ggirntso.json"
                  trigger="loop"
                  style={{ width: '150px', height: '150px' }}
                ></lord-icon>
                <h1 className="text-2xl font-semibold text-gray-700 mt-4">
                  Agrega productos para poder realizar una compra
                </h1>
              </div>
            )
          )}
        </div>
      </div>
    </div >
  );
};

export default Carrito;
