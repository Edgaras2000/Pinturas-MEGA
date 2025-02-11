import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';


export const motivos = async (req, res) => {
    try {
      const db = mongoose.connection;
      const usuarios = await db.collection('motivos').find({estado:true}).toArray();
  
      if (usuarios.length > 0) {
        res.json(usuarios);
      } else {
     
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




  export const sugerencias = async (req, res) => {
    try {
      const db = mongoose.connection;
      const sugerenciasConMotivos = await db.collection('sugerencias').aggregate([
        {
          $match: { estado: true }  
        },
        {
          $lookup: {
            from: 'motivos', 
            let: { id_motivo: { $toObjectId: "$id_motivo" } }, 
            pipeline: [
              { 
                $match: { 
                  $expr: { 
                    $eq: ["$_id", "$$id_motivo"]  
                  }
                }
              }
            ],
            as: 'motivo'  
          }
        },
        {
          $unwind: { path: '$motivo', preserveNullAndEmptyArrays: true }
        }
      ]).toArray();
  
      if (sugerenciasConMotivos.length > 0) {
        res.json(sugerenciasConMotivos);  
      } else {
        res.status(404).json({ message: 'No se encontraron sugerencias con estado verdadero.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  


  export const crearsugerencia = async (req, res) => {
    const { id_usuario,id_motivo,contenido,correo} = req.body;
  
  const date = new Date();
    
    try {

      const db = mongoose.connection;
      const nuevoUsuario = {
        id_usuario:id_usuario,
        id_motivo:id_motivo,
        contenido:contenido,
        fecha:date,
        estado:true,
      };
      enviarEmail(correo)
      const result = await db.collection('sugerencias').insertOne(nuevoUsuario);
  
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const cambiarsugerencia = async (req, res) => {
    try {
      const db = mongoose.connection;
      const { id } = req.params;
      
  
      const result = await db.collection('sugerencias').updateOne(
        { _id: new ObjectId(id) },
        { $set: { estado: false } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'sugerencias no encontrado' });
      }
  
      res.json({ message: 'sugerencias actualizado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




  function enviarEmail(destinatario) {

  
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gracias por tu sugerencia</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-white">
    <div class="bg-white text-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="text-center border-b border-gray-300 pb-4">
            <div class="text-4xl mb-2 text-green-500">✅</div>
            <h1 class="text-2xl font-bold">¡Gracias por tu sugerencia!</h1>
        </div>
        <div class="text-center mt-4">
            <p class="text-lg">
                Tu opinión es muy valiosa para nosotros. Hemos recibido tu sugerencia y nuestro equipo la revisará pronto.
            </p>
            <p class="text-sm text-gray-600 mt-2">
                Si tienes más comentarios o sugerencias, no dudes en compartirlos. ¡Estamos aquí para escucharte!
            </p>
        </div>
        <div class="mt-6 text-center">
            <a href="http://localhost:3000/principal"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md inline-block">
                Volver a la página principal
            </a>
        </div>
    </div>
</body>
</html>
`;
  
  
  
  
    const transporte = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Usa 465 para SSL
    secure: true,
      auth: {
        user: 'ee33237@gmail.com',
        pass: 'xdbugdgksfkogosw'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
  
    const mensaje = {
      from: 'ee33237@gmail.com',
      to: destinatario,
      subject: 'Actualizacion de estado',
  
      html: htmlContent
    };
  
  
    transporte.sendMail(mensaje, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
  }