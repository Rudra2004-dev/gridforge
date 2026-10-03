import { create } from "zustand";
import { generateEmployees } from "./employee.generator";
import { DEFAULT_FILTERS } from "./employee.filter";
import type { Employee, EmployeeFilters, SortKey, SortState } from "./employee.types";

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

  // New object each time so useMemo([filters]) sees the change
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));