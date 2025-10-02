import React, { useState } from 'react';
import recolectorService from 'services/recolectoresService';
import ZonaSelect from 'components/Shared/Comboboxes/Zona/ZonaSelect';
import AlertMessage from 'components/Shared/Error/AlertMessage';

const Recolector = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [estado, setEstado] = useState('1');
    const [idZona, setIdZona] = useState('');
    const [isLoading, setIsLoading] = useState(false);

   const [alert, setAlert] = useState(null); // Un solo estado, inicializado en null.
  
    const resetForm = () => {
        setUsername('');
        setName('');
        setPassword('');
        setEstado('1');
        setIdZona('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlert({ type: '', message: null });

        try {
            const result = await recolectorService.createRecolector(
                username,
                name,
                password,
                parseInt(estado),
                parseInt(idZona)
            );

            setAlert(result);
            resetForm();
        } catch (err) {
            console.error('Error creating recolector:', err);

            setAlert(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
                <h1 className="text-base font-semibold text-gray-900">
                    RECOLECT<span className="text-green-600">IA</span>
                </h1>
                <span className="text-xs text-gray-500">Agregar Recolector</span>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    {/* El componente de Alerta ya está listo para recibir el arreglo de mensajes */}
                    <AlertMessage
                      type={alert?.type}
                      message={alert?.message}
                      details={alert?.details}
                      onClose={() => setAlert(null)}
                    />

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Username */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                placeholder="Ingresa el nombre de usuario"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Nombre */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                placeholder="Ingresa el nombre completo"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                placeholder="Ingresa la contraseña"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Estado */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                disabled={isLoading}
                                required
                            >
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>

                        {/* Zona */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zona
                            </label>
                            <ZonaSelect
                                value={idZona}
                                onChange={(e) => setIdZona(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !username || !name || !password || !idZona}
                            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creando...</span>
                                </div>
                            ) : (
                                'Crear Recolector'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <div className="h-20 sm:h-8"></div>
        </div>
    );
};

export default Recolector;