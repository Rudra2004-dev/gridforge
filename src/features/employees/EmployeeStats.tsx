import { useMemo } from "react";
import { useEmployeeStore } from "./employee.store";

function EmployeeStats() {
  const employees = useEmployeeStore((state) => state.employees);

  const { total, active, departments } = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((employee) => employee.status === "Active").length,
      departments: new Set(employees.map((employee) => employee.department)).size,
    }),
    [employees],
  );

  return (
    <section className="stats-grid" aria-label="Employee statistics">
      <article className="stat-card">
        <span>Total Employees</span>
        <strong>{total.toLocaleString()}</strong>
      </article>
      <article className="stat-card">
        <span>Active Employees</span>
        <strong>{active.toLocaleString()}</strong>
      </article>
      <article className="stat-card">
        <span>Departments</span>
        <strong>{departments}</strong>
      </article>
    </section>
  );
}

export default EmployeeStats;