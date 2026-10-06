import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "../../hooks/usePagination";
import { getPageItems } from "./pagination.utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  rangeStart: number;
  rangeEnd: number;
  totalItems: number; // after search + filters
  unfilteredTotal: number; // whole dataset
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

function Pagination({
  page,
  totalPages,
  pageSize,
  rangeStart,
  rangeEnd,
  totalItems,
  unfilteredTotal,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const isFiltered = totalItems !== unfilteredTotal;

  return (
    <div className="grid-footer">
      <span aria-live="polite">
        {totalItems === 0
          ? "No employees"
          : `Showing ${rangeStart.toLocaleString()}–${rangeEnd.toLocaleString()} of ${totalItems.toLocaleString()} employees`}
        {isFiltered && ` (filtered from ${unfilteredTotal.toLocaleString()})`}
      </span>

      <div className="footer-controls">
        <label className="page-size">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <nav className="pagination" aria-label="Pagination">
          <button
            type="button"
            className="pagination-button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={14} />
          </button>

          {getPageItems(page, totalPages).map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                className={`pagination-button${item === page ? " is-current" : ""}`}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="pagination-ellipsis" aria-hidden="true">
                …
              </span>
            ),
          )}

          <button
            type="button"
            className="pagination-button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Pagination;