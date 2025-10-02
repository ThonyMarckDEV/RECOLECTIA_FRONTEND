import React from 'react';

const Pagination = ({ currentPage, lastPage, onPageChange, isLoading }) => {
    // No se muestra nada si solo hay una página o no hay datos
    if (!lastPage || lastPage <= 1) {
        return null;
    }

    return (
        <div className="flex justify-between items-center mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Anterior
            </button>

            <span className="text-sm text-gray-700">
                Página {currentPage} de {lastPage}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage || isLoading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;