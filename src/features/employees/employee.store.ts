import { create } from "zustand";
import { generateEmployees } from "./employee.generator";
import { DEFAULT_FILTERS } from "./employee.filter";
import type {
  Employee,
  EmployeeFilters,
  EmployeeInput,
  SortKey,
  SortState,
} from "./employee.types";

// Next ID = highest existing number + 1 (not length + 1, which can collide once rows can be removed)
function nextEmployeeId(employees: Employee[]): string {
  let max = 0;
  for (const employee of employees) {
    const value = Number(employee.id.replace(/^EMP/, ""));
    if (value > max) max = value;
  }
  return `EMP${String(max + 1).padStart(4, "0")}`;
}

type EmployeeState = {
  employees: Employee[];
  query: string;
  sort: SortState | null;
  filters: EmployeeFilters;
  setQuery: (query: string) => void;
  toggleSort: (key: SortKey) => void;
  clearSort: () => void;
  setFilter: <K extends keyof EmployeeFilters>(key: K, value: EmployeeFilters[K]) => void;
  resetFilters: () => void;
  addEmployee: (input: EmployeeInput) => void;
};

export const useEmployeeStore = create<EmployeeState>()((set) => ({
  employees: generateEmployees(1000),
  query: "",
  sort: null,
  filters: DEFAULT_FILTERS,

  setQuery: (query) => set({ query }),

  toggleSort: (key) =>
    set((state) => {
      const current = state.sort;
      if (!current || current.key !== key) return { sort: { key, direction: "asc" } };
      if (current.direction === "asc") return { sort: { key, direction: "desc" } };
      return { sort: null };
    }),

  clearSort: () => set({ sort: null }),

  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // One atomic update: add the row AND clear the view, so a leftover search,
  // filter or sort can't hide the employee the user just created.
  addEmployee: (input) =>
    set((state) => ({
      employees: [{ ...input, id: nextEmployeeId(state.employees) }, ...state.employees],
      query: "",
      filters: DEFAULT_FILTERS,
      sort: null,
    })),
}));