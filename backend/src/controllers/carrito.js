import mongoose from 'mongoose'; 
import { ObjectId } from 'mongodb';




export const carrito = async (req, res) => {
  try {
      const { id_usuario } = req.params;

      const db = mongoose.connection;

      // Busca los documentos del carrito por el id_usuario
      const carrito = await db.collection('carrito').find({ id_usuario: id_usuario }).toArray();

      if (carrito.length > 0) {
          // Obtén los ids de productos en el carrito
          const productIds = carrito.map(item => new mongoose.Types.ObjectId(item.id_producto));

          // Busca los productos en la colección "producto" usando esos ids
          const productos = await db.collection('producto').find({ _id: { $in: productIds } }).toArray();

          // Mapea cada producto con la cantidad y el id_carrito correspondientes
          const productosConCantidad = productos.map(producto => {
              const carritoItem = carrito.find(item => item.id_producto === producto._id.toString());
              return {
                  ...producto,
                  cantidad_carrito: carritoItem ? carritoItem.cantidad_carrito : 0,
                  id_producto: carritoItem ? carritoItem.id_producto : null // Incluye el id_carrito del documento en el carrito
              };
          });

          res.json(productosConCantidad);
      } else {
          res.status(404).json({ message: 'No se encontró ningún producto del carrito' });
      }
  } catch (error) {
      console.error('Error al obtener productos del carrito:', error);
      res.status(500).json({ message: error.message });
  }
};

  export const agregar_carrito = async (req, res) => {
    const { id_producto, id_usuario } = req.body;
  
    try {
     
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
      }
  
     
      const existe = await mongoose.connection.collection('carrito').findOne({
        id_producto: id_producto,
        id_usuario: id_usuario,
      });
  
      if (existe) {
      
        await mongoose.connection.collection('carrito').deleteOne({
          id_producto: id_producto,
          id_usuario: id_usuario,
        });
       // hey pendejo, el return cierra las demas solicitudes bobo
      }
  
     
      
      const reseña = {
        id_producto: id_producto,
        id_usuario: id_usuario,
        cantidad_carrito:1

        
      };
  
     
      const result = await mongoose.connection.collection('carrito').insertOne(reseña);
  
   
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  



  export const actualizar_carrito_cantidad = async (req, res) => {
      const { id_producto, id_usuario, cantidad_carrito } = req.body;
  
      if (cantidad_carrito==0) {
        
      }

      if (!id_producto || !id_usuario || typeof cantidad_carrito !== 'number') {
          return res.status(400).json({ message: "Entrada inválida." });
      }
  
      try {
          const db = mongoose.connection;
  
          // Realiza la actualización del carrito
          const result = await db.collection('carrito').updateOne(
              { id_producto, id_usuario },
              { $set: { cantidad_carrito } }
          );
  
          // Verificar si se actualizó algún documento
          if (result.modifiedCount === 0) {
              return res.status(404).json({ message: "Producto no encontrado en el carrito." });
          }
  
          res.json({
              message: "Cantidad actualizada correctamente.",
              modifiedCount: result.modifiedCount // Puedes incluir la cantidad modificada si lo deseas
          });
      } catch (error) {
          console.error("Error al actualizar la cantidad del carrito:", error.message);
          res.status(500).json({ message: "Hubo un error al actualizar la cantidad del carrito.", error: error.message });
      }
  };
  