import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Filter, Search, X } from "lucide-react";
import { useEmployeeStore } from "../../features/employees/employee.store";
import {
  STATUS_OPTIONS,
  countActiveFilters,
  filterEmployees,
} from "../../features/employees/employee.filter";
import { searchEmployees } from "../../features/employees/employee.search";
import { sortEmployees } from "../../features/employees/employee.sort";
import type { EmployeeStatus } from "../../features/employees/employee.types";
import { useDebounce } from "../../hooks/useDebounce";
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

  // UI-only state (is the panel open?) stays local; data state lives in the store
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department))].sort(),
    [employees],
  );

  // Pipeline: filter -> search -> sort -> virtualize
  // Separate memos so each stage only re-runs when its own inputs change.
  const filtered = useMemo(() => filterEmployees(employees, filters), [employees, filters]);
  const searched = useMemo(
    () => searchEmployees(filtered, debouncedQuery),
    [filtered, debouncedQuery],
  );
  const visibleEmployees = useMemo(() => sortEmployees(searched, sort), [searched, sort]);

  const activeFilterCount = countActiveFilters(filters);

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

        <button type="button" className="toolbar-button">
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
        <VirtualizedRows employees={visibleEmployees} sort={sort} onSort={toggleSort} />
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

      <div className="grid-footer">
        <span>
          Showing {visibleEmployees.length.toLocaleString()} of {employees.length.toLocaleString()} employees
        </span>
        <div className="pagination" aria-label="Pagination">
          <button type="button" className="pagination-button is-disabled" aria-disabled="true">
            <ChevronLeft size={14} />
          </button>
          <span className="pagination-page">1</span>
          <button type="button" className="pagination-button is-disabled" aria-disabled="true">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default DataGrid;