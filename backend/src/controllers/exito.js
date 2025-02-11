import { ObjectId } from 'mongodb';  
import mongoose from '../database/database.js';


export const borrarcarrito = async (req, res) => {
    try {
      const db = mongoose.connection;
      const { id } = req.params;
  
      const result = await db.collection('carrito').deleteMany({ id_usuario: id });
  
  
  
      
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  





  export const borrarcarritosingular = async (req, res) => {
    try {
      const { id_producto, id_usuario } = req.body;
  

      if (!id_producto || !id_usuario) {
        return res.status(400).json({ message: 'Faltan parámetros: id_producto o id_usuario.' });
      }
  
      const db = mongoose.connection;
  
    
      const result = await db.collection('carrito').deleteMany({ id_usuario: id_usuario, id_producto: id_producto });
  
    
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
      }
  
      res.json({ message: 'Producto eliminado del carrito con éxito.' });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ message: 'Hubo un error al intentar eliminar el producto del carrito.' });
    }
  };
  