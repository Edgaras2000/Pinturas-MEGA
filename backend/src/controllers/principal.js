import mongoose from '../database/database.js';




export const pinturas_azar = async (req, res) => {
  try {
    const db = mongoose.connection;
    // Imprime la consulta que estás enviando para depuración
    console.log('Consultando productos con estado: true y tipo: pintura');
    
    const productos = await db.collection('producto').find({ estado: true }).toArray();
    
    console.log('Productos encontrados:', productos);  // Imprime los productos encontrados
    
    if (productos.length > 0) {
      res.json(productos);
    } else {
      res.status(404).json({ message: 'No se encontraron productos de tipo pintura' });
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: 'Error al obtener productos de tipo pintura' });
  }
};
