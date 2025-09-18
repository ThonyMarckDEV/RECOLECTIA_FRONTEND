import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reportService from '../services/reportService';
import jwtUtils from '../../../../utilities/jwtUtils';

const Report = () => {
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Start camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }, // Prefer rear camera, fallback if unavailable
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsVideoReady(true); // Mark video as ready when metadata is loaded
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        if (err.name === 'NotAllowedError') {
          setError('Permiso para la cámara denegado. Por favor, habilita el acceso en tu navegador.');
        } else if (err.name === 'NotFoundError') {
          setError('No se encontró una cámara en el dispositivo.');
        } else {
          setError('Error al acceder a la cámara: ' + err.message);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      toast.error('La cámara no está lista. Por favor, espera o verifica los permisos.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get base64 image
    try {
      const photoData = canvas.toDataURL('image/jpeg', 0.8); // Quality set to 0.8
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

    setIsLoading(true);
    try {
      const token = jwtUtils.getAccessTokenFromCookie();
      const userId = jwtUtils.getUserInfo(token)?.idUsuario;
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario.');
      }

      await reportService.createReport(photo, description, userId);
      toast.success('Reporte enviado exitosamente');
      setPhoto(null);
      setDescription('');
    } catch (err) {
      console.error('Error submitting report:', err);
      toast.error(err.message || 'Error al enviar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white border-4 border-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 text-center py-4">
          Crear Reporte <span className="text-green-500">RECOLECT</span>
          <span className="text-white bg-green-600 px-2 rounded">IA</span>
        </h1>

        {error && (
          <div className="mb-4 text-red-600 text-center p-2 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Camera Preview */}
        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mb-4">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex justify-center items-center h-full text-white">
              Cargando cámara...
            </div>
          )}
        </div>

        {/* Capture Button */}
        <button
          onClick={capturePhoto}
          disabled={isLoading || !stream || !isVideoReady}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
        >
          Capturar Foto
        </button>

        {/* Photo Preview */}
        {photo && (
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <img
              src={photo}
              alt="Captured report"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Reporte
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            rows="4"
            placeholder="Describe el problema o situación..."
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Reporte'}
        </button>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>

      {/* Hidden Canvas for Photo Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Report;