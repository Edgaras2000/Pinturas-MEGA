import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const producto_y_promedio = async (req, res) => {
  try {
    const db = mongoose.connection;

    // Obtener todos los productos
    const productos = await db.collection('producto').find().toArray();

    // Obtener todas las reseñas
    const reseñas = await db.collection('reseñas').find().toArray();

    // Crear un objeto para almacenar la suma y el total de calificaciones por producto
    const calificacionesPorProducto = {};

    // Procesar las reseñas y acumular las calificaciones
    reseñas.forEach(reseña => {
      const idProducto = reseña.id_producto; // Aquí se usa 'id_producto' según tu estructura

      // Inicializar el objeto si no existe
      if (!calificacionesPorProducto[idProducto]) {
        calificacionesPorProducto[idProducto] = {
          sumaCalificaciones: 0,
          totalCalificaciones: 0,
        };
      }

      // Acumular la calificación
      calificacionesPorProducto[idProducto].sumaCalificaciones += reseña.calificacion;
      calificacionesPorProducto[idProducto].totalCalificaciones += 1;
    });

    // Combinar productos con sus calificaciones
    const productosConCalificaciones = productos.map(producto => {
      const calificaciones = calificacionesPorProducto[producto._id] || {
        sumaCalificaciones: 0,
        totalCalificaciones: 0,
      };

      return {
        ...producto,
        sumaCalificaciones: calificaciones.sumaCalificaciones,
        totalCalificaciones: calificaciones.totalCalificaciones,
      };
    });

    // Devolver la respuesta
    res.json(productosConCalificaciones);

  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta', error });
  }
};




export const act_producto = async (req, res) => {
  try {
    const db = mongoose.connection;

    // Extraer el ID del producto y el nuevo stock desde el cuerpo de la solicitud
    const { id_producto, stock } = req.body;

    // Verificar si id_producto es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({ message: 'ID de producto no válido' });
    }

    // Convertir a ObjectId correctamente
    const objectId = new mongoose.Types.ObjectId(id_producto);

    // Asegúrate de convertir el stock a número, manejando posibles errores
    const stockValue = parseInt(stock);
    if (isNaN(stockValue)) {
      return res.status(400).json({ message: 'El valor de stock debe ser un número válido' });
    }

  
    const result = await db.collection('producto').updateOne(
      { _id: objectId }, // Usar el ObjectId creado
      { $set: { stock: stockValue } } // Solo actualizar el campo stock
    );

    // Verificar si se encontró un producto para actualizar
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o stock no actualizado' });
    }

    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    res.status(500).json({ message: error.message });
  }
};


export const cambiar_estado_producto = async (req, res) => {
  try {
      const db = mongoose.connection;

     
      const { id_producto, estado } = req.body;

      
      if (!ObjectId.isValid(id_producto)) {
          return res.status(400).json({ message: 'ID de usuario inválido' });
      }

      const result = await db.collection('producto').updateOne(
          { _id: new ObjectId(id_producto) },
          { $set: { estado } } 
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario actualizado' });
  } catch (error) {
      console.error("Error al cambiar estado:", error); // Agregado para el manejo de errores
      res.status(500).json({ message: error.message });
  }
};


export const un_producto = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }

    const db = mongoose.connection;
    
    // Busca el producto en la colección 'producto'
    const producto = await db.collection('producto').findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};


export const actualizarProducto = async (req, res) => {
  try {
    const db = mongoose.connection;
    const { id } = req.params;
    const updatedData = req.body;

    // Verifica que el ID proporcionado sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }

    const result = await db.collection('producto').updateOne(
      { _id: new mongoose.Types.ObjectId(id) }, // Cambiado a mongoose.Types.ObjectId
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};