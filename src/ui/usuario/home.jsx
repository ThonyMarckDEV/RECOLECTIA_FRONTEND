import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationservice from '../recolector/services/locationservice';
import jwtUtils from '../../utilities/jwtUtils';
import truckIconUrl from '../../assets/img/camion.png';
import alertSound from '../../assets/sounds/alert.mp3';

// Fix Leaflet marker icon issue and set default marker fallback
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Default user icon
const defaultUserIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Function to create a circular icon from a URL
const createCircularIcon = (url) => {
  return new L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #fff;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        background: url(${url}) center/cover no-repeat;
      "></div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const UpdateMapBounds = ({ userPosition, collectorPosition, role }) => {
  const map = useMap();
  useEffect(() => {
    if (role === 'recolector' && userPosition) {
      map.setView(userPosition, 15);
    } else if (role === 'usuario' && userPosition && collectorPosition) {
      const bounds = L.latLngBounds([userPosition, collectorPosition]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (role === 'usuario' && userPosition) {
      map.setView(userPosition, 15);
    }
  }, [userPosition, collectorPosition, role, map]);
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
  const [role, setRole] = useState('');
  const [userProfilePic, setUserProfilePic] = useState(null); // Profile picture URL
  const positionRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const audioRef = useRef(new Audio(alertSound));

  // Get user info and role from token
  useEffect(() => {
    const token = jwtUtils.getAccessTokenFromCookie();
    const nombre = jwtUtils.getFullName(token);
    const rol = jwtUtils.getUserRole(token);
    const perfil = jwtUtils.getUserProfile(token) || null; // Extract perfil from token
    setUserName(nombre || 'Usuario');
    setRole(rol);
    setUserProfilePic(perfil);
  }, []);

  // Watch user's position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        positionRef.current = [latitude, longitude];
        setError(null);

        if (role === 'recolector') {
          const now = Date.now();
          if (now - lastUpdateRef.current > 10000) {
            try {
              await locationservice.updateLocation(latitude, longitude);
              lastUpdateRef.current = now;
            } catch (err) {
              console.error('Error updating location:', err);
              setError('Error al actualizar la ubicación del recolector.');
            }
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

    return () => navigator.geolocation.clearWatch(watchId);
  }, [role]);

  // Fetch collector's location for usuario role
  useEffect(() => {
    let intervalId;
    if (role === 'usuario') {
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
          setError('Error al obtener la ubicación del recolector.');
        }
      };
      fetchCollectorLocation(); // Initial fetch
      intervalId = setInterval(fetchCollectorLocation, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [role]);

  // Create user icon based on profile picture
  const userIconInstance = userProfilePic ? createCircularIcon(userProfilePic) : defaultUserIcon;

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-white border-4 border-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 text-center py-4">
          Bienvenido a <span className="text-green-500">RECOLECT</span>
          <span className="text-white bg-green-600 px-2 rounded">IA</span>
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          {role === 'recolector' ? 'Recolector' : 'Usuario'}: {userName}
        </h2>
        <div className="w-full h-[70vh]">
          {error ? (
            <div className="flex justify-center items-center h-full bg-white">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          ) : position ? (
            <MapContainer
              center={role === 'recolector' ? position : position}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {role === 'recolector' ? (
                <Marker position={position} icon={userProfilePic ? createCircularIcon(userProfilePic) : truckIcon}>
                  <Popup>Tu ubicación actual</Popup>
                </Marker>
              ) : (
                <>
                  <Marker position={position} icon={userIconInstance}>
                    <Popup>Tu ubicación actual</Popup>
                  </Marker>
                  {collectorPosition && (
                    <Marker position={collectorPosition} icon={truckIcon}>
                      <Popup>Ubicación del recolector</Popup>
                    </Marker>
                  )}
                </>
              )}
              <UpdateMapBounds
                userPosition={position}
                collectorPosition={collectorPosition}
                role={role}
              />
            </MapContainer>
          ) : (
            <div className="flex justify-center items-center h-full bg-white">
              <p className="text-gray-600">Cargando ubicación...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;