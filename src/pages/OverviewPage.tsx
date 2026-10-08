import { useMemo } from "react";
import { Link } from "react-router-dom";
import { STATUS_OPTIONS } from "../features/employees/employee.filter";
import { computeOverview } from "../features/employees/employee.overview";
import { useEmployeeStore } from "../features/employees/employee.store";
import type { EmployeeStatus } from "../features/employees/employee.types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// Build the Date from parts (local time). new Date("2026-09-30") is parsed as UTC
// and can display the previous day in timezones behind UTC.
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

const STATUS_MODIFIER: Record<EmployeeStatus, string> = {
  Active: "active",
  "On Leave": "leave",
  Inactive: "inactive",
};

function OverviewPage() {
  const employees = useEmployeeStore((state) => state.employees);
  const showOnly = useEmployeeStore((state) => state.showOnly);

  const overview = useMemo(() => computeOverview(employees), [employees]);
  const { total, statusCounts, averageSalary, joinedThisYear, departments, recentHires } =
    overview;

  const maxDepartmentCount = departments[0]?.count ?? 1;
  const activeShare = total === 0 ? 0 : Math.round((statusCounts.Active / total) * 100);

  return (
    <>
      <title>Overview · GridForge</title>

      <section className="page-header">
        <div>
          <p className="page-eyebrow">Workspace / Overview</p>
          <h1 className="page-title">Overview</h1>
          <p className="page-description">A snapshot of your workforce at a glance.</p>
        </div>
      </section>

      <section className="overview-kpis" aria-label="Key metrics">
        <article className="stat-card">
          <span>Total employees</span>
          <strong>{total.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Active</span>
          <strong>{statusCounts.Active.toLocaleString()}</strong>
          <small>{activeShare}% of workforce</small>
        </article>
        <article className="stat-card">
          <span>Average salary</span>
          <strong>{currencyFormatter.format(averageSalary)}</strong>
        </article>
        <article className="stat-card">
          <span>Joined this year</span>
          <strong>{joinedThisYear.toLocaleString()}</strong>
        </article>
      </section>

      <div className="overview-grid">
        <section className="panel" aria-labelledby="headcount-title">
          <h2 className="panel-title" id="headcount-title">
            Headcount by department
          </h2>
          <ul className="bar-list">
            {departments.map((item) => (
              <li key={item.department}>
                <Link
                  to="/employees"
                  className="bar-row"
                  onClick={() => showOnly({ department: item.department })}
                  aria-label={`${item.department}: ${item.count} employees. View in data grid.`}
                >
                  <span className="bar-label">{item.department}</span>
                  <span className="bar-track" aria-hidden="true">
                    <span
                      className="bar-fill"
                      style={{ width: `${(item.count / maxDepartmentCount) * 100}%` }}
                    />
                  </span>
                  <span className="bar-value">{item.count.toLocaleString()}</span>
                  <span className="bar-meta">avg {currencyFormatter.format(item.averageSalary)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="overview-side">
          <section className="panel" aria-labelledby="status-title">
            <h2 className="panel-title" id="status-title">
              Status
            </h2>
            <div
              className="status-bar"
              role="img"
              aria-label={STATUS_OPTIONS.map(
                (status) => `${status}: ${statusCounts[status]}`,
              ).join(", ")}
            >
              {STATUS_OPTIONS.map((status) => (
                <span
                  key={status}
                  className={`status-segment status-segment--${STATUS_MODIFIER[status]}`}
                  style={{ width: `${total === 0 ? 0 : (statusCounts[status] / total) * 100}%` }}
                />
              ))}
            </div>
            <ul className="status-legend">
              {STATUS_OPTIONS.map((status) => (
                <li key={status}>
                  <Link
                    to="/employees"
                    className="legend-row"
                    onClick={() => showOnly({ status })}
                  >
                    <span
                      className={`legend-dot status-segment--${STATUS_MODIFIER[status]}`}
                      aria-hidden="true"
                    />
                    <span>{status}</span>
                    <b>{statusCounts[status].toLocaleString()}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel" aria-labelledby="hires-title">
            <h2 className="panel-title" id="hires-title">
              Recent hires
            </h2>
            <ul className="hire-list">
              {recentHires.map((employee) => (
                <li key={employee.id} className="hire-row">
                  <div className="hire-meta">
                    <strong>{employee.name}</strong>
                    <span>
                      {employee.role} · {employee.department}
                    </span>
                  </div>
                  <time dateTime={employee.joiningDate}>{formatIsoDate(employee.joiningDate)}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

export default OverviewPage;