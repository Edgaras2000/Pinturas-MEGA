import { useState, useEffect } from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Tipos_usuarios = ({ oscuro }) => {
    const [usuarios, setUsuarios] = useState(0);
    const [google, setGoogle] = useState(0);

    const borderColor = oscuro ? '#000000' : '#60d6f6';
    const labelColor = oscuro ? '#000000' : '#60d6f6';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            arc: {
                borderColor: borderColor,
                borderWidth: 2,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Tipos de usuarios',
                color: labelColor,
            },
            legend: {
                labels: {
                    color: labelColor,
                },
            },
        },
    };

    const data = {
        labels: ['Usuarios Normales', 'Usuarios Google'],
        datasets: [
            {
                data: [usuarios, google],
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderColor: borderColor,
            },
        ],
    };

    // Función para obtener y contar usuarios normales y de Google
    const tipos_de_usuarios = async () => {
        try {
            const response = await axios.get("http://localhost:8000/pintura/usuario/crud_todo/");
            const allUsers = response.data;

            // Contar usuarios normales y de Google
            const normalUsers = allUsers.filter(user => !user.googleId).length;
            const googleUsers = allUsers.filter(user => user.googleId).length;

            setUsuarios(normalUsers);
            setGoogle(googleUsers);
        } catch (error) {
            console.error("Error al obtener los datos de usuarios:", error);
        }
    };

    useEffect(() => {
        tipos_de_usuarios();
    }, []);

    const generatePDF = async () => {
        const input = document.getElementById('tablachida'); // Selecciona el contenedor del gráfico
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
            const yOffset = yPos + imgHeight + 10; // Ajuste vertical después de la imagen
            pdf.setFontSize(12);
            pdf.text(`Usuarios Normales: ${usuarios || 0}`, xPos, yOffset);  // Si es null, muestra 0
            pdf.text(`Usuarios Google: ${google || 0}`, xPos, yOffset + 10);  // Añadir la cantidad de usuarios Google
    
            // Guardar el PDF
            pdf.save('ticket.pdf');
        });
    };

    return (
        <div className={`w-full h-full overflow-hidden ${oscuro ? 'bg-slate-100' : 'bg-gray-700'}`}>
            <Pie id='tablachida' onClick={generatePDF} data={data} options={options} />
            
            
        </div>
    );
};

export default Tipos_usuarios;
