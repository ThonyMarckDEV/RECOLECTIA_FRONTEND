import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dashboardService from 'services/dashboardService';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Helpers de Fechas ---
// Obtiene el primer día del mes actual en formato YYYY-MM-DD
const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

// Obtiene el día de hoy en formato YYYY-MM-DD
const getToday = () => {
    return new Date().toISOString().split('T')[0];
};
// --- Fin Helpers ---


const Dashboard = () => {
    // Estado para métricas generales
    const [metrics, setMetrics] = useState({
        totalReports: 0,
        totalUsers: 0,
        totalCollectors: 0,
        pendingReports: 0,
        acceptedReports: 0,
        resolvedReports: 0,
        rejectedReports: 0,
    });
    
    // Estado para las tarjetas de resumen per capita
    const [perCapitaSummary, setPerCapitaSummary] = useState({
        dailyTotal: 0,
        weeklyTotal: 0,
        monthlyTotal: 0, // Este será el total del RANGO
    });

    // --- Nuevos Estados para Filtros y Gráfico dinámico ---
    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getToday());

    // El gráfico per capita AHORA debe ser un estado para poder actualizarse
    const [perCapitaChartData, setPerCapitaChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Basura Registrada (kg)',
            data: [],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(5, 150, 105, 1)',
            borderWidth: 1,
        }],
    });
    // --- Fin Nuevos Estados ---

    const [isLoading, setIsLoading] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false); // Loading para el botón de filtro
    const [error, setError] = useState(null);


    // --- Función para cargar SÓLO datos per capita (para filtros) ---
    // La usamos para recargar los datos al presionar "Filtrar"
    const fetchPerCapitaData = async (start, end) => {
        setIsFiltering(true); 
        setError(null);
        try {
            // El servicio ya devuelve { success: true, data: {...} } gracias a handleResponse
            const perCapitaResponse = await dashboardService.getPerCapitaSummary(start, end);

            // Actualizamos las tarjetas
            setPerCapitaSummary(perCapitaResponse.data);

            // Actualizamos el gráfico con los datos del backend
            setPerCapitaChartData(prevChartData => ({
                ...prevChartData,
                labels: perCapitaResponse.data.chart.labels,
                datasets: [
                    {
                        ...prevChartData.datasets[0],
                        data: perCapitaResponse.data.chart.values,
                    }
                ]
            }));

            // Actualizamos los inputs de fecha (por si el backend usó defaults)
            setStartDate(perCapitaResponse.data.startDate);
            setEndDate(perCapitaResponse.data.endDate);

        } catch (err) {
            console.error('Error fetching per capita data:', err);
            const errorMessage = err.message || 'Error al cargar el resumen per capita';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsFiltering(false);
        }
    };
    // --- Fin Función ---


    // --- useEffect para la CARGA INICIAL (métricas + per capita) ---
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Preparamos las dos llamadas
                const metricsPromise = dashboardService.getDashboardMetrics();
                // Llamamos per capita con las fechas iniciales (estado)
                const perCapitaPromise = dashboardService.getPerCapitaSummary(startDate, endDate);

                // Ejecutamos ambas en paralelo
                const [metricsResponse, perCapitaResponse] = await Promise.all([
                    metricsPromise,
                    perCapitaPromise
                ]);

                // Seteamos las métricas (tu lógica original)
                setMetrics(metricsResponse.data); 

                // Seteamos los datos per capita (tarjetas Y gráfico)
                setPerCapitaSummary(perCapitaResponse.data);
                setPerCapitaChartData(prevChartData => ({
                    ...prevChartData,
                    labels: perCapitaResponse.data.chart.labels,
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: perCapitaResponse.data.chart.values,
                        }
                    ]
                }));
                // Sincronizamos fechas por si el backend usó defaults
                setStartDate(perCapitaResponse.data.startDate);
                setEndDate(perCapitaResponse.data.endDate);
                
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                const errorMessage = err.message || 'Error al cargar los datos del dashboard';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Se ejecuta solo una vez al inicio
    // --- Fin useEffect ---

    
    // --- Handler para el botón de filtrar ---
    const handleFilter = () => {
        if (new Date(startDate) > new Date(endDate)) {
            toast.error('La fecha de inicio no puede ser mayor a la fecha de fin.');
            return;
        }
        // Llama a la función que solo recarga los datos per capita
        fetchPerCapitaData(startDate, endDate);
    };

    // --- NUEVO: Handler para el botón de limpiar ---
    const handleClearFilter = () => {
        // 1. Obtenemos los valores por defecto
        const defaultStart = getFirstDayOfMonth();
        const defaultEnd = getToday();

        // 2. Seteamos el estado de los inputs
        setStartDate(defaultStart);
        setEndDate(defaultEnd);

        // 3. Recargamos la data con esos valores por defecto
        // (No es necesario toast de error por fechas, ya que son válidas)
        fetchPerCapitaData(defaultStart, defaultEnd);
    };
    // --- FIN NUEVO ---


    // --- Datos para el gráfico de estado de reportes (sin cambios) ---
    const reportStatusChartData = {
        labels: ['Pendiente', 'Aceptado', 'Resuelto', 'Rechazado'],
        datasets: [{
            label: 'Cantidad de Reportes',
            data: [
                metrics.pendingReports,
                metrics.acceptedReports,
                metrics.resolvedReports,
                metrics.rejectedReports,
            ],
            backgroundColor: [
                'rgba(252, 211, 77, 0.5)', // Yellow
                'rgba(52, 211, 153, 0.5)', // Green
                'rgba(96, 165, 250, 0.5)', // Blue
                'rgba(248, 113, 113, 0.5)', // Red
            ],
            borderColor: [
                'rgba(234, 179, 8, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 1,
        }],
    };

    const reportStatusChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Distribución de Reportes por Estado',
                font: { size: 16 },
                color: '#1f2937',
            },
        },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    };
    // --- Fin datos gráfico reportes ---


    // --- Opciones para el gráfico per capita (título actualizado) ---
    const perCapitaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Basura Registrada por Día (Per Capita)', // Título actualizado
                font: { size: 16 },
                color: '#1f2937',
            },
        },
        scales: { y: { beginAtZero: true } },
    };
    // --- Fin opciones gráfico ---


    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            {/* --- Header (sin cambios) --- */}
            <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
                <h1 className="text-base font-semibold text-gray-900">
                    RECOLECT<span className="text-green-600">IA</span> - Dashboard
                </h1>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    
                    {/* --- Panel de Error (sin cambios) --- */}
                    {error && (
                        <div className="mb-3 text-red-600 text-center p-3 bg-red-50 rounded-xl border border-red-100 text-sm">
                            {error}
                        </div>
                    )}

                    {/* === INICIO: PANEL DE FILTROS (ACTUALIZADO CON BOTÓN LIMPIAR) === */}
                    <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
                        {/* Input Fecha Inicio */}
                        <div className="flex-1 w-full">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>
                        {/* Input Fecha Fin */}
                        <div className="flex-1 w-full">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>

                        {/* --- INICIO: CONTENEDOR DE BOTONES (ACTUALIZADO) --- */}
                        <div className="w-full sm:w-auto pt-5 flex flex-col sm:flex-row gap-2">
                             {/* Botón Limpiar (NUEVO) */}
                             <button
                                onClick={handleClearFilter}
                                disabled={isFiltering || isLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50"
                            >
                                Limpiar
                            </button>
                            
                            {/* Botón Filtrar */}
                            <button
                                onClick={handleFilter}
                                disabled={isFiltering || isLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isFiltering ? 'Filtrando...' : 'Filtrar'}
                            </button>
                        </div>
                        {/* --- FIN: CONTENEDOR DE BOTONES --- */}
                    </div>
                    {/* === FIN: PANEL DE FILTROS === */}


                    {/* --- Spinner de Carga Inicial (sin cambios) --- */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-400">Cargando métricas...</p>
                            </div>
                        </div>
                    )}

                    {/* --- Contenido Principal (con tarjetas actualizadas) --- */}
                    {!isLoading && !error && (
                        <div className="space-y-6">
                            
                            {/* --- Métricas Generales (sin cambios) --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Total Reportes</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalReports}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Total Usuarios</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalUsers}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Total Recolectores</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{metrics.totalCollectors}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Reportes Pendientes</h3>
                                    <p className="text-2xl font-semibold text-yellow-600">{metrics.pendingReports}</p>
                                </div>
                            </div>

                            {/* --- Resumen Per Capita (Tarjetas actualizadas) --- */}
                            <h2 className="text-xl font-semibold text-gray-800 pt-4">Resumen de Basura Registrada</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Registrado Hoy ☀️</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{perCapitaSummary.dailyTotal.toFixed(2)} kg</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Esta Semana 📅</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{perCapitaSummary.weeklyTotal.toFixed(2)} kg</p>
                                </div>
                                {/* TARJETA MODIFICADA */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Total en Rango 🗓️</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{perCapitaSummary.monthlyTotal.toFixed(2)} kg</p>
                                    <span className="text-xs text-gray-500">{startDate} al {endDate}</span>
                                </div>
                            </div>

                            {/* --- Sección de Gráficos (Gráfico per capita actualizado) --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="h-64">
                                        {/* GRÁFICO MODIFICADO: ahora usa el ESTADO 'perCapitaChartData' */}
                                        <Bar data={perCapitaChartData} options={perCapitaChartOptions} />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="h-64">
                                        {/* Gráfico sin cambios */}
                                        <Bar data={reportStatusChartData} options={reportStatusChartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* --- Footer/Espaciador (sin cambios) --- */}
            <div className="h-20 sm:h-8"></div>
        </div>
    );
};

export default Dashboard;
