import { useMemo, useState } from "react";
import { Download, Filter, Search, X } from "lucide-react";
import { useEmployeeStore } from "../../features/employees/employee.store";
import {
  buildCsvFilename,
  downloadCsv,
  toCsv,
} from "../../features/employees/employee.export";
import {
  STATUS_OPTIONS,
  countActiveFilters,
  filterEmployees,
} from "../../features/employees/employee.filter";
import { searchEmployees } from "../../features/employees/employee.search";
import { sortEmployees } from "../../features/employees/employee.sort";
import type { EmployeeStatus } from "../../features/employees/employee.types";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "./Pagination";
import VirtualizedRows from "./VirtualizedRows";

function DataGrid() {
  const employees = useEmployeeStore((state) => state.employees);
  const query = useEmployeeStore((state) => state.query);
  const sort = useEmployeeStore((state) => state.sort);
  const filters = useEmployeeStore((state) => state.filters);
  const setQuery = useEmployeeStore((state) => state.setQuery);
  const toggleSort = useEmployeeStore((state) => state.toggleSort);
  const clearSort = useEmployeeStore((state) => state.clearSort);
  const setFilter = useEmployeeStore((state) => state.setFilter);
  const resetFilters = useEmployeeStore((state) => state.resetFilters);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department))].sort(),
    [employees],
  );

  // Pipeline: filter -> search -> sort -> paginate -> virtualize
  const filtered = useMemo(() => filterEmployees(employees, filters), [employees, filters]);
  const searched = useMemo(
    () => searchEmployees(filtered, debouncedQuery),
    [filtered, debouncedQuery],
  );
  const visibleEmployees = useMemo(() => sortEmployees(searched, sort), [searched, sort]);

  // Anything that changes WHICH rows we're paging over resets to page 1.
  // employees.length is included so a newly added employee (shown at the top) is visible.
  const resetKey = [
    debouncedQuery,
    filters.status,
    filters.department,
    sort?.key,
    sort?.direction,
    employees.length,
  ].join("|");

  const { page, pageSize, totalPages, pageItems, rangeStart, rangeEnd, setPage, setPageSize } =
    usePagination(visibleEmployees, resetKey);

  const activeFilterCount = countActiveFilters(filters);

  // Exports every matching row across all pages, not just the current page
  const handleExport = () => {
    const isFiltered = visibleEmployees.length !== employees.length;
    downloadCsv(toCsv(visibleEmployees), buildCsvFilename(isFiltered));
  };

  return (
    <section className="grid-card">
      <div className="grid-toolbar">
        <label className="grid-search">
          <Search size={15} />
          <input
            type="search"
            placeholder="Search employees"
            aria-label="Search employees"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <button
          type="button"
          className={`toolbar-button${filtersOpen || activeFilterCount > 0 ? " is-active" : ""}`}
          aria-expanded={filtersOpen}
          aria-controls="filter-bar"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <Filter size={15} />
          <span>Filter</span>
          {activeFilterCount > 0 && <b className="filter-count">{activeFilterCount}</b>}
        </button>

        {sort && (
          <button type="button" className="toolbar-button" onClick={clearSort}>
            <X size={15} />
            <span>Clear sort</span>
          </button>
        )}

        <button
          type="button"
          className="toolbar-button"
          onClick={handleExport}
          disabled={visibleEmployees.length === 0}
          title={`Export ${visibleEmployees.length.toLocaleString()} rows as CSV`}
        >
          <Download size={15} />
          <span>Export</span>
        </button>
      </div>

      {filtersOpen && (
        <div className="filter-bar" id="filter-bar">
          <label className="filter-field">
            <span>Status</span>
            <select
              value={filters.status ?? ""}
              onChange={(event) =>
                setFilter(
                  "status",
                  event.target.value === "" ? null : (event.target.value as EmployeeStatus),
                )
              }
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Department</span>
            <select
              value={filters.department ?? ""}
              onChange={(event) =>
                setFilter("department", event.target.value === "" ? null : event.target.value)
              }
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          {activeFilterCount > 0 && (
            <button type="button" className="toolbar-button" onClick={resetFilters}>
              <X size={15} />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      )}

      {visibleEmployees.length > 0 ? (
        <VirtualizedRows employees={pageItems} sort={sort} onSort={toggleSort} />
      ) : (
        <div className="grid-empty">
          <span>No employees match your search and filters.</span>
          {activeFilterCount > 0 && (
            <button type="button" className="toolbar-button" onClick={resetFilters}>
              Reset filters
            </button>
          )}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalItems={visibleEmployees.length}
        unfilteredTotal={employees.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </section>
  );
}

export default DataGrid;