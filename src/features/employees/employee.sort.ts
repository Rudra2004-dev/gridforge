import type { Employee, SortState } from "./employee.types";

// Created once. Building a collator per comparison would be slow.
// numeric: "EMP2" sorts before "EMP10"; sensitivity: "base" ignores case/accents.
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function sortEmployees(employees: Employee[], sort: SortState | null): Employee[] {
  if (!sort) return employees; // same reference: nothing to recompute downstream

  const { key, direction } = sort;
  const factor = direction === "asc" ? 1 : -1;

  // toSorted returns a copy. Array.prototype.sort would mutate the store's array.
  return employees.toSorted((a, b) => {
    const left = a[key];
    const right = b[key];

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * factor;
    }

    return collator.compare(String(left), String(right)) * factor;
  });
}