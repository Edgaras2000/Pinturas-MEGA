import { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Productos_populares from './graficas/produtos_populares';
import Ventas from './graficas/ventas';
import Tipos_usuarios from './graficas/Tipos_usuarios';

const Estadisticas = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [oscuro, setOscuro] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleTema = () => setOscuro(!oscuro);

    return (
        <div className={`w-full h-auto ${!oscuro ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center p-4 gap-3`}>
            <div className='w-full'>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>

            <button onClick={toggleTema} className="p-2 bg-gray-500 text-white rounded mb-4">
                {!oscuro ? 'modo claro' : 'modo oscuro'}
            </button>

            <div className={`w-full md:w-10/12 h-full rounded-md grid gap-4 ring-2 p-4   shadow-4xl ${oscuro ? '':'shadow-white'}
                ${oscuro ? 'ring-black' : 'ring-white'}
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-3`}>
                
                <div className={`col-span-1 lg:col-span-2 row-span-2  ring-2 
                    ${oscuro ? 'ring-black' : 'ring-white'} p-4 flex justify-center items-center`}>
                    <Tipos_usuarios oscuro={oscuro} />
                </div>

                <div className={`col-span-1 lg:col-span-2 row-span-2  ring-2 
                    ${oscuro ? 'ring-black' : 'ring-white'} p-4`}>
                    <Productos_populares tema={oscuro} />
                </div>

                <div className={`col-span-1 sm:col-span-2 lg:col-span-4 row-span-1  ring-2 
                    ${oscuro ? 'ring-black' : 'ring-white'} p-4`}>
                    <Ventas oscuro={oscuro} />
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;
