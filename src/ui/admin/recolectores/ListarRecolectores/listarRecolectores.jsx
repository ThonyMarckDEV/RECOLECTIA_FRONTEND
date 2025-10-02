import React, { useState, useEffect } from 'react';
import recolectorService from 'services/recolectoresService';
import ZonaSelect from 'components/Shared/Comboboxes/Zona/ZonaSelect';
import AlertMessage from 'components/Shared/Error/AlertMessage';

const ListarRecolectores = () => {
    const [recolectores, setRecolectores] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', name: '', password: '', estado: '1', idZona: '' });

    // Función para obtener recolectores
    const fetchRecolectores = async () => {
        // No se pone setIsLoading(true) aquí para evitar parpadeo al actualizar
        try {
            const recolectoresRes = await recolectorService.listarRecolectores();
            setRecolectores(recolectoresRes.data);
        } catch (err) {
            console.error('Error fetching recolectores:', err);
            setAlert({ type: 'error', message: err.message || 'Error al cargar los recolectores' });
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
        setAlert({ type: '', message: '' }); // Limpia la alerta al empezar a editar
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
        setAlert({ type: '', message: '' }); // Limpia alertas previas

        try {
            const result = await recolectorService.updateRecolector(
                idUsuario,
                editForm.username,
                editForm.name,
                editForm.password || undefined, // Enviar undefined si está vacío para no actualizarlo
                parseInt(editForm.estado),
                parseInt(editForm.idZona)
            );
            setAlert({ type: 'success', message: result }); 
            await fetchRecolectores(); // Refresca la lista para mostrar datos actualizados
            cancelEditing();
        } catch (err) {
            console.error('Error updating recolector:', err);
            setAlert({ type: 'error', message: err }); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
                <h1 className="text-base font-semibold text-gray-900">
                    RECOLECT<span className="text-green-600">IA</span>
                </h1>
                <span className="text-xs text-gray-500">Listar Recolectores</span>
            </header>

            {/* Contenido Principal */}
            <div className="flex-1 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    {/* Componente de Alerta Reutilizable */}
                    <AlertMessage
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ type: '', message: '' })}
                    />

                    {/* Estado de Carga */}
                    {isLoading && recolectores.length === 0 && (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-400">Cargando recolectores...</p>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de "No hay recolectores" */}
                    {!isLoading && recolectores.length === 0 && (
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-500">No hay recolectores registrados.</p>
                        </div>
                    )}

                    {/* Lista de Recolectores */}
                    {!isLoading && recolectores.length > 0 && (
                        <div className="space-y-4">
                            {recolectores.map((recolector) => (
                                <div
                                    key={recolector.idUsuario}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-300"
                                >
                                    {editingId === recolector.idUsuario ? (
                                        // Formulario de Edición
                                        <form onSubmit={(e) => handleUpdate(e, recolector.idUsuario)} className="space-y-4">
                                            {/* ... campos del formulario ... */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                                                <input
                                                    type="text" name="username" value={editForm.username}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                                    disabled={isLoading} required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                                                <input
                                                    type="text" name="name" value={editForm.name}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                                    disabled={isLoading} required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña (opcional)</label>
                                                <input
                                                    type="password" name="password" value={editForm.password}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                                    placeholder="Dejar en blanco para no cambiar"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                                <select
                                                    name="estado" value={editForm.estado}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                                    disabled={isLoading} required
                                                >
                                                    <option value="1">Activo</option>
                                                    <option value="0">Inactivo</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                                                <ZonaSelect
                                                    name="idZona" value={editForm.idZona}
                                                    onChange={handleEditChange}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button type="submit" disabled={isLoading} className="flex-1 py-2 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none disabled:bg-gray-300 text-sm">Guardar</button>
                                                <button type="button" onClick={cancelEditing} disabled={isLoading} className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-300 focus:outline-none disabled:bg-gray-300 text-sm">Cancelar</button>
                                            </div>
                                        </form>
                                    ) : (
                                        // Vista de solo lectura
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{recolector.name}</p>
                                                <p className="text-xs text-gray-500">{recolector.username}</p>
                                                <p className="text-xs text-gray-500">
                                                    Estado: <span className={recolector.estado === 1 ? 'text-green-600' : 'text-red-600'}>{recolector.estado === 1 ? 'Activo' : 'Inactivo'}</span>
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

            {/* Espacio inferior */}
            <div className="h-20 sm:h-8"></div>
        </div>
    );
};

export default ListarRecolectores;