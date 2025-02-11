import mongoose from 'mongoose'; 
import { ObjectId } from 'mongodb';







export const agregar_deseado = async (req, res) => {
  const { id_producto, id_usuario } = req.body;

  try {
   
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

   
    const existe = await mongoose.connection.collection('deseados').findOne({
      id_producto: id_producto,
      id_usuario: id_usuario,
    });

    if (existe) {
    
      await mongoose.connection.collection('deseados').deleteOne({
        id_producto: id_producto,
        id_usuario: id_usuario,
      });
     // hey pendejo, el return cierra las demas solicitudes bobo
    }

   
    const fechaActual = new Date();
    const reseña = {
      id_producto: id_producto,
      id_usuario: id_usuario,
      fecha: fechaActual,
    };

   
    const result = await mongoose.connection.collection('deseados').insertOne(reseña);

 
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const deseados = async (req, res) => {
  try {
      const { id_usuario } = req.params;

      const db = mongoose.connection;

      
      const deseado = await db.collection('deseados').find({ id_usuario: id_usuario }).toArray();

      if (deseado.length > 0) {
        
          const productIds = deseado.map(item => new mongoose.Types.ObjectId(item.id_producto));

          const productos = await db.collection('producto').find({ _id: { $in: productIds } }).toArray();

       
          const productosConFecha = productos.map(producto => {
         
              const deseadoItem = deseado.find(item => item.id_producto === producto._id.toString());
              return {
                  ...producto,
                  fecha: deseadoItem ? deseadoItem.fecha : null 
              };
          });

          res.json(productosConFecha);
      } else {
          res.status(404).json({ message: 'No se encontró ningún producto deseado' });
      }
  } catch (error) {
      console.error('Error al obtener productos deseados:', error);
      res.status(500).json({ message: error.message });
  }
};






export const eliminar_deseados = async (req, res) => {
   
    try {
        const { id_producto } = req.body;

        const db = mongoose.connection;
      
        const deseado = await db.collection('deseados').deleteOne({ id_producto:id_producto });

        if (deseado.deletedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
          }
          res.json({ message: 'deseado eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
      }
};



