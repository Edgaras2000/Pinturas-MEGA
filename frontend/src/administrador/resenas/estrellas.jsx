import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faEmptyStar } from '@fortawesome/free-solid-svg-icons';

const Calificacion2 = ({ rating }) => {

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div id="calificacion" className=" h-full  flex items-center justify-center  w-2/4 hover:text-emerald-500">
     
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} className="text-amarillo_caca hover:text-emerald-500 transition-all duration-300" />
      ))}

   
      {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-boton_azul_letra hover:text-emerald-500 transition-all duration-300" />}

   
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faEmptyStar} className="text-gray-400 borde-2" />
      ))}
    </div>
  );
};

export default Calificacion2;
