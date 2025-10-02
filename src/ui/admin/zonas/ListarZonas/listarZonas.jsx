import React, { useState, useEffect } from 'react';
import zonaService from 'services/zonaService';
import AlertMessage from 'components/Shared/Error/AlertMessage';

const ListarZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const [alert, setAlert] = useState(null); // Un solo estado, inicializado en null.

  // Obtener zonas
  useEffect(() => {
    const fetchZonas = async () => {
      setIsLoading(true);
      try {
        const response = await zonaService.listarZonas();
        setZonas(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching zonas:', err);
        setAlert(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchZonas();
  }, []);

  // Iniciar edición
  const startEditing = (zona) => {
    setEditingId(zona.id);
    setEditForm({
      name: zona.nombre,
      description: zona.descripcion,
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  // Manejar cambios en el formulario
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizar zona
  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await zonaService.updateZona(
        id,
        editForm.name,
        editForm.description
      );
      setAlert(result);
      setZonas((prev) =>
        prev.map((zona) =>
          zona.id === id ? { ...zona, nombre: editForm.name, descripcion: editForm.description } : zona
        )
      );
      cancelEditing();
    } catch (err) {
      console.error('Error updating zona:', err);
      setAlert(err);
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
        <span className="text-xs text-gray-500">Listar Zonas</span>
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

          {/* 4. Usamos el componente AlertMessage para mostrar todos los mensajes */}
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
                <p className="text-xs text-gray-400">Cargando zonas...</p>
              </div>
            </div>
          )}

          {/* Zonas List */}
          {!isLoading && zonas.length === 0 && !error && (
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No hay zonas registradas.</p>
            </div>
          )}
          {!isLoading && zonas.length > 0 && (
            <div className="space-y-4">
              {zonas.map((zona) => (
                <div
                  key={zona.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  {editingId === zona.id ? (
                    <form onSubmit={(e) => handleUpdate(e, zona.id)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                          placeholder="Ingresa el nombre de la zona"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm resize-none"
                          rows="3"
                          placeholder="Ingresa la descripción"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={isLoading || !editForm.name}
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
                        <p className="text-sm font-medium text-gray-700">{zona.nombre}</p>
                        <p className="text-xs text-gray-500">{zona.descripcion}</p>
                      </div>
                      <button
                        onClick={() => startEditing(zona)}
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

export default ListarZonas;