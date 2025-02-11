import axios from 'axios';
import { ObjectId } from 'mongodb';  
import mongoose from '../database/database.js';


const apiKey = 'AIzaSyCbs6ks1oXYSW73ic-Bm9bVk70i_SYZxj0';
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;


export const gemini = async (req, res) => {
    const { pregunta, id_usuario } = req.body;

    if (!pregunta || !id_usuario) {
        return res.status(400).json({ error: 'Datos no proporcionados' });
    }

    const data = {
        contents: [
            {
                parts: [
                    { text: "contesta de forma detallada y sin preguntar más, además de forma breve y en 255 caracteres: " + pregunta }
                ]
            }
        ]
    };

    console.log("Lo que el usuario dijo fue: " + pregunta);

    try {
        const response = await axios.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });

        const geminiResponse = response.data;

        const textoGemini = response.data.candidates[0]?.content.parts[0]?.text || "Sin respuesta";

     
        await subir_conversacion({ id_usuario, contenido: pregunta, tipo_mensaje: 'usuario' });
        await subir_conversacion({ id_usuario, contenido: textoGemini, tipo_mensaje: 'gemini' });

        res.json(geminiResponse);
    } catch (error) {
        console.error('Error al llamar a la API de Gemini:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

const subir_conversacion = async ({ id_usuario, contenido, tipo_mensaje = 'usuario' }) => {
    const date = new Date();

    try {
        const db = mongoose.connection;

        // Verificar si el usuario existe
        const usuario = await db.collection('usuario').findOne({ _id: new ObjectId(id_usuario) });
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const conversacionExistente = await db.collection('conversasion').findOne({ id_usuario });

        const nuevoMensaje = {
            mensaje: contenido,
            tipo_mensaje,
            fecha: date
        };

        if (conversacionExistente) {
            // Actualizar conversación existente
            const result = await db.collection('conversasion').updateOne(
                { id_usuario },
                { $push: { contenido: nuevoMensaje } }
            );
            return result;
        } else {
            // Crear nueva conversación
            const nueva_conversacion = {
                id_usuario,
                contenido: [nuevoMensaje]
            };

            const result = await db.collection('conversasion').insertOne(nueva_conversacion);
            return result;
        }
    } catch (error) {
        console.error('Error en subir_conversacion:', error.message);
        throw error;
    }
};





export const conversasion = async (req, res) => {
    try {
        const { id } = req.params; 
        const db = mongoose.connection;

       
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID no válido' });
        }


        const conversacion = await db.collection('conversasion').findOne({ id_usuario: (id) });

     
        res.status(200).json(conversacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
