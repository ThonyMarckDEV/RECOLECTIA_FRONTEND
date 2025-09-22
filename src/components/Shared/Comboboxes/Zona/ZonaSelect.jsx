import React, { useState, useEffect } from 'react';
import zonaService from '../../../../ui/admin/zonas/services/zonaService';

const ZonaSelect = ({ value, onChange, disabled = false, name }) => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (desc.length <= maxLength) return desc;
    return `${desc.substring(0, maxLength)}...`;
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm md:max-w-md" // Added md:max-w-md for desktop constraint
      style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} // Inline styles for truncation
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
              title={`ID: ${zona.id} - ${zona.nombre} - ${zona.descripcion}`} // Full text as tooltip
            >
              ID: {zona.id} - {zona.nombre} - {truncateDescription(zona.descripcion)}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default ZonaSelect;