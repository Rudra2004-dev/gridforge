import { useMemo, useState } from "react";
import BarChart from "../components/charts/BarChart";
import ColumnChart from "../components/charts/ColumnChart";
import {
  computeAnalytics,
  type DepartmentMetric,
  type SalaryBin,
} from "../features/employees/employee.analytics";
import { useEmployeeStore } from "../features/employees/employee.store";

const integer = new Intl.NumberFormat("en-US");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const METRICS: { key: DepartmentMetric; label: string; format: (value: number) => string }[] = [
  { key: "headcount", label: "Headcount", format: (value) => integer.format(value) },
  { key: "averageSalary", label: "Avg salary", format: (value) => currency.format(value) },
  { key: "payroll", label: "Payroll", format: (value) => compactCurrency.format(value) },
];

function formatBinLabel(bin: SalaryBin): string {
  return bin.open ? `$${bin.from / 1000}k+` : `$${bin.from / 1000}–${bin.to / 1000}k`;
}

function AnalyticsPage() {
  const employees = useEmployeeStore((state) => state.employees);
  const [metric, setMetric] = useState<DepartmentMetric>("headcount");

  const analytics = useMemo(() => computeAnalytics(employees), [employees]);
  const {
    total,
    totalPayroll,
    averageSalary,
    medianSalary,
    averageTenureYears,
    inactiveCount,
    departments,
    hiresByYear,
    salaryBins,
  } = analytics;

  const activeMetric = METRICS.find((item) => item.key === metric) ?? METRICS[0];

  // Re-sorted when the metric changes, but the aggregation above is not recomputed
  const departmentData = useMemo(
    () =>
      departments
        .map((item) => ({ label: item.department, value: item[metric] }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)),
    [departments, metric],
  );

  const hiresData = useMemo(
    () => hiresByYear.map((item) => ({ label: String(item.year), value: item.count })),
    [hiresByYear],
  );

  const salaryData = useMemo(
    () => salaryBins.map((bin) => ({ label: formatBinLabel(bin), value: bin.count })),
    [salaryBins],
  );

  const inactivePercent = total === 0 ? 0 : (inactiveCount / total) * 100;

  return (
    <>
      <title>Analytics · GridForge</title>

      <section className="page-header">
        <div>
          <p className="page-eyebrow">Workspace / Analytics</p>
          <h1 className="page-title">Analytics</h1>
          <p className="page-description">
            Trends and breakdowns across your workforce.
          </p>
        </div>
      </section>

      <section className="overview-kpis" aria-label="Key metrics">
        <article className="stat-card">
          <span>Total payroll</span>
          <strong>{compactCurrency.format(totalPayroll)}</strong>
          <small>{integer.format(total)} employees</small>
        </article>
        <article className="stat-card">
          <span>Median salary</span>
          <strong>{currency.format(medianSalary)}</strong>
          <small>Average {currency.format(averageSalary)}</small>
        </article>
        <article className="stat-card">
          <span>Average tenure</span>
          <strong>{averageTenureYears.toFixed(1)} yrs</strong>
          <small>Across all employees</small>
        </article>
        <article className="stat-card">
          <span>Inactive rate</span>
          <strong>{inactivePercent.toFixed(1)}%</strong>
          <small>{integer.format(inactiveCount)} employees</small>
        </article>
      </section>

      <div className="overview-grid">
        <section className="panel" aria-labelledby="department-title">
          <div className="panel-head">
            <h2 className="panel-title" id="department-title">
              By department
            </h2>
            <div className="segmented" role="group" aria-label="Department metric">
              {METRICS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`segmented-button${metric === item.key ? " is-selected" : ""}`}
                  aria-pressed={metric === item.key}
                  onClick={() => setMetric(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <BarChart
            data={departmentData}
            formatValue={activeMetric.format}
            ariaLabel={`${activeMetric.label} by department`}
          />
        </section>

        <section className="panel" aria-labelledby="hires-title">
          <h2 className="panel-title" id="hires-title">
            Hires per year
          </h2>
          <p className="panel-note">Employees by the calendar year they joined.</p>
          <ColumnChart
            data={hiresData}
            formatValue={(value) => integer.format(value)}
            ariaLabel="Hires per year"
          />
        </section>
      </div>

      <section className="panel" aria-labelledby="salary-title">
        <h2 className="panel-title" id="salary-title">
          Salary distribution
        </h2>
        <p className="panel-note">
          Employees per $20k band. The median is {currency.format(medianSalary)}.
        </p>
        <ColumnChart
          data={salaryData}
          formatValue={(value) => integer.format(value)}
          ariaLabel="Employees per salary band"
        />
      </section>
    </>
  );
}

export default AnalyticsPage;