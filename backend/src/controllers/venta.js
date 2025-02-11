import mongoose from 'mongoose';
import nodemailer from 'nodemailer';



export const crear_venta = async (req, res) => {
  const { id_usuario, id_metodo_pago, id_direccion } = req.body; // El total se calcula abajo

  try {
    const fechaActual = new Date();
    const db = mongoose.connection;

   
    const productosCarrito = await db.collection('carrito').find({ id_usuario }).toArray();


    for (const producto of productosCarrito) {
      await db.collection('producto').updateOne(
        { _id: new mongoose.Types.ObjectId(producto.id_producto) },  
        { $inc: { stock: -producto.cantidad_carrito } }
      );
    }

    
    let totalVenta = 0;
    const productos = [];

    for (const productoCarrito of productosCarrito) {
      // Obtener el precio del producto desde la colección 'producto'
      const producto = await db.collection('producto').findOne(
        { _id: new mongoose.Types.ObjectId(productoCarrito.id_producto) }
      );

     
      if (!producto) {
        throw new Error(`Producto con ID ${productoCarrito.id_producto} no encontrado`);
      }

      const precioUnitario = producto.precio; 
      const subtotal = productoCarrito.cantidad_carrito * precioUnitario;
      totalVenta += subtotal; 

      
      productos.push({
        id_producto: productoCarrito.id_producto,
        cantidad: productoCarrito.cantidad_carrito,
        precio_unitario: precioUnitario,
        subtotal,
      });
    }

    
    const datosVenta = {
      id_usuario,
      id_metodo_pago,
      id_direccion,
      total: totalVenta,  
      fecha: fechaActual,
      estado: "pendiente",
      productos,
    };

    const ventaResult = await db.collection('venta').insertOne(datosVenta);

    await db.collection('carrito').deleteMany({ id_usuario });

    res.status(201).json({ venta: ventaResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





function enviarEmail(destinatario) {

  let htmlContent = '';


   htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Cancelado</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-white">
    <div class="bg-red-500 text-white rounded-lg shadow-lg max-w-md w-full p-6">

        <div class="text-center border-b border-red-400 pb-4">
            <div class="text-4xl mb-2">❌</div>
            <h1 class="text-2xl font-bold">Pedido Cancelado</h1>
        </div>
 
        <div class="text-center mt-4">
            <p class="text-lg">
                Lamentamos informarte que tu pedido ha sido cancelado.  
                Si no fuiste tu comunicate al siguiente numero:3481111267
            </p>
        </div>
    
        <div class="mt-6 text-center">
            <a href="http://localhost:3000/principal"
                class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-md inline-block">
                Contactar Soporte
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

export const cancelar_venta = async (req, res) => {
  try {
    const db = mongoose.connection;
   
    const { id_venta, t_correo } = req.body;
    const destinatario = t_correo;  // hey pendejo la forma de arriba es array, por lo que el gmail no es valido baboso
    
    if (!id_venta) {
      return res.status(400).json({ message: 'El id_venta es requerido' });
    }

    const objectIdVenta = new mongoose.Types.ObjectId(id_venta);

    const venta = await db.collection('venta').findOne({ _id: objectIdVenta });

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    if (venta.estado === 'cancelado') {
      return res.status(400).json({ message: 'La venta ya está cancelada' });
    }

    await db.collection('venta').updateOne(
      { _id: objectIdVenta },
      { $set: { estado: 'cancelado' } }
    );

    // Llamada a la función enviarEmail pasando correctamente el correo
    enviarEmail(destinatario);

    const productos = venta.productos;

    for (const producto of productos) {
      const objectIdProducto = new mongoose.Types.ObjectId(producto.id_producto);

      await db.collection('producto').updateOne(
        { _id: objectIdProducto },
        { $inc: { stock: producto.cantidad } }
      );
    }

    res.json({ message: 'Venta cancelada y stock actualizado ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const cambiar_venta = async (req, res) => {
  try {
    const db = mongoose.connection;
    const { id_venta } = req.body; // Extrae id_venta desde req.body

    // Convierte id_venta a ObjectId usando `new`
    const venta = await db.collection('venta').findOne({ _id: new mongoose.Types.ObjectId(id_venta) });

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Actualiza el estado de la venta a "completada"
    await db.collection('venta').updateOne(
      { _id: new mongoose.Types.ObjectId(id_venta) },
      { $set: { estado: 'completada' } }
    );

    res.json({ message: 'Venta completada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const usuario_producto_venta = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.params;

    const db = mongoose.connection;

    // Busca en la colección venta un documento que coincida con el usuario y el producto en la lista de productos
    const venta = await db.collection('venta').findOne({
      id_usuario: id_usuario,
      productos: { $elemMatch: { id_producto: id_producto } },
    });

    if (!venta) {
      return res.status(404).json({ message: 'El usuario no ha adquirido este producto antes.' });
    }

    res.json({ message: 'El usuario ya ha adquirido este producto.', venta });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
