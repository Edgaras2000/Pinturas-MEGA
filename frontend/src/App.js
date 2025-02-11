import logo from './logo.svg';
import './App.css';

import Tabla_usuarios from './usuario/Todo_usuario';
import CrearUsuario from './usuario/agregar_usuario';
import EditarUsuario from './usuario/editar_usuario';
import Login from './login/login';
import Navbar from './login/navbar';
import RutaProtegida from './session/session'; // Verifica que la ruta sea correcta
import Footer from './principal/footer';
import Principal from './principal/principal';

import Producto_buscar from './producto_buscar/producto_buscar';
import Producto_info from './producto_buscar/producto_info';
import Crud_producto from './administrador/producto/crud_producto';


import Deseados from './lista de deseados/deseados';

import Insertar_Producto from './administrador/producto/insertar_producto'


import { Routes, Route } from 'react-router-dom'; // No necesitas importar BrowserRouter aquí

import Opciones from './opciones/Opciones';


import Prueba from './prueba/prueba'
import Carrito from './carrito/carrito'
import Exito1  from './exito/exito1';
import Editar_producto from './administrador/producto/Editar_producto'

import Crud_ventas from './administrador/ventas/Crud_ventas'

import Crud_usuario from './administrador/usuario/crud_usuario';
import Estadisticas from './administrador/estadisticas/Estadisticas';

import Agregar_video from './administrador/vi/Agregar_video';

import Calcularora from './principal/calculadora';


import Videos_info from './vii/videos_info'


import Videos_buscar from './vii/videos_buscar'

import Crud_videos from './administrador/vi/crud_videos'
import Crud_sugerencias from './administrador/sugerencias/Crud_sugerencias'

import Ticket from './ticket/Ticket';



import Sugerencias from './sugerencias/Sugerencias'


import Concejos from './concejos_pintura/Concejos'

import Inicio from './administrador/inicio/inicio'

import CrudReseña from './administrador/resenas/crud_resenas'
function App() {
  return (
    <div className="App">
      

      
      

      <Routes>
      
        <Route path='/' element={<Tabla_usuarios />} />
        <Route path='/actualizar_usuario/:id' element={<EditarUsuario />} />
        <Route path="/register" element={<CrearUsuario />} />
       
        <Route path='/login' element={<Login />} />

        <Route path='/navbar' element={< Navbar contante="hola" />} />
        <Route path='/principal' element={<Principal/> } />
      
        <Route path='/footer' element={<Footer/>} />
        <Route path='/producto/:datos' element={<Producto_buscar/>} />
        <Route path='/producto/info/:id' element={<Producto_info/>} />
        <Route path='/insertar_Producto' element={<Insertar_Producto/>} />    
        <Route path='/crud_producto' element={<Crud_producto/>} />
        <Route path='/deseados' element={<RutaProtegida><Deseados/> </RutaProtegida>} />
        <Route path='/opciones' element={<RutaProtegida><Opciones/> </RutaProtegida>} />

        <Route path='/carrito' element={<RutaProtegida><Carrito/> </RutaProtegida>} />
        <Route path='/exito1' element={<RutaProtegida><Exito1/> </RutaProtegida>} />





        <Route path='/crud_usuarios' element={<Crud_usuario/>} />
        <Route path='/editar_producto/:id' element={<Editar_producto/>} />


        <Route path='/crud_ventas' element={<Crud_ventas/>} />
        <Route path='/Estadisticas' element={<RutaProtegida><Estadisticas/></RutaProtegida>} />

        <Route path='/prueba' element={<Prueba/>} />


        <Route path='/calculadora' element={<Calcularora/>} />

        <Route path='/agregar_video' element={<RutaProtegida><Agregar_video/> </RutaProtegida>} />

        <Route path='/video' element={<Videos_buscar/>} />

        <Route path='/video/:id' element={<Videos_info/>} />


        <Route path='/crud_videoS' element={<RutaProtegida><Crud_videos/> </RutaProtegida>} />


        <Route path='/ticket/:id_venta' element={<RutaProtegida><Ticket/> </RutaProtegida>} />

        <Route path='/crud_sugerencias' element={<RutaProtegida><Crud_sugerencias/> </RutaProtegida>} />




        <Route path='/sugerencias' element={<RutaProtegida><Sugerencias/> </RutaProtegida>} />



        <Route path='/concejos' element={<RutaProtegida><Concejos/> </RutaProtegida>} />



        <Route path='/inicio' element={<RutaProtegida><Inicio/> </RutaProtegida>} />


        <Route path='/crud_resenas' element={<RutaProtegida><CrudReseña/> </RutaProtegida>} />

      </Routes>





      <Footer/>
    </div>
    
  );
}

export default App;
