import Sidebar from '../sidebar/sidebar';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Inicio = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [videos, setvideos] = useState(false);
    const [usuario, setusuario] = useState('')
    const [conversa, setconversa] = useState('')

    const [conversa2, setconversa2] = useState('')
    const [conversa3, setconversa3] = useState('')
    const [conversa4, setconversa4] = useState('')
    const handleDownload = () => {

        const link = document.createElement('a');
        link.href = '/path/to/your/manual.pdf';
        link.download = 'manual_usuario.pdf';
        link.click();
    };

    const [idUsuario, setIdUsuario] = useState(null);


    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }
    }, [idUsuario]);



    useEffect(() => {

        if (idUsuario) {
            obtenerUsuario()
            conver1();
            conver2();
            conver3();
            conver4();

        }

    }, [idUsuario])



    const url = 'http://localhost:8000/pintura/';
    const obtenerUsuario = async () => {
        try {
            const res = await axios.get(`${url}${idUsuario}`);
            const usuarioData = res.data;
            setusuario(usuarioData);


        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };




    const conver1 = async () => {
        try {
            const res = await axios.get("http://localhost:8000/pintura/conver/cantidad/");
            const usuarioData = res.data;
            setconversa(usuarioData);


        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };


    const conver2 = async () => {
        try {
            const res = await axios.get("http://localhost:8000/pintura/conver/cantidad2/");
            const usuarioData = res.data;
            setconversa2(usuarioData);


        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };

    
    const conver3 = async () => {
        try {
            const res = await axios.get("http://localhost:8000/pintura/conver/cantidad3/");
            const usuarioData = res.data;
            setconversa3(usuarioData);


        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };

    
    const conver4 = async () => {
        try {
            const res = await axios.get("http://localhost:8000/pintura/conver/cantidad4/");
            const usuarioData = res.data;
            setconversa4(usuarioData);


        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };

  if (usuario.usuario !== "admin") {
    return <div className='w-full h-screen flex justify-center items-center flex-col gap-6'>

        <div className='w-80 h-80 rounded-full overflow-hidden justify-center flex items-center ring-8 ring-black shadow-4xl'>

             <lord-icon
                src="https://cdn.lordicon.com/fgxwhgfp.json"
                 trigger="loop"
                style={{ width: '80%', height: '80%' }}
            ></lord-icon>

         </div>
        <h1 className='text-3xl'>NO TIENES PERMISO PARA ACCEDER A ESTE APARTADO.</h1>

     </div>;
 }


    return (
        <div className="w-full h-screen flex flex-col items-center gap-2 bg-slate-700">




            <div className="w-full">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            <div className="w-11/12 h-[85%] bg-mercado p-4 rounded-lg flex flex-col gap-4 shadow-4xl">
                <div className='inline rounded-md bg-slate-700 p-2 text-cyan-400'>
                    <h1>Administrador</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Usuarios Activos</h2>
                        <p className="text-3xl font-bold text-blue-600">{conversa2.total}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Usuarios usando la IA <i class="fa-brands fa-react text-lg"></i></h2>
                        <p className="text-3xl font-bold text-green-600">{conversa.total}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Productos deseados</h2>
                        <p className="text-3xl font-bold text-yellow-600">{conversa3.total}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold"> Ventas generales</h2>
                        <p className="text-3xl font-bold text-red-600">{conversa4.total}</p>
                    </div>
                </div>

                <div className='w-full flex flex-col flex-grow'>
                    <div
                        onClick={() => setvideos(!videos)}
                        className="w-full flex flex-row text-left items-center gap-2 cursor-pointer"
                    >
                        <h1>MANUAL DE USUARIO:</h1>
                        {!videos ? (
                            <i className="fa-solid fa-angle-right text-slate-700"></i>
                        ) : (
                            <i className="fa-solid fa-angle-down text-cyan-400"></i>
                        )}
                    </div>

                    <hr className={`border-2 ${videos ? 'border-cyan-400' : 'border-gray-300'} my-2`} />

                    <div
                        className={`transition-all duration-500 ease-in-out ${videos ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}
                        style={{ overflow: 'hidden' }}
                    >
                        {videos && (
                            <div className=" rounded-lg shadow-md flex flex-col justify-center items-center p-4 gap-4">

                                <div className=" w-144 bg-cyan-400">
                                    <video
                                        className="w-full h-auto rounded-lg shadow-md"
                                        controls
                                        src="/img/React App - Brave 2024-12-07 00-10-19.mp4"
                                    >
                                        Tu navegador no soporta el elemento de video.
                                    </video>
                                </div>


                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleDownload}
                                        className="bg-slate-600 text-cyan-400 px-4 py-2 rounded-lg shadow-md hover:bg-slate-700"
                                    >
                                        Descargar Manual en PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
