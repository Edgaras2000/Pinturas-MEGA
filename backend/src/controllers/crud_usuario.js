import mongoose from 'mongoose'; 
import { ObjectId } from 'mongodb';






export const todos_usuarios = async (req, res) => {

    const db = mongoose.connection;
    const productos = await db.collection('usuario').find().toArray();
  
    if (productos.length > 0) {
      res.json(productos);
    } else {
      res.json({ message: 'No se encontraron usuarios' });
    }
  
  };


  export const cambiar_estado = async (req, res) => {
    try {
        const db = mongoose.connection;

       
        const { id_usuario, estado } = req.body;

        
        if (!ObjectId.isValid(id_usuario)) {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }

        const result = await db.collection('usuario').updateOne(
            { _id: new ObjectId(id_usuario) },
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
  