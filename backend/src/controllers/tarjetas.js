import { ObjectId } from 'mongodb';  
import mongoose from '../database/database.js';




export const crear_tarjeta = async (req, res) => {
    const { id_usuario, numero, nombre, expira, cvc } = req.body;

    try {
        // Verificar si ya existe una tarjeta con el mismo número
        const tarjetaExistente = await mongoose.connection.collection('pagos').findOne({ numero: numero });

        if (tarjetaExistente) {
            return res.status(400).json({ message: "Ya existe una tarjeta con el mismo número." });
        }

        // Si no existe, se procede a insertar la nueva tarjeta
        const direcciones = {
            id_usuario: id_usuario,
            numero: numero,
            nombre: nombre,
            expira: expira,
            cvc: cvc,
            estado: true
        };

        // Insertar la nueva tarjeta
        const result = await mongoose.connection.collection('pagos').insertOne(direcciones);

        // Responder con el resultado de la inserción
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



  export const todas_tarjetas = async (req, res) => {

    const { id } = req.params;
    const db = mongoose.connection;
    const tarjeta = await db.collection('pagos').find({estado:true,id_usuario:id}).toArray();
  
    if (tarjeta.length > 0) {
      res.json(tarjeta);
    } else {
      res.status(404).json({ message: 'No se encontraron usuarios' });
    }
  
  };

  export const actualizar_tarjeta = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      const id_tarjeta = req.body.id_tarjeta; 
      const id_usuario = req.body.id_usuario; 
  
      
      const result = await db.collection('pagos').updateOne(
        { 
          _id: new ObjectId(id_tarjeta),  
          id_usuario: id_usuario           
        },
        { $set: { estado: false } } 
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Dirección no encontrada para este usuario' });
      }
  
      res.json({ message: 'Dirección actualizada, estado cambiado a false' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };