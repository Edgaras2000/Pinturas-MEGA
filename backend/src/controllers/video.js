import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';  

export const agregar_video = async (req, res) => {
    const video = req.file;  
    const {nombre} = req.body;


    console.log("El archivo de video es:", video);  

    if (!video) {
        return res.status(400).json({ message: 'No se ha subido ningún video.' });
    }

    try {
        

const date = new Date();

        const videoo = {
            url: `/img/herramientas/${video.filename}`,  
            titulo: nombre, 
            vistas: 0,
            me_gusta:0,
            no_gusta:0,
            fecha:date,
            estado:true,
        };

       
        const db = mongoose.connection;

       
        const result = await db.collection('videos').insertOne(videoo);

        res.status(201).json({ message: 'Video subido con éxito', result });
    } catch (error) {
        console.error('Error al agregar video:', error);
        res.status(500).json({ message: 'Error interno del servidor. Intenta nuevamente.' });
    }
};

export const un_video = async (req, res) => {


    try {
      const db = mongoose.connection;
      const video = await db.collection('videos').findOne({ _id: new ObjectId(req.params.id) });
  
      if (!video) {
        return res.status(404).json({ message: 'video no encontrado' });
      }
  
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




  export const sumar1 = async (req, res) => {
    const { id } = req.body;  

    try {
        const db = mongoose.connection;
        
        
        const video = await db.collection('videos').updateOne(
            { _id: new ObjectId(id) },  
            { $inc: { vistas: (1)/2 } }    
        );

        if (video.modifiedCount === 0) {  
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        res.json({ message: 'Vistas incrementadas correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const likes = async (req, res) => {
    const { id } = req.body;  

    try {
        const db = mongoose.connection;
        
        
        const video = await db.collection('videos').updateOne(
            { _id: new ObjectId(id) },  
            { $inc: { me_gusta: 1 } }    
        );

        if (video.modifiedCount === 0) {  
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        res.json({ message: 'Vistas incrementadas correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const likesm = async (req, res) => {
    const { id } = req.body;  

    try {
        const db = mongoose.connection;
        
        
        const video = await db.collection('videos').updateOne(
            { _id: new ObjectId(id) },  
            { $inc: { me_gusta: -1 } }    
        );

        if (video.modifiedCount === 0) {  
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        res.json({ message: 'Vistas incrementadas correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const todo_video = async (req, res) => {
    try {
        const db = mongoose.connection;
        const videos = await db.collection('videos').find({ estado:true }).toArray(); 

     

        res.json(videos); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};


export const todo_video2 = async (req, res) => {
    try {
        const db = mongoose.connection;
        const videos = await db.collection('videos').find().toArray(); 

     

        res.json(videos); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};






export const cambiar_estado_video = async (req, res) => {
    const { id_video } = req.body;  
    let { estado } = req.body;  

    try {
        const db = mongoose.connection;

        const video = await db.collection('videos').findOne({ _id: new ObjectId(id_video) });

        if (!video) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }

      
        if (estado === undefined) {
            estado = video.estado === true ? false : true;  
        }

        // Actualizar el video con el nuevo estado
        const updateResult = await db.collection('videos').updateOne(
            { _id: new ObjectId(id_video) },  
            { $set: { estado: estado } }    
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'No se pudo actualizar el estado del video' });
        }

        res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const eliminar_video = async (req, res) => {
    const { id_video } = req.body;
    const { url } = req.body; // Asegúrate de que 'url' sea una cadena de texto

    try {
        const db = mongoose.connection;
        const video = await db.collection('videos').deleteOne({ _id: new ObjectId(id_video) });

        if (!video || video.deletedCount === 0) {
            return res.status(404).json({ message: 'Video no encontrado' });
        }

        if (url && typeof url === 'string') {
            eliminar_media(url); // Llama a la función para eliminar el archivo si 'url' es válida
        } else {
            console.error('La URL proporcionada no es válida:', url);
        }

        res.json({ message: 'Video eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el __dirname equivalente en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eliminar_media = async (nombre) => {
    try {
        // Eliminar la barra inicial si existe
        const rutaArchivo = nombre.startsWith('/') ? nombre.slice(1) : nombre;
        
        // Construir la ruta absoluta correctamente
        const url = path.resolve(__dirname, '../../../frontend/public', rutaArchivo);
        console.log('Ruta del archivo:', url); // Verifica la ruta generada

        if (fs.existsSync(url)) {
            fs.unlinkSync(url);
            console.log(`Archivo eliminado: ${url}`);
        } else {
            console.error(`El archivo no existe: ${url}`);
        }
    } catch (error) {
        console.error(`Error al eliminar el archivo: ${error.message}`);
    }
};