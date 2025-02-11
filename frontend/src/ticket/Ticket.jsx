import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';

const Ticket = () => {
    const { id_venta } = useParams();
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        obtenerDatosVenta();
    }, []); 
    
    const [pdfGenerado, setPdfGenerado] = useState(false);

    useEffect(() => {
        if (datos && !pdfGenerado) {
            generatePDF();
            setPdfGenerado(true); // Asegúrate de que solo se genere una vez.
        }
    }, [datos, pdfGenerado]);

    const obtenerDatosVenta = async () => {
        try {
            const url = `http://localhost:8000/pintura/ventas/esta/ticket/${id_venta}`;
            const response = await axios.get(url);
            setDatos(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const generatePDF = async () => {
        const input = document.getElementById('tablachida');
        input.querySelectorAll('img').forEach((img) => {
            img.crossOrigin = 'anonymous';
        });
    
        html2canvas(input, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
    
            
            const imgWidth = 140; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width; 
    
       
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
    
            const xPos = (pageWidth - imgWidth) / 2; 
            const yPos = (pageHeight - imgHeight) / 2; 
    
            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
    

            pdf.save('ticket.pdf');
        });
    };

    return (
<div className="w-full h-screen bg-gradient-to-r from-indigo-700 via-sky-300 to-emerald-700 bg-[length:400%_400%] animate-gradient-x flex flex-col items-center">
<div id="tablachida" className="w-full sm:w-4/12 ring-2 ring-black m-2 bg-white flex flex-col p-4">
        
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto">
                    <img
                        className="w-full h-full object-cover"
                        src="/img/logooopdf.png"
                        alt="Logo"
                        crossOrigin="anonymous"
                    />
                </div>

           
                {datos ? (
                    <div className="mt-4 flex flex-col gap-2 font-sans">
                        <h1 className="text-center text-2xl font-bold">Ticket de Venta</h1>
                        <hr className="border-1 border-black" />
                        <p className="text-center font-semibold mt-2">{datos.usuarioNombre}</p>
                        <p className="text-center text-sm">{datos.usuarioCorreo}</p>
                        <p className="text-center text-sm">{datos.usuarioTelefono}</p>
                        <p className="text-center text-sm mt-1">
                            Dirección: {datos.direccion ? `${datos.direccion.direccion}, ${datos.direccion.ciudad}, ${datos.direccion.estado_d}` : 'No disponible'}
                        </p>
                        <hr className="border-1 border-black" />
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">Productos:</h2>
                            {/* Tabla de productos */}
                            <table className="table-auto w-full text-left border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black px-2 py-1">Producto</th>
                                        <th className="border border-black px-2 py-1">Cantidad</th>
                                        <th className="border border-black px-2 py-1">Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.productos &&
                                        datos.productos.map((producto, index) => (
                                            <tr key={index}>
                                                <td className="border border-black px-2 py-1">{producto.nombre}</td>
                                                <td className="border border-black px-2 py-1">{producto.cantidad}</td>
                                                <td className="border border-black px-2 py-1">${producto.precio_unitario}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <hr className="border-1 border-black" />
                        <p className="mt-4 font-bold text-2xl">Total: ${datos.total}</p>
                        <hr className="border-1 border-black" />
                        <div className="w-full h-auto flex flex-row justify-evenly items-center gap-2">
                            <QRCodeCanvas level="H" value={`http://localhost:3000/ticket/${id_venta}`} />
                            <Barcode
                                value={id_venta}
                                width={2}
                                height={60}
                                format="CODE128"
                                background="#f8f9fa"
                                lineColor="#343a40"
                                fontSize={16}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Cargando datos...</p>
                )}
            </div>

           
        </div>
    );
};

export default Ticket;
