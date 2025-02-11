
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';  
import mongoose from '../database/database.js';



export const Todousuario = async (req, res) => {
  try {
    const db = mongoose.connection;
    const usuarios = await db.collection('usuario').find({}).toArray();

    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.status(404).json({ message: 'No se encontraron usuarios' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const usuario = async (req, res) => {
  try {
    const db = mongoose.connection;
    const usuario = await db.collection('usuario').findOne({ _id: new ObjectId(req.params.id) });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const crearUsuario = async (req, res) => {
  const { nombre,correo,telefono,usuario,contraseña,estado } = req.body;

const date = new Date();
  
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const db = mongoose.connection;


    const usuarioExistente = await db.collection('usuario').findOne({
      $or: [{ usuario: usuario }, { correo: correo }],
    });

    if (usuarioExistente) {
      return res.status(400).json({
        message: 'El usuario o correo ya está registrado.',
      });
    }


    const nuevoUsuario = {
      nombre:nombre,
      correo:correo,
      telefono:telefono,
      usuario: usuario,
      contraseña: hashedPassword,
      fecha:date,
      tipo:"usuario",
      url:"",

      estado:estado,
    };

    const result = await db.collection('usuario').insertOne(nuevoUsuario);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const actualizarUsuario = async (req, res) => {
  try {
    const db = mongoose.connection;
    const { id } = req.params;
    const updatedData = req.body;

    const result = await db.collection('usuario').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const borrarUsuario = async (req, res) => {
  try {
    const db = mongoose.connection;
    const { id } = req.params;

    const result = await db.collection('usuario').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const actualizar_password = async (req, res) => {
  const { id_usuario, contraseñaa } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseñaa, saltRounds); 

    const db = mongoose.connection;

  
    const result = await db.collection('usuario').updateOne(
      { _id: new ObjectId(id_usuario) },
      { $set: { contraseña: hashedPassword } }  
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
