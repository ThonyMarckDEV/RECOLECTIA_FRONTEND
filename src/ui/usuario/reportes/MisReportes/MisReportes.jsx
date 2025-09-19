import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reportService from '../services/reportService';
import jwtUtils from '../../../../utilities/jwtUtils';
import API_BASE_URL from '../../../../js/urlHelper';

const MisReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapa de estados para mostrar en la UI
  const statusMap = {
    0: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    1: { text: 'Aceptado', color: 'bg-green-100 text-green-800' },
    2: { text: 'Resuelto', color: 'bg-blue-100 text-blue-800' },
    3: { text: 'Rechazado', color: 'bg-red-100 text-red-800' },
  };

  // Obtener reportes del usuario
  useEffect(() => {
    const fetchReportes = async () => {
      setIsLoading(true);
      try {
        const token = jwtUtils.getAccessTokenFromCookie();
        const userId = jwtUtils.getUserID(token);
        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario.');
        }

        const response = await reportService.listarReportes(userId);
        setReportes(response.data); // Asumimos que el endpoint devuelve { data: [...] }
        setError(null);
      } catch (err) {
        console.error('Error fetching reportes:', err);
        setError(err.message || 'Error al cargar los reportes');
        toast.error(err.message || 'Error al cargar los reportes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportes();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <span className="text-xs text-gray-500">Mis Reportes</span>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-3 text-red-600 text-center p-3 bg-red-50 rounded-xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                <p className="text-xs text-gray-400">Cargando reportes...</p>
              </div>
            </div>
          )}

          {/* Reportes List */}
          {!isLoading && reportes.length === 0 && !error && (
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No tienes reportes aún.</p>
            </div>
          )}

          {!isLoading && reportes.length > 0 && (
            <div className="space-y-4">
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagen */}
                    <div className="w-full sm:w-1/3 h-40 rounded-lg overflow-hidden">
                      <img
                        src={`${API_BASE_URL}${reporte.image_url}`}
                        alt="Reporte"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                      />
                    </div>
                    {/* Detalles */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">{reporte.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusMap[reporte.status].color}`}>
                          {statusMap[reporte.status].text}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reporte.fecha).toLocaleDateString('es-ES')} {reporte.hora}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Lat: {reporte.latitude}, Lon: {reporte.longitude}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>

      {/* Toast Notifications - Minimalist Style */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="light"
        toastClassName="!bg-white !shadow-lg !border !border-gray-200 !rounded-xl !text-sm"
        bodyClassName="!text-gray-700 !font-normal"
        closeButton={false}
      />

      {/* Custom CSS for ultra minimal styling */}
      <style jsx>{`
        .Toastify__toast {
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          border: 1px solid #e5e7eb !important;
        }
        .Toastify__toast--success {
          background: #f0fdf4 !important;
          color: #16a34a !important;
          border-color: #bbf7d0 !important;
        }
        .Toastify__toast--error {
          background: #fef2f2 !important;
          color: #dc2626 !important;
          border-color: #fecaca !important;
        }
      `}</style>
    </div>
  );
};

export default MisReportes;