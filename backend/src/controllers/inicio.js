import mongoose from 'mongoose'; 
import { ObjectId } from 'mongodb';


export const todo_conver = async (req, res) => {
  try {
    const db = mongoose.connection;

    
    if (!db.readyState) {
      return res.status(500).json({ message: 'No hay conexión a la base de datos' });
    }

    const conversaciones = await db.collection('conversasion').find({}).toArray();

    if (conversaciones.length > 0) {
     
      return res.json({ total: conversaciones.length });
    } else {
      
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const todo_conver2 = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      
      if (!db.readyState) {
        return res.status(500).json({ message: 'No hay conexión a la base de datos' });
      }
  
      const conversaciones = await db.collection('usuario').find({estado:true}).toArray();
  
      if (conversaciones.length > 0) {
       
        return res.json({ total: conversaciones.length });
      } else {
     
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



  export const todo_conver3 = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      
      if (!db.readyState) {
        return res.status(500).json({ message: 'No hay conexión a la base de datos' });
      }
  
      const conversaciones = await db.collection('deseados').find().toArray();
  
      if (conversaciones.length > 0) {
       
        return res.json({ total: conversaciones.length });
      } else {
        return res.json({ total: 0 });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  export const todo_conver4 = async (req, res) => {
    try {
      const db = mongoose.connection;
  
      
      if (!db.readyState) {
        return res.status(500).json({ message: 'No hay conexión a la base de datos' });
      }
  
      const conversaciones = await db.collection('venta').find().toArray();
  
      if (conversaciones.length > 0) {
       
        return res.json({ total: conversaciones.length });
      } else {
       
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };