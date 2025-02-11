import { useEffect, useState } from 'react';
import {  Navigate, useNavigate } from 'react-router-dom';

import Navbar from '../login/navbar';
import Carrucel from './carrucel';
import Contenidos from './conteniidos';
import axios from 'axios';

const Principal = () => {
  const [pintura, setPintura] = useState([]);
  const navigate = useNavigate();
  const url = "http://localhost:8000/pintura/producto/azar/";

  useEffect(() => {

    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 0) {
        navbar.classList.remove('bg-transparent');
        navbar.classList.add('bg-blue-500');
      } else {
        navbar.classList.remove('bg-blue-500');
        navbar.classList.add('bg-transparent');
      }
    };


    colores();


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  const colores = async () => {

    const cosas = await axios.get(url)

    setPintura(cosas.data);

  }



  const reducir = () => {

    const pinturasFiltradas = pintura.filter(producto => producto.tipo === "pintura");


    const pinturasAleatorias = pinturasFiltradas.sort(() => Math.random() - 0.5);


    const pinturasSeleccionadas = pinturasAleatorias.slice(0, 8);

    return pinturasSeleccionadas;
  };


  const reducir2 = () => {

    const pinturasFiltradas = pintura.filter(producto => producto.tipo === "pintura");


    const pinturasAleatorias = pinturasFiltradas.sort(() => Math.random() - 0.5);


    const pinturasSeleccionadas2 = pinturasAleatorias.slice(0, 8);

    return pinturasSeleccionadas2;
  };

  const dirig = (id) => {
    console.log("el id es:"+id)
    navigate(`/producto/info/${id}`);
  };

  return (
    <div>

      <link rel="stylesheet" href="/style/principal/principal.css" />
      <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-10">
        <Navbar constante="" /> {/* Pasa constante si lo necesitas */}
      </div>

      <div className="w-full grid gap-2 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 grid-rows-1 bg-white h-auto">

        <div className="hidden md:block lg:col-span-1 xl:col-span-2 h-auto">

          <div className="carrusel bg-white">
            {reducir().map((item, index) => (
              <div
                key={index}
                className="item  h-48 w-full border-2 border-r-0 border-b-0 border-l-0 border-black flex justify-center items-center flex-col overflow-hidden gap-3"

              >

                <section className=' h-9/12  w-9/12 ring-2 ring-black  min-w-32 min-h-32 shadow-4xl'
                  style={{ backgroundColor: item.color }}
                  onClick={ ()=> dirig(item._id)}
                >


                </section>

                <h2 className='italic  text-lg'
                  style={{ color: item.color }}
                >{item.nombre}</h2>


              </div>
            ))}
          </div>
        </div>



        <div className="col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-8 h-auto gap-2 flex flex-col justify-center items-center">

          <div id='logo' className='h-auto w-6/12 rounded-md  flex flex-col justify-center items-center bg-slate-500 mt-1'>

          </div>


          <Carrucel />


          <div className='w-full'>
            <Contenidos />
          </div>

        </div>






        <div className="hidden md:block lg:col-span-1 xl:col-span-2 h-auto bg-red-500">
          <div className="carrusel bg-white">
            {reducir2().map((item, index) => (
              <div
                key={index}
                className="item  h-48 w-full border-2 border-r-0 border-b-0 border-l-0 border-black flex justify-center items-center flex-col overflow-hidden gap-3"

              >

                <section className=' h-9/12  w-9/12 ring-2 ring-black  min-w-32 min-h-32 shadow-4xl'
                  style={{ backgroundColor: item.color }}
                >


                </section>

                <h2 className='italic  text-lg'
                  style={{ color: item.color }}
                >{item.nombre}</h2>


              </div>
            ))}
          </div>
        </div>



      </div>


    </div>
  );
};

export default Principal;
