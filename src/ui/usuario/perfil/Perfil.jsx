import React, { useState, useEffect } from 'react';
import perfilService from 'services/perfilService';
import { refreshAccessToken } from 'js/authToken'; 
import jwtUtils from 'utilities/jwtUtils';
import ZonaSelect from 'components/Shared/Comboboxes/Zona/ZonaSelect'; 
import AlertMessage from 'components/Shared/Error/AlertMessage';
import { toast } from 'react-toastify';

const Perfil = () => {
  const [user, setUser] = useState({ name: '', perfil: '', recolectPoints: 0, idZona: null, zona: null });
  const [selectedZona, setSelectedZona] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingZona, setIsSavingZona] = useState(false);
  const [error, setError] = useState(null);

  const [alert, setAlert] = useState(null); // Un solo estado, inicializado en null.

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
        const data = response.data;
        setUser(data);
        setSelectedZona(data.idZona || '');
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setAlert(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle zona selection change
  const handleZonaChange = (e) => {
    setSelectedZona(e.target.value);
  };

  // Handle save zona and refresh token
  const handleSaveZona = async () => {
    if (!selectedZona) {
      toast.error('Selecciona una zona');
      return;
    }

    if (selectedZona === user.idZona) {
      toast.info('La zona seleccionada es la misma');
      return;
    }

    setIsSavingZona(true);
    try {
      const result = await perfilService.updateZona(selectedZona);
      // Refrescar access token
      const newToken = await refreshAccessToken();
      jwtUtils.setAccessTokenInCookie(newToken);
      // Refrescar perfil con nuevo data
      const response = await perfilService.getProfile();
      setUser(response.data);
      setSelectedZona(response.data.idZona);
      setAlert(result);
    } catch (err) {
      console.error('Error updating zona:', err);
      setAlert(err);
    } finally {
      setIsSavingZona(false);
    }
  };

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

          <AlertMessage
            type={alert?.type}
            message={alert?.message}
            details={alert?.details}
            onClose={() => setAlert(null)}
          />

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
              <div className="flex items-center justify-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{user.recolectPoints || 0}</span> Puntos de Recolección
                </p>
              </div>

              {/* Zona Actual */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zona Actual
                </label>
                <p className="text-sm text-gray-500">
                  {user.zona || 'No asignada'}
                </p>
              </div>

              {/* Seleccionar Nueva Zona */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actualizar Zona
                </label>
                <ZonaSelect
                  name="idZona"
                  value={selectedZona}
                  onChange={handleZonaChange}
                  disabled={isSavingZona}
                />
              </div>
              <button
                onClick={handleSaveZona}
                disabled={isSavingZona || !selectedZona || selectedZona === user.idZona}
                className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
              >
                {isSavingZona ? 'Guardando...' : 'Actualizar Zona'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>
    </div>
  );
};

export default Perfil;