import type { Employee, EmployeeFilters, EmployeeStatus } from "./employee.types";

export const STATUS_OPTIONS: readonly EmployeeStatus[] = ["Active", "On Leave", "Inactive"];

export const DEFAULT_FILTERS: EmployeeFilters = {
  status: null,
  department: null,
};

export function countActiveFilters(filters: EmployeeFilters): number {
  return Object.values(filters).filter(Boolean).length;
}

export function filterEmployees(employees: Employee[], filters: EmployeeFilters): Employee[] {
  const { status, department } = filters;

  if (!status && !department) return employees; // same reference, nothing to recompute

  return employees.filter(
    (employee) =>
      (!status || employee.status === status) &&
      (!department || employee.department === department),
  );
}