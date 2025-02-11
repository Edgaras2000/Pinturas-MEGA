import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const MostrarID = () => {
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {

      const decodedToken = jwtDecode(token);
      setIdUsuario(decodedToken._id); 
    }
  }, []);

  return idUsuario;
};

export default MostrarID;
