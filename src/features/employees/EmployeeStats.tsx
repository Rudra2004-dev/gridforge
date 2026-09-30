import { employees } from "./employee.data";

function EmployeeStats() {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
  const departments = new Set(employees.map((employee) => employee.department)).size;

  return (
    <section className="stats-grid" aria-label="Employee statistics">
      <article className="stat-card">
        <span>Total Employees</span>
        <strong>{totalEmployees}</strong>
      </article>
      <article className="stat-card">
        <span>Active Employees</span>
        <strong>{activeEmployees}</strong>
      </article>
      <article className="stat-card">
        <span>Departments</span>
        <strong>{departments}</strong>
      </article>
    </section>
  );
}

export default EmployeeStats;
