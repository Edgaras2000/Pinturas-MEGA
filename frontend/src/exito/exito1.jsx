import Navbar from '../login/navbar';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const Exito1 = () => {
    const [idUsuario, setIdUsuario] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }
    }, []);


    useEffect(() => {

        if (idUsuario) {

            borrar_carrito();

        }

    }, [idUsuario])



    const borrar_carrito = async () => {

        try {

            const url = `http://localhost:8000/pintura/carrito/usuario/eliminarr/${idUsuario}`;


            await axios.post(url)



        } catch (error) {

        }



    }


    return (
        <div>

            <div id="navbar" className="w-full bg-transparent sticky top-0 z-10">
                <Navbar />
            </div>


            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-8">


                <div className="w-80 h-80 bg-slate-100 rounded-full flex justify-center items-center ring-4 ring-black shadow-4xl">
                    <lord-icon
                        src="https://cdn.lordicon.com/fikcyfpp.json"
                        trigger="loop"
                        style={{ width: "250px", height: "250px" }}
                    ></lord-icon>

                </div>

                <h1 className='text-4xl font-semibold text-gray-700'>Compra realizada correctamente</h1>
                <h2 className='text-xl font-sans text-gray-700'> Puedes ver tus pedidos pendientes en el apartado del usuario</h2>

            </div>
        </div>
    );
};

export default Exito1;
