import React, { useMemo } from 'react';

// Constante para representar la elipsis
const DOTS = '...';

/**
 * Hook para generar el rango de números de paginación de forma inteligente.
 */
const usePaginationRange = ({ currentPage, lastPage, siblingCount = 1 }) => {
    const paginationRange = useMemo(() => {
        // siblingCount: cuántos números a cada lado del actual
        // + 5: por el primero, el último, el actual y las dos elipsis
        const totalPageNumbers = siblingCount + 5;

        // Caso 1: Si el número de páginas es menor que los números que queremos mostrar,
        // devolvemos el rango completo [1, 2, ..., lastPage]
        if (totalPageNumbers >= lastPage) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }
        
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < lastPage - 2;

        const firstPageIndex = 1;
        const lastPageIndex = lastPage;

        // Caso 2: Solo mostrar elipsis a la derecha
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, lastPage];
        }

        // Caso 3: Solo mostrar elipsis a la izquierda
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => lastPage - rightItemCount + i + 1);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        // Caso 4: Mostrar elipsis en ambos lados
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

    }, [currentPage, lastPage, siblingCount]);

    return paginationRange;
};


const Pagination = ({ currentPage, lastPage, onPageChange, isLoading }) => {
    
    const paginationRange = usePaginationRange({ currentPage, lastPage });

    // No se muestra nada si solo hay una página o no hay datos
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => onPageChange(currentPage + 1);
    const onPrevious = () => onPageChange(currentPage - 1);
    
    return (
        <div className="flex justify-center items-center mt-6 space-x-2">
            {/* Botón Anterior */}
            <button
                onClick={onPrevious}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                &larr;
            </button>

            {/* Números de Página */}
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return <span key={index} className="px-3 py-1.5 text-sm text-gray-500">&#8230;</span>;
                }

                return (
                    <button
                        key={index}
                        onClick={() => onPageChange(pageNumber)}
                        disabled={isLoading}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                            pageNumber === currentPage
                                ? 'bg-green-600 text-white border border-green-600'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Botón Siguiente */}
            <button
                onClick={onNext}
                disabled={currentPage === lastPage || isLoading}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                &rarr;
            </button>
        </div>
    );
};

export default Pagination;