import React, { useState, useEffect } from 'react';
import perCapitaService from 'services/perCapitaService';
import AlertMessage from 'components/Shared/Error/AlertMessage';
import Pagination from './components/Pagination'; // O la ruta correcta a tu componente Pagination

const ListarPerCapitas = () => {
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null); // Iniciar en null para evitar renderizado inicial
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            try {
                const response = await perCapitaService.getMyRecords(currentPage);
                setRecords(response.data);
                setSummary(response.summary);
                setPaginationInfo(response.pagination);
            } catch (err) {
                setAlert(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecords();
    }, [currentPage]);

    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePageChange = (newPage) => {
        if (paginationInfo && newPage > 0 && newPage <= paginationInfo.last_page) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white">
                <h1 className="text-base font-semibold text-gray-900">RECOLECT<span className="text-green-600">IA</span></h1>
                <span className="text-xs text-gray-500">Mis Registros</span>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    <AlertMessage
                        type={alert?.type}
                        message={alert?.message}
                        details={alert?.details}
                        onClose={() => setAlert(null)}
                    />

                    {/* El resumen solo se muestra si no está cargando y hay datos */}
                    {!isLoading && summary && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                <p className="text-sm text-gray-500">Basura Total Registrada</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {(summary.total_weight_kg || 0).toFixed(2)} kg 🗑️
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                <p className="text-sm text-gray-500">Días de Registro</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {summary.total_days} días 🗓️
                                </p>
                            </div>
                        </div>
                    )}

                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Historial</h2>
                    
                    {/* --- AQUÍ ESTÁ EL LOADER ANIMADO CORREGIDO --- */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-6 h-6 mx-auto border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="mt-2 text-xs text-gray-400">Cargando tus registros...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {records.length > 0 ? (
                                records.map((record, index) => (
                                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                        <p className="font-medium text-gray-700">{formatDate(record.record_date)}</p>
                                        <p className="text-gray-900 font-semibold bg-gray-100 px-3 py-1 rounded-full text-sm">
                                            {record.weight_kg} kg
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                                    <p className="text-gray-600">Aún no tienes registros.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {paginationInfo && (
                        <Pagination
                            currentPage={paginationInfo.current_page}
                            lastPage={paginationInfo.last_page}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListarPerCapitas;