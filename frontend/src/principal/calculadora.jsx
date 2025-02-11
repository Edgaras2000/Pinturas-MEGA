import { useState } from 'react';
import { Line } from 'react-chartjs-2';

const Calculadora = () => {
    const [valor, setValor] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [cosa, setCosa] = useState('');

    const vaciar = () => {
        setCantidad('');
        setCosa('');
    };

    const calcular = (cantidad) => {
        const rendimientoPorLitro = 10;
        const cantidadNum = parseFloat(cantidad);

        if (valor === "option1") {
            const litrosNecesarios = cantidadNum / rendimientoPorLitro;
            return litrosNecesarios.toFixed(2);
        } else if (valor === "option2") {
            const metrosCuadradosCubiertos = cantidadNum * rendimientoPorLitro;
            return metrosCuadradosCubiertos.toFixed(2);
        } else {
            return 0;
        }
    };

    const borderColor = '#000000';
    const labelColor = '#000000';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: valor === "option1" ? 'Comparación de Metros y Litros' : 'Comparación de Litros y Metros²',
            },
            legend: {
                labels: {
                    color: '#000',
                },
            },
        },
    };

    const data = {
        labels: [valor === "option1" ? 'Valor Ingresado' : '', 'Valor Calculado'],
        datasets: [
            {
                label: valor === "option1" ? 'Metros ingresados' : 'Litros ingresados',
                data: [parseFloat(cantidad) || 0, 0],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
            },
            {
                label: valor === "option1" ? 'Litros necesarios' : 'Metros² cubiertos',
                data: [0, parseFloat(cosa) || 0],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="w-full h-screen bg-slate-400 flex justify-center items-center">
            <div className="w-9/12 h-9/12 min-w-[75%] min-h-[75%] bg-white ring-2 ring-black shadow-4xl grid grid-cols-2 grid-rows-1">
                <div className="col-span-1 flex flex-col justify-center items-center gap-4 ">
                    <div>
                        {valor === 'option1' ? (

                            <div>
                                <h1 className='text-emerald-500'>Cuantos litros necesito para cubrir esa distancia?</h1>
                            </div>

                        ) : (

                            <div>
<h1 className='text-emerald-500'>Cuantos Metros rinde esa cantidad de pintura?</h1>

                            </div>
                        )}


                    </div>
                    <div className="flex flex-row gap-4 ">
                        <label className="flex items-center gap-2 cursor-pointer text-lg">
                            <input
                                type="radio"
                                name="option"
                                value="option1"
                                onClick={vaciar}
                                onChange={() => setValor('option1')}
                                checked={valor === 'option1'}
                                className="hidden"
                            />
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${valor === 'option1' ? 'border-emerald-500' : 'border-black'
                                    } transition-all duration-200`}
                            >
                                {valor === 'option1' && (
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full transition-all duration-200"></div>
                                )}
                            </div>
                            <span className={valor === 'option1' ? 'text-emerald-500' : 'text-black'}>
                                Calcular por metros²
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="option"
                                value="option2"
                                onClick={vaciar}
                                onChange={() => setValor('option2')}
                                checked={valor === 'option2'}
                                className="hidden"
                            />
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${valor === 'option2' ? 'border-emerald-500' : 'border-black'
                                    } transition-all duration-200`}
                            >
                                {valor === 'option2' && (
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full transition-all duration-200"></div>
                                )}
                            </div>
                            <span className={valor === 'option2' ? 'text-emerald-500' : 'text-black'}>
                                Calcular por Litros
                            </span>
                        </label>
                    </div>

                    {valor ? (
                        <input
                            type="number"
                            className='w-8/12 p-2 h-auto outline-none ring-2 ring-black hover:ring-emerald-400 focus:ring-emerald-400 text-center text-xl shadow-4xl'
                            placeholder='cantidad'
                            min={1}
                            value={cantidad}
                            onChange={(e) => {
                                setCantidad(e.target.value);
                                setCosa(calcular(e.target.value));
                            }}
                            maxLength={14}
                        />
                    ) : (
                        <div></div>
                    )}
                </div>

                <div className="col-span-1 ring-2 ring-black  flex flex-col justify-center items-center text-white">
                    {valor && cosa ? (
                        <div className='text-black'>
                            <h2>{valor === 'option1' ? 'Cálculo de litros necesarios' : 'Cálculo de metros cuadrados cubiertos'}</h2>
                            <p>
                                {valor === 'option1'
                                    ? (
                                        <>
                                            Necesitas <span className="text-green-500 font-semibold">{cosa}</span> litros de pintura para cubrir esa cantidad de metros cuadrados.
                                        </>
                                    )
                                    : (
                                        <>
                                            Con <span className="text-green-500 font-semibold">{cantidad}</span> litros de pintura puedes cubrir aproximadamente <span className="text-green-500 font-semibold">{cosa}</span> metros cuadrados.
                                        </>
                                    )
                                }
                            </p>

                            <div style={{ height: '200px', width: '100%' }}>
                                <Line data={data} options={options} />
                            </div>
                        </div>
                    ) : (
                        <div className='text-black flex flex-col justify-center items-center gap-4'>
                            <div className='rounded-full ring-2 ring-black w-40 h-40 bg-slate-300 flex flex-col justify-center items-center shadow-4xl'>

                                <lord-icon
                                    src="https://cdn.lordicon.com/wjyqkiew.json"
                                    trigger="loop"
                                    style={{ width: '80%', height: '80%' }}
                                ></lord-icon>

                            </div>
                            <h2>Por favor, selecciona una opción y llena los campos necesarios</h2>
                            <p>Elige si deseas calcular litros necesarios o metros cuadrados cubiertos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calculadora;
