import React, { useState, useEffect } from 'react';
import perCapitaService from 'services/perCapitaService';
import AlertMessage from 'components/Shared/Error/AlertMessage';

const PerCapita = () => {
    const [weight, setWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [canSubmit, setCanSubmit] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await perCapitaService.checkTodayRecord();
                setCanSubmit(response.can_submit);
            } catch (err) {
                setAlert({
                    type: 'error',
                    message: 'No se pudo verificar el estado del registro.',
                    details: [err.message]
                });
                console.error(err);
            } finally {
                setIsChecking(false);
            }
        };
        checkStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlert(null);

        try {
            const result = await perCapitaService.createRecord(parseFloat(weight));
            setAlert(result);
            setWeight('');
            setCanSubmit(false);
        } catch (err) {
            setAlert(err);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Se elimina el 'if (isChecking)' que ocupaba toda la pantalla.

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white">
                <h1 className="text-base font-semibold text-gray-900">RECOLECT<span className="text-green-600">IA</span></h1>
                <span className="text-xs text-gray-500">Mi Basura Diaria</span>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    <AlertMessage
                        type={alert?.type}
                        message={alert?.message}
                        details={alert?.details}
                        onClose={() => setAlert(null)}
                    />

                    {/* 2. Se añade el loader aquí, dentro del layout principal */}
                    {isChecking ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-8 h-8 mx-auto border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="mt-3 text-sm text-gray-500">Verificando estado...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!canSubmit && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-center">
                                    <p className="font-semibold">¡Ya registraste tu basura por hoy!</p>
                                    <p className="text-sm mt-1">Vuelve mañana para seguir midiendo tu impacto. Gracias por tu contribución.</p>
                                </div>
                            )}

                            {canSubmit && (
                                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Peso de tu basura de hoy (en kg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm"
                                            placeholder="Ej: 1.5"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !weight}
                                        className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 disabled:bg-gray-300"
                                    >
                                        {isLoading ? 'Guardando...' : 'Guardar Registro de Hoy'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerCapita;