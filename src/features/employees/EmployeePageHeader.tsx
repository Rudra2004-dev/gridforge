import { Plus } from "lucide-react";

function EmployeePageHeader() {
  return (
    <section className="page-header">
      <div>
        <p className="page-eyebrow">Workspace / Employees</p>
        <h1 className="page-title">Employee Data</h1>
        <p className="page-description">
          Manage, analyze and explore your employee records.
        </p>
      </div>

      <button type="button" className="primary-button">
        <Plus size={16} />
        Add Employee
      </button>
    </section>
  );
}

export default EmployeePageHeader;
