import { useState } from "react";
import { Plus } from "lucide-react";
import AddEmployeeDialog from "./AddEmployeeDialog";

function EmployeePageHeader() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="page-header">
      <div>
        <p className="page-eyebrow">Workspace / Employees</p>
        <h1 className="page-title">Employee Data</h1>
        <p className="page-description">
          Manage, analyze and explore your employee records.
        </p>
      </div>

      <button type="button" className="primary-button" onClick={() => setAddOpen(true)}>
        <Plus size={16} />
        Add Employee
      </button>

      <AddEmployeeDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </section>
  );
}

export default EmployeePageHeader;