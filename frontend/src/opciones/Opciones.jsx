import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Navbar from '../login/navbar';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import Tarjeta from './Tarjeta'
import { Navigate, useNavigate } from 'react-router-dom';


import Ventas from './ventas_usuario';

const Opciones = () => {
    const navigate = useNavigate();

    const [selectedView, setSelectedView] = useState('view1');
    const [idUsuario, setIdUsuario] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState({ lat: 20.7052, lng: -102.3468 });
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [numero, setNumero] = useState('');
    const [placeSelected, setPlaceSelected] = useState(false); // Indicador si se ha seleccionado un lugar

    const [direcciones, setdirecciones] = useState([]);

    const [usuario, setusuario] = useState([]);


    const [password, setpassword] = useState(false);


    const [tarjeta, settarjeta] = useState('');
    const [error, setError] = useState('');
    const [mapKey, setMapKey] = useState(0);
    const handleButtonClick = (view) => {
        setSelectedView(view);
        vaciar();
    };


    const url = `http://localhost:8000/pintura/opciones/direccion/agregar/`;


    const url2 = `http://localhost:8000/pintura/opciones/direccion/todo/${idUsuario}`;
    const url3 = `http://localhost:8000/pintura/opciones/direccion/eliminar/`;
    const url4 = `http://localhost:8000/pintura/opciones/tarjeta/todo/${idUsuario}`;
    const url6 = `http://localhost:8000/pintura/opciones/tarjeta/actualizar/`;

    const vaciar = () => {
        setAddress('')
        setPostalCode('')
        setCity('')
        setState('')
        setNumero('')
        setPlaceSelected(false)

    }

    const agregar_direccion = async () => {
        if (numero && address) {
            try {
                await axios.post(url, {
                    id_usuario: idUsuario,
                    latitud: selectedPosition.lat,
                    longitud: selectedPosition.lng,
                    direccion: address,
                    codigo_postal: postalCode,
                    ciudad: city,
                    estado_d: state,
                    numero: parseFloat(numero),
                });

                vaciar();
                todas_direcciones();
                Swal.fire({
                    title: "Éxito",
                    text: "Dirección subida",
                    icon: "success"
                });

            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Error al ingresar la dirección",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Error",
                text: "Olvidaste llenar los datos",
                icon: "question"
            });
        }
    }




    const obtenerUsuario = async () => {
        try {
            const url = 'http://localhost:8000/pintura/';
            const res = await axios.get(`${url}${idUsuario}`);
            const usuarioData = res.data;

            setusuario(usuarioData);
        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
        }
    };


    const todas_direcciones = async () => {
        try {
            const todo_direccion = await axios.get(url2);
            setdirecciones(todo_direccion.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {

                setdirecciones([]);
            } else {
                console.error('Error fetching directions:', error);
            }
        }
    };

    const todas_tarjetas = async () => {
        try {
            const todas_tarjetass = await axios.get(url4);
            settarjeta(todas_tarjetass.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {

                settarjeta([]);
            } else {
                console.error('Error fetching directions:', error);
            }
        }
    };


    const eliminar_direcciones = async (direcc) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.post(url3, {
                    id_usuario: idUsuario,
                    id_direccion: direcc
                });


                await todas_direcciones();

                Swal.fire(
                    'Eliminado',
                    'La dirección ha sido eliminada.',
                    'success'
                );
            }

        } catch (error) {
            console.error('Error eliminando la dirección:', error);
            await todas_direcciones();
            Swal.fire(
                'Error',
                'Hubo un problema al eliminar la dirección.',
                'error'
            );
        }
    };

    const eliminar_tarjeta = async (tarje) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.post(url6, {
                    id_usuario: idUsuario,
                    id_tarjeta: tarje,
                });

                // Llama a todas_direcciones después de eliminar
                await todas_direcciones();
                await todas_tarjetas();

                Swal.fire(
                    'Eliminado',
                    'La tarjeta ha sido eliminada.',
                    'success'
                );
            }

        } catch (error) {
            console.error('Error eliminando la dirección:', error);

            Swal.fire(
                'Error',
                'Hubo un problema al eliminar la dirección.',
                'error'
            );
        }
    };




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken._id);
        }


        todas_direcciones();
    }, []);


    useEffect(() => {
        setMapKey(mapKey + 1);
        if (idUsuario) {

            todas_direcciones();
            todas_tarjetas();
            obtenerUsuario();
        }
    }, [idUsuario]);

    const containerStyle = {
        width: '100%',
        height: '70%',
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
    };

    const containerClassName = "ring-2 ring-transparent hover:ring-emerald-500 focus:ring-emerald-500"; // Clases de Tailwind


    const center = {
        lat: 20.7052,
        lng: -102.3468
    };

    const getGeocode = (lat, lng,callback) => {
        if (!window.google || !window.google.maps) {
            console.error('Google Maps API no está disponible');
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const addressComponents = results[0].address_components;
                setAddress(results[0].formatted_address);

                const postalCodeComponent = addressComponents.find(component =>
                    component.types.includes('postal_code')
                );
                if (postalCodeComponent) {
                    setPostalCode(postalCodeComponent.long_name);
                }

                const cityComponent = addressComponents.find(component =>
                    component.types.includes('locality')
                );
                if (cityComponent) {
                    setCity(cityComponent.long_name);
                }

                const stateComponent = addressComponents.find(component =>
                    component.types.includes('administrative_area_level_1')
                );
                if (stateComponent) {
                    setState(stateComponent.long_name);
                }

                setPlaceSelected(true);
            } else {
                console.error('Error al obtener la dirección: ', status);
            }

            if (callback) {
                callback();
            }
        });
    };

    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setSelectedPosition({ lat, lng });
    
       
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la dirección...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); 
            }
        });
    
        getGeocode(lat, lng, () => {
            Swal.close();  
        });
    };
    


    const openInGoogleMaps = (lat, lng) => {
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleMapError = () => {
        // Si el mapa no se carga, recargar la página
        window.location.reload();
    };





    const nose = () => {
        setShowTarjeta(!showTarjeta);
        setputada(!putada);
        todas_tarjetas();

    };
    const [showTarjeta, setShowTarjeta] = useState(false);

    const [putada, setputada] = useState(true);

    const ir = () => {
        navigate(`/actualizar_usuario/${idUsuario}`);
    };





    const [nuevapasstord, setnuevapasstord] = useState('')

    const url5 = "http://localhost:8000/pintura/opciones/usuario/actualizar/"
    const cambiar_pasword = async (e) => {
        e.preventDefault();

        try {


            const pass = await axios.post(url5, {

                id_usuario: idUsuario,
                contraseñaa: nuevapasstord,





            })

            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            });

            setnuevapasstord('');

        } catch (error) {


            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",

            });
        }


    }

    return (
        <div>
            <div id="navbar" className="w-full h-1/4 bg-transparent sticky top-0 transition-colors duration-300 z-10">
                <Navbar />
            </div>


            <div className="w-full h-screen bg-white flex flex-col justify-center items-center">
                <div className="w-8/12 h-5/6 bg-white grid grid-cols-3 grid-rows-1 rounded-md shadow-lg ring-2 ring-black">

                    <div className="bg-slate-300 overflow-hidden border-r-4 ring-1 ring-black border-black col-span-1 flex flex-col items-center  gap-4">

                        <div className=' w-11/12 rounded-lg h-1/6 grid grid-cols-6 grid-rows-1 mt-2 shadow-2xl ring-4 ring-black hover:ring-emerald-500' onClick={() => handleButtonClick('view1')}>
                            <div className='col-span-2 bg-white  flex flex-col justify-center items-center rounded-l-md'>
                                <div className='w-3/4 h-3/4 rounded-full flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/onmwuuox.json"
                                        trigger="loop"
                                        style={{ width: "250px", height: "250px" }}>
                                    </lord-icon>
                                </div>
                            </div>

                            <div className='col-span-4 bg-white rounded-r-md flex justify-center items-center '>

                                <h1 className='text-xl font-semibold'>Añadir direccion</h1>


                            </div>
                        </div>

                        <div className=' w-11/12 rounded-lg h-1/6 grid grid-cols-6 grid-rows-1 mt-2 shadow-2xl ring-4 ring-black hover:ring-emerald-500' onClick={() => handleButtonClick('view2')}>
                            <div className='col-span-2 bg-white  flex flex-col justify-center items-center rounded-l-md'>
                                <div className='w-3/4 h-3/4 rounded-full flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/rbsqvtgo.json"
                                        trigger="loop"
                                        style={{ width: "250px", height: "250px" }}>
                                    </lord-icon>
                                </div>
                            </div>

                            <div className='col-span-4 bg-white rounded-r-md flex justify-center items-center '>

                                <h1 className='text-xl font-semibold'>Gestionar direccion</h1>


                            </div>
                        </div>

                        <div className=' w-11/12 rounded-lg h-1/6 grid grid-cols-6 grid-rows-1 mt-2 shadow-2xl ring-4 ring-black hover:ring-emerald-500' onClick={() => handleButtonClick('view3')}>
                            <div className='col-span-2 bg-white  flex flex-col justify-center items-center rounded-l-md'>
                                <div className='w-3/4 h-3/4 rounded-full flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/bsdkzyjd.json"
                                        trigger="loop"
                                        style={{ width: "250px", height: "250px" }}>
                                    </lord-icon>
                                </div>
                            </div>

                            <div className='col-span-4 bg-white rounded-r-md flex justify-center items-center '>

                                <h1 className='text-xl font-semibold'>Metodos de pago</h1>


                            </div>
                        </div>







                        <div className=' w-11/12 rounded-lg h-1/6 grid grid-cols-6 grid-rows-1 mt-2 shadow-2xl ring-4 ring-black hover:ring-emerald-500' onClick={() => handleButtonClick('view4')}>
                            <div className='col-span-2 bg-white  flex flex-col justify-center items-center rounded-l-md'>
                                <div className='w-3/4 h-3/4 rounded-full flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/kdduutaw.json"
                                        trigger="loop"
                                        style={{ width: "250px", height: "250px" }}>
                                    </lord-icon>
                                </div>
                            </div>

                            <div className='col-span-4 bg-white rounded-r-md flex justify-center items-center '>

                                <h1 className='text-xl font-semibold'>Datos del usuario</h1>


                            </div>
                        </div>



                        <div className=' w-11/12 rounded-lg h-1/6 grid grid-cols-6 grid-rows-1 mt-2 shadow-2xl ring-4 ring-black hover:ring-emerald-500' onClick={() => handleButtonClick('view5')}>
                            <div className='col-span-2 bg-white  flex flex-col justify-center items-center rounded-l-md'>
                                <div className='w-3/4 h-3/4 rounded-full flex justify-center items-center'>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ggirntso.json"
                                        trigger="loop"
                                        style={{ width: "250px", height: "250px" }}>
                                    </lord-icon>
                                </div>
                            </div>

                            <div className='col-span-4 bg-white rounded-r-md flex justify-center items-center '>

                                <h1 className='text-xl font-semibold'>Pedidos</h1>


                            </div>
                        </div>



                    </div>

                    <div className="col-span-2 flex flex-col justify-center items-center">
                        <LoadScript googleMapsApiKey="AIzaSyABA3bp66epMUkeHaKl7NGgP70ZuuBkf0c" >
                            {selectedView === 'view1' && (
                                <div className="w-11/12 h-full flex flex-col items-center">
                                    <h1 className="mb-4 text-center font-bold">
                                        Selecciona tu ubicación: <span className="text-emerald-600">{address}</span>
                                    </h1>

                                    <GoogleMap 
                                        key={mapKey}
                                        mapContainerStyle={containerStyle}
                                        center={selectedPosition}
                                        className={`ring-2 focus:ring-emerald-500 w-full h-full ${containerClassName}`} 



                                        zoom={10}
                                        onClick={onMapClick}
                                        onLoad={() => console.log('Mapa cargado correctamente')}
                                        onError={handleMapError}
                                    >
                                        <Marker position={selectedPosition} />
                                    </GoogleMap>

                                    {placeSelected ? (
                                        <div className=' mt-5 flex flex-col justify-center items-center gap-2'>
                                            <div className="w-full h-[33%] flex items-center justify-center ">
                                                <div className="text-emerald-500 font-bold">
                                                    Datos Obtenidos
                                                </div>
                                                <div className="ml-2 bg-emerald-300 rounded-full p-2">
                                                    <i className="fa-solid fa-check text-emerald-500 text-2xl"></i>
                                                </div>
                                            </div>


                                            <input
                                                type="number"
                                                value={numero}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    if (newValue >= 0) {
                                                        setNumero(newValue);
                                                    }
                                                }}
                                                className="shadow-4xl p-2 border rounded  ring-2 focus:ring-magenta_caca outline-none text-center text-lg"
                                                placeholder="Número"
                                            />

                                            <button
                                                onClick={agregar_direccion}
                                                className="mt-4 p-2  text-white shadow-2.5xl rounded   bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500"
                                            >
                                                Agregar Dirección
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-8 flex items-center mt-6">
                                            <div className="text-red-500 font-bold">
                                                Selecciona una ubicación
                                            </div>
                                            <div className="ml-2 bg-red-300 rounded-full p-2">
                                                <i className="fa-solid fa-xmark text-red-500 font-bold text-2xl"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </LoadScript>
                        {selectedView === 'view2' &&


                            <div className="w-11/12 h-full flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-thumb-amarillo_caca scrollbar-track-gray-500">


                                {direcciones.length > 0 ? (

                                    <ul className="w-full flex flex-col items-center">
                                        <h1 className="mb-4 text-center font-bold">
                                            Tus direcciones guardadas:
                                        </h1>
                                        {direcciones.map((direccion, index) => (
                                            <li key={index} className="w-11/12 bg-gray-100 p-4 rounded-lg mb-2 shadow-xl ring-2 hover:ring-emerald-600 flex items-center">
                                                <div className="mr-2 text-emerald-600 w-7/12">
                                                    <i class="fa-solid fa-house text-4xl"></i> {/* Ícono de ubicación */}
                                                    <p><strong></strong> {direccion.direccion}</p>
                                                </div>
                                                <div className='flex flex-col justify-center items-center w-5/12'>

                                                    <p><strong>N:</strong> {direccion.numero}</p>

                                                    <p><strong>Código Postal</strong> {direccion.codigo_postal} {direccion.estado_d} </p>
                                                    <p><strong>Ciudad:</strong> {direccion.ciudad}</p>



                                                    <div className="mt-2">
                                                        <button className="bg-red-600 p-2 m-2 rounded-md text-white" onClick={() => eliminar_direcciones(direccion._id)}>Eliminar</button>
                                                        <button className="bg-blue-600 p-2 m-2 rounded-md text-white" onClick={() => openInGoogleMaps(direccion.latitud, direccion.longitud)}>Buscar</button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className=' h-full w-full flex flex-col justify-center items-center gap-4'>
                                        <div className='w-auto h-auto  rounded-full p-5 bg-gray-200 ring-8 ring-black'>


                                            <lord-icon
                                                src="https://cdn.lordicon.com/jeuxydnh.json"
                                                trigger="loop"
                                                style={{ width: '200px', height: '200px' }}
                                            />

                                        </div>
                                        <h1 className='text-2xl font-semibold'>Aun no tienes una Direccion</h1>
                                        <h2 className='text-lg'>Agregalos haciendo click en el icono de la parte superior o en su campo respectivo</h2>


                                    </div>
                                )}

                            </div>

                        }

                        {selectedView === 'view3' && (
                            <div id='metodos' className='w-full h-full overflow-y-auto bg-slate-300'>
                                <button onClick={nose} className='w-auto h-9 text-black flex items-center p-4 m-2 rounded-md bg-white'>
                                    {showTarjeta ? (
                                        <div className='text-red-700'>
                                            Cerrar
                                            <i className="fa-solid fa-minus"></i>
                                            <i className="fa-solid fa-credit-card"></i>
                                        </div>
                                    ) : (
                                        <div className='bg-white text-emerald-600 space-x-2 shadow-2xl'>
                                            <h2 className='space-x-2'>AÑADIR NUEVO METODO DE PAGO
                                                <i className="fa-solid fa-plus"></i>
                                                <i className="fa-solid fa-credit-card"></i>
                                            </h2>
                                        </div>
                                    )}
                                </button>

                                <div id='metodos_listos' className='w-full h-auto  flex flex-col justify-center items-center'>
                                    {tarjeta.length === 0 ? (


                                        putada && (

                                            <div className='gap-4'>




                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xuyycdjx.json"
                                                    trigger="loop"
                                                    style={{ width: '250px', height: '250px' }}
                                                />
                                                <h1 className='text-2xl font-semibold'>Aun no tienes una Tarjeta de credito</h1>
                                                <h2 className='text-lg'>Agregalos haciendo click en el icono de la parte superior o en su campo respectivo</h2>


                                            </div>
                                        )


                                    ) : (

                                        tarjeta.map((metodo) => (

                                            putada && (
                                                <div key={metodo.id} className='w-11/12 h-auto m-2 rounded-md grid grid-cols-4 grid-rows-1 shadow-2.5xl bg-white'>
                                                    <div className='col-span-1 flex flex-col justify-center items-center'>
                                                        <div className='bg-white ring-2 ring-gray-300 rounded-full h-3/4 w-2/4 flex justify-center items-center overflow-hidden text-4xl'>
                                                            {metodo.numero.charAt(0) === '4' ? (
                                                                <img src="/img/visa.svg" alt="Visa" className='h-5/6' />
                                                            ) : metodo.numero.charAt(0) === '5' ? (
                                                                <img src="/img/mastercard.svg" alt="Visa" className='h-5/6' />
                                                            ) : metodo.numero.charAt(0) === '3' ? (
                                                                <i class="fa-solid fa-credit-card text-emerald-700"></i>
                                                            ) : metodo.numero.charAt(0) === '6' ? (
                                                                <i class="fa-solid fa-credit-card text-red-700"></i>
                                                            ) : (
                                                                <i class="fa-solid fa-credit-card"></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-span-2'>

                                                        <h2 className='m-1 font-mono text-left'>Termina en: {metodo.numero.slice(12)}</h2>
                                                        <h2 className='m-1 font-mono text-left'>Dueño: {metodo.nombre}</h2>
                                                        <h2 className='text-left m-1 font-mono'>
                                                            Vencimiento: {metodo.expira.slice(0, 2) + '/' + metodo.expira.slice(2)}
                                                        </h2>
                                                    </div>
                                                    <div className='col-span-1 flex flex-col justify-center items-center'>
                                                        <button onClick={() => eliminar_tarjeta(metodo._id)}>
                                                            <i className="fa-solid fa-trash text-red-600 text-4xl"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )))
                                    )}
                                </div>

                                {showTarjeta && (
                                    <div id='añadir tarjeta' className='m-1'>
                                        <Tarjeta idUsuario={idUsuario} />
                                    </div>
                                )}
                            </div>
                        )}


                        {selectedView === 'view4' && (
                            <div className='bg-slate-300 w-full h-full flex justify-center '>


                                <div className='bg-white w-10/12 min-h-64 h-10/12 rounded-md  ring-2 ring-black mt-3 mb-3 flex flex-col justify-center items-center'>


                                    <div className='w-full h-1/4 flex flex-col justify-center items-center'>

                                        <div className='ring-2 ring-black w-32 h-32 rounded-full shadow-4xl   bg-slate-300 overflow-hidden flex flex-col justify-center items-center' >

                                            <lord-icon
                                                src="https://cdn.lordicon.com/kdduutaw.json"
                                                trigger="loop"
                                                style={{ width: "80%", height: "80%" }}>
                                            </lord-icon>
                                        </div>



                                    </div>

                                    <div className='w-full h-3/4 flex flex-col gap-2 '>


                                        <label htmlFor="usuarioNombre" className="block text-lg font-medium text-gray-700">
                                            usuario:

                                            <div className='w-11-12 bg-slate-100 ring-2 ring-black m-4 rounded-md flex items-center gap-4 p-4'>


                                                <i className="fa-solid fa-user text-emerald-400 text-4xl"></i>

                                                <div className='flex flex-col justify-center text-center'>
                                                    <h2 className='text-lg font-semibold text-gray-800'>{usuario.usuario}</h2>
                                                </div>
                                            </div>
                                        </label>






                                        <label htmlFor="usuarioNombre" className="block text-lg font-medium text-gray-700">
                                            correo:

                                            <div className='w-11-12 bg-slate-100 ring-2 ring-black m-4 rounded-md flex items-center gap-4 p-4'>



                                                <i class="fa-solid fa-envelope text-emerald-400 text-4xl"></i>

                                                <div className='flex flex-col justify-center text-center'>
                                                    <h2 className='text-lg font-semibold text-gray-800'>{usuario.correo}</h2>
                                                </div>
                                            </div>
                                        </label>




                                        <label htmlFor="usuarioNombre" className="block text-lg font-medium text-gray-700">
                                            Fecha de creación:
                                            <div className='w-11-12 bg-slate-100 ring-2 ring-black m-4 rounded-md flex items-center gap-4 p-4'>


                                                <i className="fa-solid fa-calendar-day text-emerald-400 text-4xl"></i>

                                                <div className='flex flex-col justify-center text-center'>

                                                    <h2 className='text-lg font-semibold text-gray-800'>
                                                        {new Date(usuario.fecha).toLocaleDateString('es-ES', {
                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                    </h2>
                                                </div>
                                            </div>
                                        </label>

                                        <div className=''>

                                            {!password ? (


                                                <button
                                                    className='p-2 bg-emerald-600 text-white w-24 rounded-md ring-2 ring-black hover:text-black hover:bg-emerald-300 mb-3'
                                                    onClick={() => setpassword(!password)}>
                                                    Cambiar contraseña
                                                </button>

                                            ) : (


                                                <div>
                                                </div>
                                            )}




                                            {password ? (

                                                <div>

                                                    <form onSubmit={cambiar_pasword} className='flex flex-col gap-4 justify-center items-center'>

                                                        <input
                                                            value={nuevapasstord}
                                                            onChange={(e) => setnuevapasstord(e.target.value)}
                                                            type="text"
                                                            className='w-11/12 outline-none ring-2 ring-black hover:ring-emerald-400 text-center h-auto'
                                                            maxLength={30}
                                                            minLength={4}
                                                            required
                                                            placeholder='Nueva contraseña'
                                                            name='contraseña' />


                                                        <button type='submit'
                                                            className='p-2 bg-emerald-600 text-white w-24 rounded-md ring-2 ring-black hover:text-black hover:bg-emerald-300 mb-3'
                                                        >
                                                            Cambiar
                                                        </button>

                                                    </form>




                                                </div>


                                            ) : (
                                                <div></div>
                                            )}

                                        </div>

                                    </div>



                                </div>


                            </div>
                        )}

                        {selectedView === 'view5' && (
                            <div className='bg-slate-300 w-full h-full flex justify-center '>


                                <Ventas idUsuario={idUsuario} correoUsuario={usuario.correo} />



                            </div>
                        )}

                    </div>
                </div>
            </div >
        </div >
    );
};

export default Opciones;
