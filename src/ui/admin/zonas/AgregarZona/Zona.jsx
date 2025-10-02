import React, { useState } from 'react';
import zonaService from 'services/zonaService';
import AlertMessage from 'components/Shared/Error/AlertMessage';

const Zona = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [alert, setAlert] = useState(null); // Un solo estado, inicializado en null.

    const resetForm = () => {
        setName('');
        setDescription('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Limpiamos la alerta al iniciar
        setAlert(null); // Limpiamos la alerta

        try {
            const result = await zonaService.createZona(name, description);
            
            // 2. Usamos setAlert para el mensaje de éxito
            setAlert(result);
            resetForm();

        } catch (err) {
            console.error('Error creating zona:', err);
            
            // 3. Usamos setAlert para el mensaje de error
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
                <span className="text-xs text-gray-500">Agregar Zona</span>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    
                    {/* 4. Usamos el componente AlertMessage para mostrar todos los mensajes */}
                    <AlertMessage
                      type={alert?.type}
                      message={alert?.message}
                      details={alert?.details}
                      onClose={() => setAlert(null)}
                    />

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Nombre */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Zona
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                                placeholder="Ingresa el nombre de la zona"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white text-sm resize-none"
                                rows="3"
                                placeholder="Ingresa una descripción (opcional)"
                                disabled={isLoading}
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !name}
                            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creando...</span>
                                </div>
                            ) : (
                                'Crear Zona'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <div className="h-20 sm:h-8"></div>
        </div>
    );
};

export default Zona;