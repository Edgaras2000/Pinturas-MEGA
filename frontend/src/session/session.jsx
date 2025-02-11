import { Navigate } from 'react-router-dom';


const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token'); // Verificar si el token existe
  
   
  console.log('Token:', token); 
    if (!token) {
      return <Navigate to="/login" />; // Redirige al login si no hay token
    }
  
    return children; 
  };
  
  export default RutaProtegida;