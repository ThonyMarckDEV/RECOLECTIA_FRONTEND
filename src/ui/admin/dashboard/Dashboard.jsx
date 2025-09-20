import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dashboardService from './services/dashboardService';

// Register Chart.js components
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardService.getDashboardMetrics();
        // Access the nested data property
        if (response.success) {
          setMetrics(response.data);
          setError(null);
        } else {
          throw new Error(response.message || 'Error en la respuesta del servidor');
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError(err.message || 'Error al cargar las métricas');
        toast.error(err.message || 'Error al cargar las métricas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Chart data for report statuses
  const chartData = {
    labels: ['Pendiente', 'Aceptado', 'Resuelto', 'Rechazado'],
    datasets: [
      {
        label: 'Cantidad de Reportes',
        data: [
          metrics.pendingReports,
          metrics.acceptedReports,
          metrics.resolvedReports,
          metrics.rejectedReports,
        ],
        backgroundColor: [
          'rgba(254, 249, 195, 0.8)', // Yellow for Pendiente
          'rgba(209, 250, 229, 0.8)', // Green for Aceptado
          'rgba(219, 234, 254, 0.8)', // Blue for Resuelto
          'rgba(254, 226, 226, 0.8)', // Red for Rechazado
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribución de Reportes por Estado',
        font: { size: 16 },
        color: '#1f2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Ultra Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white z-10">
        <h1 className="text-base font-semibold text-gray-900">
          RECOLECT<span className="text-green-600">IA</span> - Dashboard
        </h1>
      </header>
      {/* Main Content Container */}
      <div className="flex-1 px-4 py-3">
        <div className="max-w-7xl mx-auto">
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
                <p className="text-xs text-gray-400">Cargando métricas...</p>
              </div>
            </div>
          )}
          {/* Metrics Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <h3 className="text-sm font-medium text-gray-700">Reportes Aceptados</h3>
                <p className="text-2xl font-semibold text-green-600">{metrics.acceptedReports}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <h3 className="text-sm font-medium text-gray-700">Reportes Resueltos</h3>
                <p className="text-2xl font-semibold text-blue-600">{metrics.resolvedReports}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <h3 className="text-sm font-medium text-gray-700">Reportes Rechazados</h3>
                <p className="text-2xl font-semibold text-red-600">{metrics.rejectedReports}</p>
              </div>
            </div>
          )}
          {/* Chart */}
          {!isLoading && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Space for Mobile Navigation */}
      <div className="h-20 sm:h-8"></div>
      {/* Toast Notifications - Minimalist Style */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        theme="light"
        toastClassName="!bg-white !shadow-lg !border !border-gray-200 !rounded-xl !text-sm"
        bodyClassName="!text-gray-700 !font-normal"
        closeButton={false}
      />
      {/* Custom CSS */}
      <style jsx>{`
        .Toastify__toast {
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          border: 1px solid #e5e7eb !important;
        }
        .Toastify__toast--success {
          background: #f0fdf4 !important;
          color: #16a34a !important;
          border-color: #bbf7d0 !important;
        }
        .Toastify__toast--error {
          background: #fef2f2 !important;
          color: #dc2626 !important;
          border-color: #fecaca !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;