import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dashboardService from 'services/dashboardService';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalReports: 0,
        totalUsers: 0,
        totalCollectors: 0,
        pendingReports: 0,
        acceptedReports: 0,
        resolvedReports: 0,
        rejectedReports: 0,
    });
    // Nuevo estado para el resumen per capita
    const [perCapitaSummary, setPerCapitaSummary] = useState({
        dailyTotal: 0,
        weeklyTotal: 0,
        monthlyTotal: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Llamamos a ambos endpoints al mismo tiempo para más eficiencia
                const [metricsResponse, perCapitaResponse] = await Promise.all([
                    dashboardService.getDashboardMetrics(),
                    dashboardService.getPerCapitaSummary(),
                ]);

                setMetrics(metricsResponse.data);
                setPerCapitaSummary(perCapitaResponse.data);
                setError(null);
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
    }, []);

    // Datos para el gráfico de estado de reportes
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

    // Datos para el nuevo gráfico de basura registrada
    const perCapitaChartData = {
        labels: ['Hoy', 'Esta Semana', 'Este Mes'],
        datasets: [{
            label: 'Basura Registrada (kg)',
            data: [
                perCapitaSummary.dailyTotal,
                perCapitaSummary.weeklyTotal,
                perCapitaSummary.monthlyTotal,
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(5, 150, 105, 1)',
            borderWidth: 1,
        }],
    };

    const perCapitaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Total de Basura Registrada (Per Capita)',
                font: { size: 16 },
                color: '#1f2937',
            },
        },
        scales: { y: { beginAtZero: true } },
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
                <h1 className="text-base font-semibold text-gray-900">
                    RECOLECT<span className="text-green-600">IA</span> - Dashboard
                </h1>
            </header>

            <div className="flex-1 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-3 text-red-600 text-center p-3 bg-red-50 rounded-xl border border-red-100 text-sm">
                            {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-400">Cargando métricas...</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="space-y-6">
                            {/* Métricas Generales */}
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

                            {/* Nueva Sección de Resumen Per Capita */}
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
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                                    <h3 className="text-sm font-medium text-gray-700">Este Mes 🗓️</h3>
                                    <p className="text-2xl font-semibold text-gray-900">{perCapitaSummary.monthlyTotal.toFixed(2)} kg</p>
                                </div>
                            </div>

                            {/* Sección de Gráficos */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="h-64">
                                        <Bar data={perCapitaChartData} options={perCapitaChartOptions} />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="h-64">
                                        <Bar data={reportStatusChartData} options={reportStatusChartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="h-20 sm:h-8"></div>
        </div>
    );
};

export default Dashboard;