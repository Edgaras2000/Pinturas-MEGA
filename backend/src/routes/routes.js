import express from 'express';
import {
  Todousuario,
  usuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  actualizar_password,
} from '../controllers/usuario.js';
import { login,googleLogin  } from '../controllers/login.js';
import upload from '../controllers/multer.js';



import {
  Todoproducto, obtenerProductoPorId, agregar_pintura, agregar_herramienta, filtro_producto,ress,summ,producto_y_promedio2
} from '../controllers/producto.js';

import { pinturas_azar } from '../controllers/principal.js'

import { reseñas_producto, reseña_del_usuario, agregar_reseña, eliminar_reseña,editar_reseña } from '../controllers/reseñas.js'

const router = express.Router();


import { deseados,eliminar_deseados,agregar_deseado } from '../controllers/deseados.js'

import{crear_direccion,todas_direcciones,actualizar_direccion} from '../controllers/direcciones.js'
import{crear_tarjeta,todas_tarjetas,actualizar_tarjeta} from '../controllers/tarjetas.js'


import{carrito,agregar_carrito,actualizar_carrito_cantidad} from '../controllers/carrito.js'

import {crear_venta,cancelar_venta,cambiar_venta,usuario_producto_venta} from '../controllers/venta.js'

import {producto_y_promedio,act_producto,cambiar_estado_producto,un_producto,actualizarProducto} from '../controllers/crud_producto.js'

import {todos_usuarios,cambiar_estado} from '../controllers/crud_usuario.js'


import {tres_productos,cinco_productos_menos,todas_ventass,todas_ventass_datos,todas_ventass_datos_where,todas_ventass_datos_where2} from '../controllers/estadisticas.js'

import {agregar_imagen,filtro_reseñas} from '../controllers/user.js'


import {agregar_video,un_video,sumar1,likes,likesm,todo_video,todo_video2,eliminar_video,cambiar_estado_video} from '../controllers/video.js'


import{motivos,sugerencias,crearsugerencia,cambiarsugerencia} from '../controllers/sugerencias.js'



import {gemini,conversasion} from '../controllers/gemini.js'



import {borrarcarrito,borrarcarritosingular} from '../controllers/exito.js'

import {todo_conver,todo_conver2,todo_conver3,todo_conver4} from '../controllers/inicio.js'


router.post('/gemini/respuesta/', gemini);

router.get('/usuario/producto/saber/:id_usuario/:id_producto', usuario_producto_venta);

router.get('/conver/cantidad/',todo_conver);
router.get('/conver/cantidad2/',todo_conver2);
router.get('/conver/cantidad3/',todo_conver3);
router.get('/conver/cantidad4/',todo_conver4);


///
//borrar carrito

router.post('/resena/crud/mostrar/nose/', filtro_reseñas);

router.post('/carrito/usuario/eliminarr/:id', borrarcarrito);

router.post('/carrito/usuario/eliminarr/singular/caca/', borrarcarritosingular);

///
router.get('/', Todousuario);
router.get('/:id', usuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.patch('/:id', actualizarUsuario);
router.delete('/:id', borrarUsuario);
router.post('/login', login);
router.post('/login/google', googleLogin);


//productos
router.get('/producto/todo', Todoproducto);
router.get('/producto/:id', filtro_producto);

router.get('/producto/filtro/:datos', filtro_producto);
router.get('/producto/singular/:id', obtenerProductoPorId);

router.post('/producto/pintura', agregar_pintura);
router.post('/producto/herramienta', upload.single('imagen'), agregar_herramienta); // imagen


router.get('/res/producto/:id', reseñas_producto);

router.get('/res/usuario/:id/:id_producto', reseña_del_usuario);

router.post('/post/res/', agregar_reseña); // agregar reseña
router.post('/res/eliminar/', eliminar_reseña);

router.post('/res/editar/', editar_reseña);///////////

router.post('/resen/sum/', summ);
router.post('/resen/ress/', ress);




//deseados 
router.get('/deseados/todo/:id_usuario',deseados );

router.post('/deseados/eliminar/', eliminar_deseados);
router.post('/deseados/agregar/', agregar_deseado);
////////////////


///opciones
router.post('/opciones/direccion/agregar/', crear_direccion);
router.get('/opciones/direccion/todo/:id', todas_direcciones);
router.post('/opciones/direccion/eliminar/',actualizar_direccion );


router.post('/opciones/tarjeta/agregar/',crear_tarjeta);
router.get('/opciones/tarjeta/todo/:id', todas_tarjetas);

router.post('/opciones/tarjeta/actualizar/', actualizar_tarjeta);


router.post('/opciones/usuario/actualizar/', actualizar_password);


////////////////
//carrito

router.get('/carrito/todo/:id_usuario',carrito );
router.post('/carrito/agregar/', agregar_carrito);
router.post('/carrito/actualizar/', actualizar_carrito_cantidad);


///////////////
//venta

router.post('/venta/agregar/',crear_venta);


router.post('/venta/cancelar/',cancelar_venta);
router.post('/venta/cambiar/',cambiar_venta);


//////////////


//principal
router.post('/producto/azar/', pinturas_azar);
//principal

////////////////////////
//crud producto
router.get('/producto/crud_todo/caca/', producto_y_promedio);
router.post('/producto/crud_todo/stock/', act_producto);

router.get('/producto/editar/:id', un_producto);
router.post('/producto/editar/:id', actualizarProducto);

router.post('/producto/crud_todo/cambiar_estado/', cambiar_estado_producto);
///////////////////
// crud usuario


router.get('/usuario/crud_todo/', todos_usuarios);
router.post('/usuario/crud_todo/cambiar_estado/', cambiar_estado);

/////////////
//estadisticas


router.get('/estadistica/tres_productos/esta/', tres_productos);
router.get('/estadistica/cinco_productos_menos/esta/', cinco_productos_menos);
router.get('/estadistica/venta/esta/', todas_ventass);



//////////////////////
//crud eveta


router.get('/estadistica/venta/esta/fil/', todas_ventass_datos );

////////
//agregar imagen usuario

router.post('/imagen/user/foto/',upload.single('imagen'),agregar_imagen  );

//////////
///videos

router.post('/video/subir/',upload.single('video'),agregar_video  );
router.get('/video/traer/singular/:id',un_video  );

router.post('/video/sumar/', sumar1 );

router.post('/video/likes/sumar/',likes  );
router.post('/video/likes/restar/',likesm  );


router.get('/video/todo/',  todo_video);
router.get('/video/todo2/',  todo_video2);



router.post('/video/cambiar_estado/',cambiar_estado_video  );
router.post('/video/eliminar/',eliminar_video  );
///////////


router.get('/producto/promedio/dos/', producto_y_promedio2 );

router.get('/ventas/esta/us/:id_usuario', todas_ventass_datos_where );


router.get('/ventas/esta/ticket/:id_venta', todas_ventass_datos_where2 );


///

router.get('/sugerencias/todoo/', sugerencias );
router.get('/motivos/todo/', motivos );

router.post('/sugerencias/subir/',crearsugerencia  );



router.post('/sugerencias/cambiar/:id',cambiarsugerencia  );
////



router.get('/comversasion/usuario/:id', conversasion );
///
export default router;  
