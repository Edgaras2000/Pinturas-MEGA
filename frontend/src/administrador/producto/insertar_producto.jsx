import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Insertar_Producto = () => {
  const [tipoProducto, setTipoProducto] = useState('');
  const [imagenPrevia, setImagenPrevia] = useState('/img/herramienta_placeholder.png');
  const formDatas = new FormData();

  const mostrar_img = (e) => {
    const file = e.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      setImagenPrevia(URL.createObjectURL(file)); 
      formDatas.append('imagen', file); 
    }
  };

  const [formData, setFormData] = useState({
    color: '',
    nombre: '',
    stock: '',
    Descripcion: '',
    precio: '',
    Litros: '',
    nombreHerramienta: '',
    Precio_herramienta: '',
    cantidadHerramienta: '',
    Descripcion2: '',
  }); // Estado para los datos del formulario
  const navigate = useNavigate();
  const url1 = "http://localhost:8000/pintura/producto/pintura";
  const url2 = "http://localhost:8000/pintura/producto/herramienta";

  const agregar_pintura = async (e) => {
    e.preventDefault();

    try {
      await axios.post(url1, {
        nombre: formData.nombre,
        precio: formData.precio,
        descripcion: formData.Descripcion,
        stock: formData.stock,
        litros: formData.Litros,
        tipo: "pintura",
        color: formData.color,
        estado: true,
        imagen:imagenPrevia
      });

      console.log('PINTURA CREADA');

      Swal.fire({
        icon: 'success',
        title: '¡PINTURA AÑADIDA!',
        text: 'LA PINTURA HA SIDO AÑADIDA CORRECTAMENTE',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/crud_producto');
      });
    } catch (error) {
      console.error(error);
    }
  };

 const agregar_herramienta = async (e) => {
  e.preventDefault();

  const formDatas = new FormData();

  // Suponiendo que estos son los estados que manejan los valores del formulario
  formDatas.append('nombre', formData.nombreHerramienta); 
  formDatas.append('precio', formData.Precio_herramienta); 
  formDatas.append('descripcion', formData.Descripcion2); 
  formDatas.append('stock', formData.cantidadHerramienta); 
  formDatas.append('tipo', "herramienta");


  // Aquí se agrega el archivo directamente desde el estado
  const file = document.querySelector('input[type="file"]').files[0];
  if (file) {
    formDatas.append('imagen', file); 
  }

  try {
     await axios.post(url2, formDatas, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
      timeout: 30000 
    });

    console.log('HERRAMIENTA CREADA');

    Swal.fire({
      icon: 'success',
      title: '¡HERRAMIENTA AÑADIDA!',
      text: 'LA HERRAMIENTA HA SIDO AÑADIDA CORRECTAMENTE',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/crud_producto');
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al agregar la herramienta',
    });
  }
};

  


  const handleChange = (event) => {
    setTipoProducto(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    
    <div>
      <div id='padre' className='w-full h-auto  flex justify-center items-center bg-mercado hover:bg-black hover:bg-opacity-50 transition duration-300'>
        <div className='w-10/12 h-full p-6 grid grid-cols-3 grid-rows-1 gap-2'>
          <div className='col-span-1'>
            <div className="mb-4">
              <label className="block text-black mb-2">Selecciona el tipo de producto:</label>
              <div>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    value="pintura"
                    checked={tipoProducto === 'pintura'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-black">Pintura</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="herramientas"
                    checked={tipoProducto === 'herramientas'}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-black">Herramientas</span>
                </label>
              </div>
            </div>

            {/* Mostrar formulario de Pintura */}
            {tipoProducto === 'pintura' && (
              <div id='datos_pintura' className='bg-white w-full h-6/6 p-4 rounded-lg shadow-2xl'>
                <h3 className="text-black font-bold mb-2">Añadir pintura: <i className="fa-solid fa-paint-roller"></i></h3>
                <form onSubmit={agregar_pintura}>
                  <label className="block mb-2 text-black">Nombre:</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                      placeholder="Ingresa el nombre de la pintura"
                      required
                      maxLength={40}
                    />
                    <span className="absolute left-3 top-1/3 transform -translate-y-1/2 text-black">
                      <i className="fa-solid fa-signature"></i>
                    </span>
                  </div>

                  <label className="block mb-2 text-black">Color:</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-5/12 h-24 p-2 mb-4 shadow-md"
                      placeholder="Selecciona el color"
                      required

                    />
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-7/12 p-2 mb-4 border rounded shadow-md"
                      placeholder="Ingresa el código hexadecimal"
                      maxLength={7}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-black">Precio:</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                      placeholder="Ej: 100"
                      required
                      min={0}
                    />
                    <span className="absolute left-3 transform translate-y-1/3 text-black">
                      <i className="fas fa-money-bill-alt"></i>
                    </span>
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-black">Stock:</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                      placeholder="Ingresa la cantidad en litros"
                      required
                    />
                    <span className="absolute left-3 top-1/2 transform text-black">
                      <i className="fas fa-box"></i>
                    </span>
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-black">Litros:</label>
                    <select
                      name="Litros"
                      value={formData.Litros}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                      required
                    >
                      <option value="">Selecciona la cantidad de litros</option>
                      <option value="19">19 litros</option>
                      <option value="4">4 litros</option>
                      <option value="1">1 litro</option>
                    </select>
                    <span className="absolute left-3 top-1/2 transform text-black">
                      <i className="fas fa-wine-bottle"></i>
                    </span>
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-black">Descripción:</label>
                    <input
                      type="text"
                      name="Descripcion"
                      value={formData.Descripcion}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-10 mb-4 border rounded shadow-md"
                      placeholder="Ingresa la descripción"
                      maxLength={50}
                      required
                    />
                    <span className="absolute left-3 top-1/2 transform text-black">
                      <i className="fas fa-wine-bottle"></i>
                    </span>
                  </div>

                  <button type="submit" className="bg-boton_azul text-boton_azul_letra px-4 py-2 rounded">
                    Insertar Pintura
                  </button>
                </form>
              </div>
            )}

            {/* Mostrar formulario de Herramientas */}
            {tipoProducto === 'herramientas' && (
              <div id='datos_herramientas' className='bg-white w-full h-5/6 p-4 rounded-lg shadow-2xl'>
                <h3 className="text-black font-bold mb-2">Detalles de Herramientas</h3>
                <form onSubmit={agregar_herramienta} encType="multipart/form-data">
                  <label className="block mb-2 text-black">Nombre de la Herramienta:</label>
                  <input
                    type="text"
                    name="nombreHerramienta"
                    value={formData.nombreHerramienta}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded shadow-md"
                    placeholder="Ingresa el nombre de la herramienta"
                    required
                    maxLength={30}
                  />

                  <label className="block mb-2 text-black">Precio:</label>
                  <input
                    type="number"
                    name="Precio_herramienta"
                    value={formData.Precio_herramienta}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded shadow-md"
                    placeholder="Ingresa el tipo de herramienta"
                    required
                    max={10000}
                    min={0}
                  />

                  <label className="block mb-2 text-black">Cantidad Disponible:</label>
                  <input
                    type="number"
                    name="cantidadHerramienta"
                    value={formData.cantidadHerramienta}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded shadow-md"
                    placeholder="Ingresa la cantidad disponible"
                    required
                    max={1000}
                    min={0}
                  />


                  <label className="block mb-2 text-black">Descripcion:</label>
                  <input
                    type="text"
                    name="Descripcion2"
                    value={formData.Descripcion2}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border rounded shadow-md"
                    placeholder="Descripcion de la herramienta"
                    required
                    maxLength={200}
                  />

                  <label className="block mb-2 text-black">Imagen de la Herramienta:</label>
                  <input
                    type="file"
                    name="imagenPrevia"
                    accept="image/*" // Limitar a imágenes
                    onChange={mostrar_img}
                    className="w-full p-2 mb-4 border rounded shadow-md"
                    required
                  />

                  <button type="submit" className="bg-boton_azul text-boton_azul_letra px-4 py-2 rounded">
                    Insertar Herramienta
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Vista previa del producto */}
          <div className='col-span-2 p-4 flex items-center flex-col '>
            <h3 className="text-black font-bold mb-2">Vista Previa del Producto</h3>

            {/* Vista previa para Pintura */}
            {tipoProducto === 'pintura' && (
              <div className="text-white w-5/12 h-144 overflow-hidden mt-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-200 ease-in-out bg-white">
                <div className='w-full h-3/6 rounded-xl flex justify-center items-center overflow-hidden '>
                  <img
                    src="/img/chifo sin fondo jeje.png"
                    alt=""
                    className="w-full h-full object-contain bg-red-400"
                    style={{ background: formData.color }}
                  />
                </div>
                <hr className='bg-gray-300 mt-2 border-2' />

                <div className='w-full h-6/12 text-black overflow-hidden break-words gap-2'>
                  <p><strong>Nombre: </strong>{formData.nombre || 'No especificado'}</p>
                  <p><strong>Acabado: </strong>{formData.acabado || 'No especificado'}</p>
                  <p><strong>Stock: </strong>{formData.stock || 'No especificado'}</p>
                  <p><strong>Litros: </strong>{formData.Litros || 'No especificado'}</p>
                  <p className="break-words"><strong>Descripción: </strong>{formData.Descripcion || 'No especificado'}</p>
                  <button className='w-3/4 h-8 bg-boton_azul rounded-md text-boton_azul_letra'>Botón de ejemplo</button>
                </div>
              </div>
            )}

            {/* Vista previa para Herramientas */}
            {tipoProducto === 'herramientas' && (
              <div className="text-white w-5/12 h-144 overflow-hidden mt-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-200 ease-in-out bg-white">
                <div className='w-full h-3/6 rounded-xl flex justify-center items-center overflow-hidden '>
                  <img
                    src={imagenPrevia} // Cambia la imagen según sea necesario
                    alt=""
                    className="w-full h-full object-contain"
                    v
                  />
                </div>
                <hr className='bg-gray-300 mt-2 border-2' />

                <div className='w-full h-6/12 text-black overflow-hidden break-words gap-2'>
                  <p><strong>Nombre de la Herramienta:</strong> {formData.nombreHerramienta || 'No especificado'}</p>
                  <p><strong>Tipo de Herramienta:</strong> {formData.tipoHerramienta || 'No especificado'}</p>
                  <p><strong>Precio:</strong> {formData.Precio_herramienta || 'No especificado'}</p>
                  <p><strong>Descripcion:</strong> {formData.Descripcion2 || 'No especificado'}</p>
                  <button className='w-3/4 h-8 bg-boton_azul rounded-md text-boton_azul_letra'>Botón de ejemplo</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insertar_Producto;
