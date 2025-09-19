import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationservice from './services/locationservice';
import jwtUtils from '../../utilities/jwtUtils';
import truckIconUrl from '../../assets/img/camion.png';

// Fix Leaflet marker icon issue and set default marker fallback
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Minimalist truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UpdateMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const Home = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);

  const token = jwtUtils.getAccessTokenFromCookie();
  const nombre = jwtUtils.getFullName(token);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    const rol = jwtUtils.getUserRole(token);

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setError(null);

        // Throttle updates to backend (every 10 seconds)
        const now = Date.now();
        if (rol === 'recolector' && now - lastUpdate > 10000) {
          try {
            await locationservice.updateLocation(latitude, longitude);
            setLastUpdate(now);
          } catch (err) {
            console.error('Error updating location:', err);
          }
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible');
            break;
          case err.TIMEOUT:
            setError('Tiempo agotado');
            break;
          default:
            setError('Error de ubicación');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [lastUpdate, token]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-500 hidden sm:block">{nombre || 'Recolector'}</span>
        </div>
      </header>

      {/* Map Container - Removed Margins */}
      <div className="h-[70vh] sm:h-[75vh] relative mx-0 my-0 rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
        {error ? (
          <div className="flex items-center justify-center h-full bg-white rounded-xl">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
          </div>
        ) : position ? (
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
            zoomControl={false}
            scrollWheelZoom={true}
            className="focus:outline-none"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution=""
            />
            <Marker position={position} icon={truckIcon}>
              <Popup closeButton={false} className="minimal-popup">
                Tu ubicación actual
              </Popup>
            </Marker>
            <UpdateMapCenter position={position} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-xl">
            <div className="text-center">
              <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400">Cargando ubicación</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>

      {/* Custom CSS for ultra minimal styling */}
      <style jsx>{`
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
        .leaflet-container {
          background: #f8fafc !important;
          z-index: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Home;