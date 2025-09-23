import React, { useState, useEffect } from 'react';
import zonaService from '../../../../ui/admin/zonas/services/zonaService';
import jwtUtils from '../../../../utilities/jwtUtils';

const ZonaSelect = ({ value, onChange, disabled = false, name }) => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Obtener rol del JWT
    const token = jwtUtils.getAccessTokenFromCookie();
    if (token) {
      try {
        const rol = jwtUtils.getUserRole(token);
        if (rol === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error decoding JWT:', err);
      }
    }

    // Cargar zonas
    const fetchZonas = async () => {
      try {
        const response = await zonaService.listarZonas();
        setZonas(response.data);
      } catch (err) {
        console.error('Error fetching zonas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchZonas();
  }, []);

  // Helper function to truncate description
  const truncateDescription = (desc, maxLength = 50) => {
    if (!desc) return '';
    if (desc.length <= maxLength) return desc;
    return `${desc.substring(0, maxLength)}...`;
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm md:max-w-md"
      required
    >
      {loading ? (
        <option value="">Cargando zonas...</option>
      ) : (
        <>
          <option value="">Selecciona una zona</option>
          {zonas.map((zona) => (
            <option
              key={zona.id}
              value={zona.id}
              title={`ID: ${zona.id} - ${zona.nombre}`} 
            >
              {isAdmin
                ? `ID: ${zona.id} - ${zona.nombre} - ${truncateDescription(zona.descripcion)}`
                : zona.nombre}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default ZonaSelect;
