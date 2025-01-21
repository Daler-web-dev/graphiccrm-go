import React from 'react';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => (
    <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
            <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-cGradientBg text-white' : 'bg-gray-200 text-gray-700'
                    }`}
            >
                {i + 1}
            </button>
        ))}
    </div>
);

export default Pagination;