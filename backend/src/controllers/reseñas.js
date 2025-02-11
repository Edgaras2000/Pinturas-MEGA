import mongoose from 'mongoose'; // Asegúrate de que esta importación sea correcta
import { ObjectId } from 'mongodb';




const reseñaSchema = new mongoose.Schema({
    id_producto: { type: ObjectId, required: true },
    estado: { type: Boolean, required: true },
    // Define other fields as needed
});

const Reseña = mongoose.model('Reseña', reseñaSchema);



export const reseñas_producto = async (req, res) => {
    console.log('Solicitando reseñas para el producto con ID:', req.params.id);
    try {
        const { id } = req.params;

        const db = mongoose.connection;
        const reseñas = await db.collection('reseñas').find({ estado: true, id_producto: id }).toArray();

        if (reseñas.length > 0) {




            res.json(reseñas);
        } else {
           
        }
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ message: error.message });
    }
};


export const reseña_del_usuario = async (req, res) => {
    console.log('Solicitando reseña para el usuario con ID:', req.params.id);
    try {
        const { id,id_producto } = req.params;

        const db = mongoose.connection;
      
        const reseña = await db.collection('reseñas').findOne({ estado: true, id_usuario: id,id_producto:id_producto });

        if (reseña) {
            res.json(reseña);  
        } else {
          
        }
    } catch (error) {
        console.error('Error al obtener reseña:', error);
        res.status(500).json({ message: error.message });
    }
};


export const agregar_reseña = async (req, res) => {
    const { id_producto, id_usuario, contenido, calificacion, puntuacion,estado } = req.body;
  
    try {
  
  
  
      const db = mongoose.connection;
      const reseña = {
        id_producto: id_producto,
        id_usuario: id_usuario,
        contenido: contenido,
        calificacion: parseFloat(calificacion),
        puntuacion: parseFloat(puntuacion),
        
        estado: estado,
  
  
      };
  
      const result = await db.collection('reseñas').insertOne(reseña);
  
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  
  export const eliminar_reseña = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      
      const { id_reseña } = req.body; 
  
      // Validate if id_reseña is provided
      if (!id_reseña) {
        return res.status(400).json({ message: 'ID de reseña es requerido' });
      }
  
      
      const result = await db.collection('reseñas').updateOne(
        { _id: new ObjectId(id_reseña) }, 
        { $set: { estado: false } } 
      );
  
     
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'reseña no encontrado' });
      }
  
      
      res.json({ message: 'reseña eliminada' });
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  };
  
  
  export const editar_reseña = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      
      const { id_reseña,contenido,calificacion } = req.body; 
  
      
      if (!id_reseña) {
        return res.status(400).json({ message: 'ID de reseña es requerido' });
      }
  
      
      const result = await db.collection('reseñas').updateOne(
        { _id: new ObjectId(id_reseña) }, 
        { $set: { contenido:contenido,calificacion:parseInt(calificacion) } } 
      );
  
     
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'reseña no encontrado' });
      }
  
      
      res.json({ message: 'reseña Actualizada' });
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  };
  
  