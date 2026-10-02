import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
//import { employees } from "../../features/employees/employee.data";
import type { EmployeeStatus } from "../../features/employees/employee.types";
import { generateEmployees } from "../../features/employees/employee.generator";




const employees = generateEmployees(1000);



const salaryFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function statusClassName(status: EmployeeStatus): string {
  if (status === "Active") {
    return "status-badge status-badge--active";
  }

  if (status === "On Leave") {
    return "status-badge status-badge--leave";
  }

  return "status-badge status-badge--inactive";
}

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

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th className="col-salary">Salary</th>
              <th>Status</th>
              <th className="col-date">Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="col-id cell-muted">{employee.id}</td>
                <td>
                  <div className="name-cell">
                    <span className="cell-avatar" aria-hidden="true">
                      {getInitials(employee.name)}
                    </span>
                    <strong>{employee.name}</strong>
                  </div>
                </td>
                <td className="cell-muted">{employee.email}</td>
                <td>{employee.role}</td>
                <td>{employee.department}</td>
                <td className="col-salary">{salaryFormatter.format(employee.salary)}</td>
                <td>
                  <span className={statusClassName(employee.status)}>{employee.status}</span>
                </td>
                <td className="col-date cell-muted">{employee.joiningDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
