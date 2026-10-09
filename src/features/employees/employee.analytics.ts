import type { Employee } from "./employee.types";

export type DepartmentMetric = "headcount" | "averageSalary" | "payroll";

export type DepartmentStat = { department: string } & Record<DepartmentMetric, number>;

export type YearCount = { year: number; count: number };

export type SalaryBin = {
  from: number;
  to: number;
  count: number;
  open: boolean; // true for the last "$200k+" bin
};

export type AnalyticsData = {
  total: number;
  totalPayroll: number;
  averageSalary: number;
  medianSalary: number;
  averageTenureYears: number;
  inactiveCount: number;
  departments: DepartmentStat[]; // alphabetical; the page sorts by the chosen metric
  hiresByYear: YearCount[]; // continuous range, gaps filled with 0
  salaryBins: SalaryBin[];
};

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const SALARY_BIN_SIZE = 20_000;
// Salaries at or above this share one open-ended bin, so a single typo like
// 9,000,000 can't create hundreds of empty bins.
const SALARY_BIN_CAP = 200_000;

// Build the Date from parts (local time). new Date("2026-09-30") is parsed as UTC.
function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function median(sorted: readonly number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function buildSalaryBins(
  salaries: readonly number[],
  minSalary: number,
  maxSalary: number,
): SalaryBin[] {
  const start = Math.floor(Math.min(minSalary, SALARY_BIN_CAP) / SALARY_BIN_SIZE) * SALARY_BIN_SIZE;
  const lastIndex = Math.floor((Math.min(maxSalary, SALARY_BIN_CAP) - start) / SALARY_BIN_SIZE);

  const bins: SalaryBin[] = Array.from({ length: lastIndex + 1 }, (_, index) => {
    const from = start + index * SALARY_BIN_SIZE;
    return { from, to: from + SALARY_BIN_SIZE, count: 0, open: from === SALARY_BIN_CAP };
  });

  for (const salary of salaries) {
    const index = Math.min(Math.floor((salary - start) / SALARY_BIN_SIZE), lastIndex);
    bins[index].count++;
  }

  return bins;
}

// `now` is a parameter so tenure is deterministic and testable.
export function computeAnalytics(employees: readonly Employee[], now = new Date()): AnalyticsData {
  const total = employees.length;

  if (total === 0) {
    return {
      total: 0,
      totalPayroll: 0,
      averageSalary: 0,
      medianSalary: 0,
      averageTenureYears: 0,
      inactiveCount: 0,
      departments: [],
      hiresByYear: [],
      salaryBins: [],
    };
  }

  const salaries: number[] = [];
  const byDepartment = new Map<string, { headcount: number; payroll: number }>();
  const hiresPerYear = new Map<number, number>();
  let totalPayroll = 0;
  let tenureMs = 0;
  let inactiveCount = 0;
  let minSalary = Infinity;
  let maxSalary = -Infinity;
  let minYear = Infinity;
  let maxYear = -Infinity;

  // One pass over the data for every metric.
  // (min/max use plain comparisons: Math.min(...bigArray) can overflow the call stack at ~100k items.)
  for (const employee of employees) {
    const joined = parseIsoDate(employee.joiningDate);
    const year = joined.getFullYear();

    salaries.push(employee.salary);
    totalPayroll += employee.salary;
    if (employee.salary < minSalary) minSalary = employee.salary;
    if (employee.salary > maxSalary) maxSalary = employee.salary;
    if (year < minYear) minYear = year;
    if (year > maxYear) maxYear = year;

    // A joining date in the future counts as 0 tenure, never negative
    tenureMs += Math.max(0, now.getTime() - joined.getTime());
    if (employee.status === "Inactive") inactiveCount++;

    hiresPerYear.set(year, (hiresPerYear.get(year) ?? 0) + 1);

    const entry = byDepartment.get(employee.department) ?? { headcount: 0, payroll: 0 };
    entry.headcount++;
    entry.payroll += employee.salary;
    byDepartment.set(employee.department, entry);
  }

  const departments: DepartmentStat[] = [...byDepartment]
    .map(([department, { headcount, payroll }]) => ({
      department,
      headcount,
      payroll,
      averageSalary: payroll / headcount,
    }))
    .sort((a, b) => a.department.localeCompare(b.department));

  const hiresByYear: YearCount[] = Array.from({ length: maxYear - minYear + 1 }, (_, index) => ({
    year: minYear + index,
    count: hiresPerYear.get(minYear + index) ?? 0,
  }));

  return {
    total,
    totalPayroll,
    averageSalary: totalPayroll / total,
    medianSalary: median(salaries.toSorted((a, b) => a - b)),
    averageTenureYears: tenureMs / MS_PER_YEAR / total,
    inactiveCount,
    departments,
    hiresByYear,
    salaryBins: buildSalaryBins(salaries, minSalary, maxSalary),
  };
}