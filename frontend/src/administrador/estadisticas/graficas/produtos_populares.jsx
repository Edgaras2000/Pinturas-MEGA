import { useState, useEffect } from 'react';
import { Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Productos_populares = ({ tema }) => {
    const [productos, setProductos] = useState([]);  
    const [productos2, setProductos2] = useState([]);  
    const [filter, setFilter] = useState({ estado: "activos" });
    const navigate = useNavigate();

    useEffect(() => {
        productoss();
    }, []);

    const productoss = async () => {
        const url = "http://localhost:8000/pintura/estadistica/tres_productos/esta/";
        const url2 = "http://localhost:8000/pintura/estadistica/cinco_productos_menos/esta/";

        try {
            const response = await axios.get(url);
            setProductos(response.data);

            const response2 = await axios.get(url2);
            setProductos2(response2.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };


    const generatePDF = async () => {
        const input = document.getElementById('graficomas'); // Selecciona el contenedor del gráfico
        input.querySelectorAll('img').forEach((img) => {
            img.crossOrigin = 'anonymous';
        });
    
        // Captura la imagen del gráfico con html2canvas
        html2canvas(input, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            
            // Calculamos las dimensiones y la posición para agregar la imagen del gráfico
            const imgWidth = 140; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width; 
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const xPos = (pageWidth - imgWidth) / 2; 
            const yPos = (pageHeight - imgHeight) / 2;
    
            // Añadimos la imagen al PDF
            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
    
            // Agregar los valores numéricos al PDF
            const labels = productos.map(producto => producto.nombre);
            const values = productos.map(producto => producto.ventas);
    
            let yOffset = yPos + imgHeight + 10; // Ajuste vertical después de la imagen
            labels.forEach((label, index) => {
                pdf.setFontSize(12);
                pdf.text(`${label}: ${values[index]} ventas`, xPos, yOffset);
                yOffset += 10; // Espaciado entre las líneas
            });
    
            // Guardar el PDF
            pdf.save('ticket.pdf');
        });
    };
    


    const generatePDF6 = async () => {
        const input = document.getElementById('graficomenos'); 
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
    
            const labels = productos.map(producto => producto.nombre);
            const values = productos.map(producto => producto.ventas);
    
            let yOffset = yPos + imgHeight + 10; 
            labels.forEach((label, index) => {
                pdf.setFontSize(12);
                pdf.text(`${label}: ${values[index]} ventas`, xPos, yOffset);
                yOffset += 10; 
            });
    
       
            pdf.save('ticket.pdf');
        });
    };
    
  

    const borderColor = tema ? '#000000' : '#60d6f6';
    const labelColor = tema ? '#000000' : '#60d6f6';

    const data = {
        labels: productos.length > 0 ? productos.map(producto => producto.nombre) : [],
        datasets: [
            {
                data: productos.length > 0 ? productos.map(producto => producto.ventas) : [],
                backgroundColor: productos.length > 0 
                    ? productos.map(producto => producto.color || labelColor)  
                    : [],
                borderColor: borderColor,
                borderWidth: 2,
            },
        ],
    };

    const data2 = {
        labels: productos2.length > 0 ? productos2.map(producto => producto.nombre) : [],
        datasets: [
            {
                data: productos2.length > 0 ? productos2.map(producto => producto.ventas) : [],
                backgroundColor: productos2.length > 0 
                    ? productos2.map(producto => producto.color || labelColor)  
                    : [],
                borderColor: borderColor,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            arc: {
                backgroundColor: productos.length > 0 
                    ? productos.map(producto => producto.color || labelColor)  
                    : [],
                borderColor: borderColor,
                borderWidth: 2,
                shadowOffsetX: 5,  // Desplazamiento de la sombra en el eje X
                shadowOffsetY: 5,  // Desplazamiento de la sombra en el eje Y
                shadowBlur: 10,    // Desenfoque de la sombra
                shadowColor: 'rgba(0, 0, 0, 0.4)', // Color de la sombra
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Productos Mas Populares',
                color: labelColor,
            },
            legend: {
                labels: {
                    color: labelColor,
                },
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const productoId = productos[index]?._id;
                if (productoId) {
                    navigate(`/producto/info/${productoId}`);
                }
            }
        },
    };

    const options2 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            elements: {
                arc: {
                    backgroundColor: productos.length > 0 
                        ? productos.map(producto => producto.color || labelColor)  
                        : [],
                    borderColor: borderColor,
                    borderWidth: 2,
                    shadowOffsetX: 9,  // Desplazamiento de la sombra en el eje X
                    shadowOffsetY: 9,  // Desplazamiento de la sombra en el eje Y
                    shadowBlur: 1,    // Desenfoque de la sombra
                    shadowColor: 'rgba(0, 0, 0, 0.9)', // Color de la sombra
                },
            },
            title: {
                display: true,
                text: 'Productos Menos Populares',
                color: labelColor,
            },
            legend: {
                labels: {
                    color: labelColor,
                },
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const productoId = productos2[index]?._id;
                if (productoId) {
                    navigate(`/producto/info/${productoId}`);
                }
            }
        },
    };

    return (
        <div  className={`w-full h-full overflow-hidden p-6 ${tema ? 'bg-slate-100' : 'bg-gray-700'} flex justify-center items-center flex-col`}>
            <div className="w-full h-1/12  flex flex-row items-center justify-evenly  ">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="filterEstado"
                        value="activos"
                        checked={filter === true}
                        onChange={() => setFilter(true)}
                        className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter=== true ? 'border-cyan-500' : 'border-gray-400'} transition-all duration-200`}>
                        {filter === true && <div className="w-3 h-3 bg-cyan-500 rounded-full transition-all duration-200"></div>}
                    </div>
                    <span className={`text-${filter === true ? 'cyan-500' : 'gray-400'}`}>Mas Adquiridos</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="filterEstado"
                        value="no_activos"
                        onChange={() => setFilter(false)}
                        className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${filter === false ? 'border-cyan-400' : 'border-gray-400'} transition-all duration-200`}>
                        {filter === false && <div className="w-3 h-3 bg-cyan-400 rounded-full transition-all duration-200"></div>}
                    </div>
                    <span className={`text-${filter === false ? 'cyan-400' : 'gray-400'}`}>Menos Adquiridos</span>
                </label>
            </div>

            <div  className="w-full h-full flex justify-center  items-center">
                {filter  && productos.length > 0 ? (
                    <div id='graficomas' onClick={generatePDF} className="w-full h-64 md:h-96 ">
                         <PolarArea data={data} options={options} />
                       
                    </div>
                ) : (
                    <div id='graficomenos' onClick={generatePDF6} className="w-full h-64 md:h-96 ">
                        <Doughnut data={data2} options={options2} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos_populares;
