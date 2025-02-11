import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';








const Footer = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://kit.fontawesome.com/e20e47359b.js";
        script.crossOrigin = "anonymous";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div>

<link rel="stylesheet" href="/style/footer/estilo.css" />
<script src="https://cdn.lordicon.com/lordicon.js"></script>
            

            <footer id='footer' className='w-full h-auto grid grid-rows-5 grid-cols-1 sm:grid-rows-1 sm:grid-cols-5 text-white'>
    <div className='bg-slate-700 flex justify-center items-center'>
        <ol className='text-left'>
            <li><i className="fa-solid fa-phone p-2"></i>3481111267 *</li>
            <li><i className="fa-regular fa-envelope p-2"></i>edgaralejandro630@gmail.com</li>
            <li><i className="fa-regular fa-envelope p-2"></i>895431936</li>
        </ol>
    </div>

    <div className='bg-slate-700 flex flex-col justify-center items-center gap-4'>
        <h1>Síguenos en:</h1>
        <div className='flex flex-col justify-center items-center gap-2'>
            <ul className='flex flex-row gap-2'>
                <li className='w-1/4 h-auto border-full overflow-hidden rounded-full'>
                    <i className="fa-brands fa-facebook text-5xl text-blue-500 bg-white p-1 rounded-full"></i>
                </li>
                <li><i className="fa-brands fa-instagram text-5xl text-fuchsia-500 bg-white rounded-lg"></i></li>
                <li><i className="fa-brands fa-twitter text-5xl bg-white rounded-lg" style={{ color:'#5765f2' }}></i></li>
                <li>
                    <i className="fa-brands fa-discord text-5xl bg-white rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_10px_rgba(87,101,242,0.6)] focus:shadow-[0_0_15px_10px_rgba(87,101,242,0.6)]" style={{ color: '#5765f2' }}></i>
                </li>
            </ul>
            <div className='w-3/4 h-auto border-2 border-white'>PAGINA PRINCIPAL®</div>
        </div>
    </div>

    <div className='bg-slate-700 flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-1'>
            <h2 className='bg-gradient-to-r from-slate-900 to-slate-800'>¿Quiénes somos?</h2>
            <Link to='/principal'><h3>Creadores</h3></Link>
            <Link to='/principal'><h3>Propósito</h3></Link>
            <Link to='/sugerencias'><h3>Quejas o aclaraciones</h3></Link>

            <Link to='https://www.prisa.mx' target="_blank"><h3>Patrocinadores</h3></Link>
        </div>
    </div>

    <div id='mapa' className='bg-slate-700 overflow-hidden flex flex-col justify-center items-center gap-2'>
        <h1 className="bg-gradient-to-r from-slate-900 to-slate-800 text-white text-4xl p-4 rounded-lg shadow-lg">ENCUÉNTRANOS EN:</h1>
        <div className='w-3/4 h-3/4 overflow-hidden rounded-lg shadow-2xl'>
            <iframe className='shadow-2xl' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d933.0313605364173!2d-102.34089195930027!3d20.705130120116742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84294c7a71c98b93%3A0xf7f7487f49367f23!2sPinturas%20Prisa%20de%20los%20Altos!5e0!3m2!1ses-419!2smx!4v1727188951761!5m2!1ses-419!2smx" width="600" height="400" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </div>

    <div id='QR' className='bg-slate-700 flex flex-col justify-center items-center'>
        <div className='w-3/4 h-3/4 flex flex-col justify-center items-center gap-8'>
            <h2 className='text-3xl underline bg-gradient-to-r from-slate-900 to-slate-500'>SCAN ME:</h2>
            <div className='shadow-2xl'>
                <QRCodeCanvas level="H" value="http://localhost:3000/principal" />
            </div>
        </div>
    </div>
</footer>

        </div>
    );
};

export default Footer;
