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

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
      required
    >
      {loading ? (
        <option value="">Cargando zonas...</option>
      ) : (
        <>
          <option value="">Selecciona una zona</option>
          {zonas.map((zona) => (
            <option key={zona.id} value={zona.id}>
              ID: {zona.id} - {zona.nombre} - {zona.descripcion}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default ZonaSelect;