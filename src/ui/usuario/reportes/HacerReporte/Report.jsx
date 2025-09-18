import React, { useState, useRef } from 'react';
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
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: { ideal: 'environment' }, // Prefer rear camera
            }}
            onUserMediaError={handleCameraError}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Capture Button */}
        <button
          onClick={capturePhoto}
          disabled={isLoading || error}
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
    </div>
  );
};

export default Report;