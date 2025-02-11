import mongoose from 'mongoose';

const conexion = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pintura2', {
     
    });
    console.log('Conexión a MongoDB establecida con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos de MongoDB:', error);
  }
};


conexion();

export default mongoose;
