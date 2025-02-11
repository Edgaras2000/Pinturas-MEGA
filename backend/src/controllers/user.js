import mongoose from 'mongoose';

export const agregar_imagen = async (req, res) => {
  const { id_usuario } = req.body;  
  const imagen = req.file;
  
  console.log("la imagen es:", imagen);

  if (!imagen) {
    return res.status(401).json({ message: 'No se ha subido ninguna imagen.' });
  }

  try {
    const db = mongoose.connection;

    // Asegurarse de que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id_usuario)) {
      return res.status(402).json({ message: 'ID de usuario no válido.' });
    }

    const img = {
      url: `/img/herramientas/${imagen.filename}`,  // Asumiendo que la imagen se guarda en una carpeta pública
    };

    // Actualizar el documento en la base de datos
    const result = await db.collection('usuario').updateOne(
      { _id: new mongoose.Types.ObjectId(id_usuario) },  // Instanciar ObjectId correctamente
      { $set: img }  // Actualizar la URL de la imagen
    );

    // Verificar si no se modificó ningún documento
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No se encontró el usuario para actualizar.' });
    }

    // Responder con éxito
    res.status(201).json({ message: 'Imagen del usuario actualizada con éxito.', result });
  } catch (error) {
    console.error('Error al agregar imagen:', error);  // Agregar más información sobre el error
    res.status(500).json({ message: 'Error interno del servidor. Intenta nuevamente.' });
  }
};



export const filtro_reseñas = async (req, res) => {
  try {
    const db = mongoose.connection;

    
    if (!req.body || !req.body.contenido) {
      return res.status(400).json({ message: 'El campo "contenido" es obligatorio' });
    }

    const { contenido } = req.body;

    
    const reseñas = await db.collection('reseñas').find({
      estado: true,
      contenido: { $regex: contenido, $options: 'i' }, 
    }).toArray();

    
    if (reseñas.length > 0) {
      res.json(reseñas);
    } else {
    }
  } catch (error) {
    console.error('Error al filtrar reseñas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
