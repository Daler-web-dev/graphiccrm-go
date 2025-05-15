import React from 'react';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < pagesToShow) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + pagesToShow - 1);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - pagesToShow + 1);
        }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-4 gap-2">
            {currentPage > 1 && (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700"
                >
                    Предыдущий
                </button>
            )}
            {startPage > 1 && (
                <button
                    type='button'
                    onClick={() => onPageChange(1)}
                    className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700"
                >
                    1
                </button>
            )}
            {startPage > 2 && <span className="px-3 py-1">...</span>}
            {pages.map(page => (
                <button
                    type='button'
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-cGradientBg text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {page}
                </button>
            ))}
            {endPage < totalPages - 1 && <span className="px-3 py-1">...</span>}
            {endPage < totalPages && (
                <button
                    type='button'
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700"
                >
                    {totalPages}
                </button>
            )}
            {currentPage < totalPages && (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700"
                >
                    Следующий
                </button>
            )}
        </div>
    );
};

export default Pagination;
