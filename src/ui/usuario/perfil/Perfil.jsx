import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import perfilService from './services/perfilService';
import jwtUtils from '../../../utilities/jwtUtils';

const Perfil = () => {
  const [user, setUser] = useState({ name: '', perfil: '', recolectPoints: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = jwtUtils.getAccessTokenFromCookie();
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación.');
        }

        const response = await perfilService.getProfile();
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Error al cargar el perfil');
        toast.error(err.message || 'Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span>
        </h1>
        <span className="text-xs text-gray-500">Mi Perfil</span>
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
                <p className="text-xs text-gray-400">Cargando perfil...</p>
              </div>
            </div>
          )}

          {/* Perfil Content */}
          {!isLoading && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              {/* Foto de Perfil */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={user.perfil || 'https://via.placeholder.com/150'}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nombre */}
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {user.name || 'Usuario'}
              </h2>

              {/* Puntos de Recolección */}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{user.recolectPoints || 0}</span> Puntos de Recolección
                </p>
              </div>
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

export default Perfil;