import 'chart.js/auto';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Ventas = ({ oscuro }) => {
    const [ventasData, setVentasData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [datosBarraHoy, setDatosBarraHoy] = useState({ labels: [], datasets: [] });
    const [totalVentas, setTotalVentas] = useState(0);

    const obtenerVentas = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pintura/estadistica/venta/esta/');
            setVentasData(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const filtrarVentasPorFecha = () => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return ventasData.filter((venta) => {
            const fechaVenta = new Date(venta.fecha);
            return (!start || fechaVenta >= start) && (!end || fechaVenta <= end);
        });
    };

    const agruparVentasPorDia = () => {
        const ventasFiltradas = filtrarVentasPorFecha();
        const ventasPorDia = {};

        ventasFiltradas.forEach((venta) => {
            const fecha = new Date(venta.fecha).toLocaleDateString();
            venta.productos.forEach((producto) => {
                ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + producto.cantidad;
            });
        });

        return ventasPorDia;
    };

    const ventasHoy = async () => {
        const hoy = new Date().toLocaleDateString();
        const productosHoy = {};

        for (const venta of ventasData) {
            const fechaVenta = new Date(venta.fecha).toLocaleDateString();
            if (fechaVenta === hoy) {
                for (const producto of venta.productos) {
                    const { id_producto, cantidad } = producto;

                    try {
                        const response = await axios.get(`http://localhost:8000/pintura/producto/singular/${id_producto}`);
                        const nombreProducto = response.data.nombre;

                        productosHoy[nombreProducto] = (productosHoy[nombreProducto] || 0) + cantidad;
                    } catch (error) {
                        console.error(`Error al obtener el nombre del producto con ID ${id_producto}`, error);
                    }
                }
            }
        }

        return productosHoy;
    };

    const datosGrafico = () => {
        const ventasPorDia = agruparVentasPorDia();
        return {
            labels: Object.keys(ventasPorDia),
            datasets: [
                {
                    label: 'Ventas por Día',
                    data: Object.values(ventasPorDia),
                    borderColor: oscuro ? '#FF6384' : '#FFFFFF',
                    backgroundColor: oscuro ? 'rgba(255, 99, 132, 0.3)' : 'rgba(54, 162, 235, 0.3)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        };
    };

    const obtenerDatosGraficoHoy = async () => {
        const productosHoy = await ventasHoy();
        setDatosBarraHoy({
            labels: Object.keys(productosHoy),
            datasets: [
                {
                    label: 'Cantidad de Productos Vendidos Hoy',
                    data: Object.values(productosHoy),
                    backgroundColor: oscuro ? 'rgba(75, 192, 192, 0.5)' : 'rgba(153, 102, 255, 0.5)',
                    borderColor: oscuro ? '#4BC0C0' : '#9966FF',
                    borderWidth: 1,
                },
            ],
        });
    };

    useEffect(() => {
        obtenerVentas();
    }, []);

    useEffect(() => {
        if (ventasData.length > 0) {
            obtenerDatosGraficoHoy();
        }
    }, [ventasData]);

    useEffect(() => {
        const ventasFiltradas = filtrarVentasPorFecha();
        const sumaTotal = ventasFiltradas.reduce((acc, venta) => acc + parseFloat(venta.total), 0);
        setTotalVentas(sumaTotal);
    }, [ventasData, startDate, endDate]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Número de Ventas por Día',
                color: oscuro ? '#000000' : '#FFFFFF',
            },
            legend: {
                labels: {
                    color: oscuro ? '#000000' : '#FFFFFF',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: oscuro ? '#000000' : '#FFFFFF',
                },
                grid: {
                    color: oscuro ? '#333333' : '#dddddd',
                },
            },
            y: {
                ticks: {
                    color: oscuro ? '#000000' : '#FFFFFF',
                },
                grid: {
                    color: oscuro ? '#333333' : '#dddddd',
                },
            },
        },
    };

    const generatePDF = async (id) => {
        const input = document.getElementById(id);
        await html2canvas(input, {
            useCORS: true,
            scale: 3,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            pdf.addImage(imgData, 'PNG', 10, 10, 270, 190);

            if (id==="grafico-linea") {
                pdf.setFontSize(14);
                pdf.text(`Total Ventas: $${totalVentas.toFixed(2)}`, 30, 208);
            }
           
            pdf.save(`${id}.pdf`);
        });
    };

    return (
        <div className="w-full h-full overflow-hidden grid grid-cols-5 grid-rows-1">
            <div className={`col-span-1 ${oscuro ? 'bg-slate-100' : 'bg-gray-700'} flex justify-center items-center flex-col`}>
                <label className={`mt-4 ${oscuro ? 'text-black' : 'text-cyan-400'}`}>Fecha de inicio:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`mt-2 p-2 text-center rounded-md ring-2 ${oscuro ? 'bg-white text-black ring-black' : 'bg-gray-700 text-cyan-400 ring-cyan-400'}`}
                />
                <label className={`mt-4 ${oscuro ? 'text-black' : 'text-cyan-400'}`}>Fecha de fin:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`mt-2 p-2 text-center rounded-md ring-2 ${oscuro ? 'bg-white text-black ring-black' : 'bg-gray-700 text-cyan-400 ring-cyan-400'}`}
                />
            </div>

            <div className="col-span-3 p-4">
                <div id="grafico-linea" className="w-full h-[250px] md:h-[350px]">
                    <Line data={datosGrafico()} options={options} />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => generatePDF('grafico-linea')}
                        className="bg-gradient-to-r from-indigo-700 via-sky-300 to-emerald-700 bg-[length:400%_400%] animate-gradient-x text-white p-2 rounded-md"
                    >
                        Descargar PDF
                    </button>
                    <p className={`ml-4 ${oscuro ? 'text-black' : 'text-cyan-400'}`}>
                        Total: ${totalVentas.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="col-span-1 p-4">
                <div id="grafico-barras" className="w-full h-[250px] md:h-[350px]">
                    <Bar data={datosBarraHoy} options={options} />
                </div>
                <button onClick={() => generatePDF('grafico-barras')} className="mt-4 bg-gradient-to-r from-indigo-700 via-sky-300 to-emerald-700 bg-[length:400%_400%] animate-gradient-x text-white p-2 rounded-md">
                    Descargar PDF
                </button>
            </div>
        </div>
    );
};

export default Ventas;
