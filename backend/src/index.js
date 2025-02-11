import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
  // Ajusta la ruta si es necesario
import router from './routes/routes.js';          // Ajusta la ruta si es necesario
import bodyParser from 'body-parser';

dotenv.config();  

const app = express();


app.use(express.json());  
app.use(cors());         
app.use('/pintura', router); 
app.use(bodyParser.json({ limit: '10mb' })); // Cambia '10mb' según sea necesario
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); //

app.get('/', (req, res) => {
  res.send('Hellodddddacsa');
});






import multer from 'multer';
import path from 'path';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    
      const uploadPath = path.join(__dirname, '../frontend/public/img/herramientas');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
    },
  });


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } ,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Solo se permiten imágenes de tipo .jpg, .jpeg y .png'));
    }
    cb(null, true);
  },
});








import { MercadoPagoConfig,Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'api aqui' });



app.post('/pago/mercado_pago', async (req, res) => {
  const { id_usuario, total } = req.body;

  try {
      // Verifica que el total sea un número válido
      const totalAmount = parseFloat(total);
      if (isNaN(totalAmount) || totalAmount <= 0) {
          return res.status(400).json({ error: "El total debe ser un número válido y mayor a cero." });
      }

      const body = {
          items: [
              {
                  title: "Compra en la tienda de ipintura",
                  quantity: 1,
                  unit_price: totalAmount,
                  currency_id:"MX",
              },
          ],
         
          back_urls: {
              success: "http://localhost:3000/exito1",
              failure: "http://localhost:3000/failure",
              pending: "http://localhost:3000/pending",
          },
          auto_return: "approved",
      };

      const preference = new Preference(client);
      const result = await preference.create({body});

      res.json({ id: result.id });
  } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      res.status(500).json({ error: "No se pudo crear la preferencia de pago.", details: error.message });
  }
});



app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000/');
});



