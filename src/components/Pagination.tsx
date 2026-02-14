// components/Pagination.tsx
'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
      >
        Anterior
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-4 py-2 rounded-lg font-medium min-w-[40px]
            ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
      >
        Siguiente
      </button>
    </div>
  );
}
