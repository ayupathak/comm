import React from "react";

type PaginationProps = {
    setCurrentPage: (currentPage: number | ((prev: number) => number)) => void;
    visiblePageNumbers: Array<number>
    currentPage: number;
    totalPages: number;
    isStatsLoading: boolean;
};

const Pagination = ({setCurrentPage, visiblePageNumbers, currentPage, totalPages, isStatsLoading}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-400">
      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        {"<<"}
      </button>
      <button
        onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      <div className="flex gap-2">
        {visiblePageNumbers.map((number: number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number as number)}
            className={
              number === currentPage
                ? "font-bold text-black"
                : "text-normal text-gray-400"
            }
            disabled={number === currentPage || isStatsLoading}
          >
            {number}
          </button>
        ))}
        {visiblePageNumbers[visiblePageNumbers.length - 1] ===
        totalPages ? null : (
          <span>...</span>
        )}
      </div>

      <button
        onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
