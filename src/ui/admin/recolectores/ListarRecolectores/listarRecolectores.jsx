import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import recolectorService from '../services/recolectoresService';
import ZonaSelect from '../../../../components/Shared/Comboboxes/Zona/ZonaSelect';

const ListarRecolectores = () => {
  const [recolectores, setRecolectores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', name: '', password: '', estado: '1', idZona: '' });

  // Función para obtener recolectores
  const fetchRecolectores = async () => {
    setIsLoading(true);
    try {
      const recolectoresRes = await recolectorService.listarRecolectores();
      setRecolectores(recolectoresRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recolectores:', err);
      setError(err.message || 'Error al cargar los recolectores');
      toast.error(err.message || 'Error al cargar los recolectores');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener recolectores al montar el componente
  useEffect(() => {
    fetchRecolectores();
  }, []);

  // Iniciar edición
  const startEditing = (recolector) => {
    setEditingId(recolector.idUsuario);
    setEditForm({
      username: recolector.username,
      name: recolector.name,
      password: '',
      estado: recolector.estado.toString(),
      idZona: recolector.idZona.toString(),
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ username: '', name: '', password: '', estado: '1', idZona: '' });
  };

  // Manejar cambios en el formulario
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizar recolector
  const handleUpdate = async (e, idUsuario) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await recolectorService.updateRecolector(
        idUsuario,
        editForm.username,
        editForm.name,
        editForm.password || null,
        parseInt(editForm.estado),
        parseInt(editForm.idZona)
      );
      toast.success('Recolector actualizado exitosamente');
      // Refrescar la lista de recolectores para actualizar la vista con la nueva zona anidada
      await fetchRecolectores();
      cancelEditing();
    } catch (err) {
      console.error('Error updating recolector:', err);
      setError(err.message || 'Error al actualizar el recolector');
      toast.error(err.message || 'Error al actualizar el recolector');
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
        <span className="text-xs text-gray-500">Listar Recolectores</span>
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
                <p className="text-xs text-gray-400">Cargando recolectores...</p>
              </div>
            </div>
          )}

          {/* Recolectores List */}
          {!isLoading && recolectores.length === 0 && !error && (
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No hay recolectores registrados.</p>
            </div>
          )}

          {!isLoading && recolectores.length > 0 && (
            <div className="space-y-4">
              {recolectores.map((recolector) => (
                <div
                  key={recolector.idUsuario}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  {editingId === recolector.idUsuario ? (
                    <form onSubmit={(e) => handleUpdate(e, recolector.idUsuario)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de usuario
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={editForm.username}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                          placeholder="Ingresa el nombre de usuario"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                          placeholder="Ingresa el nombre completo"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraseña (opcional)
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={editForm.password}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                          placeholder="Nueva contraseña"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          name="estado"
                          value={editForm.estado}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                          disabled={isLoading}
                          required
                        >
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zona
                        </label>
                        <ZonaSelect
                          name="idZona"
                          value={editForm.idZona}
                          onChange={handleEditChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={isLoading || !editForm.username || !editForm.name || !editForm.idZona}
                          className="flex-1 py-2 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isLoading}
                          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{recolector.name}</p>
                        <p className="text-xs text-gray-500">{recolector.username}</p>
                        <p className="text-xs text-gray-500">
                          Estado: {recolector.estado === 1 ? 'Activo' : 'Inactivo'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Zona: {recolector.zona ? `${recolector.zona.nombre} - ${recolector.zona.descripcion}` : 'Sin zona'}
                        </p>
                      </div>
                      <button
                        onClick={() => startEditing(recolector)}
                        className="py-1 px-3 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>

    </div>
  );
};

export default ListarRecolectores;