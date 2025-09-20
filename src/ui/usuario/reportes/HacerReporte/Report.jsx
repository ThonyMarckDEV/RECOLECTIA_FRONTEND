import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reportService from '../services/reportService';
import jwtUtils from '../../../../utilities/jwtUtils';

const Report = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const webcamRef = useRef(null);

  // Handle camera errors
  const handleCameraError = (err) => {
    console.error('Error accessing camera:', err);
    if (err.name === 'NotAllowedError') {
      setError('Permiso para la cámara denegado. Por favor, habilita el acceso en tu navegador.');
    } else if (err.name === 'NotFoundError') {
      setError('No se encontró una cámara en el dispositivo.');
    } else {
      setError('Error al acceder a la cámara: ' + err.message);
    }
  };

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setError(null);
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('No se pudo obtener la ubicación. Por favor, habilita los permisos de geolocalización.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (!webcamRef.current) {
      toast.error('La cámara no está lista. Por favor, espera o verifica los permisos.');
      return;
    }

    try {
      const photoData = webcamRef.current.getScreenshot({ width: 640, height: 480 });
      if (!photoData) {
        toast.error('No se pudo capturar la foto. Asegúrate de que la cámara esté activa.');
        return;
      }
      setPhoto(photoData);
    } catch (err) {
      console.error('Error capturing photo:', err);
      toast.error('Error al capturar la foto.');
    }
  };

  // Handle report submission
  const handleSubmit = async () => {
    if (!photo || !description.trim()) {
      toast.error('Por favor, captura una foto y proporciona una descripción.');
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error('No se pudo obtener la ubicación. Habilita los permisos de geolocalización.');
      return;
    }

    setIsLoading(true);
    try {
      const token = jwtUtils.getAccessTokenFromCookie();
      const userId = jwtUtils.getUserID(token);
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario.');
      }

      await reportService.createReport(
        photo,
        description,
        userId,
        location.latitude,
        location.longitude
      );
      toast.success('Reporte enviado exitosamente');
      setPhoto(null);
      setDescription('');
      setError(null); // Limpiar cualquier error previo
    } catch (err) {
      console.error('Error submitting report:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar el reporte';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <span className="text-xs text-gray-500">Crear Reporte</span>
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

          {/* Camera Preview o Photo Preview */}
          {!photo ? (
            <div className="relative w-full h-72 sm:h-80 bg-black rounded-xl overflow-hidden mb-3 shadow-sm border border-gray-200">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: { ideal: 'environment' },
                }}
                onUserMediaError={handleCameraError}
                className="w-full h-full object-cover"
              />
              
              {/* Floating Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-72 sm:h-80 bg-gray-100 rounded-xl overflow-hidden mb-3 shadow-sm border border-gray-200">
              <img
                src={photo}
                alt="Captured report"
                className="w-full h-full object-cover"
              />
              
              {/* Delete Photo Button */}
              <button
                onClick={() => setPhoto(null)}
                disabled={isLoading}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg border border-red-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Description Input */}
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm resize-none"
              rows="3"
              placeholder="Describe el problema o situación..."
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !photo || !description.trim() || !location.latitude || !location.longitude}
            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              'Enviar Reporte'
            )}
          </button>
        </div>
      </div>

      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>
    </div>
  );
};

export default Report;