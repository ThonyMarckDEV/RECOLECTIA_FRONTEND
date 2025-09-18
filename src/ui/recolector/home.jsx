import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationservice from './services/locationservice';
import jwtUtils from '../../utilities/jwtUtils';
import truckIconUrl from '../../assets/img/camion.png'; // Import the truck icon

// Fix Leaflet marker icon issue and set default marker fallback
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl, // Use imported image
  iconSize: [38, 38], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41], // Size of the shadow
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
  const [lastUpdate, setLastUpdate] = useState(0); // For throttling

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador.');
      return;
    }

    // Get role from token
    const token = jwtUtils.getAccessTokenFromCookie();
    const rol = jwtUtils.getUserRole(token);

    // Request permission and watch position
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
            setError('Permiso de geolocalización denegado. Por favor, habilita la ubicación en tu navegador.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('La ubicación no está disponible.');
            break;
          case err.TIMEOUT:
            setError('Se agotó el tiempo para obtener la ubicación.');
            break;
          default:
            setError('Error al obtener la ubicación.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, [lastUpdate]);

  return (
    <div className="min-h-screen w-full bg-white border-4 border-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-600 text-center py-4">
        Bienvenido a <span className="text-green-500">RECOLECT</span>
        <span className="text-white bg-green-600 px-2 rounded">IA</span>
      </h1>
      <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
        {error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        ) : position ? (
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '90%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={truckIcon}>
              <Popup>Tu ubicación actual</Popup>
            </Marker>
            <UpdateMapCenter position={position} />
          </MapContainer>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">Cargando ubicación...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;