import { ObjectId } from 'mongodb';  
import mongoose from '../database/database.js';





export const crear_direccion = async (req, res) => {
    const {id_usuario,latitud,longitud,direccion,codigo_postal,ciudad,estado_d,numero } = req.body;
  
    try {
      

      const db = mongoose.connection;
      const direcciones = {
        id_usuario:id_usuario,
        latitud:latitud,
        longitud:longitud,
        direccion:direccion,
        codigo_postal:codigo_postal,
        ciudad:ciudad,
        estado_d:estado_d,
        numero:numero,
        estado:true,
  
  
      };
  
      const result = await db.collection('direcciones').insertOne(direcciones);
  
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




  export const todas_direcciones = async (req, res) => {

    const { id } = req.params;
    const db = mongoose.connection;
    const direccion = await db.collection('direcciones').find({estado:true,id_usuario:id}).toArray();
  
    if (direccion.length > 0) {
      res.json(direccion);
    } else {
      res.json(direccion);
    }
  
  };


  export const actualizar_direccion = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      const id_direccion = req.body.id_direccion; 
      const id_usuario = req.body.id_usuario; 
  
      
      const result = await db.collection('direcciones').updateOne(
        { 
          _id: new ObjectId(id_direccion),  
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