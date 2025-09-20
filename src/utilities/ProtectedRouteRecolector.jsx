import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de tener esta utilidad para decodificar el token

const ProtectedRouteUser = ({ element }) => {
  // Obtener el JWT desde localStorage
  const refresh_token = jwtUtils.getRefreshTokenFromCookie();


  if (!refresh_token) {
    return <Navigate to="/" />;
  }

  const rol = jwtUtils.getUserRole(refresh_token);

  if (rol !== 'recolector') {
    return <Navigate to="/404" />;
  }

  // Si hay token, se muestra el elemento original
  return element;

};

export default ProtectedRouteUser;
