import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const tres_productos = async (req, res) => {
  try {
    const db = mongoose.connection;

    // Realizamos una agregación en la colección 'venta' para obtener los productos más vendidos
    const productosPopulares = await db.collection('venta').aggregate([
      // Desplegar el arreglo 'productos' para obtener cada producto individualmente
      { $unwind: "$productos" },

      // Convertir id_producto a ObjectId si es una cadena
      {



        
        $addFields: {
          'productos.id_producto': {
            $cond: {
              if: { $eq: [{ $type: "$productos.id_producto" }, "string"] },
              then: { $toObjectId: "$productos.id_producto" },
              else: "$productos.id_producto"
            }
          }
        }
      },

      // Agrupar por id_producto y sumar las cantidades de ventas
      {
        $group: {
          _id: '$productos.id_producto', // Agrupar por id_producto
          totalVentas: { $sum: '$productos.cantidad' }, // Sumar las cantidades
          ventas: { $push: '$productos.cantidad' } // Guardar la lista de ventas para cada producto
        }
      },

      // Ordenar de mayor a menor cantidad de ventas
      { $sort: { totalVentas: -1 } },

      // Limitar los resultados a los tres productos más populares
      { $limit: 5 }
    ]).toArray();

    // Si hay productos populares, obtenemos sus detalles
    if (productosPopulares.length > 0) {
      const idsProductos = productosPopulares.map(p => p._id);

      // Buscar los productos en la colección 'producto' usando los IDs obtenidos
      const productos = await db.collection('producto').find({
        _id: { $in: idsProductos }
      }).toArray();

      // Agregar el número total de ventas a cada producto
      const productosConVentas = productos.map(producto => {
        const productoPopular = productosPopulares.find(p => p._id.toString() === producto._id.toString());
        return {
          ...producto,
          ventas: productoPopular.totalVentas // Incluir el total de ventas
        };
      });

      res.json(productosConVentas); // Enviamos los productos con el número total de ventas
    } else {
      res.json({ message: 'No se encontraron productos populares' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos populares' });
  }
};


export const cinco_productos_menos = async (req, res) => {
  try {
    const db = mongoose.connection;

    // Realizamos una agregación en la colección 'venta' para obtener los productos más vendidos
    const productosPopulares = await db.collection('venta').aggregate([
      // Desplegar el arreglo 'productos' para obtener cada producto individualmente
      { $unwind: "$productos" },

      // Convertir id_producto a ObjectId si es una cadena
      {



        
        $addFields: {
          'productos.id_producto': {
            $cond: {
              if: { $eq: [{ $type: "$productos.id_producto" }, "string"] },
              then: { $toObjectId: "$productos.id_producto" },
              else: "$productos.id_producto"
            }
          }
        }
      },

     
      {
        $group: {
          _id: '$productos.id_producto', 
          totalVentas: { $sum: '$productos.cantidad' },
          ventas: { $push: '$productos.cantidad' } 
        }
      },

      // Ordenar de mayor a menor cantidad de ventas
      { $sort: { totalVentas: 1 } },

      // Limitar los resultados a los tres productos más populares
      { $limit: 5 }
    ]).toArray();

    // Si hay productos populares, obtenemos sus detalles
    if (productosPopulares.length > 0) {
      const idsProductos = productosPopulares.map(p => p._id);

      // Buscar los productos en la colección 'producto' usando los IDs obtenidos
      const productos = await db.collection('producto').find({
        _id: { $in: idsProductos }
      }).toArray();

      // Agregar el número total de ventas a cada producto
      const productosConVentas = productos.map(producto => {
        const productoPopular = productosPopulares.find(p => p._id.toString() === producto._id.toString());
        return {
          ...producto,
          ventas: productoPopular.totalVentas // Incluir el total de ventas
        };
      });

      res.json(productosConVentas); // Enviamos los productos con el número total de ventas
    } else {
      res.json({ message: 'No se encontraron productos populares' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos populares' });
  }
};


export const todas_ventass = async (req, res) => { // grafica
  try {
    const db = mongoose.connection;
    const usuarios = await db.collection('venta').find({estado:"completada"}).toArray();

    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.status(404).json({ message: 'No se encontraron ventas' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const todas_ventass_datos = async (req, res) => {
  try {
    const db = mongoose.connection;
    const ventas = await db.collection('venta').find({}).toArray();

    const ventasConDetalles = await Promise.all(ventas.map(async (venta) => {
      console.log("Procesando venta con id_direccion: ", venta.id_direccion); 

      // Buscar la dirección
      let direccion = null;
      if (venta.id_direccion) {
        try {
          const objectId = new mongoose.Types.ObjectId(venta.id_direccion);
          console.log("ObjectId generado para la dirección: ", objectId); 

          // Buscar la dirección en la colección 'direcciones'
          direccion = await db.collection('direcciones').findOne({ _id: objectId });

          if (!direccion) {
            console.log("Dirección no encontrada para id_direccion: ", venta.id_direccion); 
            direccion = { message: "Dirección no encontrada" }; 
          }
        } catch (err) {
          console.error("Error al buscar la dirección:", err);
          direccion = { message: "Error al buscar dirección" }; 
        }
      }

      // Buscar el nombre y el correo del usuario
      let usuarioNombre = "Usuario no encontrado";
      let usuarioCorreo = "Correo no encontrado";
      if (venta.id_usuario) {
        try {
          const usuario = await db.collection('usuario').findOne({ _id: new mongoose.Types.ObjectId(venta.id_usuario) });

          if (usuario) {
            console.log("Usuario encontrado: ", usuario);
            usuarioNombre = usuario.nombre;
            usuarioCorreo = usuario.correo;
          } else {
            console.log("Usuario no encontrado para id_usuario: ", venta.id_usuario);
          }
        } catch (err) {
          console.error("Error al buscar el usuario:", err);
        }
      }

      // Obtener los nombres de los productos
      const productosConNombre = await Promise.all(venta.productos.map(async (producto) => {
        let nombreProducto = "Producto no encontrado"; // Valor predeterminado en caso de error

        try {
          if (producto.id_producto) {
            // Buscar el producto en la colección 'productos' usando el id_producto como string
            const productoEncontrado = await db.collection('producto').findOne({ _id:new ObjectId(producto.id_producto)  });
            if (productoEncontrado) {
              nombreProducto = productoEncontrado.nombre; // Asumiendo que el campo 'nombre' está en la colección 'productos'
            } else {
              console.log("Producto no encontrado para id_producto: ", producto.id_producto);
            }
          }
        } catch (err) {
          console.error("Error al buscar el producto:", err);
        }

        return { ...producto, nombre: nombreProducto }; // Añadir el nombre del producto al objeto
      }));

      // Devolver la venta con la dirección, el nombre del usuario, su correo, y los productos con nombre
      return { 
        ...venta, 
        direccion, 
        usuarioNombre, 
        usuarioCorreo, 
        productos: productosConNombre // Asignar los productos con nombre
      };
    }));

    if (ventasConDetalles.length > 0) {
      res.json(ventasConDetalles);
    } else {
      res.status(404).json({ message: 'No se encontraron ventas' });
    }
  } catch (error) {
    console.error("Error en la consulta de ventas: ", error);
    res.status(500).json({ message: error.message });
  }
};


 
export const todas_ventass_datos_where = async (req, res) => {
  const { id_usuario } = req.params

console.log(id_usuario);


  try {
    const db = mongoose.connection;
    const ventas = await db.collection('venta').find({id_usuario:id_usuario}).toArray();

    const ventasConDetalles = await Promise.all(ventas.map(async (venta) => {
      console.log("Procesando venta con id_direccion: ", venta.id_direccion); 

      // Buscar la dirección
      let direccion = null;
      if (venta.id_direccion) {
        try {
          const objectId = new mongoose.Types.ObjectId(venta.id_direccion);
          console.log("ObjectId generado para la dirección: ", objectId); 

          // Buscar la dirección en la colección 'direcciones'
          direccion = await db.collection('direcciones').findOne({ _id: objectId });

          if (!direccion) {
            console.log("Dirección no encontrada para id_direccion: ", venta.id_direccion); 
            direccion = { message: "Dirección no encontrada" }; 
          }
        } catch (err) {
          console.error("Error al buscar la dirección:", err);
          direccion = { message: "Error al buscar dirección" }; 
        }
      }

      // Buscar el nombre y el correo del usuario
      let usuarioNombre = "Usuario no encontrado";
      let usuarioCorreo = "Correo no encontrado";
      if (venta.id_usuario) {
        try {
          const usuario = await db.collection('usuario').findOne({ _id: new mongoose.Types.ObjectId(venta.id_usuario) });

          if (usuario) {
            console.log("Usuario encontrado: ", usuario);
            usuarioNombre = usuario.nombre;
            usuarioCorreo = usuario.correo;
          } else {
            console.log("Usuario no encontrado para id_usuario: ", venta.id_usuario);
          }
        } catch (err) {
          console.error("Error al buscar el usuario:", err);
        }
      }

      // Obtener los nombres de los productos
      const productosConNombre = await Promise.all(venta.productos.map(async (producto) => {
        let nombreProducto = "Producto no encontrado"; // Valor predeterminado en caso de error

        try {
          if (producto.id_producto) {
            // Buscar el producto en la colección 'productos' usando el id_producto como string
            const productoEncontrado = await db.collection('producto').findOne({ _id:new ObjectId(producto.id_producto)  });
            if (productoEncontrado) {
              nombreProducto = productoEncontrado.nombre; // Asumiendo que el campo 'nombre' está en la colección 'productos'
            } else {
              console.log("Producto no encontrado para id_producto: ", producto.id_producto);
            }
          }
        } catch (err) {
          console.error("Error al buscar el producto:", err);
        }

        return { ...producto, nombre: nombreProducto }; // Añadir el nombre del producto al objeto
      }));

      // Devolver la venta con la dirección, el nombre del usuario, su correo, y los productos con nombre
      return { 
        ...venta, 
        direccion, 
        usuarioNombre, 
        usuarioCorreo, 
        productos: productosConNombre // Asignar los productos con nombre
      };
    }));

    if (ventasConDetalles.length > 0) {
      res.json(ventasConDetalles);
    } else {
      res.status(404).json({ message: 'No se encontraron ventas' });
    }
  } catch (error) {
    console.error("Error en la consulta de ventas: ", error);
    res.status(500).json({ message: error.message });
  }
};



export const todas_ventass_datos_where2 = async (req, res) => {
  const { id_venta } = req.params;

  console.log("ID de la venta recibida:", id_venta);

  try {
    const db = mongoose.connection;

    // Buscar la venta específica por _id
    const venta = await db.collection('venta').findOne({ _id: new mongoose.Types.ObjectId(id_venta) });

    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    console.log("Venta encontrada:", venta);

    // Buscar la dirección
    let direccion = null;
    if (venta.id_direccion) {
      try {
        direccion = await db.collection('direcciones').findOne({ _id: new mongoose.Types.ObjectId(venta.id_direccion) });
        if (!direccion) {
          console.log("Dirección no encontrada para id_direccion:", venta.id_direccion);
          direccion = { message: "Dirección no encontrada" };
        }
      } catch (err) {
        console.error("Error al buscar la dirección:", err);
        direccion = { message: "Error al buscar dirección" };
      }
    }

    // Buscar el nombre y correo del usuario
    let usuarioNombre = "Usuario no encontrado";
    let usuarioCorreo = "Correo no encontrado";
    let usuarioTelefono = "telefono no encontrado";
    if (venta.id_usuario) {
      try {
        const usuario = await db.collection('usuario').findOne({ _id: new mongoose.Types.ObjectId(venta.id_usuario) });
        if (usuario) {
          console.log("Usuario encontrado:", usuario);
          usuarioNombre = usuario.nombre;
          usuarioCorreo = usuario.correo;
          usuarioTelefono = usuario.telefono;
        } else {
          console.log("Usuario no encontrado para id_usuario:", venta.id_usuario);
        }
      } catch (err) {
        console.error("Error al buscar el usuario:", err);
      }
    }

    // Obtener los nombres de los productos
    const productosConNombre = await Promise.all(
      venta.productos.map(async (producto) => {
        let nombreProducto = "Producto no encontrado";
        let nombrePrecio = "Producto no encontrado";

        try {
          if (producto.id_producto) {
            const productoEncontrado = await db.collection('producto').findOne({ _id: new mongoose.Types.ObjectId(producto.id_producto) });
            if (productoEncontrado) {
              nombreProducto = productoEncontrado.nombre;
              nombrePrecio = productoEncontrado.precio;

            } else {
              console.log("Producto no encontrado para id_producto:", producto.id_producto);
            }
          }
        } catch (err) {
          console.error("Error al buscar el producto:", err);
        }

        return { ...producto, nombre: nombreProducto,precio: nombrePrecio};
      })
    );

    // Construir el objeto con los detalles enriquecidos
    const ventaConDetalles = {
      ...venta,
      direccion,
      usuarioNombre,
      usuarioCorreo,
      usuarioTelefono,
      productos: productosConNombre,
    };

    res.json(ventaConDetalles);
  } catch (error) {
    console.error("Error en la consulta de venta:", error);
    res.status(500).json({ message: error.message });
  }
};






