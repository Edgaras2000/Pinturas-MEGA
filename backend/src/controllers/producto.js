import mongoose from '../database/database.js';
import { ObjectId } from 'mongodb';
import upload from './multer.js';



export const Todoproducto = async (req, res) => {

  const db = mongoose.connection;
  const productos = await db.collection('producto').find({estado:true}).toArray();

  if (productos.length > 0) {
    res.json(productos);
  } else {
    res.status(404).json({ message: 'No se encontraron usuarios' });
  }

};


export const filtro_producto = async (req, res) => {
  try {
    const db = mongoose.connection;
    const dato_buscado = req.params.datos || '';
    
    const productos = await db.collection('producto').find({
      estado: true,
      nombre: { $regex: dato_buscado, $options: 'i' },
      stock: { $gte: 1 },
    }).toArray();

    if (productos.length > 0) {
      res.json(productos);
    } else {
      res.status(404).json({ message: 'No se encontraron productos' }); 
    }
  } catch (error) {
    console.error('Error en la búsqueda de productos:', error); 
    res.status(500).json({ message: 'Error en el servidor' }); 
  }
};


export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const db = mongoose.connection;
    const producto = await db.collection('producto').findOne({ _id: new ObjectId(id),estado:true });

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const agregar_pintura = async (req, res) => {
  const { nombre, precio, descripcion, stock, litros, tipo, color, estado } = req.body;

  try {



    const db = mongoose.connection;
    const pintura = {
      nombre: nombre,
      precio: parseFloat(precio),
      descripcion: descripcion,
      stock: parseFloat(stock),
      litros: litros,
      tipo: tipo,
      color: color,
      estado: estado,


    };

    const result = await db.collection('producto').insertOne(pintura);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const agregar_herramienta = async (req, res) => {
  const { nombre, precio, descripcion, stock, tipo } = req.body;
  const imagen = req.file;

  if (!imagen) {
    return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
  }

  try {
    const db = mongoose.connection;

    // Crear un objeto para la nueva herramienta
    const herramienta = {
      nombre: nombre,
      precio: parseFloat(precio),
      descripcion: descripcion,
      stock: parseFloat(stock),
      tipo: tipo,
      url: `/img/herramientas/${imagen.filename}`, // URL correcta para acceder a la imagen
      estado: true,
    };

    // Insertar la herramienta en la colección
    const result = await db.collection('producto').insertOne(herramienta);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







export const summ = async (req, res) => {
  const { id_reseña } = req.body;  

  try {
      const db = mongoose.connection;
      
      
      const video = await db.collection('reseñas').updateOne(
          { _id: new ObjectId(id_reseña) },  
          { $inc: { puntuacion: 1 } }    
      );

      if (video.modifiedCount === 0) {  
          return res.status(404).json({ message: 'no encontrado' });
      }

      res.json({ message: 'incrementadas correctamente' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



export const ress = async (req, res) => {
  const { id_reseña } = req.body;  

  try {
      const db = mongoose.connection;
      
      
      const video = await db.collection('reseñas').updateOne(
          { _id: new ObjectId(id_reseña) },  
          { $inc: { puntuacion: -1 } }    
      );

      if (video.modifiedCount === 0) {  
          return res.status(404).json({ message: 'no encontrado' });
      }

      res.json({ message: 'incrementadas correctamente' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



export const producto_y_promedio2 = async (req, res) => {
  try {
    const db = mongoose.connection;

    // Obtener todos los productos
    const productos = await db.collection('producto').find({estado:true,
      stock: { $gte: 1 },
    }).toArray();

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