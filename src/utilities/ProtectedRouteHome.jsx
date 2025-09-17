import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de tener esta utilidad para decodificar el token

const ProtectedRoute = ({ element }) => {
  // Obtener el JWT desde localStorage
  const refresh_token = jwtUtils.getRefreshTokenFromCookie();
  
  if (refresh_token) {
    const rol = jwtUtils.getUserRole(refresh_token); // Extraer el rol del token

     // Redirigir según el rol del usuario
     switch (rol) {
      case 'admin':
        return <Navigate to="/cadminliente" />;
      case 'usuario':
        return <Navigate to="/usuario" />;
      case 'recolector':
        return <Navigate to="/recolector" />;
      default:
        return element;
    }
  }

  // Si no hay token, se muestra el elemento original
  return element;
};

export default ProtectedRoute;
