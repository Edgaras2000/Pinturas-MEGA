import React, { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const Tarjeta = ({ idUsuario }) => {
    const [state, setState] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
        focus: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "expiry") {
            // Formatea el valor como MM/YY
            const formattedValue = value
                .replace(/\D/g, "") // Elimina caracteres no numéricos
                .slice(0, 4)        // Limita a los primeros 4 dígitos
                .replace(/(\d{2})(\d{1,2})/, "$1/$2"); // Agrega el "/" después de los primeros dos dígitos
            setState({ ...state, [name]: formattedValue });
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const handleFocusChange = (e) => {
        setState({
            ...state,
            focus: e.target.name
        });
    };

    const vaciar_tarjeta = () => {
        setState({
            number: "",
            name: "",
            expiry: "",
            cvc: "",
            focus: ""
        });
    };

    const validarPrefijoTarjeta = (numero) => {
        const prefijo = numero.slice(0, 4);
        const prefijosValidos = {
            Visa: /^4/,
            Mastercard: /^(5[1-5]|23)/,
            AmericanExpress: /^(34|37)/,
        };

        if (prefijosValidos.Visa.test(prefijo)) {
            return 'Visa';
        } else if (prefijosValidos.Mastercard.test(prefijo)) {
            return 'Mastercard';
        } else if (prefijosValidos.AmericanExpress.test(prefijo)) {
            return 'American Express';
        } else {
            return null; 
        }
    };

    const insertar_tarjeta = async (e) => {
        e.preventDefault();

        // Verifica el formato MM/YY
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM (01-12) y YY (2 dígitos)
        if (!expiryRegex.test(state.expiry)) {
            Swal.fire('Error', 'Formato de fecha inválido. Debe ser MM/YY', 'error');
            return;
        }

        const tipoTarjeta = validarPrefijoTarjeta(state.number);
        if (!tipoTarjeta) {
            Swal.fire('Error', 'El número de tarjeta no pertenece a un tipo válido', 'error');
            return;
        }

        const url = `http://localhost:8000/pintura/opciones/tarjeta/agregar/`;

        try {
            await axios.post(url, {
                id_usuario: idUsuario,
                numero: state.number,
                nombre: state.name,
                expira: state.expiry,
                cvc: state.cvc,
            });
            vaciar_tarjeta();
            Swal.fire('Éxito', `Tarjeta ${tipoTarjeta} agregada correctamente`, 'success');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire('Error', 'Tarjeta ya existente en este o otro usuario', 'error');
            } else {
                Swal.fire('Error', 'No se pudo agregar la tarjeta', 'error');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-4xl outline-none bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-[length:400%_400%] animate-gradient-x">
            <div className="mb-6">
                <Cards
                    className="outline-none"
                    number={state.number}
                    name={state.name}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    focused={state.focus}
                />
            </div>
            <form onSubmit={insertar_tarjeta}>
                <div className="mb-4">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número de la tarjeta</label>
                    <input
                        type="text"
                        name="number"
                        id="number"
                        maxLength="16"
                        value={state.number}
                        className="text-center mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 outline-none"
                        onChange={handleInputChange}
                        onFocus={handleFocusChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        maxLength="30"
                        value={state.name}
                        className="mt-1 text-center block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 outline-none"
                        onChange={handleInputChange}
                        onFocus={handleFocusChange}
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <div className="mb-4 w-1/2 pr-2">
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
                        <input
                            type="text"
                            name="expiry"
                            id="expiry"
                            maxLength="5"
                            value={state.expiry}
                            className="mt-1 text-center block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 outline-none"
                            onChange={handleInputChange}
                            onFocus={handleFocusChange}
                            required
                        />
                    </div>
                    <div className="mb-4 w-1/2 pl-2">
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                        <input
                            type="text"
                            name="cvc"
                            id="cvc"
                            maxLength="4"
                            value={state.cvc}
                            className="mt-1 text-center block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 outline-none"
                            onChange={handleInputChange}
                            onFocus={handleFocusChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-blue-700 hover:from-pink-500 hover:to-orange-500 text-white font-thin py-2 px-4 rounded-md">
                    Agregar
                </button>
            </form>
        </div>
    );
};

export default Tarjeta;
