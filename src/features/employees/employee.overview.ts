import type { Employee, EmployeeStatus } from "./employee.types";

export type DepartmentSummary = {
  department: string;
  count: number;
  averageSalary: number;
};

export type OverviewData = {
  total: number;
  statusCounts: Record<EmployeeStatus, number>;
  averageSalary: number;
  joinedThisYear: number;
  departments: DepartmentSummary[]; // largest first
  recentHires: Employee[]; // newest first
};

const RECENT_HIRES_COUNT = 5;

// `now` is a parameter so the function is deterministic and testable.
export function computeOverview(employees: readonly Employee[], now = new Date()): OverviewData {
  const yearPrefix = `${now.getFullYear()}-`;
  const statusCounts: Record<EmployeeStatus, number> = { Active: 0, "On Leave": 0, Inactive: 0 };
  const byDepartment = new Map<string, { count: number; salaryTotal: number }>();
  let salaryTotal = 0;
  let joinedThisYear = 0;

  // One pass over the data for everything, instead of one .filter() per metric
  for (const employee of employees) {
    statusCounts[employee.status]++;
    salaryTotal += employee.salary;
    if (employee.joiningDate.startsWith(yearPrefix)) joinedThisYear++;

    const entry = byDepartment.get(employee.department) ?? { count: 0, salaryTotal: 0 };
    entry.count++;
    entry.salaryTotal += employee.salary;
    byDepartment.set(employee.department, entry);
  }

  const departments = [...byDepartment]
    .map(([department, { count, salaryTotal: departmentSalary }]) => ({
      department,
      count,
      averageSalary: departmentSalary / count,
    }))
    .sort((a, b) => b.count - a.count || a.department.localeCompare(b.department));

  // ISO dates (YYYY-MM-DD) sort chronologically as plain strings
  const recentHires = employees
    .toSorted((a, b) => b.joiningDate.localeCompare(a.joiningDate))
    .slice(0, RECENT_HIRES_COUNT);

  return {
    total: employees.length,
    statusCounts,
    averageSalary: employees.length === 0 ? 0 : salaryTotal / employees.length,
    joinedThisYear,
    departments,
    recentHires,
  };
}