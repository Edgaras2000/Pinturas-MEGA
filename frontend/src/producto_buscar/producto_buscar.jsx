import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../login/navbar';

const Producto = () => {
  const { datos } = useParams();
  const [productos, setProductos] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [filter, setFilter] = useState('todos');
  const [maxPrice, setMaxPrice] = useState(500); // Estado para el precio máximo
  const url1 = `http://localhost:8000/pintura/producto/filtro/${datos}`;

  const traer_productos = async () => {
    try {
      const response = await axios.get(url1);
      setProductos(response.data);
      console.log('Datos obtenidos');
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    setProductos([]);
    traer_productos();
  }, [datos]);

  const handleOptionChange = (option, fil) => {
    setSelectedOption(option);
    setFilter(fil);
  };

  const filtrarVentas = () => {
    return productos.filter((venta) => {
      const matchesFilter =
        filter === 'todos' ||
        (filter === 'pintura' && venta.tipo === 'pintura') ||
        (filter === 'herramienta' && venta.tipo === 'herramienta');
      const matchesPrice = venta.precio <= maxPrice;
      return matchesFilter && matchesPrice;
    });
  };

  return (
    <div>
      <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-10">
        <Navbar />
      </div>
      {productos.length > 0 ? (
        <div className="w-full h-auto flex flex-col justify-center items-center bg-gradient-radial from-Mercado via-Mercado to-Mercado">
          <div className="w-9/12 h-auto mt-12 mb-12 grid grid-cols-3 grid-rows-1 gap-2">
            <div className="bg-white col-span-1  overflow-hidden rounded-lg text-white p-4 gap-4 flex flex-col items-center shadow-4xl">

              <div className='w-full'>
                <h1 className='text-black text-left text-3xl'> {datos}</h1>
                <h2 className=' text-black text-left'>Resultados: {productos.length}</h2>

              </div>

              <div className="mt-4 flex justify-center items-center gap-4 flex-row sticky top-4  ">
                <div
                  onClick={() => handleOptionChange('opcion1', 'herramienta')}
                  className={` items-center p-4 border rounded-lg cursor-pointer flex flex-col shadow-4xl outline-none ${selectedOption === 'opcion1' ? 'bg-slate-600 text-cyan-400 shadow-none ring-2 ring-cyan-400' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                  <span>Herramientas</span>
                </div>

                <div
                  onClick={() => handleOptionChange('opcion2', 'pintura')}
                  className={`items-center p-4 border rounded-lg cursor-pointer flex flex-col shadow-4xl outline-none ${selectedOption === 'opcion2' ? 'bg-slate-600 text-cyan-400 shadow-none' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  <i className="fa-solid fa-paint-roller"></i>
                  <span>Pinturas</span>
                </div>

                <div
                  onClick={() => handleOptionChange('opcion3', 'todos')}
                  className={` items-center p-4 border rounded-lg cursor-pointer flex flex-col shadow-4xl outline-none ${selectedOption === 'opcion3' ? 'bg-slate-600 text-cyan-400 shadow-none' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  <i class="fa-solid fa-xmark"></i>
                  <span>No filtro</span>
                </div>
              </div>


              <div className="bg-MEW-100 text-black w-full h-auto mt-6 rounded-lg p-4 ">

                <input
                  id="precio"
                  type="range"
                  min="0"
                  max="3000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full appearance-none outline-none bg-gray-300 h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                />
                <div className="text-center text-gray-700 font-medium mt-2">
                  Precio máximo: <span className="text-cyan-600 font-bold">${maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Productos Filtrados */}
            <div className="col-span-2 grid grid-cols-1 xl:grid-cols-3 gap-4">
              {filtrarVentas().map((producto) => (
                <Link
                  to={`/producto/info/${producto._id}`}
                  key={producto._id}
                  className="h-128 ring-2 ring-blue-300 hover:ring-blue-500 bg-white bg-opacity-80 backdrop-blur-lg   rounded-lg shadow-4xl flex flex-col items-center hover:scale-110 transform transition-transform duration-300 ease-out gap-4 p-4 overflow-hidden"
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
                    <h2 className="text-sm text-gray-600">Disponibles: {producto.stock}</h2>
                    {producto.litros && <p className="text-sm text-gray-500">Litros: {producto.litros}</p>}
                    <p className="text-sm text-gray-500">{producto.descripcion}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-auto flex justify-center color-change">
          <div className="w-4/5 min-h-96 h-4/6 bg-white gap-8 flex flex-col justify-center items-center">
            <div className="w-48 h-48 bg-slate-50 rounded-full ring-4 ring-black hover:ring-emerald-500 flex justify-center items-center">
              <lord-icon
                src="https://cdn.lordicon.com/wjyqkiew.json"
                trigger="loop"
                style={{ width: '80%', height: '80%' }}
              ></lord-icon>
            </div>
            <h1 className="text-2xl font-semibold">No se encontraron productos </h1>
            <h1 className="text-xl font-semibold">Intenta realizar una búsqueda diferente</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Producto;
