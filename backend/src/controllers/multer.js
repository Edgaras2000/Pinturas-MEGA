import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';




// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../frontend/public/img/herramientas');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar un nuevo nombre de archivo personalizado
    const ext = path.extname(file.originalname);  // Obtener la extensión (.jpg, .png, etc.)
    const newName = `herramienta_${Date.now()}${ext}`; // Prefijo personalizado + timestamp + extensión
    cb(null, newName);  // Cambiar el nombre de archivo
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limite de tamaño de archivo a 10 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Permitir imágenes (.jpg, .jpeg, .png) y videos (.mp4, .mov, .avi)
    if (
      ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' &&
      ext !== '.mp4' && ext !== '.mov' && ext !== '.avi'
    ) {
      return cb(new Error('Solo se permiten imágenes (.jpg, .jpeg, .png) y videos (.mp4, .mov, .avi)'));
    }
    cb(null, true);
  }
});

export default upload;
