import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationservice from '../recolector/services/locationservice';
import jwtUtils from '../../utilities/jwtUtils';
import truckIconUrl from '../../assets/img/camion.png';
import alertSound from '../../assets/sounds/alert.mp3';

// Fix Leaflet marker icon issue
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

// Simple circular user icon
const createUserIcon = (url) => {
  return new L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url(${url}) center/cover no-repeat;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const UpdateMapBounds = ({ userPosition, collectorPosition }) => {
  const map = useMap();
  useEffect(() => {
    if (userPosition && collectorPosition) {
      const bounds = L.latLngBounds([userPosition, collectorPosition]);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else if (userPosition) {
      map.setView(userPosition, 15);
    }
  }, [userPosition, collectorPosition, map]);
  return null;
};

// Function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const Home = () => {
  const [position, setPosition] = useState(null); // User's location
  const [collectorPosition, setCollectorPosition] = useState(null); // Collector's location
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState(null); // Profile picture URL
  const positionRef = useRef(null);
  const audioRef = useRef(new Audio(alertSound));

  // Get user info from token
  useEffect(() => {
    const token = jwtUtils.getAccessTokenFromCookie();
    const nombre = jwtUtils.getFullName(token);
    const perfil = jwtUtils.getUserProfile(token) || 'https://via.placeholder.com/24';
    setUserName(nombre || 'Usuario');
    setUserProfilePic(perfil);
  }, []);

  // Watch user's position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        positionRef.current = [latitude, longitude];
        setError(null);
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
  }, []);

  // Fetch collector's location every 1 second
  useEffect(() => {
    const fetchCollectorLocation = async () => {
      try {
        const { latitude, longitude } = await locationservice.getCollectorLocation();
        setCollectorPosition([latitude, longitude]);
        if (positionRef.current && latitude && longitude) {
          const distance = calculateDistance(
            positionRef.current[0],
            positionRef.current[1],
            latitude,
            longitude
          );
          if (distance < 100) {
            audioRef.current.play().catch((err) => console.error('Error playing sound:', err));
          }
        }
      } catch (err) {
        console.error('Error fetching collector location:', err);
        // Opcional: descomentar si quieres limpiar la posición en caso de error
        // setCollectorPosition(null);
      }
    };
    fetchCollectorLocation();
    const intervalId = setInterval(fetchCollectorLocation, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Create user icon based on profile picture
  const userIconInstance = createUserIcon(userProfilePic);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src={userProfilePic} 
              alt="Usuario" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs text-gray-500 hidden sm:block">{userName}</span>
        </div>
      </header>

      {/* Map Container - Reduced Height */}
      <div className="h-[70vh] sm:h-[75vh] relative mx-4 my-3 rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
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
            <Marker position={position} icon={userIconInstance}>
              <Popup closeButton={false} className="minimal-popup">
                Tu ubicación
              </Popup>
            </Marker>
            {collectorPosition && (
              <Marker position={collectorPosition} icon={truckIcon}>
                <Popup closeButton={false} className="minimal-popup">
                  Recolector
                </Popup>
              </Marker>
            )}
            <UpdateMapBounds
              userPosition={position}
              collectorPosition={collectorPosition}
            />
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
        .user-marker {
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

export default Home;