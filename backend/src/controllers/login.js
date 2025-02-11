import bcrypt from 'bcrypt'; // Importar bcrypt para la comparación de contraseñas
import jwt from 'jsonwebtoken'; // Importar JWT para generar tokens
import { OAuth2Client } from 'google-auth-library'; // Importar la librería de Google para validar el token
import mongoose from '../database/database.js'; // Importar conexión a MongoDB

const secretKey = 'caca12345'; 
const googleClientId = '795680348983-va7rs9m007c15nh1t6lo9b57jji14ks6.apps.googleusercontent.com'; // Reemplaza con tu cliente ID de Google
const client = new OAuth2Client(googleClientId); // Instancia de cliente OAuth de Google


export const login = async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const db = mongoose.connection;
    
    const user = await db.collection('usuario').findOne({ usuario: usuario ,estado:true });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '3h' });
    res.json({
      message: 'Login exitoso',
      token: token,
      usuario: user.usuario,
      tipo: user.tipo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;



  try {
  
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
   

    const { sub, correo, name } = payload;
    const db = mongoose.connection;

  
    let user = await db.collection('usuario').findOne({ googleId: sub });

    if (!user) {
      const date = new Date();
      user = await db.collection('usuario').insertOne({
        googleId: sub,
        correo,
        nombre: name,
        fecha: date,
        estado:true,
        usuario:name,

        
      });
    }

    // Crear el token JWT para la sesión
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '3h' });
    res.json({
      message: 'Login exitoso con Google',
      token: token,
      usuario: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de autenticación con Google' });
  }
};
