import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import { generateEmployees } from "../../features/employees/employee.generator";
import VirtualizedRows from "./VirtualizedRows";

const employees = generateEmployees(100000);

function DataGrid() {
  return (
    <section className="grid-card">
      <div className="grid-toolbar">
        <label className="grid-search">
          <Search size={15} />
          <input type="search" placeholder="Search employees" />
        </label>
        <button type="button" className="toolbar-button">
          <Filter size={15} />
          <span>Filter</span>
        </button>
        <button type="button" className="toolbar-button">
          <ArrowUpDown size={15} />
          <span>Sort</span>
        </button>
        <button type="button" className="toolbar-button">
          <Download size={15} />
          <span>Export</span>
        </button>
      </div>

      <VirtualizedRows employees={employees} />

      <div className="grid-footer">
        <span>Showing {employees.length} employees</span>
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