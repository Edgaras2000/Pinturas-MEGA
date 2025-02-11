import React from 'react';
import { useNavigate } from 'react-router-dom';
const Modal = ({ venta, cerrarModal }) => {

  const navigate = useNavigate();

const  ir = (id) =>{


  navigate(`/producto/info/${id}`);
}

  if (!venta) return null; // Si no hay venta seleccionada, no renderizamos nada

  
  const productos = Array.isArray(venta.productos) ? venta.productos : [];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 text-cyan-400">
      <div className="bg-gray-700 rounded-lg w-11/12 sm:w-96 p-6 shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Productos de la venta</h2>
        <button
          onClick={cerrarModal}
          className="absolute top-1 right-1 bg-cyan-500 ring-2 ring-white text-white rounded-full p-2 hover:bg-red-600"
        >
          X
        </button>
        <div>
          {productos.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {productos.map((producto, index) => (
                <li key={index} className="border-b pb-2 ring-2 ring-white  m-2 rounded-md text-center  hover:bg-cyan-400 hover:text-black"  onClick={ () => ir(producto.id_producto)}>
                  <strong className=' text-center'> Producto:{index + 1}. {producto.nombre}</strong > - Cantidad: {producto.cantidad}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos para esta venta.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
