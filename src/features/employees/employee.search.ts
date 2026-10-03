import type { Employee } from "./employee.types";

export function searchEmployees(employees: Employee[], query: string): Employee[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return employees; // same reference, nothing to recompute

  return employees.filter((employee) => {
    const haystack =
      `${employee.id} ${employee.name} ${employee.email} ${employee.role} ${employee.department} ${employee.status}`.toLowerCase();

    // every word must match somewhere: "eng 12" finds Engineering + Employee 12
    return terms.every((term) => haystack.includes(term));
  });
}