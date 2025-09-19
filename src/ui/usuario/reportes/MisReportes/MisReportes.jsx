import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reportService from '../services/reportService';
import jwtUtils from '../../../../utilities/jwtUtils';
import API_BASE_URL from '../../../../js/urlHelper';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom circular marker
const createReportIcon = (status) => {
  const statusColors = {
    0: '#fef9c3', // Pendiente: Amarillo
    1: '#d1fae5', // Aceptado: Verde
    2: '#dbeafe', // Resuelto: Azul
    3: '#fee2e2', // Rechazado: Rojo
  };

  return new L.divIcon({
    className: 'report-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${statusColors[status]};
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Componente para ajustar los límites del mapa
const UpdateMapBounds = ({ reportes }) => {
  const map = useMap();
  useEffect(() => {
    if (reportes.length > 0) {
      const bounds = L.latLngBounds(reportes.map((r) => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [reportes, map]);
  return null;
};

const MisReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'map'

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
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación.');
        }

        const response = await reportService.listarReportes();
        setReportes(response.data);
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
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm font-medium rounded-xl ${
              viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm font-medium rounded-xl ${
              viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Mapa
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 px-4 py-3">
        <div className="w-full mx-auto">
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

          {viewMode === 'list' && !isLoading && reportes.length === 0 && !error && (
              <div className="max-w-2xl mx-auto text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">No tienes reportes aún.</p>
              </div>
            )}

            {viewMode === 'list' && !isLoading && reportes.length > 0 && (
              <div className="max-w-2xl mx-auto space-y-4">
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

          {/* Vista de Mapa */}
          {viewMode === 'map' && !isLoading && reportes.length === 0 && !error && (
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No tienes reportes para mostrar en el mapa.</p>
            </div>
          )}

          {viewMode === 'map' && !isLoading && reportes.length > 0 && (
            <div className="h-[70vh] sm:h-[75vh] w-full relative my-3 rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
              <MapContainer
                center={[-12.046374, -77.042793]} // Centro inicial (puedes ajustarlo)
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
                zoomControl={false}
                scrollWheelZoom={true}
                className="focus:outline-none"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution=""
                />
                {reportes.map((reporte) => (
                  <Marker
                    key={reporte.id}
                    position={[reporte.latitude, reporte.longitude]}
                    icon={createReportIcon(reporte.status)}
                  >
                    <Popup closeButton={false} className="minimal-popup">
                      <div className="text-center">
                        <img
                          src={`${API_BASE_URL}${reporte.image_url}`}
                          alt="Reporte"
                          className="w-32 h-32 object-cover rounded-lg mb-2"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                        />
                        <p className="text-sm font-medium text-gray-700">{reporte.description}</p>
                        <p className="text-xs text-gray-500">
                          Estado: {statusMap[reporte.status].text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(reporte.fecha).toLocaleDateString('es-ES')} {reporte.hora}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <UpdateMapBounds reportes={reportes} />
              </MapContainer>
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
        .minimal-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          z-index: 10;
        }
        .minimal-popup .leaflet-popup-content {
          margin: 6px 10px;
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          text-align: center;
        }
        .minimal-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        .report-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          background: #f8fafc !important;
          z-index: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default MisReportes;